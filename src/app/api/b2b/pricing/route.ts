/**
 * PriceX - B2B API for Pricing Data Monetization
 * Enterprise access to PriceX Pricing Index™
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  B2BApiRequest, 
  B2BApiResponse, 
  B2BSubscription,
  PriceXPricingIndex,
  AIPricePrediction,
} from '@/types/ai';
import { generateAIPrediction, calculatePricingIndex } from '@/lib/ai/prediction';
import { getCategoryById } from '@/types/product';

// Mock B2B subscriptions database
const b2bSubscriptions: Map<string, B2BSubscription> = new Map([
  ['api_key_demo', {
    id: 'sub_demo',
    companyName: 'Demo Company',
    plan: 'starter',
    apiKey: 'api_key_demo',
    credits: { total: 1000, used: 0, remaining: 1000 },
    endpoints: ['pricing_index', 'predictions', 'trends'],
    allowedRegions: ['north-america', 'europe'],
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }],
]);

// Rate limiting per API key
const rateLimits: Map<string, { count: number; resetAt: Date }> = new Map();

const RATE_LIMIT = 100; // requests per minute
const CREDIT_COSTS: Record<string, number> = {
  pricing_index: 1,
  predictions: 2,
  trends: 1,
  volatility: 1,
  regional: 2,
};

/**
 * Authenticate API request
 */
function authenticateRequest(apiKey: string): B2BSubscription | null {
  const subscription = b2bSubscriptions.get(apiKey);
  
  if (!subscription) return null;
  if (new Date() > subscription.expiresAt) return null;
  if (subscription.credits.remaining <= 0) return null;
  
  return subscription;
}

/**
 * Check rate limit
 */
function checkRateLimit(apiKey: string): { allowed: boolean; remaining: number; resetAt: Date } {
  const now = new Date();
  const limit = rateLimits.get(apiKey);
  
  if (!limit || now > limit.resetAt) {
    // Reset rate limit
    const resetAt = new Date(now.getTime() + 60 * 1000);
    rateLimits.set(apiKey, { count: 0, resetAt });
    return { allowed: true, remaining: RATE_LIMIT, resetAt };
  }
  
  if (limit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: limit.resetAt };
  }
  
  return { allowed: true, remaining: RATE_LIMIT - limit.count, resetAt: limit.resetAt };
}

/**
 * Increment rate limit counter
 */
function incrementRateLimit(apiKey: string): void {
  const limit = rateLimits.get(apiKey);
  if (limit) {
    limit.count++;
  }
}

/**
 * Deduct credits
 */
function deductCredits(apiKey: string, endpoint: string): boolean {
  const subscription = b2bSubscriptions.get(apiKey);
  if (!subscription) return false;
  
  const cost = CREDIT_COSTS[endpoint] || 1;
  if (subscription.credits.remaining < cost) return false;
  
  subscription.credits.used += cost;
  subscription.credits.remaining -= cost;
  return true;
}

/**
 * Mock pricing data generator for B2B API
 */
function generateMockPricingData(productIds: string[]): Partial<PriceXPricingIndex>[] {
  return productIds.map(productId => ({
    productId,
    historicalPrices: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      price: 100 + Math.random() * 50,
      currency: 'USD' as const,
      retailerId: 'retailer_1',
      availability: 'in_stock',
    })),
    trend: {
      direction: Math.random() > 0.5 ? 'up' : 'down',
      strength: Math.random() * 100,
      confidence: 70 + Math.random() * 20,
      predictedChange: (Math.random() - 0.5) * 20,
      trendDuration: 30,
    },
    volatility: {
      productId,
      period: '30d',
      volatilityIndex: Math.random() * 100,
      volatilityLevel: 'medium',
      priceSwing: {
        min: 80,
        max: 150,
        percentage: 87.5,
      },
      standardDeviation: 15,
      averageDailyChange: 2.5,
      priceChangeFrequency: 3,
      lastPriceChange: new Date(),
      predictionAccuracy: 75,
    },
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000),
  }));
}

/**
 * GET /api/b2b/pricing
 * Retrieve pricing index data
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get API key from header or query param
  const apiKey = request.headers.get('x-api-key') || searchParams.get('api_key') || '';
  const endpoint = searchParams.get('endpoint') || 'pricing_index';
  const productIds = searchParams.get('product_ids')?.split(',') || [];
  
  // Authenticate
  const subscription = authenticateRequest(apiKey);
  if (!subscription) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid or expired API key',
        data: null,
        rateLimit: { limit: 0, remaining: 0, resetAt: new Date() },
        creditsUsed: 0,
      },
      { status: 401 }
    );
  }
  
  // Check rate limit
  const rateLimit = checkRateLimit(apiKey);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Rate limit exceeded',
        data: null,
        rateLimit: {
          limit: RATE_LIMIT,
          remaining: 0,
          resetAt: rateLimit.resetAt,
        },
        creditsUsed: 0,
      },
      { status: 429 }
    );
  }
  
  // Check endpoint access
  if (!subscription.endpoints.includes(endpoint)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Endpoint not included in your plan',
        data: null,
        rateLimit: {
          limit: RATE_LIMIT,
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        creditsUsed: 0,
      },
      { status: 403 }
    );
  }
  
  // Deduct credits
  if (!deductCredits(apiKey, endpoint)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Insufficient credits',
        data: null,
        rateLimit: {
          limit: RATE_LIMIT,
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        creditsUsed: 0,
      },
      { status: 402 }
    );
  }
  
  // Increment rate limit
  incrementRateLimit(apiKey);
  
  // Generate response data based on endpoint
  let data: any;
  
  switch (endpoint) {
    case 'pricing_index':
      data = generateMockPricingData(productIds);
      break;
      
    case 'predictions':
      data = productIds.map(productId => ({
        productId,
        recommendation: Math.random() > 0.5 ? 'buy_now' : 'wait',
        confidenceScore: 60 + Math.random() * 30,
        predictedPrice: 100 + Math.random() * 50,
        priceChange: (Math.random() - 0.5) * 20,
      }));
      break;
      
    case 'trends':
      data = {
        category: searchParams.get('category_id'),
        trendDirection: Math.random() > 0.5 ? 'up' : 'down',
        averageChange: (Math.random() - 0.5) * 10,
        topMovers: productIds.slice(0, 5).map(id => ({
          productId: id,
          change: (Math.random() - 0.5) * 30,
        })),
      };
      break;
      
    case 'volatility':
      data = productIds.map(productId => ({
        productId,
        volatilityIndex: Math.random() * 100,
        volatilityLevel: 'medium',
        riskScore: Math.random() * 100,
      }));
      break;
      
    case 'regional':
      data = subscription.allowedRegions.map(region => ({
        region,
        priceIndex: 100 + (Math.random() - 0.5) * 20,
        averagePrice: 100 + Math.random() * 50,
        currency: 'USD',
      }));
      break;
      
    default:
      data = { message: 'Unknown endpoint' };
  }
  
  const response: B2BApiResponse = {
    success: true,
    data,
    rateLimit: {
      limit: RATE_LIMIT,
      remaining: rateLimit.remaining - 1,
      resetAt: rateLimit.resetAt,
    },
    creditsUsed: CREDIT_COSTS[endpoint] || 1,
  };
  
  return NextResponse.json(response);
}

/**
 * POST /api/b2b/pricing
 * Batch request for pricing data
 */
export async function POST(request: NextRequest) {
  try {
    const body: B2BApiRequest = await request.json();
    const { apiKey, endpoint, params } = body;
    
    // Authenticate
    const subscription = authenticateRequest(apiKey);
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Check credits
    const cost = CREDIT_COSTS[endpoint] || 1;
    const totalCost = cost * (params.productIds?.length || 1);
    
    if (subscription.credits.remaining < totalCost) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits' },
        { status: 402 }
      );
    }
    
    // Process request
    const data = generateMockPricingData(params.productIds || []);
    
    // Deduct credits
    subscription.credits.used += totalCost;
    subscription.credits.remaining -= totalCost;
    
    return NextResponse.json({
      success: true,
      data,
      creditsUsed: totalCost,
      remainingCredits: subscription.credits.remaining,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

/**
 * GET /api/b2b/subscription
 * Check subscription status
 */
export async function checkSubscription(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || '';
  const subscription = b2bSubscriptions.get(apiKey);
  
  if (!subscription) {
    return NextResponse.json(
      { success: false, error: 'Invalid API key' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    success: true,
    subscription: {
      plan: subscription.plan,
      credits: subscription.credits,
      endpoints: subscription.endpoints,
      allowedRegions: subscription.allowedRegions,
      expiresAt: subscription.expiresAt,
    },
  });
}
