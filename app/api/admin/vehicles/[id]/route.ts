import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/vehicles/[id] - Get single vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const vehicleId = parseInt(id);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
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
            customerName: true,
            customerEmail: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({
      vehicle: {
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
        recentBookings: vehicle.bookings,
      },
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/vehicles/[id] - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const vehicleId = parseInt(id);
    const body = await request.json();

    const {
      name,
      description,
      type,
      category,
      pricePerDay,
      pricePerHour,
      capacity,
      fuelType,
      location,
      features,
      status
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Vehicle name is required' },
        { status: 400 }
      );
    }

    if (pricePerDay !== undefined && (pricePerDay < 1 || pricePerDay > 50000)) {
      return NextResponse.json(
        { error: 'Daily price must be between ₹1 and ₹50,000' },
        { status: 400 }
      );
    }

    if (pricePerHour !== undefined && (pricePerHour < 1 || pricePerHour > 5000)) {
      return NextResponse.json(
        { error: 'Hourly price must be between ₹1 and ₹5,000' },
        { status: 400 }
      );
    }

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        name,
        description,
        type,
        category,
        pricePerDay,
        pricePerHour,
        capacity,
        fuelType,
        location,
        features,
        status,
      },
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
      },
    });

    return NextResponse.json({
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/vehicles/[id] - Soft delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const vehicleId = parseInt(id);

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, name: true, status: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Soft delete the vehicle by setting status to INACTIVE
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json({
      message: 'Vehicle deleted successfully',
      vehicle: { id: vehicleId, name: vehicle.name },
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}