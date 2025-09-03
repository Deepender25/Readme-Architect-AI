import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get the current host from the request
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    console.log('Logout API called');
    
    // Create response with cleared cookies
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear all auth-related cookies
    response.cookies.set('github_user', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: protocol === 'https',
      sameSite: 'lax'
    });
    
    response.cookies.set('auth_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: protocol === 'https',
      sameSite: 'lax'
    });
    
    response.cookies.set('session_id', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: protocol === 'https',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
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