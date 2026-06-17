'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full glass rounded-3xl p-10 border border-[var(--border)] text-center relative z-10 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-inner">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-[var(--text-1)] mb-3">Something went wrong</h1>
        <p className="text-[var(--text-2)] mb-8 text-sm">
          An unexpected error occurred. We've been notified and are looking into it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-[var(--primary)]/20 flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-1)] font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
