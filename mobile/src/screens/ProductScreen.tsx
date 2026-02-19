/**
 * PriceX Mobile - Product Detail Screen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

import { Product, PricePrediction, RootStackParamList } from '../types';
import { productApi, aiApi, userApi } from '../services/api';
import { useAuthStore, useCartStore } from '../stores';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'Product'>;
const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProductScreenRouteProp>();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [route.params.productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const [productRes, predictionRes] = await Promise.all([
        productApi.getById(route.params.productId),
        aiApi.getPrediction(route.params.productId),
      ]);
      
      setProduct(productRes.data);
      setPrediction(predictionRes.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigation.navigate('Auth' as never);
      return;
    }

    try {
      if (isSaved) {
        await userApi.removeSavedProduct(product!.id);
        setIsSaved(false);
      } else {
        await userApi.saveProduct(product!.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleCompare = () => {
    addItem(product!);
    navigation.navigate('Compare' as never);
  };

  const handleRetailerPress = (url: string) => {
    Linking.openURL(url);
  };

  const getRecommendationColor = () => {
    if (!prediction) return '#666';
    switch (prediction.recommendation) {
      case 'buy_now': return '#22C55E';
      case 'wait': return '#F59E0B';
      case 'best_time': return '#22C55E';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const bestPrice = Math.min(...product.prices.map(p => p.price));

  return (
    <ScrollView style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
            <Icon
              name={isSaved ? 'heart' : 'heart-outline'}
              size={24}
              color={isSaved ? '#EF4444' : '#333'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleCompare}>
            <Icon name="compare" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share-variant" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://via.placeholder.com/300' }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
        </View>

        {/* AI Prediction */}
        {prediction && (
          <View style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <Icon name="robot" size={24} color="#FFD700" />
              <Text style={styles.predictionTitle}>AI Price Prediction</Text>
            </View>
            <View style={styles.recommendationRow}>
              <Text
                style={[
                  styles.recommendation,
                  { color: getRecommendationColor() },
                ]}
              >
                {prediction.recommendation.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.confidence}>
                {prediction.confidence}% confidence
              </Text>
            </View>
            <Text style={styles.predictionReason}>{prediction.reasoning}</Text>
          </View>
        )}

        {/* Price Comparison */}
        <Text style={styles.sectionTitle}>Price Comparison</Text>
        <View style={styles.priceList}>
          {product.prices
            .sort((a, b) => a.price - b.price)
            .map((price, index) => (
              <TouchableOpacity
                key={price.retailerId}
                style={[
                  styles.priceItem,
                  index === 0 && styles.bestPriceItem,
                ]}
                onPress={() => handleRetailerPress(price.url)}
              >
                <View style={styles.retailerInfo}>
                  <Text style={styles.retailerName}>{price.retailerName}</Text>
                  <Text style={styles.stockStatus}>
                    {price.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text
                    style={[
                      styles.price,
                      index === 0 && styles.bestPriceText,
                    ]}
                  >
                    ${price.price.toFixed(2)}
                  </Text>
                  {index === 0 && (
                    <View style={styles.bestDealBadge}>
                      <Text style={styles.bestDealText}>BEST DEAL</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Specifications */}
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specsContainer}>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={styles.specRow}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: width - 32,
    height: 280,
  },
  infoContainer: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    color: '#333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  predictionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 14,
    color: '#AAA',
  },
  predictionReason: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  priceList: {
    marginBottom: 24,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
  },
  bestPriceItem: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  retailerInfo: {
    flex: 1,
  },
  retailerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stockStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bestPriceText: {
    color: '#22C55E',
  },
  bestDealBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  bestDealText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  specsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specKey: {
    fontSize: 14,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
