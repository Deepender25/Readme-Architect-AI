import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing email notification system...');
    
    // Send a test email
    const testEmailData = {
      to: process.env.ADMIN_EMAIL || 'yadavdeepender65@gmail.com',
      subject: '🧪 README Generator Email Test - Please Confirm Receipt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            🧪 Email System Test
          </h2>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Test Details</h3>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <p><strong>Email User:</strong> ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}</p>
            <p><strong>Email Pass:</strong> ${process.env.EMAIL_PASS ? 'Configured' : 'Not configured'}</p>
            <p><strong>Admin Email:</strong> ${process.env.ADMIN_EMAIL || 'Not configured'}</p>
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">Test Status</h3>
            <p>✅ If you received this email, the notification system is working correctly!</p>
            <p>❌ If you didn't receive this email, check your environment variables and email configuration.</p>
          </div>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is a test email from your README Generator service.
          </p>
        </div>
      `
    };

    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEmailData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.',
        emailResult: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Test email failed to send',
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Test email failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}