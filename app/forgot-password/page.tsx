import Link from 'next/link'
import { Zap, Mail, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Forgot Password — Soloflow' }

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Soloflow</span>
        </div>

        <div className="glass rounded-2xl p-8 border border-[#2a2a3a] text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Password reset via email isn&apos;t configured yet. Please contact support or change your password from{' '}
            <Link href="/dashboard/settings" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Settings
            </Link>{' '}
            if you&apos;re logged in.
          </p>

          <Link href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}
