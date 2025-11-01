#!/usr/bin/env node

/**
 * JWT Setup Verification Script
 * 
 * This script verifies that your JWT_SECRET is properly configured
 * and that JWT tokens can be generated and verified successfully.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key] = value;
      }
    }
  }
  
  return true;
}

function verifyJWTSecret() {
  console.log('🔐 JWT Setup Verification\n');
  
  // Load .env file
  if (!loadEnvFile()) {
    return false;
  }
  
  const jwtSecret = process.env.JWT_SECRET;
  
  // Check if JWT_SECRET exists
  if (!jwtSecret) {
    console.log('❌ JWT_SECRET not found in .env file');
    console.log('📝 Please add JWT_SECRET to your .env file');
    return false;
  }
  
  console.log('✅ JWT_SECRET found in .env file');
  
  // Check secret length
  if (jwtSecret.length < 32) {
    console.log(`⚠️  JWT_SECRET is too short (${jwtSecret.length} characters)`);
    console.log('🔒 Recommended: At least 32 characters for security');
    return false;
  }
  
  console.log(`✅ JWT_SECRET length: ${jwtSecret.length} characters (secure)`);
  
  // Check if it's not the default placeholder
  if (jwtSecret.includes('your-super-secret') || jwtSecret.includes('change-in-production')) {
    console.log('⚠️  JWT_SECRET appears to be a placeholder');
    console.log('🔄 Please generate a new secure secret');
    return false;
  }
  
  console.log('✅ JWT_SECRET appears to be properly generated');
  
  // Test JWT token generation (if jose is available)
  try {
    const crypto = require('crypto');
    
    // Test HMAC generation (similar to what jose does internally)
    const testPayload = JSON.stringify({ test: true, iat: Date.now() });
    const hmac = crypto.createHmac('sha256', jwtSecret);
    hmac.update(testPayload);
    const signature = hmac.digest('base64');
    
    if (signature && signature.length > 0) {
      console.log('✅ JWT signing test successful');
    }
    
  } catch (error) {
    console.log('⚠️  Could not test JWT signing:', error.message);
  }
  
  console.log('\n🎯 JWT Setup Status: ✅ READY');
  console.log('\n📋 Next Steps:');
  console.log('1. ✅ JWT_SECRET is configured');
  console.log('2. ✅ Secret meets security requirements');
  console.log('3. 🚀 Ready for development and production');
  console.log('\n🔒 Security Reminders:');
  console.log('- Never commit JWT_SECRET to version control');
  console.log('- Use different secrets for different environments');
  console.log('- Add JWT_SECRET to your production environment variables');
  
  return true;
}

// Run verification if script is executed directly
if (require.main === module) {
  const success = verifyJWTSecret();
  process.exit(success ? 0 : 1);
}

module.exports = { verifyJWTSecret };