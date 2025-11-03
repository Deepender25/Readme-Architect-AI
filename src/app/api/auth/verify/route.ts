import { NextRequest, NextResponse } from 'next/server';
import SimpleAuth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth verification request received');
    
    const user = await SimpleAuth.getCurrentUser(request);
    
    if (user) {
      console.log('User authenticated:', user.username);
      return NextResponse.json({
        authenticated: true,
        user,
      });
    } else {
      console.log('No valid authentication found');
      return NextResponse.json({
        authenticated: false,
        user: null,
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: 'Verification failed',
    }, { status: 500 });
  }
}