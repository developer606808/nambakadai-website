import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

// GET all roles with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const [roles, totalRoles] = await prisma.$transaction([
      prisma.role.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.role.count(),
    ]);

    const totalPages = Math.ceil(totalRoles / limit);

    return NextResponse.json({
      data: roles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalRoles,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

// POST a new role
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const validation = roleSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data', details: validation.error.errors }, { status: 400 });

  try {
    const newRole = await prisma.role.create({ data: validation.data });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Failed to create role:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
