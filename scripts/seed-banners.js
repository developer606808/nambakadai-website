const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBanners() {
  try {
    console.log('🌱 Seeding banners...');

    // Clear existing banners
    await prisma.banner.deleteMany();
    console.log('🗑️ Cleared existing banners');

    // Create sample banners with placeholder images
    const banners = [
      {
        title: 'Fresh Organic Vegetables',
        image: '/placeholder.svg?height=500&width=1200&text=Fresh+Vegetables',
        url: '/categories/vegetables',
        position: 1,
        isActive: true,
      },
      {
        title: 'Premium Quality Fruits',
        image: '/placeholder.svg?height=500&width=1200&text=Premium+Fruits',
        url: '/categories/fruits',
        position: 2,
        isActive: true,
      },
      {
        title: 'Farm Fresh Dairy Products',
        image: '/placeholder.svg?height=500&width=1200&text=Dairy+Products',
        url: '/categories/dairy',
        position: 3,
        isActive: true,
      },
    ];

    for (const banner of banners) {
      const created = await prisma.banner.create({
        data: banner,
      });
      console.log(`✅ Created banner: ${created.title} (ID: ${created.id})`);
    }

    console.log('🎉 Banner seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanners();
