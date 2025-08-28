import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Email credentials not configured',
        details: {
          EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
          EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing'
        }
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    
    console.log('✅ Email configuration test passed');
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration is working correctly',
      details: {
        service: 'Gmail',
        user: process.env.EMAIL_USER,
        host: 'smtp.gmail.com',
        port: 587
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    let errorMessage = 'Unknown error';
    let suggestions = [];
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('Invalid login')) {
        suggestions.push('Make sure you are using an App Password, not your regular Gmail password');
        suggestions.push('Enable 2-factor authentication on your Gmail account');
        suggestions.push('Generate a new App Password in your Google Account settings');
      } else if (error.message.includes('ENOTFOUND')) {
        suggestions.push('Check your internet connection');
        suggestions.push('Verify DNS settings');
      } else if (error.message.includes('ECONNREFUSED')) {
        suggestions.push('Gmail SMTP might be blocked by your network');
        suggestions.push('Try using port 465 with secure: true');
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      details: {
        EMAIL_USER: process.env.EMAIL_USER || 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set'
      }
    });
  }
}