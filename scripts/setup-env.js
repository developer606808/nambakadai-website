#!/usr/bin/env node

// Environment setup script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  console.log('🚀 Setting up Nambakadai development environment...\n');
  
  try {
    // Check if pnpm is available
    execSync('pnpm --version', { stdio: 'ignore' });
    console.log('✅ pnpm is available');
  } catch (error) {
    console.error('❌ pnpm is not installed. Please install pnpm first:');
    console.error('   npm install -g pnpm');
    process.exit(1);
  }
  
  // Check if .env file exists, if not copy from .env.example
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env file from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
  } else if (!fs.existsSync(envPath) && !fs.existsSync(envExamplePath)) {
    console.error('❌ Neither .env nor .env.example file found');
    process.exit(1);
  } else {
    console.log('✅ Environment file is present');
  }
  
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  // Generate Prisma client
  console.log('\n🔧 Generating Prisma client...');
  try {
    execSync('pnpm generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client');
    process.exit(1);
  }
  
  console.log('\n🎉 Development environment setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update .env file with your database credentials');
  console.log('2. Run database migrations: pnpm migrate');
  console.log('3. Seed the database: pnpm seed');
  console.log('4. Start the development server: pnpm dev');
}

if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };