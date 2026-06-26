import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register', '/forgot-password'],
      disallow: ['/dashboard', '/dashboard/*', '/api/*'],
    },
    sitemap: 'https://soloflow-invoice.vercel.app/sitemap.xml',
  }
}
