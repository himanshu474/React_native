export const colors = {
  primary: '#2A4BA0', 
  primaryLight: '#5C7EC9',
  primaryDark: '#153075',
  
  secondary: '#F9B023', 
  secondaryLight: '#FFC24B',
  secondaryDark: '#E09115',
  
  success: '#0E7043', // Forest green
  error: '#E03E3E',   // Notion-style red 
  warning: '#DFAB01', // Deeper amber for readability
  info: '#0B6E99',    // Professional teal-blue
  
  white: '#FFFFFF',
  background: '#FBFBFA', // Warm-white background
  surface: '#FFFFFF',    // Pure white for cards/containers
  grey100: '#F1F1EF',    // sidebar/hover background
  grey200: '#E9ECEF', 
  grey300: '#E3E3E2',    // Subtle hairline borders
  grey400: '#CED4DA',
  grey500: '#ADB5BD',
  grey600: '#91918E',   
  grey700: '#495057',
  grey800: '#343A40',
  grey900: '#37352F',    
  black: '#000000',
  
  textPrimary: '#37352F',  
  textSecondary: '#73726E', 
  textDisabled: '#ADB5BD',
  textInverse: '#FFFFFF',   
} as const;

export type Colors = typeof colors;