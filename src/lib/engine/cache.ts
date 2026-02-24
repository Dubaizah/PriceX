/**
 * PriceX - Caching Service
 * Redis cache layer for fast data retrieval
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 3600000; // 1 hour in ms

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.memoryCache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
  }

  /**
   * Clear all cache entries matching a pattern
   */
  clearPattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache stats
   */
  getStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys()),
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let count = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        this.memoryCache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Generate cache key for product search
   */
  static searchKey(
    query: string,
    filters?: Record<string, any>,
    region?: string
  ): string {
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `search:${query}:${region || 'global'}:${filterStr}`;
  }

  /**
   * Generate cache key for product comparison
   */
  static comparisonKey(productId: string, filters?: Record<string, any>): string {
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `compare:${productId}:${filterStr}`;
  }

  /**
   * Generate cache key for product details
   */
  static productKey(productId: string): string {
    return `product:${productId}`;
  }

  /**
   * Generate cache key for price history
   */
  static priceHistoryKey(productId: string, days: number): string {
    return `price-history:${productId}:${days}`;
  }
}

// Export singleton
export const cacheService = new CacheService();
