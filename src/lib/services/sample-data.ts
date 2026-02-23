/**
 * PriceX - Global Product Sample Data
 * Products with retailers from all regions worldwide
 */

import { Product } from '@/types/product-data';
import { getCategoryById } from '@/types/product';
import { getRetailerConfig } from './retailer-config';

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

export const GLOBAL_SAMPLE_PRODUCTS: Product[] = [
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
      { id: '1', url: '/product-1.jpg', thumbnail: '/product-1.jpg', alt: 'iPhone 15 Pro Max', type: 'main', order: 1 },
    ],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" Super Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'A17 Pro', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', group: 'Camera' },
    ],
    attributes: { screen_size: 6.7, storage: '256GB', color: 'Natural Titanium', brand: 'Apple' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon-us', retailer: getRetailer('amazon-us')!,
        price: 1199, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 150, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'bestbuy', retailer: getRetailer('bestbuy')!,
        price: 1199, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/iphone15pro', sku: '6418599', shippingCost: 0, shippingTime: 'Same day', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 89, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'amazon-uk', retailer: getRetailer('amazon-uk')!,
        price: 1099, originalPrice: 1199, currency: 'GBP', availability: 'in_stock', condition: 'new', url: 'https://amazon.co.uk/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 200, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp4', retailerId: 'amazon-de', retailer: getRetailer('amazon-de')!,
        price: 1149, originalPrice: 1249, currency: 'EUR', availability: 'in_stock', condition: 'new', url: 'https://amazon.de/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '2-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 120, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp5', retailerId: 'amazon-jp', retailer: getRetailer('amazon-jp')!,
        price: 178000, originalPrice: 198000, currency: 'JPY', availability: 'in_stock', condition: 'new', url: 'https://amazon.co.jp/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '1-3 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 300, discountPercent: 10, lastUpdated: new Date(),
      },
      {
        id: 'pp6', retailerId: 'amazon-in', retailer: getRetailer('amazon-in')!,
        price: 99900, originalPrice: 109900, currency: 'INR', availability: 'in_stock', condition: 'new', url: 'https://amazon.in/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '2-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 80, discountPercent: 9, lastUpdated: new Date(),
      },
      {
        id: 'pp7', retailerId: 'amazon-ae', retailer: getRetailer('amazon-ae')!,
        price: 4399, originalPrice: 4799, currency: 'AED', availability: 'in_stock', condition: 'new', url: 'https://amazon.ae/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '2-4 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 60, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp8', retailerId: 'amazon-au', retailer: getRetailer('amazon-au')!,
        price: 1849, originalPrice: 1999, currency: 'AUD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com.au/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 100, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp9', retailerId: 'amazon-br', retailer: getRetailer('amazon-br')!,
        price: 5999, originalPrice: 6499, currency: 'BRL', availability: 'in_stock', condition: 'new', url: 'https://amazon.com.br/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '5-7 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 50, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp10', retailerId: 'ebay', retailer: getRetailer('ebay')!,
        price: 1149, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://ebay.com/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 75, discountPercent: 12, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1099, max: 5999, currency: 'USD' },
    rating: 4.8, reviewCount: 2543, availability: 'in_stock', condition: 'new',
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'Action button', 'USB-C'],
    tags: ['smartphone', 'flagship', 'ios', '5g'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'iPhone 15 Pro Max - Compare Prices', description: 'Compare iPhone 15 Pro Max prices from trusted retailers worldwide', keywords: ['iphone', 'apple', 'smartphone'] },
    createdAt: new Date('2023-09-01'), updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    sku: 'SM-S928BZKE',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-2.jpg', thumbnail: '/product-2.jpg', alt: 'Samsung Galaxy S24 Ultra', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.8" Dynamic AMOLED', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'Snapdragon 8 Gen 3', group: 'Performance' },
    ],
    attributes: { screen_size: 6.8, storage: '512GB', color: 'Titanium Black', brand: 'Samsung' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon-us', retailer: getRetailer('amazon-us')!,
        price: 1299, originalPrice: 1399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 200, discountPercent: 7, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'amazon-uk', retailer: getRetailer('amazon-uk')!,
        price: 1199, originalPrice: 1299, currency: 'GBP', availability: 'in_stock', condition: 'new', url: 'https://amazon.co.uk/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 150, discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'amazon-de', retailer: getRetailer('amazon-de')!,
        price: 1249, originalPrice: 1349, currency: 'EUR', availability: 'in_stock', condition: 'new', url: 'https://amazon.de/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '2-5 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 100, discountPercent: 7, lastUpdated: new Date(),
      },
      {
        id: 'pp4', retailerId: 'flipkart', retailer: getRetailer('flipkart')!,
        price: 99999, originalPrice: 109999, currency: 'INR', availability: 'in_stock', condition: 'new', url: 'https://flipkart.com/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '2-4 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 80, discountPercent: 9, lastUpdated: new Date(),
      },
      {
        id: 'pp5', retailerId: 'noon', retailer: getRetailer('noon')!,
        price: 4799, originalPrice: 5199, currency: 'AED', availability: 'in_stock', condition: 'new', url: 'https://noon.com/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 50, discountPercent: 8, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1299, max: 99999, currency: 'USD' },
    rating: 4.7, reviewCount: 1823, availability: 'in_stock', condition: 'new',
    features: ['S Pen', '200MP camera', 'AI features', 'Titanium frame', '5G'], tags: ['smartphone', 'android', 'samsung'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Samsung Galaxy S24 Ultra - Compare Prices', description: 'Compare Galaxy S24 Ultra prices from worldwide retailers', keywords: ['samsung', 'galaxy', 'smartphone'] },
    createdAt: new Date('2024-01-01'), updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'MacBook Pro 16" M3 Max',
    description: 'Powerful laptop with M3 Max chip, Liquid Retina XDR display, up to 22 hours battery.',
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    sku: 'MX2E3LL/A',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-3.jpg', thumbnail: '/product-3.jpg', alt: 'MacBook Pro 16"', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '16.2" Liquid Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'M3 Max', group: 'Performance' },
    ],
    attributes: { screen_size: 16.2, storage: '1TB', color: 'Space Black', brand: 'Apple' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon-us', retailer: getRetailer('amazon-us')!,
        price: 3499, originalPrice: 3499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/macbook-pro', sku: 'B0CM5JV268', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 50, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'bestbuy', retailer: getRetailer('bestbuy')!,
        price: 3499, originalPrice: 3499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/macbook-pro', sku: 'B0CM5JV268', shippingCost: 0, shippingTime: 'Same day', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 30, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'currys', retailer: getRetailer('currys')!,
        price: 2999, originalPrice: 3199, currency: 'GBP', availability: 'in_stock', condition: 'new', url: 'https://currys.com/macbook-pro', sku: 'B0CM5JV268', shippingCost: 0, shippingTime: '2-4 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 20, discountPercent: 6, lastUpdated: new Date(),
      },
      {
        id: 'pp4', retailerId: 'mediamarkt', retailer: getRetailer('mediamarkt')!,
        price: 3299, originalPrice: 3499, currency: 'EUR', availability: 'in_stock', condition: 'new', url: 'https://mediamarkt.com/macbook-pro', sku: 'B0CM5JV268', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 25, discountPercent: 6, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 2999, max: 3499, currency: 'USD' },
    rating: 4.9, reviewCount: 956, availability: 'in_stock', condition: 'new',
    features: ['M3 Max chip', 'Liquid Retina XDR', '36GB RAM', '1TB SSD'], tags: ['laptop', 'apple', 'macbook'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'MacBook Pro 16" M3 Max - Compare Prices', description: 'Compare MacBook Pro prices from global retailers', keywords: ['macbook', 'apple', 'laptop'] },
    createdAt: new Date('2023-10-01'), updatedAt: new Date(),
  },
];

export function getGlobalProducts(): Product[] {
  return GLOBAL_SAMPLE_PRODUCTS;
}
