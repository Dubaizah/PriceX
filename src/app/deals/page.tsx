/**
 * PriceX - Deals Page
 * Hot deals and price drops
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  TrendingDown, 
  Clock, 
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useProduct } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DealsPage() {
  const { t } = useLanguage();
  const { search, searchResults, isSearching } = useProduct();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'rating'>('discount');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    search('deal', { inStockOnly: true });
  }, []);

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-[var(--pricex-yellow)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Hot Deals</h1>
                <p className="text-muted-foreground">Up to 70% off on top products</p>
              </div>
            </div>
          </motion.div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
              <div className="flex gap-2">
                {timeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value as typeof timeFilter)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      timeFilter === filter.value
                        ? 'bg-[var(--pricex-yellow)] text-black'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-lg bg-secondary border border-border text-sm focus:border-[var(--pricex-yellow)] outline-none"
              >
                <option value="discount">Biggest Discount</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--pricex-yellow)]' : 'bg-secondary'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[var(--pricex-yellow)]' : 'bg-secondary'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          {isSearching ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--pricex-yellow)]" />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {searchResults.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Tag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No deals found</h3>
              <p className="text-muted-foreground">Check back later for new deals</p>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold">Lowest Price Guarantee</h4>
                <p className="text-sm text-muted-foreground">We match any lower price</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--pricex-yellow)]" />
              </div>
              <div>
                <h4 className="font-semibold">Flash Deals</h4>
                <p className="text-sm text-muted-foreground">Limited time offers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold">Price Drops</h4>
                <p className="text-sm text-muted-foreground">Track price history</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
