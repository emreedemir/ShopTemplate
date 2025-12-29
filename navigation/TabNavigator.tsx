import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Expo'nun hazır ikon paketi
import { HomeDrawerNavigator } from './HomeDrawerNavigator';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from "../src/contants/colors";
import { STRINGS } from '../src/contants/strings';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UseSelector } from 'react-redux';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  
  const cartItems =useSelector((state:RootState)=>state.cart.items);
  const cartCount =cartItems.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // 1. İkon Ayarları
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.background,
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeDrawerNavigator} 
        options={{ title: STRINGS.titles.home }} 
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ 
          title: STRINGS.titles.cart,
          tabBarBadge: cartCount>0?cartCount:undefined
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }} 
      />
    </Tab.Navigator>
  );
};