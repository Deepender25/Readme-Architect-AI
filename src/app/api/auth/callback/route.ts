import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  console.log('Next.js callback called with params:', searchParams.toString());
  
  try {
    // Get the current host from the request
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const pythonCallbackUrl = `${baseUrl}/auth/callback?${searchParams.toString()}`;
    console.log('Calling Python callback:', pythonCallbackUrl);
    
    const response = await fetch(pythonCallbackUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects automatically
    });

    console.log('Python response status:', response.status);

    // If it's a redirect response, follow it
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      console.log('Python redirect location:', location);
      
      if (location) {
        // Extract cookies from the Python response
        const setCookieHeader = response.headers.get('Set-Cookie');
        
        // Handle both absolute and relative URLs
        let redirectUrl: URL;
        try {
          if (location.startsWith('http://') || location.startsWith('https://')) {
            // Absolute URL
            redirectUrl = new URL(location);
          } else {
            // Relative URL - construct with current host
            redirectUrl = new URL(location, baseUrl);
          }
          
          console.log('Final redirect URL:', redirectUrl.toString());
        } catch (error) {
          console.error('Error parsing redirect URL:', location, error);
          // Fallback to home page
          redirectUrl = new URL('/', baseUrl);
        }
        
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        // Forward the cookie from Python backend
        if (setCookieHeader) {
          console.log('Setting cookie:', setCookieHeader);
          redirectResponse.headers.set('Set-Cookie', setCookieHeader);
        }
        
        return redirectResponse;
      }
    }

    // If not a redirect, return the response as-is
    const responseText = await response.text();
    console.log('Python response body:', responseText);
    
    return new Response(responseText, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('GitHub callback error:', error);
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`);
  }
}
