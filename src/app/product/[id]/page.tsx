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
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProduct } from '@/context/ProductContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/lib/utils';

export default function ProductDetailsPage() {
  const params = useParams();
  const { getProduct, isLoading } = useProduct();
  const { currency } = useCurrency();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        const data = await getProduct(params.id as string);
        setProduct(data);
      }
    };
    loadProduct();
  }, [params.id]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[120px] flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--pricex-yellow)]" />
        </div>
        <Footer />
      </div>
    );
  }

  const bestPrice = Math.min(...product.pricePoints?.map((p: any) => p.price) || [0]);
  const highestPrice = Math.max(...product.pricePoints?.map((p: any) => p.price) || [0]);
  const savings = highestPrice - bestPrice;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-foreground transition-colors">{product.category?.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-2xl bg-card border border-border overflow-hidden"
              >
                <img
                  src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex gap-2 overflow-x-auto">
                {product.images?.map((img: any, index: number) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-[var(--pricex-yellow)]' 
                        : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
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
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-[var(--pricex-yellow)] text-[var(--pricex-yellow)]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating?.toFixed(1)} ({product.reviewCount?.toLocaleString()} reviews)
                </span>
              </div>

              {/* AI Prediction Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--pricex-yellow)]/10 to-[var(--pricex-yellow)]/5 border border-[var(--pricex-yellow)]/20 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pricex-yellow)] flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Price Prediction</h3>
                    <p className="text-sm text-muted-foreground">Powered by PriceX Intelligence™</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-green-500 font-semibold">Buy Now</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prices are expected to rise in the next 7 days
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold">
                    {formatCurrency(bestPrice, currency)}
                  </span>
                  {savings > 0 && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(highestPrice, currency)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-green-500 font-medium">
                    Save {formatCurrency(savings, currency)} ({Math.round((savings / highestPrice) * 100)}% off)
                  </p>
                )}
              </div>

              {/* Price Alert */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPriceAlert(!showPriceAlert)}
                  className="flex items-center gap-2 text-[var(--pricex-yellow)] hover:underline"
                >
                  <Bell className="w-5 h-5" />
                  <span>Set Price Alert</span>
                </button>
                {showPriceAlert && (
                  <div className="mt-4 p-4 rounded-xl bg-card border border-border">
                    <label className="block text-sm font-medium mb-2">
                      Target Price
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Enter target price"
                        className="flex-1 h-10 px-4 rounded-lg bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      />
                      <button className="h-10 px-4 bg-[var(--pricex-yellow)] text-black font-semibold rounded-lg">
                        Set Alert
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Retailers */}
              <div className="space-y-3 mb-8">
                <h3 className="font-semibold">Compare Prices ({product.pricePoints?.length || 0} retailers)</h3>
                {product.pricePoints?.slice(0, 5).map((price: any, index: number) => (
                  <div
                    key={price.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      index === 0 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-semibold">
                        {price.retailer?.name?.[0] || 'R'}
                      </div>
                      <div>
                        <p className="font-medium">{price.retailer?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {price.inStock ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <Check className="w-3 h-3" /> In Stock
                            </span>
                          ) : (
                            <span className="text-red-500">Out of Stock</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(price.price, currency)}</p>
                      <a
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--pricex-yellow)] hover:underline flex items-center gap-1"
                      >
                        Visit Store <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="space-y-2">
                  {product.specifications?.map((spec: any) => (
                    <div
                      key={spec.attributeId}
                      className="flex justify-between py-2 border-b border-border"
                    >
                      <span className="text-muted-foreground">{spec.name}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
