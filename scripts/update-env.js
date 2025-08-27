#!/usr/bin/env node

// Update .env file with generated secrets
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function updateEnvFile() {
  console.log('🔐 Updating .env file with secure secrets...\\n');
  
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      console.log('📋 Creating .env file from .env.example...');
      fs.copyFileSync(envExamplePath, envPath);
    } else {
      console.error('❌ Neither .env nor .env.example file found');
      process.exit(1);
    }
  }
  
  // Read the .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Generate a secure NEXTAUTH_SECRET
  const nextAuthSecret = generateSecret(32);
  
  // Update the NEXTAUTH_SECRET in the .env file
  const nextAuthSecretRegex = /^NEXTAUTH_SECRET=.*$/m;
  if (nextAuthSecretRegex.test(envContent)) {
    envContent = envContent.replace(nextAuthSecretRegex, `NEXTAUTH_SECRET=${nextAuthSecret}`);
  } else {
    // If NEXTAUTH_SECRET doesn't exist, add it
    envContent += `\n# NextAuth - Generated secret\nNEXTAUTH_SECRET=${nextAuthSecret}\n`;
  }
  
  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env file updated successfully!');
  console.log(`🔑 NEXTAUTH_SECRET: ${nextAuthSecret}`);
  console.log('\n⚠️  Remember to keep these secrets secure and never commit them to version control.');
  console.log('⚠️  Update other secrets in the .env file as needed for your environment.');
}

if (require.main === module) {
  updateEnvFile();
}

module.exports = { updateEnvFile };