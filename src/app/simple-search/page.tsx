'use client';

import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import Link from 'next/link';

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, image: '/product-1.jpg', rating: 4.8, reviews: 2543 },
  { id: '2', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 1299, image: '/product-2.jpg', rating: 4.7, reviews: 1823 },
  { id: '3', name: 'MacBook Pro 16" M3 Max', brand: 'Apple', price: 3499, image: '/product-3.jpg', rating: 4.9, reviews: 956 },
  { id: '4', name: 'Sony WH-1000XM5', brand: 'Sony', price: 399, image: '/product-4.jpg', rating: 4.8, reviews: 15420 },
  { id: '5', name: 'Nike Air Max 270', brand: 'Nike', price: 150, image: '/product-5.jpg', rating: 4.6, reviews: 8932 },
  { id: '6', name: 'Samsung 65" OLED TV', brand: 'Samsung', price: 2499, image: '/product-6.jpg', rating: 4.7, reviews: 1245 },
  { id: '7', name: 'Dyson V15 Detect', brand: 'Dyson', price: 749, image: '/product-7.jpg', rating: 4.8, reviews: 7821 },
  { id: '8', name: 'Adidas Ultraboost 22', brand: 'Adidas', price: 190, image: '/product-8.jpg', rating: 4.5, reviews: 12453 },
  { id: '9', name: 'Apple Watch Series 9', brand: 'Apple', price: 399, image: '/product-9.jpg', rating: 4.8, reviews: 9876 },
  { id: '10', name: 'PlayStation 5', brand: 'Sony', price: 499, image: '/product-10.jpg', rating: 4.9, reviews: 24531 },
  { id: '11', name: 'LG C3 55" OLED', brand: 'LG', price: 1799, image: '/product-1.svg', rating: 4.7, reviews: 3456 },
  { id: '12', name: 'Canon EOS R6 II', brand: 'Canon', price: 2499, image: '/product-2.svg', rating: 4.9, reviews: 892 },
];

export default function SimpleSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof SAMPLE_PRODUCTS>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setHasSearched(true);
    const searchTerm = query.toLowerCase();
    const filtered = SAMPLE_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.brand.toLowerCase().includes(searchTerm)
    );
    setResults(filtered);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
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
          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
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

          {/* Results */}
          {!hasSearched ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Enter a search term to find products</p>
              <p className="text-sm text-gray-400 mt-2">Try "iPhone", "Samsung", "Nike", "Sony"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
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
