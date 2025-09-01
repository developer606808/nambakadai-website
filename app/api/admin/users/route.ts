import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// GET /api/admin/users - Get all users with pagination and filters
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
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null, // Only get non-deleted users
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    if (role && role !== 'all') {
      where.adminRole = {
        name: { equals: role, mode: 'insensitive' }
      };
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        where.isBlocked = false;
      } else if (status === 'blocked') {
        where.isBlocked = true;
      } else if (status === 'verified') {
        where.isVerified = true;
      } else if (status === 'unverified') {
        where.isVerified = false;
      }
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          adminRole: {
            select: {
              id: true,
              name: true,
              description: true,
              isSystem: true,
            },
          },
          _count: {
            select: {
              stores: true,
              products: true,
              communityPosts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Transform data for frontend
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.adminRole?.name || user.role.toLowerCase(),
      adminRoleId: user.adminRole?.id || null,
      status: user.isBlocked ? 'blocked' : 'active',
      isVerified: user.isVerified,
      avatar: user.avatar || '/placeholder.svg',
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.lastLoginAt?.toISOString().split('T')[0] || 'Never',
      stats: {
        stores: user._count.stores,
        products: user._count.products,
        posts: user._count.communityPosts,
      },
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, role, password, confirmPassword } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Validate role if provided
    let adminRoleId = null;
    if (role) {
      const roleRecord = await (prisma as any).adminRole.findFirst({
        where: {
          name: { equals: role, mode: 'insensitive' },
          deletedAt: null,
        },
      });

      if (!roleRecord) {
        return NextResponse.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        );
      }

      adminRoleId = roleRecord.id;
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'BUYER', // Default role enum value
        adminRoleId,
        isVerified: true, // Admin-created users are auto-verified
      },
      include: {
        adminRole: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}