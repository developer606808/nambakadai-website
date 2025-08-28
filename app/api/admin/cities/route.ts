import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/cities - List cities with pagination
export async function GET(request: NextRequest) {
  try {
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

    return createApiResponse({
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
    return createApiError('Failed to fetch cities', 500);
  }
}

// POST /api/admin/cities - Create city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_en, name_ta, name_hi, stateId } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateId) {
      return createApiError('Name (English), Name (Tamil), and State are required', 400);
    }

    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id: parseInt(stateId) }
    });

    if (!state) {
      return createApiError('State not found', 404);
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

    return createApiResponse(city, 'City created successfully', 201);

  } catch (error) {
    console.error('Error creating city:', error);
    return createApiError('Failed to create city', 500);
  }
}
