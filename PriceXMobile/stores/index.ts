/**
 * PriceX Mobile App - State Management
 * Zustand stores for global state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, User, SearchFilters, PricePrediction } from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Product Store
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  compareList: string[];
  searchQuery: string;
  searchFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      compareList: [],
      searchQuery: '',
      searchFilters: {
        categories: [],
        priceRange: { min: 0, max: 100000 },
        brands: [],
        retailers: [],
        inStockOnly: false,
        rating: 0,
      },
      isLoading: false,
      error: null,
      setProducts: (products) => set({ products }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      addToCompare: (productId) => {
        const { compareList } = get();
        if (compareList.length < 4 && !compareList.includes(productId)) {
          set({ compareList: [...compareList, productId] });
        }
      },
      removeFromCompare: (productId) => {
        set({ compareList: get().compareList.filter((id) => id !== productId) });
      },
      clearCompare: () => set({ compareList: [] }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchFilters: (filters) => set({ searchFilters: filters }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ compareList: state.compareList }),
    }
  )
);

// AI Store
interface AIState {
  predictions: Record<string, PricePrediction>;
  isLoading: boolean;
  setPrediction: (productId: string, prediction: PricePrediction) => void;
  getPrediction: (productId: string) => PricePrediction | undefined;
  setLoading: (value: boolean) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      predictions: {},
      isLoading: false,
      setPrediction: (productId, prediction) =>
        set((state) => ({
          predictions: { ...state.predictions, [productId]: prediction },
        })),
      getPrediction: (productId) => get().predictions[productId],
      setLoading: (value) => set({ isLoading: value }),
    }),
    {
      name: 'ai-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Theme Store
interface ThemeState {
  isDarkMode: boolean;
  systemTheme: 'light' | 'dark' | null;
  setDarkMode: (value: boolean) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      systemTheme: null,
      setDarkMode: (value) => set({ isDarkMode: value }),
      setSystemTheme: (theme) => set({ systemTheme: theme }),
      toggleTheme: () => set({ isDarkMode: !get().isDarkMode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Cart Store (for quick comparison)
interface CartState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...get().items, product] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.length,
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
