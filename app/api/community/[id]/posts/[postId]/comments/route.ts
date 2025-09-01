import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id]/posts/[postId]/comments - Get post comments
export async function GET(
  request: Request,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const communityId = parseInt(params.id);
    const postId = parseInt(params.postId);
    
    if (isNaN(communityId) || isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid community or post ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const comments = await prisma.communityComment.findMany({
      where: {
        postId,
        parentId: null, // Only get top-level comments, not replies
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = await prisma.communityComment.count({
      where: {
        postId,
        parentId: null,
      }
    });

    return NextResponse.json({
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.user?.name || 'Anonymous',
          avatar: comment.user?.avatar || '/diverse-user-avatars.png',
          role: 'Member' // Default role since it's not in the schema
        },
        timestamp: new Date(comment.createdAt).toLocaleString(),
        likes: comment.likeCount,
        isLiked: false,
        replyCount: comment._count.replies,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/community/[id]/posts/[postId]/comments - Add a comment
export async function POST(
  request: Request,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const communityId = parseInt(params.id);
    const postId = parseInt(params.postId);
    
    if (isNaN(communityId) || isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid community or post ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const userId = body.userId; // In a real app, get from session
    const parentId = body.parentId ? parseInt(body.parentId) : null;

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

    // Create comment
    const comment = await prisma.communityComment.create({
      data: {
        content: body.content,
        userId,
        postId,
        parentId,
      },
    });

    // Update post comment count
    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    // If it's a reply, we don't need to update reply count since Prisma handles relations
    // The reply count can be calculated from the replies relation

    // Get the created comment with user data
    const createdComment = await prisma.communityComment.findUnique({
      where: { id: comment.id },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      }
    });

    const formattedComment = {
      id: createdComment?.id,
      content: createdComment?.content,
      author: {
        name: createdComment?.user?.name || 'Anonymous',
        avatar: createdComment?.user?.avatar || '/diverse-user-avatars.png',
        role: 'Member' // Default role since it's not in the schema
      },
      timestamp: new Date(createdComment?.createdAt || new Date()).toLocaleString(),
      likes: createdComment?._count.likes || 0,
      isLiked: false,
      replyCount: createdComment?._count.replies || 0,
    };

    return NextResponse.json({
      comment: formattedComment,
      commentCount: updatedPost.commentCount
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}