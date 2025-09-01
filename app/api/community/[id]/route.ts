import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id] - Get a specific community
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

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...community,
      memberCount: community._count.members,
      postCount: community._count.posts,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

// PUT /api/community/[id] - Update a community
export async function PUT(
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

    // In a real app, you would validate that the user has permission to update this community
    // For now, we'll just update it

    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        privacy: body.privacy,
        location: body.location,
        rules: body.rules,
        image: body.image,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: 'Failed to update community' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/[id] - Delete a community
export async function DELETE(
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

    // In a real app, you would validate that the user has permission to delete this community
    // For now, we'll just delete it

    await prisma.community.delete({
      where: { id: communityId },
    });

    return NextResponse.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: 'Failed to delete community' },
      { status: 500 }
    );
  }
}