# Email Setup Guide for Contact Form

This guide will help you set up the email functionality for your ReadmeArchitect contact form.

## Prerequisites

- A Gmail account
- Next.js environment variables support

## Step 1: Enable Gmail App Password

Since Gmail uses 2-factor authentication, you'll need to create an app-specific password:

### 1.1 Enable 2-Step Verification
1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click on **2-Step Verification**
4. Follow the steps to enable 2-Step Verification if not already enabled

### 1.2 Generate App Password
1. After enabling 2-Step Verification, go back to **Security**
2. Under "Signing in to Google", click on **2-Step Verification**
3. Scroll down and click on **App passwords**
4. Select **Mail** for the app and **Other (custom name)** for device
5. Enter "ReadmeArchitect Contact Form" as the custom name
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

## Step 2: Configure Environment Variables

### 2.1 Create .env.local file
In your project root directory, create a `.env.local` file:

```bash
# Copy .env.example to .env.local
cp .env.example .env.local
```

### 2.2 Add Email Configuration
Open `.env.local` and add your email configuration:

```env
# Email Configuration for Contact Form
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# Optional: Your website URL for confirmation emails
NEXT_PUBLIC_BASE_URL=https://readmearchitect.vercel.app
```

**Replace:**
- `your-gmail@gmail.com` with your actual Gmail address
- `abcd efgh ijkl mnop` with the 16-character app password you generated
- `https://readmearchitect.vercel.app` with your actual website URL

### 2.3 Important Notes
- Use the **16-character app password**, not your regular Gmail password
- Keep spaces in the app password (Gmail provides it with spaces)
- The `.env.local` file is automatically ignored by Git for security

## Step 3: Install Dependencies

Install the required packages:

```bash
npm install nodemailer @types/nodemailer
```

## Step 4: Test the Setup

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Test the Contact Form
1. Navigate to `http://localhost:3000/contact`
2. Fill out the contact form
3. Submit the form
4. Check your Gmail inbox for the contact submission
5. Check the sender's email for the confirmation message

## Step 5: Production Deployment

### For Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `EMAIL_USER`: your Gmail address
   - `EMAIL_PASS`: your 16-character app password
   - `NEXT_PUBLIC_BASE_URL`: your production URL

### For Other Platforms:
Add the same environment variables to your hosting platform's environment configuration.

## Email Templates

The contact form sends two emails:

### 1. Notification Email (to you)
- **Subject**: 🚀 ReadmeArchitect Contact: [Subject] - from [Name]
- **Content**: Professional HTML email with user details
- **Reply-To**: Set to sender's email for easy replies

### 2. Confirmation Email (to sender)
- **Subject**: Thank you for contacting ReadmeArchitect! 🚀
- **Content**: Thank you message with helpful links

## Troubleshooting

### Common Issues:

**1. "Invalid login" error:**
- Make sure you're using the app password, not your regular Gmail password
- Ensure 2-Step Verification is enabled

**2. "Authentication failed" error:**
- Double-check the app password (it should be 16 characters with spaces)
- Verify the Gmail address is correct

**3. Emails not being sent:**
- Check server logs for detailed error messages
- Ensure all environment variables are properly set
- Try testing with a different Gmail account

**4. Emails going to spam:**
- This is normal for new setups
- Add your domain to SPF/DKIM records (advanced)
- Users should check their spam folder initially

### Testing in Development:

You can test email functionality locally by checking the server console logs. The API will return success/error messages that help debug issues.

## Security Best Practices

1. **Never commit `.env.local`** - it contains sensitive credentials
2. **Use app passwords** - never use your main Gmail password
3. **Restrict API usage** - consider adding rate limiting for production
4. **Monitor usage** - keep track of email sending volumes

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all steps in this guide
3. Test with a simple email service like Mailtrap for development
4. Contact the project maintainer if problems persist

---

🎉 **Congratulations!** Your contact form is now fully functional and will send you email notifications whenever someone reaches out through your website.
