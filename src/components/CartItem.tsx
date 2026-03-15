// src/components/CartItem.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { CartItem as CartItemType } from '../types/cart';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { formatCurrency } from '../utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const lineTotal = item.price * item.quantity;

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        Alert.alert(
          'Remove Item',
          `Remove ${item.title} from cart?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', onPress: onRemove, style: 'destructive' },
          ]
        );
      }}
    >
      <Ionicons name="trash-outline" size={24} color={colors.white} />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeIcon}>
              <Ionicons name="close" size={20} color={colors.grey500} />
            </TouchableOpacity>
          </View>

          <Text style={styles.category}>{item.category}</Text>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Text style={styles.lineTotal}>
                Total: {formatCurrency(lineTotal)}
              </Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, item.quantity <= 1 && styles.disabledButton]}
                onPress={onDecrease}
                disabled={item.quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={item.quantity <= 1 ? colors.grey400 : colors.primary}
                />
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={onIncrease}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.grey100,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.variants.body2,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    marginRight: spacing.xs,
  },
  removeIcon: {
    padding: spacing.xs,
  },
  category: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    ...typography.variants.h3,
    color: colors.primary,
    fontSize: 16,
  },
  lineTotal: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    borderColor: colors.grey200,
  },
  quantity: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '90%',
    marginTop: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.xs,
  },
});

export default CartItem;