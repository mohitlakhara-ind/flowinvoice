'use client'

import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full glass rounded-3xl p-10 border border-[var(--border)] text-center relative z-10 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)] shadow-inner">
          <FileQuestion className="w-10 h-10 text-[var(--primary)]" />
        </div>
        
        <h1 className="text-6xl font-black text-[var(--text-1)] mb-4 tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-3">Page Not Found</h2>
        <p className="text-[var(--text-2)] mb-8 text-sm">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => window.history.back()} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-1)] font-semibold text-sm transition-all flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link href="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-[var(--primary)]/20 flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
