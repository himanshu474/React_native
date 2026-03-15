
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors,typography,spacing } from '../theme';


interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = colors.primary,
  text,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View style={[styles.container, styles.fullScreen]}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  text: {
    ...typography.variants.body2,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

export default Loader;