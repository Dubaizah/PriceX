/**
 * PriceX - AI Prediction Component
 * Display price predictions and buy recommendations
 */

'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Target,
  DollarSign,
  Globe,
} from 'lucide-react';
import { AIPricePrediction, BuyRecommendation } from '@/types/ai';
import { useCurrency } from '@/context/CurrencyContext';

interface AIPredictionProps {
  prediction: AIPricePrediction;
}

const recommendationConfig: Record<BuyRecommendation, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  text: string;
}> = {
  buy_now: {
    icon: TrendingUp,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    text: 'Buy Now - Price Increasing',
  },
  wait: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    text: 'Wait - Price Drop Likely',
  },
  best_time: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    text: 'Best Time to Buy',
  },
  price_dropping: {
    icon: TrendingDown,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    text: 'Price Dropping',
  },
  price_rising: {
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    text: 'Price Rising',
  },
  stable: {
    icon: Target,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    text: 'Price Stable',
  },
};

export function AIPredictionCard({ prediction }: AIPredictionProps) {
  const { formatPrice } = useCurrency();
  const config = recommendationConfig[prediction.recommendation];
  const Icon = config.icon;
  
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-[var(--pricex-yellow)]" />
          <h3 className="font-semibold">AI Price Prediction</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Powered by PriceX AI • {prediction.trainingDataPoints.toLocaleString()} data points
        </p>
      </div>
      
      {/* Main Recommendation */}
      <div className="p-4">
        <div className={`flex items-center gap-3 p-3 rounded-lg ${config.bgColor} mb-4`}>
          <Icon className={`w-8 h-8 ${config.color}`} />
          <div>
            <p className={`font-bold text-lg ${config.color}`}>{config.text}</p>
            <p className="text-sm text-muted-foreground">{prediction.buyTiming.reasoning}</p>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">AI Confidence Score</span>
            <span className="text-sm font-bold">{prediction.confidenceScore.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getConfidenceColor(prediction.confidenceScore)}`}
              style={{ width: `${prediction.confidenceScore}%` }}
            />
          </div>
        </div>
        
        {/* Current vs Historical */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-xl font-bold">{formatPrice(prediction.currentPrice)}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Historical Average</p>
            <p className="text-xl font-bold">{formatPrice(prediction.historicalAverage)}</p>
          </div>
        </div>
        
        {/* Percentile Rank */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Price Percentile</span>
            <span className="text-sm font-bold">{prediction.percentileRank.toFixed(0)}th</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Current price is lower than {(100 - prediction.percentileRank).toFixed(0)}% of historical prices
          </p>
        </div>
        
        {/* Predictions */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-sm">Price Forecast</h4>
          {prediction.predictions.slice(0, 3).map((pred) => (
            <div key={pred.timeframe} className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span className="text-sm">
                {pred.timeframe === '24h' && '24 Hours'}
                {pred.timeframe === '7d' && '7 Days'}
                {pred.timeframe === '30d' && '30 Days'}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${pred.priceChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {pred.priceChange > 0 ? '+' : ''}{pred.priceChange.toFixed(1)}%
                </span>
                <span className="text-sm font-bold">{formatPrice(pred.predictedPrice)}</span>
                <span className="text-xs text-muted-foreground">({pred.confidence.toFixed(0)}% conf)</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Best Time to Buy */}
        <div className="p-3 bg-[var(--pricex-yellow)]/10 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[var(--pricex-yellow)]" />
            <span className="font-medium text-sm">Best Time to Buy</span>
          </div>
          <p className="text-sm">
            {prediction.buyTiming.bestTimeToBuy.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded ${
              prediction.buyTiming.urgency === 'high' ? 'bg-red-500 text-white' :
              prediction.buyTiming.urgency === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              {prediction.buyTiming.urgency.toUpperCase()} URGENCY
            </span>
          </div>
        </div>
        
        {/* FX Adjusted Predictions */}
        {prediction.fxAdjustedPredictions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">FX-Adjusted Prices</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {prediction.fxAdjustedPredictions.slice(0, 3).map((fx) => (
                <div key={fx.currency} className="text-center p-2 bg-muted/30 rounded">
                  <p className="text-xs text-muted-foreground">{fx.currency}</p>
                  <p className="font-bold text-sm">{formatPrice(fx.adjustedPrice)}</p>
                  <p className={`text-xs ${
                    fx.rateTrend === 'appreciating' ? 'text-green-500' :
                    fx.rateTrend === 'depreciating' ? 'text-red-500' :
                    'text-muted-foreground'
                  }`}>
                    {fx.rateTrend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Risk Assessment */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Assessment
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span>Stock Risk</span>
              <span className={`font-medium ${
                prediction.riskFactors.stockRisk === 'high' ? 'text-red-500' :
                prediction.riskFactors.stockRisk === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {prediction.riskFactors.stockRisk.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span>Price Volatility</span>
              <span className={`font-medium ${
                prediction.riskFactors.priceVolatility === 'high' ? 'text-red-500' :
                prediction.riskFactors.priceVolatility === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {prediction.riskFactors.priceVolatility.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Model Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Model: {prediction.modelVersion}</span>
            <span>Accuracy: {prediction.predictionAccuracy['7d']}% (7d)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
