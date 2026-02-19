/**
 * PriceX - Product Search API
 * AI-powered search with filters, facets, and suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  Product, 
  SearchResult, 
  SearchFacets, 
  ProductAvailability,
  SortField,
} from '@/types/product-data';
import { CATEGORIES, getCategoryById } from '@/types/product';

// Mock product database - replace with Elasticsearch/Typesense in production
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone with A17 Pro chip, titanium design, and 48MP camera system.',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    sku: 'MU783LL/A',
    mpn: 'MU783LL/A',
    upc: '195949147046',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [
      { id: '1', url: '/products/iphone15-1.jpg', thumbnail: '/products/iphone15-1-thumb.jpg', alt: 'iPhone 15 Pro Max Front', type: 'main', order: 1 },
      { id: '2', url: '/products/iphone15-2.jpg', thumbnail: '/products/iphone15-2-thumb.jpg', alt: 'iPhone 15 Pro Max Back', type: 'gallery', order: 2 },
      { id: '3', url: '/products/iphone15-3.jpg', thumbnail: '/products/iphone15-3-thumb.jpg', alt: 'iPhone 15 Pro Max Side', type: 'gallery', order: 3 },
    ],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" Super Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'A17 Pro', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', group: 'Camera' },
      { attributeId: 'storage', name: 'Storage', value: '256GB', group: 'Storage' },
      { attributeId: 'battery', name: 'Battery', value: 'Up to 29 hours video', group: 'Battery' },
    ],
    attributes: {
      screen_size: 6.7,
      storage: '256GB',
      color: 'Natural Titanium',
      brand: 'Apple',
    },
    pricePoints: [
      {
        id: 'pp1',
        retailerId: 'amazon',
        retailer: {
          id: 'amazon',
          name: 'Amazon',
          logo: '/retailers/amazon.png',
          website: 'https://amazon.com',
          region: 'north-america',
          rating: 4.5,
          reviewCount: 50000,
          isVerified: true,
          isOfficialStore: false,
          shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
          returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
          locations: [
            { name: 'Amazon Fulfillment Center', address: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321, hours: '24/7' },
          ],
        },
        price: 1199,
        originalPrice: 1199,
        currency: 'USD',
        availability: 'in_stock',
        condition: 'new',
        url: 'https://amazon.com/iphone15pro',
        sku: 'B0CHX1W1XY',
        shippingCost: 0,
        shippingTime: '1-2 days',
        isOfficialStore: false,
        warranty: '1 year Apple warranty',
        inStock: true,
        stockQuantity: 150,
        lastUpdated: new Date(),
      },
      {
        id: 'pp2',
        retailerId: 'bestbuy',
        retailer: {
          id: 'bestbuy',
          name: 'Best Buy',
          logo: '/retailers/bestbuy.png',
          website: 'https://bestbuy.com',
          region: 'north-america',
          rating: 4.3,
          reviewCount: 25000,
          isVerified: true,
          isOfficialStore: false,
          shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] },
          returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
          locations: [
            { name: 'Best Buy Store', address: 'New York, NY', latitude: 40.7128, longitude: -74.0060, hours: '10AM-9PM' },
          ],
        },
        price: 1199,
        currency: 'USD',
        availability: 'in_stock',
        condition: 'new',
        url: 'https://bestbuy.com/iphone15pro',
        sku: '6418599',
        shippingCost: 0,
        shippingTime: 'Same day',
        isOfficialStore: false,
        warranty: '1 year Apple warranty',
        inStock: true,
        stockQuantity: 89,
        lastUpdated: new Date(),
      },
      {
        id: 'pp3',
        retailerId: 'apple',
        retailer: {
          id: 'apple',
          name: 'Apple Store',
          logo: '/retailers/apple.png',
          website: 'https://apple.com',
          region: 'north-america',
          rating: 4.9,
          reviewCount: 100000,
          isVerified: true,
          isOfficialStore: true,
          shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'EU'] },
          returnPolicy: { allowed: true, days: 14, conditions: 'Original condition' },
          locations: [
            { name: 'Apple Fifth Avenue', address: '767 5th Ave, New York, NY', latitude: 40.7638, longitude: -73.9728, hours: '9AM-9PM' },
          ],
        },
        price: 1199,
        currency: 'USD',
        availability: 'in_stock',
        condition: 'new',
        url: 'https://apple.com/iphone-15-pro',
        sku: 'MU783LL/A',
        shippingCost: 0,
        shippingTime: '1-2 days',
        isOfficialStore: true,
        warranty: '1 year Apple warranty + AppleCare options',
        inStock: true,
        stockQuantity: 500,
        lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1199, max: 1199, currency: 'USD' },
    rating: 4.8,
    reviewCount: 2543,
    availability: 'in_stock',
    condition: 'new',
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'Action button', 'USB-C'],
    tags: ['smartphone', 'flagship', 'ios', '5g'],
    isVerified: true,
    verifiedAt: new Date(),
    seo: {
      title: 'iPhone 15 Pro Max - Compare Prices',
      description: 'Compare iPhone 15 Pro Max prices from trusted retailers',
      keywords: ['iphone', 'apple', 'smartphone'],
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date(),
  },
  // Add more mock products as needed
];

// AI Search suggestions generator
function generateAISuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Brand suggestions
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas'];
  brands.forEach(brand => {
    if (brand.toLowerCase().includes(lowerQuery) || lowerQuery.includes(brand.toLowerCase())) {
      suggestions.push(`${brand} products`);
    }
  });
  
  // Category suggestions
  const categories = ['electronics', 'fashion', 'home'];
  categories.forEach(cat => {
    if (cat.includes(lowerQuery)) {
      suggestions.push(`${cat} deals`);
    }
  });
  
  return suggestions.slice(0, 5);
}

// Generate search facets
function generateFacets(products: Product[]): SearchFacets {
  const brandCount = new Map<string, number>();
  const categoryCount = new Map<string, { id: string; name: string; count: number }>();
  const priceRanges = [
    { min: 0, max: 50, count: 0 },
    { min: 50, max: 100, count: 0 },
    { min: 100, max: 250, count: 0 },
    { min: 250, max: 500, count: 0 },
    { min: 500, max: 1000, count: 0 },
    { min: 1000, max: Infinity, count: 0 },
  ];
  const ratingCount = new Map<number, number>();
  const availabilityCount = new Map<ProductAvailability, number>();
  
  products.forEach(product => {
    // Brand facet
    brandCount.set(product.brand, (brandCount.get(product.brand) || 0) + 1);
    
    // Category facet
    const catId = product.categoryId;
    const cat = categoryCount.get(catId);
    if (cat) {
      cat.count++;
    } else {
      const category = getCategoryById(catId);
      if (category) {
        categoryCount.set(catId, { id: catId, name: category.name, count: 1 });
      }
    }
    
    // Price range facet
    const bestPrice = product.pricePoints[0]?.price || 0;
    const range = priceRanges.find(r => bestPrice >= r.min && bestPrice < r.max);
    if (range) range.count++;
    
    // Rating facet
    const roundedRating = Math.floor(product.rating);
    ratingCount.set(roundedRating, (ratingCount.get(roundedRating) || 0) + 1);
    
    // Availability facet
    availabilityCount.set(product.availability, (availabilityCount.get(product.availability) || 0) + 1);
  });
  
  return {
    categories: Array.from(categoryCount.values()),
    brands: Array.from(brandCount.entries()).map(([name, count]) => ({ name, count })),
    priceRanges,
    ratings: Array.from(ratingCount.entries())
      .map(([rating, count]) => ({ rating, count }))
      .sort((a, b) => b.rating - a.rating),
    attributes: {},
    availability: Array.from(availabilityCount.entries())
      .map(([status, count]) => ({ status, count })),
  };
}

// Sort products
function sortProducts(products: Product[], sortField: SortField, direction: 'asc' | 'desc'): Product[] {
  const sorted = [...products];
  
  switch (sortField) {
    case 'price_asc':
    case 'price_desc':
      sorted.sort((a, b) => {
        const priceA = a.pricePoints[0]?.price || Infinity;
        const priceB = b.pricePoints[0]?.price || Infinity;
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      });
      break;
    case 'rating':
      sorted.sort((a, b) => {
        return direction === 'asc' 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      });
      break;
    case 'newest':
      sorted.sort((a, b) => {
        return direction === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case 'popularity':
      sorted.sort((a, b) => {
        return direction === 'asc'
          ? a.reviewCount - b.reviewCount
          : b.reviewCount - a.reviewCount;
      });
      break;
    default:
      // relevance - no change
      break;
  }
  
  return sorted;
}

// Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const sort = (searchParams.get('sort') as SortField) || 'relevance';
    const direction = (searchParams.get('direction') as 'asc' | 'desc') || 'desc';
    
    // Filter parameters
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || 'Infinity');
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const inStock = searchParams.get('inStock') === 'true';
    
    // Filter products
    let filteredProducts = mockProducts.filter(product => {
      // Text search
      if (query) {
        const searchFields = [
          product.name,
          product.brand,
          product.model,
          product.sku,
          product.description,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(query.toLowerCase())) {
          return false;
        }
      }
      
      // Category filter
      if (categoryId && product.categoryId !== categoryId) {
        return false;
      }
      
      // Price filter
      const bestPrice = product.pricePoints[0]?.price || 0;
      if (bestPrice < minPrice || bestPrice > maxPrice) {
        return false;
      }
      
      // Brand filter
      if (brands.length > 0 && !brands.includes(product.brand)) {
        return false;
      }
      
      // Rating filter
      if (product.rating < minRating) {
        return false;
      }
      
      // Stock filter
      if (inStock && product.availability !== 'in_stock') {
        return false;
      }
      
      return true;
    });
    
    // Sort products
    filteredProducts = sortProducts(filteredProducts, sort, direction);
    
    // Generate facets
    const facets = generateFacets(filteredProducts);
    
    // Paginate
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    // Generate AI suggestions
    const suggestions = query ? generateAISuggestions(query) : [];
    
    const result: SearchResult = {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      facets,
      suggestions,
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

// AI-powered search suggestions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;
    
    // Generate AI suggestions based on query
    const suggestions = generateAISuggestions(query);
    
    // Add "Did you mean" correction if applicable
    let didYouMean: string | undefined;
    
    // Simple spell check / correction logic
    if (query.toLowerCase() === 'iphon') {
      didYouMean = 'iphone';
    } else if (query.toLowerCase() === 'samsng') {
      didYouMean = 'samsung';
    }
    
    return NextResponse.json({
      suggestions,
      didYouMean,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}
