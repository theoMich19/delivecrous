// app/(tabs)/profile.tsx
import { SubHeading, RegularText, Button, Heading } from '@/components/common/crous-components';
import { COLORS } from '@/styles/global';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View, TextInput, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [address, setAddress] = useState(user?.address ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);
            setError('');
            await updateProfile({
                phone,
                address
            });
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour formater le numéro de téléphone
    const formatPhoneNumber = (phone: string) => {
        // Supprime tous les espaces existants et caractères non numériques
        const cleaned = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
        // Groupe les chiffres par 2
        const matched = cleaned.match(/.{1,2}/g);
        // Joint les groupes avec des espaces ou retourne la chaîne vide si null
        return matched ? matched.join(' ') : '';
    };

    // Gestionnaire pour la mise à jour du numéro de téléphone
    const handlePhoneChange = (text: string) => {
        // Supprime les espaces pour le stockage
        const cleaned = text.replace(/\s+/g, '');
        setPhone(cleaned);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {error ? (
                    <View style={styles.errorContainer}>
                        <RegularText style={styles.errorText}>{error}</RegularText>
                    </View>
                ) : null}
                
                <View style={styles.profileContainer}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImagePlaceholder}>
                            <Heading style={styles.profileInitials}>
                                {user?.name?.split(' ').map(n => n[0]).join('')}
                            </Heading>
                        </View>
                    </View>

                    <View style={styles.profileSection}>
                        <View style={styles.sectionHeader}>
                            <SubHeading style={styles.sectionTitle}>Mes informations</SubHeading>
                            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                                <RegularText style={styles.editButton}>
                                    {isEditing ? 'Annuler' : 'Modifier'}
                                </RegularText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileInfoItem}>
                            <RegularText style={styles.infoLabel}>Nom complet</RegularText>
                            <RegularText>{user?.name}</RegularText>
                        </View>
                        <View style={styles.profileInfoItem}>
                            <RegularText style={styles.infoLabel}>Email</RegularText>
                            <RegularText>{user?.email}</RegularText>
                        </View>
                        <View style={styles.profileInfoItem}>
                            <RegularText style={styles.infoLabel}>Téléphone</RegularText>
                            {isEditing ? (
                                <TextInput
                                    value={formatPhoneNumber(phone)}
                                    onChangeText={handlePhoneChange}
                                    style={styles.input}
                                    placeholder="Votre téléphone"
                                    keyboardType="phone-pad"
                                    maxLength={14} // 10 chiffres + 4 espaces
                                />
                            ) : (
                                <RegularText>
                                    {user?.phone ? formatPhoneNumber(user.phone) : 'Non renseigné'}
                                </RegularText>
                            )}
                        </View>
                        <View style={[styles.profileInfoItem, styles.noBorder]}>
                            <RegularText style={styles.infoLabel}>Adresse</RegularText>
                            {isEditing ? (
                                <TextInput
                                    value={address}
                                    onChangeText={setAddress}
                                    style={[styles.input, styles.addressInput]}
                                    placeholder="Votre adresse"
                                    multiline
                                />
                            ) : (
                                <RegularText style={styles.addressText}>
                                    {user?.address ?? 'Non renseignée'}
                                </RegularText>
                            )}
                        </View>
                        {isEditing && (
                            <Button
                                title={isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                                onPress={handleSaveChanges}
                                style={styles.saveButton}
                                disabled={isLoading}
                            />
                        )}
                    </View>

                    <View style={styles.profileSection}>
                        <SubHeading style={styles.sectionTitle}>Mes préférences</SubHeading>
                        <View style={styles.profileInfoItem}>
                            <RegularText style={styles.infoLabel}>Notifications</RegularText>
                            <Switch
                                trackColor={{ false: COLORS.border, true: COLORS.secondary }}
                                thumbColor={COLORS.cardBg}
                                value={true}
                                onValueChange={() => {}}
                            />
                        </View>
                    </View>

                    <Button
                        title="Se déconnecter"
                        onPress={logout}
                        variant="secondary"
                        style={styles.logoutButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    profileContainer: {
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
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        margin: 16,
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    editButton: {
        color: COLORS.secondary,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 4,
        padding: 8,
        minWidth: 150,
        backgroundColor: COLORS.background,
    },
    addressInput: {
        minHeight: 60,
        textAlignVertical: 'top',
        width: '60%',
    },
    addressText: {
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    saveButton: {
        marginTop: 16,
    },
});