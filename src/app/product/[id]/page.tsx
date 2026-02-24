/**
 * PriceX - Product Details Page
 * Individual product view with AI predictions
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Bell, 
  AlertCircle,
  Check,
  Star,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  ShoppingCart,
  TrendingDown,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';

const SAMPLE_RETAILERS = [
  { id: '1', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', logoWidth: 40, price: 1199.00, originalPrice: 1299.00, inStock: true, rating: 4.8, delivery: 'Free 2-day', productUrl: 'https://www.amazon.com/dp/B0D1XD1ZV3' },
  { id: '2', name: 'Best Buy', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Best_Buy_Logo.svg/200px-Best_Buy_Logo.svg.png', logoWidth: 50, price: 1249.99, originalPrice: 1299.99, inStock: true, rating: 4.6, delivery: 'Free shipping', productUrl: 'https://www.bestbuy.com/site/apple-iphone-15-pro-max-256gb-natural-titanium-att-verizon-t-mobile/6509464.p' },
  { id: '3', name: 'Walmart', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Walmart_logo.svg/200px-Walmart_logo.svg.png', logoWidth: 60, price: 1159.00, originalPrice: 1299.00, inStock: true, rating: 4.5, delivery: 'Free delivery', productUrl: 'https://www.walmart.com/ip/Apple-iPhone-15-Pro-Max-256GB-Natural-Titanium/1783227083' },
  { id: '4', name: 'Target', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Target_logo.svg/200px-Target_logo.svg.png', logoWidth: 40, price: 1219.99, originalPrice: 1299.99, inStock: false, rating: 4.7, delivery: 'Free shipping', productUrl: 'https://www.target.com/p/apple-iphone-15-pro-max/-/A-1783227083' },
  { id: '5', name: 'Newegg', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Newegg_Logo.svg/200px-Newegg_Logo.svg.png', logoWidth: 60, price: 1179.00, originalPrice: 1299.00, inStock: true, rating: 4.4, delivery: 'Free shipping', productUrl: 'https://www.newegg.com/p/N82E16834987132' },
  { id: '6', name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/200px-EBay_logo.svg.png', logoWidth: 50, price: 1099.00, originalPrice: 1399.00, inStock: true, rating: 4.3, delivery: '$9.99 shipping', productUrl: 'https://www.ebay.com/itm/195753448137' },
];

const SAMPLE_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    description: 'The iPhone 15 Pro Max features a stunning Super Retina XDR display, A17 Pro chip, and a revolutionary camera system with 5x optical zoom. Titanium design, Action button, and USB-C compatibility make this the most advanced iPhone yet.',
    category: { name: 'Electronics' },
    images: [
      { id: '1', url: '/product-1.jpg', retailer: 'Retailer' },
      { id: '2', url: '/product-1.jpg', retailer: 'Retailer' },
      { id: '3', url: '/product-1.jpg', retailer: 'Retailer' },
    ],
    manufacturerUrl: 'https://www.apple.com/iphone-15-pro/',
    rating: 4.8,
    reviewCount: 2543,
    specs: [
      { label: 'Display', value: '6.7" Super Retina XDR' },
      { label: 'Processor', value: 'A17 Pro chip' },
      { label: 'Storage', value: '256GB / 512GB / 1TB' },
      { label: 'Camera', value: '48MP Main, 5x Optical Zoom' },
      { label: 'Battery', value: 'Up to 29 hours video' },
      { label: 'Connectivity', value: 'USB-C, 5G, WiFi 6E' },
    ],
  },
  '2': {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    description: 'The Samsung Galaxy S24 Ultra with Galaxy AI features, S Pen, and 200MP camera. Experience the ultimate smartphone with titanium frame and AI-powered features.',
    category: { name: 'Electronics' },
    images: [
      { id: '1', url: '/product-2.jpg', retailer: 'Retailer' },
      { id: '2', url: '/product-2.jpg', retailer: 'Retailer' },
      { id: '3', url: '/product-2.jpg', retailer: 'Retailer' },
    ],
    manufacturerUrl: 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/',
    rating: 4.7,
    reviewCount: 1823,
    specs: [
      { label: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'Storage', value: '256GB / 512GB / 1TB' },
      { label: 'Camera', value: '200MP Main, 100x Space Zoom' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'S Pen', value: 'Built-in' },
    ],
  },
};

export default function ProductDetailsPage() {
  const params = useParams();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        const productId = params.id as string;
        const sampleProduct = SAMPLE_PRODUCTS[productId];
        
        // Try to fetch comparison data from API
        let comparisonData: any[] = [];
        try {
          const productName = sampleProduct?.name || 'iPhone 15 Pro Max';
          const response = await fetch(`/api/products/search?q=${encodeURIComponent(productName)}&limit=1`);
          const data = await response.json();
          if (data.products?.[0]?.pricePoints) {
            comparisonData = data.products[0].pricePoints.map((pp: any) => ({
              id: pp.retailerId || Math.random().toString(),
              name: pp.retailer?.name || pp.retailer || 'Unknown',
              logo: pp.retailer?.logo || '',
              logoWidth: 40,
              price: pp.price,
              originalPrice: pp.originalPrice,
              inStock: pp.availability === 'in_stock',
              rating: pp.rating || pp.retailer?.rating || 4.5,
              delivery: pp.shipping?.estimatedDelivery || 'Standard shipping',
              productUrl: pp.url || '#',
              cheapestFlag: pp.cheapestFlag,
              dealScore: pp.dealScore,
              rank: pp.rank,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch comparison data:', error);
        }
        
        if (sampleProduct) {
          setProduct(sampleProduct);
        } else {
          setProduct({
            id: params.id,
            name: 'Sample Product',
            brand: 'Brand Name',
            description: 'Product description here',
            category: { name: 'Electronics' },
            images: [
              { id: '1', url: '/product-3.jpg', retailer: 'Retailer' },
              { id: '2', url: '/product-4.jpg', retailer: 'Retailer' },
              { id: '3', url: '/product-5.jpg', retailer: 'Retailer' },
            ],
            manufacturerUrl: 'https://www.brandname.com/product',
            rating: 4.5,
            reviewCount: 128,
          });
        }
        
        // Use comparison data if available, otherwise fallback to sample
        if (comparisonData.length > 0) {
          setRetailers(comparisonData);
        } else {
          setRetailers(SAMPLE_RETAILERS);
        }
        
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [params.id]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-[120px] flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--pricex-yellow)]" />
        </div>
        <Footer />
      </div>
    );
  }

  const cheapestRetailer = retailers.reduce((min, r) => r.price < min.price ? r : min, retailers[0]);
  const bestPrice = Math.min(...retailers.filter(r => r.inStock).map(r => r.price));
  const savings = cheapestRetailer.originalPrice - cheapestRetailer.price;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-foreground transition-colors">{product.category?.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-2xl bg-card border border-border overflow-hidden"
              >
                <img
                  src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images?.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[var(--pricex-yellow)]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    {product.manufacturerUrl && (
                      <a
                        href={product.manufacturerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--pricex-yellow)] hover:underline flex items-center gap-1"
                      >
                        Official Site <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} {t('product.reviews')})
                </span>
              </div>

              {/* Best Price Highlight */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[var(--pricex-yellow)]/10 to-transparent rounded-xl border border-[var(--pricex-yellow)]/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-[var(--pricex-yellow)]" />
                  <span className="font-semibold text-[var(--pricex-yellow)]">Best Price</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[var(--pricex-yellow)]">
                    ${bestPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">at {cheapestRetailer.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-green-500">
                  <Award className="w-4 h-4" />
                  <span>Save ${savings.toFixed(2)} ({Math.round((savings / cheapestRetailer.originalPrice) * 100)}% off)</span>
                </div>
              </div>

              {/* Price Comparison Table */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Compare Prices from {retailers.length} Retailers
                </h3>
                <div className="space-y-2">
                  {retailers
                    .sort((a, b) => (a.rank || a.price) - (b.rank || b.price))
                    .map((retailer, index) => (
                      <div
                        key={retailer.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          retailer.cheapestFlag || retailer.price === bestPrice
                            ? 'border-[var(--pricex-yellow)] bg-[var(--pricex-yellow)]/5'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {retailer.logo?.startsWith('http') ? (
                            <img src={retailer.logo} alt={retailer.name} style={{ width: retailer.logoWidth || 40 }} className="h-8 object-contain" />
                          ) : (
                            <span className="text-2xl">{retailer.logo}</span>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{retailer.name}</span>
                              {retailer.cheapestFlag || retailer.price === bestPrice ? (
                                <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full font-medium flex items-center gap-1">
                                  <Award className="w-3 h-3" />
                                  Best Deal
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full font-medium">
                                  Rank #{retailer.rank || index + 1}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {retailer.rating}
                              </span>
                              <span>•</span>
                              <span>{retailer.delivery}</span>
                              {retailer.dealScore && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-600 font-medium">Score: {retailer.dealScore}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {retailer.originalPrice > retailer.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${retailer.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className={`font-bold text-lg ${retailer.cheapestFlag || retailer.price === bestPrice ? 'text-green-500' : ''}`}>
                              ${retailer.price.toFixed(2)}
                            </span>
                          </div>
                          {retailer.inStock ? (
                            <a
                              href={retailer.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 text-sm px-3 py-1 rounded-lg font-medium transition-colors bg-[var(--pricex-yellow)] text-black hover:bg-[var(--pricex-yellow-dark)] inline-block"
                            >
                              Buy Now
                            </a>
                          ) : (
                            <span className="mt-1 text-sm px-3 py-1 rounded-lg font-medium bg-gray-200 text-gray-500 inline-block">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 h-14 bg-[var(--pricex-yellow)] text-black font-bold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('product.addToCart')}
                </button>
                <button 
                  onClick={() => setShowPriceAlert(true)}
                  className="px-6 h-14 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors flex items-center justify-center"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>

              {/* Specifications */}
              {product.specs && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.specs.map((spec: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-secondary/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">{spec.label}</span>
                        <span className="text-sm font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
