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
import { GLOBAL_SAMPLE_PRODUCTS } from '@/lib/services/sample-data';

// Use global sample products with retailers from all regions
const mockProducts: Product[] = GLOBAL_SAMPLE_PRODUCTS;

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
