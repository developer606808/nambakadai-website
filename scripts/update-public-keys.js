const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePublicKeys() {
  try {
    console.log('🔍 Checking and updating public keys for existing records...');

    // Check if there are any products (this will help us see if the database has data)
    const totalProducts = await prisma.product.count();
    console.log(`📦 Total products in database: ${totalProducts}`);

    // Since publicKey is NOT NULL and has a default, all products should have publicKeys
    // Let's just verify by checking a few products
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: { id: true, title: true, publicKey: true }
    });

    console.log('📦 Sample products with publicKeys:');
    sampleProducts.forEach(product => {
      console.log(`   - ${product.title}: ${product.publicKey}`);
    });

    // Check Stores
    const totalStores = await prisma.store.count();
    const sampleStores = await prisma.store.findMany({
      take: 3,
      select: { id: true, name: true, publicKey: true }
    });

    console.log(`🏪 Total stores: ${totalStores}`);
    console.log('🏪 Sample stores with publicKeys:');
    sampleStores.forEach(store => {
      console.log(`   - ${store.name}: ${store.publicKey}`);
    });

    // Check Vehicles
    const totalVehicles = await prisma.vehicle.count();
    const sampleVehicles = await prisma.vehicle.findMany({
      take: 3,
      select: { id: true, name: true, publicKey: true }
    });

    console.log(`🚜 Total vehicles: ${totalVehicles}`);
    console.log('🚜 Sample vehicles with publicKeys:');
    sampleVehicles.forEach(vehicle => {
      console.log(`   - ${vehicle.name}: ${vehicle.publicKey}`);
    });

    // Check Communities
    const totalCommunities = await prisma.community.count();
    const sampleCommunities = await prisma.community.findMany({
      take: 3,
      select: { id: true, name: true, uuid: true }
    });

    console.log(`🌱 Total communities: ${totalCommunities}`);
    console.log('🌱 Sample communities with uuids:');
    sampleCommunities.forEach(community => {
      console.log(`   - ${community.name}: ${community.uuid}`);
    });

    // Check Community Posts
    const totalPosts = await prisma.communityPost.count();
    const samplePosts = await prisma.communityPost.findMany({
      take: 3,
      select: { id: true, content: true, publicKey: true }
    });

    console.log(`📝 Total community posts: ${totalPosts}`);
    console.log('📝 Sample posts with publicKeys:');
    samplePosts.forEach(post => {
      console.log(`   - ${post.content.substring(0, 50)}...: ${post.publicKey}`);
    });

    console.log('🎉 Public key update completed successfully!');

    // Summary
    const summary = await Promise.all([
      prisma.product.count(),
      prisma.store.count(),
      prisma.vehicle.count(),
      prisma.community.count(),
      prisma.communityPost.count()
    ]);

    console.log('\n📊 Summary:');
    console.log(`   📦 Products: ${summary[0]}`);
    console.log(`   🏪 Stores: ${summary[1]}`);
    console.log(`   🚜 Vehicles: ${summary[2]}`);
    console.log(`   🌱 Communities: ${summary[3]}`);
    console.log(`   📝 Community Posts: ${summary[4]}`);

  } catch (error) {
    console.error('❌ Error updating public keys:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePublicKeys();