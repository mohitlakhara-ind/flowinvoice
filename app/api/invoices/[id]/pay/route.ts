import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/invoices/:id/pay — create a Razorpay order for an invoice
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Fetch invoice and verify ownership
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { payment: true },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (invoice.payment?.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 })
  }

  // Dynamically import Razorpay (only available after install)
  const Razorpay = (await import('razorpay')).default

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(Number(invoice.total) * 100)

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: invoice.currency,
    receipt: invoice.invoiceNumber,
    notes: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
    },
  })

  // Create or update Payment record
  await prisma.payment.upsert({
    where: { invoiceId: invoice.id },
    create: {
      invoiceId: invoice.id,
      amount: invoice.total,
      currency: invoice.currency,
      status: 'PENDING',
      razorpayOrderId: order.id,
    },
    update: {
      razorpayOrderId: order.id,
      status: 'PENDING',
    },
  })

  return NextResponse.json({
    orderId: order.id,
    amount: amountInPaise,
    currency: invoice.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    invoiceNumber: invoice.invoiceNumber,
  })
}

// POST /api/webhooks/razorpay — handle payment success/failure webhooks
export async function handleWebhook(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity

    // Idempotent: only update if not already completed
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId: payment.order_id },
    })

    if (existingPayment && existingPayment.status !== 'COMPLETED') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'COMPLETED',
            razorpayPaymentId: payment.id,
            razorpaySignature: signature,
            paidAt: new Date(),
          },
        }),
        prisma.invoice.update({
          where: { id: existingPayment.invoiceId },
          data: { status: 'PAID' },
        }),
      ])
    }
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity

    await prisma.payment.updateMany({
      where: { razorpayOrderId: payment.order_id, status: 'PENDING' },
      data: {
        status: 'FAILED',
        failureReason: payment.error_description ?? 'Payment failed',
      },
    })
  }

  return NextResponse.json({ received: true })
}
