import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Cache utilities for e-commerce operations
 */
export class CacheService {
  private static readonly PREFIXES = {
    PRODUCT: 'product:',
    COLLECTION: 'collection:',
    CATEGORY: 'category:',
    CART: 'cart:',
    SESSION: 'session:',
    RATE_LIMIT: 'rate_limit:',
  } as const;

  /**
   * Cache product data
   */
  static async cacheProduct(productId: string, data: any, ttl = 3600) {
    const key = `${this.PREFIXES.PRODUCT}${productId}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  }

  /**
   * Get cached product
   */
  static async getCachedProduct(productId: string) {
    const key = `${this.PREFIXES.PRODUCT}${productId}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  /**
   * Cache collection data
   */
  static async cacheCollection(collectionId: string, data: any, ttl = 1800) {
    const key = `${this.PREFIXES.COLLECTION}${collectionId}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  }

  /**
   * Get cached collection
   */
  static async getCachedCollection(collectionId: string) {
    const key = `${this.PREFIXES.COLLECTION}${collectionId}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  /**
   * Cache user cart
   */
  static async cacheCart(userId: string, cartData: any, ttl = 86400) {
    const key = `${this.PREFIXES.CART}${userId}`;
    await redis.setex(key, ttl, JSON.stringify(cartData));
  }

  /**
   * Get cached cart
   */
  static async getCachedCart(userId: string) {
    const key = `${this.PREFIXES.CART}${userId}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  /**
   * Clear cart cache
   */
  static async clearCartCache(userId: string) {
    const key = `${this.PREFIXES.CART}${userId}`;
    await redis.del(key);
  }

  /**
   * Rate limiting
   */
  static async checkRateLimit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `${this.PREFIXES.RATE_LIMIT}${identifier}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }

    const ttl = await redis.ttl(key);
    const resetTime = Date.now() + (ttl * 1000);

    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetTime,
    };
  }

  /**
   * Store session data
   */
  static async setSession(sessionId: string, data: any, ttl = 86400) {
    const key = `${this.PREFIXES.SESSION}${sessionId}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  }

  /**
   * Get session data
   */
  static async getSession(sessionId: string) {
    const key = `${this.PREFIXES.SESSION}${sessionId}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  /**
   * Clear session
   */
  static async clearSession(sessionId: string) {
    const key = `${this.PREFIXES.SESSION}${sessionId}`;
    await redis.del(key);
  }

  /**
   * Bulk delete by pattern
   */
  static async clearByPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Clear all product cache
   */
  static async clearProductCache() {
    await this.clearByPattern(`${this.PREFIXES.PRODUCT}*`);
  }

  /**
   * Clear all collection cache
   */
  static async clearCollectionCache() {
    await this.clearByPattern(`${this.PREFIXES.COLLECTION}*`);
  }
}
