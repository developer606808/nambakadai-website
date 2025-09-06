const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProductsFiltering() {
  try {
    console.log('Testing products filtering...');

    // Check categories
    const categories = await prisma.category.findMany({
      where: { type: 'STORE' },
      take: 10
    });

    console.log('Categories:', categories.map(c => ({ id: c.id, name: c.name_en })));

    // Check products and their categories
    const products = await prisma.product.findMany({
      take: 20,
      include: {
        category: {
          select: {
            id: true,
            name_en: true
          }
        }
      }
    });

    console.log('Products with categories:');
    products.forEach(p => {
      console.log(`- ${p.title} -> Category: ${p.category?.name_en || 'No category'} (ID: ${p.categoryId})`);
    });

    // Test filtering by category
    if (categories.length > 0) {
      const categoryId = categories[0].id;
      console.log(`\nTesting filter by category ID: ${categoryId}`);

      const filteredProducts = await prisma.product.findMany({
        where: {
          categoryId: categoryId
        },
        include: {
          category: {
            select: {
              id: true,
              name_en: true
            }
          }
        }
      });

      console.log(`Products in category ${categories[0].name_en}:`, filteredProducts.length);
      filteredProducts.forEach(p => {
        console.log(`- ${p.title}`);
      });
    }

  } catch (error) {
    console.error('Error testing products filtering:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductsFiltering();