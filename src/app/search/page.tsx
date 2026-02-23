'use client';

import { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import Link from 'next/link';

interface SearchProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  prices?: Array<{ retailer: string; price: number; currency: string }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      handleSearchSubmit(q);
    }
  }, []);

  const handleSearchSubmit = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=50`);
      const data = await response.json();
      
      // Handle both response formats
      const products = data.products || data;
      
      if (products && Array.isArray(products) && products.length > 0) {
        const searchProducts: SearchProduct[] = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.pricePoints?.[0]?.price || p.priceRange?.min || 0,
          image: p.images?.[0]?.url || '/product-1.jpg',
          rating: p.rating || 0,
          reviews: p.reviewCount || 0,
          prices: p.pricePoints?.map((pp: any) => ({
            retailer: pp.retailer?.name || 'Unknown',
            price: pp.price,
            currency: pp.currency || 'USD',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
    }
    handleSearchSubmit();
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
                {results.map((product) => (
                  <Link 
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                      <h3 className="font-semibold mt-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                      </div>
                      <p className="text-xl font-bold mt-2 text-[var(--pricex-yellow)]">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
