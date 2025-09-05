import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { storeSchema } from '@/lib/validations/schemas';
import { z } from 'zod';
import { sendStoreCreationEmail } from '@/lib/services/emailService';
import { Prisma } from '@prisma/client';

// GET /api/stores - Get all stores with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const cityId = searchParams.get('cityId');
    const categoryId = searchParams.get('categoryId');

    const where: Prisma.StoreWhereInput = {
      isApproved: true,
      isBlocked: false,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add city filter
    if (cityId) {
      where.cityId = parseInt(cityId);
    }

    // Add category filter (through products)
    if (categoryId) {
      where.products = {
        some: {
          categoryId: parseInt(categoryId)
        }
      };
    }

    // Fetch stores with pagination
    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          publicKey: true,
          description: true,
          logo: true,
          banner: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          isApproved: true,
          isBlocked: true,
          followersCount: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
              ratings: true
            }
          }
        }
      }),
      prisma.store.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      stores,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}

// GET /api/stores/:id - Get store details (for backward compatibility)
async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await params;
    const storeId = parseInt(id);
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
    const validatedData = storeSchema.parse(body);

    // Generate slug for the store
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists
    while (await prisma.store.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        ...validatedData,
        slug: slug,
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

    // Send store creation success email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (user) {
      const emailResult = await sendStoreCreationEmail(
        user.email,
        user.name,
        store.name
      );

      if (!emailResult.success) {
        console.error('Failed to send store creation email:', emailResult.error);
        // Don't fail the store creation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      store,
      message: 'Store created successfully',
      emailSent: user ? true : false
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
  { params }: { params: Promise<{ id: string }> }
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

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if store exists and user has permission
    const { id } = await params;
    const storeId = parseInt(id);
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'Invalid store ID' },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    if (store.userId !== userId && session.user.role !== 'ADMIN') {
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
      where: { id: storeId },
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