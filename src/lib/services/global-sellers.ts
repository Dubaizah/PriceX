/**
 * PriceX - Global Sellers Configuration
 * Complete coverage of ALL countries worldwide
 */

export type SellerType = 'manufacturer' | 'retailer' | 'authorized_dealer' | 'wholesaler' | 'marketplace' | 'official_store' | 'independent';

export interface GlobalSeller {
  id: string;
  name: string;
  type: SellerType;
  domain: string;
  logo: string;
  website: string;
  region: string;
  country: string;
  currency: string;
  dataSource: 'api' | 'scraper' | 'feed' | 'manual';
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOfficialStore: boolean;
  brands: string[];
  categories: string[];
  shippingInfo: {
    freeShippingThreshold?: number;
    standardShipping: number;
    expressShipping?: number;
    regions: string[];
  };
  returnPolicy: {
    allowed: boolean;
    days: number;
    conditions: string;
  };
}

// Complete list of all countries by region
const ALL_COUNTRIES = {
  'north-america': [
    { country: 'USA', currency: 'USD', domain: 'us' },
    { country: 'Canada', currency: 'CAD', domain: 'ca' },
    { country: 'Mexico', currency: 'MXN', domain: 'mx' },
    { country: 'Guatemala', currency: 'GTQ', domain: 'gt' },
    { country: 'Belize', currency: 'BZD', domain: 'bz' },
    { country: 'Honduras', currency: 'HNL', domain: 'hn' },
    { country: 'El Salvador', currency: 'USD', domain: 'sv' },
    { country: 'Nicaragua', currency: 'NIO', domain: 'ni' },
    { country: 'Costa Rica', currency: 'CRC', domain: 'cr' },
    { country: 'Panama', currency: 'PAB', domain: 'pa' },
    { country: 'Cuba', currency: 'CUP', domain: 'cu' },
    { country: 'Jamaica', currency: 'JMD', domain: 'jm' },
    { country: 'Haiti', currency: 'HTG', domain: 'ht' },
    { country: 'Dominican Republic', currency: 'DOP', domain: 'do' },
    { country: 'Puerto Rico', currency: 'USD', domain: 'pr' },
  ],
  'south-america': [
    { country: 'Brazil', currency: 'BRL', domain: 'com.br' },
    { country: 'Argentina', currency: 'ARS', domain: 'com.ar' },
    { country: 'Colombia', currency: 'COP', domain: 'com.co' },
    { country: 'Chile', currency: 'CLP', domain: 'cl' },
    { country: 'Peru', currency: 'PEN', domain: 'com.pe' },
    { country: 'Venezuela', currency: 'VES', domain: 'com.ve' },
    { country: 'Ecuador', currency: 'USD', domain: 'com.ec' },
    { country: 'Bolivia', currency: 'BOB', domain: 'com.bo' },
    { country: 'Paraguay', currency: 'PYG', domain: 'com.py' },
    { country: 'Uruguay', currency: 'UYU', domain: 'com.uy' },
    { country: 'Guyana', currency: 'GYD', domain: 'gy' },
    { country: 'Suriname', currency: 'SRD', domain: 'sr' },
    { country: 'French Guiana', currency: 'EUR', domain: 'gf' },
  ],
  'europe': [
    { country: 'United Kingdom', currency: 'GBP', domain: 'co.uk' },
    { country: 'Germany', currency: 'EUR', domain: 'de' },
    { country: 'France', currency: 'EUR', domain: 'fr' },
    { country: 'Spain', currency: 'EUR', domain: 'es' },
    { country: 'Italy', currency: 'EUR', domain: 'it' },
    { country: 'Netherlands', currency: 'EUR', domain: 'nl' },
    { country: 'Belgium', currency: 'EUR', domain: 'be' },
    { country: 'Austria', currency: 'EUR', domain: 'at' },
    { country: 'Switzerland', currency: 'CHF', domain: 'ch' },
    { country: 'Poland', currency: 'PLN', domain: 'pl' },
    { country: 'Sweden', currency: 'SEK', domain: 'se' },
    { country: 'Norway', currency: 'NOK', domain: 'no' },
    { country: 'Denmark', currency: 'DKK', domain: 'dk' },
    { country: 'Finland', currency: 'EUR', domain: 'fi' },
    { country: 'Ireland', currency: 'EUR', domain: 'ie' },
    { country: 'Portugal', currency: 'EUR', domain: 'pt' },
    { country: 'Greece', currency: 'EUR', domain: 'gr' },
    { country: 'Czech Republic', currency: 'CZK', domain: 'cz' },
    { country: 'Hungary', currency: 'HUF', domain: 'hu' },
    { country: 'Romania', currency: 'RON', domain: 'ro' },
    { country: 'Bulgaria', currency: 'BGN', domain: 'bg' },
    { country: 'Slovakia', currency: 'EUR', domain: 'sk' },
    { country: 'Croatia', currency: 'EUR', domain: 'hr' },
    { country: 'Slovenia', currency: 'EUR', domain: 'si' },
    { country: 'Estonia', currency: 'EUR', domain: 'ee' },
    { country: 'Latvia', currency: 'EUR', domain: 'lv' },
    { country: 'Lithuania', currency: 'EUR', domain: 'lt' },
    { country: 'Ukraine', currency: 'UAH', domain: 'ua' },
    { country: 'Russia', currency: 'RUB', domain: 'ru' },
    { country: 'Turkey', currency: 'TRY', domain: 'com.tr' },
    { country: 'Iceland', currency: 'ISK', domain: 'is' },
    { country: 'Luxembourg', currency: 'EUR', domain: 'lu' },
    { country: 'Malta', currency: 'EUR', domain: 'mt' },
    { country: 'Cyprus', currency: 'EUR', domain: 'cy' },
  ],
  'asia': [
    { country: 'Japan', currency: 'JPY', domain: 'co.jp' },
    { country: 'China', currency: 'CNY', domain: 'cn' },
    { country: 'India', currency: 'INR', domain: 'in' },
    { country: 'Singapore', currency: 'SGD', domain: 'sg' },
    { country: 'South Korea', currency: 'KRW', domain: 'kr' },
    { country: 'Taiwan', currency: 'TWD', domain: 'tw' },
    { country: 'Hong Kong', currency: 'HKD', domain: 'com.hk' },
    { country: 'Thailand', currency: 'THB', domain: 'com.th' },
    { country: 'Malaysia', currency: 'MYR', domain: 'com.my' },
    { country: 'Indonesia', currency: 'IDR', domain: 'id' },
    { country: 'Philippines', currency: 'PHP', domain: 'ph' },
    { country: 'Vietnam', currency: 'VND', domain: 'vn' },
    { country: 'Pakistan', currency: 'PKR', domain: 'pk' },
    { country: 'Bangladesh', currency: 'BDT', domain: 'bd' },
    { country: 'Sri Lanka', currency: 'LKR', domain: 'lk' },
    { country: 'Nepal', currency: 'NPR', domain: 'np' },
    { country: 'Myanmar', currency: 'MMK', domain: 'mm' },
    { country: 'Cambodia', currency: 'KHR', domain: 'kh' },
    { country: 'Laos', currency: 'LAK', domain: 'la' },
    { country: 'Brunei', currency: 'BND', domain: 'bn' },
    { country: 'Maldives', currency: 'MVR', domain: 'mv' },
  ],
  'middle-east': [
    { country: 'United Arab Emirates', currency: 'AED', domain: 'ae' },
    { country: 'Saudi Arabia', currency: 'SAR', domain: 'sa' },
    { country: 'Qatar', currency: 'QAR', domain: 'qa' },
    { country: 'Kuwait', currency: 'KWD', domain: 'kw' },
    { country: 'Bahrain', currency: 'BHD', domain: 'bh' },
    { country: 'Oman', currency: 'OMR', domain: 'om' },
    { country: 'Jordan', currency: 'JOD', domain: 'jo' },
    { country: 'Lebanon', currency: 'LBP', domain: 'lb' },
    { country: 'Iraq', currency: 'IQD', domain: 'iq' },
    { country: 'Iran', currency: 'IRR', domain: 'ir' },
    { country: 'Israel', currency: 'ILS', domain: 'il' },
    { country: 'Palestine', currency: 'ILS', domain: 'ps' },
    { country: 'Egypt', currency: 'EGP', domain: 'eg' },
    { country: 'Turkey', currency: 'TRY', domain: 'com.tr' },
  ],
  'africa': [
    { country: 'Nigeria', currency: 'NGN', domain: 'ng' },
    { country: 'South Africa', currency: 'ZAR', domain: 'co.za' },
    { country: 'Kenya', currency: 'KES', domain: 'ke' },
    { country: 'Ghana', currency: 'GHS', domain: 'gh' },
    { country: 'Egypt', currency: 'EGP', domain: 'com.eg' },
    { country: 'Morocco', currency: 'MAD', domain: 'ma' },
    { country: 'Ethiopia', currency: 'ETB', domain: 'et' },
    { country: 'Tanzania', currency: 'TZS', domain: 'tz' },
    { country: 'Uganda', currency: 'UGX', domain: 'ug' },
    { country: 'Algeria', currency: 'DZD', domain: 'dz' },
    { country: 'Tunisia', currency: 'TND', domain: 'tn' },
    { country: 'Libya', currency: 'LYD', domain: 'ly' },
    { country: 'Sudan', currency: 'SDG', domain: 'sd' },
    { country: 'Cameroon', currency: 'XAF', domain: 'cm' },
    { country: 'Ivory Coast', currency: 'XOF', domain: 'ci' },
    { country: 'Senegal', currency: 'XOF', domain: 'sn' },
    { country: 'Mozambique', currency: 'MZN', domain: 'mz' },
    { country: 'Angola', currency: 'AOA', domain: 'ao' },
    { country: 'Democratic Republic of Congo', currency: 'CDF', domain: 'cd' },
    { country: 'Madagascar', currency: 'MGA', domain: 'mg' },
    { country: 'Rwanda', currency: 'RWF', domain: 'rw' },
    { country: 'Zambia', currency: 'ZMW', domain: 'zm' },
    { country: 'Zimbabwe', currency: 'ZWL', domain: 'zw' },
    { country: 'Botswana', currency: 'BWP', domain: 'bw' },
    { country: 'Namibia', currency: 'NAD', domain: 'na' },
  ],
  'oceania': [
    { country: 'Australia', currency: 'AUD', domain: 'com.au' },
    { country: 'New Zealand', currency: 'NZD', domain: 'co.nz' },
    { country: 'Fiji', currency: 'FJD', domain: 'fj' },
    { country: 'Papua New Guinea', currency: 'PGK', domain: 'pg' },
    { country: 'Samoa', currency: 'WST', domain: 'ws' },
    { country: 'Tonga', currency: 'TOP', domain: 'to' },
    { country: 'Solomon Islands', currency: 'SBD', domain: 'sb' },
    { country: 'Vanuatu', currency: 'VUV', domain: 'vu' },
  ],
};

// Generate Amazon sellers for all countries
function generateAmazonSellers(): GlobalSeller[] {
  const sellers: GlobalSeller[] = [];
  
  for (const [region, countries] of Object.entries(ALL_COUNTRIES)) {
    for (const c of countries) {
      const id = `amazon-${c.domain.replace('.', '-')}`;
      sellers.push({
        id,
        name: `Amazon ${c.country}`,
        type: 'marketplace',
        domain: `amazon.${c.domain}`,
        logo: '/retailers/amazon.svg',
        website: `https://www.amazon.${c.domain}`,
        region: region,
        country: c.country,
        currency: c.currency,
        dataSource: 'api',
        rating: 4.4,
        reviewCount: 50000000,
        isVerified: true,
        isOfficialStore: false,
        brands: ['All Brands'],
        categories: ['all'],
        shippingInfo: { 
          freeShippingThreshold: region === 'europe' || region === 'north-america' ? 25 : 50, 
          standardShipping: 0, 
          expressShipping: 9.99,
          regions: [c.country] 
        },
        returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
      });
    }
  }
  return sellers;
}

export const GLOBAL_SELLERS: GlobalSeller[] = [
  // ==================== MANUFACTURERS ====================
  {
    id: 'apple-store', name: 'Apple Store', type: 'official_store', domain: 'apple.com',
    logo: '/retailers/apple.svg', website: 'https://www.apple.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.9, reviewCount: 100000000, isVerified: true, isOfficialStore: true,
    brands: ['Apple'], categories: ['electronics', 'computers', 'wearables'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, expressShipping: 14.99, regions: ['US', 'CA', 'UK', 'DE', 'FR', 'JP', 'AU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original condition' },
  },
  {
    id: 'samsung-store', name: 'Samsung Store', type: 'official_store', domain: 'samsung.com',
    logo: '/retailers/samsung.svg', website: 'https://www.samsung.com', region: 'global', country: 'South Korea',
    currency: 'USD', dataSource: 'api', rating: 4.7, reviewCount: 50000000, isVerified: true, isOfficialStore: true,
    brands: ['Samsung'], categories: ['electronics', 'computers', 'appliances'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'UK', 'DE', 'KR', 'IN'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'sony-store', name: 'Sony Store', type: 'official_store', domain: 'sony.com',
    logo: '/retailers/sony.svg', website: 'https://www.sony.com', region: 'global', country: 'Japan',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['Sony'], categories: ['electronics', 'gaming', 'cameras'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'JP', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'microsoft-store', name: 'Microsoft Store', type: 'official_store', domain: 'microsoft.com',
    logo: '/retailers/microsoft.svg', website: 'https://www.microsoft.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.7, reviewCount: 40000000, isVerified: true, isOfficialStore: true,
    brands: ['Microsoft', 'Surface', 'Xbox'], categories: ['electronics', 'computers', 'gaming'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'google-store', name: 'Google Store', type: 'official_store', domain: 'store.google.com',
    logo: '/retailers/google.svg', website: 'https://store.google.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 25000000, isVerified: true, isOfficialStore: true,
    brands: ['Google', 'Pixel'], categories: ['electronics', 'phones'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE', 'AU', 'JP'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'lg-store', name: 'LG Store', type: 'official_store', domain: 'lg.com',
    logo: '/retailers/lg.svg', website: 'https://www.lg.com', region: 'global', country: 'South Korea',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['LG'], categories: ['electronics', 'appliances', 'tvs'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'KR', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'dell-store', name: 'Dell Technologies', type: 'official_store', domain: 'dell.com',
    logo: '/retailers/dell.svg', website: 'https://www.dell.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 35000000, isVerified: true, isOfficialStore: true,
    brands: ['Dell', 'Alienware'], categories: ['computers', 'electronics'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'hp-store', name: 'HP Store', type: 'official_store', domain: 'hp.com',
    logo: '/retailers/hp.svg', website: 'https://www.hp.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['HP', 'OMEN'], categories: ['computers', 'electronics', 'printers'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'asus-store', name: 'ASUS Store', type: 'official_store', domain: 'asus.com',
    logo: '/retailers/asus.svg', website: 'https://www.asus.com', region: 'global', country: 'Taiwan',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['ASUS', 'ROG'], categories: ['computers', 'gaming'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'UK', 'DE', 'JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'nike-store', name: 'Nike Store', type: 'official_store', domain: 'nike.com',
    logo: '/retailers/nike.svg', website: 'https://www.nike.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.7, reviewCount: 80000000, isVerified: true, isOfficialStore: true,
    brands: ['Nike', 'Jordan'], categories: ['fashion', 'sports', 'shoes'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, expressShipping: 9.99, regions: ['US', 'CA', 'UK', 'DE', 'FR', 'JP', 'AU'] },
    returnPolicy: { allowed: true, days: 60, conditions: 'Unworn with tags' },
  },
  {
    id: 'adidas-store', name: 'Adidas Store', type: 'official_store', domain: 'adidas.com',
    logo: '/retailers/adidas.svg', website: 'https://www.adidas.com', region: 'global', country: 'Germany',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 60000000, isVerified: true, isOfficialStore: true,
    brands: ['Adidas', 'Reebok'], categories: ['fashion', 'sports', 'shoes'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'DE', 'UK', 'FR', 'JP', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'huawei-store', name: 'Huawei Store', type: 'official_store', domain: 'huawei.com',
    logo: '/retailers/huawei.svg', website: 'https://www.huawei.com', region: 'global', country: 'China',
    currency: 'CNY', dataSource: 'api', rating: 4.4, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['Huawei'], categories: ['electronics', 'phones'],
    shippingInfo: { freeShippingThreshold: 99, standardShipping: 0, regions: ['CN', 'UK', 'DE', 'FR'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Original packaging' },
  },
  {
    id: 'xiaomi-store', name: 'Xiaomi Store', type: 'official_store', domain: 'mi.com',
    logo: '/retailers/xiaomi.svg', website: 'https://www.mi.com', region: 'global', country: 'China',
    currency: 'CNY', dataSource: 'api', rating: 4.5, reviewCount: 40000000, isVerified: true, isOfficialStore: true,
    brands: ['Xiaomi', 'Redmi', 'POCO'], categories: ['electronics', 'phones'],
    shippingInfo: { freeShippingThreshold: 99, standardShipping: 0, regions: ['CN', 'IN', 'EU'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Original packaging' },
  },
  {
    id: 'oneplus-store', name: 'OnePlus Store', type: 'official_store', domain: 'oneplus.com',
    logo: '/retailers/oneplus.svg', website: 'https://www.oneplus.com', region: 'global', country: 'China',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 15000000, isVerified: true, isOfficialStore: true,
    brands: ['OnePlus'], categories: ['electronics', 'phones'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'IN', 'EU'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'oppo-store', name: 'OPPO Store', type: 'official_store', domain: 'oppo.com',
    logo: '/retailers/oppo.svg', website: 'https://www.oppo.com', region: 'global', country: 'China',
    currency: 'CNY', dataSource: 'api', rating: 4.4, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['OPPO', 'Realme', 'OnePlus'], categories: ['electronics', 'phones'],
    shippingInfo: { freeShippingThreshold: 99, standardShipping: 0, regions: ['CN', 'IN', 'EU', 'SEA'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Original packaging' },
  },
  {
    id: 'lenovo-store', name: 'Lenovo Store', type: 'official_store', domain: 'lenovo.com',
    logo: '/retailers/lenovo.svg', website: 'https://www.lenovo.com', region: 'global', country: 'China',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 25000000, isVerified: true, isOfficialStore: true,
    brands: ['Lenovo', 'Legion', 'ThinkPad'], categories: ['computers', 'electronics'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'UK', 'DE', 'CN'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'acer-store', name: 'Acer Store', type: 'official_store', domain: 'acer.com',
    logo: '/retailers/acer.svg', website: 'https://www.acer.com', region: 'global', country: 'Taiwan',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 15000000, isVerified: true, isOfficialStore: true,
    brands: ['Acer', 'Predator'], categories: ['computers', 'electronics', 'gaming'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'UK', 'DE', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'msi-store', name: 'MSI Store', type: 'official_store', domain: 'msi.com',
    logo: '/retailers/msi.svg', website: 'https://www.msi.com', region: 'global', country: 'Taiwan',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 10000000, isVerified: true, isOfficialStore: true,
    brands: ['MSI'], categories: ['computers', 'gaming'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'UK', 'DE', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'canon-store', name: 'Canon Store', type: 'official_store', domain: 'canon.com',
    logo: '/retailers/canon.svg', website: 'https://www.canon.com', region: 'global', country: 'Japan',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['Canon'], categories: ['cameras', 'electronics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'JP', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'nikon-store', name: 'Nikon Store', type: 'official_store', domain: 'nikon.com',
    logo: '/retailers/nikon.svg', website: 'https://www.nikon.com', region: 'global', country: 'Japan',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 15000000, isVerified: true, isOfficialStore: true,
    brands: ['Nikon'], categories: ['cameras', 'electronics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'JP', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // ==================== MAJOR RETAILERS ====================
  {
    id: 'bestbuy-global', name: 'Best Buy', type: 'retailer', domain: 'bestbuy.com',
    logo: '/retailers/bestbuy.svg', website: 'https://www.bestbuy.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'ASUS'],
    categories: ['electronics', 'computers', 'appliances'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, expressShipping: 29.99, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'walmart-global', name: 'Walmart', type: 'retailer', domain: 'walmart.com',
    logo: '/retailers/walmart.svg', website: 'https://www.walmart.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 30000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'MX'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' },
  },
  {
    id: 'target-global', name: 'Target', type: 'retailer', domain: 'target.com',
    logo: '/retailers/target.svg', website: 'https://www.target.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' },
  },
  {
    id: 'costco-global', name: 'Costco', type: 'wholesaler', domain: 'costco.com',
    logo: '/retailers/costco.svg', website: 'https://www.costco.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA', 'UK', 'AU', 'JP', 'KR'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original packaging' },
  },
  {
    id: 'carrefour-global', name: 'Carrefour', type: 'retailer', domain: 'carrefour.com',
    logo: '/retailers/carrefour.svg', website: 'https://www.carrefour.com', region: 'europe', country: 'France',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries', 'electronics', 'fashion'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['FR', 'ES', 'IT', 'BE', 'RO'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'tesco-global', name: 'Tesco', type: 'retailer', domain: 'tesco.com',
    logo: '/retailers/tesco.svg', website: 'https://www.tesco.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.1, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries', 'electronics', 'fashion'],
    shippingInfo: { freeShippingThreshold: 40, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'mediamarkt-global', name: 'MediaMarkt', type: 'retailer', domain: 'mediamarkt.com',
    logo: '/retailers/mediamarkt.svg', website: 'https://www.mediamarkt.com', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell'],
    categories: ['electronics', 'computers', 'appliances'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.99, regions: ['DE', 'AT', 'NL', 'BE'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'flipkart-global', name: 'Flipkart', type: 'retailer', domain: 'flipkart.com',
    logo: '/retailers/flipkart.svg', website: 'https://www.flipkart.com', region: 'asia', country: 'India',
    currency: 'INR', dataSource: 'api', rating: 4.3, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 500, standardShipping: 0, regions: ['IN'] },
    returnPolicy: { allowed: true, days: 10, conditions: 'Original packaging' },
  },
  {
    id: 'noon-global', name: 'Noon', type: 'marketplace', domain: 'noon.com',
    logo: '/retailers/noon.svg', website: 'https://www.noon.com', region: 'middle-east', country: 'United Arab Emirates',
    currency: 'AED', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 0, regions: ['UAE', 'SA', 'EG', 'KW'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'shopee-global', name: 'Shopee', type: 'marketplace', domain: 'shopee.com',
    logo: '/retailers/shopee.svg', website: 'https://www.shopee.com', region: 'asia', country: 'Singapore',
    currency: 'SGD', dataSource: 'api', rating: 4.1, reviewCount: 40000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Asian Brands'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['SG', 'MY', 'PH', 'TH', 'VN', 'ID', 'TW'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'lazada-global', name: 'Lazada', type: 'marketplace', domain: 'lazada.com',
    logo: '/retailers/lazada.svg', website: 'https://www.lazada.com', region: 'asia', country: 'Singapore',
    currency: 'SGD', dataSource: 'api', rating: 4.1, reviewCount: 30000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Asian Brands'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['SG', 'MY', 'PH', 'TH', 'VN', 'ID'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'jd-global', name: 'JD.com', type: 'retailer', domain: 'jd.com',
    logo: '/retailers/jd.svg', website: 'https://www.jd.com', region: 'asia', country: 'China',
    currency: 'CNY', dataSource: 'api', rating: 4.4, reviewCount: 60000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Chinese Brands'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 99, standardShipping: 0, regions: ['CN'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'aliexpress-global', name: 'AliExpress', type: 'marketplace', domain: 'aliexpress.com',
    logo: '/retailers/aliexpress.svg', website: 'https://www.aliexpress.com', region: 'global', country: 'China',
    currency: 'USD', dataSource: 'api', rating: 4.0, reviewCount: 100000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Chinese Brands'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['CN', 'US', 'RU', 'BR', 'ES', 'FR', 'DE'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Not opened' },
  },
  {
    id: 'ebay-global', name: 'eBay', type: 'marketplace', domain: 'ebay.com',
    logo: '/retailers/ebay.svg', website: 'https://www.ebay.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['All Brands'], categories: ['all'],
    shippingInfo: { standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'As described' },
  },
  {
    id: 'takealot-za', name: 'Takealot', type: 'retailer', domain: 'takealot.com',
    logo: '/retailers/takealot.svg', website: 'https://www.takealot.com', region: 'africa', country: 'South Africa',
    currency: 'ZAR', dataSource: 'api', rating: 4.2, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 500, standardShipping: 0, regions: ['ZA'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'jumia-global', name: 'Jumia', type: 'marketplace', domain: 'jumia.com',
    logo: '/retailers/jumia.svg', website: 'https://www.jumia.com', region: 'africa', country: 'Nigeria',
    currency: 'NGN', dataSource: 'api', rating: 4.0, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['NG', 'KE', 'GH', 'EG', 'ZA', 'CI'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Original packaging' },
  },
  {
    id: 'mercadolibre-global', name: 'Mercado Libre', type: 'marketplace', domain: 'mercadolibre.com',
    logo: '/retailers/mercadolibre.svg', website: 'https://www.mercadolibre.com', region: 'south-america', country: 'Argentina',
    currency: 'ARS', dataSource: 'api', rating: 4.1, reviewCount: 80000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['AR', 'MX', 'CO', 'CL', 'PE', 'UY'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'As described' },
  },
  {
    id: 'magazineluiza-br', name: 'Magazine Luiza', type: 'retailer', domain: 'magazineluiza.com.br',
    logo: '/retailers/magazineluiza.svg', website: 'https://www.magazineluiza.com.br', region: 'south-america', country: 'Brazil',
    currency: 'BRL', dataSource: 'api', rating: 4.3, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 199, standardShipping: 0, regions: ['BR'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'jb-hi-fi-au', name: 'JB Hi-Fi', type: 'retailer', domain: 'jbhifi.com.au',
    logo: '/retailers/jb-hi-fi.svg', website: 'https://www.jbhifi.com.au', region: 'oceania', country: 'Australia',
    currency: 'AUD', dataSource: 'api', rating: 4.3, reviewCount: 4000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG'],
    categories: ['electronics', 'gaming'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5.95, regions: ['AU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'kogan-au', name: 'Kogan', type: 'retailer', domain: 'kogan.com',
    logo: '/retailers/kogan.svg', website: 'https://www.kogan.com', region: 'oceania', country: 'Australia',
    currency: 'AUD', dataSource: 'api', rating: 4.0, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['all'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5.99, regions: ['AU', 'NZ'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // ==================== CATEGORY-SPECIFIC GLOBAL SELLERS ====================
  
  // ELECTRONICS
  {
    id: 'newegg-global', name: 'Newegg', type: 'retailer', domain: 'newegg.com',
    logo: '/retailers/newegg.svg', website: 'https://www.newegg.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Samsung', 'LG', 'Intel', 'AMD'],
    categories: ['electronics', 'computers', 'gaming'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 5.99, expressShipping: 29.99, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'b-and-h', name: 'B&H Photo', type: 'retailer', domain: 'bhphotovideo.com',
    logo: '/retailers/bh.svg', website: 'https://www.bhphotovideo.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Canon', 'Nikon', 'Sony', 'Fuji', 'Panasonic', 'Apple', 'DJI'],
    categories: ['electronics', 'cameras', 'photography'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'currys-uk', name: 'Currys', type: 'retailer', domain: 'currys.com',
    logo: '/retailers/currys.svg', website: 'https://www.currys.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.1, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'ASUS'],
    categories: ['electronics', 'computers', 'appliances'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'saturn-de', name: 'Saturn', type: 'retailer', domain: 'saturn.de',
    logo: '/retailers/saturn.svg', website: 'https://www.saturn.de', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.1, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Bose', 'JBL'],
    categories: ['electronics', 'computers', 'audio'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.99, regions: ['DE', 'AT'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'yodobashi-jp', name: 'Yodobashi Camera', type: 'retailer', domain: 'yodobashi.com',
    logo: '/retailers/yodobashi.svg', website: 'https://www.yodobashi.com', region: 'asia', country: 'Japan',
    currency: 'JPY', dataSource: 'api', rating: 4.5, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Canon', 'Nikon', 'Sony', 'Fuji', 'Panasonic', 'Apple', 'Sharp'],
    categories: ['electronics', 'cameras', 'appliances'],
    shippingInfo: { freeShippingThreshold: 15000, standardShipping: 0, regions: ['JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'best-and-mate', name: 'Best & Mate', type: 'retailer', domain: 'best-mate.com',
    logo: '/retailers/bestmate.svg', website: 'https://www.best-mate.com', region: 'asia', country: 'Singapore',
    currency: 'SGD', dataSource: 'api', rating: 4.2, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dyson'],
    categories: ['electronics', 'appliances'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 0, regions: ['SG', 'MY'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },

  // HOME APPLIANCES
  {
    id: 'homedepot-global', name: 'Home Depot', type: 'retailer', domain: 'homedepot.com',
    logo: '/retailers/homedepot.svg', website: 'https://www.homedepot.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Samsung', 'LG', 'GE', 'Whirlpool', 'Maytag', 'KitchenAid'],
    categories: ['home-appliances', 'furniture', 'tools'],
    shippingInfo: { freeShippingThreshold: 45, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' },
  },
  {
    id: 'lowes-global', name: 'Lowe\'s', type: 'retailer', domain: 'lowes.com',
    logo: '/retailers/lowes.svg', website: 'https://www.lowes.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 18000000, isVerified: true, isOfficialStore: false,
    brands: ['Samsung', 'LG', 'GE', 'Whirlpool', 'Maytag', 'Frigidaire'],
    categories: ['home-appliances', 'furniture', 'tools'],
    shippingInfo: { freeShippingThreshold: 45, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' },
  },
  {
    id: 'media-markt-eu', name: 'MediaMarkt', type: 'retailer', domain: 'mediamarkt.de',
    logo: '/retailers/mediamarkt.svg', website: 'https://www.mediamarkt.de', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.1, reviewCount: 12000000, isVerified: true, isOfficialStore: false,
    brands: ['Samsung', 'LG', 'Siemens', 'Bosch', 'Miele', 'AEG'],
    categories: ['home-appliances', 'electronics'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.99, regions: ['DE', 'AT', 'NL', 'BE', 'IT', 'ES'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'gigantti-fi', name: 'Gigantti', type: 'retailer', domain: 'gigantti.fi',
    logo: '/retailers/gigantti.svg', website: 'https://www.gigantti.fi', region: 'europe', country: 'Finland',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Samsung', 'LG', 'Sony', 'Apple', 'Dyson'],
    categories: ['home-appliances', 'electronics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['FI', 'SE', 'NO'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },
  {
    id: 'elcorteingles-es', name: 'El Corte Inglés', type: 'retailer', domain: 'elcorteingles.es',
    logo: '/retailers/elcorteingles.svg', website: 'https://www.elcorteingles.es', region: 'europe', country: 'Spain',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Miele', 'Apple'],
    categories: ['home-appliances', 'fashion', 'electronics'],
    shippingInfo: { freeShippingThreshold: 30, standardShipping: 0, regions: ['ES', 'PT'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'auchan-global', name: 'Auchan', type: 'retailer', domain: 'auchan.com',
    logo: '/retailers/auchan.svg', website: 'https://www.auchan.com', region: 'europe', country: 'France',
    currency: 'EUR', dataSource: 'api', rating: 4.0, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['home-appliances', 'groceries', 'fashion'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['FR', 'ES', 'IT', 'PT', 'RO', 'HU', 'PL'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },

  // FASHION
  {
    id: 'zara-global', name: 'Zara', type: 'official_store', domain: 'zara.com',
    logo: '/retailers/zara.svg', website: 'https://www.zara.com', region: 'global', country: 'Spain',
    currency: 'EUR', dataSource: 'api', rating: 4.4, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['Zara'], categories: ['fashion', 'clothing'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.95, regions: ['ES', 'FR', 'IT', 'DE', 'UK', 'US', 'JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'hm-global', name: 'H&M', type: 'official_store', domain: 'hm.com',
    logo: '/retailers/hm.svg', website: 'https://www.hm.com', region: 'global', country: 'Sweden',
    currency: 'EUR', dataSource: 'api', rating: 4.3, reviewCount: 40000000, isVerified: true, isOfficialStore: true,
    brands: ['H&M', 'COS', 'Weekday', 'Monki'], categories: ['fashion', 'clothing'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5.99, regions: ['SE', 'DE', 'UK', 'US', 'FR'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'uniqlo-global', name: 'Uniqlo', type: 'official_store', domain: 'uniqlo.com',
    logo: '/retailers/uniqlo.svg', website: 'https://www.uniqlo.com', region: 'global', country: 'Japan',
    currency: 'JPY', dataSource: 'api', rating: 4.5, reviewCount: 25000000, isVerified: true, isOfficialStore: true,
    brands: ['Uniqlo'], categories: ['fashion', 'clothing'],
    shippingInfo: { freeShippingThreshold: 5000, standardShipping: 0, regions: ['JP', 'US', 'UK', 'FR', 'DE', 'CN', 'KR'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'myntra-in', name: 'Myntra', type: 'retailer', domain: 'myntra.com',
    logo: '/retailers/myntra.svg', website: 'https://www.myntra.com', region: 'asia', country: 'India',
    currency: 'INR', dataSource: 'api', rating: 4.3, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Indian & International'], categories: ['fashion', 'clothing', 'beauty'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['IN'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'asos-global', name: 'ASOS', type: 'retailer', domain: 'asos.com',
    logo: '/retailers/asos.svg', website: 'https://www.asos.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.2, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['fashion', 'clothing'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.99, regions: ['UK', 'US', 'AU', 'DE', 'FR'] },
    returnPolicy: { allowed: true, days: 28, conditions: 'Original tags' },
  },
  {
    id: 'nordstrom-us', name: 'Nordstrom', type: 'retailer', domain: 'nordstrom.com',
    logo: '/retailers/nordstrom.svg', website: 'https://www.nordstrom.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Luxury & Designer'], categories: ['fashion', 'luxury', 'beauty'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original condition' },
  },
  {
    id: 'ssense-ca', name: 'SSENSE', type: 'retailer', domain: 'ssense.com',
    logo: '/retailers/ssense.svg', website: 'https://www.ssense.com', region: 'north-america', country: 'Canada',
    currency: 'CAD', dataSource: 'api', rating: 4.4, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Gucci', 'Prada', 'Balenciaga', 'Maison Margiela'], categories: ['fashion', 'luxury'],
    shippingInfo: { freeShippingThreshold: 300, standardShipping: 0, regions: ['CA', 'US', 'UK', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'farfetch-global', name: 'Farfetch', type: 'marketplace', domain: 'farfetch.com',
    logo: '/retailers/farfetch.svg', website: 'https://www.farfetch.com', region: 'global', country: 'Portugal',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Luxury Brands'], categories: ['fashion', 'luxury'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 15, regions: ['US', 'UK', 'EU', 'JP', 'AU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original condition' },
  },

  // BEAUTY
  {
    id: 'sephora-global', name: 'Sephora', type: 'retailer', domain: 'sephora.com',
    logo: '/retailers/sephora.svg', website: 'https://www.sephora.com', region: 'global', country: 'France',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 30000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Beauty Brands'], categories: ['beauty', ' cosmetics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 5.95, regions: ['US', 'CA', 'FR', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unused' },
  },
  {
    id: 'ulta-us', name: 'Ulta Beauty', type: 'retailer', domain: 'ulta.com',
    logo: '/retailers/ulta.svg', website: 'https://www.ulta.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['beauty', 'cosmetics'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 60, conditions: 'Unused' },
  },
  {
    id: 'dermstore-uk', name: 'Dermstore', type: 'retailer', domain: 'dermstore.com',
    logo: '/retailers/dermstore.svg', website: 'https://www.dermstore.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['La Mer', 'SkinCeuticals', 'Obagi', 'Drunk Elephant'], categories: ['beauty', 'skincare'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unused' },
  },
  {
    id: 'feelunique-eu', name: 'Feelunique', type: 'retailer', domain: 'feelunique.com',
    logo: '/retailers/feelunique.svg', website: 'https://www.feelunique.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.2, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['beauty', 'skincare', 'cosmetics'],
    shippingInfo: { freeShippingThreshold: 30, standardShipping: 0, regions: ['UK', 'EU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Unused' },
  },

  // GROCERIES
  {
    id: 'walmart-grocery', name: 'Walmart Grocery', type: 'retailer', domain: 'grocery.walmart.com',
    logo: '/retailers/walmart.svg', website: 'https://grocery.walmart.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'kroger-us', name: 'Kroger', type: 'retailer', domain: 'kroger.com',
    logo: '/retailers/kroger.svg', website: 'https://www.kroger.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Fresh items' },
  },
  {
    id: 'publix-us', name: 'Publix', type: 'retailer', domain: 'publix.com',
    logo: '/retailers/publix.svg', website: 'https://www.publix.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'metro-ca', name: 'Metro', type: 'retailer', domain: 'metro.ca',
    logo: '/retailers/metro.svg', website: 'https://www.metro.ca', region: 'north-america', country: 'Canada',
    currency: 'CAD', dataSource: 'api', rating: 4.2, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['CA'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'sainsbury-uk', name: 'Sainsbury\'s', type: 'retailer', domain: 'sainsburys.co.uk',
    logo: '/retailers/sainsbury.svg', website: 'https://www.sainsburys.co.uk', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.1, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 40, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'waitrose-uk', name: 'Waitrose', type: 'retailer', domain: 'waitrose.com',
    logo: '/retailers/waitrose.svg', website: 'https://www.waitrose.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 60, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'carrefour-grocery', name: 'Carrefour', type: 'retailer', domain: 'carrefour.fr',
    logo: '/retailers/carrefour.svg', website: 'https://www.carrefour.fr', region: 'europe', country: 'France',
    currency: 'EUR', dataSource: 'api', rating: 4.1, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['FR', 'ES', 'IT', 'BE'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Fresh items' },
  },
  {
    id: 'tesco-grocery', name: 'Tesco Grocery', type: 'retailer', domain: 'tesco.com',
    logo: '/retailers/tesco.svg', website: 'https://www.tesco.com/groceries', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.0, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 40, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'albert-heijn-nl', name: 'Albert Heijn', type: 'retailer', domain: 'ah.nl',
    logo: '/retailers/albertheijn.svg', website: 'https://www.ah.nl', region: 'europe', country: 'Netherlands',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['NL'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },
  {
    id: 'istock', name: 'iStock', type: 'retailer', domain: 'colombus.com',
    logo: '/retailers/colombus.svg', website: 'https://www.colombus.com', region: 'south-america', country: 'Colombia',
    currency: 'COP', dataSource: 'api', rating: 4.0, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['groceries'],
    shippingInfo: { freeShippingThreshold: 50000, standardShipping: 0, regions: ['CO'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Fresh items' },
  },

  // AUTOMOTIVE
  {
    id: 'autoparts-24', name: 'Autoparts24', type: 'retailer', domain: 'autoparts24.eu',
    logo: '/retailers/autoparts24.svg', website: 'https://www.autoparts24.eu', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.3, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Bosch', 'Brembo', 'Michelin', 'Continental'], categories: ['automotive'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 5.99, regions: ['DE', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'autozone-us', name: 'AutoZone', type: 'retailer', domain: 'autozone.com',
    logo: '/retailers/autozone.svg', website: 'https://www.autozone.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['automotive'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original packaging' },
  },
  {
    id: 'advance-auto', name: 'Advance Auto Parts', type: 'retailer', domain: 'advanceautoparts.com',
    logo: '/retailers/advanceauto.svg', website: 'https://www.advanceautoparts.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 6000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['automotive'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 365, conditions: 'Original packaging' },
  },
  {
    id: 'oreilly-auto', name: 'O\'Reilly Auto Parts', type: 'retailer', domain: 'oreillyauto.com',
    logo: '/retailers/oreilly.svg', website: 'https://www.oreillyauto.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 7000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['automotive'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original packaging' },
  },
  {
    id: 'halfords-uk', name: 'Halfords', type: 'retailer', domain: 'halfords.com',
    logo: '/retailers/halfords.svg', website: 'https://www.halfords.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.1, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['automotive'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 4.99, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // HEALTH
  {
    id: 'cvs-us', name: 'CVS Health', type: 'retailer', domain: 'cvs.com',
    logo: '/retailers/cvs.svg', website: 'https://www.cvs.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['health', 'pharmacy'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'walgreens-us', name: 'Walgreens', type: 'retailer', domain: 'walgreens.com',
    logo: '/retailers/walgreens.svg', website: 'https://www.walgreens.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 12000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['health', 'pharmacy'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'rite-aid-us', name: 'Rite Aid', type: 'retailer', domain: 'riteaid.com',
    logo: '/retailers/riteaid.svg', website: 'https://www.riteaid.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.0, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['health', 'pharmacy'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'boots-uk', name: 'Boots', type: 'retailer', domain: 'boots.com',
    logo: '/retailers/boots.svg', website: 'https://www.boots.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.2, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['health', 'pharmacy', 'beauty'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.50, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'chemist-warehouse-au', name: 'Chemist Warehouse', type: 'retailer', domain: 'chemistwarehouse.com.au',
    logo: '/retailers/chemistwarehouse.svg', website: 'https://www.chemistwarehouse.com.au', region: 'oceania', country: 'Australia',
    currency: 'AUD', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['health', 'pharmacy', 'beauty'],
    shippingInfo: { freeShippingThreshold: 80, standardShipping: 0, regions: ['AU', 'NZ'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },

  // BABY
  {
    id: 'buybuybaby-us', name: 'Buy Buy Baby', type: 'retailer', domain: 'buybuybaby.com',
    logo: '/retailers/buybuybaby.svg', website: 'https://www.buybuybaby.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Baby Brands'], categories: ['baby'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 365, conditions: 'Original packaging' },
  },
  {
    id: 'babies-r-us', name: 'Babies R Us', type: 'retailer', domain: 'babiesrus.com',
    logo: '/retailers/babiesrus.svg', website: 'https://www.babiesrus.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 4000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Baby Brands'], categories: ['baby'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 90, conditions: 'Original packaging' },
  },
  {
    id: 'mothercare-uk', name: 'Mothercare', type: 'retailer', domain: 'mothercare.com',
    logo: '/retailers/mothercare.svg', website: 'https://www.mothercare.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.0, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Baby Brands'], categories: ['baby'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 3.99, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'baby shark', name: 'Akachan Honpo', type: 'retailer', domain: 'akachan.jp',
    logo: '/retailers/akachan.svg', website: 'https://www.akachan.jp', region: 'asia', country: 'Japan',
    currency: 'JPY', dataSource: 'api', rating: 4.5, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Japanese Baby Brands'], categories: ['baby'],
    shippingInfo: { freeShippingThreshold: 5000, standardShipping: 0, regions: ['JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // OFFICE
  {
    id: 'staples-us', name: 'Staples', type: 'retailer', domain: 'staples.com',
    logo: '/retailers/staples.svg', website: 'https://www.staples.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['office', 'electronics'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'office-depot', name: 'Office Depot', type: 'retailer', domain: 'officedepot.com',
    logo: '/retailers/officedepot.svg', website: 'https://www.officedepot.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 12000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['office', 'electronics'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'dick-smith-au', name: 'Dick Smith', type: 'retailer', domain: 'dicksmith.com.au',
    logo: '/retailers/dicksmith.svg', website: 'https://www.dicksmith.com.au', region: 'oceania', country: 'Australia',
    currency: 'AUD', dataSource: 'api', rating: 4.0, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['office', 'electronics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['AU', 'NZ'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'juni-global', name: 'Ryman', type: 'retailer', domain: 'ryman.co.uk',
    logo: '/retailers/ryman.svg', website: 'https://www.ryman.co.uk', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.3, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['office'],
    shippingInfo: { freeShippingThreshold: 30, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // SPORTS
  {
    id: 'sports-direct-uk', name: 'Sports Direct', type: 'retailer', domain: 'sportsdirect.com',
    logo: '/retailers/sportsdirect.svg', website: 'https://www.sportsdirect.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.0, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Nike', 'Adidas', 'Puma', 'Under Armour'], categories: ['sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 4.99, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'footlocker-global', name: 'Foot Locker', type: 'retailer', domain: 'footlocker.com',
    logo: '/retailers/footlocker.svg', website: 'https://www.footlocker.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance'], categories: ['sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 5.99, regions: ['US', 'CA', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'finishline-us', name: 'Finish Line', type: 'retailer', domain: 'finishline.com',
    logo: '/retailers/finishline.svg', website: 'https://www.finishline.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Nike', 'Adidas', 'Jordan', 'Under Armour'], categories: ['sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 5.99, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'decathlon-global', name: 'Decathlon', type: 'retailer', domain: 'decathlon.com',
    logo: '/retailers/decathlon.svg', website: 'https://www.decathlon.com', region: 'global', country: 'France',
    currency: 'EUR', dataSource: 'api', rating: 4.3, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Decathlon Own Brands'], categories: ['sports'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['FR', 'DE', 'UK', 'US', 'ES', 'IT'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'REI-us', name: 'REI Co-op', type: 'retailer', domain: 'rei.com',
    logo: '/retailers/rei.svg', website: 'https://www.rei.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Outdoor Brands'], categories: ['sports', 'travel'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 365, conditions: 'Original condition' },
  },
  {
    id: 'sisley', name: 'The North Face', type: 'retailer', domain: 'thenorthface.com',
    logo: '/retailers/thenorthface.svg', website: 'https://www.thenorthface.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 10000000, isVerified: true, isOfficialStore: true,
    brands: ['The North Face'], categories: ['sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 7, regions: ['US', 'CA', 'UK', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },

  // BOOKS
  {
    id: 'amazon-books', name: 'Amazon Books', type: 'retailer', domain: 'amazon.com',
    logo: '/retailers/amazonbooks.svg', website: 'https://www.amazon.com/books', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Publishers'], categories: ['books'],
    shippingInfo: { freeShippingThreshold: 25, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'barnes-noble', name: 'Barnes & Noble', type: 'retailer', domain: 'barnesandnoble.com',
    logo: '/retailers/barnesandnoble.svg', website: 'https://www.barnesandnoble.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Publishers'], categories: ['books'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'waterstones-uk', name: 'Waterstones', type: 'retailer', domain: 'waterstones.com',
    logo: '/retailers/waterstones.svg', website: 'https://www.waterstones.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Publishers'], categories: ['books'],
    shippingInfo: { freeShippingThreshold: 20, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'book-depository', name: 'Book Depository', type: 'retailer', domain: 'bookdepository.com',
    logo: '/retailers/bookdepository.svg', website: 'https://www.bookdepository.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.4, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Publishers'], categories: ['books'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['UK', 'US', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'abebooks', name: 'AbeBooks', type: 'marketplace', domain: 'abebooks.com',
    logo: '/retailers/abebooks.svg', website: 'https://www.abebooks.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Independent Sellers'], categories: ['books'],
    shippingInfo: { standardShipping: 3.99, regions: ['US', 'UK', 'CA', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'As described' },
  },
  {
    id: 'kindle', name: 'Kindle Store', type: 'retailer', domain: 'kindle.amazon.com',
    logo: '/retailers/kindle.svg', website: 'https://www.amazon.com/kindle-ebooks', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['Amazon Publishing'], categories: ['books', 'digital'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US', 'UK', 'DE', 'FR', 'JP'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Digital' },
  },

  // PETS
  {
    id: 'petco-us', name: 'Petco', type: 'retailer', domain: 'petco.com',
    logo: '/retailers/petco.svg', website: 'https://www.petco.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pet Brands'], categories: ['pets'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'petsmart-us', name: 'PetSmart', type: 'retailer', domain: 'petsmart.com',
    logo: '/retailers/petsmart.svg', website: 'https://www.petsmart.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 12000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pet Brands'], categories: ['pets'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'pets-at-home', name: 'Pets at Home', type: 'retailer', domain: 'petsathome.com',
    logo: '/retailers/petsathome.svg', website: 'https://www.petsathome.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.1, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pet Brands'], categories: ['pets'],
    shippingInfo: { freeShippingThreshold: 29, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Unopened' },
  },
  {
    id: 'zooplus-eu', name: 'Zooplus', type: 'retailer', domain: 'zooplus.com',
    logo: '/retailers/zooplus.svg', website: 'https://www.zooplus.com', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pet Brands'], categories: ['pets'],
    shippingInfo: { freeShippingThreshold: 29, standardShipping: 0, regions: ['DE', 'UK', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'PL', 'SE', 'NO', 'FI', 'DK', 'CH'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Unopened' },
  },
  {
    id: 'chewy-us', name: 'Chewy', type: 'retailer', domain: 'chewy.com',
    logo: '/retailers/chewy.svg', website: 'https://www.chewy.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pet Brands'], categories: ['pets'],
    shippingInfo: { freeShippingThreshold: 49, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 365, conditions: 'Unopened' },
  },

  // GARDEN
  {
    id: 'gardeners-supply', name: 'Gardener\'s Supply', type: 'retailer', domain: 'gardeners.com',
    logo: '/retailers/gardeners.svg', website: 'https://www.gardeners.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Garden Brands'], categories: ['garden'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'dobbies-uk', name: 'Dobbies', type: 'retailer', domain: 'dobbies.com',
    logo: '/retailers/dobbies.svg', website: 'https://www.dobbies.com', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.2, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Garden Brands'], categories: ['garden'],
    shippingInfo: { freeShippingThreshold: 30, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'bauhaus-de', name: 'Bauhaus', type: 'retailer', domain: 'bauhaus.info',
    logo: '/retailers/bauhaus.svg', website: 'https://www.bauhaus.info', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Garden & Tools Brands'], categories: ['garden', 'tools'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['DE', 'AT', 'CH', 'SE', 'DK', 'FI', 'NO'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // TRAVEL
  {
    id: 'expedia-global', name: 'Expedia', type: 'retailer', domain: 'expedia.com',
    logo: '/retailers/expedia.svg', website: 'https://www.expedia.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 30000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Airlines & Hotels'], categories: ['travel'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 0, conditions: 'Varies by booking' },
  },
  {
    id: 'booking-global', name: 'Booking.com', type: 'retailer', domain: 'booking.com',
    logo: '/retailers/booking.svg', website: 'https://www.booking.com', region: 'global', country: 'Netherlands',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Hotels'], categories: ['travel'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 0, conditions: 'Varies by booking' },
  },
  {
    id: 'airbnb-global', name: 'Airbnb', type: 'retailer', domain: 'airbnb.com',
    logo: '/retailers/airbnb.svg', website: 'https://www.airbnb.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 40000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Hosts'], categories: ['travel'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 0, conditions: 'Varies by booking' },
  },
  {
    id: 'tripadvisor-global', name: 'TripAdvisor', type: 'retailer', domain: 'tripadvisor.com',
    logo: '/retailers/tripadvisor.svg', website: 'https://www.tripadvisor.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Travel Services'], categories: ['travel'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 0, conditions: 'Varies by booking' },
  },
  {
    id: 'skyscanner-global', name: 'Skyscanner', type: 'retailer', domain: 'skyscanner.com',
    logo: '/retailers/skyscanner.svg', website: 'https://www.skyscanner.com', region: 'global', country: 'United Kingdom',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 30000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Airlines'], categories: ['travel'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 0, conditions: 'Varies by booking' },
  },

  // LUXURY
  {
    id: 'net-a-porter', name: 'NET-A-PORTER', type: 'retailer', domain: 'net-a-porter.com',
    logo: '/retailers/netaporter.svg', website: 'https://www.net-a-porter.com', region: 'global', country: 'United Kingdom',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Gucci', 'Prada', 'Chanel', 'Louis Vuitton', 'Balenciaga'], categories: ['luxury', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 15, regions: ['US', 'UK', 'EU', 'AU'] },
    returnPolicy: { allowed: true, days: 28, conditions: 'Original tags' },
  },
  {
    id: 'matchesfashion', name: 'MatchesFashion', type: 'retailer', domain: 'matchesfashion.com',
    logo: '/retailers/matchesfashion.svg', website: 'https://www.matchesfashion.com', region: 'global', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.4, reviewCount: 4000000, isVerified: true, isOfficialStore: false,
    brands: ['Gucci', 'Prada', 'Balenciaga', 'Saint Laurent', 'Valentino'], categories: ['luxury', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 15, regions: ['UK', 'US', 'EU', 'AU'] },
    returnPolicy: { allowed: true, days: 28, conditions: 'Original tags' },
  },
  {
    id: 'mytheresa', name: 'Mytheresa', type: 'retailer', domain: 'mytheresa.com',
    logo: '/retailers/mytheresa.svg', website: 'https://www.mytheresa.com', region: 'global', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.4, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Gucci', 'Prada', 'Burberry', 'Moncler', 'Stella McCartney'], categories: ['luxury', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 15, regions: ['DE', 'UK', 'US', 'FR', 'IT'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'revolve-global', name: 'Revolve', type: 'retailer', domain: 'revolve.com',
    logo: '/retailers/revolve.svg', website: 'https://www.revolve.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Designer & Streetwear'], categories: ['luxury', 'fashion'],
    shippingInfo: { freeShippingThreshold: 100, standardShipping: 6.95, regions: ['US', 'CA', 'UK', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },

  // SOFTWARE
  {
    id: 'microsoft-store-software', name: 'Microsoft Store', type: 'official_store', domain: 'microsoft.com/en-us/software',
    logo: '/retailers/microsoft.svg', website: 'https://www.microsoft.com/en-us/software', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 30000000, isVerified: true, isOfficialStore: true,
    brands: ['Microsoft'], categories: ['software', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Digital' },
  },
  {
    id: 'adobe-store', name: 'Adobe Store', type: 'official_store', domain: 'adobe.com',
    logo: '/retailers/adobe.svg', website: 'https://www.adobe.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['Adobe'], categories: ['software', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Digital' },
  },
  {
    id: 'apple-software', name: 'Apple App Store', type: 'official_store', domain: 'apps.apple.com',
    logo: '/retailers/apple.svg', website: 'https://apps.apple.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.7, reviewCount: 100000000, isVerified: true, isOfficialStore: true,
    brands: ['Apple'], categories: ['software', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'google-play', name: 'Google Play', type: 'official_store', domain: 'play.google.com',
    logo: '/retailers/google.svg', website: 'https://play.google.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 50000000, isVerified: true, isOfficialStore: true,
    brands: ['Google'], categories: ['software', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'steam-global', name: 'Steam', type: 'retailer', domain: 'store.steampowered.com',
    logo: '/retailers/steam.svg', website: 'https://store.steampowered.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 100000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Game Publishers'], categories: ['software', 'gaming'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'gog-global', name: 'GOG.com', type: 'retailer', domain: 'gog.com',
    logo: '/retailers/gog.svg', website: 'https://www.gog.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Game Publishers'], categories: ['software', 'gaming'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },

  // FURNITURE
  {
    id: 'wayfair-global', name: 'Wayfair', type: 'retailer', domain: 'wayfair.com',
    logo: '/retailers/wayfair.svg', website: 'https://www.wayfair.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 25000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Furniture Brands'], categories: ['furniture', 'home'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'ikea-global', name: 'IKEA', type: 'retailer', domain: 'ikea.com',
    logo: '/retailers/ikea.svg', website: 'https://www.ikea.com', region: 'global', country: 'Sweden',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['IKEA'], categories: ['furniture', 'home'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5.99, regions: ['US', 'CA', 'UK', 'DE', 'FR', 'SE', 'AU'] },
    returnPolicy: { allowed: true, days: 365, conditions: 'Original condition' },
  },
  {
    id: 'wayfair-uk', name: 'Wayfair UK', type: 'retailer', domain: 'wayfair.co.uk',
    logo: '/retailers/wayfair.svg', website: 'https://www.wayfair.co.uk', region: 'europe', country: 'United Kingdom',
    currency: 'GBP', dataSource: 'api', rating: 4.2, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Furniture Brands'], categories: ['furniture', 'home'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['UK'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'crate-and-barrel', name: 'Crate & Barrel', type: 'retailer', domain: 'crateandbarrel.com',
    logo: '/retailers/crateandbarrel.svg', website: 'https://www.crateandbarrel.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Crate & Barrel'], categories: ['furniture', 'home'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'west-elm', name: 'West Elm', type: 'retailer', domain: 'westelm.com',
    logo: '/retailers/westelm.svg', website: 'https://www.westelm.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 4000000, isVerified: true, isOfficialStore: false,
    brands: ['West Elm'], categories: ['furniture', 'home'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },

  // PHARMACY
  {
    id: 'walgreens-pharmacy', name: 'Walgreens Pharmacy', type: 'retailer', domain: 'walgreens.com',
    logo: '/retailers/walgreens.svg', website: 'https://www.walgreens.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.1, reviewCount: 15000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['pharmacy', 'health'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'cvs-pharmacy', name: 'CVS Pharmacy', type: 'retailer', domain: 'cvs.com/pharmacy',
    logo: '/retailers/cvs.svg', website: 'https://www.cvs.com/pharmacy', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 20000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['pharmacy', 'health'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'pharmacie-fr', name: 'Pharmacie.fr', type: 'retailer', domain: 'pharmacie.fr',
    logo: '/retailers/pharmaciefr.svg', website: 'https://www.pharmacie.fr', region: 'europe', country: 'France',
    currency: 'EUR', dataSource: 'api', rating: 4.2, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various'], categories: ['pharmacy', 'health'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 4.99, regions: ['FR'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'Original packaging' },
  },

  // ART
  {
    id: 'saatchi-art', name: 'Saatchi Art', type: 'marketplace', domain: 'saatchiart.com',
    logo: '/retailers/saatchi.svg', website: 'https://www.saatchiart.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Independent Artists'], categories: ['art'],
    shippingInfo: { regions: ['US', 'UK', 'EU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'As described' },
  },
  {
    id: 'artsy-global', name: 'Artsy', type: 'marketplace', domain: 'artsy.net',
    logo: '/retailers/artsy.svg', website: 'https://www.artsy.net', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 1500000, isVerified: true, isOfficialStore: false,
    brands: ['Galleries & Artists'], categories: ['art'],
    shippingInfo: { regions: ['US', 'UK', 'EU'] },
    returnPolicy: { allowed: true, days: 14, conditions: 'As described' },
  },
  {
    id: 'etsy-art', name: 'Etsy Art', type: 'marketplace', domain: 'etsy.com',
    logo: '/retailers/etsy.svg', website: 'https://www.etsy.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Independent Sellers'], categories: ['art', 'handmade'],
    shippingInfo: { regions: ['US', 'UK', 'CA', 'AU', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'As described' },
  },

  // MUSIC
  {
    id: 'guitar-center', name: 'Guitar Center', type: 'retailer', domain: 'guitarcenter.com',
    logo: '/retailers/guitarcenter.svg', website: 'https://www.guitarcenter.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Fender', 'Gibson', 'Yamaha', 'Roland', 'Marshall'], categories: ['music', 'instruments'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'sweetwater', name: 'Sweetwater', type: 'retailer', domain: 'sweetwater.com',
    logo: '/retailers/sweetwater.svg', website: 'https://www.sweetwater.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.8, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Pro Audio Brands'], categories: ['music', 'instruments'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'thomann-de', name: 'Thomann', type: 'retailer', domain: 'thomann.de',
    logo: '/retailers/thomann.svg', website: 'https://www.thomann.de', region: 'europe', country: 'Germany',
    currency: 'EUR', dataSource: 'api', rating: 4.6, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Music Brands'], categories: ['music', 'instruments'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['DE', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'apple-music', name: 'Apple Music', type: 'retailer', domain: 'music.apple.com',
    logo: '/retailers/apple.svg', website: 'https://music.apple.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 50000000, isVerified: true, isOfficialStore: true,
    brands: ['Apple'], categories: ['music', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'spotify', name: 'Spotify', type: 'retailer', domain: 'spotify.com',
    logo: '/retailers/spotify.svg', website: 'https://www.spotify.com', region: 'global', country: 'Sweden',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 50000000, isVerified: true, isOfficialStore: false,
    brands: ['Spotify'], categories: ['music', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'cd-japan', name: 'CDJapan', type: 'retailer', domain: 'cdjapan.co.jp',
    logo: '/retailers/cdjapan.svg', website: 'https://www.cdjapan.co.jp', region: 'asia', country: 'Japan',
    currency: 'JPY', dataSource: 'api', rating: 4.5, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Japanese Music'], categories: ['music'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 1500, regions: ['JP', 'US', 'INT'] },
    returnPolicy: { allowed: true, days: 7, conditions: 'Unopened' },
  },

  // INDUSTRIAL
  {
    id: 'grainger-us', name: 'Grainger', type: 'retailer', domain: 'grainger.com',
    logo: '/retailers/grainger.svg', website: 'https://www.grainger.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Industrial Brands'], categories: ['industrial', 'tools'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'mcmaster-carr', name: 'McMaster-Carr', type: 'retailer', domain: 'mcmaster.com',
    logo: '/retailers/mcmastercarr.svg', website: 'https://www.mcmaster.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.8, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Industrial Brands'], categories: ['industrial', 'tools'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'mscdirect', name: 'MSC Industrial Supply', type: 'retailer', domain: 'mscdirect.com',
    logo: '/retailers/mscdirect.svg', website: 'https://www.mscdirect.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Various Industrial Brands'], categories: ['industrial', 'tools'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // SMART HOME
  {
    id: 'bestbuy-smart-home', name: 'Best Buy Smart Home', type: 'retailer', domain: 'bestbuy.com/smart-home',
    logo: '/retailers/bestbuy.svg', website: 'https://www.bestbuy.com/smart-home', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 8000000, isVerified: true, isOfficialStore: false,
    brands: ['Google', 'Amazon', 'Apple', 'Ring', 'Nest', 'Philips Hue'], categories: ['smart-home', 'electronics'],
    shippingInfo: { freeShippingThreshold: 35, standardShipping: 0, regions: ['US', 'CA'] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Original packaging' },
  },
  {
    id: 'samsung-smartthings', name: 'Samsung SmartThings', type: 'official_store', domain: 'samsung.com/us/smartthings',
    logo: '/retailers/samsung.svg', website: 'https://www.samsung.com/us/smartthings', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 5000000, isVerified: true, isOfficialStore: true,
    brands: ['Samsung'], categories: ['smart-home', 'electronics'],
    shippingInfo: { freeShippingThreshold: 50, standardShipping: 0, regions: ['US', 'KR', 'UK', 'DE'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },
  {
    id: 'amazon-smart-home', name: 'Amazon Smart Home', type: 'official_store', domain: 'amazon.com/smart-home',
    logo: '/retailers/amazon.svg', website: 'https://www.amazon.com/smart-home', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['Amazon', 'Ring', 'Eufy', 'Blink'], categories: ['smart-home', 'electronics'],
    shippingInfo: { freeShippingThreshold: 25, standardShipping: 0, regions: ['US'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original packaging' },
  },

  // DIGITAL
  {
    id: 'google-digital', name: 'Google Store Digital', type: 'official_store', domain: 'store.google.com',
    logo: '/retailers/google.svg', website: 'https://store.google.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 15000000, isVerified: true, isOfficialStore: true,
    brands: ['Google'], categories: ['digital', 'electronics'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 15, conditions: 'Digital' },
  },
  {
    id: 'app-store', name: 'App Store', type: 'official_store', domain: 'apps.apple.com',
    logo: '/retailers/apple.svg', website: 'https://apps.apple.com', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.7, reviewCount: 100000000, isVerified: true, isOfficialStore: true,
    brands: ['Apple'], categories: ['digital', 'software'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'microsoft-digital', name: 'Microsoft Digital Store', type: 'official_store', domain: 'microsoft.com/en-us/store',
    logo: '/retailers/microsoft.svg', website: 'https://www.microsoft.com/en-us/store', region: 'global', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 20000000, isVerified: true, isOfficialStore: true,
    brands: ['Microsoft'], categories: ['digital', 'software'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Digital' },
  },

  // FINANCE
  {
    id: 'mint', name: 'Mint', type: 'retailer', domain: 'mint.com',
    logo: '/retailers/mint.svg', website: 'https://www.mint.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.3, reviewCount: 5000000, isVerified: true, isOfficialStore: false,
    brands: ['Intuit'], categories: ['finance', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },
  {
    id: 'coinbase', name: 'Coinbase', type: 'retailer', domain: 'coinbase.com',
    logo: '/retailers/coinbase.svg', website: 'https://www.coinbase.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.2, reviewCount: 10000000, isVerified: true, isOfficialStore: false,
    brands: ['Coinbase'], categories: ['finance', 'digital'],
    shippingInfo: { regions: [] },
    returnPolicy: { allowed: false, days: 0, conditions: 'Digital' },
  },

  // ECO / SUSTAINABLE
  {
    id: 'patagonia', name: 'Patagonia', type: 'official_store', domain: 'patagonia.com',
    logo: '/retailers/patagonia.svg', website: 'https://www.patagonia.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.6, reviewCount: 8000000, isVerified: true, isOfficialStore: true,
    brands: ['Patagonia'], categories: ['eco', 'sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5, regions: ['US', 'CA', 'UK', 'EU', 'JP'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'the-north-face-eco', name: 'The North Face', type: 'official_store', domain: 'thenorthface.com',
    logo: '/retailers/thenorthface.svg', website: 'https://www.thenorthface.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.5, reviewCount: 10000000, isVerified: true, isOfficialStore: true,
    brands: ['The North Face'], categories: ['eco', 'sports', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 7, regions: ['US', 'CA', 'UK', 'EU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original condition' },
  },
  {
    id: 'everlane', name: 'Everlane', type: 'retailer', domain: 'everlane.com',
    logo: '/retailers/everlane.svg', website: 'https://www.everlane.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 3000000, isVerified: true, isOfficialStore: false,
    brands: ['Everlane'], categories: ['eco', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 5.95, regions: ['US', 'CA', 'UK', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  {
    id: 'reformation', name: 'Reformation', type: 'retailer', domain: 'thereformation.com',
    logo: '/retailers/reformation.svg', website: 'https://www.thereformation.com', region: 'north-america', country: 'USA',
    currency: 'USD', dataSource: 'api', rating: 4.4, reviewCount: 2000000, isVerified: true, isOfficialStore: false,
    brands: ['Reformation'], categories: ['eco', 'fashion'],
    shippingInfo: { freeShippingThreshold: 0, standardShipping: 7, regions: ['US', 'CA', 'UK', 'AU'] },
    returnPolicy: { allowed: true, days: 30, conditions: 'Original tags' },
  },
  ...generateAmazonSellers(),
];

export function getSellerById(id: string): GlobalSeller | undefined {
  return GLOBAL_SELLERS.find(s => s.id === id);
}

export function getSellersByType(type: SellerType): GlobalSeller[] {
  return GLOBAL_SELLERS.filter(s => s.type === type);
}

export function getSellersByRegion(region: string): GlobalSeller[] {
  return GLOBAL_SELLERS.filter(s => s.region === region || s.region === 'global');
}

export function getSellersByCountry(country: string): GlobalSeller[] {
  return GLOBAL_SELLERS.filter(s => s.country.toLowerCase() === country.toLowerCase());
}

export function getSellersByBrand(brand: string): GlobalSeller[] {
  return GLOBAL_SELLERS.filter(s => s.brands.includes(brand) || s.brands.includes('Various') || s.brands.includes('All Brands'));
}

export function getAllRegions(): string[] {
  return [...new Set(GLOBAL_SELLERS.map(s => s.region))];
}

export function getAllCountries(): string[] {
  return [...new Set(GLOBAL_SELLERS.map(s => s.country))];
}

export function getAllBrands(): string[] {
  const brands = GLOBAL_SELLERS.flatMap(s => s.brands);
  return [...new Set(brands)].sort();
}

export function getSellerTypes(): SellerType[] {
  return ['manufacturer', 'retailer', 'authorized_dealer', 'wholesaler', 'marketplace', 'official_store', 'independent'];
}

export function getRegionName(region: string): string {
  const names: Record<string, string> = {
    'north-america': 'North America',
    'south-america': 'South America',
    'europe': 'Europe',
    'asia': 'Asia Pacific',
    'middle-east': 'Middle East',
    'africa': 'Africa',
    'oceania': 'Oceania',
    'global': 'Worldwide',
  };
  return names[region] || region;
}

export function getSellerTypeName(type: SellerType): string {
  const names: Record<SellerType, string> = {
    'manufacturer': 'Manufacturer',
    'retailer': 'Retailer',
    'authorized_dealer': 'Authorized Dealer',
    'wholesaler': 'Wholesaler',
    'marketplace': 'Marketplace',
    'official_store': 'Official Store',
    'independent': 'Independent Seller',
  };
  return names[type];
}

export function getCountryCount(): number {
  return getAllCountries().length;
}

export function getSellerCount(): number {
  return GLOBAL_SELLERS.length;
}
