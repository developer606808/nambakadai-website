
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { z } from 'zod';

// Note: For a real app, you'd add an 'approved' field to the Store model in schema.prisma
// For now, this is a placeholder. I will assume a boolean `isApproved` field exists.

const approvalSchema = z.object({ isApproved: z.boolean() });

// GET all stores for moderation
export async function GET(request: Request) {
    const user = await getUserFromCookie();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const stores = await prisma.store.findMany({ include: { owner: true } });
    return NextResponse.json(stores);
}

// PUT to update a store's approval status
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  const body = await request.json();
  const validation = approvalSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const updatedStore = await prisma.store.update({
      where: { id },
      data: { isApproved: validation.data.isApproved }
  });

  return NextResponse.json(updatedStore);
}
