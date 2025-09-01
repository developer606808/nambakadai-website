const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateFeaturedProducts() {
  try {
    console.log('Updating products to be featured...');

    // Update first 3 products to be featured
    const products = await prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { isFeatured: true }
      });
      console.log(`Updated product ${product.title} to be featured`);
    }

    console.log('✅ Featured products updated successfully!');
  } catch (error) {
    console.error('❌ Error updating featured products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFeaturedProducts();