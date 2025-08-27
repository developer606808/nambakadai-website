const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'seeds' },
      update: {},
      create: {
        name: 'Seeds',
        slug: 'seeds',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fertilizers' },
      update: {},
      create: {
        name: 'Fertilizers',
        slug: 'fertilizers',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tools' },
      update: {},
      create: {
        name: 'Tools',
        slug: 'tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'machinery' },
      update: {},
      create: {
        name: 'Machinery',
        slug: 'machinery',
      },
    }),
  ]);

  // Create units
  const units = await Promise.all([
    prisma.unit.upsert({
      where: { name: 'Kilogram' },
      update: {},
      create: {
        name: 'Kilogram',
        symbol: 'kg',
      },
    }),
    prisma.unit.upsert({
      where: { name: 'Gram' },
      update: {},
      create: {
        name: 'Gram',
        symbol: 'g',
      },
    }),
    prisma.unit.upsert({
      where: { name: 'Piece' },
      update: {},
      create: {
        name: 'Piece',
        symbol: 'pc',
      },
    }),
    prisma.unit.upsert({
      where: { name: 'Liter' },
      update: {},
      create: {
        name: 'Liter',
        symbol: 'L',
      },
    }),
  ]);

  // Create states
  const states = await Promise.all([
    prisma.state.upsert({
      where: { name: 'Tamil Nadu' },
      update: {},
      create: {
        name: 'Tamil Nadu',
      },
    }),
    prisma.state.upsert({
      where: { name: 'Kerala' },
      update: {},
      create: {
        name: 'Kerala',
      },
    }),
  ]);

  // Get the created states to use their IDs
  const tamilNadu = await prisma.state.findUnique({ where: { name: 'Tamil Nadu' } });
  const kerala = await prisma.state.findUnique({ where: { name: 'Kerala' } });

  if (!tamilNadu || !kerala) {
    throw new Error('Failed to create states');
  }

  // Create cities
  const cities = await Promise.all([
    prisma.city.upsert({
      where: { name: 'Chennai' },
      update: {},
      create: {
        name: 'Chennai',
        stateId: tamilNadu.id,
      },
    }),
    prisma.city.upsert({
      where: { name: 'Coimbatore' },
      update: {},
      create: {
        name: 'Coimbatore',
        stateId: tamilNadu.id,
      },
    }),
    prisma.city.upsert({
      where: { name: 'Trivandrum' },
      update: {},
      create: {
        name: 'Trivandrum',
        stateId: kerala.id,
      },
    }),
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nambakadai.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@nambakadai.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Create seller user
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@nambakadai.com' },
    update: {},
    create: {
      name: 'Seller User',
      email: 'seller@nambakadai.com',
      password: sellerPassword,
      role: 'SELLER',
      isVerified: true,
    },
  });

  // Create buyer user
  const buyerPassword = await bcrypt.hash('buyer123', 10);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@nambakadai.com' },
    update: {},
    create: {
      name: 'Buyer User',
      email: 'buyer@nambakadai.com',
      password: buyerPassword,
      role: 'BUYER',
      isVerified: true,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });