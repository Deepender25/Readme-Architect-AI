import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Proxy to the Python OAuth handler
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const pythonAuthUrl = `${baseUrl}/auth/github`;
    
    // Redirect to Python OAuth handler
    return NextResponse.redirect(pythonAuthUrl);
  } catch (error) {
    console.error('GitHub auth error:', error);
    return NextResponse.redirect('/?error=auth_failed');
  }
}