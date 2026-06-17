'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react'

interface LandingProfileDropdownProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function LandingProfileDropdown({ user }: LandingProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">
          {user.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <span className="text-sm font-medium text-[var(--text-1)] hidden sm:block">
          {user.name?.split(' ')[0] ?? 'Profile'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl overflow-hidden py-1 z-50 animate-fade-in-up">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text-1)] truncate">{user.name ?? 'User'}</p>
            <p className="text-xs text-[var(--text-3)] truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" /> My Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
          <div className="py-1 border-t border-[var(--border)]">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
