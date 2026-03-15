// src/components/ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Product } from '../models/Product';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { formatCurrency } from '../utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';

export interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  variant = 'grid',
}) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = variant === 'grid' 
    ? (screenWidth - spacing.md * 3) / 2 
    : screenWidth - spacing.md * 2;

  const handlePress = () => {
    onPress(product);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation(); // Prevent card press
    onAddToCart?.(product);
  };

  const renderRating = () => {
    const rating = product.rating?.rate || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <Ionicons key={i} name="star" size={12} color={colors.secondary} />
              );
            } else if (i === fullStars && hasHalfStar) {
              return (
                <Ionicons
                  key={i}
                  name="star-half"
                  size={12}
                  color={colors.secondary}
                />
              );
            } else {
              return (
                <Ionicons
                  key={i}
                  name="star-outline"
                  size={12}
                  color={colors.secondary}
                />
              );
            }
          })}
        </View>
        <Text style={styles.ratingCount}>({product.rating?.count || 0})</Text>
      </View>
    );
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listContainer, shadows.small]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image source={{ uri: product.image }} style={styles.listImage} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.listCategory}>{product.category}</Text>
          {renderRating()}
          <View style={styles.listFooter}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {onAddToCart && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="cart-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant
  return (
    <TouchableOpacity
      style={[styles.gridContainer, { width: cardWidth }, shadows.small]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.gridImage} />
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.gridCategory} numberOfLines={1}>
          {product.category}
        </Text>
        <View style={styles.gridFooter}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {renderRating()}
        </View>
        {onAddToCart && (
          <TouchableOpacity
            style={styles.gridAddButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles
  gridContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: colors.grey100,
    padding: spacing.sm,
  },
  gridImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  gridContent: {
    padding: spacing.sm,
  },
  gridTitle: {
    ...typography.variants.body2,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xxs,
  },
  gridCategory: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridAddButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },

  // List styles
  listContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.grey100,
    resizeMode: 'contain',
  },
  listContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  listTitle: {
    ...typography.variants.body2,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xxs,
  },
  listCategory: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  // Common styles
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingCount: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  price: {
    ...typography.variants.h3,
    color: colors.primary,
    fontSize: 16,
  },
  addButton: {
    padding: spacing.xs,
  },
});

export default ProductCard;