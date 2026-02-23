export * from './global-sellers';
export * from './retailer-config';
export * from './scraper';
export * from './price-api';
export * from './retailer-api';
export * from './product-data';
export * from './sample-data';

import { getSellerById, GLOBAL_SELLERS } from './global-sellers';

export const sellerService = {
  getSellerById,
  getAllSellers: () => GLOBAL_SELLERS,
};

export default sellerService;
