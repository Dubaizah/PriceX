/**
 * PriceX - Comparison & Ranking Engine
 * Calculates total landed cost and ranks sellers for best deals
 */

import {
  UnifiedProduct,
  SellerOffer,
  ComparisonResult,
  RankedSeller,
  ComparisonFilters,
  ComparisonMetadata,
  OfferPricing,
  OfferShipping,
} from '@/types/engine';

// FX Rate cache
interface FXRateCache {
  rates: Record<string, number>;
  timestamp: number;
  ttl: number; // Time to live in ms
}

export class ComparisonEngine {
  private fxCache: FXRateCache = {
    rates: {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.79,
      'AED': 3.67,
      'SAR': 3.75,
      'CNY': 7.24,
      'INR': 83.12,
      'JPY': 149.50,
      'CAD': 1.36,
      'AUD': 1.53,
      'MXN': 17.15,
      'BRL': 4.97,
      'KRW': 1320,
      'SGD': 1.34,
    },
    timestamp: Date.now(),
    ttl: 3600000, // 1 hour
  };

  private defaultBaseCurrency = 'USD';

  /**
   * Generate comparison result for a unified product
   */
  async compare(
    product: UnifiedProduct,
    filters?: ComparisonFilters,
    baseCurrency: string = this.defaultBaseCurrency
  ): Promise<ComparisonResult> {
    const startTime = Date.now();

    // Apply FX conversion if needed
    const offersInBaseCurrency = await Promise.all(
      product.offers.map(offer => this.convertToBaseCurrency(offer, baseCurrency))
    );

    // Apply filters
    let filteredOffers = offersInBaseCurrency;
    if (filters) {
      filteredOffers = this.applyFilters(offersInBaseCurrency, filters);
    }

    // Calculate total landed cost for each offer
    const offersWithLandedCost = filteredOffers.map(offer => ({
      ...offer,
      pricing: {
        ...offer.pricing,
        totalLandedCost: this.calculateLandedCost(offer.pricing, offer.shipping),
      },
    }));

    // Sort by total landed cost (ascending)
    offersWithLandedCost.sort((a, b) => 
      a.pricing.totalLandedCost - b.pricing.totalLandedCost
    );

    // Rank sellers
    const rankedSellers = this.rankSellers(offersWithLandedCost);

    // Generate metadata
    const metadata = this.generateMetadata(rankedSellers, startTime);

    return {
      product: {
        ...product,
        offers: rankedSellers,
      },
      sellers: rankedSellers,
      filters: filters || {},
      metadata,
    };
  }

  /**
   * Calculate total landed cost (Base Price + Shipping + Tax + Import Duty)
   */
  calculateLandedCost(pricing: OfferPricing, shipping: OfferShipping): number {
    let total = pricing.basePrice;

    // Add shipping cost
    total += shipping.cost;

    // Add import duty if applicable (DDP = Delivered Duty Paid)
    if (shipping.deliveryType === 'ddu') {
      // DDP - buyer pays duty on delivery
    } else if (shipping.importDuty) {
      total += shipping.importDuty;
    }

    // Add VAT if included
    if (shipping.vat) {
      total += shipping.vat;
    }

    // Add processing fee
    if (pricing.processingFee) {
      total += pricing.processingFee;
    }

    return Math.round(total * 100) / 100;
  }

  /**
   * Convert offer pricing to base currency
   */
  private async convertToBaseCurrency(
    offer: SellerOffer,
    baseCurrency: string
  ): Promise<SellerOffer> {
    if (offer.pricing.currency === baseCurrency) {
      return offer;
    }

    const rate = await this.getFXRate(offer.pricing.currency, baseCurrency);
    
    return {
      ...offer,
      pricing: {
        ...offer.pricing,
        currencyConverted: Math.round(offer.pricing.basePrice * rate * 100) / 100,
        baseCurrency: offer.pricing.currency,
        currency: baseCurrency,
      },
    };
  }

  /**
   * Get FX rate from cache or external API
   */
  private async getFXRate(from: string, to: string): Promise<number> {
    // Check cache first
    if (Date.now() - this.fxCache.timestamp < this.fxCache.ttl) {
      const fromRate = this.fxCache.rates[from] || 1;
      const toRate = this.fxCache.rates[to] || 1;
      return toRate / fromRate;
    }

    // In production, fetch from FX API
    // For demo, return cached rate with small random variation
    const baseRate = this.fxCache.rates[to] || 1;
    const variation = 1 + (Math.random() * 0.02 - 0.01); // ±1%
    
    return baseRate * variation;
  }

  /**
   * Apply filters to offers
   */
  private applyFilters(offers: SellerOffer[], filters: ComparisonFilters): SellerOffer[] {
    let result = [...offers];

    // Price range filter
    if (filters.minPrice !== undefined) {
      result = result.filter(o => o.pricing.totalLandedCost >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(o => o.pricing.totalLandedCost <= filters.maxPrice!);
    }

    // In stock only
    if (filters.inStockOnly) {
      result = result.filter(o => 
        o.availability.status === 'in_stock' || 
        o.availability.status === 'limited'
      );
    }

    // Condition filter
    if (filters.condition && filters.condition.length > 0) {
      result = result.filter(o => filters.condition!.includes(o.condition.type));
    }

    // Seller filter
    if (filters.sellers && filters.sellers.length > 0) {
      result = result.filter(o => filters.sellers!.includes(o.seller.id));
    }

    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      result = result.filter(o => filters.regions!.includes(o.seller.region));
    }

    // Free shipping filter
    if (filters.freeShipping) {
      result = result.filter(o => o.shipping.isFree);
    }

    return result;
  }

  /**
   * Rank sellers with deal scores
   */
  private rankSellers(offers: SellerOffer[]): RankedSeller[] {
    if (offers.length === 0) return [];

    const prices = offers.map(o => o.pricing.totalLandedCost);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return offers.map((offer, index) => {
      const savingsFromHighest = maxPrice - offer.pricing.totalLandedCost;
      const savingsFromAvg = avgPrice - offer.pricing.totalLandedCost;
      
      // Calculate deal score (0-100)
      const dealScore = this.calculateDealScore(offer, minPrice, avgPrice, savingsFromHighest);

      return {
        ...offer,
        rank: index + 1,
        cheapestFlag: index === 0, // First after sorting = lowest price
        savingsFromHighest: Math.round(savingsFromHighest * 100) / 100,
        savingsFromAvg: Math.round(savingsFromAvg * 100) / 100,
        dealScore,
      };
    });
  }

  /**
   * Calculate deal score based on multiple factors
   */
  private calculateDealScore(
    offer: SellerOffer,
    minPrice: number,
    avgPrice: number,
    savingsFromHighest: number
  ): number {
    let score = 50; // Base score

    // Price vs average (up to +30 points)
    const priceDiff = avgPrice - offer.pricing.totalLandedCost;
    const priceScore = Math.min(30, (priceDiff / avgPrice) * 100);
    score += priceScore;

    // Availability bonus (up to +10 points)
    if (offer.availability.status === 'in_stock') score += 10;
    else if (offer.availability.status === 'limited') score += 5;

    // Shipping (up to +10 points)
    if (offer.shipping.isFree) score += 10;
    else if (offer.shipping.cost === 0) score += 5;

    // Seller rating bonus (up to +10 points)
    if (offer.seller.rating) {
      score += (offer.seller.rating - 3) * 5; // 3 = neutral
    }

    // Verified seller bonus (+5 points)
    if (offer.seller.isVerified) score += 5;

    // Official store bonus (+5 points)
    if (offer.seller.isOfficialStore) score += 5;

    return Math.min(100, Math.round(score));
  }

  /**
   * Generate comparison metadata
   */
  private generateMetadata(sellers: RankedSeller[], startTime: number): ComparisonMetadata {
    const prices = sellers.map(s => s.pricing.totalLandedCost);
    
    return {
      queryTime: Date.now() - startTime,
      totalSellers: sellers.length,
      lowestPrice: prices.length > 0 ? Math.min(...prices) : 0,
      highestPrice: prices.length > 0 ? Math.max(...prices) : 0,
      avgPrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      priceSpread: prices.length > 0 ? Math.max(...prices) - Math.min(...prices) : 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get cheapest seller from a comparison result
   */
  getCheapestSeller(result: ComparisonResult): RankedSeller | null {
    return result.sellers.find(s => s.cheapestFlag) || null;
  }

  /**
   * Calculate potential savings
   */
  calculateSavings(result: ComparisonResult): {
    amount: number;
    percent: number;
  } {
    const cheapest = this.getCheapestSeller(result);
    const mostExpensive = result.sellers[result.sellers.length - 1];
    
    if (!cheapest || !mostExpensive) {
      return { amount: 0, percent: 0 };
    }

    const amount = mostExpensive.pricing.totalLandedCost - cheapest.pricing.totalLandedCost;
    const percent = (amount / mostExpensive.pricing.totalLandedCost) * 100;

    return {
      amount: Math.round(amount * 100) / 100,
      percent: Math.round(percent * 10) / 10,
    };
  }

  /**
   * Update FX rates cache
   */
  updateFXRates(rates: Record<string, number>): void {
    this.fxCache.rates = rates;
    this.fxCache.timestamp = Date.now();
  }
}

// Export singleton
export const comparisonEngine = new ComparisonEngine();
