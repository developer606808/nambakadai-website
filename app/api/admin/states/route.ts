import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/states - List states with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
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

    return createApiResponse({
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
    return createApiError('Failed to fetch states', 500);
  }
}

// POST /api/admin/states - Create state
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_en, name_ta, name_hi, stateCode } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateCode) {
      return createApiError('Name (English), Name (Tamil), and State Code are required', 400);
    }

    // Check if state code already exists
    const existingState = await prisma.state.findFirst({
      where: { stateCode }
    });

    if (existingState) {
      return createApiError('State code already exists', 400);
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

    return createApiResponse(state, 'State created successfully', 201);

  } catch (error) {
    console.error('Error creating state:', error);
    return createApiError('Failed to create state', 500);
  }
}
