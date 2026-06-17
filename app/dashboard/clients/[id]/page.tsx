import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building, MapPin, FileText, FolderKanban, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { clsx } from 'clsx'

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'text-[var(--text-2)] bg-[var(--bg)]0/10 border-slate-500/20' },
  SENT: { label: 'Sent', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  VIEWED: { label: 'Viewed', color: 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20' },
  PAID: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  OVERDUE: { label: 'Overdue', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--text-3)] bg-[var(--bg)]0/5 border-slate-500/10' },
}

const projectStatusColor: Record<string, string> = {
  ACTIVE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  PAUSED: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  COMPLETED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  CANCELLED: 'text-[var(--text-3)] bg-[var(--bg)]0/5 border-slate-500/10',
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: 'Client Details' }
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params

  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, invoiceNumber: true, status: true, total: true, dueDate: true, currency: true },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, status: true, hourlyRate: true, fixedBudget: true },
      },
    },
  })

  if (!client) notFound()

  const totalBilled = client.invoices.reduce((sum, i) => sum + Number(i.total), 0)
  const totalPaid = client.invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + Number(i.total), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/clients" className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--text-1)] font-bold">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-1)]">{client.name}</h1>
          </div>
          {client.company && <p className="text-[var(--text-2)] text-sm ml-[52px]">{client.company}</p>}
        </div>
        <Link href={`/dashboard/invoices/new?clientId=${client.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all hover:scale-105">
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Billed', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: client.currency, maximumFractionDigits: 0 }).format(totalBilled) },
          { label: 'Total Paid', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: client.currency, maximumFractionDigits: 0 }).format(totalPaid) },
          { label: 'Outstanding', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: client.currency, maximumFractionDigits: 0 }).format(totalBilled - totalPaid) },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] mb-1">{s.label}</p>
            <p className="text-lg font-bold text-[var(--text-1)]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contact info */}
        <div className="glass rounded-2xl p-5 border border-[var(--border)] space-y-3">
          <h2 className="font-semibold text-[var(--text-1)] text-sm mb-4">Contact Info</h2>
          {[
            { icon: Mail, value: client.email },
            { icon: Phone, value: client.phone },
            { icon: Building, value: client.company },
            { icon: MapPin, value: client.address },
          ].map(({ icon: Icon, value }) => value ? (
            <div key={value} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <Icon className="w-3.5 h-3.5 text-[var(--text-3)] flex-shrink-0" />
              <span className="truncate">{value}</span>
            </div>
          ) : null)}
          {client.notes && (
            <div className="pt-3 border-t border-[#1e1e2e]">
              <p className="text-xs text-[var(--text-3)] mb-1">Notes</p>
              <p className="text-sm text-[var(--text-2)]">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e2e]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--text-3)]" />
                <h2 className="font-semibold text-[var(--text-1)] text-sm">Invoices</h2>
              </div>
            </div>
            {client.invoices.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-3)] text-sm">No invoices yet</div>
            ) : (
              <div className="divide-y divide-[#1e1e2e]">
                {client.invoices.map((inv) => {
                  const s = statusConfig[inv.status]
                  return (
                    <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface)]/[0.02] transition-colors group">
                      <div>
                        <p className="text-sm font-mono text-indigo-300">{inv.invoiceNumber}</p>
                        <p className="text-xs text-[var(--text-3)] mt-0.5">Due {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-[var(--text-1)]">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: inv.currency, maximumFractionDigits: 0 }).format(Number(inv.total))}
                        </p>
                        <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-lg border', s?.color)}>{s?.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Projects */}
          {client.projects.length > 0 && (
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e1e2e]">
                <FolderKanban className="w-4 h-4 text-[var(--text-3)]" />
                <h2 className="font-semibold text-[var(--text-1)] text-sm">Projects</h2>
              </div>
              <div className="divide-y divide-[#1e1e2e]">
                {client.projects.map((proj) => (
                  <div key={proj.id} className="flex items-center justify-between px-5 py-3">
                    <p className="text-sm text-[var(--text-1)]">{proj.name}</p>
                    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-lg border', projectStatusColor[proj.status])}>
                      {proj.status.charAt(0) + proj.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
