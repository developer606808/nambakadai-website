import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/vehicles - Get all vehicles with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const fuelType = searchParams.get('fuelType') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { currentStore: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (fuelType && fuelType !== 'all') {
      where.fuelType = fuelType;
    }

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
    }

    // Get vehicles with pagination
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              currentStore: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          bookings: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true,
            },
            where: {
              status: 'CONFIRMED',
            },
            orderBy: {
              startDate: 'desc',
            },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    // Transform data for frontend
    const transformedVehicles = vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      description: vehicle.description,
      type: vehicle.type,
      category: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      pricePerHour: vehicle.pricePerHour,
      capacity: vehicle.capacity,
      fuelType: vehicle.fuelType,
      location: vehicle.location,
      features: vehicle.features,
      images: vehicle.images,
      status: vehicle.status,
      rating: vehicle.rating,
      totalBookings: vehicle.totalBookings,
      adId: vehicle.adId,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      owner: {
        id: vehicle.user.id,
        name: vehicle.user.name,
        email: vehicle.user.email,
        store: vehicle.user.currentStore?.name || 'N/A',
      },
      currentBooking: vehicle.bookings[0] || null,
    }));

    return NextResponse.json({
      vehicles: transformedVehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}