import { NextRequest, NextResponse } from 'next/server';
import SimpleAuth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 404 });
    }

    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Check environment variables
    const envCheck = {
      GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
      GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
      JWT_SECRET: !!process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
    };

    // Test JWT creation and verification
    let jwtTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      const testUser = {
        id: 'test123',
        github_id: 'test123',
        username: 'testuser',
        name: 'Test User',
        avatar_url: 'https://github.com/testuser.png',
        html_url: 'https://github.com/testuser',
        email: 'test@example.com',
      };
      
      const token = await SimpleAuth.createToken(testUser, 'test_access_token');
      const verified = await SimpleAuth.verifyToken(token);
      
      jwtTest.success = !!verified && verified.username === 'testuser';
    } catch (error) {
      jwtTest.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      baseUrl,
      environment: process.env.NODE_ENV,
      envCheck,
      jwtTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}