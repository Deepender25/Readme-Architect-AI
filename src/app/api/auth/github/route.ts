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
    
    // Forward all query parameters to the Python handler
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    console.log('Next.js GitHub auth route called');
    console.log('Original URL:', request.url);
    console.log('Search params:', searchParams.toString());
    console.log('returnTo param:', searchParams.get('returnTo'));
    console.log('returnTo type:', typeof searchParams.get('returnTo'));
    
    const pythonAuthUrl = `${baseUrl}/auth/github${queryString ? `?${queryString}` : ''}`;
    console.log('Redirecting to Python:', pythonAuthUrl);
    
    // Redirect to Python OAuth handler
    return NextResponse.redirect(pythonAuthUrl);
  } catch (error) {
    console.error('GitHub auth error:', error);
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
  }
}
