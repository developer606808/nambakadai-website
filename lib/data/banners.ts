import { prisma } from '@/lib/prisma';

// Define the banner type for the home page (optimized for performance)
export interface HomeBanner {
  id: string;
  title: string;
  image: string;
  url: string | null;
  position: number;
}

// Transform database banner to home page banner format (optimized)
function transformBannerForHome(banner: any): HomeBanner {
  return {
    id: banner.id,
    title: banner.title,
    image: banner.image,
    url: banner.url,
    position: banner.position,
  };
}

// Simple in-memory cache for banners (alternative to Next.js data cache)
let bannersCache: { data: HomeBanner[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to get active banners for home page (with manual caching)
export async function getActiveBanners(): Promise<HomeBanner[]> {
  try {
    // Check if cache is valid
    const now = Date.now();
    if (bannersCache && (now - bannersCache.timestamp) < CACHE_DURATION) {
      return bannersCache.data;
    }

    // Fetch fresh data
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        image: true,
        url: true,
        position: true,
      },
      orderBy: {
        position: 'asc',
      },
      take: 3, // Limit to 3 banners
    });

    const transformedBanners = banners.map(transformBannerForHome);

    // Update cache
    bannersCache = {
      data: transformedBanners,
      timestamp: now,
    };

    return transformedBanners;
  } catch (error) {
    console.error('Error fetching banners:', error);
    // Return cached data if available, otherwise empty array
    return bannersCache?.data || [];
  }
}

// Function to get hero banner (first active banner)
export async function getHeroBanner(): Promise<HomeBanner | null> {
  try {
    // Get from banners cache first
    const banners = await getActiveBanners();
    return banners.length > 0 ? banners[0] : null;
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    return null;
  }
}

// Function to get banners by position
export async function getBannersByPosition(position: number): Promise<HomeBanner[]> {
  try {
    // Get from main cache and filter by position
    const allBanners = await getActiveBanners();
    return allBanners.filter(banner => banner.position === position);
  } catch (error) {
    console.error(`Error fetching banners for position ${position}:`, error);
    return [];
  }
}

// Function to invalidate banner cache (call this when banners are updated)
export async function revalidateBannerCache() {
  // Clear in-memory cache
  bannersCache = null;

  // Also clear Next.js cache if using any tagged cache
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('banners');
  } catch (error) {
    console.log('Next.js cache revalidation not available');
  }
}
