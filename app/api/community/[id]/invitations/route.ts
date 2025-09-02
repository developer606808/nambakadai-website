import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/community/[id]/invitations - Get community invitations
export async function GET(
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

    // Check if user has permission to view invitations
    if (community.members.length === 0) {
      return NextResponse.json(
        { error: 'You do not have permission to view invitations' },
        { status: 403 }
      );
    }

    // For now, return empty array since we don't have invitation table
    // In a real app, you'd fetch from communityInvitation table
    const invitations: any[] = [];

    return NextResponse.json({
      invitations,
      total: 0
    });
  } catch (error) {
    console.error('Error fetching community invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}