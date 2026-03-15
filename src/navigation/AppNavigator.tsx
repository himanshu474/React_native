import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';

// Import screens
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen'; 

// Import theme
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useCart } from '../hooks/useCart';
import Badge from '../components/Badge';

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    };
    
    const keyboardWillHide = () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};

// Import types
import { RootStackParamList, MainTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ 
  name, 
  focused,
  badgeCount
}: { 
  name: keyof typeof Ionicons.glyphMap; 
  focused: boolean;
  badgeCount?: number;
}) => {
  const iconName = focused 
    ? name 
    : name.endsWith('-outline') ? name : `${name}-outline`;

  return (
    <View style={{ position: 'relative' }}>
      <Ionicons 
        name={iconName as keyof typeof Ionicons.glyphMap} 
        size={24} 
        color={focused ? colors.primary : colors.grey600} 
      />
      {badgeCount ? (
        <Badge 
          count={badgeCount} 
          variant="primary" 
          style={{
            position: 'absolute',
            top: -8,
            right: -10,
          }}
        />
      ) : null}
    </View>
  );
};

// Main tab navigator
const MainTabs = () => {
  const { totalItems } = useCart();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey600,
        tabBarLabelStyle: {
          ...typography.variants.caption,
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.grey200,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          // Hide tab bar when keyboard is visible
          display: isKeyboardVisible ? 'none' : 'flex',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Products" 
        component={ProductListScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="grid" focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name="cart" 
              focused={focused} 
              badgeCount={totalItems > 0 ? totalItems : undefined}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          ...typography.variants.h3,
          color: colors.textPrimary,
        },
        headerBackTitle: '',
        headerTintColor: colors.primary,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={({ route }) => ({ 
          title: route.params?.product?.title || 'Product Details',
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;