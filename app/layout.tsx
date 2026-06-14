import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FlowInvoice — Smart Billing for Freelancers',
    template: '%s | FlowInvoice',
  },
  description:
    'FlowInvoice is a smart billing and client management SaaS for freelancers and independent contractors. Generate invoices, accept payments, and manage projects — all in one place.',
  keywords: ['invoice', 'freelancer', 'billing', 'client management', 'payments', 'SaaS'],
  authors: [{ name: 'Mohit Lakhara' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'FlowInvoice — Smart Billing for Freelancers',
    description: 'Professional invoicing and client management for modern freelancers.',
    siteName: 'FlowInvoice',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
