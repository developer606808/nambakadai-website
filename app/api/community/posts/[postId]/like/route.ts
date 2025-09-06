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

    // Check if like already exists
    const existingLike = await prisma.communityLike.findFirst({
      where: {
        userId: userIdNum,
        postId: postIdNum,
        commentId: null, // Only for post likes, not comment likes
      },
    });

    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Unlike: delete the like
      await prisma.communityLike.deleteMany({
        where: {
          userId: userIdNum,
          postId: postIdNum,
          commentId: null,
        },
      });
      isLiked = false;
    } else {
      // Like: create the like
      await prisma.communityLike.create({
        data: {
          userId: userIdNum,
          postId: postIdNum,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const updatedPost = await prisma.communityPost.findUnique({
      where: { id: postIdNum },
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    likeCount = updatedPost?._count.likes || 0;

    return NextResponse.json({
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}