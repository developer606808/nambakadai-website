import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/community/[id]/posts/[postId]/like - Like/unlike a post
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const { id, postId } = await params;
    const communityId = parseInt(id);
    const postIdNum = parseInt(postId);
    
    if (isNaN(communityId) || isNaN(postIdNum)) {
      return NextResponse.json(
        { error: 'Invalid community or post ID' },
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

    // Check if user has already liked the post
    const existingLike = await prisma.communityLike.findFirst({
      where: {
        userId,
        postId: postIdNum,
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.communityLike.deleteMany({
        where: {
          userId,
          postId: postIdNum,
        },
      });

      // Decrement like count
      await prisma.communityPost.update({
        where: { id: postIdNum },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ message: 'Post unliked successfully' });
    } else {
      // Like the post
      await prisma.communityLike.create({
        data: {
          userId,
          postId: postIdNum,
        },
      });

      // Increment like count
      await prisma.communityPost.update({
        where: { id: postIdNum },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: 'Post liked successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}