import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid category ID', 400);
    }

    const category = await prisma.category.findUnique({
      where: { id },
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

    if (!category) {
      return createApiError('Category not found', 404);
    }

    return createApiResponse(category);

  } catch (error) {
    console.error('Error fetching category:', error);
    return createApiError('Failed to fetch category', 500);
  }
}

// PUT /api/admin/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid category ID', 400);
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, slug, image, icon, parentId, type } = body;

    // Validate required fields
    if (!name_en || !name_ta || !slug) {
      return createApiError('Name (English), Name (Tamil), and Slug are required', 400);
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return createApiError('Category not found', 404);
    }

    // Check if slug already exists (excluding current category)
    const slugExists = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });

    if (slugExists) {
      return createApiError('Slug already exists', 400);
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name_en,
        name_ta,
        name_hi,
        slug,
        image,
        icon,
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

    return createApiResponse(category, 'Category updated successfully');

  } catch (error) {
    console.error('Error updating category:', error);
    return createApiError('Failed to update category', 500);
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid category ID', 400);
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return createApiError('Category not found', 404);
    }

    // Check if category has products
    if (category._count.products > 0) {
      return createApiError('Cannot delete category with associated products', 400);
    }

    // Check if category has children
    if (category.children.length > 0) {
      return createApiError('Cannot delete category with subcategories', 400);
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    });

    return createApiResponse({ deleted: true }, 'Category deleted successfully');

  } catch (error) {
    console.error('Error deleting category:', error);
    return createApiError('Failed to delete category', 500);
  }
}
