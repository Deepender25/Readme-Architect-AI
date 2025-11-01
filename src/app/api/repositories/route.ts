import { NextRequest, NextResponse } from 'next/server';
import JWTAuth from '@/lib/jwt-auth';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT authentication
    const user = await JWTAuth.getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get GitHub access token from JWT
    const accessToken = await JWTAuth.getGitHubAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found' },
        { status: 401 }
      );
    }

    console.log(`JWT: Fetching repositories for user ${user.username}`);

    // Proxy to the Python repositories handler
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const pythonReposUrl = `${baseUrl}/api/repositories`;
    
    // Forward the request with cookies and JWT info
    const response = await fetch(pythonReposUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
        'Content-Type': 'application/json',
        'X-GitHub-Token': accessToken, // Pass GitHub token to Python backend
        'X-User-ID': user.github_id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`JWT: Python API error for ${user.username}:`, errorText);
      return NextResponse.json(
        { error: `Python API error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`JWT: Successfully fetched ${data.length || 0} repositories for ${user.username}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('JWT: Repositories error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}