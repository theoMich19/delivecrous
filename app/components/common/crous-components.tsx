import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ScrollView } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: object;
}

// Composant Button
const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', style }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'secondary' ? styles.buttonSecondary : null,
                style
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.buttonText,
                variant === 'secondary' ? styles.buttonTextSecondary : null
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// Composant Heading (=Titre)
const Heading: React.FC<{ children: React.ReactNode, style?: object; }> = ({ children, style }) => {
    return <Text style={[styles.title, style]}>{children}</Text>;
};

// Composant SubHeading (=Sous-titre)
const SubHeading: React.FC<{ children: React.ReactNode, style?: object; }> = ({ children, style }) => {
    return <Text style={[styles.subtitle, style]}>{children}</Text>;
};

// Composant RegularText (=Texte normal)
const RegularText: React.FC<{ children: React.ReactNode, style?: object; }> = ({ children, style }) => {
    return <Text style={[styles.text, style]}>{children}</Text>;
};

// Composant Input
interface InputProps {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false
}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#7A869A"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
    );
};

// Page de test si besoins pour preview, call le composant directement
const CrousComponentsPage: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#004A8F" />
            <View style={styles.header}>
                <Text style={styles.headerText}>CROUS Services</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Heading>Services Étudiants</Heading>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Titre</Text>
                        <Heading>Résidences universitaires</Heading>
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Sous-titre</Text>
                        <SubHeading>Demande de logement étudiant</SubHeading>
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Texte normal</Text>
                        <RegularText>
                            Les CROUS proposent des logements étudiants à loyer modéré dans
                            toute la France. Ces résidences sont attribuées en priorité aux
                            étudiants boursiers sur critères sociaux.
                        </RegularText>
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Champ de saisie</Text>
                        <Input placeholder="Numéro INE ou identifiant" />
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Bouton Principal</Text>
                        <Button title="Se connecter" onPress={() => alert('Connexion')} />
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Bouton Secondaire</Text>
                        <Button
                            title="Créer un compte"
                            variant="secondary"
                            onPress={() => alert('Création de compte')}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// List couleurs && correspondances
const COLORS = {
    primary: '#004A8F', // Bleu marine officiel
    primaryLight: '#0072CE', // Bleu clair
    secondary: '#EF4123', // Rouge accent
    background: '#F5F7FA', // Fond gris clair
    cardBg: '#FFFFFF',    // Fond carte
    text: '#333333',      // Texte principal
    textSecondary: '#4E5968', // Texte secondaire
    border: '#DFE1E6'     // Bordures
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
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        letterSpacing: 0.1,
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
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonTextSecondary: {
        color: COLORS.primary,
    },
});

export { Button, Heading, SubHeading, RegularText, Input };

export default CrousComponentsPage;