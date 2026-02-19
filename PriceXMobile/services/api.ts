/**
 * PriceX Mobile App - API Service
 * Axios configuration with interceptors, caching, and offline support
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000' 
  : 'https://api.pricex.com';

const API_VERSION = 'v1';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new axios.Cancel('No internet connection');
    }

    // Add auth token if available
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add device info headers
    config.headers['X-Device-ID'] = await DeviceInfo.getUniqueId();
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-App-Version'] = DeviceInfo.getVersion();
    config.headers['X-Build-Number'] = DeviceInfo.getBuildNumber();

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get') {
      cacheResponse(response.config.url!, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          await AsyncStorage.setItem('auth_token', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
        // Navigate to auth screen (handled by auth context)
      }
    }

    // Return cached data if available for GET requests
    if (originalRequest.method === 'get') {
      const cachedData = await getCachedResponse(originalRequest.url!);
      if (cachedData) {
        return Promise.resolve({ data: cachedData, status: 200, statusText: 'OK', headers: {}, config: originalRequest });
      }
    }

    // Queue failed requests for retry when back online
    if (!error.response) {
      queueRequest(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Cache Management
const CACHE_PREFIX = 'api_cache_';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function cacheResponse(url: string, data: unknown): Promise<void> {
  const cacheKey = `${CACHE_PREFIX}${url}`;
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
}

async function getCachedResponse(url: string): Promise<unknown | null> {
  const cacheKey = `${CACHE_PREFIX}${url}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
    await AsyncStorage.removeItem(cacheKey);
  }
  
  return null;
}

// Request Queue for Offline Support
interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  timestamp: number;
}

const REQUEST_QUEUE_KEY = 'request_queue';

async function queueRequest(config: InternalAxiosRequestConfig): Promise<void> {
  const queue = await getRequestQueue();
  queue.push({
    config,
    timestamp: Date.now(),
  });
  await AsyncStorage.setItem(REQUEST_QUEUE_KEY, JSON.stringify(queue));
}

async function getRequestQueue(): Promise<QueuedRequest[]> {
  const queue = await AsyncStorage.getItem(REQUEST_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

// Process queued requests when back online
export async function processRequestQueue(): Promise<void> {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) return;

  const queue = await getRequestQueue();
  if (queue.length === 0) return;

  // Clear queue
  await AsyncStorage.removeItem(REQUEST_QUEUE_KEY);

  // Process requests
  for (const item of queue) {
    try {
      await api(item.config);
    } catch (error) {
      console.error('Failed to process queued request:', error);
    }
  }
}

// API Endpoints
export const productApi = {
  search: (query: string, filters?: Record<string, unknown>) =>
    api.get('/products/search', { params: { q: query, ...filters } }),
  getById: (id: string) => api.get(`/products/${id}`),
  getTrending: () => api.get('/products/trending'),
  getDeals: () => api.get('/products/deals'),
  compare: (productIds: string[]) =>
    api.post('/products/compare', { productIds }),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch('/user/profile', data),
  getSavedProducts: () => api.get('/user/saved'),
  saveProduct: (productId: string) =>
    api.post('/user/saved', { productId }),
  removeSavedProduct: (productId: string) =>
    api.delete(`/user/saved/${productId}`),
  getPriceAlerts: () => api.get('/user/alerts'),
  createPriceAlert: (data: Record<string, unknown>) =>
    api.post('/user/alerts', data),
  deletePriceAlert: (alertId: string) =>
    api.delete(`/user/alerts/${alertId}`),
  getLoyaltyInfo: () => api.get('/user/loyalty'),
  getReferralInfo: () => api.get('/user/referral'),
};

export const aiApi = {
  getPrediction: (productId: string) =>
    api.get(`/ai/prediction/${productId}`),
  getMarketTrends: (category: string) =>
    api.get('/ai/trends', { params: { category } }),
};

export default api;
