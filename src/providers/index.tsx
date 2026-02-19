/**
 * PriceX - Global Providers
 * Composes all context providers
 */

'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { RegionProvider } from '@/context/RegionContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { ProductProvider } from '@/context/ProductContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RegionProvider>
          <CurrencyProvider>
            <AuthProvider>
              <AdminProvider>
                <ProductProvider>
                  {children}
                </ProductProvider>
              </AdminProvider>
            </AuthProvider>
          </CurrencyProvider>
        </RegionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
