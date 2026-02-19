/**
 * PriceX - Global Type Definitions
 * Lead Systems Architecture
 */

// Region Types
export type Region = 
  | 'north-america' 
  | 'south-america' 
  | 'europe' 
  | 'mena' 
  | 'asia' 
  | 'africa' 
  | 'australia' 
  | 'russia';

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: Region;
  currency: string;
  language: string;
}

export const REGIONS: { id: Region; name: string; nameAr: string }[] = [
  { id: 'north-america', name: 'North America', nameAr: 'أمريكا الشمالية' },
  { id: 'south-america', name: 'South America', nameAr: 'أمريكا الجنوبية' },
  { id: 'europe', name: 'Europe', nameAr: 'أوروبا' },
  { id: 'mena', name: 'MENA', nameAr: 'الشرق الأوسط وشمال أفريقيا' },
  { id: 'asia', name: 'Asia', nameAr: 'آسيا' },
  { id: 'africa', name: 'Africa', nameAr: 'أفريقيا' },
  { id: 'australia', name: 'Australia', nameAr: 'أستراليا' },
  { id: 'russia', name: 'Russia', nameAr: 'روسيا' },
];

// Language Types
export type Language = 
  | 'en' 
  | 'ar' 
  | 'es' 
  | 'fr' 
  | 'it' 
  | 'zh' 
  | 'tr' 
  | 'ru' 
  | 'pt' 
  | 'ur' 
  | 'hi' 
  | 'ko';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷' },
];

// Currency Types
export type Currency = 
  | 'USD' 
  | 'EUR' 
  | 'GBP' 
  | 'JPY' 
  | 'CNY' 
  | 'AED' 
  | 'SAR' 
  | 'TRY' 
  | 'RUB' 
  | 'INR' 
  | 'PKR' 
  | 'KRW' 
  | 'BRL' 
  | 'MXN' 
  | 'CAD' 
  | 'AUD' 
  | 'ZAR' 
  | 'EGP';

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
];

// Sample Countries Data
export const COUNTRIES: Country[] = [
  // North America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'north-america', currency: 'USD', language: 'en' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'north-america', currency: 'CAD', language: 'en' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'north-america', currency: 'MXN', language: 'es' },
  
  // South America
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'south-america', currency: 'BRL', language: 'pt' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'south-america', currency: 'USD', language: 'es' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'south-america', currency: 'USD', language: 'es' },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'europe', currency: 'GBP', language: 'en' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'europe', currency: 'EUR', language: 'en' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'europe', currency: 'EUR', language: 'fr' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'europe', currency: 'EUR', language: 'it' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'europe', currency: 'EUR', language: 'es' },
  
  // MENA
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'mena', currency: 'SAR', language: 'ar' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', region: 'mena', currency: 'AED', language: 'ar' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'mena', currency: 'EGP', language: 'ar' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'mena', currency: 'TRY', language: 'tr' },
  
  // Asia
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'asia', currency: 'CNY', language: 'zh' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'asia', currency: 'JPY', language: 'en' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'asia', currency: 'INR', language: 'hi' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'asia', currency: 'KRW', language: 'ko' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'asia', currency: 'PKR', language: 'ur' },
  
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'africa', currency: 'ZAR', language: 'en' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'africa', currency: 'USD', language: 'en' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'africa', currency: 'USD', language: 'en' },
  
  // Australia
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'australia', currency: 'AUD', language: 'en' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'australia', currency: 'AUD', language: 'en' },
  
  // Russia
  { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'russia', currency: 'RUB', language: 'ru' },
];

// User Preferences
export interface UserPreferences {
  region: Region;
  country: string;
  language: Language;
  currency: Currency;
  theme: 'light' | 'dark' | 'system';
}

// Price Data Types
export interface PricePoint {
  id: string;
  productId: string;
  retailer: string;
  price: number;
  currency: Currency;
  url: string;
  inStock: boolean;
  lastUpdated: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  prices: PricePoint[];
  rating: number;
  reviewCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// FX Rate Type
export interface FXRate {
  from: Currency;
  to: Currency;
  rate: number;
  timestamp: Date;
}
