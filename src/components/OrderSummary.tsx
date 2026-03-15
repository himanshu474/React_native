import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { formatCurrency } from '../utils/formatCurrency';

interface OrderSummaryProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping = 5.99,
  tax = 0,
  discount = 0,
}) => {
  const taxAmount = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + taxAmount - discount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>{formatCurrency(shipping)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tax (10%)</Text>
        <Text style={styles.value}>{formatCurrency(taxAmount)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Discount</Text>
          <Text style={[styles.value, styles.discountValue]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.small,
  },
  title: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.variants.body1,
    color: colors.textSecondary,
  },
  value: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  discountLabel: {
    color: colors.success,
  },
  discountValue: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey200,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    ...typography.variants.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.variants.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default OrderSummary;