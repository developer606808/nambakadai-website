import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch featured products from database
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            name_en: true,
          },
        },
        unit: {
          select: {
            symbol: true,
          },
        },
        _count: {
          select: {
            wishlist: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8, // Limit to 8 featured products
    });

    // Transform data for frontend
    const featuredProducts = products.map(product => ({
      id: product.id,
      image: product.images[0] || "/placeholder.svg",
      title: product.title,
      price: product.price,
      unit: product.unit.symbol,
      rating: 4.5, // Default rating, could be calculated from reviews
      reviews: product._count.wishlist, // Using wishlist count as proxy for popularity
      location: product.city.name_en,
      seller: product.store.name,
      sellerId: product.store.id.toString(),
      isOrganic: product.title.toLowerCase().includes('organic'),
      isBestSeller: product._count.wishlist > 10, // Consider products with many wishlists as best sellers
    }));

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}