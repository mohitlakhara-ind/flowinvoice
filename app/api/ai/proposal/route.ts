import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { OpenAI } from 'openai'
import { z } from 'zod'


const proposalSchema = z.object({
  clientName: z.string().min(1),
  projectName: z.string().min(1),
  projectScope: z.string().min(10),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'assertive']).default('professional'),
})


const toneInstructions = {
  professional: 'Use formal, polished business language. Be concise and confident.',
  friendly: 'Use warm, approachable language. Build rapport while being clear about deliverables.',
  assertive: 'Use direct, confident language. Clearly state value and expertise. Avoid hedging.',
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user!.id
  const userName = session.user?.name ?? 'the developer'

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' })

  const body = await req.json()
  const parsed = proposalSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues?.[0]?.message || 'Validation error' },
      { status: 400 }
    )
  }

  const { clientName, projectName, projectScope, budget, timeline, tone } = parsed.data

  const systemPrompt = `You are an expert freelance project proposal writer. ${toneInstructions[tone]}
Write a compelling project proposal that:
1. Opens with a brief understanding of the client's needs
2. Clearly outlines your proposed approach and deliverables
3. Highlights relevant expertise and why you're the right fit
4. Includes scope, timeline, and pricing sections if provided
5. Closes with a clear call to action

Format the proposal with proper sections using markdown. Keep it under 400 words.`

  const userPrompt = `Write a project proposal for:
- Client: ${clientName}
- Project: ${projectName}
- Scope: ${projectScope}
${budget ? `- Budget: ${budget}` : ''}
${timeline ? `- Timeline: ${timeline}` : ''}

The freelancer's name is ${userName}.`

  // Use streaming for better UX
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 800,
    temperature: 0.7,
    stream: true,
  })

  // Return as a ReadableStream for SSE, and persist to DB when complete
  const encoder = new TextEncoder()
  let fullText = ''

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) {
          fullText += text
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()

      // Persist the completed proposal to the database
      if (fullText) {
        try {
          await prisma.proposal.create({
            data: {
              userId,
              clientName,
              projectName,
              projectScope,
              budget: budget ?? null,
              timeline: timeline ?? null,
              tone,
              content: fullText,
            },
          })
        } catch (err) {
          console.error('[proposal] Failed to save to DB:', err)
        }
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
