import { NextRequest, NextResponse } from 'next/server';
import { uploadBannerImageServer, deleteBannerImageServer } from '@/lib/utils/file-upload-server';
import { validateFile } from '@/lib/utils/file-upload';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// POST /api/upload/banner - Upload banner image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createApiError('No file provided', 400);
    }

    // Validate file on server side
    const validation = validateFile(file);
    if (!validation.isValid) {
      return createApiError(validation.error || 'Invalid file', 400);
    }

    const result = await uploadBannerImageServer(file);

    if (!result.success) {
      return createApiError(result.error || 'Upload failed', 400);
    }

    return createApiResponse({
      url: result.url,
      fileName: file.name,
      size: file.size,
      type: file.type,
    }, 'File uploaded successfully');

  } catch (error) {
    console.error('Error in banner upload:', error);
    return createApiError('Internal server error', 500);
  }
}

// DELETE /api/upload/banner - Delete banner image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return createApiError('No image URL provided', 400);
    }

    const success = await deleteBannerImageServer(imageUrl);

    if (!success) {
      return createApiError('Failed to delete image', 400);
    }

    return createApiResponse({ deleted: true }, 'Image deleted successfully');

  } catch (error) {
    console.error('Error deleting banner image:', error);
    return createApiError('Internal server error', 500);
  }
}
