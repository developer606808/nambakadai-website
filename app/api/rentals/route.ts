import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured') === 'true';

    // Build where clause
    const where: any = {
      status: 'AVAILABLE'
    };

    // Add category filter if specified
    if (category && category !== 'all') {
      // First try to find category by ID, then by name
      const categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { id: parseInt(category) || 0 },
            { name_en: { equals: category, mode: 'insensitive' } },
            { slug: category }
          ],
          type: 'RENTAL'
        }
      });

      if (categoryRecord) {
        where.category = categoryRecord.name_en;
      }
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add featured filter
    if (featured) {
      where.isFeatured = true;
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: featured ? { createdAt: 'desc' } : { createdAt: 'desc' },
      take: limit ? parseInt(limit) : 20
    });

    // Transform data for frontend
    const rentals = vehicles.map(vehicle => ({
      id: vehicle.id,
      slug: vehicle.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      publicKey: vehicle.publicKey,
      title: vehicle.name,
      description: vehicle.description,
      category: vehicle.category,
      categorySlug: vehicle.category.toLowerCase().replace(/\s+/g, '-'),
      price: vehicle.pricePerDay || vehicle.pricePerHour || 0,
      pricePerHour: vehicle.pricePerHour,
      pricePerDay: vehicle.pricePerDay,
      period: vehicle.pricePerDay ? 'day' : 'hour',
      location: vehicle.location,
      rating: vehicle.rating || 4.5,
      reviews: vehicle.totalBookings || vehicle._count.bookings,
      image: vehicle.images[0] || "/placeholder.svg",
      images: vehicle.images,
      available: vehicle.status === 'AVAILABLE',
      featured: vehicle.rating > 4.5 || vehicle.totalBookings > 5, // Consider highly rated or popular as featured
      fuelType: vehicle.fuelType,
      capacity: vehicle.capacity,
      horsepower: vehicle.horsepower,
      workingWidth: vehicle.workingWidth,
      features: vehicle.features || [],
      attachments: vehicle.attachments || [],
      operatorIncluded: vehicle.operatorIncluded,
      minimumHours: vehicle.minimumHours,
      owner: {
        id: vehicle.user.id,
        name: vehicle.user.name,
        avatar: vehicle.user.avatar
      }
    }));

    return NextResponse.json({
      rentals,
      total: rentals.length,
      hasMore: vehicles.length === (limit ? parseInt(limit) : 20)
    });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}