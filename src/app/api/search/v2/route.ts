/**
 * PriceX - Enhanced Search API Route
 * Full search with comparison, ranking, and caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregationService } from '@/lib/engine/aggregation';
import { comparisonEngine } from '@/lib/engine/comparison';
import { cacheService } from '@/lib/engine/cache';
import { ComparisonFilters, UnifiedProduct, RankedSeller } from '@/types/engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const region = searchParams.get('region') || 'global';
    const currency = searchParams.get('currency') || 'USD';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Filter parameters
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const freeShipping = searchParams.get('freeShipping') === 'true';
    const conditions = searchParams.get('conditions')?.split(',') as any[];
    
    // Build filters object
    const filters: ComparisonFilters = {
      minPrice,
      maxPrice,
      inStockOnly,
      freeShipping,
      condition: conditions,
    };

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = cacheService.searchKey(query, filters, region);
    
    // Check cache first
    const cached = cacheService.get<any>(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        fromCache: true,
      });
    }

    // Fetch offers from all retailers
    const offers = await aggregationService.fetchAllRetailers(query);
    
    if (offers.length === 0) {
      return NextResponse.json({
        success: true,
        query,
        results: [],
        total: 0,
        message: 'No results found',
      });
    }

    // Create unified product from offers
    const unifiedProduct: UnifiedProduct = {
      id: `unified_${Date.now()}`,
      sku: `SKU-${Date.now()}`,
      identifiers: {
        brand: offers[0]?.seller?.name,
      },
      title: query,
      titleNormalized: query.toLowerCase().trim(),
      categoryId: category || 'electronics',
      categoryPath: [category || 'Electronics'],
      attributes: {},
      images: [],
      specifications: [],
      offers: offers.map(o => ({ ...o, unifiedProductId: '' })),
      stats: {
        totalSellers: offers.length,
        minPrice: Math.min(...offers.map(o => o.pricing.totalLandedCost)),
        maxPrice: Math.max(...offers.map(o => o.pricing.totalLandedCost)),
        avgPrice: offers.reduce((sum, o) => sum + o.pricing.totalLandedCost, 0) / offers.length,
        priceRange: 0,
        priceHistoryDays: 30,
        lowestShipping: Math.min(...offers.map(o => o.shipping.cost)),
        highestShipping: Math.max(...offers.map(o => o.shipping.cost)),
        inStockCount: offers.filter(o => o.availability.status === 'in_stock').length,
        outOfStockCount: offers.filter(o => o.availability.status === 'out_of_stock').length,
      },
      matchConfidence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPriceUpdate: new Date(),
      slug: query.toLowerCase().replace(/\s+/g, '-'),
      status: 'active',
      isVerified: false,
    };
    unifiedProduct.stats.priceRange = unifiedProduct.stats.maxPrice - unifiedProduct.stats.minPrice;

    // Generate comparison result
    const comparison = await comparisonEngine.compare(unifiedProduct, filters, currency);

    // Prepare response
    const response = {
      success: true,
      query,
      product: {
        id: unifiedProduct.id,
        title: unifiedProduct.title,
        category: unifiedProduct.categoryId,
        stats: unifiedProduct.stats,
      },
      sellers: comparison.sellers.slice(offset, offset + limit).map((s: RankedSeller) => ({
        id: s.id,
        rank: s.rank,
        cheapestFlag: s.cheapestFlag,
        dealScore: s.dealScore,
        seller: {
          id: s.seller.id,
          name: s.seller.name,
          domain: s.seller.domain,
          logo: s.seller.logo,
          isVerified: s.seller.isVerified,
          isOfficialStore: s.seller.isOfficialStore,
          rating: s.seller.rating,
        },
        pricing: {
          basePrice: s.pricing.basePrice,
          originalPrice: s.pricing.originalPrice,
          currency: s.pricing.currency,
          totalLandedCost: s.pricing.totalLandedCost,
          isOnSale: s.pricing.isOnSale,
          discountPercent: s.pricing.discountPercent,
        },
        availability: {
          status: s.availability.status,
          stockLevel: s.availability.stockLevel,
        },
        shipping: {
          cost: s.shipping.cost,
          isFree: s.shipping.isFree,
          estimatedDelivery: s.shipping.estimatedDelivery,
        },
        savingsFromHighest: s.savingsFromHighest,
        sourceUrl: s.sourceUrl,
      })),
      total: comparison.sellers.length,
      limit,
      offset,
      metadata: {
        lowestPrice: comparison.metadata.lowestPrice,
        highestPrice: comparison.metadata.highestPrice,
        avgPrice: comparison.metadata.avgPrice,
        priceSpread: comparison.metadata.priceSpread,
        queryTime: comparison.metadata.queryTime,
        lastUpdated: comparison.metadata.lastUpdated,
      },
      savings: comparisonEngine.calculateSavings(comparison),
      fromCache: false,
    };

    // Cache the result (1-4 hours depending on query popularity)
    const cacheTTL = 3600000 * (1 + Math.random() * 3); // 1-4 hours
    cacheService.set(cacheKey, response, cacheTTL);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed', details: String(error) },
      { status: 500 }
    );
  }
}
