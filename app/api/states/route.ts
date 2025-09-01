import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/states - List all states (public access)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { name_hi: { contains: search, mode: 'insensitive' } },
        { stateCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get all states without pagination for dropdown
    const states = await prisma.state.findMany({
      where,
      select: {
        id: true,
        name_en: true,
        name_ta: true,
        name_hi: true,
        stateCode: true,
      },
      orderBy: { name_en: 'asc' },
    });

    return NextResponse.json({
      states,
      total: states.length
    });

  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}