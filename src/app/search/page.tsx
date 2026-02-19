/**
 * PriceX - Search Results Page
 * Product search with filters and AI suggestions
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
} from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const {
    search,
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    activeFilters,
    setFilters,
    clearFilters,
    sortField,
    setSort,
    currentPage,
    totalPages,
    goToPage,
  } = useProduct();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Get initial query from URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchInput(query);
    if (query) {
      search(query);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput);
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchInput);
      window.history.pushState({}, '', url);
    }
  };

  const handleSortChange = (field: string) => {
    const sortFieldMap: Record<string, any> = {
      relevance: 'relevance',
      price_low: 'price_asc',
      price_high: 'price_desc',
      rating: 'rating',
      newest: 'newest',
    };
    setSort(sortFieldMap[field] || 'relevance');
  };

  return (
    <div className="min-h-screen bg-background">
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
                  Search
                </button>
              </div>
            </form>

            {/* AI Suggestions */}
            {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="flex items-center gap-1 text-sm text-[var(--pricex-yellow)]">
                  <Sparkles className="w-4 h-4" />
                  AI Suggestions:
                </span>
                {searchResults.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchInput(suggestion);
                      search(suggestion);
                    }}
                    className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-[var(--pricex-yellow)]/10 hover:text-[var(--pricex-yellow)] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Header */}
          {searchResults && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold">
                  {isSearching ? 'Searching...' : `${searchResults.total.toLocaleString()} results for "${searchQuery}"`}
                </h1>
                {searchResults.didYouMean && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Did you mean:{' '}
                    <button
                      onClick={() => {
                        setSearchInput(searchResults.didYouMean!);
                        search(searchResults.didYouMean!);
                      }}
                      className="text-[var(--pricex-yellow)] hover:underline"
                    >
                      {searchResults.didYouMean}
                    </button>
                    ?
                  </p>
                )}
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

                {/* Sort Dropdown */}
                <select
                  value={sortField}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-9 px-3 rounded-lg bg-card border border-border text-sm focus:border-[var(--pricex-yellow)] outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${showFilters ? 'border-[var(--pricex-yellow)] text-[var(--pricex-yellow)]' : 'border-border hover:bg-secondary'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {Object.keys(activeFilters).length > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-[var(--pricex-yellow)] text-black text-xs font-bold rounded-full">
                      {Object.keys(activeFilters).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && searchResults?.facets && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-64 flex-shrink-0 space-y-6"
              >
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {searchResults.facets.categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--pricex-yellow)]">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={activeFilters.category === cat.id}
                          onChange={(e) => {
                            setFilters({
                              ...activeFilters,
                              category: e.target.checked ? cat.id : undefined,
                            });
                          }}
                        />
                        <span className="flex-1">{cat.name}</span>
                        <span className="text-muted-foreground">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-semibold mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {searchResults.facets.brands.map((brand) => (
                      <label key={brand.name} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--pricex-yellow)]">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={activeFilters.brands?.includes(brand.name)}
                          onChange={(e) => {
                            const currentBrands = activeFilters.brands || [];
                            const newBrands = e.target.checked
                              ? [...currentBrands, brand.name]
                              : currentBrands.filter((b) => b !== brand.name);
                            setFilters({ ...activeFilters, brands: newBrands });
                          }}
                        />
                        <span className="flex-1">{brand.name}</span>
                        <span className="text-muted-foreground">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {searchResults.facets.priceRanges.map((range) => (
                      <label key={`${range.min}-${range.max}`} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--pricex-yellow)]">
                        <input
                          type="radio"
                          name="price"
                          className="rounded-full border-border"
                          checked={activeFilters.priceRange?.min === range.min}
                          onChange={() => {
                            setFilters({
                              ...activeFilters,
                              priceRange: { min: range.min, max: range.max },
                            });
                          }}
                        />
                        <span>
                          ${range.min} - {range.max === Infinity ? '+' : `$${range.max}`}
                        </span>
                        <span className="text-muted-foreground">({range.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-semibold mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--pricex-yellow)]">
                        <input
                          type="radio"
                          name="rating"
                          className="rounded-full border-border"
                          checked={activeFilters.rating === rating}
                          onChange={() => setFilters({ ...activeFilters, rating })}
                        />
                        <span>{rating}+ stars</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {Object.keys(activeFilters).length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.aside>
            )}

            {/* Results Grid */}
            <div className="flex-1">
              {isSearching ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin w-8 h-8 border-4 border-[var(--pricex-yellow)] border-t-transparent rounded-full" />
                </div>
              ) : searchError ? (
                <div className="text-center py-20">
                  <p className="text-red-500">{searchError}</p>
                  <button
                    onClick={() => search(searchQuery)}
                    className="mt-4 text-[var(--pricex-yellow)] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : searchResults?.products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No products found</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                  }>
                    {searchResults?.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant={viewMode === 'list' ? 'horizontal' : 'default'}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                          <span key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                            <button
                              onClick={() => goToPage(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-[var(--pricex-yellow)] text-black'
                                  : 'hover:bg-secondary'
                              }`}
                            >
                              {page}
                            </button>
                          </span>
                        ))}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
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
      <div className="min-h-screen bg-background">
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
