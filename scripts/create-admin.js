const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const adminUser = await prisma.user.upsert({
      where: { email: 'administrator@nambakadai.com' },
      update: {
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        phone: '+91-9876543210',
      },
      create: {
        name: 'Administrator',
        email: 'administrator@nambakadai.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        phone: '+91-9876543210',
        avatar: '/placeholder-user.jpg'
      }
    });

    console.log('✅ Admin user created/updated successfully!');
    console.log('📧 Email: administrator@nambakadai.com');
    console.log('🔑 Password: password123');
    console.log('👤 Role: ADMIN');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();