import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// GET /api/wishlist/count - Get user's wishlist count
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    const userId = parseInt(session.user.id as string);
    if (isNaN(userId)) {
      return NextResponse.json({ count: 0 });
    }

    // Count wishlist items
    const count = await prisma.wishlist.count({
      where: { userId: userId }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return NextResponse.json(
      { error: 'Failed to get wishlist count' },
      { status: 500 }
    );
  }
}