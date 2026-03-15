// src/components/Skeleton.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  DimensionValue
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SkeletonProps {
  // Use DimensionValue to support numbers, "auto", and "100%" correctly
  width?: DimensionValue; 
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.md * 3) / 2; // 2 columns with gaps

  return (
    <View style={[styles.cardSkeleton, { width: cardWidth }]}>
      <Skeleton height={cardWidth} borderRadius={8} />
      <View style={styles.cardSkeletonContent}>
        <Skeleton width="90%" height={16} />
        <Skeleton width="60%" height={14} style={styles.skeletonMargin} />
        <View style={styles.cardSkeletonFooter}>
          <Skeleton width={60} height={20} />
          <Skeleton width={40} height={20} />
        </View>
      </View>
    </View>
  );
};

// Product List Skeleton (Grid)
export const ProductListSkeleton: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      {[...Array(6)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.grey300,
  },
  cardSkeleton: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardSkeletonContent: {
    padding: spacing.sm,
  },
  skeletonMargin: {
    marginTop: spacing.xs,
  },
  cardSkeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
});