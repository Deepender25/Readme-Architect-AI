import { NextRequest } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// No fallback README generation - return proper errors instead

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const repoUrl = searchParams.get('repo_url');
  const projectName = searchParams.get('project_name') || '';
  const includeDemo = searchParams.get('include_demo') === 'true';
  const numScreenshots = parseInt(searchParams.get('num_screenshots') || '0');
  const numVideos = parseInt(searchParams.get('num_videos') || '0');

  if (!repoUrl) {
    return new Response('Repository URL is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const generateReadme = async () => {
        try {
          // Try to connect to Python API
          const host = request.headers.get('host');
          const protocol = host?.includes('localhost') ? 'http' : 'https';
          const baseUrl = `${protocol}://${host}`;
          const pythonApiUrl = `${baseUrl}/api/python/generate?${searchParams.toString()}`;
          
          sendEvent({ status: 'Connecting to AI service...' });
          
          const response = await fetch(pythonApiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': request.headers.get('Cookie') || '',
              'User-Agent': 'NextJS-Internal-Request',
            },
          });

          if (!response.ok) {
            throw new Error(`AI service returned ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          if (data.readme) {
            sendEvent({ readme: data.readme });
          } else {
            throw new Error('No README content received from AI service');
          }
          
        } catch (error) {
          console.error('Stream generation error:', error);
          
          // Send email notification about the error
          try {
            await sendErrorNotification(error, {
              repoUrl,
              projectName,
              userAgent: request.headers.get('User-Agent') || 'Unknown',
              timestamp: new Date().toISOString(),
              host: request.headers.get('host')
            });
          } catch (emailError) {
            console.error('Failed to send error notification email:', emailError);
          }
          
          sendEvent({ 
            error: 'Sorry, we are experiencing technical difficulties. Please try again later.',
            details: 'Our AI-powered README generation service is currently unavailable. We have been notified of this issue and are working to resolve it.'
          });
        } finally {
          controller.close();
        }
      };

      generateReadme();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Email notification function for errors
async function sendErrorNotification(error: any, context: any) {
  try {
    const emailData = {
      to: process.env.ADMIN_EMAIL || 'yadavdeepender65@gmail.com', // Your email
      subject: '🚨 README Generator Service Error - Immediate Attention Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            🚨 README Generator Service Error
          </h2>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #991b1b; margin-top: 0;">Error Details</h3>
            <p><strong>Time:</strong> ${context.timestamp}</p>
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
            <p>This error occurred in the README generation service. Please:</p>
            <ul>
              <li>Check the AI service status and API keys</li>
              <li>Verify the Python backend is running properly</li>
              <li>Review server logs for additional context</li>
              <li>Test the repository URL manually if needed</li>
            </ul>
          </div>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is an automated error notification from your README Generator service.
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