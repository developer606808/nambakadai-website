import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const unitSchema = z.object({
  unitName_en: z.string().min(1),
  abbreviation_en: z.string().min(1),
  unitName_ta: z.string().optional(),
  abbreviation_ta: z.string().optional(),
  categoryIds: z.array(z.number().int()).min(1, "At least one category is required"),
  isPublish: z.boolean().default(true),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const [units, totalUnits] = await prisma.$transaction([
      prisma.unit.findMany({
        skip,
        take: limit,
        orderBy: { unitName_en: 'asc' },
        include: {
          category_units: {
            include: {
              category: {
                select: { id: true, name_en: true },
              },
            },
          },
        },
      }),
      prisma.unit.count(),
    ]);

    const totalPages = Math.ceil(totalUnits / limit);

    return NextResponse.json({
      data: units,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUnits,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const validation = unitSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data', details: validation.error.errors }, { status: 400 });

  const { categoryIds, ...unitData } = validation.data;

  try {
    const newUnit = await prisma.unit.create({
      data: {
        ...unitData,
        category_units: {
          create: categoryIds.map(categoryId => ({ category_id: categoryId }))
        }
      }
    });
    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("Failed to create unit:", error);
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }
}
