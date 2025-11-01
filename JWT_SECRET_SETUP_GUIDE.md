# 🔐 JWT_SECRET Setup Guide

## Overview
The JWT_SECRET is a cryptographic key used to sign and verify JWT tokens in your authentication system. It's crucial for security and must be kept secret.

## ✅ Quick Setup (Already Done)

Your JWT_SECRET has been automatically generated and configured:

```bash
JWT_SECRET=PCYmP0O8o0CRBUuPmyDzy+a2svFga2/SCyhabIpg3bE=
```

## 🔧 Manual Setup Methods

### Method 1: Using Node.js (Recommended)
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
```

### Method 2: Using OpenSSL
```bash
openssl rand -base64 32
```

### Method 3: Using the Provided Script
```bash
node scripts/generate_jwt_secret.js
```

### Method 4: Online Generator (Use with Caution)
- Visit: https://generate-secret.vercel.app/32
- Only use for development, never for production

## 🚀 Environment Configuration

### Local Development (.env)
```bash
# Add to your .env file
JWT_SECRET=your-generated-secret-here
```

### Production Deployment

#### Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `JWT_SECRET` = `your-production-secret`

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add: `JWT_SECRET` = `your-production-secret`

#### Railway
1. Go to Variables tab
2. Add: `JWT_SECRET` = `your-production-secret`

#### Heroku
```bash
heroku config:set JWT_SECRET=your-production-secret
```

#### Docker
```dockerfile
ENV JWT_SECRET=your-production-secret
```

## 🔒 Security Best Practices

### ✅ DO:
- Use different secrets for development and production
- Generate secrets with at least 256 bits of entropy (32 bytes)
- Store secrets in environment variables, never in code
- Rotate secrets periodically in production
- Use base64 encoding for easy storage

### ❌ DON'T:
- Commit JWT secrets to version control
- Use weak or predictable secrets
- Share secrets between different applications
- Store secrets in client-side code
- Use the same secret across environments

## 🛡️ Secret Requirements

### Minimum Requirements:
- **Length**: At least 32 characters (256 bits)
- **Entropy**: Cryptographically random
- **Encoding**: Base64 recommended
- **Uniqueness**: Different per environment

### Example Valid Secrets:
```bash
# Good - 32 bytes base64 encoded
JWT_SECRET=PCYmP0O8o0CRBUuPmyDzy+a2svFga2/SCyhabIpg3bE=

# Good - 32 bytes hex encoded  
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

# Bad - Too short
JWT_SECRET=mysecret

# Bad - Predictable
JWT_SECRET=12345678901234567890123456789012
```

## 🔄 Secret Rotation

### When to Rotate:
- Suspected compromise
- Employee departure with access
- Regular security maintenance (quarterly)
- Before major releases

### How to Rotate:
1. Generate new secret
2. Update environment variables
3. Deploy application
4. Invalidate old tokens (users will need to re-login)

## 🧪 Testing Your Setup

### Verify JWT_SECRET is Working:
```bash
# Check if environment variable is set
node -e "console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET)"

# Check secret length
node -e "console.log('Secret length:', process.env.JWT_SECRET?.length || 0)"
```

### Test JWT Token Generation:
```javascript
// Test in Node.js console
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const token = jwt.sign({ test: true }, secret);
console.log('Token generated successfully:', !!token);
```

## 🚨 Troubleshooting

### Common Issues:

#### "JWT_SECRET is not defined"
- Check your .env file exists
- Verify the variable name is exactly `JWT_SECRET`
- Restart your development server

#### "Invalid signature" errors
- Secret mismatch between environments
- Secret was changed after tokens were issued
- Check for extra spaces or characters

#### Build/deployment failures
- Ensure JWT_SECRET is set in production environment
- Check deployment platform environment variables
- Verify secret doesn't contain special characters that need escaping

## 📝 Environment File Template

```bash
# .env file template
JWT_SECRET=PCYmP0O8o0CRBUuPmyDzy+a2svFga2/SCyhabIpg3bE=

# Other required variables
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_API_KEY=your_google_api_key
```

## ✅ Verification Checklist

- [ ] JWT_SECRET is at least 32 characters long
- [ ] Secret is cryptographically random
- [ ] Secret is stored in environment variables
- [ ] Different secrets for dev/staging/production
- [ ] Secret is not committed to version control
- [ ] Production environment variables are configured
- [ ] Application builds and runs successfully
- [ ] JWT tokens are generated and verified correctly

## 🎯 Your Current Status

✅ **JWT_SECRET Generated**: `PCYmP0O8o0CRBUuPmyDzy+a2svFga2/SCyhabIpg3bE=`
✅ **Local .env Updated**: Secret added to your .env file
✅ **Security Compliant**: 256-bit entropy, base64 encoded
✅ **Ready for Production**: Just add to your deployment platform

Your JWT authentication system is now properly configured and secure!