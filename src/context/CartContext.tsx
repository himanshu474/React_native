// src/context/CartContext.tsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../models/Product';
import { CartItem, CartContextType, CartState } from '../types/cart';

// AsyncStorage keys
const CART_STORAGE_KEY = '@ecommerce_cart';
const CART_EXPIRY_KEY = '@ecommerce_cart_expiry';

// Cart expiry time (24 hours in milliseconds)
const CART_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// Create context with default values
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider props
interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage();
    }
  }, [items, isInitialized]);

  // Load cart from storage
  const loadCartFromStorage = async () => {
    try {
      // Check expiry
      const expiryStr = await AsyncStorage.getItem(CART_EXPIRY_KEY);
      if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (Date.now() > expiry) {
          // Cart expired, clear it
          await clearStorage();
          setIsInitialized(true);
          return;
        }
      }

      // Load cart items
      const cartStr = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartStr) {
        const savedCart: CartState = JSON.parse(cartStr);
        setItems(savedCart.items || []);
        setLastUpdated(savedCart.lastUpdated || null);
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      // If error, start with empty cart
      setItems([]);
    } finally {
      setIsInitialized(true);
    }
  };

  // Save cart to storage
  const saveCartToStorage = async () => {
    try {
      const now = Date.now();
      const cartState: CartState = {
        items,
        lastUpdated: now,
      };
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      await AsyncStorage.setItem(CART_EXPIRY_KEY, (now + CART_EXPIRY_TIME).toString());
      
      setLastUpdated(now);
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  };

  // Clear storage
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      await AsyncStorage.removeItem(CART_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear cart storage:', error);
    }
  };

  // Check if product is in cart
  const isInCart = useCallback((productId: number): boolean => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Get item quantity
  const getItemQuantity = useCallback((productId: number): number => {
    const item = items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [items]);

  // Add to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Increase quantity
  const increaseQuantity = useCallback((productId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decrease quantity
  const decreaseQuantity = useCallback((productId: number) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (item && item.quantity <= 1) {
        // Remove item if quantity would become 0
        return prevItems.filter(item => item.id !== productId);
      }
      
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    setItems([]);
    await clearStorage();
  }, []);

  // Calculate totals
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Context value
  const value: CartContextType = {
    // State
    items,
    totalItems,
    totalPrice,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    
    // Helpers
    isInCart,
    getItemQuantity,
  };

  // Don't render children until cart is initialized from storage
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};