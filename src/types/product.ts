/**
 * PriceX - Product Types & Category Schema
 * Comprehensive product data structures
 */

import { Currency, Region } from './index';
import { User } from './auth';

// Product Category Types
export type CategoryId = 
  | 'electronics'
  | 'appliances'
  | 'fashion'
  | 'beauty'
  | 'groceries'
  | 'automotive'
  | 'health-fitness'
  | 'kids-toys'
  | 'office-stationery'
  | 'sports'
  | 'media'
  | 'pets'
  | 'garden-diy'
  | 'travel'
  | 'luxury-watches'
  | 'software-gadgets'
  | 'furniture'
  | 'pharma-otc'
  | 'art-collectibles'
  | 'musical-instruments'
  | 'industrial-machinery'
  | 'smart-home-iot'
  | 'digital-goods'
  | 'finance-insurance'
  | 'green-eco';

// Category Structure
export interface Category {
  id: CategoryId;
  name: string;
  nameLocalized: Record<string, string>;
  description: string;
  icon: string;
  image: string;
  parentId: CategoryId | null;
  children: CategoryId[];
  attributes: ProductAttribute[];
  filters: FilterConfig[];
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Product Attribute Definition
export interface ProductAttribute {
  id: string;
  name: string;
  nameLocalized?: Record<string, string>;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'range' | 'color';
  unit?: string;
  options?: string[];
  isRequired: boolean;
  isFilterable: boolean;
  isComparable: boolean;
  categoryIds: CategoryId[];
}

// Filter Configuration
export interface FilterConfig {
  attributeId: string;
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'rating';
  displayName: string;
  sortOrder: number;
}

// Complete Category Schema
export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    nameLocalized: {
      en: 'Electronics',
      ar: 'إلكترونيات',
      es: 'Electrónica',
      fr: 'Électronique',
      zh: '电子产品',
    },
    description: 'Smartphones, laptops, tablets, cameras, and consumer electronics',
    icon: 'smartphone',
    image: '/categories/electronics.jpg',
    parentId: null,
    children: ['smart-home-iot', 'software-gadgets'],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['electronics'] },
      { id: 'model', name: 'Model', type: 'text', isRequired: true, isFilterable: false, isComparable: true, categoryIds: ['electronics'] },
      { id: 'screen_size', name: 'Screen Size', type: 'range', unit: 'inches', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['electronics'] },
      { id: 'storage', name: 'Storage', type: 'select', unit: 'GB', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['electronics'] },
      { id: 'color', name: 'Color', type: 'color', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['electronics'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'screen_size', type: 'range', displayName: 'Screen Size', sortOrder: 2 },
      { attributeId: 'storage', type: 'checkbox', displayName: 'Storage', sortOrder: 3 },
      { attributeId: 'color', type: 'color', displayName: 'Color', sortOrder: 4 },
    ],
    sortOrder: 1,
    isActive: true,
    productCount: 2500000,
    seo: {
      title: 'Electronics - Compare Prices on Smartphones, Laptops & More',
      description: 'Find the best deals on electronics. Compare prices from trusted retailers.',
      keywords: ['electronics', 'smartphones', 'laptops', 'tablets', 'cameras'],
    },
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    nameLocalized: { en: 'Home Appliances', ar: 'أجهزة منزلية', es: 'Electrodomésticos', fr: 'Appareils ménagers', zh: '家用电器' },
    description: 'Kitchen appliances, laundry machines, refrigerators, and home equipment',
    icon: 'home',
    image: '/categories/appliances.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['appliances'] },
      { id: 'energy_rating', name: 'Energy Rating', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['appliances'] },
      { id: 'capacity', name: 'Capacity', type: 'range', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['appliances'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'energy_rating', type: 'checkbox', displayName: 'Energy Rating', sortOrder: 2 },
    ],
    sortOrder: 2,
    isActive: true,
    productCount: 850000,
    seo: { title: 'Home Appliances - Best Prices on Kitchen & Laundry', description: 'Compare appliance prices', keywords: ['appliances', 'refrigerator', 'washing machine'] },
  },
  {
    id: 'fashion',
    name: 'Fashion',
    nameLocalized: { en: 'Fashion', ar: 'أزياء', es: 'Moda', fr: 'Mode', zh: '时尚' },
    description: 'Clothing, shoes, accessories, and jewelry for men, women, and children',
    icon: 'shirt',
    image: '/categories/fashion.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['fashion'] },
      { id: 'size', name: 'Size', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['fashion'] },
      { id: 'color', name: 'Color', type: 'color', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['fashion'] },
      { id: 'material', name: 'Material', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['fashion'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'size', type: 'checkbox', displayName: 'Size', sortOrder: 2 },
      { attributeId: 'color', type: 'color', displayName: 'Color', sortOrder: 3 },
    ],
    sortOrder: 3,
    isActive: true,
    productCount: 5000000,
    seo: { title: 'Fashion - Clothing, Shoes & Accessories', description: 'Compare fashion prices', keywords: ['fashion', 'clothing', 'shoes'] },
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    nameLocalized: { en: 'Beauty', ar: 'جمال', es: 'Belleza', fr: 'Beauté', zh: '美容' },
    description: 'Skincare, makeup, haircare, fragrances, and personal care products',
    icon: 'sparkles',
    image: '/categories/beauty.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['beauty'] },
      { id: 'skin_type', name: 'Skin Type', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['beauty'] },
      { id: 'concern', name: 'Concern', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['beauty'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'skin_type', type: 'checkbox', displayName: 'Skin Type', sortOrder: 2 },
    ],
    sortOrder: 4,
    isActive: true,
    productCount: 1200000,
    seo: { title: 'Beauty Products - Skincare & Makeup Deals', description: 'Compare beauty prices', keywords: ['beauty', 'skincare', 'makeup'] },
  },
  {
    id: 'groceries',
    name: 'Groceries',
    nameLocalized: { en: 'Groceries', ar: 'مواد غذائية', es: 'Comestibles', fr: 'Épicerie', zh: '杂货' },
    description: 'Fresh food, beverages, pantry staples, and household essentials',
    icon: 'shopping-basket',
    image: '/categories/groceries.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['groceries'] },
      { id: 'weight', name: 'Weight/Volume', type: 'range', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['groceries'] },
      { id: 'dietary', name: 'Dietary', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['groceries'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'dietary', type: 'checkbox', displayName: 'Dietary Preferences', sortOrder: 2 },
    ],
    sortOrder: 5,
    isActive: true,
    productCount: 3000000,
    seo: { title: 'Groceries - Compare Food & Beverage Prices', description: 'Compare grocery prices', keywords: ['groceries', 'food', 'beverages'] },
  },
  {
    id: 'automotive',
    name: 'Automotive',
    nameLocalized: { en: 'Automotive', ar: 'سيارات', es: 'Automotriz', fr: 'Automobile', zh: '汽车' },
    description: 'Car parts, accessories, tires, tools, and vehicle maintenance products',
    icon: 'car',
    image: '/categories/automotive.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['automotive'] },
      { id: 'vehicle_make', name: 'Vehicle Make', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['automotive'] },
      { id: 'vehicle_model', name: 'Vehicle Model', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['automotive'] },
      { id: 'part_type', name: 'Part Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['automotive'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'vehicle_make', type: 'checkbox', displayName: 'Vehicle Make', sortOrder: 2 },
      { attributeId: 'part_type', type: 'checkbox', displayName: 'Part Type', sortOrder: 3 },
    ],
    sortOrder: 6,
    isActive: true,
    productCount: 600000,
    seo: { title: 'Automotive Parts & Accessories', description: 'Compare auto parts prices', keywords: ['automotive', 'car parts', 'tires'] },
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    nameLocalized: { en: 'Health & Fitness', ar: 'الصحة واللياقة', es: 'Salud y Fitness', fr: 'Santé et Fitness', zh: '健康健身' },
    description: 'Exercise equipment, supplements, wellness products, and medical devices',
    icon: 'dumbbell',
    image: '/categories/health-fitness.jpg',
    parentId: null,
    children: ['pharma-otc'],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['health-fitness'] },
      { id: 'category_type', name: 'Category', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['health-fitness'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'category_type', type: 'checkbox', displayName: 'Category', sortOrder: 2 },
    ],
    sortOrder: 7,
    isActive: true,
    productCount: 450000,
    seo: { title: 'Health & Fitness Products', description: 'Compare fitness equipment prices', keywords: ['fitness', 'exercise', 'supplements'] },
  },
  {
    id: 'pharma-otc',
    name: 'Pharmacy & OTC',
    nameLocalized: { en: 'Pharmacy', ar: 'صيدلية', es: 'Farmacia', fr: 'Pharmacie', zh: '药店' },
    description: 'Over-the-counter medicines, vitamins, and health supplements',
    icon: 'pill',
    image: '/categories/pharma.jpg',
    parentId: 'health-fitness',
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['pharma-otc'] },
      { id: 'form', name: 'Form', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['pharma-otc'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
    ],
    sortOrder: 8,
    isActive: true,
    productCount: 150000,
    seo: { title: 'Pharmacy & OTC Medicines', description: 'Compare medicine prices', keywords: ['pharmacy', 'medicine', 'vitamins'] },
  },
  {
    id: 'kids-toys',
    name: 'Kids & Toys',
    nameLocalized: { en: 'Kids & Toys', ar: 'أطفال وألعاب', es: 'Niños y Juguetes', fr: 'Enfants et Jouets', zh: '儿童玩具' },
    description: 'Toys, games, baby products, and children\'s clothing',
    icon: 'toy-brick',
    image: '/categories/kids.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['kids-toys'] },
      { id: 'age_range', name: 'Age Range', type: 'range', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['kids-toys'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'age_range', type: 'range', displayName: 'Age Range', sortOrder: 2 },
    ],
    sortOrder: 9,
    isActive: true,
    productCount: 900000,
    seo: { title: 'Kids & Toys - Best Prices on Games', description: 'Compare toy prices', keywords: ['toys', 'games', 'kids'] },
  },
  {
    id: 'furniture',
    name: 'Furniture',
    nameLocalized: { en: 'Furniture', ar: 'أثاث', es: 'Muebles', fr: 'Meubles', zh: '家具' },
    description: 'Indoor and outdoor furniture for home and office',
    icon: 'sofa',
    image: '/categories/furniture.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['furniture'] },
      { id: 'material', name: 'Material', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['furniture'] },
      { id: 'room', name: 'Room', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['furniture'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'material', type: 'checkbox', displayName: 'Material', sortOrder: 2 },
    ],
    sortOrder: 10,
    isActive: true,
    productCount: 400000,
    seo: { title: 'Furniture - Home & Office', description: 'Compare furniture prices', keywords: ['furniture', 'sofa', 'table'] },
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    nameLocalized: { en: 'Sports', ar: 'رياضة', es: 'Deportes', fr: 'Sports', zh: '运动' },
    description: 'Sporting goods, outdoor equipment, and athletic apparel',
    icon: 'volleyball',
    image: '/categories/sports.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['sports'] },
      { id: 'sport_type', name: 'Sport Type', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['sports'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'sport_type', type: 'checkbox', displayName: 'Sport', sortOrder: 2 },
    ],
    sortOrder: 11,
    isActive: true,
    productCount: 700000,
    seo: { title: 'Sports & Outdoors Equipment', description: 'Compare sports equipment prices', keywords: ['sports', 'fitness', 'outdoor'] },
  },
  {
    id: 'office-stationery',
    name: 'Office & Stationery',
    nameLocalized: { en: 'Office', ar: 'مكتب', es: 'Oficina', fr: 'Bureau', zh: '办公用品' },
    description: 'Office supplies, stationery, printers, and business equipment',
    icon: 'printer',
    image: '/categories/office.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['office-stationery'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
    ],
    sortOrder: 12,
    isActive: true,
    productCount: 350000,
    seo: { title: 'Office Supplies & Stationery', description: 'Compare office supply prices', keywords: ['office', 'stationery', 'supplies'] },
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    nameLocalized: { en: 'Media', ar: 'وسائط', es: 'Medios', fr: 'Médias', zh: '媒体' },
    description: 'Books, music, movies, video games, and streaming subscriptions',
    icon: 'book-open',
    image: '/categories/media.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'format', name: 'Format', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['media'] },
      { id: 'genre', name: 'Genre', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['media'] },
    ],
    filters: [
      { attributeId: 'format', type: 'checkbox', displayName: 'Format', sortOrder: 1 },
      { attributeId: 'genre', type: 'checkbox', displayName: 'Genre', sortOrder: 2 },
    ],
    sortOrder: 13,
    isActive: true,
    productCount: 2000000,
    seo: { title: 'Books, Movies, Music & Games', description: 'Compare media prices', keywords: ['books', 'movies', 'games', 'music'] },
  },
  {
    id: 'pets',
    name: 'Pets',
    nameLocalized: { en: 'Pets', ar: 'حيوانات أليفة', es: 'Mascotas', fr: 'Animaux', zh: '宠物' },
    description: 'Pet food, supplies, accessories, and care products',
    icon: 'paw-print',
    image: '/categories/pets.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['pets'] },
      { id: 'pet_type', name: 'Pet Type', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['pets'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'pet_type', type: 'checkbox', displayName: 'Pet Type', sortOrder: 2 },
    ],
    sortOrder: 14,
    isActive: true,
    productCount: 300000,
    seo: { title: 'Pet Supplies & Food', description: 'Compare pet product prices', keywords: ['pets', 'pet food', 'pet supplies'] },
  },
  {
    id: 'garden-diy',
    name: 'Garden & DIY',
    nameLocalized: { en: 'Garden & DIY', ar: 'حديعة و DIY', es: 'Jardín y Bricolaje', fr: 'Jardin et Bricolage', zh: '园艺 DIY' },
    description: 'Gardening tools, plants, DIY supplies, and home improvement',
    icon: 'flower-2',
    image: '/categories/garden.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['garden-diy'] },
      { id: 'category_type', name: 'Category', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['garden-diy'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'category_type', type: 'checkbox', displayName: 'Category', sortOrder: 2 },
    ],
    sortOrder: 15,
    isActive: true,
    productCount: 250000,
    seo: { title: 'Garden & DIY Supplies', description: 'Compare garden prices', keywords: ['garden', 'DIY', 'tools'] },
  },
  {
    id: 'travel',
    name: 'Travel',
    nameLocalized: { en: 'Travel', ar: 'سفر', es: 'Viajes', fr: 'Voyage', zh: '旅行' },
    description: 'Luggage, travel accessories, and travel services',
    icon: 'plane',
    image: '/categories/travel.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['travel'] },
      { id: 'luggage_type', name: 'Type', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['travel'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
    ],
    sortOrder: 16,
    isActive: true,
    productCount: 120000,
    seo: { title: 'Travel & Luggage', description: 'Compare travel gear prices', keywords: ['travel', 'luggage', 'bags'] },
  },
  {
    id: 'luxury-watches',
    name: 'Luxury & Watches',
    nameLocalized: { en: 'Luxury', ar: 'فاخر', es: 'Lujo', fr: 'Luxe', zh: '奢侈品' },
    description: 'Luxury goods, designer watches, jewelry, and premium accessories',
    icon: 'watch',
    image: '/categories/luxury.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['luxury-watches'] },
      { id: 'material', name: 'Material', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['luxury-watches'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
    ],
    sortOrder: 17,
    isActive: true,
    productCount: 80000,
    seo: { title: 'Luxury Watches & Jewelry', description: 'Compare luxury prices', keywords: ['luxury', 'watches', 'jewelry'] },
  },
  {
    id: 'software-gadgets',
    name: 'Software & Gadgets',
    nameLocalized: { en: 'Software', ar: 'برامج', es: 'Software', fr: 'Logiciel', zh: '软件' },
    description: 'Software licenses, apps, digital tools, and tech gadgets',
    icon: 'code',
    image: '/categories/software.jpg',
    parentId: 'electronics',
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['software-gadgets'] },
      { id: 'license_type', name: 'License', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['software-gadgets'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'license_type', type: 'checkbox', displayName: 'License Type', sortOrder: 2 },
    ],
    sortOrder: 18,
    isActive: true,
    productCount: 50000,
    seo: { title: 'Software & Digital Tools', description: 'Compare software prices', keywords: ['software', 'apps', 'licenses'] },
  },
  // NEW CATEGORIES
  {
    id: 'art-collectibles',
    name: 'Art & Collectibles',
    nameLocalized: { en: 'Art & Collectibles', ar: 'فن وتحف', es: 'Arte y Coleccionables', fr: 'Art et Collections', zh: '艺术与收藏' },
    description: 'Fine art, collectibles, antiques, and limited edition items',
    icon: 'palette',
    image: '/categories/art.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'artist', name: 'Artist/Brand', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['art-collectibles'] },
      { id: 'art_type', name: 'Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['art-collectibles'] },
      { id: 'year', name: 'Year', type: 'range', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['art-collectibles'] },
    ],
    filters: [
      { attributeId: 'art_type', type: 'checkbox', displayName: 'Type', sortOrder: 1 },
      { attributeId: 'year', type: 'range', displayName: 'Year', sortOrder: 2 },
    ],
    sortOrder: 19,
    isActive: true,
    productCount: 25000,
    seo: { title: 'Art & Collectibles', description: 'Compare art prices', keywords: ['art', 'collectibles', 'antiques'] },
  },
  {
    id: 'musical-instruments',
    name: 'Musical Instruments',
    nameLocalized: { en: 'Musical Instruments', ar: 'آلات موسيقية', es: 'Instrumentos Musicales', fr: 'Instruments de Musique', zh: '乐器' },
    description: 'Guitars, keyboards, drums, orchestral instruments, and audio equipment',
    icon: 'music',
    image: '/categories/music.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['musical-instruments'] },
      { id: 'instrument_type', name: 'Instrument Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['musical-instruments'] },
      { id: 'condition', name: 'Condition', type: 'select', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['musical-instruments'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'instrument_type', type: 'checkbox', displayName: 'Instrument Type', sortOrder: 2 },
    ],
    sortOrder: 20,
    isActive: true,
    productCount: 60000,
    seo: { title: 'Musical Instruments & Audio', description: 'Compare instrument prices', keywords: ['music', 'instruments', 'guitar'] },
  },
  {
    id: 'industrial-machinery',
    name: 'Industrial Machinery',
    nameLocalized: { en: 'Industrial', ar: 'آلات صناعية', es: 'Maquinaria Industrial', fr: 'Machinerie Industrielle', zh: '工业机械' },
    description: 'Industrial equipment, machinery, tools, and manufacturing supplies',
    icon: 'factory',
    image: '/categories/industrial.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['industrial-machinery'] },
      { id: 'machine_type', name: 'Machine Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['industrial-machinery'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'machine_type', type: 'checkbox', displayName: 'Machine Type', sortOrder: 2 },
    ],
    sortOrder: 21,
    isActive: true,
    productCount: 40000,
    seo: { title: 'Industrial Machinery & Equipment', description: 'Compare industrial prices', keywords: ['industrial', 'machinery', 'equipment'] },
  },
  {
    id: 'smart-home-iot',
    name: 'Smart Home & IoT',
    nameLocalized: { en: 'Smart Home', ar: 'منزل ذكي', es: 'Hogar Inteligente', fr: 'Maison Connectée', zh: '智能家居' },
    description: 'Smart home devices, IoT products, home automation, and security systems',
    icon: 'home-automation',
    image: '/categories/smart-home.jpg',
    parentId: 'electronics',
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['smart-home-iot'] },
      { id: 'device_type', name: 'Device Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['smart-home-iot'] },
      { id: 'connectivity', name: 'Connectivity', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['smart-home-iot'] },
    ],
    filters: [
      { attributeId: 'brand', type: 'checkbox', displayName: 'Brand', sortOrder: 1 },
      { attributeId: 'device_type', type: 'checkbox', displayName: 'Device Type', sortOrder: 2 },
    ],
    sortOrder: 22,
    isActive: true,
    productCount: 180000,
    seo: { title: 'Smart Home & IoT Devices', description: 'Compare smart home prices', keywords: ['smart home', 'IoT', 'automation'] },
  },
  {
    id: 'digital-goods',
    name: 'Digital Goods & Subscriptions',
    nameLocalized: { en: 'Digital Goods', ar: 'بضائع رقمية', es: 'Bienes Digitales', fr: 'Biens Numériques', zh: '数字商品' },
    description: 'Digital products, subscriptions, gift cards, and online services',
    icon: 'download',
    image: '/categories/digital.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'platform', name: 'Platform', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['digital-goods'] },
      { id: 'type', name: 'Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['digital-goods'] },
    ],
    filters: [
      { attributeId: 'platform', type: 'checkbox', displayName: 'Platform', sortOrder: 1 },
      { attributeId: 'type', type: 'checkbox', displayName: 'Type', sortOrder: 2 },
    ],
    sortOrder: 23,
    isActive: true,
    productCount: 35000,
    seo: { title: 'Digital Goods & Subscriptions', description: 'Compare digital prices', keywords: ['digital', 'subscriptions', 'gift cards'] },
  },
  {
    id: 'finance-insurance',
    name: 'Finance & Insurance',
    nameLocalized: { en: 'Finance', ar: 'تمويل وتأمين', es: 'Finanzas y Seguros', fr: 'Finance et Assurance', zh: '金融保险' },
    description: 'Financial products, insurance plans, credit cards, and banking services',
    icon: 'landmark',
    image: '/categories/finance.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'provider', name: 'Provider', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['finance-insurance'] },
      { id: 'product_type', name: 'Product Type', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['finance-insurance'] },
    ],
    filters: [
      { attributeId: 'provider', type: 'checkbox', displayName: 'Provider', sortOrder: 1 },
      { attributeId: 'product_type', type: 'checkbox', displayName: 'Product Type', sortOrder: 2 },
    ],
    sortOrder: 24,
    isActive: true,
    productCount: 15000,
    seo: { title: 'Finance & Insurance Products', description: 'Compare finance prices', keywords: ['finance', 'insurance', 'credit cards'] },
  },
  {
    id: 'green-eco',
    name: 'Green & Eco Products',
    nameLocalized: { en: 'Green Products', ar: 'منتجات صديقة للبيئة', es: 'Productos Ecológicos', fr: 'Produits Écologiques', zh: '环保产品' },
    description: 'Eco-friendly products, sustainable goods, organic items, and green alternatives',
    icon: 'leaf',
    image: '/categories/green.jpg',
    parentId: null,
    children: [],
    attributes: [
      { id: 'brand', name: 'Brand', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['green-eco'] },
      { id: 'eco_certification', name: 'Certification', type: 'multiselect', isRequired: false, isFilterable: true, isComparable: true, categoryIds: ['green-eco'] },
      { id: 'category_type', name: 'Category', type: 'select', isRequired: true, isFilterable: true, isComparable: true, categoryIds: ['green-eco'] },
    ],
    filters: [
      { attributeId: 'eco_certification', type: 'checkbox', displayName: 'Certification', sortOrder: 1 },
      { attributeId: 'category_type', type: 'checkbox', displayName: 'Category', sortOrder: 2 },
    ],
    sortOrder: 25,
    isActive: true,
    productCount: 120000,
    seo: { title: 'Green & Eco-Friendly Products', description: 'Compare eco prices', keywords: ['eco', 'green', 'sustainable', 'organic'] },
  },
];

// Helper function to get category by ID
export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get root categories
export function getRootCategories(): Category[] {
  return CATEGORIES.filter(cat => cat.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Helper function to get subcategories
export function getSubcategories(parentId: CategoryId): Category[] {
  return CATEGORIES.filter(cat => cat.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Category with full child objects (for tree view)
export interface CategoryTreeNode {
  id: CategoryId;
  name: string;
  nameLocalized: Record<string, string>;
  description: string;
  icon: string;
  image: string;
  parentId: CategoryId | null;
  children: CategoryTreeNode[];
  attributes: ProductAttribute[];
  filters: FilterConfig[];
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Helper function to get category tree
export function getCategoryTree(): CategoryTreeNode[] {
  const rootCategories = getRootCategories();

  const buildTree = (category: Category): CategoryTreeNode => {
    const childCategories = category.children
      .map(childId => CATEGORIES.find(c => c.id === childId))
      .filter((c): c is Category => c !== undefined);

    return {
      id: category.id,
      name: category.name,
      nameLocalized: category.nameLocalized,
      description: category.description,
      icon: category.icon,
      image: category.image,
      parentId: category.parentId,
      attributes: category.attributes,
      filters: category.filters,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      productCount: category.productCount,
      seo: category.seo,
      children: childCategories.map(buildTree),
    };
  };

  return rootCategories.map(buildTree);
}
