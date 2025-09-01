import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/cities - List cities with pagination
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
    const stateId = searchParams.get('stateId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { name_hi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (stateId) {
      where.stateId = parseInt(stateId);
    }

    // Get total count
    const total = await prisma.city.count({ where });

    // Get cities with pagination
    const cities = await prisma.city.findMany({
      where,
      include: {
        state: {
          select: { id: true, name_en: true, name_ta: true, stateCode: true }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      cities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });

  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

// POST /api/admin/cities - Create city
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, stateId } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateId) {
      return NextResponse.json(
        { error: 'Name (English), Name (Tamil), and State are required' },
        { status: 400 }
      );
    }

    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id: parseInt(stateId) }
    });

    if (!state) {
      return NextResponse.json(
        { error: 'State not found' },
        { status: 404 }
      );
    }

    // Create city
    const city = await prisma.city.create({
      data: {
        name_en,
        name_ta,
        name_hi,
        stateId: parseInt(stateId),
      },
      include: {
        state: {
          select: { id: true, name_en: true, name_ta: true, stateCode: true }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json({
      message: 'City created successfully',
      city
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
