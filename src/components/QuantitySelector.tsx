// src/components/QuantitySelector.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}) => {
  const isDecreaseDisabled = quantity <= minQuantity;
  const isIncreaseDisabled = quantity >= maxQuantity;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDecreaseDisabled && styles.buttonDisabled]}
        onPress={onDecrease}
        disabled={isDecreaseDisabled}
      >
        <Ionicons
          name="remove"
          size={20}
          color={isDecreaseDisabled ? colors.grey400 : colors.primary}
        />
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.button, isIncreaseDisabled && styles.buttonDisabled]}
        onPress={onIncrease}
        disabled={isIncreaseDisabled}
      >
        <Ionicons
          name="add"
          size={20}
          color={isIncreaseDisabled ? colors.grey400 : colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    borderColor: colors.grey200,
  },
  quantity: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
});

export default QuantitySelector;