/**
 * PriceX - Product Context
 * Manages product search, comparison, and alerts
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { 
  Product, 
  SearchQuery, 
  SearchResult, 
  SearchFilters, 
  SortField,
  ProductComparison,
  PriceAlert,
} from '@/types/product-data';
import { CategoryId } from '@/types/product';
import { Currency, Region } from '@/types';

interface ProductContextType {
  // Search state
  searchQuery: string;
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchError: string | null;
  recentSearches: string[];
  
  // Search actions
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  searchByCategory: (categoryId: CategoryId, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
  
  // Filters
  activeFilters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  
  // Sorting
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  setSort: (field: SortField, direction?: 'asc' | 'desc') => void;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  
  // Product details
  selectedProduct: Product | null;
  loadProduct: (productId: string) => Promise<void>;
  
  // Comparison
  comparison: ProductComparison | null;
  comparisonItems: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  maxComparisonItems: number;
  
  // Price alerts
  priceAlerts: PriceAlert[];
  createPriceAlert: (productId: string, targetPrice: number, type?: 'price_drop' | 'back_in_stock') => Promise<boolean>;
  createBackInStockAlert: (productId: string, duration?: number) => Promise<boolean>;
  removePriceAlert: (alertId: string) => Promise<boolean>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;
const MAX_RECENT_SEARCHES = 10;

export function ProductProvider({ children }: { children: React.ReactNode }) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Filters and sorting
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [sortField, setSortField] = useState<SortField>('relevance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Comparison
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  
  // Price alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  
  // General loading/error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Abort controller for search cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Search function
  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchQuery(query);
      
      const searchParams = new URLSearchParams({
        q: query,
        page: currentPage.toString(),
        limit: '24',
        sort: sortField,
        direction: sortDirection,
      });
      
      // Add filters
      if (filters?.priceRange) {
        searchParams.set('minPrice', filters.priceRange.min.toString());
        searchParams.set('maxPrice', filters.priceRange.max.toString());
      }
      
      if (filters?.brands?.length) {
        searchParams.set('brands', filters.brands.join(','));
      }
      
      if (filters?.rating) {
        searchParams.set('minRating', filters.rating.toString());
      }
      
      if (filters?.inStock) {
        searchParams.set('inStock', 'true');
      }
      
      const response = await fetch(`/api/products/search?${searchParams}`, {
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data);
      setTotalPages(data.totalPages);
      
      // Add to recent searches
      if (query.trim()) {
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
          return [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        });
      }
      
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setSearchError(err.message);
      }
    } finally {
      setIsSearching(false);
    }
  }, [currentPage, sortField, sortDirection]);

  // Search by category
  const searchByCategory = useCallback(async (categoryId: CategoryId, filters?: SearchFilters) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      
      const response = await fetch(`/api/products/search?category=${categoryId}&page=${currentPage}&limit=24`);
      
      if (!response.ok) {
        throw new Error('Category search failed');
      }
      
      const data = await response.json();
      setSearchResults(data);
      setTotalPages(data.totalPages);
      
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [currentPage]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError(null);
    setCurrentPage(1);
  }, []);

  // Set filters
  const setFilters = useCallback((filters: SearchFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    // Re-run search with new filters
    if (searchQuery) {
      search(searchQuery, filters);
    }
  }, [searchQuery, search]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setCurrentPage(1);
    if (searchQuery) {
      search(searchQuery, {});
    }
  }, [searchQuery, search]);

  // Set sort
  const setSort = useCallback((field: SortField, direction?: 'asc' | 'desc') => {
    setSortField(field);
    if (direction) {
      setSortDirection(direction);
    } else {
      // Toggle direction if same field
      setSortDirection(prev => field === sortField ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
    }
    setCurrentPage(1);
    if (searchQuery) {
      search(searchQuery, activeFilters);
    }
  }, [searchQuery, activeFilters, sortField, search]);

  // Pagination
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    if (searchQuery) {
      search(searchQuery, activeFilters);
    }
  }, [searchQuery, activeFilters, search]);

  // Load product details
  const loadProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load product');
      }
      
      const data = await response.json();
      setSelectedProduct(data.product);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Comparison functions
  const addToComparison = useCallback((product: Product) => {
    setComparisonItems(prev => {
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        return prev; // Max reached
      }
      if (prev.some(p => p.id === product.id)) {
        return prev; // Already in comparison
      }
      return [...prev, product];
    });
  }, []);

  const removeFromComparison = useCallback((productId: string) => {
    setComparisonItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonItems([]);
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return comparisonItems.some(p => p.id === productId);
  }, [comparisonItems]);

  // Price alert functions
  const createPriceAlert = useCallback(async (
    productId: string, 
    targetPrice: number,
    type: 'price_drop' | 'back_in_stock' = 'price_drop'
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, targetPrice, type }),
      });
      
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const createBackInStockAlert = useCallback(async (
    productId: string,
    duration: number = 30
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          type: 'back_in_stock',
          duration,
        }),
      });
      
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const removePriceAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
      }
      
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setSearchError(null);
  }, []);

  const value: ProductContextType = {
    // Search
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    recentSearches,
    search,
    searchByCategory,
    clearSearch,
    
    // Filters
    activeFilters,
    setFilters,
    clearFilters,
    
    // Sorting
    sortField,
    sortDirection,
    setSort,
    
    // Pagination
    currentPage,
    totalPages,
    goToPage,
    
    // Product
    selectedProduct,
    loadProduct,
    
    // Comparison
    comparison: null,
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    maxComparisonItems: MAX_COMPARISON_ITEMS,
    
    // Alerts
    priceAlerts,
    createPriceAlert,
    createBackInStockAlert,
    removePriceAlert,
    
    // Loading
    isLoading,
    error,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
