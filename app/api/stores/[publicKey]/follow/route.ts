import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/stores/[publicKey]/follow - Check if user is following a store
export async function GET(
  request: Request,
  { params }: { params: { publicKey: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const { publicKey } = params;

    // Find the store
    const store = await (prisma as any).store.findFirst({
      where: { publicKey },
      select: { id: true }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check if user is following this store
    const followRecord = await prisma.followStore.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: store.id
        }
      }
    });

    return NextResponse.json({
      isFollowing: !!followRecord
    });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    );
  }
}

// POST /api/stores/[publicKey]/follow - Follow or unfollow a store
export async function POST(
  request: Request,
  { params }: { params: { publicKey: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const { publicKey } = params;

    // Find the store
    const store = await (prisma as any).store.findFirst({
      where: { publicKey },
      select: { id: true, followersCount: true }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check if user is already following this store
    const existingFollow = await prisma.followStore.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: store.id
        }
      }
    });

    if (existingFollow) {
      // Unfollow: Delete the follow record
      await prisma.followStore.delete({
        where: {
          userId_storeId: {
            userId,
            storeId: store.id
          }
        }
      });

      // Update follower count
      await prisma.store.update({
        where: { id: store.id },
        data: {
          followersCount: {
            decrement: 1
          }
        }
      });

      return NextResponse.json({
        isFollowing: false,
        message: 'Successfully unfollowed the store'
      });
    } else {
      // Follow: Create a new follow record
      await prisma.followStore.create({
        data: {
          userId,
          storeId: store.id
        }
      });

      // Update follower count
      await prisma.store.update({
        where: { id: store.id },
        data: {
          followersCount: {
            increment: 1
          }
        }
      });

      return NextResponse.json({
        isFollowing: true,
        message: 'Successfully followed the store'
      });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json(
      { error: 'Failed to toggle follow status' },
      { status: 500 }
    );
  }
}