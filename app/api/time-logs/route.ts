import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const timeLogSchema = z.object({
  projectId: z.string().min(1),
  description: z.string().min(1),
  hours: z.number().positive().max(24),
  date: z.string(),
  billable: z.boolean().default(true),
})

// GET /api/time-logs
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const logs = await prisma.timeLog.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: { select: { id: true, name: true, client: { select: { name: true } } } } },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(logs)
}

// POST /api/time-logs
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = timeLogSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues?.[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  // Verify project belongs to user
  const project = await prisma.project.findFirst({
    where: { id: parsed.data.projectId, userId: session.user.id },
  })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const log = await prisma.timeLog.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
    include: { project: { select: { name: true } } },
  })
  return NextResponse.json(log, { status: 201 })
}
