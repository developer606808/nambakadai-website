const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRatings() {
  try {
    console.log('Testing ratings functionality...');

    // Get a store to test with
    const store = await (prisma as any).store.findFirst({
      select: { id: true, publicKey: true, name: true }
    });

    if (!store) {
      console.log('No stores found in database');
      return;
    }

    console.log('Testing with store:', store.name, 'PublicKey:', store.publicKey);

    // Test GET ratings
    console.log('\n1. Testing GET ratings...');
    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${ratings.length} ratings for store`);

    // Test creating a rating
    console.log('\n2. Testing rating creation...');

    // Get a user to test with
    const user = await prisma.user.findFirst({
      select: { id: true, name: true }
    });

    if (!user) {
      console.log('No users found in database');
      return;
    }

    console.log('Testing with user:', user.name);

    // Check if user already rated this store
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: user.id,
        storeId: store.id
      }
    });

    if (existingRating) {
      console.log('User already rated this store, updating...');
      const updatedRating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          value: 4,
          comment: 'Updated test rating from script'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
      console.log('Updated rating:', updatedRating);
    } else {
      console.log('Creating new rating...');
      const newRating = await prisma.rating.create({
        data: {
          value: 5,
          comment: 'Test rating from script',
          userId: user.id,
          storeId: store.id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
      console.log('Created rating:', newRating);
    }

    // Test GET ratings again
    console.log('\n3. Testing GET ratings after creation...');
    const updatedRatings = await prisma.rating.findMany({
      where: { storeId: store.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Now found ${updatedRatings.length} ratings for store`);

    // Calculate average rating
    const totalRatings = updatedRatings.length;
    const averageRating = totalRatings > 0
      ? updatedRatings.reduce((sum: number, rating: any) => sum + rating.value, 0) / totalRatings
      : 0;

    console.log(`Average rating: ${averageRating.toFixed(1)} (${totalRatings} reviews)`);

  } catch (error) {
    console.error('Error testing ratings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRatings();