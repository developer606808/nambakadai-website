import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/search - Search communities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      isBlocked: false,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (location) {
      where.location = location;
    }

    const communities = await prisma.community.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    const total = await prisma.community.count({ where });

    return NextResponse.json({
      communities: communities.map(community => ({
        ...community,
        memberCount: community._count.members,
        postCount: community._count.posts,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching communities:', error);
    return NextResponse.json(
      { error: 'Failed to search communities' },
      { status: 500 }
    );
  }
}