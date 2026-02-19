/**
 * PriceX Mobile App - TypeScript Types
 * Feature parity with web platform
 */

// Core Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  prices: RetailerPrice[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface RetailerPrice {
  retailerId: string;
  retailerName: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  shippingCost: number;
  lastUpdated: string;
}

export interface SearchFilters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  retailers: string[];
  inStockOnly: boolean;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  savedProducts: string[];
  priceAlerts: PriceAlert[];
  referralCode: string;
}

export interface UserPreferences {
  region: string;
  language: string;
  currency: string;
  notifications: NotificationSettings;
  darkMode: 'system' | 'light' | 'dark';
  biometricAuth: boolean;
}

export interface NotificationSettings {
  priceDrops: boolean;
  backInStock: boolean;
  deals: boolean;
  recommendations: boolean;
  appUpdates: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Product: { productId: string };
  Compare: { productIds: string[] };
  Search: { query?: string; filters?: SearchFilters };
  Settings: undefined;
  Profile: undefined;
  PriceAlerts: undefined;
  SavedProducts: undefined;
  Loyalty: undefined;
  Referral: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Compare: undefined;
  Deals: undefined;
  Account: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SearchResult {
  products: Product[];
  suggestions: string[];
  filters: SearchFilters;
  total: number;
}

// AI Types
export interface PricePrediction {
  productId: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'rising' | 'falling' | 'stable';
  recommendation: 'buy_now' | 'wait' | 'best_time';
  bestTimeToBuy: string;
  reasoning: string;
}

export interface MarketTrend {
  category: string;
  trend: number; // percentage change
  volume: number;
  topProducts: Product[];
}

// Offline Types
export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface SyncQueueItem {
  id: string;
  action: 'save' | 'alert' | 'compare' | 'share';
  payload: unknown;
  retryCount: number;
  createdAt: string;
}
