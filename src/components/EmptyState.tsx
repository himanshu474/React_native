import React from "react";
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Button from "./Button";
import { colors, spacing, typography } from "../theme"



interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}



const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon,
    actionLabel,
    onAction,
}) => {
    return (
        <View style={styles.container}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    size="medium"
                    style={styles.button}
                />
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.variants.h3,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        ...typography.variants.body1,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    button: {
        minWidth: 200,
    },
});

export default EmptyState;