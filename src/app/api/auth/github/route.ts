import { NextRequest, NextResponse } from 'next/server';

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
    const returnTo = searchParams.get('returnTo') || '/';
    
    // GitHub OAuth configuration
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      console.error('GitHub OAuth not configured');
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_not_configured`);
    }
    
    // Build GitHub OAuth URL
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', clientId);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.set('scope', 'user:email,repo');
    githubAuthUrl.searchParams.set('state', returnTo);
    
    console.log('Redirecting to GitHub OAuth:', githubAuthUrl.toString());
    
    return NextResponse.redirect(githubAuthUrl.toString());
  } catch (error) {
    console.error('GitHub auth error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
  }
}
