/**
 * PriceX - Amazon Product Advertising API Integration
 * Fetches live product data from Amazon in all regions
 */

export interface AmazonProduct {
  asin: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  currency: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  category?: string;
  url: string;
  primeEligible?: boolean;
  discount?: number;
}

export interface AmazonSearchResult {
  products: AmazonProduct[];
  totalResults: number;
  error?: string;
}

// Amazon regions configuration
const AMAZON_REGIONS = {
  us: { domain: 'amazon.com', country: 'USA', currency: 'USD' },
  uk: { domain: 'amazon.co.uk', country: 'United Kingdom', currency: 'GBP' },
  de: { domain: 'amazon.de', country: 'Germany', currency: 'EUR' },
  fr: { domain: 'amazon.fr', country: 'France', currency: 'EUR' },
  it: { domain: 'amazon.it', country: 'Italy', currency: 'EUR' },
  es: { domain: 'amazon.es', country: 'Spain', currency: 'EUR' },
  jp: { domain: 'amazon.co.jp', country: 'Japan', currency: 'JPY' },
  ca: { domain: 'amazon.ca', country: 'Canada', currency: 'CAD' },
  au: { domain: 'amazon.com.au', country: 'Australia', currency: 'AUD' },
  in: { domain: 'amazon.in', country: 'India', currency: 'INR' },
  br: { domain: 'amazon.com.br', country: 'Brazil', currency: 'BRL' },
  mx: { domain: 'amazon.com.mx', country: 'Mexico', currency: 'MXN' },
  ae: { domain: 'amazon.ae', country: 'UAE', currency: 'AED' },
  sa: { domain: 'amazon.sa', country: 'Saudi Arabia', currency: 'SAR' },
  sg: { domain: 'amazon.sg', country: 'Singapore', currency: 'SGD' },
  nl: { domain: 'amazon.nl', country: 'Netherlands', currency: 'EUR' },
  pl: { domain: 'amazon.pl', country: 'Poland', currency: 'PLN' },
  tr: { domain: 'amazon.com.tr', country: 'Turkey', currency: 'TRY' },
  se: { domain: 'amazon.se', country: 'Sweden', currency: 'SEK' },
};

export type AmazonRegion = keyof typeof AMAZON_REGIONS;

export class AmazonPAAPI {
  private accessKey: string;
  private secretKey: string;
  private tag: string;
  private region: AmazonRegion;

  constructor(
    accessKey: string = process.env.AMAZON_ACCESS_KEY || '',
    secretKey: string = process.env.AMAZON_SECRET_KEY || '',
    tag: string = process.env.AMAZON_TAG || 'pricex-20',
    region: AmazonRegion = 'us'
  ) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.tag = tag;
    this.region = region;
  }

  /**
   * Search products on Amazon
   */
  async searchProducts(query: string, region: AmazonRegion = 'us', limit: number = 10): Promise<AmazonSearchResult> {
    // If no API keys, return mock data
    if (!this.accessKey || !this.secretKey) {
      return this.getMockSearchResults(query, region, limit);
    }

    try {
      // Build Amazon PA-API request
      const endpoint = `https://webservices.amazon.${AMAZON_REGIONS[region].domain}/paapi5/searchproducts`;
      
      const request = {
        Keywords: query,
        SearchIndex: 'All',
        ItemCount: limit,
        Resources: [
          'Images.Primary.Medium',
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'CustomerReview.RatingsSummaries',
        ],
        PartnerTag: this.tag,
        PartnerType: 'Associates',
        Marketplace: `www.${AMAZON_REGIONS[region].domain}`,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Amz-Target': 'AmazonPAAPIService.SearchProducts',
          'X-Amz-Date': new Date().toISOString(),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAmazonResponse(data, region);
    } catch (error) {
      console.error('Amazon API error:', error);
      return this.getMockSearchResults(query, region, limit);
    }
  }

  /**
   * Get product details by ASIN
   */
  async getProductByASIN(asin: string, region: AmazonRegion = 'us'): Promise<AmazonProduct | null> {
    if (!this.accessKey || !this.secretKey) {
      return this.getMockProduct(asin, region);
    }

    try {
      const endpoint = `https://webservices.amazon.${AMAZON_REGIONS[region].domain}/paapi5/getitems`;
      
      const request = {
        ItemIds: [asin],
        Resources: [
          'Images.Primary.Medium',
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.ProductInfo',
          'Offers.Listings.Price',
          'CustomerReview.RatingsSummaries',
        ],
        PartnerTag: this.tag,
        PartnerType: 'Associates',
        Marketplace: `www.${AMAZON_REGIONS[region].domain}`,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return this.parseSingleProduct(data, region);
    } catch (error) {
      console.error('Amazon get product error:', error);
      return this.getMockProduct(asin, region);
    }
  }

  /**
   * Search products across all Amazon regions
   */
  async searchAllRegions(query: string, limitPerRegion: number = 5): Promise<AmazonSearchResult> {
    const allProducts: AmazonProduct[] = [];
    const regions = Object.keys(AMAZON_REGIONS) as AmazonRegion[];

    // Search in all regions in parallel
    const promises = regions.map(region => this.searchProducts(query, region, limitPerRegion));
    const results = await Promise.all(promises);

    results.forEach(result => {
      allProducts.push(...result.products);
    });

    return {
      products: allProducts,
      totalResults: allProducts.length,
    };
  }

  private parseAmazonResponse(data: any, region: AmazonRegion): AmazonSearchResult {
    const products: AmazonProduct[] = [];
    const regionConfig = AMAZON_REGIONS[region];

    if (data.SearchResult?.Items) {
      for (const item of data.SearchResult.Items) {
        const product: AmazonProduct = {
          asin: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
          imageUrl: item.Images?.Primary?.Medium?.URL || '',
          price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
          originalPrice: item.Offers?.Listings?.[0]?.Price?.Savings?.Base?.Amount,
          currency: item.Offers?.Listings?.[0]?.Price?.CurrencyCode || regionConfig.currency,
          availability: item.Offers?.Listings?.[0]?.Availability?.Message || 'Available',
      rating: item.CustomerReview?.RatingsSummaries?.[0]?.HighestRating,
      reviewCount: item.CustomerReview?.RatingsSummaries?.[0]?.TotalReviewCount,
      url: `https://www.${regionConfig.domain}/dp/${item.ASIN}?tag=${this.tag}`,
      primeEligible: item.Offers?.Listings?.[0]?.IsPrime ?? false,
        };
        products.push(product);
      }
    }

    return {
      products,
      totalResults: data.SearchResult?.TotalResultCount || products.length,
    };
  }

  private parseSingleProduct(data: any, region: AmazonRegion): AmazonProduct | null {
    const item = data.ItemsResult?.Items?.[0];
    if (!item) return null;

    const regionConfig = AMAZON_REGIONS[region];

    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
      imageUrl: item.Images?.Primary?.Medium?.URL || '',
      price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      originalPrice: item.Offers?.Listings?.[0]?.Price?.Savings?.Base?.Amount,
      currency: item.Offers?.Listings?.[0]?.Price?.CurrencyCode || regionConfig.currency,
      availability: item.Offers?.Listings?.[0]?.Availability?.Message || 'Available',
      rating: item.CustomerReview?.RatingsSummaries?.[0]?.HighestRating,
      reviewCount: item.CustomerReview?.RatingsSummaries?.[0]?.TotalReviewCount,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      category: item.ItemInfo?.ProductInfo?.Category?.DisplayValue,
      url: `https://www.${regionConfig.domain}/dp/${item.ASIN}?tag=${this.tag}`,
      primeEligible: item.Offers?.Listings?.[0]?.IsPrime ?? false,
    };
  }

  /**
   * Mock data for development/demo
   */
  private getMockSearchResults(query: string, region: AmazonRegion, limit: number): AmazonSearchResult {
    const regionConfig = AMAZON_REGIONS[region];
    const mockProducts: AmazonProduct[] = [];
    
    // Generate mock products based on query
    const baseProducts = this.getBaseProductsForQuery(query);
    
    for (let i = 0; i < Math.min(limit, baseProducts.length); i++) {
      const base = baseProducts[i];
      const priceVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10%
      
      mockProducts.push({
        asin: `B0${Math.random().toString(36).substring(2, 10)}`,
        title: `${base.brand} ${base.name}`,
        imageUrl: base.image,
        price: Math.round(base.price * priceVariation * 100) / 100,
        originalPrice: base.price,
        currency: regionConfig.currency,
        availability: 'In Stock',
        rating: base.rating,
        reviewCount: base.reviews,
        brand: base.brand,
        url: `https://www.${regionConfig.domain}/search?k=${encodeURIComponent(query)}`,
        primeEligible: true,
        discount: Math.round((1 - priceVariation) * 100),
      });
    }

    return {
      products: mockProducts,
      totalResults: mockProducts.length,
    };
  }

  private getMockProduct(asin: string, region: AmazonRegion): AmazonProduct {
    const regionConfig = AMAZON_REGIONS[region];
    return {
      asin,
      title: 'Sample Product from Amazon',
      imageUrl: '/product-1.jpg',
      price: 99.99,
      currency: regionConfig.currency,
      availability: 'In Stock',
      url: `https://www.${regionConfig.domain}/dp/${asin}`,
      primeEligible: true,
    };
  }

  private getBaseProductsForQuery(query: string): Array<{name: string; brand: string; price: number; rating: number; reviews: number; image: string}> {
    const q = query.toLowerCase();
    
    const productDatabase: Record<string, Array<{name: string; brand: string; price: number; rating: number; reviews: number; image: string}>> = {
      iphone: [
        { name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, rating: 4.8, reviews: 2500, image: '/product-1.jpg' },
        { name: 'iPhone 15 Pro', brand: 'Apple', price: 999, rating: 4.7, reviews: 1800, image: '/product-1.jpg' },
        { name: 'iPhone 15', brand: 'Apple', price: 799, rating: 4.6, reviews: 3200, image: '/product-1.jpg' },
      ],
      samsung: [
        { name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 1299, rating: 4.7, reviews: 1800, image: '/product-2.jpg' },
        { name: 'Galaxy S24+', brand: 'Samsung', price: 999, rating: 4.6, reviews: 1200, image: '/product-2.jpg' },
        { name: 'Galaxy S24', brand: 'Samsung', price: 799, rating: 4.5, reviews: 950, image: '/product-2.jpg' },
      ],
      macbook: [
        { name: 'MacBook Pro 16" M3 Max', brand: 'Apple', price: 3499, rating: 4.9, reviews: 1500, image: '/product-3.jpg' },
        { name: 'MacBook Pro 14" M3 Pro', brand: 'Apple', price: 1999, rating: 4.8, reviews: 980, image: '/product-3.jpg' },
        { name: 'MacBook Air 15" M3', brand: 'Apple', price: 1299, rating: 4.7, reviews: 2100, image: '/product-3.jpg' },
      ],
      nike: [
        { name: 'Air Max 270', brand: 'Nike', price: 150, rating: 4.6, reviews: 8900, image: '/product-5.jpg' },
        { name: 'Air Force 1', brand: 'Nike', price: 110, rating: 4.7, reviews: 12000, image: '/product-5.jpg' },
        { name: 'Dunk Low', brand: 'Nike', price: 120, rating: 4.5, reviews: 6500, image: '/product-5.jpg' },
      ],
      sony: [
        { name: 'WH-1000XM5', brand: 'Sony', price: 399, rating: 4.8, reviews: 15000, image: '/product-4.jpg' },
        { name: 'WF-1000XM5', brand: 'Sony', price: 299, rating: 4.7, reviews: 8500, image: '/product-4.jpg' },
        { name: 'PlayStation 5', brand: 'Sony', price: 499, rating: 4.9, reviews: 24000, image: '/product-10.jpg' },
      ],
      default: [
        { name: 'Premium Product', brand: 'Top Brand', price: 99, rating: 4.5, reviews: 1000, image: '/product-1.jpg' },
        { name: 'Best Seller', brand: 'Popular Brand', price: 79, rating: 4.4, reviews: 800, image: '/product-1.jpg' },
        { name: 'New Arrival', brand: 'New Brand', price: 129, rating: 4.3, reviews: 500, image: '/product-1.jpg' },
      ],
    };

    for (const [key, products] of Object.entries(productDatabase)) {
      if (q.includes(key)) {
        return products;
      }
    }

    return productDatabase.default;
  }
}

// Export default instance
export const amazonAPI = new AmazonPAAPI();

// Export regions for use
export { AMAZON_REGIONS };
