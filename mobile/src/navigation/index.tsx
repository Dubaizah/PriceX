/**
 * PriceX Mobile App - Navigation Configuration
 * React Navigation setup with deep linking
 */

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';

// Screens (to be imported)
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CompareScreen from '../screens/CompareScreen';
import DealsScreen from '../screens/DealsScreen';
import AccountScreen from '../screens/AccountScreen';
import ProductScreen from '../screens/ProductScreen';
import AuthScreen from '../screens/AuthScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Deep Linking Configuration
const linking = {
  prefixes: ['pricex://', 'https://pricex.com', 'https://www.pricex.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Search: 'search',
          Compare: 'compare',
          Deals: 'deals',
          Account: 'account',
        },
      },
      Product: 'product/:productId',
      Auth: 'auth',
      Settings: 'settings',
    },
  },
};

// Bottom Tab Navigator
function MainTabNavigator() {
  const scheme = useColorScheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'magnify' : 'magnify';
              break;
            case 'Compare':
              iconName = focused ? 'compare' : 'compare';
              break;
            case 'Deals':
              iconName = focused ? 'tag' : 'tag-outline';
              break;
            case 'Account':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-circle';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: scheme === 'dark' ? '#888' : '#666',
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#fff',
          borderTopColor: scheme === 'dark' ? '#333' : '#e0e0e0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Compare" component={CompareScreen} />
      <Tab.Screen name="Deals" component={DealsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator with Authentication Flow
export default function Navigation() {
  const scheme = useColorScheme();
  
  return (
    <NavigationContainer
      linking={linking}
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      fallback={<></>}
    >
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
