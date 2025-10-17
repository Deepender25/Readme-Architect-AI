import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Try the direct Python API endpoint first
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const pythonApiUrl = `${baseUrl}/api/python/generate?${searchParams.toString()}`;
    
    try {
      const response = await fetch(pythonApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || '',
          'User-Agent': 'NextJS-Internal-Request',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        console.log('Python API failed, falling back to local generation');
      }
    } catch (error) {
      console.log('Python API error:', error);
      
      // Return proper error instead of fallback
      return NextResponse.json(
        { 
          error: 'README generation service is currently unavailable. Please try again later.',
          details: 'Our AI-powered README generation service is experiencing issues. Please check back in a few minutes.'
        },
        { status: 503 }
      );
    }
    
    // If Python API failed but didn't throw, also return error
    console.log('Python API failed, returning error instead of fallback');
    return NextResponse.json(
      { 
        error: 'README generation failed. Please try again.',
        details: 'We were unable to generate a README for this repository. Please ensure the repository is public and accessible.'
      },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate README' },
      { status: 500 }
    );
  }
}

// Removed fallback README generation - now shows proper error messages instead

export async function POST(request: NextRequest) {
  return GET(request);
}