/**
 * PriceX - Products API Route
 * Product details and price comparison
 */

import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product-data';
import { getCategoryById } from '@/types/product';

// Mock product data - using same data as search API for consistency
const MOCK_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone with A17 Pro chip, titanium design, and 48MP camera system.',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
    images: [
      { id: '1', url: '/product-1.jpg', thumbnail: '/product-1.jpg', alt: 'iPhone 15 Pro Max', type: 'main', order: 1 },
      { id: '2', url: '/product-1.jpg', thumbnail: '/product-1.jpg', alt: 'iPhone 15 Pro Max Side', type: 'gallery', order: 2 },
      { id: '3', url: '/product-1.jpg', thumbnail: '/product-1.jpg', alt: 'iPhone 15 Pro Max Back', type: 'gallery', order: 3 },
    ],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" Super Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'A17 Pro', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', group: 'Camera' },
      { attributeId: 'storage', name: 'Storage', value: '256GB', group: 'Storage' },
      { attributeId: 'battery', name: 'Battery', value: 'Up to 29 hours video', group: 'Battery' },
    ],
    attributes: { screen_size: 6.7, storage: '256GB', color: 'Natural Titanium', brand: 'Apple' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 1199, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/iphone15pro', sku: 'B0CHX1W1XY', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 150, stockStatus: 'in_stock', discountPercent: 8, offerExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), isLightningDeal: true, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 1199, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/iphone15pro', sku: '6418599', shippingCost: 0, shippingTime: 'Same day', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 89, stockStatus: 'in_stock', discountPercent: 8, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'apple', retailer: { id: 'apple', name: 'Apple Store', logo: '/retailers/apple.png', website: 'https://apple.com', region: 'north-america', rating: 4.9, reviewCount: 100000, isVerified: true, isOfficialStore: true, shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'EU'] }, returnPolicy: { allowed: true, days: 14, conditions: 'Original condition' }, locations: [] },
        price: 1199, originalPrice: 1199, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://apple.com/iphone-15-pro', sku: 'MU783LL/A', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: true, warranty: '1 year Apple warranty + AppleCare', inStock: true, stockQuantity: 500, stockStatus: 'in_stock', lastUpdated: new Date(),
      },
      {
        id: 'pp4', retailerId: 'walmart', retailer: { id: 'walmart', name: 'Walmart', logo: '/retailers/walmart.png', website: 'https://walmart.com', region: 'north-america', rating: 4.2, reviewCount: 30000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] }, returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' }, locations: [] },
        price: 1149, originalPrice: 1299, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://walmart.com/iphone15pro', sku: 'WAL-12345', shippingCost: 0, shippingTime: '2-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: true, stockQuantity: 75, stockStatus: 'low_stock', discountPercent: 12, couponCode: 'SAVE50', couponDiscount: 50, lastUpdated: new Date(),
      },
      {
        id: 'pp5', retailerId: 'target', retailer: { id: 'target', name: 'Target', logo: '/retailers/target.png', website: 'https://target.com', region: 'north-america', rating: 4.4, reviewCount: 20000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] }, returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' }, locations: [] },
        price: 1199, originalPrice: 1299, currency: 'USD', availability: 'out_of_stock', condition: 'new', url: 'https://target.com/iphone15pro', sku: 'TGT-67890', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '1 year Apple warranty', inStock: false, stockQuantity: 0, stockStatus: 'out_of_stock', discountPercent: 8, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1149, max: 1299, currency: 'USD' },
    rating: 4.8, reviewCount: 2543, availability: 'in_stock', condition: 'new',
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'Action button', 'USB-C'],
    tags: ['smartphone', 'flagship', 'ios', '5g'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'iPhone 15 Pro Max - Compare Prices', description: 'Compare iPhone 15 Pro Max prices', keywords: ['iphone', 'apple', 'smartphone'] },
    createdAt: new Date('2023-09-01'), updatedAt: new Date(),
  },
  '2': {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
    images: [{ id: '1', url: '/product-2.jpg', thumbnail: '/product-2.jpg', alt: 'Samsung Galaxy S24 Ultra', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.8" Dynamic AMOLED', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'Snapdragon 8 Gen 3', group: 'Performance' },
    ],
    attributes: { screen_size: 6.8, storage: '512GB', color: 'Titanium Black', brand: 'Samsung' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 1299, originalPrice: 1399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/galaxy-s24', sku: 'B0CQJJBDW5', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 200, stockStatus: 'in_stock', discountPercent: 7, isDealOfTheDay: true, lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 1299, originalPrice: 1399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/galaxy-s24', sku: 'BB-S24ULTRA', shippingCost: 0, shippingTime: 'Same day', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 120, stockStatus: 'in_stock', discountPercent: 7, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'walmart', retailer: { id: 'walmart', name: 'Walmart', logo: '/retailers/walmart.png', website: 'https://walmart.com', region: 'north-america', rating: 4.2, reviewCount: 30000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] }, returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' }, locations: [] },
        price: 1249, originalPrice: 1399, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://walmart.com/galaxy-s24', sku: 'WAL-S24U', shippingCost: 0, shippingTime: '2-4 days', isOfficialStore: false, warranty: '1 year Samsung warranty', inStock: true, stockQuantity: 80, stockStatus: 'low_stock', discountPercent: 11, lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 1249, max: 1399, currency: 'USD' },
    rating: 4.7, reviewCount: 1823, availability: 'in_stock', condition: 'new',
    features: ['S Pen', '200MP camera', 'AI features', 'Titanium frame', '5G'], tags: ['smartphone', 'android', 'samsung'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'Samsung Galaxy S24 Ultra - Compare Prices', description: 'Compare Galaxy S24 Ultra prices', keywords: ['samsung', 'galaxy', 'smartphone'] },
    createdAt: new Date('2024-01-01'), updatedAt: new Date(),
  },
  '3': {
    id: '3',
    name: 'MacBook Pro 16" M3 Max',
    description: 'Powerful laptop with M3 Max chip, Liquid Retina XDR display, up to 22 hours battery.',
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
  '4': {
    id: '4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-canceling headphones with exceptional sound quality and 30-hour battery.',
    brand: 'Sony',
    model: 'WH-1000XM5',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
  '5': {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Classic running shoes with Max Air unit for all-day comfort.',
    brand: 'Nike',
    model: 'Air Max 270',
    categoryId: 'fashion',
    category: getCategoryById('fashion'),
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
  '6': {
    id: '6',
    name: 'Samsung 65" OLED 4K TV',
    description: 'Stunning OLED display with Neural Quantum Processor and Dolby Atmos.',
    brand: 'Samsung',
    model: 'S95C OLED',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
  '7': {
    id: '7',
    name: 'Dyson V15 Detect Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection and HEPA filtration.',
    brand: 'Dyson',
    model: 'V15 Detect',
    categoryId: 'electronics',
    category: getCategoryById('home-appliances'),
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
  '8': {
    id: '8',
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole for incredible energy return.',
    brand: 'Adidas',
    model: 'Ultraboost 22',
    categoryId: 'fashion',
    category: getCategoryById('fashion'),
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
  '9': {
    id: '9',
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with S9 chip, Always-On Retina display, and health monitoring.',
    brand: 'Apple',
    model: 'Watch Series 9',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
  '10': {
    id: '10',
    name: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with 4K graphics, Ray Tracing, and 825GB SSD.',
    brand: 'Sony',
    model: 'PS5 Standard',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
    images: [{ id: '1', url: '/product-10.jpg', thumbnail: '/product-10.jpg', alt: 'PlayStation 5', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'storage', name: 'Storage', value: '825GB SSD', group: 'Storage' },
      { attributeId: 'resolution', name: 'Resolution', value: 'Up to 4K', group: 'Graphics' },
    ],
    attributes: { storage: '825GB', color: 'White', brand: 'Sony' },
    pricePoints: [
      {
        id: 'pp1', retailerId: 'bestbuy', retailer: { id: 'bestbuy', name: 'Best Buy', logo: '/retailers/bestbuy.png', website: 'https://bestbuy.com', region: 'north-america', rating: 4.3, reviewCount: 25000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, regions: ['US'] }, returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' }, locations: [] },
        price: 499, originalPrice: 499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://bestbuy.com/ps5', sku: '6426149', shippingCost: 0, shippingTime: '2-3 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 25, stockStatus: 'low_stock', lastUpdated: new Date(),
      },
      {
        id: 'pp2', retailerId: 'amazon', retailer: { id: 'amazon', name: 'Amazon', logo: '/retailers/amazon.png', website: 'https://amazon.com', region: 'north-america', rating: 4.5, reviewCount: 50000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] }, returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' }, locations: [] },
        price: 499, originalPrice: 549, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://amazon.com/ps5', sku: 'AMZ-PS5-STD', shippingCost: 0, shippingTime: '1-2 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 50, stockStatus: 'in_stock', discountPercent: 9, isDealOfTheDay: true, lastUpdated: new Date(),
      },
      {
        id: 'pp3', retailerId: 'walmart', retailer: { id: 'walmart', name: 'Walmart', logo: '/retailers/walmart.png', website: 'https://walmart.com', region: 'north-america', rating: 4.2, reviewCount: 30000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] }, returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' }, locations: [] },
        price: 499, originalPrice: 499, currency: 'USD', availability: 'in_stock', condition: 'new', url: 'https://walmart.com/ps5', sku: 'WAL-PS5', shippingCost: 0, shippingTime: '2-5 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 30, stockStatus: 'in_stock', lastUpdated: new Date(),
      },
      {
        id: 'pp4', retailerId: 'target', retailer: { id: 'target', name: 'Target', logo: '/retailers/target.png', website: 'https://target.com', region: 'north-america', rating: 4.4, reviewCount: 20000, isVerified: true, isOfficialStore: false, shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] }, returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' }, locations: [] },
        price: 499, originalPrice: 499, currency: 'USD', availability: 'pre_order', condition: 'new', url: 'https://target.com/ps5', sku: 'TGT-PS5', shippingCost: 0, shippingTime: '3-5 days', isOfficialStore: false, warranty: '1 year Sony warranty', inStock: true, stockQuantity: 0, stockStatus: 'preorder', offerExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), lastUpdated: new Date(),
      },
    ],
    priceRange: { min: 499, max: 549, currency: 'USD' },
    rating: 4.9, reviewCount: 24531, availability: 'in_stock', condition: 'new',
    features: ['4K Gaming', 'Ray Tracing', '825GB SSD', 'DualSense Controller'], tags: ['gaming', 'playstation', 'sony'], isVerified: true, verifiedAt: new Date(),
    seo: { title: 'PlayStation 5 - Compare Prices', description: 'Compare PS5 prices', keywords: ['playstation', 'ps5', 'gaming'] },
    createdAt: new Date('2020-11-01'), updatedAt: new Date(),
  },
  '11': {
    id: '11',
    name: 'LG C3 55" OLED evo TV',
    description: 'Self-lit OLED pixels for perfect blacks and over a billion colors.',
    brand: 'LG',
    model: 'OLED55C3PUA',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
  '12': {
    id: '12',
    name: 'Canon EOS R6 Mark II',
    description: 'Professional full-frame mirrorless camera with 24.2MP sensor and 4K60p video.',
    brand: 'Canon',
    model: 'EOS R6 Mark II',
    categoryId: 'electronics',
    category: getCategoryById('electronics'),
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'USD';
    const region = searchParams.get('region');

    const { id: productId } = await params;
    const product = MOCK_PRODUCTS[productId];

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

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
