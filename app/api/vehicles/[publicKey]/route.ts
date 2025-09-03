import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// GET /api/vehicles/[publicKey] - Get a specific vehicle by publicKey
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID format' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { publicKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

// PUT /api/vehicles/[publicKey] - Update a vehicle by publicKey
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { publicKey },
      select: { userId: true }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (existingVehicle.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { publicKey },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        category: body.category,
        pricePerDay: body.pricePerDay ? parseFloat(body.pricePerDay) : null,
        pricePerHour: parseFloat(body.pricePerHour),
        capacity: body.capacity,
        fuelType: body.fuelType,
        location: body.location,
        features: body.features,
        images: body.images,
        horsepower: body.horsepower ? parseInt(body.horsepower) : null,
        workingWidth: body.workingWidth ? parseFloat(body.workingWidth) : null,
        attachments: body.attachments,
        operatorIncluded: Boolean(body.operatorIncluded),
        minimumHours: body.minimumHours ? parseInt(body.minimumHours) : null,
      }
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles/[publicKey] - Delete a vehicle by publicKey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID format' },
        { status: 400 }
      );
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { publicKey },
      select: { userId: true }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (existingVehicle.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { publicKey }
    });

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}