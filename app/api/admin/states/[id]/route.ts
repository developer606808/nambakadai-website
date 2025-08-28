import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// GET /api/admin/states/[id] - Get single state
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid state ID', 400);
    }

    const state = await prisma.state.findUnique({
      where: { id },
      include: {
        cities: {
          select: { id: true, name_en: true, name_ta: true }
        },
        _count: {
          select: { 
            cities: true,
            products: true 
          }
        }
      }
    });

    if (!state) {
      return createApiError('State not found', 404);
    }

    return createApiResponse(state);

  } catch (error) {
    console.error('Error fetching state:', error);
    return createApiError('Failed to fetch state', 500);
  }
}

// PUT /api/admin/states/[id] - Update state
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid state ID', 400);
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, stateCode } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateCode) {
      return createApiError('Name (English), Name (Tamil), and State Code are required', 400);
    }

    // Check if state exists
    const existingState = await prisma.state.findUnique({
      where: { id }
    });

    if (!existingState) {
      return createApiError('State not found', 404);
    }

    // Check if state code already exists (excluding current state)
    const codeExists = await prisma.state.findFirst({
      where: {
        stateCode,
        id: { not: id }
      }
    });

    if (codeExists) {
      return createApiError('State code already exists', 400);
    }

    // Update state
    const state = await prisma.state.update({
      where: { id },
      data: {
        name_en,
        name_ta,
        name_hi,
        stateCode,
      },
      include: {
        cities: {
          select: { id: true, name_en: true, name_ta: true }
        },
        _count: {
          select: { 
            cities: true,
            products: true 
          }
        }
      }
    });

    return createApiResponse(state, 'State updated successfully');

  } catch (error) {
    console.error('Error updating state:', error);
    return createApiError('Failed to update state', 500);
  }
}

// DELETE /api/admin/states/[id] - Delete state
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return createApiError('Invalid state ID', 400);
    }

    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            cities: true,
            products: true 
          }
        }
      }
    });

    if (!state) {
      return createApiError('State not found', 404);
    }

    // Check if state has cities or products
    if (state._count.cities > 0) {
      return createApiError('Cannot delete state with associated cities', 400);
    }

    if (state._count.products > 0) {
      return createApiError('Cannot delete state with associated products', 400);
    }

    // Delete state
    await prisma.state.delete({
      where: { id }
    });

    return createApiResponse({ deleted: true }, 'State deleted successfully');

  } catch (error) {
    console.error('Error deleting state:', error);
    return createApiError('Failed to delete state', 500);
  }
}
