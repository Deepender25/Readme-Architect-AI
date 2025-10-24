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
    
    // If we have session info, revoke the session on the backend
    if (sessionToken && userId) {
      try {
        const revokeResponse = await fetch(`${baseUrl}/api/sessions/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `session_token=${sessionToken}; user_id=${userId}`
          },
          body: JSON.stringify({ session_id: sessionToken })
        });
        
        if (revokeResponse.ok) {
          console.log('Session revoked on backend');
        } else {
          console.warn('Failed to revoke session on backend');
        }
      } catch (error) {
        console.warn('Error revoking session:', error);
      }
    }
    
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