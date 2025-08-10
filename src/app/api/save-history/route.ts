import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Proxy to the Python history handler for saving
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const pythonHistoryUrl = `${baseUrl}/api/save_history`;
    
    // Get the request body
    const body = await request.json();
    
    // Forward the POST request with cookies and body
    const response = await fetch(pythonHistoryUrl, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python API error:', errorText);
      return NextResponse.json(
        { error: `Failed to save to history: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Save history error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save to history' },
      { status: 500 }
    );
  }
}