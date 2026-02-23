/**
 * PriceX - Search Results Page
 * Product search with filters and AI suggestions
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial search from URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setSearchInput(query);
      doSearch(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchInput);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl bg-card border-2 border-border focus:border-[var(--pricex-yellow)] focus:ring-4 focus:ring-[var(--pricex-yellow)]/20 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 h-10 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors"
                >
                  {t('search.button')}
                </button>
              </div>
            </form>
          </div>

          {/* Results Header */}
          {hasSearched && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold">
                  {loading ? t('search.searching') : `${results?.total?.toLocaleString() || 0} ${t('search.resultsFor')} "${searchInput}"`}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--pricex-yellow)] text-black' : 'hover:bg-secondary'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[var(--pricex-yellow)] text-black' : 'hover:bg-secondary'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--pricex-yellow)] border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => doSearch(searchInput)}
                  className="mt-4 text-[var(--pricex-yellow)] hover:underline"
                >
                  {t('search.tryAgain')}
                </button>
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-lg">{t('search.placeholder')}</p>
                <p className="text-sm text-muted-foreground mt-2">Try searching for "iPhone", "Samsung", "Nike", "TV", "camera", etc.</p>
              </div>
            ) : results?.products?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">{t('search.noResults')}</p>
                <p className="text-sm text-muted-foreground mt-2">{t('search.noResultsDesc')}</p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {results?.products?.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Header />
        <main className="pt-[120px] pb-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--pricex-yellow)] border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
