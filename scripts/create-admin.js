const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking for admin user...');

    // Check if admin user exists using raw SQL
    const existingAdmin = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${'admin@nambakadai.com'}
    `;

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create admin user using raw SQL
    await prisma.$executeRaw`
      INSERT INTO "User" (name, email, password, role, "isVerified", phone, avatar, "createdAt", "updatedAt")
      VALUES (${'Admin User'}, ${'admin@nambakadai.com'}, ${hashedPassword}, 'ADMIN'::"Role", ${true}, ${'+91-9876543210'}, ${'/placeholder-user.jpg'}, NOW(), NOW())
    `;

    console.log('Admin user created successfully: admin@nambakadai.com');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();