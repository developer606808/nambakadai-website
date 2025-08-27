import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id]/posts/[postId] - Get a specific post
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

    const post = await prisma.communityPost.findUnique({
      where: { 
        id: postId,
        communityId,
      },
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
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...post,
      user: post.user,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/community/[id]/posts/[postId] - Update a post
export async function PUT(
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

    // Check if user owns the post
    const post = await prisma.communityPost.findUnique({
      where: { 
        id: postId,
        communityId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (post.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to edit this post' },
        { status: 403 }
      );
    }

    // Update post
    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        content: body.content,
        type: body.type,
        mediaUrl: body.mediaUrl,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/[id]/posts/[postId] - Delete a post
export async function DELETE(
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

    // Check if user owns the post
    const post = await prisma.communityPost.findUnique({
      where: { 
        id: postId,
        communityId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (post.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }

    // Delete post
    await prisma.communityPost.delete({
      where: { id: postId },
    });

    // Update community post count
    await prisma.community.update({
      where: { id: communityId },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}