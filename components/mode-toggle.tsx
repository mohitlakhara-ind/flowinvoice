'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ModeToggle() {
  const [mode, setMode] = useState<'dark' | 'light' | null>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('mode') as 'dark' | 'light' | null
    setMode(savedMode || 'dark')
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
    localStorage.setItem('mode', newMode)
    document.documentElement.setAttribute('data-mode', newMode)
  }

  // Prevent hydration mismatch by not rendering anything until mounted
  if (mode === null) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggleMode}
      className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-hov)] transition-colors"
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {mode === 'dark' ? (
        <Sun className="w-4 h-4 text-[var(--text-2)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--text-2)]" />
      )}
    </button>
  )
}
