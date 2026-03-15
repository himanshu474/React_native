// src/screens/CartScreen.tsx (UPDATED - Fix Stripe Provider)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';

import { CartScreenProps } from '../types/navigation';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import PaymentMethod from '../components/PaymentMethod';

// Stripe publishable key (test mode) - Replace with your actual key
const STRIPE_KEY = 'pk_test_51OjExamplePublishableKeyHere';

// Wrapper component to handle Stripe initialization
const CartContent: React.FC<{
  items: any[];
  totalItems: number;
  totalPrice: number;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  user: any;
  navigation: any;
}> = ({
  items,
  totalItems,
  totalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  user,
  navigation,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [processing, setProcessing] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to continue with checkout',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    setCheckoutStep('checkout');
  };

  const handlePaymentComplete = async (paymentMethod: any) => {
  setProcessing(true);
  
  try {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart after successful payment
    await clearCart();
    
    // Navigate to success screen using the correct parent navigator
    navigation.navigate('MainTabs');
  } catch (error) {
    Alert.alert('Payment Failed', 'Please try again');
  } finally {
    setProcessing(false);
  }
}

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const handleBackToCheckout = () => {
    setCheckoutStep('checkout');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <CartItem
      item={item}
      onIncrease={() => increaseQuantity(item.id)}
      onDecrease={() => decreaseQuantity(item.id)}
      onRemove={() => removeFromCart(item.id)}
    />
  );

  // Empty cart state
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Shopping Cart" />
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added any items to your cart yet"
          icon={<Ionicons name="cart-outline" size={64} color={colors.grey400} />}
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Products' })}
        />
      </View>
    );
  }

  // Checkout step
  if (checkoutStep === 'checkout') {
    return (
      <View style={styles.container}>
        <Header
          title="Checkout"
          showBack
          onLeftPress={handleBackToCart}
        />

        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <>
              <OrderSummary subtotal={totalPrice} />
              
              <View style={styles.checkoutActions}>
                <Button
                  title="Proceed to Payment"
                  onPress={() => setCheckoutStep('payment')}
                  variant="primary"
                  size="large"
                  fullWidth
                  icon={
                    <Ionicons
                      name="card"
                      size={20}
                      color={colors.white}
                      style={{ marginRight: spacing.xs }}
                    />
                  }
                />
                <Button
                  title="Back to Cart"
                  onPress={handleBackToCart}
                  variant="outline"
                  size="large"
                  fullWidth
                />
              </View>
            </>
          }
        />
      </View>
    );
  }

  // Payment step
  if (checkoutStep === 'payment') {
    return (
      <View style={styles.container}>
        <Header
          title="Payment"
          showBack
          onLeftPress={handleBackToCheckout}
        />

        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <>
              <OrderSummary subtotal={totalPrice} />
              <PaymentMethod
                onPaymentComplete={handlePaymentComplete}
                amount={totalPrice}
              />
            </>
          }
        />
      </View>
    );
  }

  // Cart step
  return (
    <View style={styles.container}>
      <Header title="Shopping Cart" />

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.cartFooter}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalValue}>{totalItems}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Price:</Text>
              <Text style={styles.totalPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>

            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              variant="primary"
              size="large"
              fullWidth
              style={styles.checkoutButton}
              icon={
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={colors.white}
                  style={{ marginRight: spacing.xs }}
                />
              }
            />

            <TouchableOpacity
              style={styles.clearCartButton}
              onPress={() => {
                Alert.alert(
                  'Clear Cart',
                  'Are you sure you want to clear your cart?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', onPress: clearCart, style: 'destructive' },
                  ]
                );
              }}
            >
              <Text style={styles.clearCartText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

// Main CartScreen with StripeProvider at the top level
const CartScreen: React.FC<CartScreenProps> = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <StripeProvider
      publishableKey={STRIPE_KEY}
      merchantIdentifier="merchant.com.ecommerce.app" // Required for Apple Pay
      urlScheme="ecommerce-app" // Required for 3D Secure
    >
      <CartContent
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        user={user}
        navigation={navigation}
      />
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  cartFooter: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadows.small,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    ...typography.variants.body1,
    color: colors.textSecondary,
  },
  totalValue: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  totalPrice: {
    ...typography.variants.h2,
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: spacing.md,
  },
  clearCartButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  clearCartText: {
    ...typography.variants.body2,
    color: colors.error,
  },
  checkoutActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});

export default CartScreen;