export const spacing = {
  // Base unit: 4px
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Specific use cases
  screenPadding: 16,
  cardPadding: 12,
  buttonPadding: 12,
  inputPadding: 10,
  iconSpacing: 8,
} as const;

export type Spacing = typeof spacing;