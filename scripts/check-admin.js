const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('Checking admin user...');

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nambakadai.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Name:', adminUser.name);
    console.log('👤 Role:', adminUser.role);
    console.log('✅ Verified:', adminUser.isVerified);
    console.log('🚫 Blocked:', adminUser.isBlocked);
    console.log('🔒 Password Hash:', adminUser.password);

    // Test password comparison
    const isValid = await bcrypt.compare('password123', adminUser.password);
    console.log('🔑 Password valid:', isValid);

  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();