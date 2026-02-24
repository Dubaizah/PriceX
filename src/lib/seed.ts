/**
 * PriceX - Database Seed Script
 * Injects 50 realistic mock products across various categories
 * Run with: npx tsx src/lib/seed.ts
 */

import { getRetailerConfig } from './services/retailer-config';
import { getCategoryById } from './types/product';

interface SeedProduct {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  sku: string;
  upc?: string;
  categoryId: string;
  images: { id: string; url: string; thumbnail: string; alt: string; type: string; order: number }[];
  specifications: { attributeId: string; name: string; value: string; group: string }[];
  attributes: Record<string, any>;
  pricePoints: any[];
  rating: number;
  reviewCount: number;
  tags: string[];
  features?: string[];
}

// Helper to get retailer data
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

// Realistic image URLs from placeholder services
const productImages = {
  smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
  smartwatch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
  tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
  gaming: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  watch: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
  bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
  appliance: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  sports: 'https://images.unsplash.com/photo-1517924538820-ede924948d35?w=400',
  drone: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
  console: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
};

// Price variations for different retailers
const generatePrices = (basePrice: number, retailerIds: string[]) => {
  return retailerIds.map((retailerId, idx) => {
    const variation = 1 + (Math.random() * 0.2 - 0.1); // -10% to +10%
    const price = Math.round(basePrice * variation);
    const originalPrice = Math.round(price * 1.15);
    const discount = Math.round((1 - price / originalPrice) * 100);
    
    return {
      id: `pp${idx + 1}`,
      retailerId,
      retailer: getRetailer(retailerId),
      price,
      originalPrice,
      currency: 'USD',
      availability: Math.random() > 0.15 ? 'in_stock' : 'limited',
      condition: 'new',
      url: `https://${getRetailerConfig(retailerId)?.domain || 'example.com'}/product`,
      sku: `SKU-${Date.now()}-${idx}`,
      shippingCost: Math.random() > 0.5 ? 0 : Math.round(Math.random() * 15 * 100) / 100,
      shippingTime: Math.random() > 0.5 ? 'Free 2-day' : '3-5 business days',
      isOfficialStore: Math.random() > 0.7,
      warranty: '1 year warranty',
      inStock: Math.random() > 0.15,
      stockQuantity: Math.floor(Math.random() * 200) + 10,
      discountPercent: discount,
      lastUpdated: new Date(),
    };
  });
};

// 50 Products across various categories
export const SEED_PRODUCTS: SeedProduct[] = [
  // ELECTRONICS - Smartphones
  {
    id: '1', name: 'iPhone 15 Pro Max 256GB', description: 'The most advanced iPhone with A17 Pro chip, titanium design, and 48MP camera system.', brand: 'Apple', model: 'iPhone 15 Pro Max', sku: 'MU783LL/A', upc: '195949147046', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartphone, thumbnail: productImages.smartphone, alt: 'iPhone 15 Pro Max', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" Super Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'A17 Pro', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', group: 'Camera' },
      { attributeId: 'storage', name: 'Storage', value: '256GB', group: 'Memory' },
      { attributeId: 'battery', name: 'Battery', value: 'Up to 29 hours video', group: 'Battery' },
    ],
    attributes: { screen_size: 6.7, storage: '256GB', color: 'Natural Titanium', brand: 'Apple' },
    pricePoints: generatePrices(1199, ['amazon-us', 'bestbuy', 'walmart', 'target', 'ebay']),
    rating: 4.8, reviewCount: 2543, tags: ['smartphone', 'flagship', 'ios', '5g'],
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'Action button', 'USB-C'],
  },
  {
    id: '2', name: 'Samsung Galaxy S24 Ultra 512GB', description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.', brand: 'Samsung', model: 'Galaxy S24 Ultra', sku: 'SM-S928BZKE', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartphone, thumbnail: productImages.smartphone, alt: 'Samsung Galaxy S24 Ultra', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.8" Dynamic AMOLED 2X', group: 'Display' },
      { attributeId: 'chip', name: 'Processor', value: 'Snapdragon 8 Gen 3', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '200MP Main + 50MP Telephoto', group: 'Camera' },
      { attributeId: 'storage', name: 'Storage', value: '512GB', group: 'Memory' },
    ],
    attributes: { screen_size: 6.8, storage: '512GB', color: 'Titanium Black', brand: 'Samsung' },
    pricePoints: generatePrices(1299, ['amazon-us', 'bestbuy', 'walmart', 'newegg']),
    rating: 4.7, reviewCount: 1823, tags: ['smartphone', 'android', 'samsung', 'ai'],
    features: ['S Pen', '200MP camera', 'AI features', 'Titanium frame', '5G'],
  },
  {
    id: '3', name: 'Google Pixel 8 Pro', description: 'Google flagship with Tensor G3 chip, best-in-class camera, and 7 years of updates.', brand: 'Google', model: 'Pixel 8 Pro', sku: 'GVU6C', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartphone, thumbnail: productImages.smartphone, alt: 'Google Pixel 8 Pro', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '6.7" LTPO OLED', group: 'Display' },
      { attributeId: 'chip', name: 'Processor', value: 'Tensor G3', group: 'Performance' },
      { attributeId: 'camera', name: 'Camera', value: '50MP Main + 48MP Ultra Wide', group: 'Camera' },
    ],
    attributes: { screen_size: 6.7, storage: '128GB', color: 'Obsidian', brand: 'Google' },
    pricePoints: generatePrices(999, ['amazon-us', 'bestbuy', 'target']),
    rating: 4.6, reviewCount: 1245, tags: ['smartphone', 'android', 'google', 'ai'],
  },

  // ELECTRONICS - Laptops
  {
    id: '4', name: 'MacBook Pro 16" M3 Max', description: 'Powerful laptop with M3 Max chip, Liquid Retina XDR display, up to 22 hours battery.', brand: 'Apple', model: 'MacBook Pro 16" M3', sku: 'MRW23LL/A', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.laptop, thumbnail: productImages.laptop, alt: 'MacBook Pro 16" M3 Max', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '16.2" Liquid Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'M3 Max', group: 'Performance' },
      { attributeId: 'memory', name: 'Memory', value: '36GB Unified Memory', group: 'Memory' },
      { attributeId: 'storage', name: 'Storage', value: '1TB SSD', group: 'Storage' },
    ],
    attributes: { screen_size: 16.2, storage: '1TB', color: 'Space Black', brand: 'Apple' },
    pricePoints: generatePrices(3499, ['amazon-us', 'bestbuy', 'apple-store']),
    rating: 4.9, reviewCount: 892, tags: ['laptop', 'apple', 'macbook', 'professional'],
    features: ['M3 Max chip', 'Liquid Retina XDR', '36GB memory', '1TB SSD'],
  },
  {
    id: '5', name: 'Dell XPS 15 OLED', description: 'Premium Windows laptop with 15.6" OLED display, Intel Core i9, and sleek design.', brand: 'Dell', model: 'XPS 15 9530', sku: 'XPS159530', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.laptop, thumbnail: productImages.laptop, alt: 'Dell XPS 15 OLED', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '15.6" 3.5K OLED', group: 'Display' },
      { attributeId: 'processor', name: 'Processor', value: 'Intel Core i9-13900H', group: 'Performance' },
      { attributeId: 'memory', name: 'Memory', value: '32GB DDR5', group: 'Memory' },
      { attributeId: 'storage', name: 'Storage', value: '1TB NVMe SSD', group: 'Storage' },
    ],
    attributes: { screen_size: 15.6, storage: '1TB', color: 'Platinum Silver', brand: 'Dell' },
    pricePoints: generatePrices(1899, ['amazon-us', 'bestbuy', 'newegg', 'dell']),
    rating: 4.7, reviewCount: 678, tags: ['laptop', 'windows', 'dell', 'oled'],
  },
  {
    id: '6', name: 'Lenovo ThinkPad X1 Carbon Gen 12', description: 'Business ultrabook with Intel Core Ultra processor, weighing only 1.09kg.', brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 12', sku: '21H5001HUS', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.laptop, thumbnail: productImages.laptop, alt: 'Lenovo ThinkPad X1 Carbon', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '14" 2.8K OLED', group: 'Display' },
      { attributeId: 'processor', name: 'Processor', value: 'Intel Core Ultra 7', group: 'Performance' },
      { attributeId: 'memory', name: 'Memory', value: '16GB LPDDR5X', group: 'Memory' },
    ],
    attributes: { screen_size: 14, storage: '512GB', color: 'Black', brand: 'Lenovo' },
    pricePoints: generatePrices(1549, ['amazon-us', 'bestbuy', 'newegg']),
    rating: 4.6, reviewCount: 445, tags: ['laptop', 'business', 'lenovo', 'ultrabook'],
  },

  // ELECTRONICS - Tablets
  {
    id: '7', name: 'iPad Pro 12.9" M4', description: 'The most powerful iPad ever with M4 chip and stunning Liquid Retina XDR display.', brand: 'Apple', model: 'iPad Pro 12.9" M4', sku: 'MX2D3LL/A', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.tablet, thumbnail: productImages.tablet, alt: 'iPad Pro 12.9" M4', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '12.9" Liquid Retina XDR', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'M4', group: 'Performance' },
      { attributeId: 'storage', name: 'Storage', value: '256GB', group: 'Storage' },
    ],
    attributes: { screen_size: 12.9, storage: '256GB', color: 'Space Gray', brand: 'Apple' },
    pricePoints: generatePrices(999, ['amazon-us', 'bestbuy', 'apple-store']),
    rating: 4.8, reviewCount: 1234, tags: ['tablet', 'ipad', 'apple', 'professional'],
  },
  {
    id: '8', name: 'Samsung Galaxy Tab S9 Ultra', description: 'Premium Android tablet with 14.6" display, S Pen included, and DeX mode.', brand: 'Samsung', model: 'Galaxy Tab S9 Ultra', sku: 'SM-X910', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.tablet, thumbnail: productImages.tablet, alt: 'Samsung Galaxy Tab S9 Ultra', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '14.6" Dynamic AMOLED', group: 'Display' },
      { attributeId: 'processor', name: 'Processor', value: 'Snapdragon 8 Gen 2', group: 'Performance' },
      { attributeId: 'storage', name: 'Storage', value: '512GB', group: 'Storage' },
    ],
    attributes: { screen_size: 14.6, storage: '512GB', color: 'Graphite', brand: 'Samsung' },
    pricePoints: generatePrices(1199, ['amazon-us', 'bestbuy', 'samsung']),
    rating: 4.7, reviewCount: 567, tags: ['tablet', 'android', 'samsung', 'productivity'],
  },

  // ELECTRONICS - Wearables
  {
    id: '9', name: 'Apple Watch Ultra 2', description: 'The most rugged and capable Apple Watch with precision GPS and 36-hour battery.', brand: 'Apple', model: 'Watch Ultra 2', sku: 'MRF93LL/A', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartwatch, thumbnail: productImages.smartwatch, alt: 'Apple Watch Ultra 2', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '49mm Titanium', group: 'Design' },
      { attributeId: 'battery', name: 'Battery', value: '36 hours', group: 'Battery' },
      { attributeId: 'water', name: 'Water Resistance', value: '100m', group: 'Durability' },
    ],
    attributes: { case_size: 49, material: 'Titanium', brand: 'Apple' },
    pricePoints: generatePrices(799, ['amazon-us', 'bestbuy', 'apple-store']),
    rating: 4.9, reviewCount: 2345, tags: ['smartwatch', 'apple', 'fitness', 'rugged'],
  },
  {
    id: '10', name: 'Samsung Galaxy Watch 6 Classic', description: 'Premium smartwatch with rotating bezel, Super AMOLED display, and health tracking.', brand: 'Samsung', model: 'Galaxy Watch 6 Classic', sku: 'SM-R950', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartwatch, thumbnail: productImages.smartwatch, alt: 'Samsung Galaxy Watch 6', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '47mm Super AMOLED', group: 'Display' },
      { attributeId: 'battery', name: 'Battery', value: '40 hours', group: 'Battery' },
      { attributeId: 'water', name: 'Water Resistance', value: '50m', group: 'Durability' },
    ],
    attributes: { case_size: 47, material: 'Stainless Steel', brand: 'Samsung' },
    pricePoints: generatePrices(399, ['amazon-us', 'bestbuy', 'samsung']),
    rating: 4.6, reviewCount: 987, tags: ['smartwatch', 'android', 'samsung', 'health'],
  },

  // ELECTRONICS - Audio
  {
    id: '11', name: 'Sony WH-1000XM5', description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery.', brand: 'Sony', model: 'WH-1000XM5', sku: 'WH1000XM5', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.headphones, thumbnail: productImages.headphones, alt: 'Sony WH-1000XM5', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'driver', name: 'Driver', value: '30mm', group: 'Audio' },
      { attributeId: 'battery', name: 'Battery', value: '30 hours', group: 'Battery' },
      { attributeId: 'anc', name: 'Noise Cancellation', value: 'Active', group: 'Features' },
    ],
    attributes: { type: 'Over-ear', connectivity: 'Bluetooth 5.2', brand: 'Sony' },
    pricePoints: generatePrices(399, ['amazon-us', 'bestbuy', 'walmart', 'target']),
    rating: 4.8, reviewCount: 5678, tags: ['headphones', 'sony', 'noise-canceling', 'premium-audio'],
  },
  {
    id: '12', name: 'AirPods Pro 2nd Generation', description: 'Active Noise Cancellation, Adaptive Transparency, and personalized Spatial Audio.', brand: 'Apple', model: 'AirPods Pro 2', sku: 'MQD83AM/A', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.headphones, thumbnail: productImages.headphones, alt: 'AirPods Pro 2', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'chip', name: 'Chip', value: 'Apple H2', group: 'Performance' },
      { attributeId: 'battery', name: 'Battery', value: '6 hours + 30 hours case', group: 'Battery' },
      { attributeId: 'anc', name: 'Noise Cancellation', value: 'Active', group: 'Features' },
    ],
    attributes: { type: 'In-ear', connectivity: 'Bluetooth 5.3', brand: 'Apple' },
    pricePoints: generatePrices(249, ['amazon-us', 'bestbuy', 'apple-store']),
    rating: 4.7, reviewCount: 8934, tags: ['earbuds', 'apple', 'noise-canceling', 'spatial-audio'],
  },

  // ELECTRONICS - Cameras
  {
    id: '13', name: 'Sony Alpha A7 IV', description: 'Full-frame mirrorless camera with 33MP sensor, 4K 60p video, and advanced autofocus.', brand: 'Sony', model: 'A7 IV', sku: 'ILCE-7M4', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.camera, thumbnail: productImages.camera, alt: 'Sony Alpha A7 IV', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'sensor', name: 'Sensor', value: '33MP Full-Frame', group: 'Image' },
      { attributeId: 'video', name: 'Video', value: '4K 60p', group: 'Video' },
      { attributeId: 'af', name: 'Autofocus', value: '759-point Phase Detection', group: 'Focus' },
    ],
    attributes: { sensor_size: 'Full-frame', brand: 'Sony' },
    pricePoints: generatePrices(2498, ['amazon-us', 'bestbuy', 'b&h']),
    rating: 4.8, reviewCount: 456, tags: ['camera', 'sony', 'mirrorless', 'full-frame', 'video'],
  },
  {
    id: '14', name: 'Canon EOS R6 Mark II', description: 'Professional full-frame mirrorless with 24.2MP, 40fps burst, and advanced IBIS.', brand: 'Canon', model: 'EOS R6 Mark II', sku: '5667C002', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.camera, thumbnail: productImages.camera, alt: 'Canon EOS R6 Mark II', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'sensor', name: 'Sensor', value: '24.2MP Full-Frame', group: 'Image' },
      { attributeId: 'burst', name: 'Burst', value: '40fps', group: 'Performance' },
      { attributeId: 'ibis', name: 'IBIS', value: '8 stops', group: 'Stabilization' },
    ],
    attributes: { sensor_size: 'Full-frame', brand: 'Canon' },
    pricePoints: generatePrices(2499, ['amazon-us', 'bestbuy', 'canon']),
    rating: 4.9, reviewCount: 234, tags: ['camera', 'canon', 'mirrorless', 'professional'],
  },

  // ELECTRONICS - TVs
  {
    id: '15', name: 'Samsung 65" OLED 4K Smart TV S95C', description: 'Premium OLED TV with Neural Quantum Processor, Dolby Atmos, and Smart Hub.', brand: 'Samsung', model: 'QN65S95C', sku: 'QN65S95CAF', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.tv, thumbnail: productImages.tv, alt: 'Samsung OLED TV', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'size', name: 'Screen Size', value: '65"', group: 'Display' },
      { attributeId: 'resolution', name: 'Resolution', value: '4K UHD', group: 'Display' },
      { attributeId: 'panel', name: 'Panel', value: 'OLED', group: 'Display' },
      { attributeId: 'hdr', name: 'HDR', value: 'HDR10+', group: 'Features' },
    ],
    attributes: { screen_size: 65, resolution: '4K', panel_type: 'OLED', brand: 'Samsung' },
    pricePoints: generatePrices(2499, ['amazon-us', 'bestbuy', 'walmart']),
    rating: 4.7, reviewCount: 345, tags: ['tv', 'samsung', 'oled', '4k', 'smart-tv'],
  },
  {
    id: '16', name: 'LG 55" C3 OLED evo', description: 'Self-lit OLED pixels, α9 AI Processor 4K, and gaming optimization.', brand: 'LG', model: 'OLED55C3PUA', sku: 'OLED55C3PUA', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.tv, thumbnail: productImages.tv, alt: 'LG C3 OLED', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'size', name: 'Screen Size', value: '55"', group: 'Display' },
      { attributeId: 'processor', name: 'Processor', value: 'α9 AI Processor 4K', group: 'Performance' },
      { attributeId: 'gaming', name: 'Gaming', value: '120Hz, VRR', group: 'Gaming' },
    ],
    attributes: { screen_size: 55, resolution: '4K', panel_type: 'OLED', brand: 'LG' },
    pricePoints: generatePrices(1796, ['amazon-us', 'bestbuy', 'lg']),
    rating: 4.8, reviewCount: 567, tags: ['tv', 'lg', 'oled', 'gaming'],
  },

  // ELECTRONICS - Gaming
  {
    id: '17', name: 'Sony PlayStation 5 Slim', description: 'Next-gen gaming console with 1TB SSD, 4K gaming, and DualSense controller.', brand: 'Sony', model: 'PS5 Slim', sku: 'CFI-7000', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.console, thumbnail: productImages.console, alt: 'PlayStation 5', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'storage', name: 'Storage', value: '1TB SSD', group: 'Storage' },
      { attributeId: 'resolution', name: 'Resolution', value: 'Up to 4K 120Hz', group: 'Performance' },
      { attributeId: 'gpu', name: 'GPU', value: '10.3 TFLOPs RDNA 2', group: 'Graphics' },
    ],
    attributes: { storage: '1TB', brand: 'Sony', platform: 'playstation' },
    pricePoints: generatePrices(499, ['amazon-us', 'bestbuy', 'walmart', 'target']),
    rating: 4.9, reviewCount: 12345, tags: ['gaming', 'playstation', 'console', 'next-gen'],
  },
  {
    id: '18', name: 'Xbox Series X', description: 'Most powerful Xbox ever with 12 teraflops, Quick Resume, and 4K gaming.', brand: 'Microsoft', model: 'Series X', sku: 'RRT-00001', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.console, thumbnail: productImages.console, alt: 'Xbox Series X', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'storage', name: 'Storage', value: '1TB NVMe SSD', group: 'Storage' },
      { attributeId: 'resolution', name: 'Resolution', value: 'Up to 4K 120fps', group: 'Performance' },
      { attributeId: 'gpu', name: 'GPU', value: '12 TFLOPs RDNA 2', group: 'Graphics' },
    ],
    attributes: { storage: '1TB', brand: 'Microsoft', platform: 'xbox' },
    pricePoints: generatePrices(499, ['amazon-us', 'bestbuy', 'walmart']),
    rating: 4.8, reviewCount: 9876, tags: ['gaming', 'xbox', 'console', '4k'],
  },
  {
    id: '19', name: 'DJI Mini 4 Pro', description: 'Lightweight drone with 4K/60fps HDR video, 48MP photos, and 34-min flight time.', brand: 'DJI', model: 'Mini 4 Pro', sku: 'DJI-MINI4PRO', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.drone, thumbnail: productImages.drone, alt: 'DJI Mini 4 Pro', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'camera', name: 'Camera', value: '48MP 1/1.3"', group: 'Camera' },
      { attributeId: 'video', name: 'Video', value: '4K 60fps HDR', group: 'Video' },
      { attributeId: 'flight', name: 'Flight Time', value: '34 minutes', group: 'Battery' },
      { attributeId: 'weight', name: 'Weight', value: '< 249g', group: 'Design' },
    ],
    attributes: { weight: '<249g', range: '10km', brand: 'DJI' },
    pricePoints: generatePrices(759, ['amazon-us', 'bestbuy', 'dji']),
    rating: 4.8, reviewCount: 345, tags: ['drone', 'dji', 'camera', '4k'],
  },

  // FASHION - Shoes
  {
    id: '20', name: 'Nike Air Max 90', description: 'Classic running-inspired sneaker with visible Air cushioning and premium leather.', brand: 'Nike', model: 'Air Max 90', sku: 'DW3381-001', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.shoes, thumbnail: productImages.shoes, alt: 'Nike Air Max 90', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'material', name: 'Material', value: 'Premium Leather', group: 'Upper' },
      { attributeId: 'sole', name: 'Sole', value: 'Air Max cushioning', group: 'Sole' },
      { attributeId: 'closure', name: 'Closure', value: 'Laces', group: 'Fit' },
    ],
    attributes: { material: 'Leather', sport: 'Lifestyle', brand: 'Nike' },
    pricePoints: generatePrices(150, ['nike', 'amazon-us', 'footlocker']),
    rating: 4.7, reviewCount: 4532, tags: ['shoes', 'nike', 'sneakers', 'classic'],
  },
  {
    id: '21', name: 'Adidas Ultraboost 23', description: 'Premium running shoes with BOOST midsole, Primeknit upper, and Continental rubber outsole.', brand: 'Adidas', model: 'Ultraboost 23', sku: 'GW9267', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.shoes, thumbnail: productImages.shoes, alt: 'Adidas Ultraboost', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'midsole', name: 'Midsole', value: 'BOOST', group: 'Cushioning' },
      { attributeId: 'upper', name: 'Upper', value: 'Primeknit+', group: 'Upper' },
      { attributeId: 'outsole', name: 'Outsole', value: 'Continental Rubber', group: 'Traction' },
    ],
    attributes: { material: 'Primeknit', sport: 'Running', brand: 'Adidas' },
    pricePoints: generatePrices(190, ['adidas', 'amazon-us', 'footlocker']),
    rating: 4.6, reviewCount: 2341, tags: ['shoes', 'adidas', 'running', 'boost'],
  },
  {
    id: '22', name: 'Nike Air Jordan 1 Retro High OG', description: 'Iconic basketball sneaker with premium leather, Air-Sole unit, and classic silhouette.', brand: 'Nike', model: 'Air Jordan 1 High', sku: 'DZ5485-612', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.shoes, thumbnail: productImages.shoes, alt: 'Air Jordan 1', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'material', name: 'Material', value: 'Premium Leather', group: 'Upper' },
      { attributeId: 'cushion', name: 'Cushion', value: 'Air-Sole', group: 'Cushioning' },
      { attributeId: 'colorway', name: 'Colorway', value: 'Chicago', group: 'Design' },
    ],
    attributes: { material: 'Leather', sport: 'Basketball', brand: 'Nike' },
    pricePoints: generatePrices(180, ['nike', 'amazon-us', 'finishline']),
    rating: 4.9, reviewCount: 6789, tags: ['shoes', 'nike', 'jordan', 'basketball', 'sneakers'],
  },

  // FASHION - Watches
  {
    id: '23', name: 'Apple Watch Series 9 GPS 45mm', description: 'Advanced smartwatch with S9 chip, brighter display, and carbon-neutral design.', brand: 'Apple', model: 'Series 9 45mm', sku: 'MR903LL/A', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.watch, thumbnail: productImages.watch, alt: 'Apple Watch Series 9', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'display', name: 'Display', value: '45mm Always-On Retina', group: 'Display' },
      { attributeId: 'chip', name: 'Chip', value: 'S9 SiP', group: 'Performance' },
      { attributeId: 'battery', name: 'Battery', value: '18 hours', group: 'Battery' },
    ],
    attributes: { case_size: 45, material: 'Aluminum', brand: 'Apple' },
    pricePoints: generatePrices(429, ['amazon-us', 'bestbuy', 'apple-store']),
    rating: 4.8, reviewCount: 5678, tags: ['watch', 'apple', 'smartwatch', 'fitness'],
  },
  {
    id: '24', name: 'Rolex Submariner Date', description: 'Professional divers watch with Oystersteel, Cerachrom bezel, and 41mm case.', brand: 'Rolex', model: 'Submariner Date', sku: '126610LN', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.watch, thumbnail: productImages.watch, alt: 'Rolex Submariner', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'case', name: 'Case', value: '41mm Oystersteel', group: 'Case' },
      { attributeId: 'movement', name: 'Movement', value: 'Perpetual 3235', group: 'Movement' },
      { attributeId: 'water', name: 'Water Resistance', value: '300m', group: 'Water Resistance' },
    ],
    attributes: { case_size: 41, material: 'Oystersteel', brand: 'Rolex' },
    pricePoints: generatePrices(10100, ['rolex', 'jewelers', 'watchfinder']),
    rating: 4.9, reviewCount: 234, tags: ['watch', 'luxury', 'rolex', 'diver'],
  },

  // FASHION - Bags
  {
    id: '25', name: 'Herschel Supply Co. Classic Backpack', description: ' timeless backpack with 25L capacity, fleece-lined laptop sleeve, and iconic stripe.', brand: 'Herschel', model: 'Classic', sku: '10007-00890', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.bag, thumbnail: productImages.bag, alt: 'Herschel Backpack', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '25L', group: 'Storage' },
      { attributeId: 'laptop', name: 'Laptop', value: '15" sleeve', group: 'Features' },
      { attributeId: 'material', name: 'Material', value: 'Polyester', group: 'Material' },
    ],
    attributes: { capacity: '25L', laptop_size: '15"', brand: 'Herschel' },
    pricePoints: generatePrices(65, ['amazon-us', 'herschel', 'target']),
    rating: 4.5, reviewCount: 3456, tags: ['bag', 'backpack', 'herschel', 'student'],
  },
  {
    id: '26', name: 'Nike Brasilia Training Duffle Bag', description: 'Spacious training bag with wet pocket, shoes compartment, and durable construction.', brand: 'Nike', model: 'Brasilia', sku: 'BA6033-010', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.bag, thumbnail: productImages.bag, alt: 'Nike Brasilia', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '30L', group: 'Storage' },
      { attributeId: 'pockets', name: 'Pockets', value: 'Multiple', group: 'Features' },
      { attributeId: 'material', name: 'Material', value: 'Polyester', group: 'Material' },
    ],
    attributes: { capacity: '30L', sport: 'Training', brand: 'Nike' },
    pricePoints: generatePrices(45, ['nike', 'amazon-us', 'dicks']),
    rating: 4.6, reviewCount: 2345, tags: ['bag', 'duffle', 'nike', 'training'],
  },

  // FASHION - Clothing
  {
    id: '27', name: 'Champion Classic Reverse Weave Pullover', description: 'Iconic reverse weave hoodie with fleece lining, crew neck, and athletic fit.', brand: 'Champion', model: 'Reverse Weave', sku: 'K2124', categoryId: 'fashion',
    images: [{ id: '1', url: productImages.clothing, thumbnail: productImages.clothing, alt: 'Champion Hoodie', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'material', name: 'Material', value: 'Cotton/Polyester Fleece', group: 'Material' },
      { attributeId: 'fit', name: 'Fit', value: 'Athletic', group: 'Fit' },
      { attributeId: 'features', name: 'Features', value: 'Reverse Weave', group: 'Design' },
    ],
    attributes: { material: 'Cotton Fleece', style: 'Hoodie', brand: 'Champion' },
    pricePoints: generatePrices(70, ['amazon-us', 'champion', 'target']),
    rating: 4.5, reviewCount: 3456, tags: ['clothing', 'hoodie', 'champion', 'sweatshirt'],
  },

  // BEAUTY
  {
    id: '28', name: 'Dyson Airwrap Multi-Styler Complete', description: 'Versatile hair styling tool with Coanda attachments, intelligent heat control, and multiple barrels.', brand: 'Dyson', model: 'Airwrap Complete', sku: '388100-01', categoryId: 'beauty',
    images: [{ id: '1', url: productImages.beauty, thumbnail: productImages.beauty, alt: 'Dyson Airwrap', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'heat', name: 'Heat Control', value: 'Intelligent 105°F', group: 'Features' },
      { attributeId: 'attachments', name: 'Attachments', value: '8+ attachments', group: 'Features' },
      { attributeId: 'voltage', name: 'Voltage', value: '120V/240V', group: 'Power' },
    ],
    attributes: { type: 'Styler', color: 'Nickel/Copper', brand: 'Dyson' },
    pricePoints: generatePrices(599, ['dyson', 'amazon-us', 'sephora']),
    rating: 4.4, reviewCount: 2345, tags: ['beauty', 'dyson', 'hair-styling', 'premium'],
  },
  {
    id: '29', name: 'La Mer Crème de la Mer Moisturizer', description: 'Luxury face cream with Miracle Broth, ideal for dry/combination skin.', brand: 'La Mer', model: 'Crème de la Mer', sku: 'A1021', categoryId: 'beauty',
    images: [{ id: '1', url: productImages.beauty, thumbnail: productImages.beauty, alt: 'La Mer Cream', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'size', name: 'Size', value: '60ml', group: 'Details' },
      { attributeId: 'ingredient', name: 'Key Ingredient', value: 'Miracle Broth', group: 'Formula' },
      { attributeId: 'skin', name: 'Skin Type', value: 'All Skin Types', group: 'Usage' },
    ],
    attributes: { size: '60ml', type: 'Moisturizer', brand: 'La Mer' },
    pricePoints: generatePrices(380, ['sephora', 'nordstrom', 'dermstore']),
    rating: 4.6, reviewCount: 567, tags: ['beauty', 'skincare', 'luxury', 'moisturizer'],
  },

  // HOME APPLIANCES
  {
    id: '30', name: 'Dyson V15 Detect Vacuum', description: 'Cordless vacuum with laser dust detection, piezo sensor, and 60-minute runtime.', brand: 'Dyson', model: 'V15 Detect', sku: '358639-01', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Dyson V15', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'runtime', name: 'Runtime', value: '60 minutes', group: 'Battery' },
      { attributeId: 'suction', name: 'Suction', value: '240AW', group: 'Performance' },
      { attributeId: 'features', name: 'Features', value: 'Laser Dust Detection', group: 'Features' },
    ],
    attributes: { type: 'Cordless Stick', runtime: '60min', brand: 'Dyson' },
    pricePoints: generatePrices(749, ['dyson', 'amazon-us', 'bestbuy']),
    rating: 4.7, reviewCount: 3456, tags: ['appliance', 'dyson', 'vacuum', 'cordless'],
  },
  {
    id: '31', name: 'KitchenAid Stand Mixer 5-Quart', description: 'Professional stand mixer with 10 speeds, 5-quart bowl, and multiple attachments.', brand: 'KitchenAid', model: 'Artisan Series 5', sku: 'KSM150PSER', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'KitchenAid Mixer', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '5-Quart', group: 'Capacity' },
      { attributeId: 'speeds', name: 'Speeds', value: '10 speeds', group: 'Performance' },
      { attributeId: 'motor', name: 'Motor', value: '325W', group: 'Performance' },
    ],
    attributes: { type: 'Stand Mixer', capacity: '5qt', brand: 'KitchenAid' },
    pricePoints: generatePrices(449, ['amazon-us', 'target', 'kitchenaid']),
    rating: 4.8, reviewCount: 5678, tags: ['appliance', 'kitchenaid', 'mixer', 'kitchen'],
  },
  {
    id: '32', name: 'Ninja Foodi 10-in-1 Air Fryer', description: 'Versatile air fryer with 10 functions, 8-quart capacity, and XL window.', brand: 'Ninja', model: 'Foodi 10-in-1', sku: 'AF100', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Ninja Air Fryer', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '8-Quart', group: 'Capacity' },
      { attributeId: 'functions', name: 'Functions', value: '10-in-1', group: 'Features' },
      { attributeId: 'temp', name: 'Temp Range', value: '105°F - 450°F', group: 'Performance' },
    ],
    attributes: { type: 'Air Fryer', capacity: '8qt', brand: 'Ninja' },
    pricePoints: generatePrices(229, ['amazon-us', 'walmart', 'target']),
    rating: 4.6, reviewCount: 4567, tags: ['appliance', 'ninja', 'air-fryer', 'kitchen'],
  },
  {
    id: '33', name: 'Samsung Bespoke AI Refrigerator', description: 'Smart refrigerator with 4-door design, AI Family Hub, and customizable panels.', brand: 'Samsung', model: 'Bespoke AI', sku: 'RF30BB', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Samsung Fridge', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '30 cu. ft.', group: 'Capacity' },
      { attributeId: 'features', name: 'Features', value: 'AI Family Hub', group: 'Smart' },
      { attributeId: 'type', name: 'Type', value: '4-Door French Door', group: 'Type' },
    ],
    attributes: { type: 'Refrigerator', capacity: '30cuft', brand: 'Samsung' },
    pricePoints: generatePrices(2899, ['amazon-us', 'bestbuy', 'homedepot']),
    rating: 4.5, reviewCount: 234, tags: ['appliance', 'samsung', 'refrigerator', 'smart'],
  },

  // FURNITURE
  {
    id: '34', name: 'West Elm Harmony Sofa', description: 'Modern sofa with down-blend cushions, solid wood frame, and customizable options.', brand: 'West Elm', model: 'Harmony', sku: '10868', categoryId: 'furniture',
    images: [{ id: '1', url: productImages.furniture, thumbnail: productImages.furniture, alt: 'West Elm Sofa', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'dimensions', name: 'Dimensions', value: '84"W x 38"D x 34"H', group: 'Size' },
      { attributeId: 'material', name: 'Material', value: 'Solid Wood Frame', group: 'Construction' },
      { attributeId: 'cushion', name: 'Cushion', value: 'Down-Blend', group: 'Comfort' },
    ],
    attributes: { type: 'Sofa', material: 'Wood/Upholstery', brand: 'West Elm' },
    pricePoints: generatePrices(2099, ['west-elm', 'amazon-us', 'wayfair']),
    rating: 4.4, reviewCount: 123, tags: ['furniture', 'sofa', 'west-elm', 'modern'],
  },
  {
    id: '35', name: 'Herman Miller Aeron Chair', description: 'Ergonomic office chair with PostureFit SL, 8Z Pellicle, and fully adjustable arms.', brand: 'Herman Miller', model: 'Aeron', sku: 'AER1B23BP', categoryId: 'furniture',
    images: [{ id: '1', url: productImages.furniture, thumbnail: productImages.furniture, alt: 'Herman Miller Aeron', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'size', name: 'Size', value: 'Size B (Medium)', group: 'Size' },
      { attributeId: 'material', name: 'Material', value: '8Z Pellicle', group: 'Seat' },
      { attributeId: 'lumbar', name: 'Lumbar', value: 'PostureFit SL', group: 'Support' },
    ],
    attributes: { type: 'Office Chair', material: 'Mesh', brand: 'Herman Miller' },
    pricePoints: generatePrices(1395, ['herman-miller', 'amazon-us', 'design-within-reach']),
    rating: 4.9, reviewCount: 2345, tags: ['furniture', 'chair', 'herman-miller', 'ergonomic', 'office'],
  },

  // SPORTS
  {
    id: '36', name: 'Peloton Bike+', description: 'Interactive stationary bike with 24" rotating HD touchscreen and Apple GymKit integration.', brand: 'Peloton', model: 'Bike+', sku: 'PLT-BIKEPLUS-02', categoryId: 'sports',
    images: [{ id: '1', url: productImages.sports, thumbnail: productImages.sports, alt: 'Peloton Bike+', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'screen', name: 'Screen', value: '24" HD Rotating', group: 'Display' },
      { attributeId: 'resistance', name: 'Resistance', value: '100 Levels', group: 'Performance' },
      { attributeId: 'speakers', name: 'Speakers', value: '2 x 10W', group: 'Audio' },
    ],
    attributes: { type: 'Stationary Bike', screen_size: '24"', brand: 'Peloton' },
    pricePoints: generatePrices(2495, ['peloton', 'amazon-us', 'bestbuy']),
    rating: 4.6, reviewCount: 3456, tags: ['sports', 'peloton', 'exercise-bike', 'fitness'],
  },
  {
    id: '37', name: 'Nike Metcon 9', description: 'Versatile training shoe with stable heel, breathable mesh, and durable rubber outsole.', brand: 'Nike', model: 'Metcon 9', sku: 'DX9236-001', categoryId: 'sports',
    images: [{ id: '1', url: productImages.shoes, thumbnail: productImages.shoes, alt: 'Nike Metcon 9', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'drop', name: 'Heel Drop', value: '4mm', group: 'Support' },
      { attributeId: 'weight', name: 'Weight', value: '8.1oz', group: 'Weight' },
      { attributeId: 'sole', name: 'Sole', value: 'Rubber', group: 'Traction' },
    ],
    attributes: { type: 'Training Shoe', sport: 'CrossFit', brand: 'Nike' },
    pricePoints: generatePrices(150, ['nike', 'amazon-us', 'dicks']),
    rating: 4.7, reviewCount: 1234, tags: ['sports', 'nike', 'training', 'crossfit'],
  },
  {
    id: '38', name: 'Title Boxing Pro Style Heavy Bag', description: 'Professional heavy bag with premium leather, 100lb weight, and reinforced straps.', brand: 'Title Boxing', model: 'Pro Style', sku: 'PB-100', categoryId: 'sports',
    images: [{ id: '1', url: productImages.sports, thumbnail: productImages.sports, alt: 'Boxing Heavy Bag', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'weight', name: 'Weight', value: '100 lbs', group: 'Weight' },
      { attributeId: 'material', name: 'Material', value: 'Premium Leather', group: 'Material' },
      { attributeId: 'length', name: 'Length', value: '4 ft', group: 'Size' },
    ],
    attributes: { type: 'Heavy Bag', weight: '100lb', brand: 'Title Boxing' },
    pricePoints: generatePrices(299, ['title-boxing', 'amazon-us', 'rebelfight']),
    rating: 4.8, reviewCount: 567, tags: ['sports', 'boxing', 'training', 'heavy-bag'],
  },

  // AUTOMOTIVE
  {
    id: '39', name: 'Garmin DriveSmart 86 GPS', description: '8" GPS navigator with traffic alerts, voice assist, and wireless smartphone integration.', brand: 'Garmin', model: 'DriveSmart 86', sku: '010-02836-00', categoryId: 'automotive',
    images: [{ id: '1', url: productImages.sports, thumbnail: productImages.sports, alt: 'Garmin GPS', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'screen', name: 'Screen', value: '8" HD', group: 'Display' },
      { attributeId: 'features', name: 'Features', value: 'Voice Assist', group: 'Features' },
      { attributeId: 'connectivity', name: 'Connectivity', value: 'WiFi + Bluetooth', group: 'Connectivity' },
    ],
    attributes: { type: 'GPS', screen_size: '8"', brand: 'Garmin' },
    pricePoints: generatePrices(399, ['amazon-us', 'bestbuy', 'garmin']),
    rating: 4.5, reviewCount: 678, tags: ['automotive', 'garmin', 'gps', 'navigation'],
  },
  {
    id: '40', name: 'Dashcam 4K Ultra HD Car Camera', description: '4K dash cam with night vision, loop recording, and G-sensor accident protection.', brand: 'Rexing', model: 'V1 4K', sku: 'REX-V1-4K', categoryId: 'automotive',
    images: [{ id: '1', url: productImages.sports, thumbnail: productImages.sports, alt: 'Dashcam', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'resolution', name: 'Resolution', value: '4K Ultra HD', group: 'Video' },
      { attributeId: 'night', name: 'Night Vision', value: 'Super Night Vision', group: 'Features' },
      { attributeId: 'storage', name: 'Storage', value: '256GB Max', group: 'Storage' },
    ],
    attributes: { type: 'Dashcam', resolution: '4K', brand: 'Rexing' },
    pricePoints: generatePrices(129, ['amazon-us', 'bestbuy', 'walmart']),
    rating: 4.4, reviewCount: 2345, tags: ['automotive', 'dashcam', '4k', 'security'],
  },

  // KIDS & TOYS
  {
    id: '41', name: 'LEGO Star Wars Millennium Falcon', description: 'Ultimate collectors edition Millennium Falcon with 7541 pieces and detailed interior.', brand: 'LEGO', model: 'Star Wars 75192', sku: '75192', categoryId: 'kids-toys',
    images: [{ id: '1', url: productImages.sports, thumbnail: productImages.sports, alt: 'LEGO Millennium Falcon', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'pieces', name: 'Pieces', value: '7,541', group: 'Details' },
      { attributeId: 'theme', name: 'Theme', value: 'Star Wars', group: 'Theme' },
      { attributeId: 'age', name: 'Age', value: '16+', group: 'Age' },
    ],
    attributes: { type: 'Building Set', pieces: '7541', brand: 'LEGO' },
    pricePoints: generatePrices(849, ['lego', 'amazon-us', 'target']),
    rating: 4.9, reviewCount: 1234, tags: ['toys', 'lego', 'star-wars', 'collectible'],
  },
  {
    id: '42', name: 'PlayStation 5 DualSense Controller', description: 'Next-gen controller with haptic feedback, adaptive triggers, and built-in microphone.', brand: 'Sony', model: 'DualSense', sku: 'CFI-ZCV1', categoryId: 'kids-toys',
    images: [{ id: '1', url: productImages.gaming, thumbnail: productImages.gaming, alt: 'DualSense Controller', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'features', name: 'Features', value: 'Haptic Feedback', group: 'Features' },
      { attributeId: 'triggers', name: 'Triggers', value: 'Adaptive', group: 'Features' },
      { attributeId: 'battery', name: 'Battery', value: 'Rechargeable', group: 'Battery' },
    ],
    attributes: { platform: 'PlayStation 5', type: 'Controller', brand: 'Sony' },
    pricePoints: generatePrices(75, ['amazon-us', 'bestbuy', 'target']),
    rating: 4.8, reviewCount: 5678, tags: ['gaming', 'controller', 'playstation', 'accessories'],
  },

  // OFFICE
  {
    id: '43', name: 'HP OfficeJet Pro 9015e Printer', description: 'All-in-one printer with automatic document feeder, double-sided printing, and HP+ smart features.', brand: 'HP', model: 'OfficeJet Pro 9015e', sku: '1G5M3A#BH3', categoryId: 'office-stationery',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'HP Printer', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'type', name: 'Type', value: 'All-in-One', group: 'Type' },
      { attributeId: 'print', name: 'Print Speed', value: '22 ppm', group: 'Performance' },
      { attributeId: 'duplex', name: 'Duplex', value: 'Automatic', group: 'Features' },
    ],
    attributes: { type: 'All-in-One Printer', color: 'Color', brand: 'HP' },
    pricePoints: generatePrices(249, ['amazon-us', 'bestbuy', 'staples']),
    rating: 4.3, reviewCount: 3456, tags: ['office', 'printer', 'hp', 'all-in-one'],
  },
  {
    id: '44', name: 'Bose QuietComfort 45 Headphones', description: 'Premium noise-canceling headphones with 24-hour battery andAware mode.', brand: 'Bose', model: 'QC45', sku: '866724-0100', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.headphones, thumbnail: productImages.headphones, alt: 'Bose QC45', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'anc', name: 'Noise Cancellation', value: 'Active (Adjustable)', group: 'Features' },
      { attributeId: 'battery', name: 'Battery', value: '24 hours', group: 'Battery' },
      { attributeId: 'driver', name: 'Drivers', value: 'Bose-custom', group: 'Audio' },
    ],
    attributes: { type: 'Over-ear', connectivity: 'Bluetooth 5.1', brand: 'Bose' },
    pricePoints: generatePrices(329, ['amazon-us', 'bestbuy', 'bose']),
    rating: 4.6, reviewCount: 4567, tags: ['headphones', 'bose', 'noise-canceling', 'premium-audio'],
  },
  {
    id: '45', name: 'JBL Flip 6 Portable Speaker', description: 'Compact waterproof Bluetooth speaker with 12 hours battery and PartyBoost feature.', brand: 'JBL', model: 'Flip 6', sku: 'JBLFLIP6BLK', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.headphones, thumbnail: productImages.headphones, alt: 'JBL Flip 6', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'battery', name: 'Battery', value: '12 hours', group: 'Battery' },
      { attributeId: 'waterproof', name: 'Waterproof', value: 'IPX7', group: 'Durability' },
      { attributeId: 'output', name: 'Output', value: '20W RMS', group: 'Audio' },
    ],
    attributes: { type: 'Portable Speaker', waterproof: 'IPX7', brand: 'JBL' },
    pricePoints: generatePrices(129, ['amazon-us', 'bestbuy', 'target']),
    rating: 4.7, reviewCount: 5678, tags: ['audio', 'jbl', 'speaker', 'portable', 'bluetooth'],
  },
  {
    id: '46', name: 'Fitbit Charge 6 Fitness Tracker', description: 'Advanced fitness tracker with Google integrations, GPS, and 7-day battery.', brand: 'Fitbit', model: 'Charge 6', sku: 'FB512GLP', categoryId: 'electronics',
    images: [{ id: '1', url: productImages.smartwatch, thumbnail: productImages.smartwatch, alt: 'Fitbit Charge 6', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'battery', name: 'Battery', value: '7 days', group: 'Battery' },
      { attributeId: 'gps', name: 'GPS', value: 'Built-in', group: 'Features' },
      { attributeId: 'display', name: 'Display', value: 'AMOLED', group: 'Display' },
    ],
    attributes: { type: 'Fitness Tracker', waterproof: '50m', brand: 'Fitbit' },
    pricePoints: generatePrices(159, ['amazon-us', 'bestbuy', 'fitbit']),
    rating: 4.5, reviewCount: 3456, tags: ['fitness', 'fitbit', 'tracker', 'gps'],
  },
  {
    id: '47', name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker', description: 'Multi-functional cooker with 6 quart capacity, 14 smart programs, and stainless steel inner pot.', brand: 'Instant Pot', model: 'Duo 7-in-1', sku: 'IP-DUO60', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Instant Pot', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '6 Quart', group: 'Capacity' },
      { attributeId: 'programs', name: 'Programs', value: '14 Smart Programs', group: 'Features' },
      { attributeId: 'power', name: 'Power', value: '1000W', group: 'Power' },
    ],
    attributes: { type: 'Pressure Cooker', capacity: '6qt', brand: 'Instant Pot' },
    pricePoints: generatePrices(89, ['amazon-us', 'walmart', 'target']),
    rating: 4.7, reviewCount: 12345, tags: ['appliance', 'instant-pot', 'pressure-cooker', 'kitchen'],
  },
  {
    id: '48', name: 'Weber Spirit II E-310 Gas Grill', description: '3-burner gas grill with porcelain-enameled cast iron grates, side tables, and GS4 grilling system.', brand: 'Weber', model: 'Spirit II E-310', sku: '45010001', categoryId: 'garden-diy',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Weber Grill', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'burners', name: 'Burners', value: '3', group: 'Cooking' },
      { attributeId: 'btu', name: 'BTU', value: '30,000', group: 'Performance' },
      { attributeId: 'grates', name: 'Grates', value: 'Porcelain-Enameled Cast Iron', group: 'Cooking' },
    ],
    attributes: { type: 'Gas Grill', burners: '3', brand: 'Weber' },
    pricePoints: generatePrices(549, ['amazon-us', 'homedepot', 'lowes']),
    rating: 4.7, reviewCount: 2345, tags: ['garden', 'grill', 'weber', 'outdoor'],
  },
  {
    id: '49', name: 'Weber Original Kettle Premium Charcoal Grill', description: 'Classic 22-inch charcoal grill with One-Touch cleaning system and ash catcher.', brand: 'Weber', model: 'Original Kettle', sku: '14502001', categoryId: 'garden-diy',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Weber Charcoal Grill', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'size', name: 'Size', value: '22" Diameter', group: 'Size' },
      { attributeId: 'material', name: 'Material', value: 'Porcelain-Enameled', group: 'Material' },
      { attributeId: 'features', name: 'Features', value: 'One-Touch Cleaning', group: 'Features' },
    ],
    attributes: { type: 'Charcoal Grill', size: '22"', brand: 'Weber' },
    pricePoints: generatePrices(199, ['amazon-us', 'homedepot', 'target']),
    rating: 4.8, reviewCount: 3456, tags: ['garden', 'grill', 'weber', 'charcoal'],
  },
  {
    id: '50', name: 'Ninja DT201 Professional Air Fryer XXL', description: 'Extra-large air fryer with 5.5 quart capacity, 4-Quart oven, and dehydrate function.', brand: 'Ninja', model: 'Foodi 4-Quart', sku: 'DT201', categoryId: 'appliances',
    images: [{ id: '1', url: productImages.appliance, thumbnail: productImages.appliance, alt: 'Ninja Air Fryer XXL', type: 'main', order: 1 }],
    specifications: [
      { attributeId: 'capacity', name: 'Capacity', value: '4-Quart + 5.5-Quart', group: 'Capacity' },
      { attributeId: 'functions', name: 'Functions', value: '5-in-1', group: 'Features' },
      { attributeId: 'temp', name: 'Temp', value: '105°F - 450°F', group: 'Performance' },
    ],
    attributes: { type: 'Air Fryer', capacity: '5.5qt', brand: 'Ninja' },
    pricePoints: generatePrices(229, ['amazon-us', 'bestbuy', 'walmart']),
    rating: 4.6, reviewCount: 5678, tags: ['appliance', 'ninja', 'air-fryer', 'xxl'],
  },
];

// Generate price range for each product
SEED_PRODUCTS.forEach(product => {
  const prices = product.pricePoints.map(p => p.price);
  product.pricePoints.forEach(pp => {
    pp.price = Math.round(pp.price * 100) / 100;
    pp.originalPrice = Math.round(pp.originalPrice * 100) / 100;
    pp.discountPercent = Math.round((1 - pp.price / pp.originalPrice) * 100);
  });
  
  product.pricePoints.sort((a, b) => a.price - b.price);
  
  // Calculate price range (convert to USD for consistency)
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  product.pricePoints.forEach(pp => {
    pp.retailer = getRetailer(pp.retailerId);
  });
});

export default SEED_PRODUCTS;

console.log(`✅ Generated ${SEED_PRODUCTS.length} seed products`);
console.log('\nCategories represented:');
const categories = [...new Set(SEED_PRODUCTS.map(p => p.categoryId))];
categories.forEach(cat => {
  const count = SEED_PRODUCTS.filter(p => p.categoryId === cat).length;
  console.log(`  - ${cat}: ${count} products`);
});
