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

// PUT (update) a role
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const roleId = parseInt(params.id);
  if (isNaN(roleId)) return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });

  const body = await request.json();
  const validation = roleSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data', details: validation.error.errors }, { status: 400 });

  try {
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: validation.data,
    });
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// DELETE a role
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const roleId = parseInt(params.id);
  if (isNaN(roleId)) return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });

  try {
    // Check if role is assigned to any user
    const usersWithRole = await prisma.user.count({
      where: { roleId: roleId },
    });

    if (usersWithRole > 0) {
      return NextResponse.json({ error: `Cannot delete role. It is assigned to ${usersWithRole} user(s).` }, { status: 400 });
    }

    await prisma.role.delete({
      where: { id: roleId },
    });
    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error("Failed to delete role:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
