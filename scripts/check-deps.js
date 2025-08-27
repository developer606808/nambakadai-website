#!/usr/bin/env node

// Dependency checker script
const fs = require('fs');
const path = require('path');

function checkDependencies() {
  console.log('Checking Nambakadai dependencies...\n');
  
  // Check if package.json exists
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.error('❌ node_modules directory not found. Run "pnpm install" first.');
    return false;
  }
  
  // Check critical dependencies
  const criticalDependencies = [
    'next',
    'react',
    'react-dom',
    '@prisma/client',
    'next-auth',
    'next-intl',
    'framer-motion',
    'zod',
    'mongoose',
    'bcryptjs',
    'qrcode'
  ];
  
  const missingDependencies = [];
  
  criticalDependencies.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (!fs.existsSync(depPath)) {
      missingDependencies.push(dep);
    }
  });
  
  if (missingDependencies.length > 0) {
    console.error('❌ Missing critical dependencies:');
    missingDependencies.forEach(dep => console.error(`  - ${dep}`));
    console.log('\nRun "pnpm install" to install missing dependencies.');
    return false;
  }
  
  // Check Prisma schema
  const prismaSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  if (!fs.existsSync(prismaSchemaPath)) {
    console.error('❌ Prisma schema not found');
    return false;
  }
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (!fs.existsSync(envPath) && !fs.existsSync(envExamplePath)) {
    console.error('❌ Environment file (.env or .env.example) not found');
    return false;
  }
  
  console.log('✅ All critical dependencies are present');
  console.log('✅ Prisma schema is present');
  console.log('✅ Environment file is present');
  console.log('\n🎉 Your development environment is ready!');
  
  return true;
}

if (require.main === module) {
  checkDependencies();
}

module.exports = { checkDependencies };