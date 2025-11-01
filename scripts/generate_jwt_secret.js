#!/usr/bin/env node

/**
 * JWT Secret Generator
 * 
 * This script generates a cryptographically secure JWT secret
 * for use in production environments.
 */

const crypto = require('crypto');

function generateJWTSecret() {
  // Generate 32 random bytes and encode as base64
  const secret = crypto.randomBytes(32).toString('base64');
  return secret;
}

function generateMultipleSecrets(count = 3) {
  console.log('🔐 JWT Secret Generator\n');
  console.log('Generated secure JWT secrets (choose one):');
  console.log('=' .repeat(50));
  
  for (let i = 1; i <= count; i++) {
    const secret = generateJWTSecret();
    console.log(`${i}. JWT_SECRET=${secret}`);
  }
  
  console.log('\n📋 Instructions:');
  console.log('1. Copy one of the secrets above');
  console.log('2. Add it to your .env file');
  console.log('3. For production, use a different secret than development');
  console.log('4. Never commit JWT secrets to version control');
  console.log('\n🔒 Security Notes:');
  console.log('- Each secret is 256 bits (32 bytes) of entropy');
  console.log('- Secrets are base64 encoded for easy storage');
  console.log('- Use different secrets for different environments');
}

// Check if running directly
if (require.main === module) {
  generateMultipleSecrets();
}

module.exports = { generateJWTSecret, generateMultipleSecrets };