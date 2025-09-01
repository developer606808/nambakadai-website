const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateStoreSlugs() {
  try {
    console.log('🔍 Generating slugs for stores...');

    // Get all stores
    const stores = await prisma.store.findMany({
      select: { id: true, name: true, slug: true }
    });

    console.log(`Found ${stores.length} stores`);

    for (const store of stores) {
      if (!store.slug || store.slug.trim() === '') {
        // Generate slug from store name
        const baseSlug = store.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();

        let slug = baseSlug;
        let counter = 1;

        // Check if slug already exists
        while (await prisma.store.findFirst({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Update the store with the new slug
        await prisma.store.update({
          where: { id: store.id },
          data: { slug }
        });

        console.log(`✅ Updated store "${store.name}" with slug: ${slug}`);
      } else {
        console.log(`⏭️  Store "${store.name}" already has slug: ${store.slug}`);
      }
    }

    console.log('🎉 Store slug generation completed!');

  } catch (error) {
    console.error('❌ Error generating store slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateStoreSlugs();