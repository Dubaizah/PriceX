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
import { formatCurrency } from '@/lib/utils';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        // Mock product data for demo
        setProduct({
          id: params.id,
          name: 'Sample Product',
          brand: 'Brand Name',
          description: 'Product description here',
          category: { name: 'Electronics' },
          images: [{ id: '1', url: 'https://placehold.co/600x600' }],
          pricePoints: [{ price: 299.99, retailer: { name: 'Amazon' } }],
          rating: 4.5,
          reviewCount: 128,
        });
        setIsLoading(false);
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
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
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
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--pricex-yellow)]">
                  {formatCurrency(product.pricePoints?.[0]?.price || 0, 'USD')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 h-14 bg-[var(--pricex-yellow)] text-black font-bold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button 
                  onClick={() => setShowPriceAlert(true)}
                  className="px-6 h-14 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors flex items-center justify-center"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>

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
