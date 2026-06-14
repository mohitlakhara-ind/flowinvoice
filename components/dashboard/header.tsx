'use client'

import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function DashboardHeader({ user }: HeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#1e1e2e] bg-[#0d0d14]/50 backdrop-blur-sm flex-shrink-0">
      {/* Left: greeting */}
      <div>
        <p className="text-sm text-slate-400">
          {greeting()},{' '}
          <span className="text-white font-medium">{user.name?.split(' ')[0] ?? 'there'}</span> 👋
        </p>
      </div>

      {/* Right: search + notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-[#2a2a3a] hover:border-[#3a3a50] transition-colors cursor-pointer group">
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400" />
          <span className="text-xs text-slate-500">Search...</span>
          <kbd className="ml-4 text-[10px] text-slate-600 bg-[#1a1a24] px-1.5 py-0.5 rounded border border-[#2a2a3a]">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative w-9 h-9 rounded-xl bg-[#111118] border border-[#2a2a3a] flex items-center justify-center hover:border-[#3a3a50] transition-colors"
        >
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
