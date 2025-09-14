import { NextRequest } from 'next/server';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { prisma } from '@/lib/prisma';

// GET /api/banners - Get all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const where = activeOnly ? { isActive: true } : {};

    const banners = await prisma.banner.findMany({
      where,
      orderBy: {
        position: 'asc'
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined
    });
    return createApiResponse(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return createApiError('Failed to fetch banners');
  }
}

// POST /api/banners - Create a new banner
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.image) {
      return createApiError('Title and image are required');
    }

    const newBanner = await prisma.banner.create({
      data: {
        title: body.title,
        image: body.image,
        url: body.url || null,
        position: body.position || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      }
    });

    return createApiResponse(newBanner, 'Banner created successfully');
  } catch (error) {
    console.error('Error creating banner:', error);
    return createApiError('Failed to create banner');
  }
}