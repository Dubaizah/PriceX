/**
 * PriceX - Database Schema: Unified Product
 * Core schema for normalized product data across all sellers
 */

export interface UnifiedProduct {
  id: string;
  sku: string;
  
  // Standard Identifiers
  identifiers: {
    upc?: string;
    ean?: string;
    isbn?: string;
    mpn?: string;
    brand?: string;
    model?: string;
    gtin?: string;
  };
  
  // Core Product Info
  title: string;
  titleNormalized: string;
  description?: string;
  descriptionHtml?: string;
  
  // Category & Taxonomy
  categoryId: string;
  categoryPath: string[];
  attributes: Record<string, string | number | boolean>;
  
  // Media
  images: ProductImage[];
  videos?: ProductVideo[];
  
  // Specifications
  specifications: ProductSpecification[];
  
  // Aggregated Seller Offers
  offers: SellerOffer[];
  
  // Statistics
  stats: {
    totalSellers: number;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    priceRange: number;
    priceHistoryDays: number;
    lowestShipping: number;
    highestShipping: number;
    inStockCount: number;
    outOfStockCount: number;
  };
  
  // Matching & Grouping
  matchGroupId?: string;
  matchConfidence: number;
  matchMethod?: 'identifier' | 'fuzzy' | 'manual';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastPriceUpdate: Date;
  
  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Status
  status: 'active' | 'pending' | 'discontinued' | 'hidden';
  isVerified: boolean;
  verificationSource?: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  isPrimary: boolean;
  source?: string;
}

export interface ProductVideo {
  url: string;
  thumbnail?: string;
  platform?: 'youtube' | 'vimeo' | 'internal';
}

export interface ProductSpecification {
  name: string;
  value: string | number;
  unit?: string;
  group?: string;
}

// ============================================
// SELLER OFFER SCHEMA
// ============================================

export interface SellerOffer {
  id: string;
  
  // Product Reference
  unifiedProductId: string;
  
  // Seller Info
  seller: SellerInfo;
  
  // Pricing
  pricing: OfferPricing;
  
  // Availability
  availability: OfferAvailability;
  
  // Condition
  condition: OfferCondition;
  
  // Shipping
  shipping: OfferShipping;
  
  // Fulfillment
  fulfillment: OfferFulfillment;
  
  // Promotions
  promotions?: OfferPromotion[];
  
  // Metadata
  sourceUrl: string;
  sourceType: 'api' | 'scraper' | 'feed' | 'manual';
  scrapedAt: Date;
  expiresAt?: Date;
  
  // Tracking
  priceHistory: PricePoint[];
  viewCount?: number;
  clickCount?: number;
}

export interface SellerInfo {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  isVerified: boolean;
  isOfficialStore: boolean;
  rating?: number;
  reviewCount?: number;
  region: string;
  country: string;
}

export interface OfferPricing {
  // Original Prices
  basePrice: number;
  originalPrice?: number;
  currency: string;
  currencyConverted?: number;
  baseCurrency?: string;
  
  // Discount
  discountPercent?: number;
  discountAmount?: number;
  isOnSale: boolean;
  
  // Fees
  processingFee?: number;
  taxRate?: number;
  taxAmount?: number;
  
  // Final
  totalLandedCost: number;
  
  // Comparison
  pricePerUnit?: number;
  unitSize?: string;
}

export interface OfferAvailability {
  status: 'in_stock' | 'out_of_stock' | 'limited' | 'preorder' | 'available';
  quantity?: number;
  stockLevel?: 'high' | 'medium' | 'low' | 'out';
  restockDate?: Date;
}

export interface OfferCondition {
  type: 'new' | 'refurbished' | 'used' | 'open_box';
  grade?: 'a' | 'b' | 'c';
  warranty?: string;
  originalPackaging?: boolean;
}

export interface OfferShipping {
  cost: number;
  isFree: boolean;
  method?: 'standard' | 'express' | 'overnight' | 'freight';
  estimatedDelivery?: string;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  shipsFrom?: string;
  shipsTo?: string[];
  
  // DDP/DDU
  deliveryType?: 'ddp' | 'ddu';
  importDuty?: number;
  vat?: number;
}

export interface OfferFulfillment {
  type: 'fulfilled_by_seller' | 'fulfilled_by_marketplace' | 'dropship';
  isPrime?: boolean;
  isFba?: boolean;
  storePickup?: boolean;
}

export interface OfferPromotion {
  type: 'coupon' | 'deal' | 'bundle' | 'cashback' | 'loyalty';
  code?: string;
  description: string;
  discount?: number;
  expiresAt?: Date;
}

export interface PricePoint {
  price: number;
  shipping?: number;
  currency: string;
  timestamp: Date;
}

// ============================================
// COMPARISON RESPONSE TYPES
// ============================================

export interface ComparisonResult {
  product: UnifiedProduct;
  sellers: RankedSeller[];
  filters: ComparisonFilters;
  metadata: ComparisonMetadata;
}

export interface RankedSeller extends SellerOffer {
  rank: number;
  cheapestFlag: boolean;
  savingsFromHighest: number;
  savingsFromAvg: number;
  dealScore: number;
}

export interface ComparisonFilters {
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  condition?: ('new' | 'refurbished' | 'used' | 'open_box')[];
  sellers?: string[];
  regions?: string[];
  freeShipping?: boolean;
}

export interface ComparisonMetadata {
  queryTime: number;
  totalSellers: number;
  lowestPrice: number;
  highestPrice: number;
  avgPrice: number;
  priceSpread: number;
  lastUpdated: Date;
}

// ============================================
// MATCHING TYPES
// ============================================

export interface MatchResult {
  unifiedProductId: string;
  confidence: number;
  method: 'identifier' | 'fuzzy' | 'nlp' | 'manual';
  matchedOn: string[];
  score: number;
}

export interface MatchGroup {
  id: string;
  productIds: string[];
  primaryProductId: string;
  title: string;
  brand?: string;
  identifiers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INGESTION PIPELINE TYPES
// ============================================

export interface IngestionJob {
  id: string;
  type: 'api_fetch' | 'scrape' | 'feed_parse' | 'bulk_import';
  source: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'retrying';
  priority: 'high' | 'normal' | 'low';
  
  payload: {
    retailerId?: string;
    categoryId?: string;
    urls?: string[];
    query?: string;
    options?: Record<string, any>;
  };
  
  progress: {
    total: number;
    processed: number;
    failed: number;
    errors: string[];
  };
  
  rateLimit?: {
    maxRequests: number;
    currentRequests: number;
    windowMs: number;
  };
  
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface ScrapeConfig {
  retailerId: string;
  proxyPool?: string[];
  userAgent?: string;
  captchaService?: string;
  rateLimit: number;
  retryAttempts: number;
  timeout: number;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchQuery {
  query: string;
  categoryId?: string;
  filters?: ComparisonFilters;
  sortBy?: 'price_asc' | 'price_desc' | 'relevance' | 'rating' | 'newest';
  pagination?: {
    page: number;
    limit: number;
  };
  region?: string;
  currency?: string;
}

export interface SearchResult {
  products: UnifiedProduct[];
  total: number;
  page: number;
  totalPages: number;
  facets: SearchFacet[];
  queryTime: number;
}

export interface SearchFacet {
  field: string;
  values: { value: string; count: number }[];
}
