import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('elite-aligner-auth-token')?.value
  const role = req.cookies.get('elite-aligner-role')?.value
  
  const pathname = req.nextUrl.pathname

  // حماية الصفحات المحمية - إذا لم يكن هناك توكن
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/doctor'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // إذا كان مسجل الدخول وحاول الوصول لـ login
  if (token && pathname === '/login') {
    // وجهه حسب Role
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/doctor', req.url))
  }

  // حماية Admin - فقط Admin يدخل /admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/doctor', req.url))
  }

  // حماية Doctor - Doctor لا يدخل /admin
  if (pathname.startsWith('/doctor') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Dashboard موجه حسب Role
  if (pathname === '/dashboard') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/doctor', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/doctor/:path*', '/login'],
}