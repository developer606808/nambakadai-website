import { NextResponse } from 'next/server';
import { createApiResponse, createApiError, createApiSuccess } from '@/lib/utils/api';
import { prisma } from '@/lib/prisma';

// GET /api/banners/[id] - Get a specific banner
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      return createApiError('Banner not found', 404);
    }

    return createApiResponse(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return createApiError('Failed to fetch banner');
  }
}

// PUT /api/banners/[id] - Update a banner
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return createApiError('Banner not found', 404);
    }

    // Update banner with only allowed fields
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.image && { image: body.image }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      }
    });

    return createApiResponse(updatedBanner, 'Banner updated successfully');
  } catch (error) {
    console.error('Error updating banner:', error);
    return createApiError('Failed to update banner');
  }
}

// DELETE /api/banners/[id] - Delete a banner
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return createApiError('Banner not found', 404);
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id }
    });

    return createApiSuccess('Banner deleted successfully');
  } catch (error) {
    console.error('Error deleting banner:', error);
    return createApiError('Failed to delete banner');
  }
}