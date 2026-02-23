/**
 * PriceX - External Product Fetch API
 * Fetch real product data from retailer websites and APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      urls, 
      query, 
      retailers,
      source = 'all',
      useCache = true,
      cacheDuration = 300000,
    } = body;

    let result;

    if (urls && urls.length > 0) {
      const products = await productService.getPriceComparison(urls);
      return NextResponse.json({
        success: true,
        products,
        count: products.length,
      });
    }

    if (query) {
      const retailersToFetch = retailers || ['amazon', 'bestbuy', 'walmart', 'target', 'ebay', 'newegg'];
      result = await productService.fetchProductsFromMultipleRetailers(
        query,
        retailersToFetch,
        { useCache, cacheDuration }
      );

      return NextResponse.json({
        success: result.success,
        products: result.data || [],
        count: result.data?.length || 0,
        errors: result.errors,
        source: result.source,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Missing urls or query parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('External product fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  try {
    const result = await productService.fetchProductByUrl(url);

    return NextResponse.json({
      success: result.success,
      product: result.data?.[0] || null,
      error: result.errors?.[0],
      source: result.source,
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
