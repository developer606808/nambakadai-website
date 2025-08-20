
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { z } from 'zod';

const stateSchema = z.object({ name_en: z.string().min(2), name_ta: z.string().optional(), stateCode: z.string().min(2) });

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  const body = await request.json();
  const validation = stateSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const updatedState = await prisma.state.update({ where: { id }, data: validation.data });
    return NextResponse.json(updatedState);
  } catch (error) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  try {
    await prisma.state.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }
}
