import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// GET /api/wishlist/status?productIds=1,2,3 - Check wishlist status for multiple products
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id as string);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productIdsParam = searchParams.get('productIds');

    if (!productIdsParam) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const productIds = productIdsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      );
    }

    // Get wishlist items for these products
    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: userId,
        productId: {
          in: productIds
        }
      },
      select: {
        productId: true
      }
    });

    // Create a map of product IDs that are in wishlist
    const wishlistStatus = productIds.reduce((acc, productId) => {
      acc[productId] = wishlistItems.some(item => item.productId === productId);
      return acc;
    }, {} as Record<number, boolean>);

    return NextResponse.json(wishlistStatus);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return NextResponse.json(
      { error: 'Failed to check wishlist status' },
      { status: 500 }
    );
  }
}

// GET /api/wishlist/count - Get user's wishlist count
export async function POST(request: NextRequest) {
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

    const userId = parseInt(session.user.id as string);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { productId, action } = body;

    if (!productId || !action) {
      return NextResponse.json(
        { error: 'Product ID and action are required' },
        { status: 400 }
      );
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "add" or "remove"' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (action === 'add') {
      // Check if already in wishlist
      const existingWishlistItem = await prisma.wishlist.findFirst({
        where: {
          userId: userId,
          productId: productId
        }
      });

      if (existingWishlistItem) {
        return NextResponse.json(
          { error: 'Product already in wishlist' },
          { status: 400 }
        );
      }

      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId: userId,
          productId: productId
        }
      });

      return NextResponse.json({ message: 'Added to wishlist' });
    } else {
      // Remove from wishlist
      const wishlistItem = await prisma.wishlist.findFirst({
        where: {
          userId: userId,
          productId: productId
        }
      });

      if (!wishlistItem) {
        return NextResponse.json(
          { error: 'Product not in wishlist' },
          { status: 404 }
        );
      }

      await prisma.wishlist.delete({
        where: { id: wishlistItem.id }
      });

      return NextResponse.json({ message: 'Removed from wishlist' });
    }
  } catch (error) {
    console.error('Error managing wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to manage wishlist' },
      { status: 500 }
    );
  }
}