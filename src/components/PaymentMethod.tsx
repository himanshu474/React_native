import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import Button from './Button';
import { formatCurrency } from '../utils/formatCurrency';

interface PaymentMethodProps {
  onPaymentComplete: (paymentMethod: any) => void;
  amount: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onPaymentComplete,
  amount,
}) => {
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handleCardPayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    setLoading(true);
    try {
     
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPaymentMethod = {
        id: 'pm_' + Date.now(),
        type: 'card',
        card: {
          brand: cardDetails?.brand || 'visa',
          last4: cardDetails?.last4 || '4242',
        },
      };
      
      onPaymentComplete(mockPaymentMethod);
      setModalVisible(false);
      
      Alert.alert(
        'Success',
        'Payment completed successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      icon: 'card-outline',
      label: 'Credit / Debit Card',
      description: 'Pay with Visa, Mastercard, Amex',
      disabled: false,
    },
    {
      id: 'apple',
      icon: 'logo-apple',
      label: 'Apple Pay',
      description: 'Fast and secure payment',
      disabled: true,
    },
    {
      id: 'google',
      icon: 'logo-google',
      label: 'Google Pay',
      description: 'Coming soon',
      disabled: true,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.selectedMethod,
              method.disabled && styles.disabledMethod,
            ]}
            onPress={() => !method.disabled && setSelectedMethod(method.id as any)}
            disabled={method.disabled}
          >
            <View style={styles.methodLeft}>
              <Ionicons
                name={method.icon as any}
                size={24}
                color={method.disabled ? colors.grey400 : colors.primary}
              />
              <View style={styles.methodInfo}>
                <Text style={[
                  styles.methodLabel,
                  method.disabled && styles.disabledText,
                ]}>
                  {method.label}
                </Text>
                <Text style={[
                  styles.methodDescription,
                  method.disabled && styles.disabledText,
                ]}>
                  {method.description}
                </Text>
              </View>
            </View>

            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            )}
          </TouchableOpacity>
        ))}

        <Button
          title={`Pay ${formatCurrency(amount)}`}
          onPress={() => setModalVisible(true)}
          variant="primary"
          size="large"
          fullWidth
          style={styles.payButton}
          icon={
            <Ionicons
              name="lock-closed"
              size={20}
              color={colors.white}
              style={{ marginRight: spacing.xs }}
            />
          }
        />
      </View>

      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setModalVisible(false)}
>
  <KeyboardAvoidingView 
    style={styles.modalOverlay}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.modalContent}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.modalScrollContent}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Enter Card Details</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <CardField
          postalCodeEnabled={false}
        //   placeholder={{
        //     number: '4242 4242 4242 4242',
        //   }}
          cardStyle={{
            backgroundColor: colors.surface,
            textColor: colors.textPrimary,
            fontSize: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.grey300,
          }}
          style={styles.cardField}
          onCardChange={setCardDetails}
        />

        <View style={styles.testCardInfo}>
          <Text style={styles.testCardTitle}>Test Card</Text>
          <Text style={styles.testCardNumber}>4242 4242 4242 4242</Text>
          <Text style={styles.testCardExpiry}>Any future date (12/25)</Text>
          <Text style={styles.testCardCvc}>Any 3 digits (123)</Text>
        </View>

        <Button
          title="Confirm Payment"
          onPress={handleCardPayment}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          style={styles.confirmButton}
        />
      </ScrollView>
    </View>
  </KeyboardAvoidingView>
</Modal>
    </>
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
  modalScrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  title: {
    ...typography.variants.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.grey200,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  selectedMethod: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  disabledMethod: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  methodLabel: {
    ...typography.variants.body1,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xxs,
  },
  methodDescription: {
    ...typography.variants.caption,
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.grey400,
  },
  payButton: {
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.variants.h3,
    color: colors.textPrimary,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: spacing.md,
  },
  testCardInfo: {
    backgroundColor: colors.grey100,
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.md,
  },
  testCardTitle: {
    ...typography.variants.body2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  testCardNumber: {
    ...typography.variants.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  testCardExpiry: {
    ...typography.variants.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  testCardCvc: {
    ...typography.variants.caption,
    color: colors.textSecondary,
  },
  confirmButton: {
    marginTop: spacing.md,
  },
});

export default PaymentMethod;