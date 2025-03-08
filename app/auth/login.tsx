import { SubHeading, RegularText, Input, Button } from '@/components/common/crous-components';
import { COLORS } from '@/styles/global';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            setError('');
            if (isLogin) {
                await login({ email, password });
            } else {
                if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas');
                    return;
                }
                await register({
                    email,
                    password,
                    name: `${firstName} ${lastName}`.trim(),
                });
            }
            router.replace('/(tabs)/home');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <View style={styles.innerContainer}>
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

                    {error ? (
                        <View style={styles.errorContainer}>
                            <RegularText style={styles.errorText}>{error}</RegularText>
                        </View>
                    ) : null}

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

                    <Button
                        title={isLogin ? 'Se connecter' : 'Créer un compte'}
                        onPress={handleSubmit}
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
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    innerContainer: {
        padding: 16,
        paddingTop: 40,
        paddingBottom: 40,
    },
    formHeader: {
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 22,
        marginBottom: 8,
        textAlign: 'center',
    },
    formSubtitle: {
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
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
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        marginBottom: 16,
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
}); 