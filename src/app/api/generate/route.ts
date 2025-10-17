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
      
      // Send email notification about the error
      try {
        await sendErrorNotification(error, {
          repoUrl: searchParams.get('repo_url'),
          projectName: searchParams.get('project_name'),
          userAgent: request.headers.get('User-Agent') || 'Unknown',
          timestamp: new Date().toISOString(),
          host: request.headers.get('host'),
          endpoint: '/api/generate'
        });
      } catch (emailError) {
        console.error('Failed to send error notification email:', emailError);
      }
      
      // Return proper error instead of fallback
      return NextResponse.json(
        { 
          error: 'Sorry, we are experiencing technical difficulties. Please try again later.',
          details: 'Our AI-powered README generation service is currently unavailable. We have been notified of this issue and are working to resolve it.'
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

// Email notification function for errors
async function sendErrorNotification(error: any, context: any) {
  try {
    const emailData = {
      to: process.env.ADMIN_EMAIL || 'yadavdeepender65@gmail.com', // Your email
      subject: '🚨 README Generator API Error - Immediate Attention Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            🚨 README Generator API Error
          </h2>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #991b1b; margin-top: 0;">Error Details</h3>
            <p><strong>Time:</strong> ${context.timestamp}</p>
            <p><strong>Endpoint:</strong> ${context.endpoint}</p>
            <p><strong>Repository:</strong> <a href="${context.repoUrl}" target="_blank">${context.repoUrl}</a></p>
            <p><strong>Project Name:</strong> ${context.projectName || 'Not specified'}</p>
            <p><strong>Host:</strong> ${context.host}</p>
            <p><strong>User Agent:</strong> ${context.userAgent}</p>
          </div>
          
          <div style="background: #fff1f2; border: 1px solid #fda4af; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #be123c; margin-top: 0;">Error Message</h3>
            <p style="font-family: monospace; background: #f9fafb; padding: 12px; border-radius: 4px; border-left: 4px solid #dc2626;">
              ${error.message || error}
            </p>
            
            ${error.stack ? `
            <h4 style="color: #be123c;">Stack Trace</h4>
            <pre style="background: #f9fafb; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; border-left: 4px solid #dc2626;">
${error.stack}
            </pre>
            ` : ''}
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">Action Required</h3>
            <p>This error occurred in the README generation API. Please:</p>
            <ul>
              <li>Check the AI service status and API keys</li>
              <li>Verify the Python backend is running properly</li>
              <li>Review server logs for additional context</li>
              <li>Test the repository URL manually if needed</li>
            </ul>
          </div>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is an automated error notification from your README Generator API.
          </p>
        </div>
      `
    };

    // Send the email notification
    const protocol = context.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${context.host}`;
    
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    
    if (response.ok) {
      console.log('✅ Error notification email sent successfully');
    } else {
      console.error('❌ Failed to send error notification email:', response.status);
    }
    
  } catch (emailError) {
    console.error('Failed to send error notification:', emailError);
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}