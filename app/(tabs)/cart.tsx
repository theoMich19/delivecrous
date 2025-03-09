import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated
} from 'react-native';
import { Button, Heading, SubHeading, RegularText, Input } from '@components/common/crous-components';
import { COLORS } from '@/styles/global';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCart, CartItem } from '@/contexts/CartContext';
import Stepper from '@/components/order/stepper/stepper';
import { OrderService } from '@/services/cart.service';
import { useAuth } from '@/contexts/AuthContext';
import { DeliveryAddress, OrderItem } from '@/models/order.model';
import Header from '@/components/common/header';
import { useToast } from '@/contexts/ToastContext';

const CHECKOUT_STEPS = ["Panier", "Livraison"];

export default function CartScreen(): JSX.Element {
    const router = useRouter();
    const { showToast } = useToast();
    const { cartItems, totalPrice, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [buildingInfo, setBuildingInfo] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const totalValueAnim = useRef(new Animated.Value(1)).current;
    const prevTotalPrice = useRef(totalPrice);

    useEffect(() => {
        if (prevTotalPrice.current !== totalPrice) {
            Animated.sequence([
                Animated.timing(totalValueAnim, {
                    toValue: 1.1,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(totalValueAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();

            prevTotalPrice.current = totalPrice;
        }
    }, [totalPrice]);

    React.useEffect(() => {
        if (user) {
            try {
                if (user.address) {
                    const addressParts = user.address.split(',');
                    if (addressParts.length >= 3) {
                        setAddress(addressParts[0].trim());
                        setPostalCode(addressParts[1].trim());
                        setCity(addressParts[2].trim());
                    }
                }

                if (user.buildingInfo) setBuildingInfo(user.buildingInfo);
                if (user.accessCode) setAccessCode(user.accessCode);
                if (user.deliveryInstructions) setDeliveryInstructions(user.deliveryInstructions);
            } catch (error) {
                console.error("Erreur lors du chargement des données d'adresse:", error);
            }
        }
    }, [user]);

    const handleNextStep = () => {
        if (currentStep === 0) {
            if (cartItems.length === 0) {
                showToast("Ajoutez des articles à votre panier pour continuer.", "warning");
                return;
            }
            setCurrentStep(1);
        } else if (currentStep === 1) {
            if (address.trim() === '' || city.trim() === '' || postalCode.trim() === '') {
                showToast("Veuillez remplir tous les champs obligatoires.", "error");
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

        if (!user) {
            setAddress('');
            setCity('');
            setPostalCode('');
            setBuildingInfo('');
            setAccessCode('');
            setDeliveryInstructions('');
        }

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
                    onPress: submitOrder
                }
            ]
        );
    };

    const submitOrder = async () => {
        try {
            setIsLoading(true);

            const restaurantIds = new Set(cartItems.map(item => item.restaurantId));
            if (restaurantIds.size > 1) {
                showToast("Votre panier contient des articles de différents restaurants. Veuillez commander auprès d'un seul restaurant à la fois.", "error");
                setIsLoading(false);
                return;
            }

            if (cartItems.length === 0 || !cartItems[0].restaurantId) {
                showToast("Impossible de déterminer le restaurant. Veuillez réessayer.", "error");
                setIsLoading(false);
                return;
            }

            const deliveryAddress: DeliveryAddress = {
                street: address,
                postalCode,
                city,
                buildingInfo,
                accessCode,
                instructions: deliveryInstructions
            };

            const meals: OrderItem[] = cartItems.map(item => ({
                mealId: item.id,
                quantity: item.quantity
            }));

            const totalPriceValue = parseFloat(totalPrice.replace('€', '').replace(',', '.'));

            const orderData = {
                restaurantId: cartItems[0].restaurantId,
                meals,
                totalPrice: totalPriceValue,
                deliveryAddress
            };

            const response = await OrderService.createOrder(orderData);

            resetOrder();

            showToast("Votre commande a été placée avec succès !", "success");
            setTimeout(() => {
                router.push("/home");
            }, 1500);
        } catch (error) {
            console.error("Erreur lors de la soumission de la commande:", error);
            Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la création de votre commande. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const AnimatedCartItem = ({ item }: { item: CartItem }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;
        const opacityAnim = useRef(new Animated.Value(1)).current;

        const handleIncrease = () => {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 100,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ]).start();

            increaseQuantity(item.id);
        };

        const handleDecrease = () => {
            if (item.quantity > 1) {
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true
                    })
                ]).start();

                decreaseQuantity(item.id);
            } else {
                handleRemove();
            }
        };

        const handleRemove = () => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                removeFromCart(item.id);
            });
        };

        return (
            <Animated.View
                style={[
                    styles.cartItem,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
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
                            onPress={handleDecrease}
                        >
                            <Feather name="minus" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                        <Animated.Text
                            style={[
                                styles.quantityText,
                                { transform: [{ scale: scaleAnim }] }
                            ]}
                        >
                            {item.quantity}
                        </Animated.Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={handleIncrease}
                        >
                            <Feather name="plus" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemove}
                >
                    <Feather name="trash-2" size={20} color={COLORS.accent} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <>
                    <ScrollView style={styles.content}>
                        {cartItems.length > 0 ? (
                            cartItems.map(item => <AnimatedCartItem key={item.id} item={item} />)
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
                                <Animated.Text
                                    style={[
                                        styles.summaryValue,
                                        { transform: [{ scale: totalValueAnim }] }
                                    ]}
                                >
                                    {totalPrice}
                                </Animated.Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <RegularText style={styles.summaryLabel}>Frais de livraison</RegularText>
                                <Text style={styles.summaryValue}>0,00€</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryRow}>
                                <SubHeading style={styles.totalLabel}>Total</SubHeading>
                                <Animated.Text
                                    style={[
                                        styles.totalValue,
                                        { transform: [{ scale: totalValueAnim }] }
                                    ]}
                                >
                                    {totalPrice}
                                </Animated.Text>
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
                            <Animated.Text
                                style={[
                                    styles.totalValue,
                                    { transform: [{ scale: totalValueAnim }] }
                                ]}
                            >
                                {totalPrice}
                            </Animated.Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <Button
                                title="Retour au panier"
                                onPress={handlePreviousStep}
                                variant="secondary"
                                disabled={isLoading}
                            />
                            <Button
                                title={isLoading ? "Traitement..." : "Commander"}
                                onPress={handleNextStep}
                                disabled={isLoading}
                            />
                        </View>

                        {isLoading && (
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                                style={styles.loader}
                            />
                        )}
                    </View>
                </KeyboardAvoidingView >
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
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
        alignItems: 'center',
        marginTop: 15,
        gap: 10,
    },
    loader: {
        marginTop: 15
    }
});