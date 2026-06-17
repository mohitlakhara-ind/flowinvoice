import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, Filter } from 'lucide-react'
import { clsx } from 'clsx'

export const metadata: Metadata = { title: 'Invoices' }

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'text-[var(--text-2)] bg-[var(--bg)]0/10 border-slate-500/20' },
  SENT: { label: 'Sent', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  VIEWED: { label: 'Viewed', color: 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20' },
  PAID: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  OVERDUE: { label: 'Overdue', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--text-3)] bg-[var(--bg)]0/5 border-slate-500/10' },
}

export default async function InvoicesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: {
      client: { select: { name: true } },
      payment: { select: { status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.total), 0)

  const totalPending = invoices
    .filter((i) => ['SENT', 'VIEWED'].includes(i.status))
    .reduce((sum, i) => sum + Number(i.total), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">Invoices</h1>
          <p className="text-[var(--text-2)] text-sm mt-1">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="filter-invoices-btn"
            className="flex items-center gap-2 px-3 py-2.5 glass glass-hover rounded-xl text-sm text-[var(--text-2)] border border-[var(--border)] transition-all"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link
            href="/dashboard/invoices/new"
            id="create-invoice-btn"
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: invoices.length, unit: '' },
          { label: 'Paid', value: `₹${(totalPaid / 1000).toFixed(0)}K`, unit: '' },
          { label: 'Pending', value: `₹${(totalPending / 1000).toFixed(0)}K`, unit: '' },
          { label: 'Overdue', value: invoices.filter((i) => i.status === 'OVERDUE').length, unit: '' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] mb-1">{s.label}</p>
            <p className="text-lg font-bold text-[var(--text-1)]">{s.value}{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {invoices.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[var(--text-3)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] mb-2">No invoices yet</h3>
          <p className="text-sm text-[var(--text-2)] mb-6">Create your first invoice and start getting paid.</p>
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Invoice #', 'Client', 'Date', 'Due', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-[var(--text-3)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status]
                const isOverdue = invoice.status !== 'PAID' && new Date(invoice.dueDate) < new Date()
                return (
                  <tr key={invoice.id} className="hover:bg-[var(--surface)]/[0.02] transition-colors group">
                    <td className="px-5 py-4 text-sm font-mono text-indigo-300">{invoice.invoiceNumber}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-1)] font-medium">{invoice.client.name}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)]">
                      {new Date(invoice.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className={clsx('px-5 py-4 text-sm', isOverdue && invoice.status !== 'PAID' ? 'text-red-400' : 'text-[var(--text-2)]')}>
                      {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--text-1)]">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: invoice.currency, maximumFractionDigits: 0 }).format(Number(invoice.total))}
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx('inline-flex text-xs font-medium px-2 py-1 rounded-lg border', status?.color)}>
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-xs text-[var(--text-3)] hover:text-[var(--primary)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        View →
                      </Link>
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
