import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/cities/[id] - Get single city
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid city ID', 400);
    }

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        state: {
          select: { id: true, name_en: true, name_ta: true, stateCode: true }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!city) {
      return createApiError('City not found', 404);
    }

    return createApiResponse(city);

  } catch (error) {
    console.error('Error fetching city:', error);
    return createApiError('Failed to fetch city', 500);
  }
}

// PUT /api/admin/cities/[id] - Update city
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid city ID', 400);
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, stateId } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateId) {
      return createApiError('Name (English), Name (Tamil), and State are required', 400);
    }

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id }
    });

    if (!existingCity) {
      return createApiError('City not found', 404);
    }

    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id: parseInt(stateId) }
    });

    if (!state) {
      return createApiError('State not found', 404);
    }

    // Update city
    const city = await prisma.city.update({
      where: { id },
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

    return createApiResponse(city, 'City updated successfully');

  } catch (error) {
    console.error('Error updating city:', error);
    return createApiError('Failed to update city', 500);
  }
}

// DELETE /api/admin/cities/[id] - Delete city
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid city ID', 400);
    }

    // Check if city exists
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!city) {
      return createApiError('City not found', 404);
    }

    // Check if city has products
    if (city._count.products > 0) {
      return createApiError('Cannot delete city with associated products', 400);
    }

    // Delete city
    await prisma.city.delete({
      where: { id }
    });

    return createApiResponse({ deleted: true }, 'City deleted successfully');

  } catch (error) {
    console.error('Error deleting city:', error);
    return createApiError('Failed to delete city', 500);
  }
}
