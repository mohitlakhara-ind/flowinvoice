import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react'
import type { Metadata } from 'next'
import { clsx } from 'clsx'
import InvoiceActions from './invoice-actions'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-[var(--text-2)]', bg: 'bg-[var(--bg)]0/10 border-slate-500/20' },
  SENT: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  VIEWED: { label: 'Viewed', color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/10 border-[var(--primary)]/20' },
  PAID: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  OVERDUE: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--text-3)]', bg: 'bg-[var(--bg)]0/5 border-slate-500/10' },
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: 'Invoice Details' }
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      project: { select: { id: true, name: true } },
      items: true,
      payment: true,
    },
  })

  if (!invoice) notFound()

  const status = statusConfig[invoice.status]
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: invoice.currency, maximumFractionDigits: 2 }).format(n)
  const isOverdue = invoice.status !== 'PAID' && new Date(invoice.dueDate) < new Date()

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices" className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[var(--text-1)] font-mono">{invoice.invoiceNumber}</h1>
              <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-lg border', status.bg, status.color)}>
                {status.label}
              </span>
              {isOverdue && invoice.status !== 'PAID' && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400">
                  Overdue
                </span>
              )}
            </div>
            <p className="text-[var(--text-2)] text-sm mt-0.5">
              {invoice.client.name} · Due {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <InvoiceActions invoice={{ id: invoice.id, status: invoice.status }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice body */}
        <div className="lg:col-span-2 space-y-5">
          {/* Client & dates */}
          <div className="glass rounded-2xl p-6 border border-[var(--border)]">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-2">Bill To</p>
                <p className="font-semibold text-[var(--text-1)]">{invoice.client.name}</p>
                {invoice.client.company && <p className="text-sm text-[var(--text-2)]">{invoice.client.company}</p>}
                <p className="text-sm text-[var(--text-2)]">{invoice.client.email}</p>
                {invoice.client.address && <p className="text-sm text-[var(--text-2)]">{invoice.client.address}</p>}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-sm text-[var(--text-1)]">{new Date(invoice.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-1">Due Date</p>
                  <p className={clsx('text-sm', isOverdue && invoice.status !== 'PAID' ? 'text-red-400 font-medium' : 'text-[var(--text-1)]')}>
                    {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {invoice.project && (
                  <div>
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-1">Project</p>
                    <p className="text-sm text-[var(--text-1)]">{invoice.project.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  {['Description', 'Qty', 'Unit Price', 'Total'].map((h) => (
                    <th key={h} className={clsx('px-5 py-3.5 text-xs font-medium text-[var(--text-3)] uppercase tracking-wider', h !== 'Description' ? 'text-right' : 'text-left')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 text-sm text-[var(--text-1)]">{item.description}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)] text-right">{Number(item.quantity)}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)] text-right">{fmt(Number(item.unitPrice))}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--text-1)] text-right">{fmt(Number(item.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-[#1e1e2e] px-5 py-4">
              <div className="flex justify-end">
                <div className="w-56 space-y-2">
                  <div className="flex justify-between text-sm text-[var(--text-2)]">
                    <span>Subtotal</span><span>{fmt(Number(invoice.subtotal))}</span>
                  </div>
                  {Number(invoice.taxRate) > 0 && (
                    <div className="flex justify-between text-sm text-[var(--text-2)]">
                      <span>GST ({Number(invoice.taxRate)}%)</span><span>{fmt(Number(invoice.taxAmount))}</span>
                    </div>
                  )}
                  {Number(invoice.discountAmount) > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span><span>–{fmt(Number(invoice.discountAmount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[var(--text-1)] pt-2 border-t border-[var(--border)]">
                    <span>Total</span><span className="text-indigo-300">{fmt(Number(invoice.total))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-3">
              {invoice.notes && (
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-[var(--text-2)]">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-1">Payment Terms</p>
                  <p className="text-sm text-[var(--text-2)]">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: status & payment */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-3">Amount Due</p>
            <p className="text-3xl font-bold text-[var(--text-1)]">{fmt(Number(invoice.total))}</p>
            <p className="text-xs text-[var(--text-3)] mt-1">{invoice.currency}</p>
          </div>

          {invoice.payment && (
            <div className="glass rounded-2xl p-5 border border-[var(--border)]">
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wider mb-3">Payment</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-2)]">Status</span>
                  <span className={clsx('font-medium', invoice.payment.status === 'COMPLETED' ? 'text-emerald-400' : invoice.payment.status === 'FAILED' ? 'text-red-400' : 'text-amber-400')}>
                    {invoice.payment.status.charAt(0) + invoice.payment.status.slice(1).toLowerCase()}
                  </span>
                </div>
                {invoice.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-2)]">Paid on</span>
                    <span className="text-[var(--text-1)]">{new Date(invoice.payment.paidAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {invoice.payment.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-2)]">Payment ID</span>
                    <span className="text-[var(--text-1)] font-mono text-xs truncate max-w-[120px]">{invoice.payment.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
