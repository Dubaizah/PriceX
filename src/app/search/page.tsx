import { productService } from '@/lib/services/product-data';
import SearchResults from './SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  
  let products: any[] = [];
  let total = 0;
  
  if (query) {
    try {
      const result = await productService.search({ query, limit: 50 });
      products = result.products || [];
      total = result.total || 0;
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  return (
    <SearchResults 
      query={query} 
      products={products} 
      total={total} 
    />
  );
}
