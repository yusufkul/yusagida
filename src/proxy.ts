import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt, encrypt } from './lib/auth'

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (sessionCookie) {
    try {
      const parsed = await decrypt(sessionCookie)
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Refresh session
      const res = NextResponse.next()
      parsed.expires = new Date(Date.now() + 10 * 60 * 60 * 1000)
      res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
      })
      return res
    } catch (e) {
      if (!isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
