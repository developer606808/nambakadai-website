import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { Prisma } from '@prisma/client';

// GET /api/units - List units
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: Prisma.UnitWhereInput = {};
    
    if (search) {
      where.OR = [
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ta: { contains: search, mode: 'insensitive' } },
        { symbol: { contains: search, mode: 'insensitive' } },
      ];
    }

    const units = await prisma.unit.findMany({
      where,
      select: { // Select only necessary fields for public display
        id: true,
        name_en: true,
        name_ta: true,
        symbol: true,
      },
      orderBy: { name_en: 'asc' },
    });

    return createApiResponse(units);

  } catch (error) {
    console.error('Error fetching units:', error);
    return createApiError('Failed to fetch units', 500);
  }
}

