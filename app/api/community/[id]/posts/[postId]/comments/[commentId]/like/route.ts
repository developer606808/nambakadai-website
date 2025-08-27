import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/community/[id]/posts/[postId]/comments/[commentId]/like - Like/unlike a comment
export async function POST(
  request: Request,
  { params }: { params: { id: string; postId: string; commentId: string } }
) {
  try {
    const communityId = parseInt(params.id);
    const postId = parseInt(params.postId);
    const commentId = parseInt(params.commentId);
    
    if (isNaN(communityId) || isNaN(postId) || isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid community, post, or comment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const userId = body.userId; // In a real app, get from session

    // Check if user is a member of the community
    const member = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'User is not a member of this community' },
        { status: 403 }
      );
    }

    // Check if user has already liked the comment
    const existingLike = await prisma.communityLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.communityLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      // Decrement like count
      await prisma.communityComment.update({
        where: { id: commentId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ message: 'Comment unliked successfully' });
    } else {
      // Like the comment
      await prisma.communityLike.create({
        data: {
          userId,
          commentId,
        },
      });

      // Increment like count
      await prisma.communityComment.update({
        where: { id: commentId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: 'Comment liked successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}