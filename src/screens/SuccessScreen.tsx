// src/screens/SuccessScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import LottieView from 'lottie-react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Button from '../components/Button';

// Note: You'll need to add a success animation JSON file
// For now, we'll use a simple checkmark animation

const SuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color={colors.success} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Thank you for your purchase. Your order has been confirmed.
        </Text>

        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <Text style={styles.orderValue}>#ORD-{Date.now().toString().slice(-8)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Date</Text>
            <Text style={styles.orderValue}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Estimated Delivery</Text>
            <Text style={styles.orderValue}>
              {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Continue Shopping"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
            variant="primary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <Button
            title="View Orders"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            variant="outline"
            size="large"
            fullWidth
            style={styles.button}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.variants.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.variants.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  orderLabel: {
    ...typography.variants.body1,
    color: colors.textSecondary,
  },
  orderValue: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default SuccessScreen;