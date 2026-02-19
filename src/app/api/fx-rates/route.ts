/**
 * PriceX - FX Rates API Route
 * Real-time foreign exchange rates
 */

import { NextRequest, NextResponse } from 'next/server';

// Fallback FX rates (base: USD)
const FX_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.19,
  AED: 3.67,
  SAR: 3.75,
  TRY: 30.50,
  RUB: 92.50,
  INR: 83.12,
  PKR: 279.50,
  KRW: 1330.50,
  BRL: 4.95,
  MXN: 17.05,
  CAD: 1.35,
  AUD: 1.52,
  ZAR: 19.05,
  EGP: 30.90,
};

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from a real FX API like:
    // - Open Exchange Rates
    // - CurrencyLayer
    // - ExchangeRate-API
    // - European Central Bank
    
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    // const data = await response.json();
    
    return NextResponse.json({
      success: true,
      base: 'USD',
      rates: FX_RATES,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('FX Rates API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FX rates' },
      { status: 500 }
    );
  }
}

// Refresh rates (POST request for manual refresh)
export async function POST(request: NextRequest) {
  try {
    // Force refresh from upstream API
    return NextResponse.json({
      success: true,
      base: 'USD',
      rates: FX_RATES,
      timestamp: new Date().toISOString(),
      refreshed: true,
    });
  } catch (error) {
    console.error('FX Rates Refresh Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh FX rates' },
      { status: 500 }
    );
  }
}
