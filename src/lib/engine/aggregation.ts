/**
 * PriceX - Data Aggregation Service
 * Hybrid Data Ingestion Pipeline with API Integration & Scraping
 */

import { scraper, ScrapedProduct } from '../services/scraper';
import { RETAILER_CONFIGS, RetailerConfig } from '../services/retailer-config';
import {
  UnifiedProduct,
  SellerOffer,
  SellerInfo,
  OfferPricing,
  OfferAvailability,
  OfferCondition,
  OfferShipping,
  OfferFulfillment,
  PricePoint,
  IngestionJob,
  ScrapeConfig,
} from '@/types/engine';

export type DataSource = 'api' | 'scraper' | 'feed' | 'manual';

export interface AggregationResult {
  success: boolean;
  products: UnifiedProduct[];
  errors: string[];
  processed: number;
  duration: number;
}

export interface PriceUpdate {
  retailerId: string;
  productId: string;
  price: number;
  originalPrice?: number;
  availability: string;
  timestamp: Date;
}

/**
 * Hybrid Data Ingestion Pipeline
 * Combines API calls, scraping, and feed processing
 */
export class DataAggregationService {
  private rateLimiter: Map<string, number[]> = new Map();
  private defaultRateLimit = 1000; // 1 second between requests
  
  // Supported retailers with their data source type
  private retailerSources: Map<string, DataSource> = new Map([
    ['amazon-us', 'api'],
    ['amazon-uk', 'api'],
    ['amazon-de', 'api'],
    ['amazon-fr', 'api'],
    ['amazon-jp', 'api'],
    ['amazon-in', 'api'],
    ['amazon-au', 'api'],
    ['ebay', 'api'],
    ['walmart', 'scraper'],
    ['bestbuy', 'scraper'],
    ['target', 'scraper'],
    ['newegg', 'scraper'],
    ['aliexpress', 'api'],
    ['alibaba', 'api'],
    ['flipkart', 'scraper'],
    ['noon', 'scraper'],
  ]);

  constructor() {}

  /**
   * Fetch products from all retailers for a search query
   */
  async fetchAllRetailers(query: string, retailers?: string[]): Promise<SellerOffer[]> {
    const targets = retailers || Array.from(this.retailerSources.keys());
    const offers: SellerOffer[] = [];
    
    const promises = targets.map(retailerId => 
      this.fetchFromRetailer(retailerId, query)
        .then(offers => offers)
        .catch(err => {
          console.error(`Error fetching from ${retailerId}:`, err);
          return [];
        })
    );
    
    const results = await Promise.all(promises);
    results.forEach(result => offers.push(...result));
    
    return offers;
  }

  /**
   * Fetch products from a specific retailer
   */
  async fetchFromRetailer(retailerId: string, query: string): Promise<SellerOffer[]> {
    // Check rate limit
    if (!this.checkRateLimit(retailerId)) {
      console.warn(`Rate limit exceeded for ${retailerId}`);
      return [];
    }

    const source = this.retailerSources.get(retailerId) || 'scraper';
    const retailer = RETAILER_CONFIGS.find(r => r.id === retailerId);
    
    if (!retailer) {
      console.warn(`Unknown retailer: ${retailerId}`);
      return [];
    }

    try {
      switch (source) {
        case 'api':
          return await this.fetchViaAPI(retailer, query);
        case 'scraper':
          return await this.fetchViaScraper(retailer, query);
        default:
          return await this.fetchViaScraper(retailer, query);
      }
    } catch (error) {
      console.error(`Failed to fetch from ${retailerId}:`, error);
      return [];
    }
  }

  /**
   * Fetch via official API (Amazon PA-API, eBay API, etc.)
   */
  private async fetchViaAPI(retailer: RetailerConfig, query: string): Promise<SellerOffer[]> {
    // In production, implement actual API calls here
    // For demo, use scraper with API flag
    const scraped = await scraper.scrapeRetailer(retailer.id, query, 5);
    
    return scraped.products.map(product => 
      this.normalizeToOffer(product, retailer)
    );
  }

  /**
   * Fetch via web scraping
   */
  private async fetchViaScraper(retailer: RetailerConfig, query: string): Promise<SellerOffer[]> {
    const scraped = await scraper.scrapeRetailer(retailer.id, query, 5);
    
    return scraped.products.map(product => 
      this.normalizeToOffer(product, retailer)
    );
  }

  /**
   * Normalize scraped product to SellerOffer
   */
  private normalizeToOffer(scraped: ScrapedProduct, retailer: RetailerConfig): SellerOffer {
    const sellerInfo: SellerInfo = {
      id: retailer.id,
      name: retailer.name,
      domain: retailer.domain,
      logo: retailer.logo,
      isVerified: retailer.isVerified,
      isOfficialStore: retailer.isOfficialStore,
      rating: retailer.rating,
      reviewCount: retailer.reviewCount,
      region: retailer.region,
      country: retailer.country,
    };

    const pricing: OfferPricing = {
      basePrice: scraped.price,
      originalPrice: scraped.originalPrice,
      currency: scraped.currency,
      isOnSale: !!scraped.originalPrice,
      discountPercent: scraped.originalPrice 
        ? Math.round((1 - scraped.price / scraped.originalPrice) * 100) 
        : undefined,
      totalLandedCost: scraped.price + (scraped.shipping?.cost || 0),
    };

    const availability: OfferAvailability = {
      status: scraped.availability as any,
      stockLevel: scraped.availability === 'in_stock' ? 'high' : 
                  scraped.availability === 'limited' ? 'low' : 'out',
    };

    const condition: OfferCondition = {
      type: scraped.condition || 'new',
    };

    const shipping: OfferShipping = {
      cost: scraped.shipping?.cost || 0,
      isFree: scraped.shipping?.freeShipping || false,
      estimatedDelivery: scraped.shipping?.estimatedDelivery,
    };

    const fulfillment: OfferFulfillment = {
      type: 'fulfilled_by_seller',
    };

    return {
      id: `offer_${scraped.id}_${Date.now()}`,
      unifiedProductId: '',
      seller: sellerInfo,
      pricing,
      availability,
      condition,
      shipping,
      fulfillment,
      sourceUrl: scraped.url,
      sourceType: retailer.dataSource as any,
      scrapedAt: new Date(),
      priceHistory: [{
        price: scraped.price,
        shipping: scraped.shipping?.cost || 0,
        currency: scraped.currency,
        timestamp: new Date(),
      }],
    };
  }

  /**
   * Check if request is within rate limit
   */
  private checkRateLimit(retailerId: string): boolean {
    const now = Date.now();
    const requests = this.rateLimiter.get(retailerId) || [];
    const recentRequests = requests.filter(t => now - t < this.defaultRateLimit);
    
    if (recentRequests.length >= 10) {
      return false;
    }
    
    recentRequests.push(now);
    this.rateLimiter.set(retailerId, recentRequests);
    return true;
  }

  /**
   * Create ingestion job for scheduled updates
   */
  createIngestionJob(
    type: IngestionJob['type'],
    source: string,
    payload: IngestionJob['payload'],
    priority: IngestionJob['priority'] = 'normal'
  ): IngestionJob {
    return {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      status: 'queued',
      priority,
      payload,
      progress: {
        total: 0,
        processed: 0,
        failed: 0,
        errors: [],
      },
      createdAt: new Date(),
    };
  }

  /**
   * Bulk price update from multiple retailers
   */
  async runBulkUpdate(queries: string[]): Promise<AggregationResult> {
    const startTime = Date.now();
    const products: UnifiedProduct[] = [];
    const errors: string[] = [];
    let processed = 0;

    for (const query of queries) {
      try {
        const offers = await this.fetchAllRetailers(query);
        
        if (offers.length > 0) {
          const product = this.createUnifiedProduct(query, offers);
          products.push(product);
        }
        
        processed++;
      } catch (error) {
        errors.push(`Failed to process query "${query}": ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      products,
      errors,
      processed,
      duration: Date.now() - startTime,
    };
  }

  /**
   * Create unified product from multiple seller offers
   */
  private createUnifiedProduct(query: string, offers: SellerOffer[]): UnifiedProduct {
    const minPrice = Math.min(...offers.map(o => o.pricing.totalLandedCost));
    const maxPrice = Math.max(...offers.map(o => o.pricing.totalLandedCost));
    const avgPrice = offers.reduce((sum, o) => sum + o.pricing.totalLandedCost, 0) / offers.length;
    
    const inStock = offers.filter(o => o.availability.status === 'in_stock');
    const shippingCosts = offers.map(o => o.shipping.cost).filter(c => c > 0);

    return {
      id: `unified_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: `SKU-${Date.now()}`,
      identifiers: {
        brand: offers[0]?.seller?.name,
      },
      title: query,
      titleNormalized: query.toLowerCase().trim(),
      categoryId: 'electronics',
      categoryPath: ['Electronics'],
      attributes: {},
      images: [],
      specifications: [],
      offers: offers.map(o => ({
        ...o,
        unifiedProductId: '',
      })),
      stats: {
        totalSellers: offers.length,
        minPrice,
        maxPrice,
        avgPrice,
        priceRange: maxPrice - minPrice,
        priceHistoryDays: 30,
        lowestShipping: Math.min(...shippingCosts, 0),
        highestShipping: Math.max(...shippingCosts, 0),
        inStockCount: inStock.length,
        outOfStockCount: offers.length - inStock.length,
      },
      matchConfidence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPriceUpdate: new Date(),
      slug: query.toLowerCase().replace(/\s+/g, '-'),
      status: 'active',
      isVerified: false,
    };
  }
}

// Export singleton instance
export const aggregationService = new DataAggregationService();
