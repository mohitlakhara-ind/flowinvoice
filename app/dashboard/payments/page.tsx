import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import { clsx } from 'clsx'

export const metadata: Metadata = { title: 'Payments' }

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  PROCESSING: { label: 'Processing', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  FAILED: { label: 'Failed', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  REFUNDED: { label: 'Refunded', color: 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20' },
}

export default async function PaymentsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const payments = await prisma.payment.findMany({
    where: { invoice: { userId: session.user.id } },
    include: {
      invoice: {
        select: { id: true, invoiceNumber: true, currency: true, client: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalCompleted = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-1)]">Payments</h1>
        <p className="text-[var(--text-2)] text-sm mt-1">{payments.length} payment{payments.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Received', value: `₹${(totalCompleted / 1000).toFixed(1)}K`, highlight: true },
          { label: 'Pending', value: `₹${(totalPending / 1000).toFixed(1)}K`, highlight: false },
          { label: 'Transactions', value: payments.length.toString(), highlight: false },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] mb-1">{s.label}</p>
            <p className={clsx('text-2xl font-bold', s.highlight ? 'text-emerald-400' : 'text-[var(--text-1)]')}>{s.value}</p>
          </div>
        ))}
      </div>

      {payments.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-[var(--text-3)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] mb-2">No payments yet</h3>
          <p className="text-sm text-[var(--text-2)] mb-6">Payments will appear here once clients pay their invoices.</p>
          <Link href="/dashboard/invoices/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all">
            Create Invoice
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Invoice', 'Client', 'Amount', 'Status', 'Paid On', 'Razorpay ID'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-[var(--text-3)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {payments.map((payment) => {
                const s = paymentStatusConfig[payment.status]
                const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: payment.invoice.currency, maximumFractionDigits: 0 }).format(n)
                return (
                  <tr key={payment.id} className="hover:bg-[var(--surface)]/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/invoices/${payment.invoice.id}`}
                        className="text-sm font-mono text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {payment.invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-1)]">{payment.invoice.client.name}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--text-1)]">{fmt(Number(payment.amount))}</td>
                    <td className="px-5 py-4">
                      <span className={clsx('text-xs font-medium px-2 py-1 rounded-lg border', s?.color)}>{s?.label}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)]">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-[var(--text-3)] truncate max-w-[140px]">
                      {payment.razorpayPaymentId ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
