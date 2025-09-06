// Test file to verify banner functionality
import { getActiveBanners, getHeroBanner, revalidateBannerCache } from '@/lib/data/banners';

export async function testBannerFunctions() {
  console.log('Testing banner functions...');
  
  try {
    // Test getting active banners
    console.log('1. Testing getActiveBanners...');
    const banners = await getActiveBanners();
    console.log(`Found ${banners.length} active banners`);
    console.log('Banner data size:', JSON.stringify(banners).length, 'bytes');
    
    // Test getting hero banner
    console.log('2. Testing getHeroBanner...');
    const heroBanner = await getHeroBanner();
    console.log('Hero banner:', heroBanner ? heroBanner.title : 'No hero banner found');
    
    // Test cache invalidation
    console.log('3. Testing cache invalidation...');
    await revalidateBannerCache();
    console.log('Cache invalidated successfully');
    
    // Test cache refresh
    console.log('4. Testing cache refresh...');
    const refreshedBanners = await getActiveBanners();
    console.log(`Found ${refreshedBanners.length} banners after cache refresh`);
    
    console.log('All banner tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Banner test failed:', error);
    return false;
  }
}

// Function to check data size
export function checkDataSize(data: unknown): { size: number; isUnderLimit: boolean } {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeInMB = sizeInBytes / (1024 * 1024);
  const isUnderLimit = sizeInMB < 2; // Next.js cache limit is 2MB
  
  return {
    size: sizeInBytes,
    isUnderLimit,
  };
}
