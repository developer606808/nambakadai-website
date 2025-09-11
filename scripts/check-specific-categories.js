const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSpecificCategories() {
  try {
    console.log('🔍 Checking for categories with IDs 77, 78, 79, 80...\n');

    const categories = await prisma.category.findMany({
      where: {
        id: { in: [77, 78, 79, 80] }
      },
      select: {
        id: true,
        name_en: true,
        slug: true
      }
    });

    console.log(`📊 Found ${categories.length} categories with those IDs:\n`);

    if (categories.length === 0) {
      console.log('❌ No categories found with IDs 77, 78, 79, 80');
    } else {
      categories.forEach(cat => {
        console.log(`${cat.id}: ${cat.name_en} (${cat.slug})`);
      });
    }

    console.log('\n✅ Specific categories check completed');

  } catch (error) {
    console.error('❌ Error checking specific categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecificCategories();