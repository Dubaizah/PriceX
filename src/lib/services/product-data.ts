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

// Smart image mapping - MORE SPECIFIC matches first!
function getSmartImage(name: string, brand: string, fallbackUrl: string): string {
  const n = (name || '').toLowerCase();
  const b = (brand || '').toLowerCase();
  
  // MOST SPECIFIC first - product-specific matches
  const imageMap: [string[], string][] = [
    // Nike - most specific first
    [['air jordan', 'jordan 1', 'jordan 1 retro'], 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400'],
    [['air max 90'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    [['air max 97'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    [['dunk low', 'dunk retro'], 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400'],
    [['air force 1', 'air force'], 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'],
    [['nike air max'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    [['brasilia', 'duffle bag'], 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    
    // Adidas
    [['yeezy'], 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400'],
    [['samba'], 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'],
    [['stan smith'], 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'],
    [['ultraboost'], 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'],
    [['adidas nmd'], 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'],
    [['forum'], 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400'],
    
    // Apple iPhones - specific models
    [['iphone 15 pro max'], 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
    [['iphone 15 pro'], 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
    [['iphone 15'], 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
    [['iphone 14 pro'], 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
    [['iphone 14'], 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
    
    // Samsung Galaxy
    [['galaxy s24 ultra'], 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    [['galaxy s24'], 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    [['galaxy s23'], 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    [['galaxy z fold'], 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400'],
    [['galaxy z flip'], 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400'],
    
    // Google Pixel
    [['pixel 8 pro'], 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400'],
    [['pixel 8'], 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400'],
    [['pixel 7'], 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400'],
    
    // MacBooks
    [['macbook pro 16'], 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    [['macbook pro 14'], 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    [['macbook pro'], 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    [['macbook air 15'], 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'],
    [['macbook air'], 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'],
    
    // iPads
    [['ipad pro 12.9'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    [['ipad pro'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    [['ipad air'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    [['ipad 10'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    
    // Apple Watch
    [['apple watch ultra'], 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'],
    [['apple watch series 9'], 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'],
    [['apple watch'], 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'],
    
    // AirPods
    [['airpods pro 2'], 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'],
    [['airpods max'], 'https://images.unsplash.com/photo-1625845482738-967e29e441d4?w=400'],
    [['airpods'], 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'],
    
    // Gaming
    [['playstation 5', 'ps5'], 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400'],
    [['ps4'], 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400'],
    [['xbox series x'], 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400'],
    [['xbox series s'], 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400'],
    [['nintendo switch'], 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
    [['steam deck'], 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=400'],
    
    // Drones
    [['dji air 3'], 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    [['dji mini'], 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    [['dji mavic'], 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    [['dji'], 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    
    // Cameras
    [['sony a7 iv', 'alpha a7'], 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    [['sony a7c'], 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    [['canon r6', 'eos r6'], 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400'],
    [['canon r8'], 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400'],
    [['nikon z8'], 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'],
    [['nikon z6'], 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'],
    [['fujifilm x-t5'], 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400'],
    
    // TVs
    [['lg c3', 'lg oled'], 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    [['samsung s95'], 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    [['sony a95'], 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    
    // Watches
    [['rolex submariner'], 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400'],
    [['rolex daytona'], 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400'],
    [['omega speedmaster'], 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'],
    [['cartier santos'], 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'],
    
    // Bags
    [['louis vuitton speedy'], 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
    [['louis vuitton neverfull'], 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
    [['gucci gg marmont'], 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    [['hermès birkin'], 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    [['coach tabby'], 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'],
    
    // Headphones
    [['sony wh-1000xm5'], 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'],
    [['sony wf-1000xm5'], 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    [['bose quietcomfort'], 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'],
    [['bose qc45'], 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'],
    
    // Dyson
    [['dyson v15'], 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400'],
    [['dyson airwrap'], 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400'],
    [['dyson supersonic'], 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400'],
    
    // Generic brand matches (last)
    [['nike'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    [['adidas'], 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'],
    [['apple'], 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
    [['samsung'], 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    [['sony'], 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    [['dell'], 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'],
    [['lenovo'], 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'],
    [['hp'], 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'],
    [['microsoft'], 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=400'],
    [['asus'], 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'],
  ];
  
  for (const [keywords, url] of imageMap) {
    for (const kw of keywords) {
      if (n.includes(kw)) {
        return url;
      }
    }
  }
  
  // Brand fallback
  for (const [keywords, url] of imageMap) {
    for (const kw of keywords) {
      if (b.includes(kw)) {
        return url;
      }
    }
  }
  
  return fallbackUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
}

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

    // 1. Search local database (sample products) - PRIORITY
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
          // Apply smart images to Amazon results
          const amazonWithImages = amazonResults.map(p => ({
            ...p,
            imageUrl: p.imageUrl || getSmartImage(p.name, p.brand, '/product-1.jpg')
          }));
          results.push(...amazonWithImages);
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
          // Apply smart images to eBay results
          const ebayWithImages = ebayResults.map(p => ({
            ...p,
            imageUrl: p.imageUrl || getSmartImage(p.name, p.brand, '/product-1.jpg')
          }));
          results.push(...ebayWithImages);
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
          // Apply smart images to scraped results
          const scrapedWithImages = scrapedResults.map(p => ({
            ...p,
            imageUrl: p.imageUrl || getSmartImage(p.name, p.brand, '/product-1.jpg')
          }));
          results.push(...scrapedWithImages);
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
      imageUrl: getSmartImage(p.name, p.brand, p.images?.[0]?.url) || '/product-1.jpg',
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
        imageUrl: getSmartImage(p.name, p.brand, p.images?.[0]?.url) || '/product-1.jpg',
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
      imageUrl: getSmartImage(p.name, p.brand, p.images?.[0]?.url) || '/product-1.jpg',
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
            imageUrl: product.imageUrl || getSmartImage(product.title, product.brand || '', '/product-1.jpg'),
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
        imageUrl: product.imageUrl || getSmartImage(product.title, product.brand || '', '/product-1.jpg'),
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
        imageUrl: product.imageUrl || getSmartImage(product.name, product.brand, '/product-1.jpg'),
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
