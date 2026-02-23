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
  const { t, isRTL } = useLanguage();
  const { search, searchResults, isSearching } = useProduct();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'rating'>('discount');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    search('', { inStock: true });
  }, []);

  const timeFilters = [
    { value: 'all', label: t('deals.all', 'All Time') },
    { value: 'today', label: t('common.today', 'Today') },
    { value: 'week', label: t('common.thisWeek', 'This Week') },
    { value: 'month', label: t('common.thisMonth', 'This Month') },
  ];

  const sortOptions = [
    { value: 'discount', label: t('deals.biggestDiscount', 'Biggest Discount') },
    { value: 'price-asc', label: t('deals.priceLowHigh', 'Price: Low to High') },
    { value: 'price-desc', label: t('deals.priceHighLow', 'Price: High to Low') },
    { value: 'rating', label: t('deals.highestRated', 'Highest Rated') },
  ];

  return (
    <div className="min-h-screen">
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
                <h1 className="text-3xl font-bold">{t('deals.title', 'Hot Deals')}</h1>
                <p className="text-muted-foreground">{t('deals.subtitle', 'Up to 70% off on top products')}</p>
              </div>
            </div>
          </motion.div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{t('search.filter', 'Filters')}:</span>
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
                className="h-10 px-3 rounded-lg bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--pricex-yellow)]' : 'bg-secondary'}`}
                >
                  <Grid3X3 className={`w-5 h-5 ${viewMode === 'grid' ? 'text-black' : ''}`} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--pricex-yellow)]' : 'bg-secondary'}`}
                >
                  <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-black' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          {isSearching ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--pricex-yellow)]" />
            </div>
          ) : (searchResults && searchResults.products && searchResults.products.length > 0) ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {searchResults.products.slice(0, 20).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <TrendingDown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('deals.noDeals', 'No deals found')}</h3>
              <p className="text-muted-foreground">{t('deals.checkBack', 'Check back later for new deals')}</p>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <TrendingDown className="w-5 h-5 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">{t('deals.lowestGuarantee', 'Lowest Price Guarantee')}</h4>
              <p className="text-sm text-muted-foreground">{t('deals.lowestGuaranteeDesc', 'We match any lower price')}</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[var(--pricex-yellow)]" />
              </div>
              <h4 className="font-semibold mb-2">{t('deals.flashDeals', 'Flash Deals')}</h4>
              <p className="text-sm text-muted-foreground">{t('deals.flashDealsDesc', 'Limited time offers')}</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Tag className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="font-semibold mb-2">{t('deals.priceDrops', 'Price Drops')}</h4>
              <p className="text-sm text-muted-foreground">{t('deals.priceDropsDesc', 'Track price history')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
