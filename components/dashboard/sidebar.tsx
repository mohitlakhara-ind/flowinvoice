'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Users, FolderKanban, FileText, Clock, CreditCard,
  Zap, LogOut, Settings, Bot, X
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/time-logs', icon: Clock, label: 'Time Logs' },
  { href: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { href: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
  { href: '/dashboard/ai', icon: Bot, label: 'AI Tools', badge: 'NEW' },
]

interface SidebarProps {
  user: {
    id?: string | null
    name?: string | null
    email?: string | null
    image?: string | null
  }
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <aside className="w-64 h-full flex flex-col bg-[var(--surface)] border-r border-[var(--border)] flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--text-1)] text-sm tracking-tight">Soloflow</span>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-all"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="mb-2 px-3 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-2)]">Menu</p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)]'
              )}
            >
              <Icon
                className={clsx(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-[var(--primary)]' : 'text-[var(--text-3)] group-hover:text-[var(--text-1)]'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[var(--primary)]/30 text-[var(--primary)] border border-[var(--primary)]/20">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-[var(--border)] space-y-0.5">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-all group"
        >
          <Settings className="w-4 h-4 text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors" />
          Settings
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="w-4 h-4 text-[var(--text-3)] group-hover:text-red-400 transition-colors" />
          Sign out
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-1)] truncate">{user.name ?? 'User'}</p>
            <p className="text-[10px] text-[var(--text-3)] truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* ── Desktop sidebar: always visible ─────────────────────────── */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={clsx(
          'md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={clsx(
          'md:hidden fixed inset-y-0 left-0 z-50 flex h-full transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
