// src/components/ProductDetailSkeleton.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Image skeleton */}
      <Skeleton width={width} height={width} borderRadius={0} />
      
      <View style={styles.content}>
        {/* Title and category */}
        <Skeleton width="80%" height={28} style={styles.marginBottom} />
        <Skeleton width="40%" height={18} style={styles.marginBottom} />
        
        {/* Rating */}
        <View style={styles.row}>
          <Skeleton width={100} height={16} />
          <Skeleton width={60} height={16} style={styles.marginLeft} />
        </View>
        
        {/* Price */}
        <Skeleton width={120} height={32} style={styles.marginVertical} />
        
        {/* Description */}
        <Skeleton width="100%" height={16} style={styles.marginBottom} />
        <Skeleton width="100%" height={16} style={styles.marginBottom} />
        <Skeleton width="90%" height={16} style={styles.marginBottom} />
        <Skeleton width="95%" height={16} style={styles.marginBottom} />
        
        {/* Add to cart button */}
        <Skeleton width="100%" height={56} style={styles.marginTop} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  marginBottom: {
    marginBottom: spacing.sm,
  },
  marginLeft: {
    marginLeft: spacing.sm,
  },
  marginVertical: {
    marginVertical: spacing.md,
  },
  marginTop: {
    marginTop: spacing.xl,
  },
});