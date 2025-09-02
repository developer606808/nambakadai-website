import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id]/members - Get community members
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const communityId = parseInt(id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const members = await prisma.communityMember.findMany({
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
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const total = await prisma.communityMember.count({ where: { communityId } });

    return NextResponse.json({
      members: members.map(member => ({
        ...member,
        user: member.user,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching community members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community members' },
      { status: 500 }
    );
  }
}

// POST /api/community/[id]/members - Join a community
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const communityId = parseInt(id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const userId = body.userId; // In a real app, get from session

    // Check if user is already a member
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this community' },
        { status: 400 }
      );
    }

    // Get community to check privacy settings
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    // Create membership
    const member = await prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: 'MEMBER',
        isApproved: community.privacy === 'PUBLIC', // Auto-approve for public communities
      },
    });

    // Update community member count
    await prisma.community.update({
      where: { id: communityId },
      data: {
        memberCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error joining community:', error);
    return NextResponse.json(
      { error: 'Failed to join community' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/[id]/members - Leave a community
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const communityId = parseInt(id);
    
    if (isNaN(communityId)) {
      return NextResponse.json(
        { error: 'Invalid community ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const userId = body.userId; // In a real app, get from session

    // Check if user is a member
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
        { status: 400 }
      );
    }

    // Delete membership
    await prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    // Update community member count
    await prisma.community.update({
      where: { id: communityId },
      data: {
        memberCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully left community' });
  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json(
      { error: 'Failed to leave community' },
      { status: 500 }
    );
  }
}