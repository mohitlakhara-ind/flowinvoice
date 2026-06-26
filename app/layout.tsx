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
  metadataBase: new URL('https://soloflow-invoice.vercel.app'),
  title: {
    default: 'Soloflow — Smart Billing & Client Portal for Freelancers',
    template: '%s | Soloflow',
  },
  description:
    'Soloflow is an AI-powered billing, client portal, and time-tracking SaaS for freelancers and contractors. Generate invoices, stream AI proposals, accept secure Razorpay payments, and organize projects.',
  keywords: [
    'freelancer invoicing',
    'smart billing SaaS',
    'client management portal',
    'time tracker for freelancers',
    'Razorpay invoice payment',
    'AI proposal generator',
    'freelance dashboard',
    'PDF invoice creator'
  ],
  authors: [{ name: 'Mohit Lakhara', url: 'https://mohitlakhara.vercel.app/' }],
  creator: 'Mohit Lakhara',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://soloflow-invoice.vercel.app',
    title: 'Soloflow — Smart Invoicing & Client SaaS for Freelancers',
    description: 'Run your freelance business from one dashboard. AI proposals, smart time-tracking, and Razorpay-powered invoices.',
    siteName: 'Soloflow',
    images: [
      {
        url: 'https://res.cloudinary.com/dhjkbcdfm/image/upload/v1781679012/portfolio_projects/soloflow/dashboard_dark.png',
        width: 1200,
        height: 630,
        alt: 'Soloflow Freelancer Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soloflow — Smart Invoicing & Client SaaS for Freelancers',
    description: 'AI proposals, smart time-tracking, and Razorpay-powered invoicing on a unified freelance dashboard.',
    images: ['https://res.cloudinary.com/dhjkbcdfm/image/upload/v1781679012/portfolio_projects/soloflow/dashboard_dark.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Soloflow",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-powered client management and invoicing SaaS built for freelancers. Streamline time tracking, proposal writing, and billing from one unified dashboard.",
    "creator": {
      "@type": "Person",
      "name": "Mohit Lakhara",
      "url": "https://mohitlakhara.vercel.app/"
    }
  }

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
