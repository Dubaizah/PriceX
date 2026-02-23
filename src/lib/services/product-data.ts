/**
 * PriceX - Unified Product Data Service
 * Combines data from scraper, price APIs, and retailer APIs
 */

import { FetchedProductData, FetchedOffer, RETAILER_CONFIGS, RetailerConfig, getRetailerConfig } from './retailer-config';
import { scraperService } from './scraper';
import { priceAPIService, api7Service } from './price-api';
import { amazonPAAPIService, ebayAPIService, walmartAPIService } from './retailer-api';

export type DataSource = 'scraper' | 'priceapi' | 'api7' | 'amazon' | 'ebay' | 'walmart' | 'all';

interface FetchOptions {
  sources?: DataSource[];
  useCache?: boolean;
  cacheDuration?: number;
  timeout?: number;
}

interface FetchResult {
  success: boolean;
  data?: FetchedProductData[];
  errors?: string[];
  source: DataSource;
}

class UnifiedProductService {
  private defaultSources: DataSource[] = ['priceapi', 'amazon'];

  async fetchProductByUrl(url: string, options: FetchOptions = {}): Promise<FetchResult> {
    const sources = options.sources || this.defaultSources;
    const retailer = this.detectRetailer(url);

    if (!retailer) {
      return {
        success: false,
        errors: ['Unknown retailer'],
        source: 'all',
      };
    }

    for (const source of sources) {
      try {
        let result: FetchedProductData | null = null;

        switch (source) {
          case 'scraper':
            const scrapeResult = await scraperService.scrapeProduct(url, {
              useCache: options.useCache ?? true,
              cacheDuration: options.cacheDuration,
              timeout: options.timeout,
            });
            if (scrapeResult.success && scrapeResult.data) {
              result = scrapeResult.data;
            }
            break;

          case 'amazon':
            result = await this.fetchFromAmazon(url);
            break;

          case 'ebay':
            result = await this.fetchFromEbay(url);
            break;

          case 'walmart':
            result = await this.fetchFromWalmart(url);
            break;

          case 'priceapi':
            result = await this.fetchFromPriceAPI(url);
            break;

          case 'api7':
            result = await this.fetchFromAPI7(url);
            break;
        }

        if (result) {
          return {
            success: true,
            data: [result],
            source,
          };
        }
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
        continue;
      }
    }

    return {
      success: false,
      errors: ['All data sources failed'],
      source: 'all',
    };
  }

  async fetchProductsFromMultipleRetailers(
    productQuery: string,
    retailers: string[] = ['amazon', 'bestbuy', 'walmart', 'target', 'ebay', 'newegg'],
    options: FetchOptions = {}
  ): Promise<FetchResult> {
    const allResults: FetchedProductData[] = [];
    const errors: string[] = [];

    for (const retailerId of retailers) {
      try {
        const results = await this.fetchFromRetailer(retailerId, productQuery);
        if (results.length > 0) {
          allResults.push(...results);
        }
      } catch (error) {
        errors.push(`Failed to fetch from ${retailerId}: ${error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (allResults.length === 0 && errors.length > 0) {
      return {
        success: false,
        errors,
        source: 'all',
      };
    }

    return {
      success: true,
      data: allResults.sort((a, b) => a.price - b.price),
      source: 'all',
    };
  }

  private async fetchFromRetailer(retailerId: string, query: string): Promise<FetchedProductData[]> {
    const config = getRetailerConfig(retailerId);
    
    if (!config) {
      return [];
    }

    if (config.dataSource === 'api') {
      switch (retailerId) {
        case 'amazon':
          return await amazonPAAPIService.searchProducts(query);
        case 'ebay':
          return await ebayAPIService.searchProducts(query);
        case 'walmart':
          return await walmartAPIService.searchProducts(query);
      }
    }

    return [];
  }

  private async fetchFromAmazon(url: string): Promise<FetchedProductData | null> {
    const asinMatch = url.match(/(?:dp|product|ASIN)[/=]([A-Z0-9]{10})/i);
    if (asinMatch) {
      return await amazonPAAPIService.getProductDetails(asinMatch[1]);
    }
    return null;
  }

  private async fetchFromEbay(url: string): Promise<FetchedProductData | null> {
    const itemIdMatch = url.match(/itm[/=](\d+)/);
    if (itemIdMatch) {
      const results = await ebayAPIService.searchProducts(itemIdMatch[1], { limit: 1 });
      return results[0] || null;
    }
    return null;
  }

  private async fetchFromWalmart(url: string): Promise<FetchedProductData | null> {
    const productIdMatch = url.match(/ip\/[^/]+\/(\d+)/);
    if (productIdMatch) {
      const results = await walmartAPIService.searchProducts(productIdMatch[1], { limit: 1 });
      return results[0] || null;
    }
    return null;
  }

  private async fetchFromPriceAPI(url: string): Promise<FetchedProductData | null> {
    const asinMatch = url.match(/(?:dp|product|ASIN)[/=]([A-Z0-9]{10})/i);
    if (asinMatch) {
      return await priceAPIService.getProductByASIN(asinMatch[1]);
    }
    return null;
  }

  private async fetchFromAPI7(url: string): Promise<FetchedProductData | null> {
    return null;
  }

  private detectRetailer(url: string): RetailerConfig | undefined {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      
      for (const config of RETAILER_CONFIGS) {
        if (hostname.includes(config.domain.replace('www.', ''))) {
          return config;
        }
      }
    } catch (e) {
      console.error('Invalid URL:', e);
    }
    
    return undefined;
  }

  async getPriceComparison(urls: string[]): Promise<FetchedProductData[]> {
    const results: FetchedProductData[] = [];

    for (const url of urls) {
      const result = await this.fetchProductByUrl(url);
      if (result.success && result.data) {
        results.push(...result.data);
      }
    }

    return results.sort((a, b) => a.price - b.price);
  }

  getRetailers(): RetailerConfig[] {
    return RETAILER_CONFIGS;
  }

  getRetailer(id: string): RetailerConfig | undefined {
    return getRetailerConfig(id);
  }
}

export const unifiedProductService = new UnifiedProductService();
export default unifiedProductService;
