import Link from 'next/link'
import { clsx } from 'clsx'
import { ArrowRight } from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  total: { toString(): string } | number
  issueDate: Date
  client: { name: string }
}

interface RecentInvoicesProps {
  invoices: Invoice[]
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: 'Draft', color: 'text-[var(--text-2)] bg-[var(--bg)]0/10', dot: 'bg-slate-400' },
  SENT: { label: 'Sent', color: 'text-blue-400 bg-blue-500/10', dot: 'bg-blue-400' },
  VIEWED: { label: 'Viewed', color: 'text-[var(--primary)] bg-[var(--primary)]/10', dot: 'bg-indigo-400' },
  PAID: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10', dot: 'bg-emerald-400' },
  OVERDUE: { label: 'Overdue', color: 'text-red-400 bg-red-500/10', dot: 'bg-red-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--text-3)] bg-[var(--bg)]0/5', dot: 'bg-[var(--bg)]0' },
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <div className="glass rounded-2xl border border-[var(--border)] h-full flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="font-semibold text-[var(--text-1)]">Recent Invoices</h3>
          <p className="text-xs text-[var(--text-3)] mt-0.5">Latest activity</p>
        </div>
        <Link
          href="/dashboard/invoices"
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:text-indigo-300 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 px-4 pb-4 space-y-2">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm text-[var(--text-2)] font-medium">No invoices yet</p>
            <p className="text-xs text-[var(--text-3)] mt-1">Create your first invoice to get started</p>
            <Link
              href="/dashboard/invoices/new"
              className="mt-4 px-4 py-2 text-xs font-medium bg-[var(--primary)]/20 text-indigo-300 rounded-lg hover:bg-[var(--primary)]/30 transition-colors border border-[var(--primary)]/20"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          invoices.map((invoice) => {
            const status = statusConfig[invoice.status] ?? statusConfig.DRAFT
            const amount = Number(invoice.total)

            return (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
              >
                {/* Status dot */}
                <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', status.dot)} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-1)] truncate">{invoice.client.name}</p>
                  <p className="text-[10px] text-[var(--text-3)]">{invoice.invoiceNumber}</p>
                </div>

                {/* Amount + Status */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-[var(--text-1)]">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)}
                  </p>
                  <span className={clsx('inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-md mt-0.5', status.color)}>
                    {status.label}
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
