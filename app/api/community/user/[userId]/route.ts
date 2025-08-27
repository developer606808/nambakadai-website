import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/user/[userId] - Get communities a user belongs to
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const memberships = await prisma.communityMember.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        community: {
          include: {
            _count: {
              select: {
                members: true,
                posts: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const communities = memberships.map(membership => ({
      ...membership.community,
      memberCount: membership.community._count.members,
      postCount: membership.community._count.posts,
      role: membership.role,
      isApproved: membership.isApproved,
      joinedAt: membership.joinedAt,
    }));

    const total = await prisma.communityMember.count({ where: { userId } });

    return NextResponse.json({
      communities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user communities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user communities' },
      { status: 500 }
    );
  }
}