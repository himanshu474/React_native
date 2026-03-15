// src/components/Rating.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  count,
  size = 'medium',
  showCount = true,
}) => {
  const starSize = {
    small: 12,
    medium: 16,
    large: 20,
  }[size];

  const textSize = {
    small: typography.variants.caption,
    medium: typography.variants.body2,
    large: typography.variants.body1,
  }[size];

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <Ionicons
                key={i}
                name="star"
                size={starSize}
                color={colors.secondary}
              />
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <Ionicons
                key={i}
                name="star-half"
                size={starSize}
                color={colors.secondary}
              />
            );
          } else {
            return (
              <Ionicons
                key={i}
                name="star-outline"
                size={starSize}
                color={colors.secondary}
              />
            );
          }
        })}
      </View>
      {showCount && count !== undefined && (
        <Text style={[styles.count, textSize]}>({count})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  count: {
    color: colors.textSecondary,
  },
});

export default Rating;