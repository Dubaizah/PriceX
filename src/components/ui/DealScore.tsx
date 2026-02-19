/**
 * PriceX - Deal Score Component
 * AI-powered deal quality scoring
 */

'use client';

import { useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  Shield,
  Gift,
  Zap,
  Info,
} from 'lucide-react';

interface DealScoreProps {
  productName: string;
  originalPrice: number;
  salePrice: number;
  retailerRating: number;
  reviewCount: number;
  shippingCost: number;
  returnPolicy: 'free' | 'limited' | 'none';
  warranty?: number; // months
  popularity: number; // 0-100
  priceVolatility: 'low' | 'medium' | 'high';
}

export function DealScore({
  productName,
  originalPrice,
  salePrice,
  retailerRating,
  reviewCount,
  shippingCost,
  returnPolicy,
  warranty = 0,
  popularity,
  priceVolatility,
}: DealScoreProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate deal score (0-100)
  const discountPercent = ((originalPrice - salePrice) / originalPrice) * 100;
  
  // Weighted scoring algorithm
  const discountScore = Math.min(discountPercent * 3, 30); // 30 points max
  const ratingScore = (retailerRating / 5) * 25; // 25 points max
  const shippingScore = shippingCost === 0 ? 15 : Math.max(0, 15 - shippingCost); // 15 points max
  const returnScore = returnPolicy === 'free' ? 10 : returnPolicy === 'limited' ? 5 : 0; // 10 points max
  const warrantyScore = warranty >= 24 ? 10 : warranty >= 12 ? 7 : warranty >= 6 ? 4 : 0; // 10 points max
  const popularityScore = popularity / 10; // 10 points max
  
  const totalScore = Math.round(
    discountScore + ratingScore + shippingScore + returnScore + warrantyScore + popularityScore
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-[var(--pricex-yellow)]';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Deal';
    if (score >= 60) return 'Good Deal';
    if (score >= 40) return 'Fair Deal';
    return 'Poor Deal';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Deal Score Header */}
      <div className="p-6 bg-gradient-to-r from-[var(--pricex-yellow)]/10 to-transparent border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Deal Score</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </span>
              <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                /100
              </span>
            </div>
            <p className={`font-semibold mt-1 ${getScoreColor(totalScore)}`}>
              {getScoreLabel(totalScore)}
            </p>
          </div>
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(totalScore).replace('text-', 'bg-')}/20`}>
            <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
              {getScoreGrade(totalScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-6 space-y-4">
        <h4 className="font-semibold mb-4">Score Breakdown</h4>
        
        <ScoreBar 
          label="Discount" 
          score={discountScore} 
          max={30} 
          icon={<Gift className="w-4 h-4" />}
          details={`${discountPercent.toFixed(0)}% off ($${(originalPrice - salePrice).toFixed(2)} savings)`}
        />
        
        <ScoreBar 
          label="Retailer Trust" 
          score={ratingScore} 
          max={25} 
          icon={<Shield className="w-4 h-4" />}
          details={`${retailerRating.toFixed(1)}/5 stars (${reviewCount.toLocaleString()} reviews)`}
        />
        
        <ScoreBar 
          label="Shipping" 
          score={shippingScore} 
          max={15} 
          icon={<Zap className="w-4 h-4" />}
          details={shippingCost === 0 ? 'Free shipping' : `$${shippingCost.toFixed(2)} shipping`}
        />
        
        <ScoreBar 
          label="Returns" 
          score={returnScore} 
          max={10} 
          icon={<Clock className="w-4 h-4" />}
          details={returnPolicy === 'free' ? 'Free returns (30 days)' : returnPolicy === 'limited' ? 'Limited return policy' : 'No returns'}
        />
        
        <ScoreBar 
          label="Warranty" 
          score={warrantyScore} 
          max={10} 
          icon={<Star className="w-4 h-4" />}
          details={warranty > 0 ? `${warranty} month warranty` : 'No warranty'}
        />
        
        <ScoreBar 
          label="Popularity" 
          score={popularityScore} 
          max={10} 
          icon={<TrendingUp className="w-4 h-4" />}
          details={`${popularity}% popularity score`}
        />
      </div>

      {/* Price Volatility */}
      <div className="px-6 pb-6">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Info className="w-4 h-4" />
          Price volatility: {priceVolatility}
        </button>
        
        {showDetails && (
          <div className="mt-4 p-4 rounded-xl bg-secondary/50 text-sm">
            <p className="mb-2">
              <strong>Price Volatility:</strong> {priceVolatility.charAt(0).toUpperCase() + priceVolatility.slice(1)}
            </p>
            {priceVolatility === 'low' && (
              <p className="text-green-500">Prices are stable. Safe to buy now!</p>
            )}
            {priceVolatility === 'medium' && (
              <p className="text-[var(--pricex-yellow)]">Prices fluctuate moderately. Consider setting a price alert.</p>
            )}
            {priceVolatility === 'high' && (
              <p className="text-orange-500">Prices are volatile. Wait for a better deal.</p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        <button className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors">
          Get This Deal
        </button>
      </div>
    </div>
  );
}

function ScoreBar({ 
  label, 
  score, 
  max, 
  icon, 
  details 
}: { 
  label: string; 
  score: number; 
  max: number; 
  icon: React.ReactNode;
  details: string;
}) {
  const percentage = (score / max) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold">{score}/{max}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--pricex-yellow)] rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{details}</p>
    </div>
  );
}
