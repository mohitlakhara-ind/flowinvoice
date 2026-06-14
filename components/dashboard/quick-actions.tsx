import Link from 'next/link'
import { Plus, Users, FileText, Clock, Bot } from 'lucide-react'

const actions = [
  {
    href: '/dashboard/invoices/new',
    icon: FileText,
    label: 'New Invoice',
    description: 'Create & send',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 hover:border-indigo-500/40',
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
    bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/40',
  },
  {
    href: '/dashboard/ai',
    icon: Bot,
    label: 'AI Proposal',
    description: 'Draft with GPT-4o',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 hover:border-purple-500/40',
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
              <p className="text-sm font-semibold text-white truncate">{action.label}</p>
              <p className="text-xs text-slate-500 truncate">{action.description}</p>
            </div>
            <Plus className={`w-3.5 h-3.5 ${action.color} ml-auto flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
          </Link>
        )
      })}
    </div>
  )
}
