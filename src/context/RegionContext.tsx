/**
 * PriceX - Region Context Provider
 * Manages global region and country selection
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Region, Country, COUNTRIES, REGIONS } from '@/types';

interface RegionContextType {
  selectedRegion: Region | null;
  selectedCountry: Country | null;
  setRegion: (region: Region) => void;
  setCountry: (countryCode: string) => void;
  getCountriesByRegion: (region: Region) => Country[];
  availableRegions: typeof REGIONS;
  availableCountries: Country[];
  isLoading: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const STORAGE_KEY = 'pricex-region-prefs';

interface RegionPreferences {
  region: Region;
  country: string;
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const prefs: RegionPreferences = JSON.parse(stored);
          const country = COUNTRIES.find(c => c.code === prefs.country);
          if (country) {
            setSelectedRegion(prefs.region);
            setSelectedCountry(country);
          }
        }
      } catch (error) {
        console.error('Error loading region preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((region: Region, countryCode: string) => {
    try {
      const prefs: RegionPreferences = { region, country: countryCode };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving region preferences:', error);
    }
  }, []);

  const setRegion = useCallback((region: Region) => {
    setSelectedRegion(region);
    // Auto-select first country in region if no country selected
    const countriesInRegion = COUNTRIES.filter(c => c.region === region);
    if (countriesInRegion.length > 0 && !selectedCountry) {
      const firstCountry = countriesInRegion[0];
      setSelectedCountry(firstCountry);
      savePreferences(region, firstCountry.code);
    } else if (selectedCountry) {
      savePreferences(region, selectedCountry.code);
    }
  }, [selectedCountry, savePreferences]);

  const setCountry = useCallback((countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setSelectedRegion(country.region);
      savePreferences(country.region, countryCode);
    }
  }, [savePreferences]);

  const getCountriesByRegion = useCallback((region: Region) => {
    return COUNTRIES.filter(country => country.region === region);
  }, []);

  const value: RegionContextType = {
    selectedRegion,
    selectedCountry,
    setRegion,
    setCountry,
    getCountriesByRegion,
    availableRegions: REGIONS,
    availableCountries: COUNTRIES,
    isLoading,
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
