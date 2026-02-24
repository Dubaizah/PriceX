/**
 * PriceX - Global Product Sample Data
 * Products with retailers from all regions worldwide
 * 50 realistic seed products across various categories
 */

import { Product } from '@/types/product-data';
import { getCategoryById } from '@/types/product';
import { getRetailerConfig } from './retailer-config';
import { SEED_PRODUCTS } from '../seed';

// Helper to get retailer data from config
const getRetailer = (id: string) => {
  const config = getRetailerConfig(id);
  if (!config) return null;
  return {
    id: config.id,
    name: config.name,
    logo: config.logo,
    website: config.website,
    region: config.region,
    rating: config.rating,
    reviewCount: config.reviewCount,
    isVerified: config.isVerified,
    isOfficialStore: config.isOfficialStore,
    shippingInfo: config.shippingInfo,
    returnPolicy: config.returnPolicy,
    locations: config.locations || [],
  };
};

// Convert seed product to Product type
const convertToProduct = (seed: any): Product => {
  const category = getCategoryById(seed.categoryId);
  
  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    brand: seed.brand,
    model: seed.model,
    sku: seed.sku,
    mpn: seed.sku,
    upc: seed.upc,
    categoryId: seed.categoryId,
    category: category!,
    images: seed.images,
    specifications: seed.specifications,
    attributes: seed.attributes,
    pricePoints: seed.pricePoints.map((pp: any, idx: number) => ({
      ...pp,
      id: `pp_${seed.id}_${idx}`,
    })),
    priceRange: {
      min: Math.min(...seed.pricePoints.map((p: any) => p.price)),
      max: Math.max(...seed.pricePoints.map((p: any) => p.price)),
      currency: 'USD',
    },
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    availability: seed.pricePoints[0]?.availability || 'in_stock',
    condition: 'new',
    features: seed.features || [],
    tags: seed.tags || [],
    isVerified: true,
    verifiedAt: new Date(),
    seo: {
      title: `${seed.name} - Compare Prices`,
      description: `Compare ${seed.name} prices from trusted retailers worldwide`,
      keywords: seed.tags || [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Export seed products as GLOBAL_SAMPLE_PRODUCTS
export const GLOBAL_SAMPLE_PRODUCTS: Product[] = SEED_PRODUCTS.map(convertToProduct);

export function getGlobalProducts(): Product[] {
  return GLOBAL_SAMPLE_PRODUCTS;
}
