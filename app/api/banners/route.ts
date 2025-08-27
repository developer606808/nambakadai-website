import { NextResponse } from 'next/server';
import { createApiResponse, createApiError, createApiSuccess } from '@/lib/utils/api';
import { prisma } from '@/lib/prisma';

// GET /api/banners - Get all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        position: 'asc'
      }
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

    // Generate a unique ID
    const id = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const newBanner = await prisma.banner.create({
      data: {
        id,
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