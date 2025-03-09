import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/styles/global';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const { width } = Dimensions.get('window');

const ToastComponent = ({
    visible,
    message,
    type = 'success',
    duration = 3000,
    onHide
}: {
    visible: boolean;
    message: string;
    type: ToastType;
    duration: number;
    onHide: () => void;
}) => {
    const translateYAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateYAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#E8F5E9',
                    borderColor: COLORS.secondary,
                    icon: 'checkmark-circle',
                    iconColor: COLORS.secondary
                };
            case 'error':
                return {
                    backgroundColor: '#FFEBEE',
                    borderColor: COLORS.accent,
                    icon: 'close-circle',
                    iconColor: COLORS.accent
                };
            case 'warning':
                return {
                    backgroundColor: '#FFF8E1',
                    borderColor: '#FFA000',
                    icon: 'warning',
                    iconColor: '#FFA000'
                };
            case 'info':
                return {
                    backgroundColor: '#E3F2FD',
                    borderColor: COLORS.primary,
                    icon: 'information-circle',
                    iconColor: COLORS.primary
                };
            default:
                return {
                    backgroundColor: '#E8F5E9',
                    borderColor: COLORS.secondary,
                    icon: 'checkmark-circle',
                    iconColor: COLORS.secondary
                };
        }
    };

    const toastStyle = getToastStyles();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: translateYAnim }],
                    opacity: opacityAnim,
                    backgroundColor: toastStyle.backgroundColor,
                    borderLeftColor: toastStyle.borderColor
                }
            ]}
        >
            <Ionicons name={toastStyle.icon as any} size={24} color={toastStyle.iconColor} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [duration, setDuration] = useState(3000);

    const showToast = (
        message: string,
        type: ToastType = 'success',
        duration: number = 3000
    ) => {
        setMessage(message);
        setType(type);
        setDuration(duration);
        setVisible(true);
    };

    const hideToast = () => {
        setVisible(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastComponent
                visible={visible}
                message={message}
                type={type}
                duration={duration}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: (width - 300) / 2,
        width: 300,
        minHeight: 60,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderLeftWidth: 5,
        zIndex: 9999,
    },
    message: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
    }
});