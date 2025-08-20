import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const categoryUpdateSchema = z.object({
  name_en: z.string().min(2, "English name is required").optional(),
  name_ta: z.string().optional(),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with no spaces').optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  type: z.enum(['PRODUCT', 'RENTAL', 'BOTH']).optional(),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().optional(),
  sort_order: z.number().int().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const validation = categoryUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(updatedCategory);

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: `A category with this slug already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const id = parseInt(params.id, 10);
        await prisma.category.delete({ where: { id } });
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
