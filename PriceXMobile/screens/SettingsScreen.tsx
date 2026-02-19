/**
 * PriceX Mobile - Settings Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useThemeStore, useAuthStore } from '../stores';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: 'account-outline', label: 'Edit Profile', onPress: () => {} },
        { icon: 'lock-outline', label: 'Change Password', onPress: () => {} },
        { icon: 'email-outline', label: 'Email Preferences', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'bell-outline', label: 'Notifications', onPress: () => {} },
        { icon: 'currency-usd', label: 'Currency', value: 'USD', onPress: () => {} },
        { icon: 'translate', label: 'Language', value: 'English', onPress: () => {} },
        { icon: 'map-marker-outline', label: 'Region', value: 'North America', onPress: () => {} },
      ],
    },
    {
      title: 'App Settings',
      items: [
        { 
          icon: 'theme-light-dark', 
          label: 'Dark Mode', 
          isToggle: true,
          value: isDarkMode,
          onToggle: toggleTheme,
        },
        { icon: 'download-outline', label: 'Downloaded Content', onPress: () => {} },
        { icon: 'database-outline', label: 'Storage Usage', value: '245 MB', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', onPress: () => {} },
        { icon: 'message-text-outline', label: 'Contact Us', onPress: () => {} },
        { icon: 'file-document-outline', label: 'Privacy Policy', onPress: () => {} },
        { icon: 'file-outline', label: 'Terms of Service', onPress: () => {} },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {settingsGroups.map((group, groupIndex) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.groupItems}>
            {group.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.item,
                  index === group.items.length - 1 && styles.lastItem,
                ]}
                onPress={item.onPress}
                disabled={item.isToggle}
              >
                <View style={styles.itemLeft}>
                  <Icon name={item.icon} size={22} color="#666" />
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
                <View style={styles.itemRight}>
                  {item.value && (
                    <Text style={styles.itemValue}>{item.value}</Text>
                  )}
                  {item.isToggle ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#767577', true: '#FFD700' }}
                    />
                  ) : (
                    <Icon name="chevron-right" size={20} color="#999" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.versionText}>PriceX v1.0.0 (Build 100)</Text>
        <Text style={styles.copyrightText}>© 2024 PriceX Inc. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  group: {
    marginTop: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  groupItems: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 4,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
