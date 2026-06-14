import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require auth
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth',
]

// Magic link routes for client portal (no auth needed)
const magicRoutes = ['/portal']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow magic link portal routes
  if (magicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow Razorpay webhook (no auth)
  if (pathname === '/api/webhooks/razorpay') {
    return NextResponse.next()
  }

  // Check auth for all other routes
  const session = await auth()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
