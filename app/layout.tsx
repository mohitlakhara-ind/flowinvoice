import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/session-provider'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Soloflow — Smart Billing for Freelancers',
    template: '%s | Soloflow',
  },
  description:
    'Soloflow is a smart billing and client management SaaS for freelancers and independent contractors. Generate invoices, accept payments, and manage projects — all in one place.',
  keywords: ['invoice', 'freelancer', 'billing', 'client management', 'payments', 'SaaS'],
  authors: [{ name: 'Mohit Lakhara' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Soloflow — Smart Billing for Freelancers',
    description: 'Professional invoicing and client management for modern freelancers.',
    siteName: 'Soloflow',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let mode = localStorage.getItem('mode');
                if (!mode) {
                  mode = 'dark';
                  localStorage.setItem('mode', mode);
                }
                document.documentElement.setAttribute('data-mode', mode);

                let theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = 'indigo';
                  localStorage.setItem('theme', theme);
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
