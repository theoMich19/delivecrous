import { SubHeading, RegularText, Input, Button, Heading } from '@/components/common/crous-components';
import { COLORS } from '@/styles/global';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const handleLogin = () => {
        console.log('Tentative de connexion avec:', email, password);
        setIsLoggedIn(true);
    };
    const handleSignup = () => {
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        console.log('Tentative d\'inscription avec:', email, password, firstName, lastName);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
    };

    const renderLoggedInProfile = () => (
        <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.profileImagePlaceholder}>
                    <Heading style={styles.profileInitials}>US</Heading>
                </View>
                <SubHeading style={styles.profileName}>Utilisateur CROUS</SubHeading>
                <RegularText style={styles.profileEmail}>{email}</RegularText>
            </View>

            <View style={styles.profileSection}>
                <SubHeading style={styles.sectionTitle}>Mes informations</SubHeading>
                <View style={styles.profileInfoItem}>
                    <RegularText style={styles.infoLabel}>Nom</RegularText>
                    <RegularText>{lastName || 'Non renseigné'}</RegularText>
                </View>
                <View style={styles.profileInfoItem}>
                    <RegularText style={styles.infoLabel}>Prénom</RegularText>
                    <RegularText>{firstName || 'Non renseigné'}</RegularText>
                </View>
                <View style={styles.profileInfoItem}>
                    <RegularText style={styles.infoLabel}>Email</RegularText>
                    <RegularText>{email}</RegularText>
                </View>
                <View style={styles.profileInfoItem}>
                    <RegularText style={styles.infoLabel}>Statut</RegularText>
                    <RegularText>Étudiant</RegularText>
                </View>
            </View>

            <View style={styles.profileSection}>
                <SubHeading style={styles.sectionTitle}>Mes préférences</SubHeading>
                <View style={styles.profileInfoItem}>
                    <RegularText style={styles.infoLabel}>Notifications</RegularText>
                    <Switch
                        trackColor={{ false: COLORS.border, true: COLORS.secondary }}
                        thumbColor={COLORS.cardBg}
                        value={true}
                        onValueChange={() => { }}
                    />
                </View>
            </View>

            <Button
                title="Se déconnecter"
                onPress={handleLogout}
                variant="secondary"
                style={styles.logoutButton}
            />
        </View>
    );

    const renderAuthForm = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.authContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formHeader}>
                    <SubHeading style={styles.formTitle}>
                        {isLogin ? 'Connexion' : 'Créer un compte'}
                    </SubHeading>
                    <RegularText style={styles.formSubtitle}>
                        {isLogin
                            ? 'Accédez à vos informations personnelles'
                            : 'Rejoignez la communauté CROUS'
                        }
                    </RegularText>
                </View>

                {!isLogin && (
                    <>
                        <Input
                            label="Prénom"
                            placeholder="Votre prénom"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.input}
                        />
                        <Input
                            label="Nom"
                            placeholder="Votre nom"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                        />
                    </>
                )}

                <Input
                    label="Email"
                    placeholder="votre@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <Input
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                {!isLogin && (
                    <Input
                        label="Confirmez le mot de passe"
                        placeholder="Confirmez votre mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                )}

                {isLogin && (
                    <View style={styles.rememberContainer}>
                        <TouchableOpacity
                            style={styles.rememberMe}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <View style={styles.checkboxInner} />}
                            </View>
                            <RegularText style={styles.rememberText}>Se souvenir de moi</RegularText>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <RegularText style={styles.forgotPassword}>Mot de passe oublié ?</RegularText>
                        </TouchableOpacity>
                    </View>
                )}

                <Button
                    title={isLogin ? 'Se connecter' : 'Créer un compte'}
                    onPress={isLogin ? handleLogin : handleSignup}
                    style={styles.authButton}
                />

                <View style={styles.toggleAuthContainer}>
                    <RegularText style={styles.toggleAuthText}>
                        {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                    </RegularText>
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <RegularText style={styles.toggleAuthLink}>
                            {isLogin ? 'Créer un compte' : 'Se connecter'}
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <SubHeading style={styles.headerTitle}>Mon Profil</SubHeading>
            </View>

            {isLoggedIn ? renderLoggedInProfile() : renderAuthForm()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 15,
    },
    headerTitle: {
        color: 'white',
    },
    authContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    formHeader: {
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 22,
        marginBottom: 8,
    },
    formSubtitle: {
        color: COLORS.textSecondary,
    },
    input: {
        marginBottom: 16,
    },
    rememberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.textSecondary,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondary,
    },
    checkboxInner: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 2,
    },
    rememberText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    forgotPassword: {
        color: COLORS.secondary,
        fontSize: 14,
    },
    authButton: {
        marginBottom: 16,
    },
    toggleAuthContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    toggleAuthText: {
        color: COLORS.textSecondary,
        marginRight: 4,
    },
    toggleAuthLink: {
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    profileContainer: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileInitials: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 22,
        marginBottom: 4,
    },
    profileEmail: {
        color: COLORS.textSecondary,
    },
    profileSection: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    profileInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoLabel: {
        color: COLORS.textSecondary,
    },
    logoutButton: {
        marginTop: 24,
    }
});