import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// POST /api/banners/revalidate - Revalidate banner cache
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return createApiError('Unauthorized', 401);
    // }

    // Revalidate banner cache
    revalidateTag('banners');
    
    return createApiResponse(
      { revalidated: true, timestamp: new Date().toISOString() },
      'Banner cache revalidated successfully'
    );
  } catch (error) {
    console.error('Error revalidating banner cache:', error);
    return createApiError('Failed to revalidate banner cache');
  }
}

// GET /api/banners/revalidate - Get cache status (for debugging)
export async function GET() {
  try {
    return createApiResponse({
      message: 'Banner cache revalidation endpoint is active',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking revalidation endpoint:', error);
    return createApiError('Failed to check revalidation endpoint');
  }
}
