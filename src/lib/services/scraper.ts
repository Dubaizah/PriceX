/**
 * PriceX - Product Scraper Service
 * Server-side scraping to extract product data from retailer websites
 * NOTE: Use official APIs when available. Scraping may violate retailer ToS.
 */

import { FetchedProductData, FetchedOffer, RetailerConfig, getRetailerConfig } from './retailer-config';

interface ScrapeOptions {
  useCache?: boolean;
  cacheDuration?: number;
  timeout?: number;
}

interface ScrapeResult {
  success: boolean;
  data?: FetchedProductData;
  error?: string;
  source: string;
  fetchedAt: Date;
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

class ProductScraperService {
  private cache: Map<string, { data: FetchedProductData; timestamp: number }> = new Map();
  private defaultOptions: ScrapeOptions = {
    useCache: true,
    cacheDuration: 5 * 60 * 1000,
    timeout: 30000,
  };

  private getCacheKey(url: string): string {
    return `scrape:${url}`;
  }

  private getFromCache(url: string, duration: number): FetchedProductData | null {
    const key = this.getCacheKey(url);
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < duration) {
      return cached.data;
    }
    return null;
  }

  private setCache(url: string, data: FetchedProductData): void {
    const key = this.getCacheKey(url);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async scrapeProduct(url: string, options: ScrapeOptions = {}): Promise<ScrapeResult> {
    const opts = { ...this.defaultOptions, ...options };
    const retailerConfig = this.detectRetailer(url);

    if (!retailerConfig) {
      return {
        success: false,
        error: 'Unknown retailer',
        source: 'unknown',
        fetchedAt: new Date(),
      };
    }

    if (retailerConfig.scraping?.enabled === false) {
      return {
        success: false,
        error: `Scraping disabled for ${retailerConfig.name}. Use official API instead.`,
        source: retailerConfig.id,
        fetchedAt: new Date(),
      };
    }

    const cached = opts.useCache ? this.getFromCache(url, opts.cacheDuration || 5000) : null;
    if (cached) {
      return {
        success: true,
        data: cached,
        source: retailerConfig.id,
        fetchedAt: new Date(),
      };
    }

    try {
      const productData = await this.scrapeFromRetailer(url, retailerConfig);
      
      if (productData && opts.useCache) {
        this.setCache(url, productData);
      }

      return {
        success: true,
        data: productData,
        source: retailerConfig.id,
        fetchedAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Scraping failed',
        source: retailerConfig.id,
        fetchedAt: new Date(),
      };
    }
  }

  private detectRetailer(url: string): RetailerConfig | undefined {
    const hostname = new URL(url).hostname.toLowerCase();
    
    if (hostname.includes('amazon')) {
      return getRetailerConfig('amazon');
    }
    if (hostname.includes('bestbuy')) {
      return getRetailerConfig('bestbuy');
    }
    if (hostname.includes('walmart')) {
      return getRetailerConfig('walmart');
    }
    if (hostname.includes('target')) {
      return getRetailerConfig('target');
    }
    if (hostname.includes('ebay')) {
      return getRetailerConfig('ebay');
    }
    if (hostname.includes('newegg')) {
      return getRetailerConfig('newegg');
    }
    
    return undefined;
  }

  private async scrapeFromRetailer(url: string, config: RetailerConfig): Promise<FetchedProductData> {
    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
    };

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const html = await response.text();
    
    switch (config.id) {
      case 'amazon':
        return this.parseAmazonHTML(html, url, config);
      case 'bestbuy':
        return this.parseBestBuyHTML(html, url, config);
      case 'walmart':
        return this.parseWalmartHTML(html, url, config);
      case 'target':
        return this.parseTargetHTML(html, url, config);
      case 'ebay':
        return this.parseEbayHTML(html, url, config);
      default:
        return this.parseGenericHTML(html, url, config);
    }
  }

  private parseAmazonHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const priceMatch = html.match(/\"priceAmount\"[:\s]*([\d.]+)/);
    const originalPriceMatch = html.match(/\"priceBeforeFitlers\"[:\s]*([\d.]+)/) || html.match(/\"listPrice\"[:\s]*([\d.]+)/);
    const titleMatch = html.match(/\"title\"[:\s]*\"([^\"]+)\"/) || html.match(/<title>([^<]+)<\/title>/i);
    const availabilityMatch = html.match(/\"availability\"[:\s]*\"([^\"]+)\"/);
    const imageMatch = html.match(/\"image\"[:\s]*\"([^\"]+)\"/);
    const ratingMatch = html.match(/\"ratingValue\"[:\s]*([\d.]+)/);
    const reviewCountMatch = html.match(/\"reviewCount\"[:\s]*([\d.]+)/);

    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1]) : price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

    const images: string[] = [];
    const imageMatches = html.matchAll(/"hiRes"[:\s]*"([^"]+)"/g);
    for (const match of imageMatches) {
      if (match[1] && !match[1].includes('spinner')) {
        images.push(match[1].replace(/\\u0026/g, '&'));
      }
    }
    if (images.length === 0 && imageMatch) {
      images.push(imageMatch[1].replace(/\\u0026/g, '&'));
    }

    const availability = availabilityMatch ? availabilityMatch[1] : 'unknown';
    const isAvailable = availability.toLowerCase().includes('in stock') || availability.toLowerCase().includes('available');

    return {
      source: config,
      sourceType: 'scraper',
      fetchedAt: new Date(),
      name: titleMatch ? titleMatch[1].replace(/\\u0026/g, '&') : 'Unknown Product',
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent,
      currency: 'USD',
      availability: isAvailable ? 'in_stock' : 'out_of_stock',
      images,
      offers: this.generateOffers(price, originalPrice, url, config),
      url,
      rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
      reviewCount: reviewCountMatch ? parseInt(reviewCountMatch[1].replace(/,/g, '')) : undefined,
    };
  }

  private parseBestBuyHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const jsonMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        return {
          source: config,
          sourceType: 'scraper',
          fetchedAt: new Date(),
          name: data.name || 'Unknown Product',
          brand: data.brand?.name,
          description: data.description,
          price: parseFloat(data.offers?.price || '0'),
          originalPrice: parseFloat(data.offers?.highPrice || '0') || undefined,
          discountPercent: data.offers?.highPrice ? Math.round((parseFloat(data.offers.highPrice) - parseFloat(data.offers.price)) / parseFloat(data.offers.highPrice) * 100) : undefined,
          currency: data.offers?.priceCurrency || 'USD',
          availability: data.offers?.availability === 'https://schema.org/InStock' ? 'in_stock' : 'out_of_stock',
          images: data.image ? [data.image] : [],
          offers: this.generateOffers(parseFloat(data.offers?.price || '0'), parseFloat(data.offers?.highPrice || '0'), url, config),
          url,
          rating: data.aggregateRating?.ratingValue,
          reviewCount: data.aggregateRating?.reviewCount,
        };
      } catch (e) {
        console.error('Best Buy JSON parse error:', e);
      }
    }

    return this.parseGenericHTML(html, url, config);
  }

  private parseWalmartHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const priceMatch = html.match(/"current_retail":\s*([\d.]+)/) || html.match(/"price":"([\d.]+)"/);
    const originalPriceMatch = html.match(/"was_retail":\s*([\d.]+)/) || html.match(/"list_price":"([\d.]+)"/);
    const titleMatch = html.match(/"product_title":"([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/i);
    const imageMatch = html.match(/"image_url":"([^"]+)"/);
    const availabilityMatch = html.match(/"availability_status":"([^"]+)"/);

    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1]) : price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

    return {
      source: config,
      sourceType: 'scraper',
      fetchedAt: new Date(),
      name: titleMatch ? titleMatch[1].replace(/\\u0026/g, '&') : 'Unknown Product',
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent,
      currency: 'USD',
      availability: availabilityMatch?.[1]?.includes('IN_STOCK') ? 'in_stock' : 'out_of_stock',
      images: imageMatch ? [imageMatch[1].replace(/\\u0026/g, '&')] : [],
      offers: this.generateOffers(price, originalPrice, url, config),
      url,
    };
  }

  private parseTargetHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const jsonMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        return {
          source: config,
          sourceType: 'scraper',
          fetchedAt: new Date(),
          name: data.name || 'Unknown Product',
          brand: data.brand?.name,
          description: data.description,
          price: parseFloat(data.offers?.price || '0'),
          originalPrice: parseFloat(data.offers?.highPrice || '0') || undefined,
          currency: data.offers?.priceCurrency || 'USD',
          availability: data.offers?.availability === 'https://schema.org/InStock' ? 'in_stock' : 'out_of_stock',
          images: data.image ? [data.image] : [],
          offers: this.generateOffers(parseFloat(data.offers?.price || '0'), parseFloat(data.offers?.highPrice || '0'), url, config),
          url,
          rating: data.aggregateRating?.ratingValue,
          reviewCount: data.aggregateRating?.reviewCount,
        };
      } catch (e) {
        console.error('Target JSON parse error:', e);
      }
    }

    return this.parseGenericHTML(html, url, config);
  }

  private parseEbayHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const jsonMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        return {
          source: config,
          sourceType: 'scraper',
          fetchedAt: new Date(),
          name: data.name || 'Unknown Product',
          brand: data.brand?.name,
          description: data.description,
          price: parseFloat(data.offers?.price || '0'),
          originalPrice: parseFloat(data.offers?.highPrice || '0') || undefined,
          currency: data.offers?.priceCurrency || 'USD',
          availability: data.offers?.availability === 'https://schema.org/InStock' ? 'in_stock' : 'out_of_stock',
          images: data.image ? [data.image] : [],
          offers: this.generateOffers(parseFloat(data.offers?.price || '0'), parseFloat(data.offers?.highPrice || '0'), url, config),
          url,
          rating: data.aggregateRating?.ratingValue,
          reviewCount: data.aggregateRating?.reviewCount,
        };
      } catch (e) {
        console.error('eBay JSON parse error:', e);
      }
    }

    return this.parseGenericHTML(html, url, config);
  }

  private parseGenericHTML(html: string, url: string, config: RetailerConfig): FetchedProductData {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const priceMatch = html.match(/\$\s*([\d,]+\.?\d*)/);
    const imageMatch = html.match(/<img[^>]+src="([^">]+\.(?:jpg|jpeg|png|webp))[^"]*"/i);

    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

    return {
      source: config,
      sourceType: 'scraper',
      fetchedAt: new Date(),
      name: titleMatch ? titleMatch[1].split('|')[0].trim() : 'Unknown Product',
      price,
      originalPrice: price,
      currency: 'USD',
      availability: 'in_stock',
      images: imageMatch ? [imageMatch[1]] : [],
      offers: this.generateOffers(price, price, url, config),
      url,
    };
  }

  private generateOffers(price: number, originalPrice: number, url: string, config: RetailerConfig): FetchedOffer[] {
    const offers: FetchedOffer[] = [
      {
        id: `${config.id}-primary-${Date.now()}`,
        type: 'primary',
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
        availability: 'in_stock',
        url,
      },
    ];

    if (originalPrice > price) {
      offers.push({
        id: `${config.id}-coupon-${Date.now()}`,
        type: 'coupon',
        price,
        originalPrice,
        discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
        availability: 'in_stock',
        url,
      });
    }

    return offers;
  }

  async scrapeMultiple(urls: string[]): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = [];
    
    for (const url of urls) {
      const result = await this.scrapeProduct(url);
      results.push(result);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const scraperService = new ProductScraperService();
export default scraperService;
