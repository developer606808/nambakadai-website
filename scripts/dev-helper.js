#!/usr/bin/env node

// Development helper script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commands = {
  'dev': 'pnpm dev',
  'build': 'pnpm build',
  'start': 'pnpm start',
  'migrate': 'npx prisma migrate dev',
  'generate': 'npx prisma generate',
  'seed': 'npx ts-node prisma/seed.ts',
  'test': 'pnpx jest',
  'lint': 'pnpm lint',
  'clean': 'rm -rf .next node_modules/.cache',
  'reset-db': 'npx prisma migrate reset',
  'studio': 'npx prisma studio'
};

function showHelp() {
  console.log('Nambakadai Development Helper');
  console.log('============================');
  console.log('Available commands:');
  Object.keys(commands).forEach(cmd => {
    console.log(`  ${cmd} - ${commands[cmd]}`);
  });
}

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0];
  
  if (command === 'help') {
    showHelp();
    return;
  }
  
  if (commands[command]) {
    runCommand(commands[command]);
  } else {
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { commands };