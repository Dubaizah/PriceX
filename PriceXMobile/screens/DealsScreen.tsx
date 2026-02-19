/**
 * PriceX Mobile - Deals Screen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Product } from '../types';
import { productApi } from '../services/api';
import { useProductStore } from '../stores';

export default function DealsScreen() {
  const navigation = useNavigation();
  const { setSelectedProduct } = useProductStore();
  const [deals, setDeals] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

  useEffect(() => {
    loadDeals();
  }, [selectedCategory]);

  const loadDeals = async () => {
    try {
      const response = await productApi.getDeals();
      let filteredDeals = response.data.products || [];
      
      if (selectedCategory !== 'All') {
        filteredDeals = filteredDeals.filter(
          (deal: Product) => deal.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      setDeals(filteredDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeals();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    navigation.navigate('Product' as never, { productId: product.id } as never);
  };

  const renderDeal = ({ item }: { item: Product }) => {
    const originalPrice = Math.max(...item.prices.map((p) => p.price));
    const salePrice = Math.min(...item.prices.map((p) => p.price));
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    return (
      <TouchableOpacity
        style={styles.dealCard}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
        <Image
          source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
          style={styles.dealImage}
          resizeMode="cover"
        />
        <View style={styles.dealInfo}>
          <Text style={styles.dealBrand}>{item.brand}</Text>
          <Text style={styles.dealName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>${salePrice.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
          </View>
          <Text style={styles.storeCount}>{item.prices.length} stores</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hot Deals</Text>
        <Text style={styles.headerSubtitle}>Up to 70% off</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={deals}
        renderItem={renderDeal}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.dealsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="tag-off" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No deals found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFD700',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  categoryChipActive: {
    backgroundColor: '#FFD700',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  dealsList: {
    padding: 8,
  },
  dealCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F0F0',
  },
  dealInfo: {
    padding: 12,
  },
  dealBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  storeCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});
