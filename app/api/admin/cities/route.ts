
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const citySchema = z.object({ name_en: z.string().min(2), name_ta: z.string().optional(), state_id: z.number().int() });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const stateId = searchParams.get('state_id');

  const where = stateId ? { state_id: parseInt(stateId) } : {};

  try {
    const [cities, totalCities] = await prisma.$transaction([
      prisma.city.findMany({
        skip,
        take: limit,
        where,
        include: { state: true },
        orderBy: { name_en: 'asc' },
      }),
      prisma.city.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCities / limit);

    return NextResponse.json({
      data: cities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCities,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const validation = citySchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const newCity = await prisma.city.create({ data: validation.data });
  return NextResponse.json(newCity, { status: 201 });
}

