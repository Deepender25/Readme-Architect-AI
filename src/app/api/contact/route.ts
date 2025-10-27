import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Missing email configuration:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing'
      });
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('Processing contact form submission:', { name, email, subject });
    console.log('Using email service:', process.env.EMAIL_USER);

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission - ReadmeArchitect</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; margin: -20px -20px 20px -20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #10b981; display: block; margin-bottom: 5px; }
            .field-value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #10b981; }
            .message-content { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; white-space: pre-wrap; word-wrap: break-word; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            .timestamp { background: #e1f5fe; padding: 10px; border-radius: 5px; font-size: 12px; color: #0277bd; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 ReadmeArchitect - New Contact Form Submission</h1>
              <p>Someone reached out through your website!</p>
            </div>
            
            <div class="timestamp">
              <strong>Received:</strong> ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>

            <div class="content">
              <div class="field">
                <span class="field-label">👤 Name:</span>
                <div class="field-value">${name}</div>
              </div>

              <div class="field">
                <span class="field-label">📧 Email:</span>
                <div class="field-value">
                  <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
                </div>
              </div>

              <div class="field">
                <span class="field-label">📋 Subject:</span>
                <div class="field-value">${subject}</div>
              </div>

              <div class="field">
                <span class="field-label">💬 Message:</span>
                <div class="message-content">${message}</div>
              </div>
            </div>

            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 20px;">
              <p style="margin: 0; color: #16a34a;">
                <strong>💡 Quick Actions:</strong><br>
                • Reply directly to this email to respond to ${name}<br>
                • Save their email (${email}) to your contacts<br>
                • Check if this is a ${subject.toLowerCase()} that needs immediate attention
              </p>
            </div>

            <div class="footer">
              <p>This email was sent automatically from your ReadmeArchitect contact form.</p>
              <p>🌟 ReadmeArchitect - Making documentation beautiful, one README at a time!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission - ReadmeArchitect

Received: ${new Date().toLocaleString()}

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from your ReadmeArchitect contact form.
Reply directly to respond to ${name}.
    `;

    // Email options
    const mailOptions = {
      from: `"ReadmeArchitect Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email, // Set reply-to as the user's email
      subject: `🚀 ReadmeArchitect Contact: ${subject} - from ${name}`,
      text: textContent,
      html: htmlContent,
    };

    // Create transporter with enhanced configuration
    console.log('🔧 Creating email transporter...');
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // Use Gmail service
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be an App Password
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });
    
    // Verify transporter configuration
    try {
      console.log('🔍 Verifying transporter configuration...');
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');
    } catch (verifyError) {
      console.error('❌ Email transporter verification failed:', verifyError);
      console.error('Error details:', verifyError);
      
      // Provide more specific error guidance
      let errorMsg = 'Email service configuration error.';
      if (verifyError instanceof Error) {
        if (verifyError.message.includes('Invalid login')) {
          errorMsg = 'Gmail authentication failed. Please ensure you are using an App Password, not your regular Gmail password.';
        } else if (verifyError.message.includes('ENOTFOUND')) {
          errorMsg = 'Cannot connect to Gmail servers. Please check your internet connection.';
        }
      }
      
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    console.log('📧 Sending notification email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent successfully:', info.messageId);

    // Optional: Send confirmation email to the user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thank You - ReadmeArchitect</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${name}! 🙏</h1>
              <p>Your message has been received</p>
            </div>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! I've received your message about "<strong>${subject}</strong>" and I'll get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>🚀 Try out ReadmeArchitect: <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://readmearchitect.vercel.app'}/generate">Generate a README</a></li>
              <li>📖 Check out our tutorials: <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://readmearchitect.vercel.app'}/tutorials">Learn how to use ReadmeArchitect</a></li>
              <li>⭐ Star us on GitHub: <a href="https://github.com/Deepender25/Readme-Architect-AI">GitHub Repository</a></li>
            </ul>
            <p>Best regards,<br>Deepender Yadav<br>Creator of ReadmeArchitect</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>ReadmeArchitect - Making documentation beautiful! 🎨</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const confirmationOptions = {
      from: `"Deepender from ReadmeArchitect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting ReadmeArchitect! 🚀`,
      html: confirmationHtml,
    };

    // Send confirmation email to user
    console.log('📧 Sending confirmation email...');
    const confirmInfo = await transporter.sendMail(confirmationOptions);
    console.log('✅ Confirmation email sent successfully:', confirmInfo.messageId);

    return NextResponse.json(
      { 
        message: 'Email sent successfully!',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email. Please try again or contact us directly.';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please contact admin.';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Email service connection failed. Please try again later.';
      }
      console.error('Error details:', error.message);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false 
      },
      { status: 500 }
    );
  }
}
