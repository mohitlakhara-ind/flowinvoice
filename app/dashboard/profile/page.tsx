import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, Mail, User, Clock, FileText, FolderKanban } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Fetch some quick stats for the profile
  const [projectsCount, invoicesCount, timeLogsCount] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id } }),
    prisma.invoice.count({ where: { userId: session.user.id } }),
    prisma.timeLog.count({ where: { project: { userId: session.user.id } } })
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="relative glass rounded-3xl overflow-hidden border border-[var(--border)]">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[var(--primary)] to-cyan-500 opacity-80" />
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--bg)] bg-[var(--surface-2)] flex items-center justify-center shadow-xl text-4xl font-bold text-[var(--primary)] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: session.user.image ? `url(${session.user.image})` : 'none' }}>
              {!session.user.image && (session.user.name?.charAt(0).toUpperCase() ?? 'U')}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[var(--text-1)] tracking-tight">{session.user.name}</h1>
              <p className="text-[var(--text-2)] flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" /> {session.user.email}
              </p>
            </div>
            <Link href="/dashboard/settings" className="px-5 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-1)] font-medium text-sm transition-all flex items-center gap-2 shadow-sm">
              <Settings className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-[var(--border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider mb-1">Projects</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{projectsCount}</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-[var(--border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider mb-1">Invoices</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{invoicesCount}</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-[var(--border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider mb-1">Time Logs</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{timeLogsCount}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
