const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateStores() {
  try {
    console.log('Updating existing stores with slugs and publicKeys...');

    const stores = await prisma.store.findMany();

    for (const store of stores) {
      const slug = store.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      await prisma.store.update({
        where: { id: store.id },
        data: {
          slug: slug || `store-${store.id}`,
        }
      });

      console.log(`Updated store: ${store.name} -> ${slug}`);
    }

    console.log('✅ All stores updated successfully!');
  } catch (error) {
    console.error('❌ Error updating stores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateStores();