import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch featured stores from database
    const stores = await prisma.store.findMany({
      where: {
        isApproved: true,
        isBlocked: false,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        publicKey: true,
        logo: true,
        banner: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        isApproved: true,
        isBlocked: true,
        followersCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
            ratings: true,
          },
        },
      },
      orderBy: { followersCount: 'desc' },
      take: 8, // Limit to 8 featured stores
    });

    // Transform data for frontend
    const featuredStores = stores.map((store) => ({
      id: store.id.toString(),
      slug: store.slug,
      publicKey: store.publicKey,
      image: store.logo || "/placeholder.svg",
      name: store.name,
      category: "General Store", // Could be enhanced with category info
      rating: 4.5, // Default rating, could be calculated from ratings
      reviews: store._count.ratings,
    }));

    return NextResponse.json(featuredStores);
  } catch (error) {
    console.error('Error fetching featured stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured stores' },
      { status: 500 }
    );
  }
}