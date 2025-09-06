import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/states - List states with pagination
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

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.StateWhereInput = {};

    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { name_hi: { contains: search, mode: 'insensitive' } },
        { stateCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.state.count({ where });

    // Get states with pagination
    const states = await prisma.state.findMany({
      where,
      include: {
        _count: {
          select: {
            cities: true,
            products: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      states,
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
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}

// POST /api/admin/states - Create state
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, stateCode } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateCode) {
      return NextResponse.json(
        { error: 'Name (English), Name (Tamil), and State Code are required' },
        { status: 400 }
      );
    }

    // Check if state code already exists
    const existingState = await prisma.state.findFirst({
      where: { stateCode }
    });

    if (existingState) {
      return NextResponse.json(
        { error: 'State code already exists' },
        { status: 400 }
      );
    }

    // Create state
    const state = await prisma.state.create({
      data: {
        name_en,
        name_ta,
        name_hi,
        stateCode,
      },
      include: {
        _count: {
          select: {
            cities: true,
            products: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'State created successfully',
      state
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating state:', error);
    return NextResponse.json(
      { error: 'Failed to create state' },
      { status: 500 }
    );
  }
}
