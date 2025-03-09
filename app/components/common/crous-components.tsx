import { COLORS } from '@/styles/global';
import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ScrollView, Animated, Easing } from 'react-native';

// Définition des types avec animation
interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: object;
    textStyle?: object;
    disabled?: boolean;
}
interface InputProps {
    placeholder?: string;
    label?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
    style?: object;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

interface TextComponentProps {
    children: React.ReactNode;
    style?: object;
}

// Composant Button
const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
        }).start();
    };

    const handlePress = () => {
        if (!disabled) {
            onPress();
        }
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }]
            }}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    variant === 'secondary' ? styles.buttonSecondary :
                        variant === 'outline' ? styles.buttonOutline : styles.buttonPrimary,
                    disabled && styles.buttonDisabled,
                    style
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                activeOpacity={1}
            >
                <Text style={[
                    styles.buttonText,
                    variant === 'secondary' ? styles.buttonTextSecondary :
                        variant === 'outline' ? styles.buttonTextOutline : styles.buttonTextPrimary,
                    disabled && styles.buttonTextDisabled,
                    textStyle
                ]}>
                    {title}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};
// Composant Heading (=Titre)
const Heading: React.FC<TextComponentProps> = ({ children, style }) => {
    return <Text style={[styles.title, style]}>{children}</Text>;
};

// Composant SubHeading (=Sous-titre)
const SubHeading: React.FC<TextComponentProps> = ({ children, style }) => {
    return <Text style={[styles.subtitle, style]}>{children}</Text>;
};

// Composant RegularText (=Texte normal)
const RegularText: React.FC<TextComponentProps & { numberOfLines?: number }> = ({ children, style, numberOfLines }) => {
    return <Text style={[styles.text, style]} numberOfLines={numberOfLines}>{children}</Text>;
};

// Composant Input amélioré
const Input: React.FC<InputProps> = ({
    placeholder,
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    error,
    style,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    ...props
}) => {
    return (
        <View style={[styles.inputContainer, style]}>
            {label && <Text style={styles.inputLabel}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null
                ]}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};


// Styles defauts composants
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    componentContainer: {
        marginBottom: 25,
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    componentTitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '500',
    },

    // Styles des composants individuels
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        letterSpacing: 0.1,
    },

    // Input styles améliorés
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.cardBg,
    },
    inputError: {
        borderColor: COLORS.accent,
    },
    errorText: {
        color: COLORS.accent,
        fontSize: 12,
        marginTop: 4,
    },

    // Button styles améliorés
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonSecondary: {
        backgroundColor: COLORS.secondary,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    buttonDisabled: {
        backgroundColor: COLORS.border,
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonTextPrimary: {
        color: 'white',
    },
    buttonTextSecondary: {
        color: 'white',
    },
    buttonTextOutline: {
        color: COLORS.primary,
    },
    buttonTextDisabled: {
        color: COLORS.textSecondary,
    },
});

export { Button, Heading, SubHeading, RegularText, Input };
