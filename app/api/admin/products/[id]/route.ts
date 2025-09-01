import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name_en: true,
            name_ta: true,
            slug: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name_en: true,
            symbol: true,
          },
        },
        state: {
          select: {
            id: true,
            name_en: true,
          },
        },
        city: {
          select: {
            id: true,
            name_en: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        slug: product.slug,
        adId: product.adId,
        isFeatured: product.isFeatured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: {
          id: product.category.id,
          name: product.category.name_en,
          slug: product.category.slug,
        },
        store: {
          id: product.store.id,
          name: product.store.name,
        },
        unit: {
          id: product.unit.id,
          name: product.unit.name_en,
          symbol: product.unit.symbol,
        },
        location: {
          state: product.state.name_en,
          city: product.city.name_en,
        },
        seller: {
          id: product.user.id,
          name: product.user.name,
          email: product.user.email,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();

    const { title, description, price, stock, categoryId, unitId, stateId, cityId, isFeatured } = body;

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Product title is required' },
        { status: 400 }
      );
    }

    if (price !== undefined && (price < 0 || isNaN(price))) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    if (stock !== undefined && (stock < 0 || isNaN(stock))) {
      return NextResponse.json(
        { error: 'Invalid stock quantity' },
        { status: 400 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price,
        stock,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        unitId: unitId ? parseInt(unitId) : undefined,
        stateId: stateId ? parseInt(stateId) : undefined,
        cityId: cityId ? parseInt(cityId) : undefined,
        isFeatured: isFeatured || false,
      },
      include: {
        category: {
          select: {
            id: true,
            name_en: true,
            slug: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Soft delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Soft delete the product by setting stock to 0 (making it inactive)
    await prisma.product.update({
      where: { id: productId },
      data: { stock: 0 },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: { id: productId, title: product.title },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}