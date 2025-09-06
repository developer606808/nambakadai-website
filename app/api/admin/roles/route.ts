import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/roles - Get all roles with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AdminRoleWhereInput = {
      deletedAt: null, // Only get non-deleted roles
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'all') {
      if (type === 'system') {
        where.isSystem = true;
      } else if (type === 'custom') {
        where.isSystem = false;
      }
    }

    // Get roles with pagination
    const [roles, total] = await Promise.all([
      prisma.adminRole.findMany({
        where,
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.adminRole.count({ where }),
    ]);

    // Transform data
    const transformedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      userCount: role._count.users,
      createdAt: role.createdAt,
    }));

    return NextResponse.json({
      roles: transformedRoles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles - Create new role
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { error: 'At least one permission is required' },
        { status: 400 }
      );
    }

    // Check if role name already exists
    const existingRole = await prisma.adminRole.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 400 }
      );
    }

    // Create role
    const role = await prisma.adminRole.create({
      data: {
        name,
        description,
        permissions,
        isSystem: false,
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Role created successfully',
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        userCount: role._count.users,
        createdAt: role.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}