/**
 * PriceX Mobile - Search Screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import debounce from 'lodash/debounce';

import { Product, RootStackParamList, SearchFilters } from '../types';
import { productApi } from '../services/api';
import { useProductStore } from '../stores';

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute<SearchScreenRouteProp>();
  const { setSelectedProduct } = useProductStore();
  
  const [query, setQuery] = useState(route.params?.query || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: route.params?.filters?.categories || [],
    priceRange: { min: 0, max: 100000 },
    brands: [],
    retailers: [],
    inStockOnly: false,
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchProducts = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setProducts([]);
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await productApi.search(searchQuery, filters);
        setProducts(response.data.products || []);
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [filters]
  );

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query, filters]);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    navigation.navigate('Product' as never, { productId: product.id } as never);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.bestPrice}>
            ${Math.min(...item.prices.map(p => p.price)).toFixed(2)}
          </Text>
          <Text style={styles.storeCount}>{item.prices.length} stores</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        setQuery(item);
        Keyboard.dismiss();
      }}
    >
      <Icon name="magnify" size={20} color="#666" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon
            name={showFilters ? 'filter-variant-minus' : 'filter-variant'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}

      {!loading && query.length < 2 && (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={64} color="#CCC" />
          <Text style={styles.emptyText}>
            Start typing to search for products
          </Text>
        </View>
      )}

      {!loading && query.length >= 2 && suggestions.length > 0 && products.length === 0 && (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
        />
      )}

      {!loading && query.length >= 2 && products.length === 0 && suggestions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search terms</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  storeCount: {
    fontSize: 14,
    color: '#999',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
