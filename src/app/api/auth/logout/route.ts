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
    
    // Get session info for revocation
    const sessionToken = request.cookies.get('session_token')?.value;
    const userId = request.cookies.get('user_id')?.value;
    
    // Note: Session revocation is handled by clearing cookies
    // The backend session will expire naturally or be cleaned up
    console.log('Logout: Clearing session cookies for user:', userId);
    
    // Create response with cleared cookies
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear new session system cookies
    response.cookies.set('session_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: protocol === 'https',
      sameSite: 'lax'
    });
    
    response.cookies.set('user_id', '', {
      expires: new Date(0),
      path: '/',
      secure: protocol === 'https',
      sameSite: 'lax'
    });
    
    // Clear legacy auth cookies for backward compatibility
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