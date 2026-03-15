// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Button from '../components/Button';
import Header from '../components/Header';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { totalItems, totalPrice, clearCart } = useCart();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearCart,
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'My Orders',
      onPress: () => Alert.alert('Coming Soon', 'Orders feature coming soon!'),
    },
    {
      icon: 'heart-outline',
      label: 'Wishlist',
      onPress: () => Alert.alert('Coming Soon', 'Wishlist feature coming soon!'),
    },
    {
      icon: 'location-outline',
      label: 'Shipping Addresses',
      onPress: () => Alert.alert('Coming Soon', 'Address management coming soon!'),
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      onPress: () => Alert.alert('Coming Soon', 'Payment methods coming soon!'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notifications coming soon!'),
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => Alert.alert('Coming Soon', 'Settings coming soon!'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'Support coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>Items in Cart</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${totalPrice.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Cart Total</Text>
          </View>
        </View>

        {/* Menu Items */}
        {/* <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.grey500} />
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerItem}
            onPress={handleClearCart}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={24} color={colors.error} />
              <Text style={[styles.menuItemLabel, { color: colors.error }]}>
                Clear Cart
              </Text>
            </View>
          </TouchableOpacity>

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            fullWidth
            style={styles.logoutButton}
            textStyle={{ color: colors.error }}
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.error}
                style={{ marginRight: spacing.sm }}
              />
            }
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadows.small,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.variants.h2,
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.variants.body2,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.grey200,
    marginHorizontal: spacing.md,
  },
  statValue: {
    ...typography.variants.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.variants.caption,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    ...shadows.small,
  },
  sectionTitle: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  dangerSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    ...shadows.small,
  },
  dangerItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
    marginBottom: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    ...typography.variants.caption,
    color: colors.textDisabled,
  },
});

export default ProfileScreen;