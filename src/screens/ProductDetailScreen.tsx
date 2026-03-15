// src/screens/ProductDetailScreen.tsx (updated with cart)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ProductDetailScreenProps } from '../types/navigation';
import { Product } from '../models/Product';
import { useProductDetails } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/Button';
import Rating from '../components/Rating';
import QuantitySelector from '../components/QuantitySelector';
import { ProductDetailSkeleton } from '../components/ProductDetailSkeleton';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { productId, product: passedProduct } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Get cart functions
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  // Fetch product details if not passed from previous screen
  const { product: fetchedProduct, loading, error } = useProductDetails(
    passedProduct ? 0 : productId
  );

  // Use passed product if available, otherwise use fetched
  const product = passedProduct || fetchedProduct;

  // Check if product is in cart and get quantity
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      const cartQuantity = getItemQuantity(product.id);
      if (cartQuantity > 0) {
        setQuantity(cartQuantity);
      }
    }
  }, [product, getItemQuantity]);

  // Handle share
  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Check out ${product.title} for ${formatCurrency(product.price)}`,
        title: product.title,
        url: product.image,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Add to cart
    addToCart(product, quantity);
    
    // Show feedback
    Alert.alert(
      '✓ Added to Cart',
      `${quantity} × ${product.title} added to your cart`,
      [
        { 
          text: 'Continue Shopping', 
          style: 'cancel',
          onPress: () => setIsAddingToCart(false)
        },
        { 
          text: 'View Cart', 
          onPress: () => {
            setIsAddingToCart(false);
            navigation.navigate('MainTabs', { screen: 'Cart' });
          }
        },
      ]
    );
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;
    
    // Add to cart and go to checkout
    addToCart(product, quantity);
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Product Details" 
          showBack 
          onLeftPress={() => navigation.goBack()}
          rightIcon={
            <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
          }
          onRightPress={handleShare}
        />
        <ProductDetailSkeleton />
      </View>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <View style={styles.container}>
        <Header 
          title="Error" 
          showBack 
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const itemInCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <View style={styles.container}>
      <Header 
        title="Product Details" 
        showBack 
        onLeftPress={() => navigation.goBack()}
        rightIcon={
          <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
        }
        onRightPress={handleShare}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.mainImage}
            resizeMode="contain"
          />
          {itemInCart && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartQuantity} in cart
              </Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Category */}
          <Text style={styles.category}>
            {product.category.toUpperCase()}
          </Text>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Rating value={product.rating.rate} count={product.rating.count} />
            <TouchableOpacity style={styles.reviewsLink}>
              <Text style={styles.reviewsLinkText}>See reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity(prev => prev + 1)}
              onDecrease={() => setQuantity(prev => prev - 1)}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title={itemInCart ? "Update Cart" : "Add to Cart"}
              onPress={handleAddToCart}
              variant="outline"
              size="large"
              style={styles.actionButton}
              loading={isAddingToCart}
              icon={
                <Ionicons 
                  name={itemInCart ? "cart" : "cart-outline"} 
                  size={20} 
                  color={colors.primary} 
                  style={{ marginRight: spacing.xs }}
                />
              }
            />
            <Button
              title="Buy Now"
              onPress={handleBuyNow}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width,
    height: width,
    backgroundColor: colors.white,
    ...shadows.small,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  cartBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    ...shadows.small,
  },
  cartBadgeText: {
    ...typography.variants.caption,
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  category: {
    ...typography.variants.caption,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  title: {
    ...typography.variants.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  reviewsLink: {
    padding: spacing.xs,
  },
  reviewsLinkText: {
    ...typography.variants.body2,
    color: colors.primary,
    fontWeight: '500',
  },
  price: {
    ...typography.variants.h1,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.variants.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.variants.body1,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  errorButton: {
    minWidth: 200,
  },
});

export default ProductDetailScreen;