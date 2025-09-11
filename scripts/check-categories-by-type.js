const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategoriesByType() {
  try {
    console.log('🔍 Checking categories by type...\n');

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name_en: true,
        type: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`📊 Found ${categories.length} total categories:\n`);

    // Group by type
    const byType = categories.reduce((acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat);
      return acc;
    }, {});

    Object.keys(byType).forEach(type => {
      console.log(`\n${type} categories (${byType[type].length}):`);
      byType[type].forEach(cat => {
        console.log(`  ${cat.id}: ${cat.name_en}`);
      });
    });

    console.log('\n✅ Categories by type check completed');

  } catch (error) {
    console.error('❌ Error checking categories by type:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategoriesByType();