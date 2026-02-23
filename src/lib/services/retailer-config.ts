/**
 * PriceX - Retailer Data Source Types
 * Types for different data sources (scraper, API, feed)
 */

export type DataSourceType = 'scraper' | 'api' | 'feed' | 'manual' | 'affiliate';

export interface RetailerConfig {
  id: string;
  name: string;
  domain: string;
  logo: string;
  website: string;
  region: string;
  dataSource: DataSourceType;
  apiEndpoint?: string;
  scrapeEndpoint?: string;
  affiliateNetwork?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOfficialStore: boolean;
  shippingInfo: ShippingInfo;
  returnPolicy: ReturnPolicy;
  locations?: RetailerLocation[];
  scraping?: ScrapingConfig;
}

export interface ShippingInfo {
  freeShippingThreshold?: number;
  standardShipping: number;
  expressShipping?: number;
  regions: string[];
  estimatedDelivery?: string;
}

export interface ReturnPolicy {
  allowed: boolean;
  days: number;
  conditions: string;
  restockingFee?: number;
}

export interface RetailerLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours: string;
  phone?: string;
}

export interface ScrapingConfig {
  enabled: boolean;
  rateLimit: number;
  requiresUserAgent: boolean;
  usesCloudflare: boolean;
  captchaRequired: boolean;
  cssSelectors?: Record<string, string>;
}

export interface FetchedProductData {
  source: RetailerConfig;
  sourceType: DataSourceType;
  fetchedAt: Date;
  productId?: string;
  sku?: string;
  upc?: string;
  name: string;
  brand?: string;
  model?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string;
  availability: string;
  stockQuantity?: number;
  images: string[];
  videos?: string[];
  specifications?: Record<string, string>;
  offers: FetchedOffer[];
  rating?: number;
  reviewCount?: number;
  url: string;
}

export interface FetchedOffer {
  id: string;
  type: 'primary' | 'bundle' | 'refurbished' | 'used' | 'coupon' | 'lightning_deal';
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  couponCode?: string;
  couponDiscount?: number;
  availability: string;
  stockQuantity?: number;
  expiresAt?: Date;
  shippingCost?: number;
  shippingTime?: string;
  url: string;
  features?: string[];
}

export const RETAILER_CONFIGS: RetailerConfig[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    domain: 'amazon.com',
    logo: '/retailers/amazon.png',
    website: 'https://www.amazon.com',
    region: 'north-america',
    dataSource: 'api',
    apiEndpoint: 'https://api.amazon.com',
    rating: 4.5,
    reviewCount: 50000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      freeShippingThreshold: 35,
      standardShipping: 0,
      expressShipping: 14.99,
      regions: ['US', 'CA', 'MX'],
    },
    returnPolicy: {
      allowed: true,
      days: 30,
      conditions: 'Original packaging',
    },
    scraping: {
      enabled: false,
      rateLimit: 1000,
      requiresUserAgent: true,
      usesCloudflare: true,
      captchaRequired: true,
    },
  },
  {
    id: 'bestbuy',
    name: 'Best Buy',
    domain: 'bestbuy.com',
    logo: '/retailers/bestbuy.png',
    website: 'https://www.bestbuy.com',
    region: 'north-america',
    dataSource: 'api',
    rating: 4.3,
    reviewCount: 25000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      freeShippingThreshold: 35,
      standardShipping: 5.99,
      expressShipping: 29.99,
      regions: ['US'],
    },
    returnPolicy: {
      allowed: true,
      days: 15,
      conditions: 'Original packaging',
    },
  },
  {
    id: 'walmart',
    name: 'Walmart',
    domain: 'walmart.com',
    logo: '/retailers/walmart.png',
    website: 'https://www.walmart.com',
    region: 'north-america',
    dataSource: 'api',
    rating: 4.2,
    reviewCount: 30000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      freeShippingThreshold: 35,
      standardShipping: 0,
      regions: ['US'],
    },
    returnPolicy: {
      allowed: true,
      days: 90,
      conditions: 'Original condition',
    },
  },
  {
    id: 'target',
    name: 'Target',
    domain: 'target.com',
    logo: '/retailers/target.png',
    website: 'https://www.target.com',
    region: 'north-america',
    dataSource: 'api',
    rating: 4.4,
    reviewCount: 20000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      freeShippingThreshold: 35,
      standardShipping: 0,
      regions: ['US'],
    },
    returnPolicy: {
      allowed: true,
      days: 90,
      conditions: 'Original condition',
    },
  },
  {
    id: 'ebay',
    name: 'eBay',
    domain: 'ebay.com',
    logo: '/retailers/ebay.png',
    website: 'https://www.ebay.com',
    region: 'global',
    dataSource: 'api',
    rating: 4.3,
    reviewCount: 40000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      standardShipping: 0,
      regions: ['US', 'CA', 'UK', 'AU'],
    },
    returnPolicy: {
      allowed: true,
      days: 30,
      conditions: 'As described',
    },
  },
  {
    id: 'newegg',
    name: 'Newegg',
    domain: 'newegg.com',
    logo: '/retailers/newegg.png',
    website: 'https://www.newegg.com',
    region: 'north-america',
    dataSource: 'api',
    rating: 4.4,
    reviewCount: 15000000,
    isVerified: true,
    isOfficialStore: false,
    shippingInfo: {
      freeShippingThreshold: 30,
      standardShipping: 0,
      regions: ['US', 'CA'],
    },
    returnPolicy: {
      allowed: true,
      days: 30,
      conditions: 'Original packaging',
    },
  },
];

export function getRetailerConfig(retailerId: string): RetailerConfig | undefined {
  return RETAILER_CONFIGS.find(r => r.id === retailerId);
}

export function getRetailersByRegion(region: string): RetailerConfig[] {
  return RETAILER_CONFIGS.filter(r => r.region === region || r.region === 'global');
}
