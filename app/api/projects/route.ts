import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).default('ACTIVE'),
  hourlyRate: z.number().nonnegative().optional(),
  fixedBudget: z.number().nonnegative().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
})

// GET /api/projects
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      client: { select: { name: true } },
      _count: { select: { timeLogs: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

// POST /api/projects
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues?.[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  const { startDate, dueDate, ...rest } = parsed.data

  const project = await prisma.project.create({
    data: {
      ...rest,
      userId: session.user.id,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
    include: { client: { select: { name: true } } },
  })
  return NextResponse.json(project, { status: 201 })
}
