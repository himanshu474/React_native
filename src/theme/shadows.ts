import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';


const createShadow = (
  elevation: number,
  opacity: number,
  radius: number,
  offsetY: number
): ViewStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: colors.textPrimary, 
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {},
  }),
});

export const shadows = {
  small: createShadow(2, 0.03, 3, 1),

  medium: createShadow(4, 0.06, 8, 3),

  large: createShadow(8, 0.12, 16, 6),

  extraLarge: createShadow(12, 0.18, 24, 8),
} as const;

export type Shadows = typeof shadows;