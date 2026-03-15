import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

interface BadgeProps {
  count: number;
  variant?: BadgeVariant;
  maxCount?: number;
  style?: ViewStyle;
  showZero?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  variant = 'primary',
  maxCount = 99,
  style,
  showZero = false,
}) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.textPrimary,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          textColor: colors.white,
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          textColor: colors.white,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          textColor: colors.textPrimary,
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
    }
  };

  const { backgroundColor, textColor } = getVariantColors();

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -spacing.xs,
    right: -spacing.xs,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
  text: {
    ...typography.variants.caption,
    fontSize: 11,
    fontWeight: typography.weight.bold,
  },
});

export default Badge;