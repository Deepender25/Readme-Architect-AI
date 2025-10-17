import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();
    
    // For now, we'll use a simple email service
    // You can replace this with SendGrid, Nodemailer, or your preferred service
    
    const emailData = {
      to: to || process.env.ADMIN_EMAIL || 'your-email@example.com',
      subject: subject || 'README Generator Notification',
      html: html || 'No content provided'
    };
    
    // Log the email for now (replace with actual email service)
    console.log('📧 Sending email notification:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Implement actual email sending
    // Example implementations:
    
    // Option 1: Using SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: emailData.to,
    //   from: process.env.FROM_EMAIL,
    //   subject: emailData.subject,
    //   html: emailData.html
    // });
    
    // Option 2: Using Nodemailer
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });
    // await transporter.sendMail({
    //   from: process.env.FROM_EMAIL,
    //   to: emailData.to,
    //   subject: emailData.subject,
    //   html: emailData.html
    // });
    
    // Option 3: Using Resend
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL,
    //   to: emailData.to,
    //   subject: emailData.subject,
    //   html: emailData.html
    // });
    
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Email notification logged (implement actual sending)' 
    });
    
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    );
  }
}