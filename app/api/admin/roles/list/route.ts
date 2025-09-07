import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/roles/list - Get all roles for dropdown (no pagination)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roles = await prisma.adminRole.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isSystem: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      roles: roles.map((role: { id: number; name: string; description: string | null; isSystem: boolean }) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      })),
    });
  } catch (error) {
    console.error('Error fetching roles list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles list' },
      { status: 500 }
    );
  }
}