const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log('Testing database connection...');

    // Test products
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 5,
    });

    console.log(`Found ${products.length} featured products:`);
    products.forEach(product => {
      console.log(`- ${product.title} (${product.price})`);
    });

    // Test vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE',
      },
      take: 5,
    });

    console.log(`Found ${vehicles.length} available vehicles:`);
    vehicles.forEach(vehicle => {
      console.log(`- ${vehicle.name} (${vehicle.pricePerDay || vehicle.pricePerHour})`);
    });

    // Test stores
    const stores = await prisma.store.findMany({
      where: {
        isApproved: true,
        isBlocked: false,
      },
      take: 5,
    });

    console.log(`Found ${stores.length} approved stores:`);
    stores.forEach(store => {
      console.log(`- ${store.name}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();