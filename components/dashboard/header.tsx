'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Palette, ChevronDown, User, LogOut, Menu, X,
  LayoutDashboard, Users, FolderKanban, FileText, Clock,
  CreditCard, Bot, Settings, Plus, Command
} from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ModeToggle } from '@/components/mode-toggle'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onMenuClick: () => void
}

const THEMES = [
  { id: 'indigo', name: 'Indigo (Default)', color: '#4f46e5' },
  { id: 'purple', name: 'Royal Purple', color: '#a855f7' },
  { id: 'emerald', name: 'Emerald', color: '#10b981' },
  { id: 'rose', name: 'Rose', color: '#f43f5e' },
  { id: 'amber', name: 'Amber', color: '#f59e0b' },
]

// All searchable items in the app
const SEARCH_ITEMS = [
  { label: 'Overview', description: 'Dashboard home', icon: LayoutDashboard, href: '/dashboard', keywords: ['home', 'overview', 'dashboard'] },
  { label: 'Clients', description: 'Manage your clients', icon: Users, href: '/dashboard/clients', keywords: ['clients', 'customer', 'contact'] },
  { label: 'Add Client', description: 'Create a new client', icon: Plus, href: '/dashboard/clients/new', keywords: ['add client', 'new client', 'create client'] },
  { label: 'Projects', description: 'Track your projects', icon: FolderKanban, href: '/dashboard/projects', keywords: ['projects', 'work', 'tasks'] },
  { label: 'Invoices', description: 'View all invoices', icon: FileText, href: '/dashboard/invoices', keywords: ['invoices', 'billing', 'payment'] },
  { label: 'New Invoice', description: 'Create a new invoice', icon: Plus, href: '/dashboard/invoices/new', keywords: ['new invoice', 'create invoice', 'bill'] },
  { label: 'Time Logs', description: 'Track billable hours', icon: Clock, href: '/dashboard/time-logs', keywords: ['time', 'hours', 'logs', 'tracking'] },
  { label: 'Payments', description: 'View payment history', icon: CreditCard, href: '/dashboard/payments', keywords: ['payments', 'transactions', 'razorpay'] },
  { label: 'AI Tools', description: 'Generate proposals with GPT-4o', icon: Bot, href: '/dashboard/ai', keywords: ['ai', 'proposal', 'gpt', 'generate'] },
  { label: 'Settings', description: 'Account & preferences', icon: Settings, href: '/dashboard/settings', keywords: ['settings', 'preferences', 'account'] },
  { label: 'Profile', description: 'Your profile details', icon: User, href: '/dashboard/profile', keywords: ['profile', 'avatar', 'name'] },
]

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query.trim() === ''
    ? SEARCH_ITEMS
    : SEARCH_ITEMS.filter(item => {
        const q = query.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some(k => k.includes(q))
        )
      })

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSelect = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette panel */}
      <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--text-3)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder-[var(--text-3)] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] text-[var(--text-3)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--border)]">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-3)]">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {query === '' && (
                <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">
                  Quick Navigation
                </p>
              )}
              {filtered.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-2)] transition-colors group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] group-hover:bg-[var(--primary)]/10 border border-[var(--border)] flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[var(--text-2)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-1)] truncate">{item.label}</p>
                      <p className="text-xs text-[var(--text-3)] truncate">{item.description}</p>
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] flex items-center gap-3 text-[10px] text-[var(--text-3)]">
          <span className="flex items-center gap-1"><kbd className="bg-[var(--surface-2)] border border-[var(--border)] px-1 py-0.5 rounded">↵</kbd> to select</span>
          <span className="flex items-center gap-1"><kbd className="bg-[var(--surface-2)] border border-[var(--border)] px-1 py-0.5 rounded">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardHeader({ user, onMenuClick }: HeaderProps) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('indigo')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'indigo'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleThemeChange = (id: string) => {
    setCurrentTheme(id)
    localStorage.setItem('theme', id)
    document.documentElement.setAttribute('data-theme', id)
    setThemeDropdownOpen(false)
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <>
      <CommandPalette open={searchOpen} onClose={closeSearch} />

      <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md flex-shrink-0 z-40 relative">
        {/* Left: hamburger (mobile) + greeting */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            id="mobile-menu-btn"
            className="md:hidden w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--border-hov)] transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 text-[var(--text-2)]" />
          </button>
          <p className="text-sm text-[var(--text-2)] hidden sm:block">
            {greeting()},{' '}
            <span className="text-[var(--text-1)] font-medium">{user.name?.split(' ')[0] ?? 'there'}</span> 👋
          </p>
          {/* Compact greeting on xs screens */}
          <p className="text-sm font-medium text-[var(--text-1)] sm:hidden">
            {user.name?.split(' ')[0] ?? 'Soloflow'}
          </p>
        </div>

        {/* Right: search + theme + profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            id="search-btn"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-hov)] transition-colors cursor-pointer group"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-3)] group-hover:text-[var(--text-2)]" />
            <span className="text-xs text-[var(--text-3)]">Search...</span>
            <kbd className="ml-4 text-[10px] text-[var(--text-2)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)] flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Mobile search icon only */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--border-hov)] transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-[var(--text-2)]" />
          </button>

          {/* Mode Toggle */}
          <ModeToggle />

          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-hov)] transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--text-2)]" />
              <span className="text-xs text-[var(--text-2)] font-medium hidden sm:block">Theme</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-3)]" />
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl overflow-hidden py-1 z-50 animate-fade-in-up">
                <div className="px-3 py-2 text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider border-b border-[var(--border)] mb-1">
                  Color Theme
                </div>
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-[var(--surface-2)] transition-colors ${currentTheme === theme.id ? 'bg-[var(--surface-2)]' : ''}`}
                  >
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: theme.color }} />
                    <span className={currentTheme === theme.id ? 'text-[var(--text-1)] font-medium' : 'text-[var(--text-2)]'}>
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
            >
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl overflow-hidden py-1 z-50 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--text-1)] truncate">{user.name ?? 'User'}</p>
                  <p className="text-xs text-[var(--text-3)] truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" /> Profile & Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-[var(--border)]">
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
