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
      { id: '1', url: '/product-1.jpg', thumbnail: '/product-1.jpg', alt: 'iPhone 15 Pro Max Front', type: 'main', order: 1 },
    ],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" Super Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'A17 Pro', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', group: 'Camera' },
    ],
    attributes: { screen_size: 6.7, storage: '256GB', color: 'Natural Titanium', brand: 'Apple' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 1199, originalPrice: 1199, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 150, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 1199, originalPrice: 1199, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/iphone15pro', sku: '6418599', shippingCost: 0, shippingTime: 'Same day', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 89, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1199, max: 1199, currency: 'USD' },
    rating: 4.8, reviewCount: 2543, availability: 'in_stock', condition: 'new',
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'Action button', 'USB-C'],
    tags: ['smartphone', 'flagship', 'ios', '5g'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'iPhone 15 Pro Max - Compare Prices', description: 'Compare iPhone 15 Pro Max prices from trusted retailers', keywords: ['iphone', 'apple', 'smartphone'] },
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
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 1299, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 200, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1299, max: 1299, currency: 'USD' },
    rating: 4.7, reviewCount: 1823, availability: 'in_stock', condition: 'new',
    features: ['S Pen', '200MP camera', 'AI features', 'Titanium frame', '5G'], tags: ['smartphone', 'android', 'samsung'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Samsung Galaxy S24 Ultra - Compare Prices', description: 'Compare Galaxy S24 Ultra prices', keywords: ['samsung', 'galaxy', 'smartphone'] },
    createdAt: new Date('2024-01-01'), updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'MacBook Pro 16" M3 Max',
    description: 'Powerful laptop with M3 Max chip, Liquid Retina XDR display, up to 22 hours battery.',
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    sku: 'MRW13LL/A',
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
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 3499, originalPrice: 3499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/macbook-pro', sku: 'B0CM5JV268', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 50, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 3499, max: 3499, currency: 'USD' },
    rating: 4.9, reviewCount: 956, availability: 'in_stock', condition: 'new',
    features: ['M3 Max chip', 'Liquid Retina XDR', '36GB RAM', '1TB SSD'], tags: ['laptop', 'apple', 'macbook'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'MacBook Pro 16" M3 Max - Compare Prices', description: 'Compare MacBook Pro prices', keywords: ['macbook', 'apple', 'laptop'] },
    createdAt: new Date('2023-10-01'), updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-canceling headphones with exceptional sound quality and 30-hour battery.',
    brand: 'Sony',
    model: 'WH-1000XM5',
    sku: 'WH1000XM5/B',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-4.jpg', thumbnail: '/product-4.jpg', alt: 'Sony WH-1000XM5', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'driver', name: 'Driver', value: '30mm', group: 'Audio' },
      { attributeId: 'battery', name: 'Battery', value: '30 hours', group: 'Battery' },
    ],
    attributes: { color: 'Black', brand: 'Sony' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 399, originalPrice: 399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/sony-xm5', sku: 'B0BXY2Q3Z9', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 300, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 399, max: 399, currency: 'USD' },
    rating: 4.8, reviewCount: 15420, availability: 'in_stock', condition: 'new',
    features: ['Noise cancellation', '30-hour battery', 'Touch controls', 'Multipoint connection'], tags: ['headphones', 'sony', 'audio'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Sony WH-1000XM5 - Compare Prices', description: 'Compare Sony XM5 prices', keywords: ['sony', 'headphones', 'noise canceling'] },
    createdAt: new Date('2022-05-01'), updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Classic running shoes with Max Air unit for all-day comfort.',
    brand: 'Nike',
    model: 'Air Max 270',
    sku: 'AH8050-005',
    categoryId: 'fashion',
    category: getCategoryById('fashion')!,
    images: [{ id: '1', url: '/product-5.jpg', thumbnail: '/product-5.jpg', alt: 'Nike Air Max 270', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'material', name: 'Material', value: 'Synthetic/Mesh', group: 'Upper' },
    ],
    attributes: { color: 'Black/White', brand: 'Nike', size: '10' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 150, originalPrice: 150, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/nike-airmax', sku: 'B07N3JJ5QL', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: 'N/A', inStock: true, stockQuantity: 500, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 150, max: 150, currency: 'USD' },
    rating: 4.6, reviewCount: 8932, availability: 'in_stock', condition: 'new',
    features: ['Max Air unit', 'Lightweight', 'Breathable mesh'], tags: ['shoes', 'nike', 'running'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Nike Air Max 270 - Compare Prices', description: 'Compare Nike Air Max prices', keywords: ['nike', 'shoes', 'air max'] },
    createdAt: new Date('2021-03-01'), updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Samsung 65" OLED 4K TV',
    description: 'Stunning OLED display with Neural Quantum Processor and Dolby Atmos.',
    brand: 'Samsung',
    model: 'S95C OLED',
    sku: 'QN65S95CAFXZA',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-6.jpg', thumbnail: '/product-6.jpg', alt: 'Samsung OLED TV', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'screen', name: 'Screen Size', value: '65"', group: 'Display' },
      { attributeId: 'resolution', name: 'Resolution', value: '4K UHD', group: 'Display' },
    ],
    attributes: { screen_size: 65, brand: 'Samsung' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 2499, originalPrice: 2799, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/samsung-oled', sku: '6503788', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '2 year manufacturer warranty', inStock: true, stockQuantity: 30, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 2499, max: 2799, currency: 'USD' },
    rating: 4.7, reviewCount: 1245, availability: 'in_stock', condition: 'new',
    features: ['OLED Display', 'Neural Quantum Processor', 'Dolby Atmos', 'Gaming Hub'], tags: ['tv', 'samsung', 'oled', '4k'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Samsung 65" OLED 4K TV - Compare Prices', description: 'Compare Samsung OLED TV prices', keywords: ['samsung', 'tv', 'oled', '4k'] },
    createdAt: new Date('2023-03-01'), updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Dyson V15 Detect Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection and HEPA filtration.',
    brand: 'Dyson',
    model: 'V15 Detect',
    sku: '374640-01',
    categoryId: 'appliances',
    category: getCategoryById('appliances')!,
    images: [{ id: '1', url: '/product-7.jpg', thumbnail: '/product-7.jpg', alt: 'Dyson V15', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'battery', name: 'Battery', value: '60 minutes', group: 'Power' },
    ],
    attributes: { color: 'Yellow/Nickel', brand: 'Dyson' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 749, originalPrice: 749, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/dyson-v15', sku: 'B09X7JXPXK', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '2 year Dyson warranty', inStock: true, stockQuantity: 150, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 749, max: 749, currency: 'USD' },
    rating: 4.8, reviewCount: 7821, availability: 'in_stock', condition: 'new',
    features: ['Laser dust detection', 'HEPA filtration', '60min battery', 'LCD screen'], tags: ['vacuum', 'dyson', 'cordless'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Dyson V15 Detect - Compare Prices', description: 'Compare Dyson V15 prices', keywords: ['dyson', 'vacuum', 'cordless'] },
    createdAt: new Date('2022-09-01'), updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole for incredible energy return.',
    brand: 'Adidas',
    model: 'Ultraboost 22',
    sku: 'G54804',
    categoryId: 'fashion',
    category: getCategoryById('fashion')!,
    images: [{ id: '1', url: '/product-8.jpg', thumbnail: '/product-8.jpg', alt: 'Adidas Ultraboost', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'midsole', name: 'Midsole', value: 'Boost', group: 'Comfort' },
    ],
    attributes: { color: 'Core Black', brand: 'Adidas', size: '10' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 190, originalPrice: 190, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/adidas-ultraboost', sku: 'B09TBKLQ6V', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: 'N/A', inStock: true, stockQuantity: 400, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 190, max: 190, currency: 'USD' },
    rating: 4.5, reviewCount: 12453, availability: 'in_stock', condition: 'new',
    features: ['Boost midsole', 'Primeknit upper', 'Torsion system'], tags: ['shoes', 'adidas', 'running'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Adidas Ultraboost 22 - Compare Prices', description: 'Compare Adidas Ultraboost prices', keywords: ['adidas', 'shoes', 'running'] },
    createdAt: new Date('2022-01-01'), updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with S9 chip, Always-On Retina display, and health monitoring.',
    brand: 'Apple',
    model: 'Watch Series 9',
    sku: 'MR8Y3LL/A',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-9.jpg', thumbnail: '/product-9.jpg', alt: 'Apple Watch Series 9', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: 'Always-On Retina', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'S9', group: 'Performance' },
    ],
    attributes: { screen_size: 45, color: 'Midnight Aluminum', brand: 'Apple' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 399, originalPrice: 399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/apple-watch', sku: 'B0C8JLXQJV', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 350, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 399, max: 399, currency: 'USD' },
    rating: 4.8, reviewCount: 9876, availability: 'in_stock', condition: 'new',
    features: ['S9 chip', 'Always-On Retina', 'Blood Oxygen', 'ECG', 'GPS'], tags: ['smartwatch', 'apple', 'watch'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Apple Watch Series 9 - Compare Prices', description: 'Compare Apple Watch prices', keywords: ['apple', 'watch', 'smartwatch'] },
    createdAt: new Date('2023-09-01'), updatedAt: new Date(),
  },
  {
    id: '10',
    name: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with 4K graphics, Ray Tracing, and 825GB SSD.',
    brand: 'Sony',
    model: 'PS5 Standard',
    sku: 'CFI-1215A',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-10.jpg', thumbnail: '/product-10.jpg', alt: 'PlayStation 5', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'storage', name: 'Storage', value: '825GB SSD', group: 'Storage' },
      { attributeId: 'resolution', name: 'Resolution', value: 'Up to 4K', group: 'Graphics' },
    ],
    attributes: { storage: '825GB', color: 'White', brand: 'Sony' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 499, originalPrice: 499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/ps5', sku: '6426149', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 25, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 499, max: 499, currency: 'USD' },
    rating: 4.9, reviewCount: 24531, availability: 'in_stock', condition: 'new',
    features: ['4K Gaming', 'Ray Tracing', '825GB SSD', 'DualSense Controller'], tags: ['gaming', 'playstation', 'sony'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'PlayStation 5 - Compare Prices', description: 'Compare PS5 prices', keywords: ['playstation', 'ps5', 'gaming'] },
    createdAt: new Date('2020-11-01'), updatedAt: new Date(),
  },
  {
    id: '11',
    name: 'LG C3 55" OLED evo TV',
    description: 'Self-lit OLED pixels for perfect blacks and over a billion colors.',
    brand: 'LG',
    model: 'OLED55C3PUA',
    sku: 'OLED55C3PUA',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-1.svg', thumbnail: '/product-1.svg', alt: 'LG C3 OLED', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'screen', name: 'Screen Size', value: '55"', group: 'Display' },
      { attributeId: 'panel', name: 'Panel', value: 'OLED evo', group: 'Display' },
    ],
    attributes: { screen_size: 55, brand: 'LG' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 1799, originalPrice: 1999, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/lg-c3', sku: 'B0BB8D7YG6', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '2 year LG warranty', inStock: true, stockQuantity: 45, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1799, max: 1999, currency: 'USD' },
    rating: 4.7, reviewCount: 3456, availability: 'in_stock', condition: 'new',
    features: ['OLED evo', 'Dolby Vision IQ', 'webOS 23', 'Game Optimizer'], tags: ['tv', 'lg', 'oled'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'LG C3 55" OLED - Compare Prices', description: 'Compare LG C3 OLED TV prices', keywords: ['lg', 'tv', 'oled'] },
    createdAt: new Date('2023-03-01'), updatedAt: new Date(),
  },
  {
    id: '12',
    name: 'Canon EOS R6 Mark II',
    description: 'Professional full-frame mirrorless camera with 24.2MP sensor and 4K60p video.',
    brand: 'Canon',
    model: 'EOS R6 Mark II',
    sku: '5667C002',
    categoryId: 'electronics',
    category: getCategoryById('electronics')!,
    images: [{ id: '1', url: '/product-2.svg', thumbnail: '/product-2.svg', alt: 'Canon EOS R6', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'sensor', name: 'Sensor', value: '24.2MP Full-Frame', group: 'Sensor' },
      { attributeId: 'video', name: 'Video', value: '4K 60p', group: 'Video' },
    ],
    attributes: { brand: 'Canon' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 2499, originalPrice: 2499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/canon-r6', sku: '6494413', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '1 year Canon warranty', inStock: true, stockQuantity: 20, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 2499, max: 2499, currency: 'USD' },
    rating: 4.9, reviewCount: 892, availability: 'in_stock', condition: 'new',
    features: ['24.2MP Full-Frame', '4K 60p', 'IBIS', 'Dual Pixel CMOS AF II'], tags: ['camera', 'canon', 'mirrorless'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Canon EOS R6 Mark II - Compare Prices', description: 'Compare Canon R6 prices', keywords: ['canon', 'camera', 'mirrorless'] },
    createdAt: new Date('2022-11-01'), updatedAt: new Date(),
  },
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
