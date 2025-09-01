const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSubcategories() {
  try {
    console.log('Checking for subcategories in database...');

    // Check all categories
    const allCategories = await prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    console.log(`\nTotal categories: ${allCategories.length}`);
    allCategories.forEach(cat => {
      console.log(`- ${cat.name_en} (ID: ${cat.id}, Parent: ${cat.parentId}, Children: ${cat.children.length}, Products: ${cat._count.products})`);
      if (cat.children.length > 0) {
        cat.children.forEach(child => {
          console.log(`  └─ ${child.name_en} (ID: ${child.id})`);
        });
      }
    });

    // Check if there are any categories with parentId not null
    const subcategories = await prisma.category.findMany({
      where: {
        parentId: {
          not: null
        }
      }
    });

    console.log(`\nSubcategories found: ${subcategories.length}`);
    if (subcategories.length > 0) {
      subcategories.forEach(sub => {
        console.log(`- ${sub.name_en} (Parent ID: ${sub.parentId})`);
      });
    } else {
      console.log('No subcategories found in database.');
    }

  } catch (error) {
    console.error('Error checking subcategories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubcategories();