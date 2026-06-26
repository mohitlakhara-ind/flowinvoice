import RegisterForm from './register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Soloflow — Create Your Free Freelancer Account',
  description: 'Join Soloflow today and start managing your freelance clients, tracking time, generating professional invoices, and receiving secure online payments.',
  alternates: {
    canonical: '/register',
  },
}

export default function RegisterPage() {
  return <RegisterForm />
}
