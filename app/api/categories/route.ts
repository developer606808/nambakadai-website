import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';
    const type = searchParams.get('type') || 'STORE'; // Default to STORE if not specified
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    const where: Prisma.CategoryWhereInput = {};
    if (type) {
      where.type = type as any;
    }

    // Add search functionality
    if (search) {
      where.OR = [
        {
          name_en: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          name_ta: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          name_hi: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const categories = await prisma.category.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      include: includeSubcategories ? {
        _count: {
          select: {
            products: true
          }
        },
        children: {
          include: {
            _count: {
              select: {
                products: true
              }
            }
          },
          orderBy: { name_en: 'asc' }
        }
      } : {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name_en: 'asc' }
    });

    // If includeSubcategories is true, return the categories array directly
    // Otherwise, return the object with categories and total
    if (includeSubcategories) {
      return NextResponse.json(categories);
    }

    return NextResponse.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}