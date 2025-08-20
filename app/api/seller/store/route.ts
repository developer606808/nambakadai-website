
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { z } from 'zod';

// Zod schema for creating/updating a store
const storeSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  logoUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
});

// GET: Fetch the current seller's store
export async function GET(request: Request) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: user.id },
  });

  if (!store) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  }

  return NextResponse.json(store);
}

// POST: Create a store for the current seller
export async function POST(request: Request) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user already has a store
  const existingStore = await prisma.store.findUnique({ where: { ownerId: user.id } });
  if (existingStore) {
    return NextResponse.json({ error: 'A store already exists for this user' }, { status: 409 });
  }

  const body = await request.json();
  const validation = storeSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
  }

  const newStore = await prisma.store.create({
    data: {
      ...validation.data,
      ownerId: user.id,
    },
  });

  return NextResponse.json(newStore, { status: 201 });
}

// PUT: Update the current seller's store
export async function PUT(request: Request) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = storeSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
  }

  const updatedStore = await prisma.store.update({
    where: { ownerId: user.id },
    data: validation.data,
  });

  return NextResponse.json(updatedStore);
}
