import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const postIdNum = parseInt(postId);

    // Fetch post details
    const post = await prisma.communityPost.findUnique({
      where: { id: postIdNum },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            role: true
          }
        },
        community: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Fetch comments
    const comments = await prisma.communityComment.findMany({
      where: { postId: postIdNum },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            role: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const formattedComments = comments.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      author: {
        name: comment.user?.name || 'Anonymous',
        avatar: comment.user?.avatar || '/diverse-user-avatars.png',
        role: comment.user?.role || 'Member'
      },
      timestamp: new Date(comment.createdAt).toLocaleString(),
      likes: comment._count?.likes || 0,
      isLiked: false // This would be determined by user's likes
    }));

    const postWithRelations = post as any;

    const formattedPost = {
      id: post.id,
      publicKey: (post as any).publicKey,
      content: post.content,
      type: post.type.toLowerCase(),
      media: post.mediaUrl,
      author: {
        name: postWithRelations.user?.name || 'Anonymous',
        avatar: postWithRelations.user?.avatar || '/diverse-user-avatars.png',
        role: postWithRelations.user?.role || 'Member'
      },
      community: {
        name: postWithRelations.community?.name || 'Unknown Community',
        uuid: (postWithRelations.community as any)?.uuid || 'general'
      },
      timestamp: new Date(post.createdAt).toLocaleString(),
      likes: postWithRelations._count?.likes || 0,
      comments: postWithRelations._count?.comments || 0,
      isLiked: false,
      isBookmarked: false
    };

    return NextResponse.json({
      post: formattedPost,
      comments: formattedComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const postIdNum = parseInt(postId);

    // Verify post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postIdNum }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content, userId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);

    // Validate userId is within INT4 range
    if (isNaN(userIdNum) || userIdNum > 2147483647 || userIdNum < -2147483648) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await prisma.communityComment.create({
      data: {
        content: content.trim(),
        postId: postIdNum,
        userId: userIdNum,
      },
    });

    // Update post comment count
    const updatedPost = await prisma.communityPost.update({
      where: { id: postIdNum },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

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
        role: 'Member'
      },
      timestamp: new Date(createdComment?.createdAt || new Date()).toLocaleString(),
      likes: createdComment?._count.likes || 0,
      isLiked: false,
      replyCount: createdComment?._count.replies || 0,
    };

    return NextResponse.json({
      comment: formattedComment,
      commentCount: updatedPost.commentCount
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
