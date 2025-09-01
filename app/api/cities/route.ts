import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cities - List cities (public access)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const stateId = searchParams.get('stateId');

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { name_hi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (stateId) {
      where.stateId = parseInt(stateId);
    }

    // Get cities
    const cities = await prisma.city.findMany({
      where,
      select: {
        id: true,
        name_en: true,
        name_ta: true,
        name_hi: true,
        stateId: true,
      },
      orderBy: { name_en: 'asc' },
    });

    return NextResponse.json({
      cities,
      total: cities.length
    });

  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}