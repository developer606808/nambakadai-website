
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().min(3),
  imageUrl: z.string().min(1),
  linkUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
  // sortOrder: z.number().int().optional(),
});

// GET a single banner
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(banner);
}

// PUT (update) a banner
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  const body = await request.json();
  const validation = bannerSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const updatedBanner = await prisma.banner.update({ where: { id }, data: validation.data });
    return NextResponse.json(updatedBanner);
  } catch (error) {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }
}

// DELETE a banner
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  try {
    await prisma.banner.delete({ where: { id } });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }
}
