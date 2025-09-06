import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/community/[id]/privacy - Update community privacy settings
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = parseInt(session.user.id);

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');
    const whereClause = isUUID ? { uuid: id } as any : { id: parseInt(id) };

    // Get community and check if user is owner/admin
    const community = await prisma.community.findUnique({
      where: whereClause,
      include: {
        members: {
          where: { userId, role: 'ADMIN' },
          select: { role: true }
        }
      }
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update privacy settings
    if (community.members.length === 0) {
      return NextResponse.json(
        { error: 'You do not have permission to update this community' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { isPrivate } = body;

    // Update community privacy settings
    const updatedCommunity = await prisma.community.update({
      where: whereClause,
      data: {
        privacy: isPrivate ? 'PRIVATE' : 'PUBLIC'
      }
    });

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      community: {
        ...updatedCommunity,
        privacy: updatedCommunity.privacy
      }
    });
  } catch (error) {
    console.error('Error updating community privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy settings' },
      { status: 500 }
    );
  }
}