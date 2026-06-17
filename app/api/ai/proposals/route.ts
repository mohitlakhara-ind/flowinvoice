import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/ai/proposals — list saved proposals for the authenticated user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const proposals = await prisma.proposal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clientName: true,
      projectName: true,
      tone: true,
      content: true,
      createdAt: true,
    },
  })

  return NextResponse.json(proposals)
}

// DELETE /api/ai/proposals/[id] is not needed here — handled separately if desired
