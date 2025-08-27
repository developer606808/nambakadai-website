export type CacheKey = string;
export type CacheValue = any;
export type CacheOptions = {
  ttl?: number; // Time to live in seconds
};

class SimpleCache {
  private cache: Map<CacheKey, { value: CacheValue; expires: number }> = new Map();
  
  set(key: CacheKey, value: CacheValue, options: CacheOptions = {}): void {
    const ttl = options.ttl || 300; // Default 5 minutes
    const expires = Date.now() + ttl * 1000;
    
    this.cache.set(key, { value, expires });
  }
  
  get(key: CacheKey): CacheValue | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key: CacheKey): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  has(key: CacheKey): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Create a singleton instance
export const cache = new SimpleCache();

// Utility functions for common cache operations
export function cacheSet<T>(key: string, value: T, ttl?: number): void {
  cache.set(key, value, { ttl });
}

export function cacheGet<T>(key: string): T | null {
  return cache.get(key) as T | null;
}

export function cacheDelete(key: string): boolean {
  return cache.delete(key);
}

export function cacheHas(key: string): boolean {
  return cache.has(key);
}