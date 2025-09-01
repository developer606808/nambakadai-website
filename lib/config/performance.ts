// Performance optimization configuration for the application

export const CACHE_CONFIG = {
  // Banner cache settings
  BANNERS: {
    REVALIDATE_TIME: 300, // 5 minutes
    MAX_BANNERS: 5,
    TAGS: ['banners'],
  },
  
  // Product cache settings
  PRODUCTS: {
    REVALIDATE_TIME: 600, // 10 minutes
    MAX_FEATURED: 8,
    TAGS: ['products'],
  },
  
  // Category cache settings
  CATEGORIES: {
    REVALIDATE_TIME: 3600, // 1 hour
    TAGS: ['categories'],
  },
  
  // Store cache settings
  STORES: {
    REVALIDATE_TIME: 1800, // 30 minutes
    TAGS: ['stores'],
  },
} as const;

// Image optimization settings
export const IMAGE_CONFIG = {
  BANNER: {
    WIDTH: 1200,
    HEIGHT: 400,
    QUALITY: 85,
    PRIORITY: true,
  },
  
  PRODUCT: {
    WIDTH: 300,
    HEIGHT: 200,
    QUALITY: 80,
    PRIORITY: false,
  },
  
  STORE: {
    WIDTH: 300,
    HEIGHT: 150,
    QUALITY: 80,
    PRIORITY: false,
  },
} as const;

// Database query optimization
export const DB_CONFIG = {
  // Connection pool settings
  CONNECTION_POOL: {
    MAX_CONNECTIONS: 10,
    IDLE_TIMEOUT: 30000,
    CONNECTION_TIMEOUT: 60000,
  },
  
  // Query limits
  LIMITS: {
    BANNERS: 5,
    FEATURED_PRODUCTS: 8,
    FEATURED_RENTALS: 8,
    CATEGORIES: 20,
    STORES: 12,
  },
} as const;

// Static generation settings
export const STATIC_CONFIG = {
  // Pages to statically generate
  STATIC_PAGES: [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ],
  
  // ISR (Incremental Static Regeneration) settings
  ISR: {
    HOME_PAGE: 300, // 5 minutes
    PRODUCT_PAGES: 600, // 10 minutes
    CATEGORY_PAGES: 1800, // 30 minutes
    STORE_PAGES: 900, // 15 minutes
  },
} as const;

// Performance monitoring
export const MONITORING_CONFIG = {
  // Core Web Vitals thresholds
  WEB_VITALS: {
    LCP_THRESHOLD: 2500, // Largest Contentful Paint (ms)
    FID_THRESHOLD: 100,  // First Input Delay (ms)
    CLS_THRESHOLD: 0.1,  // Cumulative Layout Shift
  },
  
  // API response time thresholds
  API_THRESHOLDS: {
    FAST: 200,    // ms
    AVERAGE: 500, // ms
    SLOW: 1000,   // ms
  },
} as const;

// CDN and asset optimization
export const ASSET_CONFIG = {
  // Image formats by priority
  IMAGE_FORMATS: ['webp', 'avif', 'jpeg', 'png'],
  
  // Compression settings
  COMPRESSION: {
    GZIP: true,
    BROTLI: true,
    LEVEL: 6,
  },
  
  // Cache headers
  CACHE_HEADERS: {
    STATIC_ASSETS: 'public, max-age=31536000, immutable', // 1 year
    IMAGES: 'public, max-age=2592000', // 30 days
    API_RESPONSES: 'public, max-age=300, s-maxage=300', // 5 minutes
  },
} as const;
