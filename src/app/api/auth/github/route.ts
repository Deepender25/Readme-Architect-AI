import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the current host from the request
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const pythonAuthUrl = `${baseUrl}/auth/github`;
    
    // Redirect to Python OAuth handler
    return NextResponse.redirect(pythonAuthUrl);
  } catch (error) {
    console.error('GitHub auth error:', error);
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
