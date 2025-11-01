import { NextRequest, NextResponse } from 'next/server';
import JWTAuth from '@/lib/jwt-auth';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const protocol = request.headers.get('host')?.includes('localhost') ? 'http' : 'https';
    const isProduction = protocol === 'https';
    
    console.log('JWT-based logout API called');
    
    // Get current user info before logout (for logging)
    const user = await JWTAuth.getCurrentUser(request);
    if (user) {
      console.log('Logging out user:', user.username);
    }
    
    // Create response with cleared cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear JWT auth cookies
    response.cookies.set('auth_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    });
    
    response.cookies.set('refresh_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    });
    
    // Clear auth status cookie
    response.cookies.set('auth_status', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax'
    });
    
    // Clear legacy cookies for backward compatibility
    const legacyCookies = ['github_user', 'session_token', 'user_id', 'session_id'];
    legacyCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
      });
    });
    
    console.log('JWT logout completed successfully');
    return response;
  } catch (error) {
    console.error('JWT logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Redirect GET requests to POST for simplicity
  return POST(request);
}