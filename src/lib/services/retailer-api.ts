/**
 * PriceX - Retailer API Integration Service
 * Official API integrations with major retailers
 * Amazon PA-API, eBay API, Walmart API, Target API, etc.
 */

import { FetchedProductData, FetchedOffer, RetailerConfig, getRetailerConfig } from './retailer-config';

interface AmazonPAAPIConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  marketplace: string;
}

interface eBayAPIConfig {
  appId: string;
  devId: string;
  certId: string;
}

interface WalmartAPIConfig {
  apiKey: string;
}

class AmazonPAAPIService {
  private config: AmazonPAAPIConfig | null = null;

  configure(accessKey: string, secretKey: string, partnerTag: string, marketplace: string = 'www.amazon.com'): void {
    this.config = { accessKey, secretKey, partnerTag, marketplace };
  }

  async searchProducts(keyword: string, options?: {
    searchIndex?: string;
    itemCount?: number;
    page?: number;
  }): Promise<FetchedProductData[]> {
    if (!this.config) {
      console.warn('Amazon PA-API not configured. Using mock data.');
      return this.getMockAmazonData(keyword);
    }

    const { searchIndex = 'Electronics', itemCount = 10, page = 1 } = options || {};

    try {
      const response = await fetch('/api/amazon/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          searchIndex,
          itemCount,
          page,
          partnerTag: this.config.partnerTag,
        }),
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAmazonResults(data.Items?.Item || []);
    } catch (error) {
      console.error('Amazon PA-API search error:', error);
      return this.getMockAmazonData(keyword);
    }
  }

  async getProductDetails(asin: string): Promise<FetchedProductData | null> {
    if (!this.config) {
      console.warn('Amazon PA-API not configured.');
      return null;
    }

    try {
      const response = await fetch('/api/amazon/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin,
          partnerTag: this.config.partnerTag,
        }),
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAmazonProduct(data.Items?.Item);
    } catch (error) {
      console.error('Amazon PA-API product error:', error);
      return null;
    }
  }

  private transformAmazonResults(items: any[]): FetchedProductData[] {
    const retailer = getRetailerConfig('amazon')!;
    
    return items.map((item, index) => {
      const price = item.Price?.Amount || item.Offers?.ListingPrice?.Amount || 0;
      const originalPrice = item.Price?.HighestPrice?.Amount || item.Offers?.ListingPrice?.Amount || price;
      const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

      return {
        source: retailer,
        sourceType: 'api' as const,
        fetchedAt: new Date(),
        productId: item.ASIN,
        name: item.ItemInfo?.Title?.DisplayValue || item.ItemAttributes?.Title || 'Unknown',
        brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
        description: item.ItemInfo?.Features?.DisplayValues?.join(' '),
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent,
        currency: item.Price?.CurrencyCode || 'USD',
        availability: item.Offers?.Offer?.OfferAvailability?.AvailabilityType === 'in_stock' ? 'in_stock' : 'out_of_stock',
        images: item.Images?.Primary?.Medium?.URL ? [item.Images.Primary.Medium.URL] : [],
        offers: this.generateOffers(item, price, originalPrice, retailer),
        url: item.DetailPageURL,
        rating: item.CustomerReviews?.AverageRating ? parseFloat(item.CustomerReviews.AverageRating) : undefined,
        reviewCount: item.CustomerReviews?.TotalReviews ? parseInt(item.CustomerReviews.TotalReviews) : undefined,
      };
    });
  }

  private transformAmazonProduct(item: any): FetchedProductData | null {
    if (!item) return null;

    const retailer = getRetailerConfig('amazon')!;
    const price = item.Price?.Amount || 0;
    const originalPrice = item.Price?.HighestPrice?.Amount || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

    const images: string[] = [];
    if (item.Images?.Primary?.Large?.URL) images.push(item.Images.Primary.Large.URL);
    if (item.Images?.Variants) {
      for (const variant of item.Images.Variants.Variant) {
        if (variant.Large?.URL && !images.includes(variant.Large.URL)) {
          images.push(variant.Large.URL);
        }
      }
    }

    return {
      source: retailer,
      sourceType: 'api',
      fetchedAt: new Date(),
      productId: item.ASIN,
      name: item.ItemInfo?.Title?.DisplayValue || 'Unknown',
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      model: item.ItemInfo?.Title?.DisplayValue,
      description: item.ItemInfo?.Features?.DisplayValues?.join('\n'),
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent,
      currency: item.Price?.CurrencyCode || 'USD',
      availability: item.Offers?.Offer?.OfferAvailability?.AvailabilityType === 'in_stock' ? 'in_stock' : 'out_of_stock',
      stockQuantity: item.Offers?.Offer?.OfferAvailability?.AvailableQuantity ? parseInt(item.Offers.Offer.OfferAvailability.AvailableQuantity) : undefined,
      images,
      specifications: this.extractSpecifications(item),
      offers: this.generateOffers(item, price, originalPrice, retailer),
      url: item.DetailPageURL,
      rating: item.CustomerReviews?.AverageRating ? parseFloat(item.CustomerReviews.AverageRating) : undefined,
      reviewCount: item.CustomerReviews?.TotalReviews ? parseInt(item.CustomerReviews.TotalReviews) : undefined,
    };
  }

  private extractSpecifications(item: any): Record<string, string> {
    const specs: Record<string, string> = {};
    
    if (item.ItemInfo?.TechnicalInfo?.TechnicalSpecifications) {
      for (const spec of item.ItemInfo.TechnicalInfo.TechnicalSpecifications) {
        specs[spec.Label] = spec.Value;
      }
    }
    
    return specs;
  }

  private generateOffers(item: any, price: number, originalPrice: number, retailer: RetailerConfig): FetchedOffer[] {
    const offers: FetchedOffer[] = [];
    
    offers.push({
      id: 'amazon-primary',
      type: 'primary',
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
      availability: item.Offers?.Offer?.OfferAvailability?.AvailabilityType === 'in_stock' ? 'in_stock' : 'out_of_stock',
      stockQuantity: item.Offers?.Offer?.OfferAvailability?.AvailableQuantity ? parseInt(item.Offers.Offer.OfferAvailability.AvailableQuantity) : undefined,
      shippingCost: 0,
      shippingTime: '2-5 business days',
      url: item.DetailPageURL,
    });

    if (item.Offers?.MoreOffers?.Offer) {
      for (const offer of item.Offers.MoreOffers.Offer) {
        offers.push({
          id: offer.OfferID,
          type: offer.OfferListing?.Condition === 'New' ? 'primary' : 'used',
          price: offer.Price?.Amount || 0,
          originalPrice: offer.Price?.HighestPrice?.Amount,
          availability: offer.OfferAvailability?.AvailabilityType === 'in_stock' ? 'in_stock' : 'out_of_stock',
          url: offer.OfferListing?.URL,
        });
      }
    }

    return offers;
  }

  private getMockAmazonData(keyword: string): FetchedProductData[] {
    const retailer = getRetailerConfig('amazon')!;
    
    return [{
      source: retailer,
      sourceType: 'api',
      fetchedAt: new Date(),
      name: `${keyword} - Sample Product`,
      price: 99.99,
      originalPrice: 129.99,
      discountPercent: 23,
      currency: 'USD',
      availability: 'in_stock',
      images: ['/product-1.jpg'],
      offers: [{
        id: 'amazon-mock-1',
        type: 'primary',
        price: 99.99,
        originalPrice: 129.99,
        discountPercent: 23,
        availability: 'in_stock',
        shippingCost: 0,
        shippingTime: '2-5 business days',
        url: 'https://amazon.com',
      }],
      url: 'https://amazon.com',
      rating: 4.5,
      reviewCount: 1234,
    }];
  }
}

class eBayAPIService {
  private config: eBayAPIConfig | null = null;

  configure(appId: string, devId: string, certId: string): void {
    this.config = { appId, devId, certId };
  }

  async searchProducts(keyword: string, options?: {
    categoryId?: string;
    limit?: number;
    sort?: string;
  }): Promise<FetchedProductData[]> {
    if (!this.config) {
      console.warn('eBay API not configured. Using mock data.');
      return this.getMockeBayData(keyword);
    }

    try {
      const response = await fetch('/api/ebay/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          categoryId: options?.categoryId,
          limit: options?.limit || 20,
          sort: options?.sort,
        }),
      });

      if (!response.ok) {
        throw new Error(`eBay API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformeBayResults(data.searchResult?.item || []);
    } catch (error) {
      console.error('eBay API search error:', error);
      return this.getMockeBayData(keyword);
    }
  }

  private transformeBayResults(items: any[]): FetchedProductData[] {
    const retailer = getRetailerConfig('ebay')!;

    return items.map((item, index) => {
      const price = parseFloat(item.sellingStatus?.currentPrice?.value || '0');
      const originalPrice = parseFloat(item.originalPrice?.value || item.sellingStatus?.convertedCurrentPrice?.value || '0');
      const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

      return {
        source: retailer,
        sourceType: 'api' as const,
        fetchedAt: new Date(),
        productId: item.itemId,
        name: item.title,
        description: item.shortDescription,
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent,
        currency: item.sellingStatus?.currentPrice?.currencyCode || 'USD',
        availability: item.availability?.shipToLocationsAvailability?.availableQuantity ? 'in_stock' : 'out_of_stock',
        images: item.image?.imageUrl ? [item.image.imageUrl] : [],
        offers: [{
          id: item.itemId || `ebay-${index}`,
          type: item.condition === 'New' ? 'primary' : 'used',
          price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          discountPercent,
          availability: 'in_stock',
          url: item.viewItemURL,
        }],
        url: item.viewItemURL,
      };
    });
  }

  private getMockeBayData(keyword: string): FetchedProductData[] {
    const retailer = getRetailerConfig('ebay')!;
    
    return [{
      source: retailer,
      sourceType: 'api',
      fetchedAt: new Date(),
      name: `${keyword} - eBay Sample`,
      price: 89.99,
      originalPrice: 119.99,
      discountPercent: 25,
      currency: 'USD',
      availability: 'in_stock',
      images: ['/product-2.jpg'],
      offers: [{
        id: 'ebay-mock-1',
        type: 'primary',
        price: 89.99,
        originalPrice: 119.99,
        discountPercent: 25,
        availability: 'in_stock',
        url: 'https://ebay.com',
      }],
      url: 'https://ebay.com',
      rating: 4.3,
      reviewCount: 567,
    }];
  }
}

class WalmartAPIService {
  private apiKey: string | null = null;

  configure(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async searchProducts(keyword: string, options?: {
    categoryId?: string;
    limit?: number;
  }): Promise<FetchedProductData[]> {
    if (!this.apiKey) {
      console.warn('Walmart API not configured. Using mock data.');
      return this.getMockWalmartData(keyword);
    }

    try {
      const response = await fetch(`/api/walmart/search?apiKey=${this.apiKey}&query=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error(`Walmart API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWalmartResults(data.items || []);
    } catch (error) {
      console.error('Walmart API search error:', error);
      return this.getMockWalmartData(keyword);
    }
  }

  private transformWalmartResults(items: any[]): FetchedProductData[] {
    const retailer = getRetailerConfig('walmart')!;

    return items.map((item, index) => {
      const price = item.price || 0;
      const originalPrice = item.wasPrice || item.originalPrice || price;
      const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

      return {
        source: retailer,
        sourceType: 'api' as const,
        fetchedAt: new Date(),
        productId: item.itemId,
        name: item.name,
        brand: item.brandName,
        description: item.shortDescription,
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent,
        currency: 'USD',
        availability: item.availability === 'Available' ? 'in_stock' : 'out_of_stock',
        stockQuantity: item.quantity,
        images: item.imageUrl ? [item.imageUrl] : [],
        offers: [{
          id: item.itemId || `walmart-${index}`,
          type: 'primary',
          price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          discountPercent,
          availability: item.availability === 'Available' ? 'in_stock' : 'out_of_stock',
          stockQuantity: item.quantity,
          url: item.productUrl,
        }],
        url: item.productUrl,
        rating: item.rating,
        reviewCount: item.reviewCount,
      };
    });
  }

  private getMockWalmartData(keyword: string): FetchedProductData[] {
    const retailer = getRetailerConfig('walmart')!;
    
    return [{
      source: retailer,
      sourceType: 'api',
      fetchedAt: new Date(),
      name: `${keyword} - Walmart Sample`,
      price: 79.99,
      originalPrice: 99.99,
      discountPercent: 20,
      currency: 'USD',
      availability: 'in_stock',
      images: ['/product-3.jpg'],
      offers: [{
        id: 'walmart-mock-1',
        type: 'primary',
        price: 79.99,
        originalPrice: 99.99,
        discountPercent: 20,
        availability: 'in_stock',
        url: 'https://walmart.com',
      }],
      url: 'https://walmart.com',
      rating: 4.2,
      reviewCount: 890,
    }];
  }
}

export const amazonPAAPIService = new AmazonPAAPIService();
export const ebayAPIService = new eBayAPIService();
export const walmartAPIService = new WalmartAPIService();
export default { amazonPAAPIService, ebayAPIService, walmartAPIService };
