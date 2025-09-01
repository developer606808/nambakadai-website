import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch featured vehicles from database
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8, // Limit to 8 featured vehicles
    });

    // Transform data for frontend
    const featuredRentals = vehicles.map(vehicle => ({
      id: vehicle.id,
      image: vehicle.images[0] || "/placeholder.svg",
      title: vehicle.name,
      price: vehicle.pricePerDay || vehicle.pricePerHour || 0,
      unit: vehicle.pricePerDay ? "per day" : "per hour",
      rating: 4.5, // Default rating, could be calculated from reviews
      reviews: vehicle._count.bookings, // Using booking count as proxy for reviews
      location: vehicle.location,
      availability: 10, // Default availability, could be calculated
      category: vehicle.category,
    }));

    return NextResponse.json(featuredRentals);
  } catch (error) {
    console.error('Error fetching featured rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured rentals' },
      { status: 500 }
    );
  }
}