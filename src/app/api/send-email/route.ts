import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();
    
    const emailData = {
      to: to || process.env.ADMIN_EMAIL || 'yadavdeepender65@gmail.com',
      subject: subject || 'README Generator Notification',
      html: html || 'No content provided'
    };
    
    console.log('📧 Attempting to send email notification:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });

    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured, logging email instead');
      console.log('📧 Email content:', emailData);
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (credentials not configured)' 
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');
    } catch (verifyError) {
      console.error('❌ Email transporter verification failed:', verifyError);
      // Log the email instead of failing completely
      console.log('📧 Email content (transporter failed):', emailData);
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (transporter verification failed)' 
      });
    }

    // Send the email
    const mailOptions = {
      from: `"README Generator" <${process.env.EMAIL_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: emailData.to,
      subject: emailData.subject
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Log the email content as fallback
    try {
      const { to, subject, html } = await request.json();
      console.log('📧 Email content (send failed):', { to, subject, html });
    } catch (logError) {
      console.error('Failed to log email content:', logError);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to send email notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}