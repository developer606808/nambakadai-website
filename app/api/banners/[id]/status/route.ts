import { NextResponse } from 'next/server';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { prisma } from '@/lib/prisma';

// PATCH /api/banners/[id]/status - Toggle banner status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { isActive } = await request.json();

    // Validate isActive is a boolean
    if (typeof isActive !== 'boolean') {
      return createApiError('isActive must be a boolean value');
    }

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return createApiError('Banner not found', 404);
    }

    // Update banner status
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: { isActive }
    });

    return createApiResponse(updatedBanner, 'Banner status updated successfully');
  } catch (error) {
    console.error('Error updating banner status:', error);
    return createApiError('Failed to update banner status');
  }
}