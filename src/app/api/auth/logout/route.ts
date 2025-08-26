import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Create response that redirects to home
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Clear the authentication cookie
    response.cookies.set('github_user', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Also handle GET requests for logout
  return POST(request);
}