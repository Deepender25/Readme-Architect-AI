import { NextRequest, NextResponse } from 'next/server';
import JWTAuth from '@/lib/jwt-auth';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  console.log('JWT-based callback called with params:', searchParams.toString());
  
  try {
    // Get the current host from the request
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const isProduction = protocol === 'https';
    
    const pythonCallbackUrl = `${baseUrl}/auth/callback?${searchParams.toString()}`;
    console.log('Calling Python callback:', pythonCallbackUrl);
    
    const response = await fetch(pythonCallbackUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects automatically
    });

    console.log('Python response status:', response.status);

    // If it's a redirect response with user data, process it
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      console.log('Python redirect location:', location);
      
      if (location) {
        try {
          // Parse the redirect URL to extract user data
          const redirectUrl = new URL(location, baseUrl);
          const authSuccess = redirectUrl.searchParams.get('auth_success');
          
          if (authSuccess) {
            console.log('Processing OAuth success with JWT...');
            
            // Decode user data from the callback
            const decodedData = decodeURIComponent(authSuccess);
            const userData = JSON.parse(decodedData);
            
            // Validate required user data fields
            if (!userData || !userData.github_id || !userData.username) {
              console.error('Invalid user data received from callback:', userData);
              throw new Error('Invalid user data received from authentication');
            }
            
            console.log('Creating JWT tokens for user:', userData.username);
            
            // Create JWT tokens
            const accessToken = await JWTAuth.createToken(userData);
            const refreshToken = await JWTAuth.createRefreshToken(userData.github_id, userData.sessionId || 'default');
            
            // Get return URL
            const returnTo = redirectUrl.searchParams.get('returnTo') || '/';
            
            // Create clean redirect URL without auth_success parameter
            const cleanRedirectUrl = new URL(returnTo, baseUrl);
            
            console.log('JWT tokens created, redirecting to:', cleanRedirectUrl.toString());
            
            // Create redirect response
            const redirectResponse = NextResponse.redirect(cleanRedirectUrl);
            
            // Set secure HTTP-only cookies
            redirectResponse.cookies.set('auth_token', accessToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/'
            });
            
            redirectResponse.cookies.set('refresh_token', refreshToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'lax',
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/'
            });
            
            // Set a client-readable cookie to indicate successful auth (for client-side state)
            redirectResponse.cookies.set('auth_status', 'authenticated', {
              httpOnly: false,
              secure: isProduction,
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/'
            });
            
            return redirectResponse;
          }
        } catch (error) {
          console.error('Error processing OAuth callback:', error);
        }
        
        // If no auth_success or error processing, do regular redirect
        let redirectUrl: URL;
        try {
          if (location.startsWith('http://') || location.startsWith('https://')) {
            redirectUrl = new URL(location);
          } else {
            redirectUrl = new URL(location, baseUrl);
          }
        } catch (error) {
          console.error('Error parsing redirect URL:', location, error);
          redirectUrl = new URL('/', baseUrl);
        }
        
        return NextResponse.redirect(redirectUrl);
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
