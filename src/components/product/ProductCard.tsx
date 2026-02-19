/**
 * PriceX - Product Card Component
 * Product display card with pricing and actions
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  BarChart2, 
  Bell, 
  Star, 
  ShoppingCart,
  Check,
  MapPin,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { Product } from '@/types/product-data';
import { useProduct } from '@/context/ProductContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  showActions?: boolean;
}

export function ProductCard({ 
  product, 
  variant = 'default',
  showActions = true,
}: ProductCardProps) {
  const { 
    addToComparison, 
    removeFromComparison, 
    isInComparison,
    createBackInStockAlert,
  } = useProduct();
  const { formatPrice } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const bestPrice = product.pricePoints.sort((a, b) => a.price - b.price)[0];
  const isCompared = isInComparison(product.id);
  const isOutOfStock = product.availability === 'out_of_stock';
  
  const handleCompareToggle = () => {
    if (isCompared) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };
  
  const handleBackInStockAlert = async () => {
    await createBackInStockAlert(product.id, 30);
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {!imageError && product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription || product.description}</p>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-lg transition-colors ${isWishlisted ? 'text-red-500 bg-red-500/10' : 'hover:bg-secondary'}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleCompareToggle}
                  className={`p-2 rounded-lg transition-colors ${isCompared ? 'text-[var(--pricex-yellow)] bg-[var(--pricex-yellow)]/10' : 'hover:bg-secondary'}`}
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          </div>
          
          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-2xl font-bold">${bestPrice?.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                from {bestPrice?.retailer.name}
              </p>
            </div>
            
            {isOutOfStock ? (
              <button
                onClick={handleBackInStockAlert}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:border-[var(--pricex-yellow)] transition-colors"
              >
                <Bell className="w-4 h-4" />
                Alert me
              </button>
            ) : (
              <a
                href={bestPrice?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--pricex-yellow)] text-black font-medium rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Deal
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {!imageError && product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              Out of Stock
            </span>
          )}
          {bestPrice?.originalPrice && bestPrice.price < bestPrice.originalPrice && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
              -{Math.round(((bestPrice.originalPrice - bestPrice.price) / bestPrice.originalPrice) * 100)}%
            </span>
          )}
          {bestPrice?.retailer.isOfficialStore && (
            <span className="px-2 py-1 bg-[var(--pricex-yellow)] text-black text-xs font-medium rounded">
              Official
            </span>
          )}
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full bg-background/90 backdrop-blur-sm shadow-lg transition-colors ${isWishlisted ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-full bg-background/90 backdrop-blur-sm shadow-lg transition-colors ${isCompared ? 'text-[var(--pricex-yellow)]' : ''}`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        
        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-[var(--pricex-yellow)] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        
        {/* SKU */}
        <p className="text-xs text-muted-foreground mb-3">SKU: {product.sku}</p>
        
        {/* Features */}
        {product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${bestPrice?.price.toFixed(2)}</span>
            {bestPrice?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${bestPrice.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>from</span>
            <span className="font-medium">{bestPrice?.retailer.name}</span>
            {bestPrice?.shippingCost === 0 && (
              <span className="text-green-500">+ Free shipping</span>
            )}
          </div>
        </div>
        
        {/* Retailer Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Check className="w-3 h-3 text-green-500" />
          <span>{bestPrice?.retailer.rating}★ retailer</span>
          {bestPrice?.retailer.locations && bestPrice.retailer.locations.length > 0 && (
            <>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span>{bestPrice.retailer.locations.length} locations</span>
            </>
          )}
        </div>
        
        {/* CTA */}
        {isOutOfStock ? (
          <button
            onClick={handleBackInStockAlert}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-border rounded-lg font-medium hover:border-[var(--pricex-yellow)] transition-colors"
          >
            <Bell className="w-4 h-4" />
            Back in Stock Alert
          </button>
        ) : (
          <a
            href={bestPrice?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--pricex-yellow)] text-black font-semibold rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            View Deal
          </a>
        )}
      </div>
    </motion.div>
  );
}
