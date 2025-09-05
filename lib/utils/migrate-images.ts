import { prisma } from '@/lib/prisma';
import { base64ToFileServer } from './file-upload-server';

// Use the server-side base64 to file conversion
async function base64ToFile(base64Data: string): Promise<string> {
  return await base64ToFileServer(base64Data);
}

// Migration function to convert all base64 images to files
export async function migrateBannerImages(): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    // Get all banners with base64 images
    const banners = await prisma.banner.findMany({
      where: {
        image: {
          startsWith: 'data:image/',
        },
      },
    });

    console.log(`Found ${banners.length} banners with base64 images to migrate`);

    for (const banner of banners) {
      try {
        console.log(`Migrating banner ${banner.id}: ${banner.title}`);
        
        // Convert base64 to file
        const newImageUrl = await base64ToFile(banner.image);
        
        // Update database with new file URL
        await prisma.banner.update({
          where: { id: banner.id },
          data: { image: newImageUrl },
        });
        
        results.success++;
        console.log(`✅ Successfully migrated banner ${banner.id}`);
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to migrate banner ${banner.id}: ${error}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log(`Migration completed: ${results.success} success, ${results.failed} failed`);
    return results;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Function to check database size before and after migration
export async function checkDatabaseSize(): Promise<{ totalBanners: number; base64Banners: number; fileBanners: number }> {
  try {
    const totalBanners = await prisma.banner.count();
    
    const base64Banners = await prisma.banner.count({
      where: {
        image: {
          startsWith: 'data:image/',
        },
      },
    });
    
    const fileBanners = await prisma.banner.count({
      where: {
        image: {
          startsWith: '/uploads/',
        },
      },
    });

    return { totalBanners, base64Banners, fileBanners };
  } catch (error) {
    console.error('Error checking database size:', error);
    throw error;
  }
}

// Function to estimate storage savings
export async function estimateStorageSavings(): Promise<{ currentSize: number; estimatedSavings: number }> {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        image: {
          startsWith: 'data:image/',
        },
      },
      select: {
        image: true,
      },
    });

    let totalBase64Size = 0;
    for (const banner of banners) {
      totalBase64Size += Buffer.byteLength(banner.image, 'utf8');
    }

    // Base64 encoding adds ~33% overhead, so file storage will be ~25% smaller
    const estimatedSavings = Math.round(totalBase64Size * 0.25);

    return {
      currentSize: totalBase64Size,
      estimatedSavings,
    };
  } catch (error) {
    console.error('Error estimating storage savings:', error);
    throw error;
  }
}

// Utility to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
