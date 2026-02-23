/**
 * PriceX - Services Index
 * Export all data services
 */

export * from './retailer-config';
export * from './scraper';
export * from './price-api';
export * from './retailer-api';
export * from './product-data';

import { unifiedProductService } from './product-data';

export const productService = unifiedProductService;
export default unifiedProductService;
