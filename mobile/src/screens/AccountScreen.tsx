/**
 * PriceX Mobile - Account Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuthStore, useThemeStore } from '../stores';

const menuItems = [
  { icon: 'heart-outline', label: 'Saved Products', route: 'SavedProducts' },
  { icon: 'bell-outline', label: 'Price Alerts', route: 'PriceAlerts' },
  { icon: 'crown-outline', label: 'Loyalty Program', route: 'Loyalty' },
  { icon: 'gift-outline', label: 'Referrals', route: 'Referral' },
  { icon: 'map-marker-outline', label: 'Saved Addresses', route: 'Addresses' },
  { icon: 'credit-card-outline', label: 'Payment Methods', route: 'Payments' },
  { icon: 'cog-outline', label: 'Settings', route: 'Settings' },
  { icon: 'help-circle-outline', label: 'Help & Support', route: 'Help' },
  { icon: 'information-outline', label: 'About', route: 'About' },
];

export default function AccountScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleMenuPress = (route: string) => {
    if (!isAuthenticated && route !== 'Settings' && route !== 'Help' && route !== 'About') {
      navigation.navigate('Auth' as never);
      return;
    }
    navigation.navigate(route as never);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      case 'diamond': return '#B9F2FF';
      default: return '#CD7F32';
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.guestContainer}>
          <Icon name="account-circle" size={80} color="#CCC" />
          <Text style={styles.guestTitle}>Welcome to PriceX</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to save products, set price alerts, and earn rewards
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Auth' as never)}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : { uri: 'https://via.placeholder.com/100' }
          }
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(user?.loyaltyTier || 'bronze') }]}>
            <Text style={styles.tierText}>
              {user?.loyaltyTier.charAt(0).toUpperCase()}
              {user?.loyaltyTier.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Loyalty Card */}
      <View style={styles.loyaltyCard}>
        <View style={styles.loyaltyHeader}>
          <Icon name="crown" size={24} color="#FFD700" />
          <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
        </View>
        <Text style={styles.pointsText}>{user?.loyaltyPoints.toLocaleString()}</Text>
        <Text style={styles.pointsLabel}>points available</Text>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={() => handleMenuPress(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <Icon name={item.icon} size={24} color="#333" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon name="logout-variant" size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>PriceX v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  registerButton: {
    marginTop: 12,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0F0F0',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  loyaltyCard: {
    backgroundColor: '#1A1A1A',
    margin: 12,
    padding: 20,
    borderRadius: 16,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 4,
  },
  redeemButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
  },
});
