import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/search - Search users by name or email
export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        users: [],
        total: 0
      });
    }

    // Search users by name or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          },
          // Exclude the current user from results
          {
            id: {
              not: parseInt(session.user.id)
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true
      },
      take: Math.min(limit, 50), // Max 50 results
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}