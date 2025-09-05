import { PrismaClient, Role, CategoryType, CommunityPrivacy, MemberRole, CommunityPostType, VehicleType, VehicleFuelType, VehicleStatus, DemandFrequency, ContactMethod, DemandStatus, OfferReason } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for users
  const hashedPassword = await hash('password123', 12);

  // Create Users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@nambakadai.com',
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
        phone: '+91-9876543210',
        avatar: '/placeholder-user.jpg'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Rajesh Kumar',
        email: 'rajesh.farmer@nambakadai.com',
        password: hashedPassword,
        role: Role.SELLER,
        isVerified: true,
        phone: '+91-9876543211',
        avatar: '/placeholder-user.jpg'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya.buyer@nambakadai.com',
        password: hashedPassword,
        role: Role.BUYER,
        isVerified: true,
        phone: '+91-9876543212',
        avatar: '/placeholder-user.jpg'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Amit Singh',
        email: 'amit.farmer@nambakadai.com',
        password: hashedPassword,
        role: Role.SELLER,
        isVerified: true,
        phone: '+91-9876543213',
        avatar: '/placeholder-user.jpg'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sunita Patel',
        email: 'sunita.buyer@nambakadai.com',
        password: hashedPassword,
        role: Role.BUYER,
        isVerified: true,
        phone: '+91-9876543214',
        avatar: '/placeholder-user.jpg'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create States
  console.log('🏛️ Creating states...');
  const states = await Promise.all([
    prisma.state.create({
      data: {
        name_en: 'Tamil Nadu',
        name_ta: 'தமிழ்நாடு',
        stateCode: 'TN'
      }
    }),
    prisma.state.create({
      data: {
        name_en: 'Karnataka',
        name_ta: 'கர்நாடக',
        stateCode: 'KA'
      }
    }),
    prisma.state.create({
      data: {
        name_en: 'Andhra Pradesh',
        name_ta: 'ஆந்திரப் பிரதேசம்',
        stateCode: 'AP'
      }
    })
  ]);

  console.log(`✅ Created ${states.length} states`);

  // Create Cities
  console.log('🏙️ Creating cities...');
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        name_en: 'Chennai',
        name_ta: 'சென்னை',
        stateId: states[0].id
      }
    }),
    prisma.city.create({
      data: {
        name_en: 'Coimbatore',
        name_ta: 'கோயம்புத்தூர்',
        stateId: states[0].id
      }
    }),
    prisma.city.create({
      data: {
        name_en: 'Bangalore',
        name_ta: 'பெங்களூர்',
        stateId: states[1].id
      }
    }),
    prisma.city.create({
      data: {
        name_en: 'Hyderabad',
        name_ta: 'ஹைதராபாத்',
        stateId: states[2].id
      }
    })
  ]);

  console.log(`✅ Created ${cities.length} cities`);

  // Create Units
  console.log('⚖️ Creating units...');
  const units = await Promise.all([
    prisma.unit.create({
      data: {
        name_en: 'Kilogram',
        name_ta: 'கிலோகிராம்',
        symbol: 'kg'
      }
    }),
    prisma.unit.create({
      data: {
        name_en: 'Quintal',
        name_ta: 'குவிண்டால்',
        symbol: 'q'
      }
    }),
    prisma.unit.create({
      data: {
        name_en: 'Ton',
        name_ta: 'டன்',
        symbol: 't'
      }
    }),
    prisma.unit.create({
      data: {
        name_en: 'Piece',
        name_ta: 'துண்டு',
        symbol: 'pc'
      }
    })
  ]);

  console.log(`✅ Created ${units.length} units`);

  // Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name_en: 'Rice',
        name_ta: 'அரிசி',
        slug: 'rice',
        type: CategoryType.STORE,
        icon: '🌾'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Vegetables',
        name_ta: 'காய்கறிகள்',
        slug: 'vegetables',
        type: CategoryType.STORE,
        icon: '🥕'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Fruits',
        name_ta: 'பழங்கள்',
        slug: 'fruits',
        type: CategoryType.STORE,
        icon: '🍎'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Spices',
        name_ta: 'மசாலாப் பொருட்கள்',
        slug: 'spices',
        type: CategoryType.STORE,
        icon: '🌶️'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Organic Products',
        name_ta: 'உரமாக்க பொருட்கள்',
        slug: 'organic-products',
        type: CategoryType.STORE,
        icon: '🌱'
      }
    }),
    // RENTAL Categories
    prisma.category.create({
      data: {
        name_en: 'Tractor',
        name_ta: 'டிராக்டர்',
        slug: 'tractor-rental',
        type: CategoryType.RENTAL,
        icon: '🚜'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Mini Truck',
        name_ta: 'மினி டிரக்',
        slug: 'mini-truck-rental',
        type: CategoryType.RENTAL,
        icon: '🚛'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Harvesting Machine',
        name_ta: 'அறுவடை இயந்திரம்',
        slug: 'harvesting-machine-rental',
        type: CategoryType.RENTAL,
        icon: '🚜'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Sprayer',
        name_ta: 'தெளிப்பான்',
        slug: 'sprayer-rental',
        type: CategoryType.RENTAL,
        icon: '💧'
      }
    }),
    prisma.category.create({
      data: {
        name_en: 'Cultivator',
        name_ta: 'கல்வி இயந்திரம்',
        slug: 'cultivator-rental',
        type: CategoryType.RENTAL,
        icon: '🌾'
      }
    })
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Unit-Category relationships
  console.log('🔗 Creating unit-category relationships...');
  await Promise.all([
    prisma.unitCategory.create({ data: { unitId: units[0].id, categoryId: categories[0].id } }),
    prisma.unitCategory.create({ data: { unitId: units[0].id, categoryId: categories[1].id } }),
    prisma.unitCategory.create({ data: { unitId: units[0].id, categoryId: categories[2].id } }),
    prisma.unitCategory.create({ data: { unitId: units[0].id, categoryId: categories[3].id } }),
    prisma.unitCategory.create({ data: { unitId: units[1].id, categoryId: categories[0].id } }),
    prisma.unitCategory.create({ data: { unitId: units[1].id, categoryId: categories[4].id } })
  ]);

  // Create Stores
  console.log('🏪 Creating stores...');
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Rajesh Organic Farm',
        slug: 'rajesh-organic-farm',
        description: 'Premium organic rice and vegetables from our family farm',
        address: '123 Farm Road, Coimbatore, Tamil Nadu',
        phone: '+91-9876543211',
        email: 'contact@rajeshfarm.com',
        logo: '/placeholder-logo.png',
        banner: '/placeholder.jpg',
        userId: users[1].id,
        isApproved: true,
        contactName: 'Rajesh Kumar',
        stateId: states[0].id,
        cityId: cities[1].id,
        pincode: '641001'
      }
    }),
    prisma.store.create({
      data: {
        name: 'Amit Spice House',
        slug: 'amit-spice-house',
        description: 'Authentic Indian spices and masalas',
        address: '456 Spice Market, Bangalore, Karnataka',
        phone: '+91-9876543213',
        email: 'info@amitspices.com',
        logo: '/placeholder-logo.png',
        banner: '/placeholder.jpg',
        userId: users[3].id,
        isApproved: true,
        contactName: 'Amit Singh',
        stateId: states[1].id,
        cityId: cities[2].id,
        pincode: '560001'
      }
    })
  ]);

  console.log(`✅ Created ${stores.length} stores`);

  // Create Products
  console.log('📦 Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Premium Basmati Rice',
        description: 'Long grain aromatic basmati rice, organically grown',
        price: 120.00,
        images: ['/placeholder.jpg', '/placeholder.jpg'],
        categoryId: categories[0].id,
        storeId: stores[0].id,
        userId: users[1].id,
        stateId: states[0].id,
        cityId: cities[1].id,
        unitId: units[0].id,
        slug: 'premium-basmati-rice',
        stock: 500,
        adId: 'AD_RICE_001',
        isFeatured: true
      }
    }),
    prisma.product.create({
      data: {
        title: 'Fresh Tomatoes',
        description: 'Vine-ripened organic tomatoes, perfect for cooking',
        price: 40.00,
        images: ['/placeholder.jpg'],
        categoryId: categories[1].id,
        storeId: stores[0].id,
        userId: users[1].id,
        stateId: states[0].id,
        cityId: cities[1].id,
        unitId: units[0].id,
        slug: 'fresh-tomatoes',
        stock: 200,
        adId: 'AD_TOMATO_001',
        isFeatured: true
      }
    }),
    prisma.product.create({
      data: {
        title: 'Organic Turmeric Powder',
        description: 'Pure organic turmeric powder, no additives',
        price: 85.00,
        images: ['/placeholder.jpg'],
        categoryId: categories[3].id,
        storeId: stores[1].id,
        userId: users[3].id,
        stateId: states[1].id,
        cityId: cities[2].id,
        unitId: units[0].id,
        slug: 'organic-turmeric-powder',
        stock: 150,
        adId: 'AD_TURMERIC_001'
      }
    }),
    prisma.product.create({
      data: {
        title: 'Fresh Mangoes',
        description: 'Sweet and juicy Alphonso mangoes from our orchard',
        price: 180.00,
        images: ['/placeholder.jpg'],
        categoryId: categories[2].id,
        storeId: stores[0].id,
        userId: users[1].id,
        stateId: states[0].id,
        cityId: cities[0].id,
        unitId: units[0].id,
        slug: 'fresh-mangoes',
        stock: 100,
        adId: 'AD_MANGO_001',
        isFeatured: true
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create Communities
  console.log('🌱 Creating communities...');
  const communities = await Promise.all([
    prisma.community.create({
      data: {
        name: 'Organic Farmers Tamil Nadu',
        description: 'A community for organic farmers in Tamil Nadu to share knowledge and best practices',
        image: '/placeholder-logo.png',
        banner: '/placeholder.jpg',
        category: 'Organic Farming',
        location: 'Tamil Nadu',
        memberCount: 2,
        postCount: 0,
        isVerified: true
      }
    }),
    prisma.community.create({
      data: {
        name: 'Rice Cultivation Experts',
        description: 'Share experiences and techniques for successful rice cultivation',
        image: '/placeholder-logo.png',
        banner: '/placeholder.jpg',
        category: 'Rice Farming',
        location: 'South India',
        memberCount: 1,
        postCount: 0,
        isVerified: true
      }
    })
  ]);

  console.log(`✅ Created ${communities.length} communities`);

  // Add community members
  console.log('👥 Adding community members...');
  await Promise.all([
    prisma.communityMember.create({
      data: {
        communityId: communities[0].id,
        userId: users[1].id,
        role: MemberRole.ADMIN
      }
    }),
    prisma.communityMember.create({
      data: {
        communityId: communities[0].id,
        userId: users[3].id,
        role: MemberRole.MEMBER
      }
    }),
    prisma.communityMember.create({
      data: {
        communityId: communities[1].id,
        userId: users[1].id,
        role: MemberRole.ADMIN
      }
    })
  ]);

  // Create Community Posts
  console.log('📝 Creating community posts...');
  const posts = await Promise.all([
    prisma.communityPost.create({
      data: {
        content: 'Welcome to our organic farming community! Let\'s share our experiences and help each other grow better crops.',
        type: CommunityPostType.TEXT,
        communityId: communities[0].id,
        userId: users[1].id,
        likeCount: 2,
        commentCount: 0
      }
    }),
    prisma.communityPost.create({
      data: {
        content: 'What are your best practices for pest control in organic rice farming?',
        type: CommunityPostType.TEXT,
        communityId: communities[1].id,
        userId: users[1].id,
        likeCount: 1,
        commentCount: 0
      }
    })
  ]);

  console.log(`✅ Created ${posts.length} community posts`);

  // Create Vehicles
  console.log('🚜 Creating vehicles...');
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        name: 'Mahindra 575 DI Tractor',
        slug: 'mahindra-575-di-tractor',
        description: 'Powerful 47 HP tractor perfect for small to medium farms',
        type: VehicleType.TRACTOR,
        category: 'Tractor',
        pricePerHour: 500.00,
        capacity: '47 HP',
        fuelType: VehicleFuelType.DIESEL,
        location: 'Coimbatore, Tamil Nadu',
        features: ['Power Steering', 'Oil Immersed Brakes', 'Mobile Charger'],
        images: ['/placeholder.jpg'],
        status: VehicleStatus.AVAILABLE,
        userId: users[1].id,
        horsepower: 47,
        minimumHours: 4,
        operatorIncluded: true,
        adId: 'VEH_TRACTOR_001'
      }
    }),
    prisma.vehicle.create({
      data: {
        name: 'Tata Ace Mini Truck',
        slug: 'tata-ace-mini-truck',
        description: 'Compact mini truck for transporting goods and agricultural produce',
        type: VehicleType.TRUCK,
        category: 'Mini Truck',
        pricePerHour: 300.00,
        capacity: '1.5 Ton',
        fuelType: VehicleFuelType.DIESEL,
        location: 'Chennai, Tamil Nadu',
        features: ['Air Conditioning', 'Power Steering', 'Cargo Area'],
        images: ['/placeholder.jpg'],
        status: VehicleStatus.AVAILABLE,
        userId: users[3].id,
        minimumHours: 4,
        operatorIncluded: true,
        adId: 'VEH_TRUCK_001'
      }
    })
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Create Banners
  console.log('📢 Creating banners...');
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Welcome to Nambakadai',
        image: '/placeholder.jpg',
        url: '/categories',
        position: 1,
        isActive: true
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Fresh Organic Products',
        image: '/placeholder.jpg',
        url: '/products?category=organic-products',
        position: 2,
        isActive: true
      }
    })
  ]);

  console.log(`✅ Created ${banners.length} banners`);

  // Create Demand Posts
  console.log('📋 Creating demand posts...');
  const demandPosts = await Promise.all([
    prisma.demandPost.create({
      data: {
        title: 'Looking for Organic Tomatoes',
        description: 'Need 500kg of organic tomatoes for restaurant supply',
        productName: 'Organic Tomatoes',
        quantity: '500 kg',
        frequency: DemandFrequency.WEEKLY,
        location: 'Chennai, Tamil Nadu',
        contactMethod: ContactMethod.WHATSAPP,
        tags: ['organic', 'tomatoes', 'restaurant'],
        isUrgent: true,
        images: [],
        budget: 25000.00,
        status: DemandStatus.ACTIVE,
        userId: users[2].id
      }
    }),
    prisma.demandPost.create({
      data: {
        title: 'Bulk Rice Order',
        description: 'Restaurant chain looking for premium basmati rice - 2 tons monthly',
        productName: 'Basmati Rice',
        quantity: '2 tons',
        frequency: DemandFrequency.MONTHLY,
        location: 'Bangalore, Karnataka',
        contactMethod: ContactMethod.CALL,
        tags: ['basmati', 'rice', 'bulk'],
        isUrgent: false,
        images: [],
        budget: 240000.00,
        status: DemandStatus.ACTIVE,
        userId: users[4].id
      }
    })
  ]);

  console.log(`✅ Created ${demandPosts.length} demand posts`);

  // Create Offers
  console.log('🏷️ Creating offers...');
  const offers = await Promise.all([
    prisma.offer.create({
      data: {
        title: 'Organic Rice Special Offer',
        description: '20% discount on premium basmati rice - limited time offer!',
        productId: products[0].id,
        originalPrice: 120.00,
        offerPrice: 96.00,
        discountPercent: 20.0,
        quantity: '100 kg minimum',
        location: 'Coimbatore, Tamil Nadu',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true,
        tags: ['organic', 'rice', 'discount'],
        reason: OfferReason.SEASONAL_PEAK,
        sellerId: users[1].id
      }
    }),
    prisma.offer.create({
      data: {
        title: 'Fresh Mango Season Sale',
        description: 'Sweet Alphonso mangoes at special prices - harvest season!',
        productId: products[3].id,
        originalPrice: 180.00,
        offerPrice: 144.00,
        discountPercent: 20.0,
        quantity: '50 kg minimum',
        location: 'Chennai, Tamil Nadu',
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isActive: true,
        tags: ['mangoes', 'seasonal', 'fresh'],
        reason: OfferReason.SURPLUS_HARVEST,
        sellerId: users[1].id
      }
    })
  ]);

  console.log(`✅ Created ${offers.length} offers`);

  // Create Wishlist items
  console.log('❤️ Creating wishlist items...');
  await Promise.all([
    prisma.wishlist.create({
      data: {
        userId: users[2].id,
        productId: products[0].id
      }
    }),
    prisma.wishlist.create({
      data: {
        userId: users[4].id,
        productId: products[2].id
      }
    })
  ]);

  // Create Store Followers
  console.log('👥 Creating store followers...');
  await Promise.all([
    prisma.followStore.create({
      data: {
        userId: users[2].id,
        storeId: stores[0].id
      }
    }),
    prisma.followStore.create({
      data: {
        userId: users[4].id,
        storeId: stores[1].id
      }
    })
  ]);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   🏛️ States: ${states.length}`);
  console.log(`   🏙️ Cities: ${cities.length}`);
  console.log(`   ⚖️ Units: ${units.length}`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   🏪 Stores: ${stores.length}`);
  console.log(`   📦 Products: ${products.length}`);
  console.log(`   🌱 Communities: ${communities.length}`);
  console.log(`   🚜 Vehicles: ${vehicles.length}`);
  console.log(`   📢 Banners: ${banners.length}`);
  console.log(`   📋 Demand Posts: ${demandPosts.length}`);
  console.log(`   🏷️ Offers: ${offers.length}`);
  console.log(`   📝 Community Posts: ${posts.length}`);

  console.log('\n🔐 Default login credentials:');
  console.log('   Admin: admin@nambakadai.com / password123');
  console.log('   Seller: rajesh.farmer@nambakadai.com / password123');
  console.log('   Buyer: priya.buyer@nambakadai.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
