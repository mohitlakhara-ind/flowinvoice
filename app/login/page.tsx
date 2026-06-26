import LoginForm from './login-form'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Soloflow — Access Your Freelance Dashboard',
  description: 'Log in to your Soloflow account to manage clients, log time, generate invoices, and view business analytics.',
  alternates: {
    canonical: '/login',
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
