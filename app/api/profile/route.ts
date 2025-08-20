
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { z } from 'zod';

const profileSchema = z.object({ name: z.string().min(2), image: z.string().url().optional() });

// GET current user's profile
export async function GET(request: Request) {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // The user object from the cookie is sufficient
    return NextResponse.json(user);
}

// PUT to update current user's profile
export async function PUT(request: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validation = profileSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const updatedUser = await prisma.user.update({ where: { id: user.id }, data: validation.data });
  return NextResponse.json(updatedUser);
}
