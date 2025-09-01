import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/cities/[id] - Get single city
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
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ city });

  } catch (error) {
    console.error('Error fetching city:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/cities/[id] - Update city
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
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name_en, name_ta, name_hi, stateId } = body;

    // Validate required fields
    if (!name_en || !name_ta || !stateId) {
      return NextResponse.json(
        { error: 'Name (English), Name (Tamil), and State are required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await prisma.city.findUnique({
      where: { id }
    });

    if (!existingCity) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id: parseInt(stateId) }
    });

    if (!state) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
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

    return NextResponse.json({
      message: 'City updated successfully',
      city
    });

  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/cities/[id] - Soft delete city (prevent if has dependencies)
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
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Soft delete: Check if city has products (prevent deletion)
    if (city._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete city with associated products. Please remove all products first.' },
        { status: 400 }
      );
    }

    // Delete city (hard delete since no dependencies)
    await prisma.city.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'City deleted successfully',
      deleted: true
    });

  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    );
  }
}
