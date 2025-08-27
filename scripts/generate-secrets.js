#!/usr/bin/env node

// Generate secure secrets script
const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateNextAuthSecret() {
  return generateSecret(32);
}

function generateAllSecrets() {
  console.log('🔐 Generating secure secrets for Nambakadai...\\n');
  
  const nextAuthSecret = generateNextAuthSecret();
  
  console.log('NEXTAUTH_SECRET:');
  console.log(nextAuthSecret);
  console.log();
  
  console.log('📝 Update your .env file with these secrets:');
  console.log();
  console.log('# NextAuth - Generated secret');
  console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
  console.log();
  console.log('✅ Secrets generated successfully!');
  console.log('⚠️  Remember to keep these secrets secure and never commit them to version control.');
}

if (require.main === module) {
  generateAllSecrets();
}

module.exports = { generateSecret, generateNextAuthSecret, generateAllSecrets };
