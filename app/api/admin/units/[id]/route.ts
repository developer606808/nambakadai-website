import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { Prisma } from '@prisma/client';

// GET /api/admin/units/[id] - Get single unit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid unit ID', 400);
    }

    const unit = await prisma.unit.findUnique({
      where: { id },
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

    if (!unit) {
      return createApiError('Unit not found', 404);
    }

    // Transform the response to flatten categories
    const transformedUnit = {
      ...unit,
      categories: unit.categories?.map((uc) => uc.category) || []
    };

    return createApiResponse(transformedUnit);

  } catch (error) {
    console.error('Error fetching unit:', error);
    return createApiError('Failed to fetch unit', 500);
  }
}

// PUT /api/admin/units/[id] - Update unit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid unit ID', 400);
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, symbol, categoryIds } = body;

    // Validate required fields
    if (!name_en || !name_ta || !symbol) {
      return createApiError('Name (English), Name (Tamil), and Symbol are required', 400);
    }

    // Check if unit exists
    const existingUnit = await prisma.unit.findUnique({
      where: { id }
    });

    if (!existingUnit) {
      return createApiError('Unit not found', 404);
    }

    // Check if symbol already exists (excluding current unit)
    const symbolExists = await prisma.unit.findFirst({
      where: {
        symbol,
        id: { not: id }
      }
    });

    if (symbolExists) {
      return createApiError('Symbol already exists', 400);
    }

    // Validate category IDs if provided
    let validCategoryIds: number[] = [];
    if (categoryIds && Array.isArray(categoryIds)) {
      console.log('🔍 Received categoryIds:', categoryIds);

      // Check which categories actually exist
      const existingCategories = await prisma.category.findMany({
        where: {
          id: { in: categoryIds }
        },
        select: { id: true }
      });

      console.log('✅ Existing categories found:', existingCategories.map(cat => cat.id));
      validCategoryIds = existingCategories.map(cat => cat.id);

      // Check if any requested categories don't exist
      const invalidCategoryIds = categoryIds.filter(id => !validCategoryIds.includes(id));
      console.log('❌ Invalid category IDs:', invalidCategoryIds);

      // Instead of failing, filter out invalid IDs and continue with valid ones
      if (invalidCategoryIds.length > 0) {
        console.log(`⚠️ Filtering out ${invalidCategoryIds.length} invalid category IDs and proceeding with valid ones`);
      }
    }

    // Update unit with categories
    const unit = await prisma.unit.update({
      where: { id },
      data: {
        name_en,
        name_ta,
        name_hi,
        symbol,
        categories: validCategoryIds.length > 0 ? {
          deleteMany: {},
          create: validCategoryIds.map((categoryId: number) => ({
            category: { connect: { id: categoryId } }
          }))
        } : {
          deleteMany: {}
        }
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
      categories: unit.categories?.map((uc: any) => uc.category) || []
    };

    return createApiResponse(transformedUnit, 'Unit updated successfully');

  } catch (error) {
    console.error('Error updating unit:', error);
    return createApiError('Failed to update unit', 500);
  }
}

// DELETE /api/admin/units/[id] - Delete unit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid unit ID', 400);
    }

    // Check if unit exists
    const unit = await prisma.unit.findUnique({
      where: { id },
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

    if (!unit) {
      return createApiError('Unit not found', 404);
    }

    // Check if unit has products
    if (unit._count.products > 0) {
      return createApiError('Cannot delete unit with associated products', 400);
    }

    // Delete unit
    await prisma.unit.delete({
      where: { id }
    });

    return createApiResponse({ deleted: true }, 'Unit deleted successfully');

  } catch (error) {
    console.error('Error deleting unit:', error);
    return createApiError('Failed to delete unit', 500);
  }
}
