import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const categorySchema = z.object({
  name_en: z.string().min(2, "English name is required"),
  name_ta: z.string().optional(),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with no spaces'),
  description: z.string().optional(),
  icon: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  type: z.enum(['PRODUCT', 'RENTAL', 'BOTH']).default('PRODUCT'),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const [categories, totalCategories] = await prisma.$transaction([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { sort_order: 'asc' },
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      data: categories,
      pagination: {
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const newCategory = await prisma.category.create({ data: validation.data });
    return NextResponse.json(newCategory, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: `A category with this slug already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}