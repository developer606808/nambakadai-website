import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// GET /api/products/[publicKey] - Get a specific product by publicKey
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { publicKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        category: {
          select: {
            id: true,
            name_en: true,
            name_ta: true,
            slug: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            slug: true,
            publicKey: true,
          }
        },
        unit: {
          select: {
            id: true,
            name_en: true,
            symbol: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[publicKey] - Update a product by publicKey
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findUnique({
      where: { publicKey },
      select: { userId: true }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (existingProduct.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { publicKey },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        images: body.images,
        categoryId: parseInt(body.categoryId),
        unitId: parseInt(body.unitId),
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[publicKey] - Delete a product by publicKey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { publicKey } = await params;

    // Validate publicKey format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(publicKey)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findUnique({
      where: { publicKey },
      select: { userId: true }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (existingProduct.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { publicKey }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}