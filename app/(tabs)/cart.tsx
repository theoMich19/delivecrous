import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Button, Heading, SubHeading, RegularText, Input } from '@components/common/crous-components';
import { COLORS } from '@/styles/global';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartContext';
import Stepper from '@/components/order/stepper/stepper';

const CHECKOUT_STEPS = ["Panier", "Livraison"];

export default function CartScreen(): JSX.Element {
    const router = useRouter();
    const { cartItems, totalPrice, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(0);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [buildingInfo, setBuildingInfo] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    const handleNextStep = () => {
        if (currentStep === 0) {
            if (cartItems.length === 0) {
                Alert.alert("Panier vide", "Ajoutez des articles à votre panier pour continuer.");
                return;
            }
            setCurrentStep(1);
        } else if (currentStep === 1) {
            if (address.trim() === '' || city.trim() === '' || postalCode.trim() === '') {
                Alert.alert("Informations manquantes", "Veuillez remplir tous les champs obligatoires.");
                return;
            }
            handleCheckout();
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetOrder = () => {
        clearCart();

        setAddress('');
        setCity('');
        setPostalCode('');
        setBuildingInfo('');
        setAccessCode('');
        setDeliveryInstructions('');

        setCurrentStep(0);
    }

    const handleCheckout = () => {
        Alert.alert(
            "Confirmer la commande",
            "Êtes-vous sûr de vouloir confirmer cette commande ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Commander",
                    onPress: () => {
                        Alert.alert(
                            "Commande confirmée",
                            "Votre commande a été placée avec succès !",
                            [
                                {
                                    text: "OK",
                                    onPress: () => {
                                        resetOrder()
                                        router.push("/home");
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const renderCartItem = (item: any) => (
        <View key={item.id} style={styles.cartItem}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                defaultSource={require('@assets/images/default42.png')}
            />
            <View style={styles.itemInfo}>
                <View>
                    <SubHeading style={styles.itemName}>{item.name}</SubHeading>
                    <RegularText style={styles.itemRestaurant}>{item.restaurantName}</RegularText>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => decreaseQuantity(item.id)}
                    >
                        <Feather name="minus" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => increaseQuantity(item.id)}
                    >
                        <Feather name="plus" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
            >
                <Feather name="trash-2" size={20} color={COLORS.accent} />
            </TouchableOpacity>
        </View>
    );

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <>
                    <ScrollView style={styles.content}>
                        {cartItems.length > 0 ? (
                            cartItems.map(renderCartItem)
                        ) : (
                            <View style={styles.emptyCartContainer}>
                                <Feather name="shopping-cart" size={80} color={COLORS.border} />
                                <Heading style={styles.emptyCartTitle}>Votre panier est vide</Heading>
                                <RegularText style={styles.emptyCartText}>
                                    Ajoutez des plats à votre panier pour passer commande
                                </RegularText>
                                <Button
                                    title="Retour au menu"
                                    onPress={() => router.push("/menu")}
                                    style={styles.returnButton}
                                />
                            </View>
                        )}
                    </ScrollView>

                    {cartItems.length > 0 && (
                        <View style={styles.orderSummary}>
                            <View style={styles.summaryRow}>
                                <RegularText style={styles.summaryLabel}>Sous-total</RegularText>
                                <Text style={styles.summaryValue}>{totalPrice}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <RegularText style={styles.summaryLabel}>Frais de livraison</RegularText>
                                <Text style={styles.summaryValue}>0,00€</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryRow}>
                                <SubHeading style={styles.totalLabel}>Total</SubHeading>
                                <Text style={styles.totalValue}>{totalPrice}</Text>
                            </View>
                            <Button
                                title="Suivant - Livraison"
                                onPress={handleNextStep}
                                style={styles.checkoutButton}
                            />
                        </View>
                    )}
                </>
            );
        } else {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={styles.content}>
                        <View style={styles.deliverySection}>
                            <Heading style={styles.sectionTitle}>Adresse de livraison</Heading>

                            <Input
                                label="Adresse*"
                                placeholder="Numéro et nom de rue"
                                value={address}
                                onChangeText={setAddress}
                                style={styles.input}
                            />

                            <View style={styles.rowInputs}>
                                <Input
                                    label="Code postal*"
                                    placeholder="Ex: 13009"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    keyboardType="numeric"
                                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                                />

                                <Input
                                    label="Ville*"
                                    placeholder="Ex: Marseille"
                                    value={city}
                                    onChangeText={setCity}
                                    style={[styles.input, { flex: 2 }]}
                                />
                            </View>
                        </View>

                        <View style={styles.deliverySection}>
                            <Heading style={styles.sectionTitle}>Détails supplémentaires</Heading>

                            <Input
                                label="Bâtiment / Étage"
                                placeholder="Ex: Bâtiment B, 3ème étage"
                                value={buildingInfo}
                                onChangeText={setBuildingInfo}
                                style={styles.input}
                            />

                            <Input
                                label="Code d'accès"
                                placeholder="Ex: B123"
                                value={accessCode}
                                onChangeText={setAccessCode}
                                style={styles.input}
                            />

                            <Input
                                label="Instructions pour le livreur"
                                placeholder="Ex: Sonnez à l'interphone"
                                value={deliveryInstructions}
                                onChangeText={setDeliveryInstructions}
                                style={styles.input}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.orderSummary}>
                        <View style={styles.summaryRow}>
                            <SubHeading style={styles.totalLabel}>Total à payer</SubHeading>
                            <Text style={styles.totalValue}>{totalPrice}</Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <Button
                                title="Retour au panier"
                                onPress={handlePreviousStep}
                                variant="secondary"
                                style={styles.backButton}
                            />
                            <Button
                                title="Commander"
                                onPress={handleNextStep}
                                style={styles.confirmButton}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={styles.header}>
                <SubHeading style={styles.headerTitle}>Mon Panier</SubHeading>
                {currentStep === 0 && cartItems.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            Alert.alert(
                                "Vider le panier",
                                "Êtes-vous sûr de vouloir vider votre panier ?",
                                [
                                    { text: "Annuler", style: "cancel" },
                                    { text: "Confirmer", onPress: clearCart }
                                ]
                            );
                        }}
                    >
                        <RegularText style={styles.clearButtonText}>Vider</RegularText>
                    </TouchableOpacity>
                )}
            </View>
            <Stepper steps={CHECKOUT_STEPS} currentStep={currentStep} />
            {renderStepContent()}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    clearButton: {
        padding: 5,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    cartItem: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        marginBottom: 15,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        padding: 10,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: 'lightgray',
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        marginBottom: 2,
    },
    itemRestaurant: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    itemPrice: {
        fontWeight: 'bold',
        color: COLORS.text,
        fontSize: 15,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.secondaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderSummary: {
        backgroundColor: COLORS.cardBg,
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 18,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    checkoutButton: {
        marginTop: 15,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyCartTitle: {
        marginTop: 20,
        marginBottom: 10,
    },
    emptyCartText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginBottom: 30,
    },
    returnButton: {
        width: '80%',
    },
    deliverySection: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        marginBottom: 15,
        color: COLORS.primary,
    },
    input: {
        marginBottom: 15,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    backButton: {
        flex: 1,
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
    }
});