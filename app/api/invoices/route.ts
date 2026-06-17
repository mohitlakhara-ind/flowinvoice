import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
})

const invoiceSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  invoiceNumber: z.string().min(1),
  issueDate: z.string(),
  dueDate: z.string(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).default('INR'),
  taxRate: z.number().min(0).max(100).default(0),
  discountAmount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
})

// GET /api/invoices
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: {
      client: { select: { name: true, email: true } },
      payment: { select: { status: true, paidAt: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(invoices)
}

// POST /api/invoices
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = invoiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues?.[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  const { items, taxRate, discountAmount, issueDate, dueDate, ...rest } = parsed.data

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discountAmount

  const invoice = await prisma.invoice.create({
    data: {
      ...rest,
      userId: session.user.id,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      taxRate,
      taxAmount,
      discountAmount,
      subtotal,
      total,
      items: {
        create: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      },
    },
    include: { items: true, client: true },
  })

  return NextResponse.json(invoice, { status: 201 })
}
