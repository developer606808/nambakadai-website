import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/states/[id] - Get single state
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid state ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    return NextResponse.json({ state });

  } catch (error) {
    console.error('Error fetching state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch state' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/states/[id] - Update state
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid state ID' }, { status: 400 });
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

    // Check if state exists
    const existingState = await prisma.state.findUnique({
      where: { id }
    });

    if (!existingState) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    // Check if state code already exists (excluding current state)
    const codeExists = await prisma.state.findFirst({
      where: {
        stateCode,
        id: { not: id }
      }
    });

    if (codeExists) {
      return NextResponse.json(
        { error: 'State code already exists' },
        { status: 400 }
      );
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

    return NextResponse.json({
      message: 'State updated successfully',
      state
    });

  } catch (error) {
    console.error('Error updating state:', error);
    return NextResponse.json(
      { error: 'Failed to update state' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/states/[id] - Soft delete state (prevent if has dependencies)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid state ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }

    // Soft delete: Check if state has cities or products (prevent deletion)
    if (state._count.cities > 0) {
      return NextResponse.json(
        { error: 'Cannot delete state with associated cities. Please remove all cities first.' },
        { status: 400 }
      );
    }

    if (state._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete state with associated products. Please remove all products first.' },
        { status: 400 }
      );
    }

    // Delete state (hard delete since no dependencies)
    await prisma.state.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'State deleted successfully',
      deleted: true
    });

  } catch (error) {
    console.error('Error deleting state:', error);
    return NextResponse.json(
      { error: 'Failed to delete state' },
      { status: 500 }
    );
  }
}
