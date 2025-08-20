
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const stateSchema = z.object({ name_en: z.string().min(2), name_ta: z.string().optional(), stateCode: z.string().min(2) });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const [states, totalStates] = await prisma.$transaction([
      prisma.state.findMany({
        skip,
        take: limit,
        orderBy: { name_en: 'asc' },
      }),
      prisma.state.count(),
    ]);

    const totalPages = Math.ceil(totalStates / limit);

    return NextResponse.json({
      data: states,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalStates,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch states:", error);
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const validation = stateSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const newState = await prisma.state.create({ data: validation.data });
  return NextResponse.json(newState, { status: 201 });
}

