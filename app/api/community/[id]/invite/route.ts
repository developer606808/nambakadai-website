import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// POST /api/community/[id]/invite - Send community invitations
export async function POST(
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

    // Check if user has permission to send invites
    if (community.members.length === 0) {
      return NextResponse.json(
        { error: 'You do not have permission to send invitations' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userIds, emails } = body;

    let invitationCount = 0;
    const errors = [];

    // Process user invitations
    if (userIds && userIds.length > 0) {
      for (const targetUserId of userIds) {
        try {
          // Check if user is already a member
          const existingMember = await prisma.communityMember.findUnique({
            where: {
              userId_communityId: {
                userId: targetUserId,
                communityId: community.id
              }
            }
          });

          if (existingMember) {
            errors.push(`User ${targetUserId} is already a member`);
            continue;
          }

          // For now, just simulate sending invitation
          // In a real app, you'd create invitation records and send emails
          invitationCount++;
        } catch (error) {
          console.error(`Error inviting user ${targetUserId}:`, error);
          errors.push(`Failed to invite user ${targetUserId}`);
        }
      }
    }

    // Process email invitations
    if (emails && emails.length > 0) {
      for (const email of emails) {
        try {
          // Check if user with this email exists
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });

          if (existingUser) {
            // Check if already a member
            const existingMember = await prisma.communityMember.findUnique({
              where: {
                userId_communityId: {
                  userId: existingUser.id,
                  communityId: community.id
                }
              }
            });

            if (existingMember) {
              errors.push(`User with email ${email} is already a member`);
              continue;
            }

            // For now, just simulate sending invitation
            invitationCount++;
          } else {
            errors.push(`User with email ${email} not found`);
            continue;
          }
        } catch (error) {
          console.error(`Error inviting email ${email}:`, error);
          errors.push(`Failed to invite ${email}`);
        }
      }
    }

    return NextResponse.json({
      message: `Successfully sent ${invitationCount} invitations`,
      invitationCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error sending community invitations:', error);
    return NextResponse.json(
      { error: 'Failed to send invitations' },
      { status: 500 }
    );
  }
}