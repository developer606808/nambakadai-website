import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { Prisma } from '@prisma/client';

// GET /api/admin/units - List units with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UnitWhereInput = {};
    
    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { symbol: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.unit.count({ where });

    // Get units with pagination
    const units = await prisma.unit.findMany({
      where,
      include: {
        _count: {
          select: { products: true }
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name_en: true,
                name_ta: true,
                name_hi: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Transform the data to flatten categories
    const transformedUnits = units.map((unit) => ({
      ...unit,
      categories: unit.categories?.map((uc) => uc.category) || []
    }));

    const totalPages = Math.ceil(total / limit);

    return createApiResponse({
      units: transformedUnits,
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
    console.error('Error fetching units:', error);
    return createApiError('Failed to fetch units', 500);
  }
}

// POST /api/admin/units - Create unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_en, name_ta, name_hi, symbol, categoryIds } = body;

    // Validate required fields
    if (!name_en || !name_ta || !symbol) {
      return createApiError('Name (English), Name (Tamil), and Symbol are required', 400);
    }

    // Check if symbol already exists
    const existingUnit = await prisma.unit.findFirst({
      where: { symbol }
    });

    if (existingUnit) {
      return createApiError('Symbol already exists', 400);
    }

    // Validate category IDs if provided
    let validCategoryIds: number[] = [];
    if (categoryIds && Array.isArray(categoryIds)) {
      console.log('🔍 Received categoryIds for creation:', categoryIds);

      // Check which categories actually exist
      const existingCategories = await prisma.category.findMany({
        where: {
          id: { in: categoryIds }
        },
        select: { id: true }
      });

      console.log('✅ Existing categories found for creation:', existingCategories.map(cat => cat.id));
      validCategoryIds = existingCategories.map(cat => cat.id);

      // Check if any requested categories don't exist
      const invalidCategoryIds = categoryIds.filter(id => !validCategoryIds.includes(id));
      console.log('❌ Invalid category IDs for creation:', invalidCategoryIds);

      // Instead of failing, filter out invalid IDs and continue with valid ones
      if (invalidCategoryIds.length > 0) {
        console.log(`⚠️ Filtering out ${invalidCategoryIds.length} invalid category IDs and proceeding with valid ones for creation`);
      }
    }

    // Create unit with categories
    const unit = await prisma.unit.create({
      data: {
        name_en,
        name_ta,
        name_hi,
        symbol,
        categories: validCategoryIds.length > 0 ? {
          create: validCategoryIds.map((categoryId: number) => ({
            category: { connect: { id: categoryId } }
          }))
        } : undefined
      },
      include: {
        _count: {
          select: { products: true }
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name_en: true,
                name_ta: true,
                name_hi: true,
                slug: true
              }
            }
          }
        }
      }
    });

    // Transform the response to flatten categories
    const transformedUnit = {
      ...unit,
      categories: unit.categories?.map((uc) => uc.category) || []
    };

    return createApiResponse(transformedUnit, 'Unit created successfully');

  } catch (error) {
    console.error('Error creating unit:', error);
    return createApiError('Failed to create unit', 500);
  }
}
