import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/categories - List categories with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const parentId = searchParams.get('parentId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (parentId !== null) {
      where.parentId = parentId ? parseInt(parentId) : null;
    }

    // Get total count
    const total = await prisma.category.count({ where });

    // Get categories with pagination
    const categories = await prisma.category.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name_en: true, name_ta: true }
        },
        children: {
          select: { id: true, name_en: true, name_ta: true }
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
      categories,
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
    console.error('Error fetching categories:', error);
    return createApiError('Failed to fetch categories', 500);
  }
}

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_en, name_ta, name_hi, slug, image, parentId, type } = body;

    // Validate required fields
    if (!name_en || !name_ta || !slug) {
      return createApiError('Name (English), Name (Tamil), and Slug are required', 400);
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return createApiError('Slug already exists', 400);
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name_en,
        name_ta,
        name_hi,
        slug,
        image,
        parentId: parentId ? parseInt(parentId) : null,
        type: type || 'STORE',
      },
      include: {
        parent: {
          select: { id: true, name_en: true, name_ta: true }
        },
        children: {
          select: { id: true, name_en: true, name_ta: true }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    return createApiResponse(category, 'Category created successfully', 201);

  } catch (error) {
    console.error('Error creating category:', error);
    return createApiError('Failed to create category', 500);
  }
}
