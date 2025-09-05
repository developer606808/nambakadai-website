import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

// GET /api/admin/users/[id] - Get single user
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
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isBlocked: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            stores: true,
            products: true,
            communityPosts: true,
            communityMemberships: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.toLowerCase(),
        status: user.isBlocked ? 'blocked' : 'active',
        isVerified: user.isVerified,
        avatar: user.avatar || '/placeholder.svg',
        joinDate: user.createdAt.toISOString().split('T')[0],
        lastLogin: user.lastLoginAt?.toISOString().split('T')[0] || 'Never',
        stats: {
          stores: user._count.stores,
          products: user._count.products,
          posts: user._count.communityPosts,
          communities: user._count.communityMemberships,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
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
    const userId = parseInt(id);
    const body = await request.json();

    const { name, email, phone, role, password, confirmPassword, isBlocked, isVerified } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
        deletedAt: null,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      name,
      email,
      phone,
      role: role?.toUpperCase(),
      isBlocked: isBlocked || false,
      isVerified: isVerified || false,
    };

    // Handle password update
    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: 'Passwords do not match' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      updateData.password = await hash(password, 12);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId, deletedAt: null },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isBlocked: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Soft delete user
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
    const userId = parseInt(id);

    // Check if user exists and is not already deleted
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, deletedAt: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.deletedAt) {
      return NextResponse.json({ error: 'User is already deleted' }, { status: 400 });
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      user: { id: userId, name: user.name },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}