/**
 * PriceX - Products API Route
 * Product details and price comparison
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock product data
const MOCK_PRODUCTS = new Map([
  ['1', {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with A17 Pro chip, titanium design, and 48MP camera system.',
    brand: 'Apple',
    category: 'Smartphones',
    subcategory: 'Flagship Phones',
    image: '/products/iphone15.jpg',
    gallery: ['/products/iphone15-1.jpg', '/products/iphone15-2.jpg'],
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Storage': '256GB / 512GB / 1TB',
      'Battery': 'Up to 29 hours video',
    },
    prices: [
      { 
        retailer: 'Amazon', 
        price: 1199, 
        currency: 'USD', 
        url: 'https://amazon.com',
        inStock: true,
        shipping: 'Free shipping',
        rating: 4.8,
        reviews: 1250,
      },
      { 
        retailer: 'Best Buy', 
        price: 1199, 
        currency: 'USD', 
        url: 'https://bestbuy.com',
        inStock: true,
        shipping: 'Free shipping',
        rating: 4.7,
        reviews: 890,
      },
      { 
        retailer: 'Apple Store', 
        price: 1199, 
        currency: 'USD', 
        url: 'https://apple.com',
        inStock: true,
        shipping: 'Free shipping',
        rating: 4.9,
        reviews: 2100,
      },
    ],
    priceHistory: [
      { date: '2024-01-01', price: 1199 },
      { date: '2024-02-01', price: 1199 },
      { date: '2024-03-01', price: 1149 },
      { date: '2024-04-01', price: 1199 },
    ],
    rating: 4.8,
    reviewCount: 1250,
    upc: '194253800000',
    ean: '0194253800000',
    mpn: 'MU783LL/A',
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'USD';
    const region = searchParams.get('region');

    const { id: productId } = await params;
    const product = MOCK_PRODUCTS.get(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // In production:
    // 1. Fetch from database
    // 2. Get real-time prices from retailers
    // 3. Convert prices to requested currency
    // 4. Filter retailers by region
    // 5. Return enriched product data

    return NextResponse.json({
      success: true,
      product,
      currency,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
