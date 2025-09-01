import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/community/posts/all - Get posts from all communities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const posts = await prisma.communityPost.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      },
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

    // If userId is provided, check likes and bookmarks for each post
    let userLikes: number[] = [];
    let userBookmarks: number[] = [];

    if (userId) {
      const userIdNum = parseInt(userId);

      // Get user's likes
      const likes = await prisma.communityLike.findMany({
        where: {
          userId: userIdNum,
          commentId: null // Only post likes
        },
        select: {
          postId: true
        }
      });
      userLikes = likes.map(like => like.postId).filter(Boolean) as number[];

      // Get user's bookmarks
      const bookmarks = await prisma.communityBookmark.findMany({
        where: {
          userId: userIdNum
        },
        select: {
          postId: true
        }
      });
      userBookmarks = bookmarks.map(bookmark => bookmark.postId);
    }

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      publicKey: post.publicKey,
      content: post.content,
      type: post.type.toLowerCase(),
      media: post.mediaUrl,
      author: {
        name: post.user?.name || 'Anonymous',
        avatar: post.user?.avatar || '/diverse-user-avatars.png',
        role: post.user?.role || 'Member'
      },
      community: {
        name: post.community?.name || 'Unknown Community',
        uuid: post.community?.uuid || 'general'
      },
      timestamp: new Date(post.createdAt).toLocaleString(),
      likes: post._count?.likes || 0,
      comments: post._count?.comments || 0,
      shares: 0,
      isLiked: userLikes.includes(post.id),
      isBookmarked: userBookmarks.includes(post.id)
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/community/posts - Create a new post
export async function POST(request: Request) {
  try {
    // Handle FormData for file uploads
    const formData = await request.formData();
    const content = formData.get('content')?.toString() || '';
    const type = formData.get('type')?.toString() || 'TEXT';
    const communityId = parseInt(formData.get('communityId')?.toString() || '1');
    const userId = parseInt(formData.get('userId')?.toString() || '1');
    const mediaFile = formData.get('media') as File | null;

    // Validate required fields
    if (!content && !mediaFile) {
      return NextResponse.json(
        { error: 'Content or media is required' },
        { status: 400 }
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

    const post = await prisma.communityPost.create({
      data: {
        content,
        type: type as any,
        mediaUrl,
        communityId,
        userId,
        likeCount: 0,
        commentCount: 0,
        isPinned: false
      },
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
            name: true,
            uuid: true
          }
        }
      }
    });

    const postWithRelations = post as any;

    return NextResponse.json({
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
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
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