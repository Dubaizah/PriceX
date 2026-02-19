/**
 * PriceX Mobile - Compare Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCartStore } from '../stores';

export default function CompareScreen() {
  const navigation = useNavigation();
  const { items, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="compare" size={64} color="#CCC" />
        <Text style={styles.emptyTitle}>No Products to Compare</Text>
        <Text style={styles.emptySubtitle}>
          Add products to compare from search or product pages
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Search' as never)}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const allSpecs = new Set<string>();
  items.forEach((item) => {
    Object.keys(item.specifications).forEach((spec) => allSpecs.add(spec));
  });

  const bestPrice = Math.min(
    ...items.map((item) => Math.min(...item.prices.map((p) => p.price)))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compare Products</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Product Names */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Product</Text>
            </View>
            {items.map((item) => (
              <View key={item.id} style={styles.productCell}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Icon name="close" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productBrand}>{item.brand}</Text>
              </View>
            ))}
          </View>

          {/* Best Price */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Best Price</Text>
            </View>
            {items.map((item) => {
              const itemBestPrice = Math.min(
                ...item.prices.map((p) => p.price)
              );
              const isBest = itemBestPrice === bestPrice;
              return (
                <View key={item.id} style={styles.cell}>
                  <Text
                    style={[styles.priceText, isBest && styles.bestPriceText]}
                  >
                    ${itemBestPrice.toFixed(2)}
                  </Text>
                  {isBest && (
                    <View style={styles.bestBadge}>
                      <Text style={styles.bestBadgeText}>BEST</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Rating */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Rating</Text>
            </View>
            {items.map((item) => (
              <View key={item.id} style={styles.cell}>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.reviewText}>
                  ({item.reviewCount} reviews)
                </Text>
              </View>
            ))}
          </View>

          {/* Specifications */}
          {Array.from(allSpecs).map((spec) => (
            <View key={spec} style={styles.row}>
              <View style={styles.labelCell}>
                <Text style={styles.labelText}>{spec}</Text>
              </View>
              {items.map((item) => (
                <View key={item.id} style={styles.cell}>
                  <Text style={styles.specText}>
                    {item.specifications[spec] || '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* Buy Now Buttons */}
          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Action</Text>
            </View>
            {items.map((item) => {
              const bestRetailer = item.prices.sort(
                (a, b) => a.price - b.price
              )[0];
              return (
                <View key={item.id} style={styles.cell}>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => Linking.openURL(bestRetailer.url)}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <Text style={styles.retailerText}>
                    at {bestRetailer.retailerName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  labelCell: {
    width: 120,
    padding: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  productCell: {
    width: 150,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  cell: {
    width: 150,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    justifyContent: 'center',
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bestPriceText: {
    color: '#22C55E',
  },
  bestBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  specText: {
    fontSize: 13,
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  retailerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
