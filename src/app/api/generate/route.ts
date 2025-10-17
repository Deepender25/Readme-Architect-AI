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
    const errorType = getErrorType(error);
    const severity = getErrorSeverity(error);
    const recommendations = getErrorRecommendations(error, context);
    
    const emailData = {
      to: process.env.ADMIN_EMAIL || 'yadavdeepender65@gmail.com',
      subject: `🚨 [${severity}] README Generator API Failure - ${errorType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>README Generator Error Report</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">
                🚨 README Generator Service Alert
              </h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">
                Generate API Error Detected - Immediate Investigation Required
              </p>
            </div>
            
            <!-- Error Summary -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="background: #fef2f2; color: #dc2626; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                  ${severity} SEVERITY
                </div>
                <div style="margin-left: 12px; color: #6b7280; font-size: 14px;">
                  Error Type: ${errorType}
                </div>
              </div>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px;">Timestamp:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-family: monospace;">${context.timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">Service:</td>
                  <td style="padding: 8px 0; color: #6b7280;">Generate API (${context.endpoint})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">Host:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-family: monospace;">${context.host}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">Repository:</td>
                  <td style="padding: 8px 0;">
                    <a href="${context.repoUrl}" style="color: #2563eb; text-decoration: none; font-family: monospace;" target="_blank">
                      ${context.repoUrl}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">Project:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${context.projectName || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">User Agent:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 12px; font-family: monospace;">${context.userAgent}</td>
                </tr>
              </table>
            </div>
            
            <!-- Error Details -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; color: #dc2626; font-size: 18px;">🔍 Error Analysis</h3>
              
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #991b1b; font-size: 14px; font-weight: 600;">Primary Error Message</h4>
                <code style="display: block; background: #fff; padding: 12px; border-radius: 6px; border-left: 4px solid #dc2626; font-family: 'SF Mono', Monaco, monospace; font-size: 13px; color: #1f2937; white-space: pre-wrap; overflow-x: auto;">
${error.message || error}
                </code>
              </div>
              
              ${error.stack ? `
              <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">Stack Trace</h4>
                <pre style="margin: 0; font-family: 'SF Mono', Monaco, monospace; font-size: 11px; color: #6b7280; white-space: pre-wrap; overflow-x: auto; max-height: 200px; overflow-y: auto;">
${error.stack}
                </pre>
              </div>
              ` : ''}
            </div>
            
            <!-- Recommendations -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; color: #1d4ed8; font-size: 18px;">💡 Recommended Actions</h3>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px;">
                <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
                  ${recommendations.map(rec => `<li style="margin-bottom: 8px; line-height: 1.5;">${rec}</li>`).join('')}
                </ol>
              </div>
            </div>
            
            <!-- System Information -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px;">🔧 System Context</h3>
              <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="padding: 4px 0; font-weight: 600; color: #374151; width: 160px;">Environment:</td>
                    <td style="padding: 4px 0; color: #6b7280; font-family: monospace;">${process.env.NODE_ENV || 'unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 600; color: #374151;">Runtime:</td>
                    <td style="padding: 4px 0; color: #6b7280; font-family: monospace;">Node.js ${process.version}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 600; color: #374151;">Memory Usage:</td>
                    <td style="padding: 4px 0; color: #6b7280; font-family: monospace;">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 600; color: #374151;">Uptime:</td>
                    <td style="padding: 4px 0; color: #6b7280; font-family: monospace;">${Math.round(process.uptime())}s</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 24px; background: #f8fafc; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                📧 Automated alert from README Generator Service<br>
                Generated at ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
              </p>
            </div>
          </div>
        </body>
        </html>
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

// Helper functions for error analysis
function getErrorType(error: any): string {
  const message = error.message || error.toString();
  if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
    return 'Network Connection Error';
  } else if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return 'Service Timeout';
  } else if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'Internal Server Error';
  } else if (message.includes('503') || message.includes('Service Unavailable')) {
    return 'Service Unavailable';
  } else if (message.includes('401') || message.includes('403')) {
    return 'Authentication Error';
  } else if (message.includes('404')) {
    return 'Resource Not Found';
  } else if (message.includes('API') || message.includes('service')) {
    return 'External API Error';
  } else {
    return 'Unknown Error';
  }
}

function getErrorSeverity(error: any): string {
  const message = error.message || error.toString();
  if (message.includes('ECONNREFUSED') || message.includes('503') || message.includes('Service Unavailable')) {
    return 'CRITICAL';
  } else if (message.includes('500') || message.includes('timeout')) {
    return 'HIGH';
  } else if (message.includes('401') || message.includes('403') || message.includes('404')) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

function getErrorRecommendations(error: any, context: any): string[] {
  const message = error.message || error.toString();
  const recommendations = [];
  
  if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
    recommendations.push('Verify the Python backend service is running and accessible');
    recommendations.push('Check network connectivity between services');
    recommendations.push('Confirm the correct API endpoint URLs are configured');
  } else if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    recommendations.push('Increase timeout values for API requests');
    recommendations.push('Check if the AI service is experiencing high load');
    recommendations.push('Monitor service response times and consider scaling');
  } else if (message.includes('500')) {
    recommendations.push('Review Python backend logs for detailed error information');
    recommendations.push('Check AI service API key validity and rate limits');
    recommendations.push('Verify all required environment variables are set');
  } else if (message.includes('503')) {
    recommendations.push('Check AI service status and availability');
    recommendations.push('Verify service dependencies are running');
    recommendations.push('Consider implementing circuit breaker pattern');
  } else if (message.includes('401') || message.includes('403')) {
    recommendations.push('Verify API keys and authentication credentials');
    recommendations.push('Check if API quotas or rate limits have been exceeded');
    recommendations.push('Ensure proper authorization headers are being sent');
  }
  
  // Add general recommendations
  recommendations.push('Monitor service health dashboard for related issues');
  recommendations.push('Check recent deployments for potential regressions');
  if (context.repoUrl) {
    recommendations.push(`Test the specific repository manually: ${context.repoUrl}`);
  }
  
  return recommendations.length > 0 ? recommendations : [
    'Review application logs for additional context',
    'Check system resources and performance metrics',
    'Verify all external dependencies are operational'
  ];
}

export async function POST(request: NextRequest) {
  return GET(request);
}