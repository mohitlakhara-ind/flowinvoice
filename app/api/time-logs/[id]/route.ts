import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const patchSchema = z.object({
  description: z.string().min(1).optional(),
  hours: z.number().positive().max(24).optional(),
  date: z.string().optional(),
  billable: z.boolean().optional(),
  invoiced: z.boolean().optional(),
})

// PATCH /api/time-logs/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.timeLog.findFirst({
    where: { id, project: { userId: session.user.id } },
  })
  if (!existing) return NextResponse.json({ error: 'Time log not found' }, { status: 404 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues?.[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  const data: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.date) data.date = new Date(parsed.data.date)

  const updated = await prisma.timeLog.update({ where: { id }, data })
  return NextResponse.json(updated)
}

// DELETE /api/time-logs/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.timeLog.findFirst({
    where: { id, project: { userId: session.user.id } },
  })
  if (!existing) return NextResponse.json({ error: 'Time log not found' }, { status: 404 })

  await prisma.timeLog.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
