import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/styles/global';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <View style={styles.container}>
            <View style={styles.stepperLine} />

            <View style={styles.stepsContainer}>
                {steps.map((step, index) => {
                    const isActive = index <= currentStep;

                    return (
                        <View key={index} style={styles.stepItem}>
                            <View
                                style={[
                                    styles.stepCircle,
                                    isActive && styles.stepCircleActive
                                ]}
                            >
                                <Text style={[
                                    styles.stepNumber,
                                    isActive && styles.stepNumberActive
                                ]}>
                                    {index + 1}
                                </Text>
                            </View>
                            <Text style={[
                                styles.stepText,
                                isActive && styles.stepTextActive
                            ]}>
                                {step}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        paddingHorizontal: 20,
        position: 'relative',
    },
    stepperLine: {
        position: 'absolute',
        top: 12,
        left: 60,
        right: 60,
        height: 2,
        backgroundColor: COLORS.border,
        zIndex: 1,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 25,
        height: 25,
        borderRadius: 15,
        backgroundColor: COLORS.cardBg,
        borderWidth: 2,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    stepCircleActive: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    stepNumberActive: {
        color: 'white',
    },
    stepText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    stepTextActive: {
        color: COLORS.text,
        fontWeight: '500',
    },
});

export default Stepper;