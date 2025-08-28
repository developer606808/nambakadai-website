import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: 'SELLER',
      phone: '+91 9876543210',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword',
      role: 'BUYER',
      phone: '+91 9876543211',
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@nambakadai.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      phone: '+91 9876543212',
    },
  })

  console.log('✅ Users created')

  // Create sample states
  const tamilNadu = await prisma.state.create({
    data: {
      name_en: 'Tamil Nadu',
      name_ta: 'தமிழ்நாடு',
      name_hi: 'तमिल नाडु',
      stateCode: 'TN',
    },
  })

  const kerala = await prisma.state.create({
    data: {
      name_en: 'Kerala',
      name_ta: 'கேரளா',
      name_hi: 'केरल',
      stateCode: 'KL',
    },
  })

  console.log('✅ States created')

  // Create sample cities
  const chennai = await prisma.city.create({
    data: {
      name_en: 'Chennai',
      name_ta: 'சென்னை',
      name_hi: 'चेन्नई',
      stateId: tamilNadu.id,
    },
  })

  const coimbatore = await prisma.city.create({
    data: {
      name_en: 'Coimbatore',
      name_ta: 'கோயம்புத்தூர்',
      name_hi: 'कोयंबटूर',
      stateId: tamilNadu.id,
    },
  })

  const kochi = await prisma.city.create({
    data: {
      name_en: 'Kochi',
      name_ta: 'கொச்சி',
      name_hi: 'कोच्चि',
      stateId: kerala.id,
    },
  })

  console.log('✅ Cities created')

  // Create sample units
  const kg = await prisma.unit.create({
    data: {
      name_en: 'Kilogram',
      name_ta: 'கிலோகிராம்',
      name_hi: 'किलोग्राम',
      symbol: 'kg',
    },
  })

  const piece = await prisma.unit.create({
    data: {
      name_en: 'Piece',
      name_ta: 'துண்டு',
      name_hi: 'टुकड़ा',
      symbol: 'pc',
    },
  })

  const liter = await prisma.unit.create({
    data: {
      name_en: 'Liter',
      name_ta: 'லிட்டர்',
      name_hi: 'लीटर',
      symbol: 'L',
    },
  })

  const gram = await prisma.unit.create({
    data: {
      name_en: 'Gram',
      name_ta: 'கிராம்',
      name_hi: 'ग्राम',
      symbol: 'g',
    },
  })

  console.log('✅ Units created')

  // Create sample categories
  const vegetables = await prisma.category.create({
    data: {
      name_en: 'Vegetables',
      name_ta: 'காய்கறிகள்',
      name_hi: 'सब्जियां',
      slug: 'vegetables',
      image: '/images/categories/vegetables.jpg',
      type: 'STORE',
    },
  })

  const fruits = await prisma.category.create({
    data: {
      name_en: 'Fruits',
      name_ta: 'பழங்கள்',
      name_hi: 'फल',
      slug: 'fruits',
      image: '/images/categories/fruits.jpg',
      type: 'STORE',
    },
  })

  const dairy = await prisma.category.create({
    data: {
      name_en: 'Dairy Products',
      name_ta: 'பால் பொருட்கள்',
      name_hi: 'डेयरी उत्पाद',
      slug: 'dairy',
      image: '/images/categories/dairy.jpg',
      type: 'STORE',
    },
  })

  const grains = await prisma.category.create({
    data: {
      name_en: 'Grains & Cereals',
      name_ta: 'தானியங்கள்',
      name_hi: 'अनाज',
      slug: 'grains',
      image: '/images/categories/grains.jpg',
      type: 'STORE',
    },
  })

  // Create subcategories
  const leafyVegetables = await prisma.category.create({
    data: {
      name_en: 'Leafy Vegetables',
      name_ta: 'இலைக் காய்கறிகள்',
      name_hi: 'पत्तेदार सब्जियां',
      slug: 'leafy-vegetables',
      parentId: vegetables.id,
      type: 'STORE',
    },
  })

  const rootVegetables = await prisma.category.create({
    data: {
      name_en: 'Root Vegetables',
      name_ta: 'வேர் காய்கறிகள்',
      name_hi: 'जड़ सब्जियां',
      slug: 'root-vegetables',
      parentId: vegetables.id,
      type: 'STORE',
    },
  })

  console.log('✅ Categories created')

  // Create sample stores
  const freshFarmStore = await prisma.store.create({
    data: {
      name: 'Fresh Farm Store',
      description: 'Organic vegetables and fruits directly from local farmers',
      logo: '/images/stores/fresh-farm-logo.jpg',
      banner: '/images/stores/fresh-farm-banner.jpg',
      address: '123 Market Street, Chennai, Tamil Nadu',
      phone: '+91 9876543213',
      email: 'contact@freshfarm.com',
      website: 'https://freshfarm.com',
      userId: user1.id,
      isApproved: true,
    },
  })

  const organicMarket = await prisma.store.create({
    data: {
      name: 'Organic Market',
      description: 'Premium organic produce and dairy products',
      logo: '/images/stores/organic-market-logo.jpg',
      banner: '/images/stores/organic-market-banner.jpg',
      address: '456 Green Avenue, Coimbatore, Tamil Nadu',
      phone: '+91 9876543214',
      email: 'info@organicmarket.com',
      userId: user2.id,
      isApproved: true,
    },
  })

  console.log('✅ Stores created')

  // Create sample products
  const tomatoes = await prisma.product.create({
    data: {
      title: 'Fresh Organic Tomatoes',
      description: 'Premium quality organic tomatoes grown without pesticides',
      price: 45.0,
      images: ['/images/products/tomatoes.jpg'],
      categoryId: vegetables.id,
      storeId: freshFarmStore.id,
      userId: user1.id,
      stateId: tamilNadu.id,
      cityId: chennai.id,
      unitId: kg.id,
      isFeatured: true,
    },
  })

  const bananas = await prisma.product.create({
    data: {
      title: 'Fresh Bananas',
      description: 'Sweet and ripe bananas from Kerala farms',
      price: 30.0,
      images: ['/images/products/bananas.jpg'],
      categoryId: fruits.id,
      storeId: organicMarket.id,
      userId: user2.id,
      stateId: kerala.id,
      cityId: kochi.id,
      unitId: kg.id,
      isFeatured: true,
    },
  })

  console.log('✅ Products created')

  // Create sample banners
  await prisma.banner.create({
    data: {
      title: 'Fresh Vegetables from Local Farmers',
      image: '/images/banners/vegetables-banner.jpg',
      url: '/products?category=vegetables',
      position: 1,
      isActive: true,
    },
  })

  await prisma.banner.create({
    data: {
      title: 'Organic Fruits - Farm to Table',
      image: '/images/banners/fruits-banner.jpg',
      url: '/products?category=fruits',
      position: 2,
      isActive: true,
    },
  })

  await prisma.banner.create({
    data: {
      title: 'Premium Dairy Products',
      image: '/images/banners/dairy-banner.jpg',
      url: '/products?category=dairy',
      position: 3,
      isActive: true,
    },
  })

  console.log('✅ Banners created')

  console.log('🌱 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
