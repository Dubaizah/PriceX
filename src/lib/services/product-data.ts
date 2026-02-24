/**
 * PriceX - Unified Product Data Service
 * Combines data from Amazon, eBay, scrapers, and local database
 * Now includes Comparison Engine for price ranking
 */

import { amazonAPI, AmazonProduct, AMAZON_REGIONS } from './amazon-api';
import { ebayAPI, EbayProduct, EBAY_ENDPOINTS } from './ebay-api';
import { scraper, ScrapedProduct, RETAILER_SCRAPER_CONFIGS } from './scraper';
import { GLOBAL_SAMPLE_PRODUCTS } from './sample-data';
import { getSellersByRegion, getSellersByType, GLOBAL_SELLERS, GlobalSeller } from './global-sellers';
import { Product } from '@/types/product-data';
import { comparisonEngine } from '../engine/comparison';
import { cacheService } from '../engine/cache';
import { UnifiedProduct as EngineProduct, SellerOffer, RankedSeller } from '@/types/engine';

export interface UnifiedProduct {
  id: string;
  name: string;
  brand: string;
  description?: string;
  imageUrl: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  prices: PricePoint[];
  tags?: string[];
  lastUpdated: Date;
  sources: string[];
}

export interface PricePoint {
  retailer: string;
  retailerId: string;
  retailerLogo: string;
  price: number;
  originalPrice?: number;
  currency: string;
  availability: string;
  condition: string;
  url: string;
  shipping?: {
    cost: number;
    freeShipping: boolean;
    estimatedDelivery?: string;
  };
  isPrime?: boolean;
  rating?: number;
  // Comparison Engine Data
  rank?: number;
  cheapestFlag?: boolean;
  dealScore?: number;
  totalLandedCost?: number;
  savingsFromHighest?: number;
}

export interface SearchOptions {
  query: string;
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'relevance';
  limit?: number;
}

export interface SearchResponse {
  products: UnifiedProduct[];
  total: number;
  sources: string[];
  aggregatedAt: Date;
}

export class ProductDataService {
  private useLiveData: boolean;

  constructor() {
    // Use live data if API keys are available
    this.useLiveData = !!(
      process.env.AMAZON_ACCESS_KEY ||
      process.env.EBAY_API_KEY ||
      process.env.SCRAPER_API_KEY
    );
  }

  /**
   * Search products across all sources
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, limit = 24, region = 'global' } = options;
    
    const results: UnifiedProduct[] = [];
    const sources: string[] = [];

    // 1. Search local database (sample products)
    const localProducts = this.searchLocalProducts(query, limit);
    if (localProducts.length > 0) {
      results.push(...localProducts);
      sources.push('local');
    }

    // 2. Search Amazon (all regions)
    if (process.env.NEXT_PUBLIC_USE_LIVE_DATA !== 'false') {
      try {
        const amazonResults = await this.searchAmazon(query, region, limit);
        if (amazonResults.length > 0) {
          results.push(...amazonResults);
          sources.push('amazon');
        }
      } catch (error) {
        console.error('Amazon search error:', error);
      }
    }

    // 3. Search eBay
    if (process.env.NEXT_PUBLIC_USE_LIVE_DATA !== 'false') {
      try {
        const ebayResults = await this.searchEbay(query, region, limit);
        if (ebayResults.length > 0) {
          results.push(...ebayResults);
          sources.push('ebay');
        }
      } catch (error) {
        console.error('eBay search error:', error);
      }
    }

    // 4. Scrape other retailers
    if (process.env.NEXT_PUBLIC_USE_LIVE_DATA !== 'false') {
      try {
        const scrapedResults = await this.scrapeRetailers(query, limit);
        if (scrapedResults.length > 0) {
          results.push(...scrapedResults);
          sources.push('scraped');
        }
      } catch (error) {
        console.error('Scraper error:', error);
      }
    }

    // Deduplicate and sort results
    const unified = this.deduplicateAndSort(results, options);

    // Apply comparison engine ranking to each product
    const rankedProducts = await Promise.all(
      unified.slice(0, limit).map(p => this.applyComparisonRanking(p))
    );

    return {
      products: rankedProducts,
      total: unified.length,
      sources: [...new Set(sources)],
      aggregatedAt: new Date(),
    };
  }

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string, limit: number = 24): Promise<SearchResponse> {
    const localProducts = GLOBAL_SAMPLE_PRODUCTS.filter(
      p => p.categoryId === categoryId
    ).slice(0, limit);

    const products: UnifiedProduct[] = localProducts.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      description: p.description,
      imageUrl: p.images?.[0]?.url || '/product-1.jpg',
      category: p.category?.name,
      rating: p.rating,
      reviewCount: p.reviewCount,
      prices: p.pricePoints?.map(pp => ({
        retailer: pp.retailer?.name || 'Unknown',
        retailerId: pp.retailerId,
        retailerLogo: pp.retailer?.logo || '',
        price: pp.price,
        originalPrice: pp.originalPrice,
        currency: pp.currency || 'USD',
        availability: pp.availability || 'in_stock',
        condition: pp.condition || 'new',
        url: pp.url || '',
        shipping: pp.shippingCost ? {
          cost: pp.shippingCost,
          freeShipping: pp.shippingCost === 0,
        } : undefined,
      })) || [],
      tags: p.tags,
      lastUpdated: p.updatedAt,
      sources: ['local'],
    }));

    return {
      products,
      total: products.length,
      sources: ['local'],
      aggregatedAt: new Date(),
    };
  }

  /**
   * Get global sellers by region
   */
  getGlobalSellers(region?: string): GlobalSeller[] {
    if (region && region !== 'global') {
      return getSellersByRegion(region);
    }
    return GLOBAL_SELLERS;
  }

  /**
   * Get all available regions
   */
  getRegions(): Array<{ id: string; name: string; sellers: number }> {
    const regions = [
      { id: 'north-america', name: 'North America' },
      { id: 'south-america', name: 'South America' },
      { id: 'europe', name: 'Europe' },
      { id: 'asia', name: 'Asia Pacific' },
      { id: 'middle-east', name: 'Middle East' },
      { id: 'africa', name: 'Africa' },
      { id: 'oceania', name: 'Oceania' },
    ];

    return regions.map(r => ({
      ...r,
      sellers: getSellersByRegion(r.id).length,
    }));
  }

  /**
   * Get deals from all sources
   */
  async getDeals(limit: number = 20): Promise<SearchResponse> {
    const products: UnifiedProduct[] = [];

    // Get deals from sample products
    const dealProducts = GLOBAL_SAMPLE_PRODUCTS
      .filter(p => p.pricePoints?.some(pp => pp.discountPercent && pp.discountPercent > 10))
      .slice(0, limit);

    for (const p of dealProducts) {
      products.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        description: p.description,
        imageUrl: p.images?.[0]?.url || '/product-1.jpg',
        category: p.category?.name,
        rating: p.rating,
        reviewCount: p.reviewCount,
        prices: p.pricePoints?.map(pp => ({
          retailer: pp.retailer?.name || 'Unknown',
          retailerId: pp.retailerId,
          retailerLogo: pp.retailer?.logo || '',
          price: pp.price,
          originalPrice: pp.originalPrice,
          currency: pp.currency || 'USD',
          availability: pp.availability || 'in_stock',
          condition: pp.condition || 'new',
          url: pp.url || '',
          shipping: pp.shippingCost ? {
            cost: pp.shippingCost,
            freeShipping: pp.shippingCost === 0,
          } : undefined,
        })) || [],
        tags: p.tags,
        lastUpdated: p.updatedAt,
        sources: ['local'],
      });
    }

    return {
      products,
      total: products.length,
      sources: ['local'],
      aggregatedAt: new Date(),
    };
  }

  // Private methods

  private searchLocalProducts(query: string, limit: number): UnifiedProduct[] {
    const q = query.toLowerCase();
    const matches = GLOBAL_SAMPLE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, limit);

    return matches.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      description: p.description,
      imageUrl: p.images?.[0]?.url || '/product-1.jpg',
      category: p.category?.name,
      rating: p.rating,
      reviewCount: p.reviewCount,
      prices: p.pricePoints?.map(pp => ({
        retailer: pp.retailer?.name || 'Unknown',
        retailerId: pp.retailerId,
        retailerLogo: pp.retailer?.logo || '',
        price: pp.price,
        originalPrice: pp.originalPrice,
        currency: pp.currency || 'USD',
        availability: pp.availability || 'in_stock',
        condition: pp.condition || 'new',
        url: pp.url || '',
        shipping: pp.shippingCost ? {
          cost: pp.shippingCost,
          freeShipping: pp.shippingCost === 0,
        } : undefined,
        isPrime: pp.retailer?.name?.toLowerCase().includes('amazon'),
      })) || [],
      tags: p.tags,
      lastUpdated: p.updatedAt,
      sources: ['local'],
    }));
  }

  private async searchAmazon(query: string, region: string, limit: number): Promise<UnifiedProduct[]> {
    try {
      // Search all Amazon regions
      const results = await amazonAPI.searchAllRegions(query, 3);
      
      // Group by product name and convert to unified format
      const productMap = new Map<string, UnifiedProduct>();
      
      for (const product of results.products) {
        const key = product.title.toLowerCase().substring(0, 50);
        
        if (!productMap.has(key)) {
          productMap.set(key, {
            id: `amazon_${product.asin}`,
            name: product.title,
            brand: product.brand || this.extractBrand(product.title),
            imageUrl: product.imageUrl,
            rating: product.rating,
            reviewCount: product.reviewCount,
            prices: [],
            lastUpdated: new Date(),
            sources: ['amazon'],
          });
        }
        
        const unified = productMap.get(key)!;
        unified.prices.push({
          retailer: `Amazon ${AMAZON_REGIONS[region as keyof typeof AMAZON_REGIONS]?.country || region}`,
          retailerId: `amazon-${region}`,
          retailerLogo: '/retailers/amazon.svg',
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          availability: product.availability,
          condition: 'new',
          url: product.url,
          isPrime: product.primeEligible,
        });
        
        if (!unified.sources.includes('amazon')) {
          unified.sources.push('amazon');
        }
      }

      return Array.from(productMap.values()).slice(0, limit);
    } catch (error) {
      console.error('Amazon search error:', error);
      return [];
    }
  }

  private async searchEbay(query: string, region: string, limit: number): Promise<UnifiedProduct[]> {
    try {
      const results = await ebayAPI.searchProducts(query, region as any, limit);
      
      return results.products.map(product => ({
        id: `ebay_${product.id}`,
        name: product.title,
        brand: product.brand || this.extractBrand(product.title),
        imageUrl: product.imageUrl,
        rating: product.rating,
        reviewCount: product.reviewCount,
        prices: [{
          retailer: 'eBay',
          retailerId: 'ebay',
          retailerLogo: '/retailers/ebay.svg',
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          availability: product.availability,
          condition: product.condition,
          url: product.url,
          shipping: product.shipping ? {
            cost: product.shipping.cost,
            freeShipping: product.shipping.cost === 0,
            estimatedDelivery: product.shipping.estimatedDelivery,
          } : undefined,
        }],
        lastUpdated: new Date(),
        sources: ['ebay'],
      }));
    } catch (error) {
      console.error('eBay search error:', error);
      return [];
    }
  }

  private async scrapeRetailers(query: string, limit: number): Promise<UnifiedProduct[]> {
    try {
      const results = await scraper.getUnifiedResults(query);
      
      return results.slice(0, limit).map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        prices: [{
          retailer: product.retailer.name,
          retailerId: product.retailer.id,
          retailerLogo: product.retailer.logo,
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          availability: product.availability,
          condition: product.condition,
          url: product.url,
          shipping: product.shipping ? {
            cost: product.shipping.cost,
            freeShipping: product.shipping.freeShipping,
            estimatedDelivery: product.shipping.estimatedDelivery,
          } : undefined,
        }],
        lastUpdated: product.lastUpdated,
        sources: ['scraped'],
      }));
    } catch (error) {
      console.error('Scraper error:', error);
      return [];
    }
  }

  private async applyComparisonRanking(product: UnifiedProduct): Promise<UnifiedProduct> {
    try {
      // Convert price points to SellerOffer format
      const offers: SellerOffer[] = product.prices.map((pp, idx) => ({
        id: `offer_${idx}`,
        unifiedProductId: product.id,
        seller: {
          id: pp.retailerId,
          name: pp.retailer,
          domain: pp.retailerId,
          isVerified: true,
          isOfficialStore: false,
          rating: pp.rating,
          region: 'global',
          country: 'USA',
        },
        pricing: {
          basePrice: pp.price,
          originalPrice: pp.originalPrice,
          currency: pp.currency || 'USD',
          isOnSale: !!pp.originalPrice,
          discountPercent: pp.originalPrice ? Math.round((1 - pp.price / pp.originalPrice) * 100) : undefined,
          totalLandedCost: pp.price + (pp.shipping?.cost || 0),
        },
        availability: {
          status: pp.availability as any,
          stockLevel: pp.availability === 'in_stock' ? 'high' : pp.availability === 'limited' ? 'low' : 'out',
        },
        condition: {
          type: pp.condition as any,
        },
        shipping: {
          cost: pp.shipping?.cost || 0,
          isFree: pp.shipping?.freeShipping || false,
          estimatedDelivery: pp.shipping?.estimatedDelivery,
        },
        fulfillment: {
          type: 'fulfilled_by_seller',
          isPrime: pp.isPrime,
        },
        sourceUrl: pp.url,
        sourceType: 'api',
        scrapedAt: new Date(),
        priceHistory: [],
      }));

      // Create mock unified product for comparison engine
      const engineProduct: EngineProduct = {
        id: product.id,
        sku: product.id,
        title: product.name,
        titleNormalized: product.name.toLowerCase(),
        categoryId: 'electronics',
        categoryPath: ['Electronics'],
        identifiers: { brand: product.brand },
        attributes: {},
        images: [],
        specifications: [],
        offers,
        stats: {
          totalSellers: offers.length,
          minPrice: Math.min(...offers.map(o => o.pricing.totalLandedCost)),
          maxPrice: Math.max(...offers.map(o => o.pricing.totalLandedCost)),
          avgPrice: offers.reduce((s, o) => s + o.pricing.totalLandedCost, 0) / offers.length,
          priceRange: 0,
          priceHistoryDays: 30,
          lowestShipping: Math.min(...offers.map(o => o.shipping.cost)),
          highestShipping: Math.max(...offers.map(o => o.shipping.cost)),
          inStockCount: offers.filter(o => o.availability.status === 'in_stock').length,
          outOfStockCount: offers.filter(o => o.availability.status === 'out_of_stock').length,
        },
        matchConfidence: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastPriceUpdate: new Date(),
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active',
        isVerified: false,
      };
      engineProduct.stats.priceRange = engineProduct.stats.maxPrice - engineProduct.stats.minPrice;

      // Run comparison engine
      const comparison = await comparisonEngine.compare(engineProduct, undefined, 'USD');

      // Map ranked sellers back to price points
      const rankedPrices = comparison.sellers.map((s: RankedSeller) => ({
        retailer: s.seller.name,
        retailerId: s.seller.id,
        retailerLogo: '',
        price: s.pricing.basePrice,
        originalPrice: s.pricing.originalPrice,
        currency: s.pricing.currency,
        availability: s.availability.status,
        condition: s.condition.type,
        url: s.sourceUrl,
        shipping: {
          cost: s.shipping.cost,
          freeShipping: s.shipping.isFree,
          estimatedDelivery: s.shipping.estimatedDelivery,
        },
        isPrime: s.fulfillment.isPrime,
        rating: s.seller.rating,
        rank: s.rank,
        cheapestFlag: s.cheapestFlag,
        dealScore: s.dealScore,
        totalLandedCost: s.pricing.totalLandedCost,
        savingsFromHighest: s.savingsFromHighest,
      }));

      return {
        ...product,
        prices: rankedPrices,
      };
    } catch (error) {
      console.error('Comparison ranking error:', error);
      return product;
    }
  }

  private deduplicateAndSort(products: UnifiedProduct[], options: SearchOptions): UnifiedProduct[] {
    // Deduplicate by name similarity
    const seen = new Set<string>();
    const deduped: UnifiedProduct[] = [];

    for (const product of products) {
      const key = product.name.toLowerCase().substring(0, 30);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(product);
      }
    }

    // Sort
    switch (options.sortBy) {
      case 'price_asc':
        deduped.sort((a, b) => {
          const priceA = a.prices[0]?.price || Infinity;
          const priceB = b.prices[0]?.price || Infinity;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        deduped.sort((a, b) => {
          const priceA = a.prices[0]?.price || 0;
          const priceB = b.prices[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        deduped.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return deduped;
  }

  private extractBrand(title: string): string {
    const knownBrands = [
      'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'LG', 'Dell', 'HP',
      'ASUS', 'MSI', 'Lenovo', 'Acer', 'Canon', 'Nikon', 'Dyson', 'Bose',
      'JBL', 'Fitbit', 'Garmin', 'GoPro', 'Razer', 'Logitech', 'Microsoft'
    ];
    
    for (const brand of knownBrands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return 'Unknown';
  }
}

// Export singleton instance
export const productService = new ProductDataService();
