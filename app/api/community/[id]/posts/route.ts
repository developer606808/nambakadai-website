import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id]/posts - Get community posts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = parseInt(params.id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const posts = await prisma.communityPost.findMany({
      where: { communityId },
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
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.communityPost.count({ where: { communityId } });

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        user: post.user,
        commentCount: post._count.comments,
        likeCount: post._count.likes,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

// POST /api/community/[id]/posts - Create a new post
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = parseInt(params.id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
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

    // Create post
    const post = await prisma.communityPost.create({
      data: {
        content: body.content,
        type: body.type || 'TEXT',
        mediaUrl: body.mediaUrl || null,
        userId,
        communityId,
      },
    });

    // Update community post count
    await prisma.community.update({
      where: { id: communityId },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}