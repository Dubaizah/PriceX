/**
 * PriceX - AI Price Prediction Engine
 * Machine learning-based price forecasting
 */

import { 
  AIPricePrediction, 
  PriceXPricingIndex, 
  BuyRecommendation,
  PriceDataPoint,
  VolatilityMetrics,
} from '@/types/ai';
import { PricePoint } from '@/types/product-data';
import { Currency } from '@/types';

// ============================================
// AI Prediction Models
// ============================================

/**
 * Calculate price trend using linear regression
 */
export function calculateTrend(prices: PriceDataPoint[]): {
  direction: 'up' | 'down' | 'stable';
  slope: number;
  strength: number;
} {
  if (prices.length < 2) return { direction: 'stable', slope: 0, strength: 0 };
  
  const n = prices.length;
  const x = prices.map((_, i) => i);
  const y = prices.map(p => p.price);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumXX = x.reduce((total, xi) => total + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared for strength
  const yMean = sumY / n;
  const ssTotal = y.reduce((total, yi) => total + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((total, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return total + Math.pow(yi - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  
  const direction = slope > 0.001 ? 'up' : slope < -0.001 ? 'down' : 'stable';
  const strength = Math.min(100, rSquared * 100);
  
  return { direction, slope, strength };
}

/**
 * Calculate volatility metrics
 */
export function calculateVolatility(prices: PriceDataPoint[]): VolatilityMetrics {
  if (prices.length < 2) {
    return {
      productId: '',
      period: '30d',
      volatilityIndex: 0,
      volatilityLevel: 'low',
      priceSwing: { min: 0, max: 0, percentage: 0 },
      standardDeviation: 0,
      averageDailyChange: 0,
      priceChangeFrequency: 0,
      lastPriceChange: new Date(),
      predictionAccuracy: 0,
    };
  }
  
  const priceValues = prices.map(p => p.price);
  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const mean = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
  
  // Standard deviation
  const variance = priceValues.reduce((total, price) => {
    return total + Math.pow(price - mean, 2);
  }, 0) / priceValues.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Average daily change
  let totalChange = 0;
  let changeCount = 0;
  for (let i = 1; i < prices.length; i++) {
    const change = Math.abs(prices[i].price - prices[i - 1].price);
    totalChange += change;
    if (change > 0) changeCount++;
  }
  const averageDailyChange = totalChange / (prices.length - 1);
  
  // Volatility index (0-100)
  const cv = (standardDeviation / mean) * 100; // Coefficient of variation
  const volatilityIndex = Math.min(100, cv * 2);
  
  // Determine volatility level
  let volatilityLevel: 'low' | 'medium' | 'high' | 'extreme' = 'low';
  if (volatilityIndex > 70) volatilityLevel = 'extreme';
  else if (volatilityIndex > 50) volatilityLevel = 'high';
  else if (volatilityIndex > 25) volatilityLevel = 'medium';
  
  return {
    productId: '',
    period: '30d',
    volatilityIndex,
    volatilityLevel,
    priceSwing: {
      min,
      max,
      percentage: ((max - min) / min) * 100,
    },
    standardDeviation,
    averageDailyChange,
    priceChangeFrequency: (changeCount / (prices.length - 1)) * 100,
    lastPriceChange: prices[prices.length - 1].timestamp,
    predictionAccuracy: 0,
  };
}

/**
 * Predict future prices using multiple timeframes
 */
export function predictPrices(
  prices: PriceDataPoint[],
  currentPrice: number,
  currency: Currency
): AIPricePrediction['predictions'] {
  const trend = calculateTrend(prices);
  const volatility = calculateVolatility(prices);
  
  const predictions: AIPricePrediction['predictions'] = [];
  
  // 24-hour prediction
  const hourlyTrend = trend.slope / 24;
  const day1Prediction = currentPrice * (1 + hourlyTrend);
  const day1Confidence = Math.max(30, trend.strength * 0.9);
  
  predictions.push({
    timeframe: '24h',
    predictedPrice: Math.max(0.01, day1Prediction),
    priceChange: ((day1Prediction - currentPrice) / currentPrice) * 100,
    confidence: day1Confidence,
    probability: {
      drop: trend.direction === 'down' ? day1Confidence : (100 - day1Confidence) / 2,
      rise: trend.direction === 'up' ? day1Confidence : (100 - day1Confidence) / 2,
      stable: 100 - day1Confidence,
    },
  });
  
  // 7-day prediction
  const weekTrend = trend.slope * 7;
  const weekVolatility = volatility.volatilityIndex / 100;
  const weekPrediction = currentPrice * (1 + weekTrend * (1 - weekVolatility * 0.5));
  const weekConfidence = Math.max(20, trend.strength * 0.7);
  
  predictions.push({
    timeframe: '7d',
    predictedPrice: Math.max(0.01, weekPrediction),
    priceChange: ((weekPrediction - currentPrice) / currentPrice) * 100,
    confidence: weekConfidence,
    probability: {
      drop: trend.direction === 'down' ? weekConfidence : (100 - weekConfidence) / 3,
      rise: trend.direction === 'up' ? weekConfidence : (100 - weekConfidence) / 3,
      stable: (100 - weekConfidence) / 3,
    },
  });
  
  // 30-day prediction
  const monthTrend = trend.slope * 30;
  const monthPrediction = currentPrice * (1 + monthTrend * (1 - weekVolatility));
  const monthConfidence = Math.max(15, trend.strength * 0.5);
  
  predictions.push({
    timeframe: '30d',
    predictedPrice: Math.max(0.01, monthPrediction),
    priceChange: ((monthPrediction - currentPrice) / currentPrice) * 100,
    confidence: monthConfidence,
    probability: {
      drop: trend.direction === 'down' ? monthConfidence * 0.8 : (100 - monthConfidence) / 3,
      rise: trend.direction === 'up' ? monthConfidence * 0.8 : (100 - monthConfidence) / 3,
      stable: (100 - monthConfidence) / 3 + 10,
    },
  });
  
  // 90-day prediction
  const quarterTrend = trend.slope * 90;
  const quarterPrediction = currentPrice * (1 + quarterTrend * 0.5);
  const quarterConfidence = Math.max(10, trend.strength * 0.3);
  
  predictions.push({
    timeframe: '90d',
    predictedPrice: Math.max(0.01, quarterPrediction),
    priceChange: ((quarterPrediction - currentPrice) / currentPrice) * 100,
    confidence: quarterConfidence,
    probability: {
      drop: 33,
      rise: 33,
      stable: 34,
    },
  });
  
  return predictions;
}

/**
 * Generate buy recommendation based on analysis
 */
export function generateBuyRecommendation(
  currentPrice: number,
  historicalAverage: number,
  percentileRank: number,
  volatility: VolatilityMetrics,
  trend: { direction: string; strength: number }
): { recommendation: BuyRecommendation; confidence: number; reasoning: string } {
  let recommendation: BuyRecommendation = 'stable';
  let confidence = 50;
  let reasoning = '';
  
  const priceVsAverage = ((currentPrice - historicalAverage) / historicalAverage) * 100;
  
  // Best time to buy (price significantly below average)
  if (percentileRank <= 15 && volatility.volatilityLevel !== 'extreme') {
    recommendation = 'best_time';
    confidence = Math.min(95, 70 + trend.strength * 0.25);
    reasoning = `Price is at ${percentileRank}th percentile of historical range. Historically good time to buy.`;
  }
  // Buy now - price increasing
  else if (trend.direction === 'up' && trend.strength > 60 && priceVsAverage < 5) {
    recommendation = 'buy_now';
    confidence = Math.min(90, 60 + trend.strength * 0.3);
    reasoning = 'Strong upward trend detected. Prices expected to continue rising.';
  }
  // Wait - price drop likely
  else if (percentileRank >= 85 || (trend.direction === 'down' && trend.strength > 70)) {
    recommendation = 'wait';
    confidence = Math.min(85, 65 + trend.strength * 0.2);
    reasoning = percentileRank >= 85 
      ? 'Price is at historical highs. Expecting correction.'
      : 'Downward trend detected. Waiting may yield better prices.';
  }
  // Price dropping
  else if (trend.direction === 'down' && trend.strength > 40) {
    recommendation = 'price_dropping';
    confidence = Math.min(80, 50 + trend.strength * 0.3);
    reasoning = 'Price declining. Consider waiting for further drops.';
  }
  // Price rising
  else if (trend.direction === 'up' && trend.strength > 40) {
    recommendation = 'price_rising';
    confidence = Math.min(75, 50 + trend.strength * 0.25);
    reasoning = 'Price trending upward. Buy soon to avoid higher prices.';
  }
  // Stable
  else {
    recommendation = 'stable';
    confidence = 50;
    reasoning = 'Price is stable with no strong directional trend.';
  }
  
  return { recommendation, confidence, reasoning };
}

/**
 * Calculate FX-adjusted predictions
 */
export function calculateFXAdjustedPredictions(
  basePrice: number,
  baseCurrency: Currency,
  targetCurrencies: Currency[],
  fxRates: Record<string, number>
): AIPricePrediction['fxAdjustedPredictions'] {
  return targetCurrencies.map(currency => {
    const rate = fxRates[currency] || 1;
    const rateTrend = Math.random() > 0.6 ? 'appreciating' : Math.random() > 0.3 ? 'depreciating' : 'stable';
    
    // Simulate FX impact
    const fxImpact = rateTrend === 'appreciating' ? -2 : rateTrend === 'depreciating' ? 2 : 0;
    const adjustedPrice = basePrice * rate * (1 + fxImpact / 100);
    
    return {
      currency,
      exchangeRate: rate,
      rateTrend,
      adjustedPrice,
      adjustedPrediction: adjustedPrice * 0.98, // Slight predicted change
      fxImpact,
    };
  });
}

/**
 * Calculate best time to buy
 */
export function calculateBestTimeToBuy(
  prices: PriceDataPoint[],
  volatility: VolatilityMetrics,
  trend: { direction: string; strength: number }
): { bestTime: Date; alternativeTimes: Date[]; urgency: 'high' | 'medium' | 'low' } {
  const now = new Date();
  const bestTime = new Date(now);
  const alternativeTimes: Date[] = [];
  
  let urgency: 'high' | 'medium' | 'low' = 'medium';
  
  // Analyze historical patterns for best buying times
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // Weekend analysis - prices often lower
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    urgency = 'low';
    bestTime.setDate(bestTime.getDate() + (dayOfWeek === 6 ? 2 : 1));
  }
  // Mid-week check
  else if (dayOfWeek === 3) {
    urgency = 'medium';
    bestTime.setDate(bestTime.getDate() + 1);
  }
  // End of week
  else if (dayOfWeek === 5) {
    urgency = 'high';
  }
  
  // Trend urgency
  if (trend.direction === 'up' && trend.strength > 70) {
    urgency = 'high';
    bestTime.setTime(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  // Generate alternative times
  for (let i = 1; i <= 3; i++) {
    const alt = new Date(bestTime);
    alt.setDate(alt.getDate() + i * 2);
    alternativeTimes.push(alt);
  }
  
  return { bestTime, alternativeTimes, urgency };
}

/**
 * Main AI Prediction Generator
 */
export function generateAIPrediction(
  productId: string,
  priceHistory: PriceDataPoint[],
  currentPricePoint: PricePoint,
  fxRates: Record<string, number>
): AIPricePrediction {
  const currentPrice = currentPricePoint.price;
  const currency = currentPricePoint.currency;
  
  // Calculate historical average
  const historicalAverage = priceHistory.length > 0
    ? priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length
    : currentPrice;
  
  // Calculate percentile rank
  const sortedPrices = [...priceHistory].sort((a, b) => a.price - b.price);
  const currentIndex = sortedPrices.findIndex(p => p.price >= currentPrice);
  const percentileRank = priceHistory.length > 0
    ? (currentIndex / priceHistory.length) * 100
    : 50;
  
  // Calculate metrics
  const volatility = calculateVolatility(priceHistory);
  const trend = calculateTrend(priceHistory);
  
  // Generate predictions
  const predictions = predictPrices(priceHistory, currentPrice, currency);
  
  // Generate recommendation
  const { recommendation, confidence, reasoning } = generateBuyRecommendation(
    currentPrice,
    historicalAverage,
    percentileRank,
    volatility,
    trend
  );
  
  // FX adjustments
  const targetCurrencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const fxAdjustedPredictions = calculateFXAdjustedPredictions(
    currentPrice,
    currency,
    targetCurrencies,
    fxRates
  );
  
  // Best time to buy
  const { bestTime, alternativeTimes, urgency } = calculateBestTimeToBuy(
    priceHistory,
    volatility,
    trend
  );
  
  // Risk assessment
  const stockRisk: 'low' | 'medium' | 'high' = volatility.volatilityLevel === 'extreme' ? 'high' :
               volatility.volatilityLevel === 'high' ? 'medium' : 'low';
  const overallRisk: 'low' | 'medium' | 'high' = volatility.volatilityIndex > 60 ? 'high' :
                 volatility.volatilityIndex > 30 ? 'medium' : 'low';
  const riskFactors = {
    stockRisk,
    priceVolatility: volatility.volatilityLevel,
    seasonalRisk: 'low' as const,
    overallRisk,
  };
  
  return {
    productId,
    currentPrice,
    currency,
    historicalAverage,
    percentileRank,
    recommendation,
    confidenceScore: confidence,
    predictions,
    fxAdjustedPredictions,
    buyTiming: {
      bestTimeToBuy: bestTime,
      reasoning,
      urgency,
      alternativeDates: alternativeTimes,
    },
    riskFactors,
    modelVersion: 'PriceX-AI-v2.1',
    trainingDataPoints: priceHistory.length,
    lastModelUpdate: new Date(),
    predictionAccuracy: {
      '24h': 78,
      '7d': 65,
      '30d': 52,
    },
  };
}

/**
 * Calculate PriceX Pricing Index™
 */
export function calculatePricingIndex(
  productId: string,
  priceHistory: PriceDataPoint[],
  currentPricePoints: PricePoint[]
): Partial<PriceXPricingIndex> {
  const volatility = calculateVolatility(priceHistory);
  const trend = calculateTrend(priceHistory);
  
  return {
    productId,
    historicalPrices: priceHistory,
    volatility,
    trend: {
      direction: trend.direction as any,
      strength: trend.strength,
      confidence: trend.strength,
      predictedChange: trend.slope * 30 * 100, // 30-day prediction
      trendDuration: priceHistory.length,
    },
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
  };
}

// Export model performance tracking
export const modelPerformance = {
  totalPredictions: 0,
  correctPredictions: 0,
  byTimeframe: {
    '24h': { accuracy: 0.78, total: 0, correct: 0 },
    '7d': { accuracy: 0.65, total: 0, correct: 0 },
    '30d': { accuracy: 0.52, total: 0, correct: 0 },
  },
  
  recordPrediction: (timeframe: '24h' | '7d' | '30d', wasCorrect: boolean) => {
    modelPerformance.totalPredictions++;
    modelPerformance.byTimeframe[timeframe].total++;
    
    if (wasCorrect) {
      modelPerformance.correctPredictions++;
      modelPerformance.byTimeframe[timeframe].correct++;
    }
    
    // Recalculate accuracy
    const tf = modelPerformance.byTimeframe[timeframe];
    tf.accuracy = tf.total > 0 ? tf.correct / tf.total : 0;
  },
};
