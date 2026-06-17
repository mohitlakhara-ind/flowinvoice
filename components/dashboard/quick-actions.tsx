import Link from 'next/link'
import { Plus, Users, FileText, Clock, Bot } from 'lucide-react'

const actions = [
  {
    href: '/dashboard/invoices/new',
    icon: FileText,
    label: 'New Invoice',
    description: 'Create & send',
    color: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border-[var(--primary)]/20 hover:border-[var(--primary)]/40',
  },
  {
    href: '/dashboard/clients/new',
    icon: Users,
    label: 'Add Client',
    description: 'New client',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20 hover:border-cyan-500/40',
  },
  {
    href: '/dashboard/time-logs/new',
    icon: Clock,
    label: 'Log Time',
    description: 'Track hours',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 hover:bg-[var(--border)]mber-500/20 border-amber-500/20 hover:border-amber-500/40',
  },
  {
    href: '/dashboard/ai',
    icon: Bot,
    label: 'AI Proposal',
    description: 'Draft with GPT-4o',
    color: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border-[var(--primary)]/20 hover:border-[var(--primary)]/40',
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] group ${action.bg}`}
          >
            <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Icon className={`w-4 h-4 ${action.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-1)] truncate">{action.label}</p>
              <p className="text-xs text-[var(--text-3)] truncate">{action.description}</p>
            </div>
            <Plus className={`w-3.5 h-3.5 ${action.color} ml-auto flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
          </Link>
        )
      })}
    </div>
  )
}
