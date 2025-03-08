import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ScrollView } from 'react-native';

// Définition des types
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
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'secondary' ? styles.buttonSecondary :
                    variant === 'outline' ? styles.buttonOutline : styles.buttonPrimary,
                disabled && styles.buttonDisabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
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
                        <Input
                            label="Identifiant de connexion"
                            placeholder="Numéro INE ou identifiant"
                        />
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Champ de saisie avec erreur</Text>
                        <Input
                            label="Mot de passe"
                            placeholder="Votre mot de passe"
                            secureTextEntry
                            error="Le mot de passe doit contenir au moins 8 caractères"
                        />
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

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Bouton Outline</Text>
                        <Button
                            title="Mot de passe oublié"
                            variant="outline"
                            onPress={() => alert('Mot de passe oublié')}
                        />
                    </View>

                    <View style={styles.componentContainer}>
                        <Text style={styles.componentTitle}>Bouton Désactivé</Text>
                        <Button
                            title="Valider le formulaire"
                            disabled={true}
                            onPress={() => alert('Validation')}
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
    secondary: '#00CCBC', // Nouvelle couleur secondaire (Deliveroo style)
    accent: '#EF4123', // Rouge accent
    background: '#F5F7FA', // Fond gris clair
    cardBg: '#FFFFFF',    // Fond carte
    text: '#333333',      // Texte principal
    textSecondary: '#4E5968', // Texte secondaire
    border: '#DFE1E6',    // Bordures
    tag: '#F5F5F7',       // Fond des tags
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

export default CrousComponentsPage;