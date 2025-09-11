const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('🔍 Checking existing categories...\n');

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name_en: true,
        name_ta: true,
        name_hi: true,
        slug: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`📊 Found ${categories.length} categories:\n`);

    categories.forEach(cat => {
      console.log(`${cat.id}: ${cat.name_en} (${cat.slug})`);
    });

    console.log('\n✅ Categories check completed');

  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();