import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const postIdNum = parseInt(postId);
    const userIdNum = parseInt(userId);

    // Validate userId is within INT4 range
    if (isNaN(userIdNum) || userIdNum > 2147483647 || userIdNum < -2147483648) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.communityBookmark.findUnique({
      where: {
        userId_postId: {
          userId: userIdNum,
          postId: postIdNum,
        },
      },
    });

    let isBookmarked: boolean;

    if (existingBookmark) {
      // Remove bookmark
      await prisma.communityBookmark.delete({
        where: {
          userId_postId: {
            userId: userIdNum,
            postId: postIdNum,
          },
        },
      });
      isBookmarked = false;
    } else {
      // Add bookmark
      await prisma.communityBookmark.create({
        data: {
          userId: userIdNum,
          postId: postIdNum,
        },
      });
      isBookmarked = true;
    }

    return NextResponse.json({
      isBookmarked,
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}