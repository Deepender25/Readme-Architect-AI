import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import JWTAuth from '@/lib/jwt-auth';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check JWT authentication
  const jwtToken = request.cookies.get('auth_token');
  let isAuthenticated = false;
  
  if (jwtToken?.value) {
    try {
      // Verify JWT token
      const payload = await JWTAuth.verifyToken(jwtToken.value);
      isAuthenticated = !!payload;
      
      if (payload) {
        console.log(`JWT Middleware: Valid token for user ${payload.username} accessing ${pathname}`);
      }
    } catch (error) {
      console.log(`JWT Middleware: Invalid token for ${pathname}:`, error);
      isAuthenticated = false;
    }
  }
  
  // Fallback to legacy authentication for backward compatibility
  if (!isAuthenticated) {
    const sessionToken = request.cookies.get('session_token');
    const userId = request.cookies.get('user_id');
    const legacyAuthCookie = request.cookies.get('github_user');
    
    isAuthenticated = !!(sessionToken?.value && userId?.value) || !!legacyAuthCookie?.value;
    
    if (isAuthenticated) {
      console.log(`JWT Middleware: Using legacy auth for ${pathname}`);
    }
  }
  
  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log(`JWT Middleware: Unauthorized access to ${pathname}, redirecting to login`);
      
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Handle auth routes (redirect authenticated users away)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      console.log(`JWT Middleware: Authenticated user accessing ${pathname}, redirecting away`);
      
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