import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Get the current host from the request
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const pythonCallbackUrl = `${baseUrl}/auth/callback?${searchParams.toString()}`;
    
    const response = await fetch(pythonCallbackUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects automatically
    });

    // If it's a redirect response, follow it
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      if (location) {
        // Extract cookies from the Python response
        const setCookieHeader = response.headers.get('Set-Cookie');
        const redirectResponse = NextResponse.redirect(new URL(location, request.url));
        
        // Forward the cookie from Python backend
        if (setCookieHeader) {
          redirectResponse.headers.set('Set-Cookie', setCookieHeader);
        }
        
        return redirectResponse;
      }
    }

    // If not a redirect, return the response as-is
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('GitHub callback error:', error);
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
