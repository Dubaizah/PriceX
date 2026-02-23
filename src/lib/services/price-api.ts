/**
 * PriceX - Price API Integration Service
 * Integration with external price comparison APIs
 * Supported: PriceAPI, API7, and other price data providers
 */

import { FetchedProductData, FetchedOffer, RetailerConfig, getRetailerConfig } from './retailer-config';

interface PriceAPIConfig {
  apiKey: string;
  baseUrl: string;
}

interface PriceAPISearchResult {
  results: PriceAPIItem[];
  total: number;
  page: number;
}

interface PriceAPIItem {
  product_id: string;
  product_title: string;
  product_description?: string;
  product_specs?: Record<string, string>;
  product_images?: string[];
  product_rating?: number;
  product_reviews?: number;
  product_offers: PriceAPIOffer[];
}

interface PriceAPIOffer {
  offer_id: string;
  offer_price: number;
  offer_original_price?: number;
  offer_currency?: string;
  offer_availability?: string;
  offer_condition?: string;
  offer_url: string;
  offer_seller?: string;
  offer_shipping?: number;
  offer_delivery_time?: string;
}

interface API7Config {
  apiKey: string;
  baseUrl: string;
}

class PriceAPIService {
  private priceAPIConfig: PriceAPIConfig | null = null;
  private api7Config: API7Config | null = null;

  configurePriceAPI(apiKey: string, baseUrl: string = 'https://api.priceapi.com/v2'): void {
    this.priceAPIConfig = { apiKey, baseUrl };
  }

  configureAPI7(apiKey: string, baseUrl: string = 'https://api.api7.io/v1'): void {
    this.api7Config = { apiKey, baseUrl };
  }

  async searchPriceAPI(query: string, options?: {
    country?: string;
    currency?: string;
    limit?: number;
  }): Promise<FetchedProductData[]> {
    if (!this.priceAPIConfig) {
      console.warn('PriceAPI not configured. Using mock data.');
      return [];
    }

    const { country = 'US', currency = 'USD', limit = 10 } = options || {};

    try {
      const url = `${this.priceAPIConfig.baseUrl}/products/search`;
      const params = new URLSearchParams({
        key: this.priceAPIConfig.apiKey,
        query,
        country,
        currency,
        limit: limit.toString(),
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`PriceAPI error: ${response.status}`);
      }

      const data: PriceAPISearchResult = await response.json();
      
      return this.transformPriceAPIResults(data.results);
    } catch (error) {
      console.error('PriceAPI search error:', error);
      return [];
    }
  }

  async getProductByASIN(asin: string, country: string = 'US'): Promise<FetchedProductData | null> {
    if (!this.priceAPIConfig) {
      console.warn('PriceAPI not configured. Using mock data.');
      return null;
    }

    try {
      const url = `${this.priceAPIConfig.baseUrl}/product`;
      const params = new URLSearchParams({
        key: this.priceAPIConfig.apiKey,
        asin,
        country,
        source: 'amazon',
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`PriceAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.transformPriceAPIResult(data);
    } catch (error) {
      console.error('PriceAPI product fetch error:', error);
      return null;
    }
  }

  async getProductBySKU(sku: string, retailer: string): Promise<FetchedProductData | null> {
    if (!this.priceAPIConfig) {
      console.warn('PriceAPI not configured. Using mock data.');
      return null;
    }

    try {
      const url = `${this.priceAPIConfig.baseUrl}/product`;
      const params = new URLSearchParams({
        key: this.priceAPIConfig.apiKey,
        source: retailer,
        domain: retailer,
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sku }),
      });
      
      if (!response.ok) {
        throw new Error(`PriceAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.transformPriceAPIResult(data);
    } catch (error) {
      console.error('PriceAPI product fetch error:', error);
      return null;
    }
  }

  private transformPriceAPIResults(items: PriceAPIItem[]): FetchedProductData[] {
    return items.map(item => this.transformPriceAPIResult(item));
  }

  private transformPriceAPIResult(item: PriceAPIItem): FetchedProductData {
    const primaryOffer = item.product_offers?.[0];
    const retailerConfig = primaryOffer?.offer_seller 
      ? this.getRetailerByName(primaryOffer.offer_seller)
      : getRetailerConfig('amazon');

    const price = primaryOffer?.offer_price || 0;
    const originalPrice = primaryOffer?.offer_original_price || price;
    const discountPercent = originalPrice > price 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : undefined;

    const offers: FetchedOffer[] = item.product_offers?.map((offer, index) => ({
      id: offer.offer_id || `offer-${index}`,
      type: (offer.offer_condition === 'new' ? 'primary' : offer.offer_condition) as FetchedOffer['type'],
      price: offer.offer_price,
      originalPrice: offer.offer_original_price,
      discountPercent: offer.offer_original_price 
        ? Math.round(((offer.offer_original_price - offer.offer_price) / offer.offer_original_price) * 100)
        : undefined,
      availability: offer.offer_availability || 'unknown',
      shippingCost: offer.offer_shipping,
      shippingTime: offer.offer_delivery_time,
      url: offer.offer_url,
    })) || [];

    return {
      source: retailerConfig || getRetailerConfig('amazon')!,
      sourceType: 'api',
      fetchedAt: new Date(),
      productId: item.product_id,
      name: item.product_title,
      description: item.product_description,
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent,
      currency: primaryOffer?.offer_currency || 'USD',
      availability: primaryOffer?.offer_availability === 'in_stock' ? 'in_stock' : 'out_of_stock',
      images: item.product_images || [],
      specifications: item.product_specs,
      offers,
      rating: item.product_rating,
      reviewCount: item.product_reviews,
      url: primaryOffer?.offer_url || '',
    };
  }

  private getRetailerByName(name: string): RetailerConfig | undefined {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('amazon')) return getRetailerConfig('amazon');
    if (nameLower.includes('best buy')) return getRetailerConfig('bestbuy');
    if (nameLower.includes('walmart')) return getRetailerConfig('walmart');
    if (nameLower.includes('target')) return getRetailerConfig('target');
    if (nameLower.includes('ebay')) return getRetailerConfig('ebay');
    if (nameLower.includes('newegg')) return getRetailerConfig('newegg');
    
    return getRetailerConfig('amazon');
  }

  async getPriceHistory(productId: string, options?: {
    days?: number;
    interval?: 'daily' | 'weekly' | 'monthly';
  }): Promise<{ date: Date; price: number }[]> {
    if (!this.priceAPIConfig) {
      console.warn('PriceAPI not configured.');
      return [];
    }

    const { days = 30, interval = 'daily' } = options || {};

    try {
      const url = `${this.priceAPIConfig.baseUrl}/product/${productId}/history`;
      const params = new URLSearchParams({
        key: this.priceAPIConfig.apiKey,
        days: days.toString(),
        interval,
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`PriceAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.history || []).map((item: { date: string; price: number }) => ({
        date: new Date(item.date),
        price: item.price,
      }));
    } catch (error) {
      console.error('Price history error:', error);
      return [];
    }
  }
}

class API7Service {
  private config: API7Config | null = null;

  configure(apiKey: string, baseUrl: string = 'https://api.api7.io/v1'): void {
    this.config = { apiKey, baseUrl };
  }

  async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    retailer?: string;
  }): Promise<FetchedProductData[]> {
    if (!this.config) {
      console.warn('API7 not configured. Using mock data.');
      return [];
    }

    try {
      const params = new URLSearchParams({
        api_key: this.config.apiKey,
        keyword: query,
      });

      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
      if (filters?.retailer) params.append('merchant', filters.retailer);

      const response = await fetch(`${this.config.baseUrl}/products?${params}`);
      
      if (!response.ok) {
        throw new Error(`API7 error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.transformAPI7Results(data.products || []);
    } catch (error) {
      console.error('API7 search error:', error);
      return [];
    }
  }

  private transformAPI7Results(products: any[]): FetchedProductData[] {
    return products.map(product => ({
      source: getRetailerConfig(product.merchant || 'amazon')!,
      sourceType: 'api' as const,
      fetchedAt: new Date(),
      productId: product.product_id,
      name: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.list_price,
      discountPercent: product.discount,
      currency: product.currency || 'USD',
      availability: product.availability || 'in_stock',
      images: product.images || [],
      offers: [{
        id: product.offer_id || 'primary',
        type: 'primary' as const,
        price: product.price,
        originalPrice: product.list_price,
        discountPercent: product.discount,
        availability: product.availability || 'in_stock',
        url: product.url,
      }],
      url: product.url,
      rating: product.rating,
      reviewCount: product.reviews,
    }));
  }
}

export const priceAPIService = new PriceAPIService();
export const api7Service = new API7Service();
export default priceAPIService;
