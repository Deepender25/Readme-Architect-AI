import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/repositories',
  '/history',
  '/settings',
  '/generate'
];

// Routes that should redirect authenticated users away
const authRoutes = [
  '/login'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for both new session system and legacy authentication
  const sessionToken = request.cookies.get('session_token');
  const userId = request.cookies.get('user_id');
  const legacyAuthCookie = request.cookies.get('github_user');
  
  // User is authenticated if they have either the new session system or legacy cookie
  const isAuthenticated = !!(sessionToken?.value && userId?.value) || !!legacyAuthCookie?.value;
  
  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Handle auth routes (redirect authenticated users away)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Get return URL from query params or default to home
      const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};