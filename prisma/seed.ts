import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const plainPassword = '123456';

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Check if the admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping creation.');
  } else {
    // Create the admin user
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: email,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true, // Admins should be verified by default
        emailVerified: new Date(),
      },
    });
    console.log('Admin user created successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
