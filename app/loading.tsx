import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-2)] font-medium text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
