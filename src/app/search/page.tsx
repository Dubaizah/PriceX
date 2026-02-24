'use client';

import { useState, useEffect } from 'react';
import { Search, Star, Award } from 'lucide-react';
import Link from 'next/link';

interface SearchProduct {
  id: string;
  name: string;
  brand: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search function
  const doSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();
      
      const products = data.products || data;
      
      if (products && Array.isArray(products) && products.length > 0) {
        const searchProducts: SearchProduct[] = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.prices?.[0]?.price || p.pricePoints?.[0]?.price || p.priceRange?.min || 0,
          image: p.imageUrl || p.images?.[0]?.url || '/product-1.jpg',
          rating: p.rating || 0,
          reviews: p.reviewCount || 0,
          prices: p.prices?.map((pp: any) => ({
            retailer: pp.retailer || 'Unknown',
            price: pp.price,
            currency: pp.currency || 'USD',
            rank: pp.rank,
            cheapestFlag: pp.cheapestFlag,
            dealScore: pp.dealScore,
            totalLandedCost: pp.totalLandedCost,
          })) || [],
        }));
        setResults(searchProducts);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }

    setLoading(false);
  };

  // Trigger search on page load with query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      doSearch(q);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      doSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[var(--pricex-yellow)]">PriceX</Link>
          <nav className="flex items-center gap-6">
            <Link href="/search" className="hover:text-[var(--pricex-yellow)]">Search</Link>
            <Link href="/categories" className="hover:text-[var(--pricex-yellow)]">Categories</Link>
            <Link href="/deals" className="hover:text-[var(--pricex-yellow)]">Deals</Link>
            <Link href="/login" className="hover:text-[var(--pricex-yellow)]">Login</Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-14 pl-12 pr-32 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-[var(--pricex-yellow)] focus:outline-none bg-gray-50 dark:bg-gray-900"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 h-10 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl"
              >
                Search
              </button>
            </div>
          </form>

          {!hasSearched ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Enter a product name to search across all global retailers.</p>
              <p className="text-sm text-gray-400 mt-2">Try: iPhone, Samsung, Nike, MacBook, Dyson</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found for "{query}"</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">{results.length} results for "{query}"</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product) => {
                  const cheapestPrice = product.prices?.find(p => p.cheapestFlag);
                  const bestDeal = product.prices?.reduce((best, p) => 
                    ((p.dealScore || 0) > (best.dealScore || 0)) ? p : best, product.prices[0]);
                  
                  return (
                  <Link 
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {cheapestPrice?.cheapestFlag && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Best Deal
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                      <h3 className="font-semibold mt-1 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xl font-bold text-[var(--pricex-yellow)]">
                          ${cheapestPrice?.price || product.price}
                        </p>
                        {bestDeal?.dealScore ? (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                            Score: {bestDeal.dealScore}
                          </span>
                        ) : null}
                      </div>
                      {product.prices && product.prices.length > 1 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{product.prices.length - 1} more sellers
                        </p>
                      )}
                    </div>
                  </Link>
                )})}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
