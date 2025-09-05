import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/stores - Get all stores with pagination and filters
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
    const status = searchParams.get('status') || '';
    const location = searchParams.get('location') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.StoreWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        where.isBlocked = false;
      } else if (status === 'blocked') {
        where.isBlocked = true;
      } else if (status === 'approved') {
        where.isApproved = true;
      } else if (status === 'unapproved') {
        where.isApproved = false;
      }
    }

    if (location && location !== 'all') {
      where.address = { contains: location, mode: 'insensitive' };
    }

    // Get stores with pagination
    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              products: true,
              ratings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.store.count({ where }),
    ]);

    // Transform data
    const transformedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.phone,
      email: store.email,
      logo: store.logo,
      banner: store.banner,
      isApproved: store.isApproved,
      isBlocked: store.isBlocked,
      createdAt: store.createdAt,
      owner: {
        id: store.user.id,
        name: store.user.name,
        email: store.user.email,
      },
      stats: {
        products: store._count.products,
        ratings: store._count.ratings,
        averageRating: 0, // We'll calculate this separately if needed
      },
    }));

    return NextResponse.json({
      stores: transformedStores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}