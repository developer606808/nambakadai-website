
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { z } from 'zod';

const citySchema = z.object({ name_en: z.string().min(2), name_ta: z.string().optional(), state_id: z.number().int() });

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  const body = await request.json();
  const validation = citySchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const updatedCity = await prisma.city.update({ where: { id }, data: validation.data });
    return NextResponse.json(updatedCity);
  } catch (error) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  try {
    await prisma.city.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }
}
