// prisma/migrations-setup.js
const { execSync } = require('child_process');

try {
  console.log('Running Prisma migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Seeding database...');
  execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Error during database setup:', error.message);
  process.exit(1);
}