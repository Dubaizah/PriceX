/**
 * PriceX - Product Comparison Component
 * Side-by-side comparison with highlighting
 */

'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  MapPin, 
  Truck, 
  Shield, 
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { Product, PricePoint, ProductSpecification } from '@/types/product-data';
import { useCurrency } from '@/context/CurrencyContext';

interface ComparisonTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
}

interface ComparisonRow {
  label: string;
  key: string;
  type: 'text' | 'image' | 'price' | 'rating' | 'list' | 'specs';
  values: (string | number | boolean | string[] | PricePoint[] | ProductSpecification[] | { rating: number; count: number } | null)[];
  highlightBest?: boolean;
}

export function ProductComparisonTable({ products, onRemoveProduct }: ComparisonTableProps) {
  const { formatPrice, convertPrice } = useCurrency();
  const [expandedSpecs, setExpandedSpecs] = useState(true);
  const [selectedPricePoints, setSelectedPricePoints] = useState<Record<string, PricePoint>>(() => {
    // Default to lowest price for each product
    const defaults: Record<string, PricePoint> = {};
    products.forEach(product => {
      if (product.pricePoints.length > 0) {
        defaults[product.id] = product.pricePoints.sort((a, b) => a.price - b.price)[0];
      }
    });
    return defaults;
  });

  // Group products by SKU/Model for duplicate detection
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, Product[]>();
    
    products.forEach(product => {
      const key = product.sku || product.model || product.name;
      const existing = groups.get(key) || [];
      groups.set(key, [...existing, product]);
    });
    
    return groups;
  }, [products]);

  // Find best prices for highlighting
  const getBestPriceIndex = (pricePoints: PricePoint[][]): number => {
    let bestIndex = -1;
    let bestPrice = Infinity;
    
    pricePoints.forEach((points, index) => {
      const selected = selectedPricePoints[products[index]?.id];
      const price = selected?.price || (points[0]?.price || Infinity);
      if (price < bestPrice) {
        bestPrice = price;
        bestIndex = index;
      }
    });
    
    return bestIndex;
  };

  // Build comparison rows
  const comparisonRows: ComparisonRow[] = useMemo(() => {
    const rows: ComparisonRow[] = [
      // Images
      {
        label: 'Product',
        key: 'image',
        type: 'image',
        values: products.map(p => p.images[0]?.url || null),
      },
      // Name
      {
        label: 'Name',
        key: 'name',
        type: 'text',
        values: products.map(p => p.name),
      },
      // Brand
      {
        label: 'Brand',
        key: 'brand',
        type: 'text',
        values: products.map(p => p.brand),
      },
      // Model
      {
        label: 'Model',
        key: 'model',
        type: 'text',
        values: products.map(p => p.model || p.sku || '-'),
      },
      // SKU
      {
        label: 'SKU',
        key: 'sku',
        type: 'text',
        values: products.map(p => p.sku || '-'),
      },
      // Price (with highlighting)
      {
        label: 'Best Price',
        key: 'price',
        type: 'price',
        values: products.map(p => p.pricePoints),
        highlightBest: true,
      },
      // Rating
      {
        label: 'Rating',
        key: 'rating',
        type: 'rating',
        values: products.map(p => ({ rating: p.rating, count: p.reviewCount })),
      },
      // Availability
      {
        label: 'Availability',
        key: 'availability',
        type: 'text',
        values: products.map(p => {
          const pp = selectedPricePoints[p.id];
          return pp?.inStock ? 'In Stock' : 'Out of Stock';
        }),
      },
      // Shipping
      {
        label: 'Shipping',
        key: 'shipping',
        type: 'text',
        values: products.map(p => {
          const pp = selectedPricePoints[p.id];
          if (!pp) return '-';
          return pp.shippingCost === 0 ? 'Free' : formatPrice(pp.shippingCost);
        }),
      },
      // Warranty
      {
        label: 'Warranty',
        key: 'warranty',
        type: 'text',
        values: products.map(p => {
          const pp = selectedPricePoints[p.id];
          return pp?.warranty || 'Standard';
        }),
      },
      // Features
      {
        label: 'Features',
        key: 'features',
        type: 'list',
        values: products.map(p => p.features),
      },
    ];

    // Add specification rows
    if (expandedSpecs) {
      const allSpecKeys = new Set<string>();
      products.forEach(p => {
        p.specifications.forEach(spec => allSpecKeys.add(spec.attributeId));
      });

      allSpecKeys.forEach(specKey => {
        const specName = products[0]?.specifications.find(s => s.attributeId === specKey)?.name || specKey;
        rows.push({
          label: specName,
          key: `spec_${specKey}`,
          type: 'text',
          values: products.map(p => {
            const spec = p.specifications.find(s => s.attributeId === specKey);
            return spec ? `${spec.value}${spec.unit || ''}` : '-';
          }),
        });
      });
    }

    return rows;
  }, [products, selectedPricePoints, expandedSpecs, formatPrice]);

  const handlePricePointChange = (productId: string, pricePoint: PricePoint) => {
    setSelectedPricePoints(prev => ({
      ...prev,
      [productId]: pricePoint,
    }));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-xl">
        <p className="text-muted-foreground">No products to compare</p>
        <Link href="/search" className="text-[var(--pricex-yellow)] hover:underline mt-2 inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Compare {products.length} Products
        </h2>
        <button
          onClick={() => setExpandedSpecs(!expandedSpecs)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expandedSpecs ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Collapse specs
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Expand all specs
            </>
          )}
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {comparisonRows.map((row, rowIndex) => {
              const isPriceRow = row.key === 'price';
              const bestPriceIndex = isPriceRow ? getBestPriceIndex(row.values as PricePoint[][]) : -1;
              
              return (
                <tr 
                  key={row.key}
                  className={`border-b border-border ${rowIndex === 0 ? '' : 'hover:bg-muted/30'}`}
                >
                  {/* Row Label */}
                  <td className="py-4 px-4 font-medium text-muted-foreground whitespace-nowrap w-48 sticky left-0 bg-background z-10">
                    {row.label}
                  </td>
                  
                  {/* Product Values */}
                  {row.values.map((value, colIndex) => {
                    const isBestPrice = isPriceRow && colIndex === bestPriceIndex;
                    const product = products[colIndex];
                    
                    return (
                      <td 
                        key={`${row.key}-${colIndex}`}
                        className={`py-4 px-4 min-w-[250px] ${
                          isBestPrice ? 'bg-green-500/5' : ''
                        }`}
                      >
                        {rowIndex === 0 && (
                          <button
                            onClick={() => onRemoveProduct(product.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        
                        {renderCellValue(
                          row.type, 
                          value, 
                          product, 
                          isBestPrice,
                          selectedPricePoints[product.id],
                          (pp) => handlePricePointChange(product.id, pp)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Duplicate Group Warning */}
      {Array.from(groupedProducts.entries()).map(([key, group]) => {
        if (group.length > 1) {
          return (
            <div key={key} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600">
                <strong>Note:</strong> {group.length} products have the same SKU/Model ({key}). 
                They may be identical items from different stores.
              </p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// Render cell value based on type
function renderCellValue(
  type: ComparisonRow['type'],
  value: any,
  product: Product,
  isBestPrice: boolean,
  selectedPricePoint?: PricePoint,
  onPricePointChange?: (pp: PricePoint) => void
) {
  switch (type) {
    case 'image':
      return value ? (
        <div className="relative w-full h-48">
          <Image
            src={value}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">No image</span>
        </div>
      );
    
    case 'price':
      const pricePoints = value as PricePoint[];
      const selected = selectedPricePoint || pricePoints[0];
      
      return (
        <div className="space-y-3">
          {/* Best Price Badge */}
          {isBestPrice && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              <Check className="w-3 h-3" />
              BEST DEAL
            </span>
          )}
          
          {/* Price Display */}
          <div className="text-2xl font-bold">
            ${selected?.price.toFixed(2)}
          </div>
          
          {/* Price Point Selector */}
          {pricePoints.length > 1 && (
            <select
              value={selected?.id}
              onChange={(e) => {
                const pp = pricePoints.find(p => p.id === e.target.value);
                if (pp && onPricePointChange) onPricePointChange(pp);
              }}
              className="w-full p-2 text-sm border border-border rounded-lg bg-background"
            >
              {pricePoints.map(pp => (
                <option key={pp.id} value={pp.id}>
                  {pp.retailer.name} - ${pp.price}
                </option>
              ))}
            </select>
          )}
          
          {/* Store Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
            <a 
              href={selected?.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--pricex-yellow)] transition-colors"
            >
              {selected?.retailer.name}
            </a>
            {selected?.retailer.isOfficialStore && (
              <span className="px-1.5 py-0.5 bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)] text-xs rounded">
                Official
              </span>
            )}
          </div>
          
          {/* Location */}
          {selected?.retailer.locations && selected.retailer.locations.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{selected.retailer.locations[0].address}</span>
            </div>
          )}
          
          {/* Buy Button */}
          <a
            href={selected?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--pricex-yellow)] text-black font-semibold rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </a>
        </div>
      );
    
    case 'rating':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{value.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({value.count.toLocaleString()} reviews)
          </span>
        </div>
      );
    
    case 'list':
      return (
        <ul className="space-y-1">
          {(value as string[]).slice(0, 5).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
          {(value as string[]).length > 5 && (
            <li className="text-sm text-muted-foreground">
              +{(value as string[]).length - 5} more
            </li>
          )}
        </ul>
      );
    
    default:
      return <span className="text-sm">{value as string}</span>;
  }
}
