/**
 * PriceX - Product Data Model
 * Product types, pricing, and comparison structures
 */

import { CategoryId, Category, ProductAttribute } from './product';
import { Currency, Region } from './index';

// Product Availability Status
export type ProductAvailability = 'in_stock' | 'out_of_stock' | 'pre_order' | 'backorder' | 'discontinued';

// Product Condition
export type ProductCondition = 'new' | 'used' | 'refurbished' | 'open_box';

// Retailer/Source Information
export interface Retailer {
  id: string;
  name: string;
  logo: string;
  website: string;
  region: Region;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOfficialStore: boolean;
  shippingInfo: {
    freeShippingThreshold?: number;
    standardShipping: number;
    expressShipping?: number;
    regions: string[];
  };
  returnPolicy: {
    allowed: boolean;
    days: number;
    conditions: string;
  };
  locations?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    hours: string;
  }[];
}

// Product Price Point
export interface PricePoint {
  id: string;
  retailerId: string;
  retailer: Retailer;
  price: number;
  originalPrice?: number;
  currency: Currency;
  availability: ProductAvailability;
  condition: ProductCondition;
  url: string;
  sku: string;
  offerExpiry?: Date;
  shippingCost: number;
  shippingTime: string;
  isOfficialStore: boolean;
  warranty?: string;
  inStock: boolean;
  stockQuantity?: number;
  lastUpdated: Date;
}

// Product Image
export interface ProductImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  type: 'main' | 'gallery' | 'detail' | 'lifestyle';
  order: number;
}

// Product Video
export interface ProductVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  type: 'review' | 'unboxing' | 'tutorial' | 'advertisement';
  source: 'youtube' | 'vimeo' | 'internal';
  duration?: number;
}

// Product Review
export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verifiedPurchase: boolean;
  helpful: number;
  images?: string[];
  createdAt: Date;
  retailer?: string;
}

// Product Specification
export interface ProductSpecification {
  attributeId: string;
  name: string;
  value: string | number | boolean | string[];
  unit?: string;
  group?: string;
}

// Product Variant (for products with options like size/color)
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Record<string, string>;
  images: ProductImage[];
  priceRange: { min: number; max: number };
  availability: ProductAvailability;
}

// Main Product Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  brand: string;
  model?: string;
  sku: string;
  mpn?: string; // Manufacturer Part Number
  upc?: string;
  ean?: string;
  gtin?: string;
  isbn?: string; // For books/media
  
  categoryId: CategoryId;
  category: Category;
  subcategoryIds?: CategoryId[];
  
  images: ProductImage[];
  videos?: ProductVideo[];
  
  specifications: ProductSpecification[];
  attributes: Record<string, any>;
  
  variants?: ProductVariant[];
  
  pricePoints: PricePoint[];
  priceRange: {
    min: number;
    max: number;
    currency: Currency;
  };
  
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  
  availability: ProductAvailability;
  condition: ProductCondition;
  
  features: string[];
  tags: string[];
  
  isVerified: boolean;
  verifiedAt?: Date;
  
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Search Query
export interface SearchQuery {
  query: string;
  categoryId?: CategoryId;
  filters: SearchFilters;
  sort: SearchSort;
  pagination: SearchPagination;
}

// Search Filters
export interface SearchFilters {
  priceRange?: { min: number; max: number };
  brands?: string[];
  rating?: number;
  availability?: ProductAvailability[];
  condition?: ProductCondition[];
  attributes?: Record<string, any>;
  retailers?: string[];
  region?: Region;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
  category?: string;
}

// Search Sort Options
export type SortField = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';

export interface SearchSort {
  field: SortField;
  direction: 'asc' | 'desc';
}

// Search Pagination
export interface SearchPagination {
  page: number;
  limit: number;
  offset: number;
}

// Search Result
export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: SearchFacets;
  suggestions: string[];
  didYouMean?: string;
}

// Search Facets (for filtering)
export interface SearchFacets {
  categories: { id: string; name: string; count: number }[];
  brands: { name: string; count: number }[];
  priceRanges: { min: number; max: number; count: number }[];
  ratings: { rating: number; count: number }[];
  attributes: Record<string, { value: string; count: number }[]>;
  availability: { status: ProductAvailability; count: number }[];
}

// Product Comparison
export interface ComparisonItem {
  product: Product;
  selectedPricePoint?: PricePoint;
  isHighlighted: boolean;
}

export interface ProductComparison {
  id: string;
  userId?: string;
  items: ComparisonItem[];
  createdAt: Date;
  expiresAt: Date;
}

// Comparison Column Configuration
export interface ComparisonColumn {
  key: string;
  label: string;
  type: 'text' | 'image' | 'price' | 'rating' | 'boolean' | 'list';
  isHighlightable: boolean;
  group?: string;
}

// Price Alert / Back in Stock Alert
export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  type: 'price_drop' | 'back_in_stock' | 'availability';
  targetPrice?: number;
  targetRetailer?: string;
  targetRegion?: Region;
  duration?: number; // Duration in days for availability alerts
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  notificationMethod: 'email' | 'push' | 'sms';
}

// Product History / Price Tracking
export interface PriceHistory {
  productId: string;
  retailerId: string;
  dataPoints: {
    date: Date;
    price: number;
    availability: ProductAvailability;
  }[];
  lowestPrice: {
    price: number;
    date: Date;
  };
  highestPrice: {
    price: number;
    date: Date;
  };
  averagePrice: number;
  priceChangePercent: number;
}

// AI Search Suggestion
export interface AISearchSuggestion {
  type: 'brand' | 'category' | 'product' | 'attribute';
  value: string;
  confidence: number;
  query: string;
}

// Search Analytics
export interface SearchAnalytics {
  query: string;
  resultsCount: number;
  clickedProductId?: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  filtersApplied: string[];
  sortApplied: SortField;
  timeToClick?: number;
}

// Product Data Source
export interface ProductDataSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'feed' | 'manual';
  retailerId: string;
  config: Record<string, any>;
  lastSync: Date;
  syncStatus: 'active' | 'paused' | 'error';
  productCount: number;
}

// Data Quality Score
export interface DataQualityScore {
  productId: string;
  completeness: number; // 0-100
  accuracy: number;
  freshness: number;
  images: number;
  specifications: number;
  descriptions: number;
  overall: number;
}

// Helper functions
export function getBestPricePoint(product: Product): PricePoint | null {
  if (!product.pricePoints || product.pricePoints.length === 0) return null;
  
  return product.pricePoints
    .filter(pp => pp.availability === 'in_stock')
    .sort((a, b) => a.price - b.price)[0];
}

export function getPriceHistoryStats(history: PriceHistory) {
  const prices = history.dataPoints.map(dp => dp.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return { average: avg, lowest: min, highest: max };
}

export function isProductOnSale(product: Product): boolean {
  return product.pricePoints.some(pp => 
    pp.originalPrice && pp.price < pp.originalPrice
  );
}

export function getDiscountPercentage(pricePoint: PricePoint): number {
  if (!pricePoint.originalPrice || pricePoint.originalPrice <= pricePoint.price) return 0;
  return Math.round(((pricePoint.originalPrice - pricePoint.price) / pricePoint.originalPrice) * 100);
}
