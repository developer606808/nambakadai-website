import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/roles/[id] - Get single role
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const roleId = parseInt(id);

    const role = await prisma.adminRole.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        userCount: role._count.users,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/roles/[id] - Update role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const roleId = parseInt(id);
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

    // Check if role exists
    const existingRole = await prisma.adminRole.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check if another role with the same name exists (excluding current role)
    if (name !== existingRole.name) {
      const nameConflict = await prisma.adminRole.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          deletedAt: null,
          id: { not: roleId },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 400 }
        );
      }
    }

    // Update role
    const role = await prisma.adminRole.update({
      where: { id: roleId },
      data: {
        name,
        description,
        permissions,
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
      message: 'Role updated successfully',
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        userCount: role._count.users,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id] - Soft delete role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const roleId = parseInt(id);

    // Check if role exists
    const role = await prisma.adminRole.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check if role is system role
    if (role.isSystem) {
      return NextResponse.json(
        { error: 'System roles cannot be deleted' },
        { status: 400 }
      );
    }

    // Check if role has users assigned
    if (role._count.users > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that has users assigned to it' },
        { status: 400 }
      );
    }

    // Soft delete the role
    await prisma.adminRole.update({
      where: { id: roleId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Role deleted successfully',
      role: { id: roleId, name: role.name },
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}