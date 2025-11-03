import { NextRequest, NextResponse } from 'next/server';
import SimpleAuth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Get the base URL for absolute redirects (outside try block for scope)
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  let baseUrl = `${protocol}://${host}`;
  
  // Fallback to environment variable if host is not available
  if (!host) {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://readmearchitect.vercel.app';
  }

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is our returnTo path
    const error = searchParams.get('error');
    
    console.log('OAuth callback received:', { code: !!code, state, error, host, baseUrl });
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_denied`);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_failed`);
    }
    
    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!userResponse.ok) {
      console.error('Failed to get user info');
      return NextResponse.redirect(`${baseUrl}/login?error=user_info_failed`);
    }
    
    const githubUser = await userResponse.json();
    
    // Create our user object
    const user = {
      id: githubUser.id.toString(),
      github_id: githubUser.id.toString(),
      username: githubUser.login,
      name: githubUser.name || githubUser.login,
      avatar_url: githubUser.avatar_url,
      html_url: githubUser.html_url,
      email: githubUser.email,
    };
    
    console.log('User authenticated:', user.username);
    
    // Create JWT token
    const token = await SimpleAuth.createToken(user, tokenData.access_token);
    
    // Create response with absolute redirect URL
    let redirectPath = state && state !== '/' ? state : '/';
    
    // Ensure the redirect path starts with /
    if (!redirectPath.startsWith('/')) {
      redirectPath = '/';
    }
    
    const redirectUrl = `${baseUrl}${redirectPath}`;
    console.log('Creating redirect to:', redirectUrl);
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Set auth cookie
    response.headers.set('Set-Cookie', SimpleAuth.setAuthCookie(token));
    
    console.log('Authentication successful, redirecting to:', redirectUrl);
    
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`);
  }
}
