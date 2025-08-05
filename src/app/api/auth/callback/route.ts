import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Proxy to the Python OAuth callback handler
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
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
    return NextResponse.redirect('/?error=callback_failed');
  }
}