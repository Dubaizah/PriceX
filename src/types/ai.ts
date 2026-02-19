/**
 * PriceX - AI & Automation Intelligence Types
 * PriceX Pricing Index™, Predictions, and Automation Pipeline
 */

import { Product, PricePoint, PriceHistory } from './product-data';
import { User } from './auth';
import { Currency, Region } from './index';
import { CategoryId } from './product';

// ============================================
// 1. PRICEX PRICING INDEX™ (B2B Moat)
// ============================================

export type PriceVolatilityLevel = 'low' | 'medium' | 'high' | 'extreme';
export type TrendDirection = 'up' | 'down' | 'stable' | 'volatile';
export type SeasonalityType = 'holiday' | 'black_friday' | 'back_to_school' | 'summer_sale' | 'clearance' | 'none';

// Historical Price Data Point
export interface PriceDataPoint {
  timestamp: Date;
  price: number;
  currency: Currency;
  retailerId: string;
  availability: string;
  metadata?: {
    promotionType?: string;
    couponCode?: string;
    freeShipping?: boolean;
    bundleOffer?: boolean;
  };
}

// Price Volatility Analysis
export interface VolatilityMetrics {
  productId: string;
  period: '7d' | '30d' | '90d' | '1y';
  volatilityIndex: number; // 0-100
  volatilityLevel: PriceVolatilityLevel;
  priceSwing: {
    min: number;
    max: number;
    percentage: number;
  };
  standardDeviation: number;
  averageDailyChange: number;
  priceChangeFrequency: number; // How often price changes
  lastPriceChange: Date;
  predictionAccuracy: number; // How accurate past predictions were
}

// Regional Price Variance
export interface RegionalVariance {
  productId: string;
  basePrice: number;
  baseCurrency: Currency;
  regions: {
    region: Region;
    averagePrice: number;
    priceDifference: number; // % difference from base
    cheapestRetailer: string;
    priceIndex: number; // 100 = baseline
    fxAdjustedPrice: number;
    purchasingPowerAdjusted: number;
    lastUpdated: Date;
  }[];
  arbitrageOpportunities: {
    from: Region;
    to: Region;
    potentialSavings: number;
    shippingCost: number;
    netSavings: number;
  }[];
}

// Store Behavior Profile
export interface StoreBehaviorProfile {
  retailerId: string;
  retailerName: string;
  pricingStrategy: 'aggressive' | 'premium' | 'dynamic' | 'static' | 'promotional';
  discountPatterns: {
    frequency: number; // discounts per month
    averageDiscount: number; // %
    typicalDiscountDays: number[]; // Day of month (1-31)
    seasonalPatterns: SeasonalityType[];
  };
  priceMatching: boolean;
  priceChangeFrequency: number; // changes per week
  lowestPriceGuarantee: boolean;
  priceHistory: {
    date: Date;
    avgDiscount: number;
    totalProducts: number;
    priceChanges: number;
  }[];
  reliability: {
    stockAccuracy: number; // %
    priceAccuracy: number; // %
    deliveryPerformance: number; // %
  };
}

// PriceX Pricing Index™ - Main B2B Data Structure
export interface PriceXPricingIndex {
  productId: string;
  product: Product;
  
  // Historical Data
  historicalPrices: PriceDataPoint[];
  priceHistory: PriceHistory;
  
  // Volatility & Trends
  volatility: VolatilityMetrics;
  trend: {
    direction: TrendDirection;
    strength: number; // 0-100
    confidence: number; // 0-100
    predictedChange: number; // %
    trendDuration: number; // days
  };
  
  // Regional Analysis
  regionalVariance: RegionalVariance;
  
  // Store Intelligence
  storeBehaviors: StoreBehaviorProfile[];
  bestRetailer: string;
  
  // Market Intelligence
  marketPosition: {
    percentile: number; // Price position vs competitors (0-100)
    priceTiers: {
      budget: number;
      midRange: number;
      premium: number;
    };
  };
  
  // Seasonality
  seasonality: {
    pattern: SeasonalityType;
    nextSaleDate?: Date;
    expectedDiscount: number;
    historicalLowDate?: Date;
    historicalLowPrice: number;
  };
  
  // B2B Metadata
  dataQuality: {
    freshness: number; // hours since last update
    coverage: number; // % of retailers tracked
    accuracy: number; // %
  };
  
  lastUpdated: Date;
  nextUpdate: Date;
}

// ============================================
// 2. AI PREDICTION FEATURES
// ============================================

export type BuyRecommendation = 'buy_now' | 'wait' | 'best_time' | 'price_dropping' | 'price_rising' | 'stable';

export interface AIPricePrediction {
  productId: string;
  
  // Current Analysis
  currentPrice: number;
  currency: Currency;
  historicalAverage: number;
  percentileRank: number; // How current price compares to history (0-100)
  
  // Recommendation
  recommendation: BuyRecommendation;
  confidenceScore: number; // 0-100
  
  // Prediction Details
  predictions: {
    timeframe: '24h' | '7d' | '30d' | '90d';
    predictedPrice: number;
    priceChange: number; // %
    confidence: number;
    probability: {
      drop: number;
      rise: number;
      stable: number;
    };
  }[];
  
  // FX-Adjusted Predictions
  fxAdjustedPredictions: {
    currency: Currency;
    exchangeRate: number;
    rateTrend: 'appreciating' | 'depreciating' | 'stable';
    adjustedPrice: number;
    adjustedPrediction: number;
    fxImpact: number; // % impact on price
  }[];
  
  // Buy Timing Intelligence
  buyTiming: {
    bestTimeToBuy: Date;
    reasoning: string;
    urgency: 'high' | 'medium' | 'low';
    alternativeDates: Date[];
  };
  
  // Risk Assessment
  riskFactors: {
    stockRisk: 'high' | 'medium' | 'low';
    priceVolatility: PriceVolatilityLevel;
    seasonalRisk: 'high' | 'medium' | 'low';
    overallRisk: 'high' | 'medium' | 'low';
  };
  
  // Model Metadata
  modelVersion: string;
  trainingDataPoints: number;
  lastModelUpdate: Date;
  predictionAccuracy: {
    '24h': number;
    '7d': number;
    '30d': number;
  };
}

// AI Model Performance
export interface AIModelPerformance {
  modelId: string;
  version: string;
  predictions: {
    total: number;
    correct: number;
    accuracy: number;
  };
  byCategory: Record<CategoryId, {
    predictions: number;
    accuracy: number;
  }>;
  byTimeframe: {
    '24h': { accuracy: number; mae: number }; // Mean Absolute Error
    '7d': { accuracy: number; mae: number };
    '30d': { accuracy: number; mae: number };
  };
  lastTraining: Date;
  trainingDuration: number; // minutes
}

// ============================================
// 3. AUTOMATION PIPELINE
// ============================================

// Crawler Job Status
export interface CrawlerJob {
  id: string;
  retailerId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  priority: number; // 1-10
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  productsToCrawl: number;
  productsCrawled: number;
  successRate: number;
  errors: {
    type: string;
    message: string;
    count: number;
    lastOccurrence: Date;
  }[];
  performance: {
    avgResponseTime: number;
    rateLimitHits: number;
    captchaEncounters: number;
  };
}

// SEO-Generated Page
export interface SEOGeneratedPage {
  id: string;
  type: 'category' | 'brand' | 'product' | 'comparison' | 'deal';
  url: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  content: {
    heading: string;
    body: string;
    faq: { question: string; answer: string }[];
    relatedProducts: string[];
  };
  schemaMarkup: Record<string, any>; // JSON-LD
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    performance: number; // Overall score
  };
  ranking: {
    targetKeywords: string[];
    difficulty: number; // 0-100
    searchVolume: number;
    competition: 'low' | 'medium' | 'high';
  };
  generatedAt: Date;
  lastOptimized: Date;
  traffic: {
    organic: number;
    direct: number;
    referral: number;
  };
}

// Ad Placement Optimization
export interface AdPlacement {
  id: string;
  pageType: 'home' | 'category' | 'product' | 'search' | 'comparison';
  placement: string;
  adUnit: string;
  rpm: number; // Revenue Per Mille
    ctr: number; // Click-Through Rate
  viewability: number; // %
  optimization: {
    autoOptimized: boolean;
    lastOptimization: Date;
    optimizationReason: string;
    suggestedChanges: {
      type: string;
      currentValue: any;
      suggestedValue: any;
      expectedImprovement: number;
    }[];
  };
}

// Automated Social Content
export interface AutomatedSocialContent {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  contentType: 'deal_alert' | 'price_drop' | 'trending' | 'comparison' | 'tip';
  content: {
    text: string;
    hashtags: string[];
    media?: string[];
    link?: string;
  };
  trendingScore: number; // 0-100
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  scheduledAt: Date;
  postedAt?: Date;
  performance: {
    reach: number;
    engagement: number;
    conversionRate: number;
  };
}

// ============================================
// 4. USER ENGAGEMENT AI
// ============================================

export type NotificationType = 
  | 'price_drop' 
  | 'back_in_stock' 
  | 'deal_expiring' 
  | 'price_prediction' 
  | 'trending_product'
  | 'personalized_recommendation'
  | 'loyalty_reward'
  | 'referral_bonus';

export interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  image?: string;
  data: {
    productId?: string;
    url?: string;
    action?: string;
    metadata?: Record<string, any>;
  };
  priority: 'high' | 'normal' | 'low';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  engagement: {
    delivered: boolean;
    opened: boolean;
    clicked: boolean;
    converted: boolean;
  };
}

// Loyalty Program
export interface LoyaltyProgram {
  userId: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  lifetimePoints: number;
  
  tierBenefits: {
    cashbackRate: number; // %
    earlyAccess: boolean;
    exclusiveDeals: boolean;
    freeShipping: boolean;
    dedicatedSupport: boolean;
  };
  
  history: {
    action: string;
    points: number;
    timestamp: Date;
  }[];
  
  nextTier: {
    name: string;
    pointsNeeded: number;
    progress: number; // %
  };
}

// Referral System
export interface ReferralSystem {
  userId: string;
  referralCode: string;
  referralLink: string;
  
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    totalRewards: number;
  };
  
  referrals: {
    referredUserId: string;
    status: 'pending' | 'successful' | 'expired';
    signupDate: Date;
    firstPurchaseDate?: Date;
    rewardAmount: number;
    rewardStatus: 'pending' | 'paid';
  }[];
  
  rewards: {
    type: 'cash' | 'points' | 'discount';
    amount: number;
    currency?: Currency;
    expiryDate?: Date;
  }[];
}

// Review & Rating System
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
    loyaltyTier: string;
  };
  
  rating: number; // 1-5
  title: string;
  content: string;
  
  // Detailed Ratings
  detailedRatings: {
    value: number;
    quality: number;
    features: number;
    performance: number;
  };
  
  // Review Metadata
  helpful: number;
  notHelpful: number;
  verifiedPurchase: boolean;
  purchaseDate?: Date;
  retailer?: string;
  
  // Media
  images?: string[];
  videos?: string[];
  
  // AI Analysis
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number; // -1 to 1
    aspects: {
      aspect: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      mentions: number;
    }[];
  };
  
  // Engagement
  replies: {
    userId: string;
    userType: 'user' | 'brand' | 'admin';
    content: string;
    timestamp: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

// Review Summary (AI-Generated)
export interface ReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>; // 1-5 stars count
  
  aiSummary: {
    pros: string[];
    cons: string[];
    verdict: string;
    bestFor: string[];
  };
  
  commonThemes: {
    theme: string;
    sentiment: 'positive' | 'negative';
    frequency: number;
    examples: string[];
  }[];
  
  updatedAt: Date;
}

// ============================================
// B2B API Types
// ============================================

export interface B2BApiRequest {
  apiKey: string;
  endpoint: 'pricing_index' | 'predictions' | 'trends' | 'volatility' | 'regional';
  params: {
    productIds?: string[];
    categoryId?: CategoryId;
    region?: Region;
    timeframe?: string;
    includeHistory?: boolean;
  };
}

export interface B2BApiResponse {
  success: boolean;
  data: any;
  rateLimit: {
    limit: number;
    remaining: number;
    resetAt: Date;
  };
  creditsUsed: number;
}

export interface B2BSubscription {
  id: string;
  companyName: string;
  plan: 'starter' | 'growth' | 'enterprise';
  apiKey: string;
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  endpoints: string[];
  allowedRegions: Region[];
  webhookUrl?: string;
  createdAt: Date;
  expiresAt: Date;
}

// Helper functions
export function calculateVolatilityLevel(index: number): PriceVolatilityLevel {
  if (index < 20) return 'low';
  if (index < 50) return 'medium';
  if (index < 80) return 'high';
  return 'extreme';
}

export function getBuyRecommendationText(recommendation: BuyRecommendation): string {
  const texts: Record<BuyRecommendation, string> = {
    buy_now: 'Buy Now - Price Increasing',
    wait: 'Wait - Price Drop Likely',
    best_time: 'Best Time to Buy',
    price_dropping: 'Price Dropping',
    price_rising: 'Price Rising',
    stable: 'Price Stable',
  };
  return texts[recommendation];
}

export function calculateConfidenceColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
}
