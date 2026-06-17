import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FolderKanban, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { clsx } from 'clsx'

export const metadata: Metadata = { title: 'Projects' }

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  PAUSED: { label: 'Paused', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  COMPLETED: { label: 'Completed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--text-3)] bg-[var(--bg)]0/5 border-slate-500/10' },
}

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      client: { select: { name: true } },
      _count: { select: { timeLogs: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const grouped = {
    ACTIVE: projects.filter((p) => p.status === 'ACTIVE'),
    PAUSED: projects.filter((p) => p.status === 'PAUSED'),
    COMPLETED: projects.filter((p) => p.status === 'COMPLETED'),
    CANCELLED: projects.filter((p) => p.status === 'CANCELLED'),
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">Projects</h1>
          <p className="text-[var(--text-2)] text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/projects/new" id="new-project-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all hover:scale-105">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(grouped).map(([status, items]) => {
          const cfg = statusConfig[status]
          return (
            <div key={status} className="glass rounded-xl p-4 border border-[var(--border)]">
              <p className="text-xs text-[var(--text-3)] mb-1">{cfg.label}</p>
              <p className="text-2xl font-bold text-[var(--text-1)]">{items.length}</p>
            </div>
          )
        })}
      </div>

      {projects.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-[var(--text-3)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] mb-2">No projects yet</h3>
          <p className="text-sm text-[var(--text-2)] mb-6">Create a project to track time and bill clients.</p>
          <Link href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> Create Project
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Project', 'Client', 'Budget', 'Time Logs', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-[var(--text-3)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {projects.map((project) => {
                const s = statusConfig[project.status]
                const budget = project.fixedBudget
                  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(project.fixedBudget))
                  : project.hourlyRate
                    ? `₹${Number(project.hourlyRate)}/hr`
                    : '—'
                return (
                  <tr key={project.id} className="hover:bg-[var(--surface)]/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[var(--text-1)]">{project.name}</p>
                      {project.description && <p className="text-xs text-[var(--text-3)] mt-0.5 truncate max-w-[200px]">{project.description}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)]">{project.client.name}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)]">{budget}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)]">{project._count.timeLogs} log{project._count.timeLogs !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4">
                      <span className={clsx('inline-flex text-xs font-medium px-2 py-1 rounded-lg border', s?.color)}>{s?.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/invoices/new?projectId=${project.id}`}
                        className="text-xs text-[var(--text-3)] hover:text-[var(--primary)] transition-colors opacity-0 group-hover:opacity-100">
                        Invoice →
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
