import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { storeSchema } from '@/lib/validations/schemas';
import { z } from 'zod';

// GET /api/stores/:id - Get store details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const storeId = parseInt(params.id);
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'Invalid store ID' },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        products: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        ratings: true
      }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, rating) => sum + rating.value, 0) / store.ratings.length
      : 0;

    return NextResponse.json({
      ...store,
      averageRating
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}

// POST /api/stores - Create a new store
export async function POST(request: NextRequest) {
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

    // Allow any authenticated user to create a store
    // They will be upgraded to SELLER role when store is created

    // Check if user already has a store
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId: userId }
    });

    if (existingStore) {
      return NextResponse.json(
        { error: 'User already has a store' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = storeSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        validationError.errors.forEach((error) => {
          if (error.path.length > 0) {
            errors[error.path[0]] = error.message;
          }
        });

        return NextResponse.json(
          {
            error: 'Validation failed',
            errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        ...validatedData,
        userId: userId
      }
    });

    // Set this as the user's current store if they don't have one
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStoreId: store.id,
        role: 'SELLER' // Update role to seller when they create a store
      }
    });

    return NextResponse.json({
      success: true,
      store,
      message: 'Store created successfully'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    );
  }
}

// PUT /api/stores/:id - Update store
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Validate user is a seller or admin
    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if store exists and user has permission
    const store = await prisma.store.findUnique({
      where: { id: params.id }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    if (store.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = storeSchema.parse(body);

    // Update store
    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating store:', error);
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    );
  }
}