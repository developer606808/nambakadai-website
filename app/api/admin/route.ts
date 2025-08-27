import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// GET /api/admin/stats - Get admin dashboard statistics
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

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get statistics
    const [
      totalUsers,
      totalSellers,
      totalStores,
      totalProducts,
      totalReports,
      pendingReports,
      approvedStores,
      blockedUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.store.count(),
      prisma.product.count(),
      prisma.report.count(),
      prisma.report.count({ where: { resolved: false } }),
      prisma.store.count({ where: { isApproved: true } }),
      prisma.user.count({ where: { isBlocked: true } })
    ]);

    return NextResponse.json({
      totalUsers,
      totalSellers,
      totalStores,
      totalProducts,
      totalReports,
      pendingReports,
      approvedStores,
      blockedUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/:id/block - Block/unblock a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { block } = body;

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isBlocked: block }
    });

    return NextResponse.json({
      message: block ? 'User blocked successfully' : 'User unblocked successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}