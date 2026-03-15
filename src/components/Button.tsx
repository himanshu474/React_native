import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import{colors,spacing,typography,shadows} from "../theme"

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: {
            color: colors.white,
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.secondary,
            borderWidth: 0,
          },
          text: {
            color: colors.textPrimary,
          },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
          },
        };
      case 'ghost':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: colors.primary,
          },
        };
      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          button: {
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            minHeight: 32,
          },
          text: {
            fontSize: typography.size.sm,
          },
        };
      case 'medium':
        return {
          button: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            minHeight: 44,
          },
          text: {
            fontSize: typography.size.md,
          },
        };
      case 'large':
        return {
          button: {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            minHeight: 56,
          },
          text: {
            fontSize: typography.size.lg,
          },
        };
      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles.button,
        sizeStyles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        Platform.OS === 'ios' ? shadows.small : shadows.small,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.white : colors.primary} 
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text 
            style={[
              styles.baseText,
              variantStyles.text,
              sizeStyles.text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: spacing.xs,
  },
  baseText: {
    ...typography.variants.button,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textDisabled,
  },
});

export default Button;