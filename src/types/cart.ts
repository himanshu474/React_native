// src/types/cart.ts
import { Product } from '../models/Product';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  
  // Helpers
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

export interface CartState {
  items: CartItem[];
  lastUpdated: number | null;
}