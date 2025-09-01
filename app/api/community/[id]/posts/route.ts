import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/community/[id]/posts - Get community posts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< Updated upstream
    const communityId = parseInt(params.id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
        { status: 400 }
      );
=======
    const { id } = await params;

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');
    let communityId: number;

    if (isUUID) {
      // Find community by UUID to get the integer ID
      const community = await prisma.community.findUnique({
        where: { uuid: id } as any,
        select: { id: true }
      });

      if (!community) {
        return NextResponse.json(
          { error: 'Community not found' },
          { status: 404 }
        );
      }

      communityId = community.id;
    } else {
      communityId = parseInt(id);
      if (isNaN(communityId)) {
        return NextResponse.json(
          { error: 'Invalid community ID' },
          { status: 400 }
        );
      }
>>>>>>> Stashed changes
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
        id: post.id,
        publicKey: (post as any).publicKey,
        content: post.content,
        type: post.type.toLowerCase(),
        media: post.mediaUrl,
        author: {
          id: post.user?.id,
          name: post.user?.name || 'Anonymous',
          avatar: post.user?.avatar || '/diverse-user-avatars.png',
        },
        timestamp: new Date(post.createdAt).toLocaleString(),
        likes: post._count.likes,
        comments: post._count.comments,
        isLiked: false,
        isBookmarked: false
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');
    let communityId: number;

    if (isUUID) {
      // Find community by UUID to get the integer ID
      const community = await prisma.community.findUnique({
        where: { uuid: id } as any,
        select: { id: true }
      });

      if (!community) {
        return NextResponse.json(
          { error: 'Community not found' },
          { status: 404 }
        );
      }

      communityId = community.id;
    } else {
      communityId = parseInt(id);
      if (isNaN(communityId)) {
        return NextResponse.json(
          { error: 'Invalid community ID' },
          { status: 400 }
        );
      }
    }

    // Handle FormData for file uploads
    const formData = await request.formData();
    const content = formData.get('content')?.toString() || '';
    const type = formData.get('type')?.toString() || 'TEXT';
    const userId = parseInt(formData.get('userId')?.toString() || '1');
    const mediaFile = formData.get('media') as File | null;

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

    let mediaUrl = null;

    // Handle file upload if provided
    if (mediaFile) {
      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts');
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(7)}.${mediaFile.name.split('.').pop()}`;
      const filePath = path.join(uploadDir, fileName);

      const fileBuffer = Buffer.from(await mediaFile.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);

      mediaUrl = `/uploads/posts/${fileName}`;
    }

    // Create post
    const post = await prisma.communityPost.create({
      data: {
        content,
        type: type as any,
        mediaUrl,
        userId,
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

    // Update community post count
    await prisma.community.update({
      where: { id: communityId },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      id: post.id,
      publicKey: (post as any).publicKey,
      content: post.content,
      type: post.type.toLowerCase(),
      media: post.mediaUrl,
      author: {
        id: post.user.id,
        name: post.user.name || 'Anonymous',
        avatar: post.user.avatar || '/diverse-user-avatars.png',
        role: 'Community Member'
      },
      timestamp: 'Just now',
      likes: post._count.likes,
      comments: post._count.comments,
      isLiked: false,
      isBookmarked: false
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}