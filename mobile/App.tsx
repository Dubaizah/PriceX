/**
 * PriceX Mobile App - Main Entry Point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

import Navigation from './src/navigation';
import { useThemeStore } from './src/stores';
import { processRequestQueue } from './src/services/api';

// Create MMKV instance for fast storage
export const storage = new MMKV();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

// Paper theme configuration
const paperTheme = {
  colors: {
    primary: '#FFD700',
    accent: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    disabled: '#CCCCCC',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

const paperDarkTheme = {
  colors: {
    primary: '#FFD700',
    accent: '#FFFFFF',
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: '#FFFFFF',
    disabled: '#555555',
    placeholder: '#888888',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
};

export default function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // Process queued requests when back online
        processRequestQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={isDarkMode ? paperDarkTheme : paperTheme}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={isDarkMode ? '#1A1A1A' : '#FFFFFF'}
            />
            <Navigation />
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
