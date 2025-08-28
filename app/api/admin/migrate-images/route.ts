import { NextRequest, NextResponse } from 'next/server';
import { migrateBannerImages, checkDatabaseSize, estimateStorageSavings, formatBytes } from '@/lib/utils/migrate-images';
import { createApiResponse, createApiError } from '@/lib/utils/api';

// POST /api/admin/migrate-images - Run image migration
export async function POST(request: NextRequest) {
  try {
    console.log('Starting banner image migration...');
    
    // Check current state
    const beforeStats = await checkDatabaseSize();
    const savings = await estimateStorageSavings();
    
    console.log(`Before migration: ${beforeStats.base64Banners} base64 images, ${beforeStats.fileBanners} file images`);
    console.log(`Estimated savings: ${formatBytes(savings.estimatedSavings)}`);
    
    if (beforeStats.base64Banners === 0) {
      return createApiResponse({
        message: 'No base64 images found to migrate',
        stats: beforeStats,
      });
    }
    
    // Run migration
    const results = await migrateBannerImages();
    
    // Check final state
    const afterStats = await checkDatabaseSize();
    
    return createApiResponse({
      migration: results,
      before: beforeStats,
      after: afterStats,
      estimatedSavings: formatBytes(savings.estimatedSavings),
    }, 'Migration completed successfully');
    
  } catch (error) {
    console.error('Error in image migration:', error);
    return createApiError('Migration failed', 500);
  }
}

// GET /api/admin/migrate-images - Check migration status
export async function GET() {
  try {
    const stats = await checkDatabaseSize();
    const savings = await estimateStorageSavings();
    
    return createApiResponse({
      stats,
      estimatedSavings: formatBytes(savings.estimatedSavings),
      currentSize: formatBytes(savings.currentSize),
      needsMigration: stats.base64Banners > 0,
    });
    
  } catch (error) {
    console.error('Error checking migration status:', error);
    return createApiError('Failed to check migration status', 500);
  }
}
