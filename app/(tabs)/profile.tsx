import { SubHeading, RegularText, Button, Heading } from '@/components/common/crous-components';
import { COLORS } from '@/styles/global';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/services/cart.service';
import { Order } from '@/models/order.model';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MenuService } from '@/services/menu.service';
import { Meal } from '@/models/meal.model';
import { Restaurant } from '@/models/restaurant.model';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [address, setAddress] = useState(user?.address ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [mealsData, setMealsData] = useState<{ [key: string]: Meal }>({});
    const [restaurantsData, setRestaurantsData] = useState<{ [key: string]: Restaurant }>({});
    const [mealsLoading, setMealsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrdersError('');
            const userOrders = await OrderService.getUserOrders();

            if (Array.isArray(userOrders)) {
                const validOrders = userOrders.filter(order =>
                    order && typeof order === 'object'
                );
                const sortedOrders = validOrders.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setOrders(sortedOrders);
                sortedOrders.forEach(order => {
                    if (order.restaurantId) {
                        loadRestaurantInfo(order.restaurantId);
                    }
                });
            } else {
                setOrdersError("Les données des commandes sont dans un format incorrect");
            }
        } catch (err: any) {
            setOrdersError("Impossible de charger l'historique des commandes.");
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadRestaurantInfo = async (restaurantId: string) => {
        if (restaurantsData[restaurantId]) return; // Déjà chargé

        try {
            const restaurant = await MenuService.getRestaurantById(restaurantId);
            setRestaurantsData(prevData => ({
                ...prevData,
                [restaurantId]: restaurant
            }));
        } catch (error) {
            console.error(`Erreur lors du chargement du restaurant ${restaurantId}:`, error);
        }
    };

    const loadMealDetails = async (order: Order) => {
        try {
            if (!order.restaurantId || !order.meals || order.meals.length === 0) return;
            setMealsLoading(true);
            const meals = await MenuService.getMealsByRestaurant(order.restaurantId);
            const mealsMap: { [key: string]: Meal } = {};
            meals.forEach(meal => {
                mealsMap[meal.id] = meal;
            });
            setMealsData(prevData => ({ ...prevData, ...mealsMap }));
            await loadRestaurantInfo(order.restaurantId);

        } catch (error) {
            console.error("Erreur lors du chargement des détails des repas:", error);
        } finally {
            setMealsLoading(false);
        }
    };

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

    const cancelOrder = async (orderId: string) => {
        try {
            await OrderService.updateOrderStatus(orderId, 'canceled');
            loadOrders();
            setDetailModalVisible(false);
        } catch (error) {
            console.error("Erreur lors de l'annulation de la commande:", error);
            alert("Impossible d'annuler la commande. Veuillez réessayer plus tard.");
        }
    };

    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
        const matched = cleaned.match(/.{1,2}/g);
        return matched ? matched.join(' ') : '';
    };

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/\s+/g, '');
        setPhone(cleaned);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'preparing': return 'En préparation';
            case 'delivered': return 'Livrée';
            case 'canceled': return 'Annulée';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFA000';
            case 'preparing': return '#2196F3';
            case 'delivered': return '#4CAF50';
            case 'canceled': return '#F44336';
            default: return COLORS.textSecondary;
        }
    };

    const renderOrderItem = (order: Order) => {
        const orderId = order.id ? order.id.toString() : "N/A";
        const displayId = orderId !== "N/A" ? orderId.slice(-6) : "N/A";

        return (
            <TouchableOpacity
                style={styles.orderItem}
                key={order.id || Math.random().toString()}
                onPress={() => {
                    setSelectedOrder(order);
                    setDetailModalVisible(true);
                    loadMealDetails(order);
                }}
            >
                <View style={styles.orderHeader}>
                    <View style={styles.orderIdContainer}>
                        <RegularText style={styles.orderId}>Commande #{displayId}</RegularText>
                        <RegularText style={styles.orderDate}>
                            {order.createdAt ? formatDate(order.createdAt) : "Date inconnue"}
                        </RegularText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                            {getStatusLabel(order.status)}
                        </Text>
                    </View>
                </View>
                <View style={styles.orderDetails}>
                    <View style={styles.orderInfo}>
                        <RegularText style={styles.orderRestaurant}>
                            {restaurantsData[order.restaurantId]?.name || "Restaurant non disponible"}
                        </RegularText>
                        <RegularText style={styles.orderItems}>
                            {order.meals && order.meals.length ?
                                `${order.meals.length} article${order.meals.length > 1 ? 's' : ''}` :
                                "Articles inconnus"}
                        </RegularText>
                    </View>
                    <View style={styles.orderPrice}>
                        <RegularText style={styles.totalPrice}>
                            {typeof order.totalPrice === 'number' ?
                                `${order.totalPrice.toFixed(2)}€` :
                                order.totalPrice || "Prix inconnu"}
                        </RegularText>
                        <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderOrderMealItem = (item: any) => {
        const mealName = mealsData[item.mealId]?.name || "Article inconnu";
        return (
            <View style={styles.mealItem} key={item.mealId}>
                <View style={styles.mealItemContent}>
                    <Text style={styles.mealQuantity}>x{item.quantity}</Text>
                    <RegularText style={styles.mealName}> {mealName}</RegularText>
                </View>
                {mealsData[item.mealId]?.price && (
                    <RegularText style={styles.mealPrice}>
                        {parseFloat(mealsData[item.mealId].price.replace('€', '').replace(',', '.')) * item.quantity}€
                    </RegularText>
                )}
            </View>
        );
    };

    const renderOrderDetailModal = () => {
        if (!selectedOrder) return null;
        const orderId = selectedOrder.id ? selectedOrder.id.toString() : "N/A";
        const displayId = orderId !== "N/A" ? orderId.slice(-6) : "N/A";

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailModalVisible}
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <SubHeading style={styles.modalTitle}>Détails de la commande</SubHeading>
                            <TouchableOpacity
                                onPress={() => setDetailModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Feather name="x" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.orderDetailSection}>
                                <View style={styles.orderDetailHeader}>
                                    <View>
                                        <RegularText style={styles.orderDetailTitle}>Commande #{displayId}</RegularText>
                                        <RegularText style={styles.orderDetailDate}>
                                            {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : "Date inconnue"}
                                        </RegularText>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status) }]}>
                                            {getStatusLabel(selectedOrder.status)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.orderDetailSection}>
                                <SubHeading style={styles.orderDetailSectionTitle}>Restaurant</SubHeading>
                                <RegularText style={styles.orderDetailText}>
                                    {restaurantsData[selectedOrder.restaurantId]?.name || "Nom du restaurant non disponible"}
                                </RegularText>
                            </View>

                            <View style={styles.orderDetailSection}>
                                <SubHeading style={styles.orderDetailSectionTitle}>Articles commandés</SubHeading>
                                {mealsLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                        <RegularText style={styles.loadingText}>Chargement des détails...</RegularText>
                                    </View>
                                ) : selectedOrder.meals && selectedOrder.meals.length > 0 ? (
                                    selectedOrder.meals.map(meal => renderOrderMealItem(meal))
                                ) : (
                                    <RegularText style={styles.noItemsText}>
                                        Aucun article trouvé
                                    </RegularText>
                                )}
                            </View>

                            <View style={styles.orderDetailSection}>
                                <SubHeading style={styles.orderDetailSectionTitle}>Livraison</SubHeading>
                                <RegularText style={styles.orderDetailText}>
                                    Adresse: {user?.address || "Non renseignée"}
                                </RegularText>
                            </View>

                            <View style={styles.orderPricingSection}>
                                <View style={styles.pricingRow}>
                                    <SubHeading style={styles.pricingTotalLabel}>
                                        Total
                                    </SubHeading>
                                    <SubHeading style={styles.pricingTotalValue}>
                                        {typeof selectedOrder.totalPrice === 'number' ?
                                            `${selectedOrder.totalPrice.toFixed(2)}€` :
                                            selectedOrder.totalPrice || "Prix inconnu"}
                                    </SubHeading>
                                </View>
                            </View>
                        </ScrollView>

                        {selectedOrder.status === 'pending' && (
                            <View style={styles.modalFooter}>
                                <Button
                                    title="Annuler la commande"
                                    variant="secondary"
                                    style={styles.cancelOrderButton}
                                    onPress={() => {
                                        if (selectedOrder.id) {
                                            cancelOrder(selectedOrder.id);
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        );
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
                                    maxLength={14}
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
                        <View style={styles.sectionHeader}>
                            <SubHeading style={styles.sectionTitle}>Mes commandes</SubHeading>
                            <TouchableOpacity onPress={loadOrders}>
                                <Feather name="refresh-cw" size={18} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>

                        {ordersLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <RegularText style={styles.loadingText}>Chargement des commandes...</RegularText>
                            </View>
                        ) : ordersError ? (
                            <View style={styles.errorOrdersContainer}>
                                <RegularText style={styles.errorOrdersText}>{ordersError}</RegularText>
                                <Button
                                    title="Réessayer"
                                    onPress={loadOrders}
                                    variant="secondary"
                                    style={styles.retryButton}
                                />
                            </View>
                        ) : orders.length === 0 ? (
                            <View style={styles.emptyOrdersContainer}>
                                <Feather name="shopping-bag" size={50} color={COLORS.border} />
                                <RegularText style={styles.emptyOrdersText}>
                                    Vous n'avez pas encore passé de commande
                                </RegularText>
                                <Button
                                    title="Découvrir les restaurants"
                                    onPress={() => router.push("/menu")}
                                    style={styles.orderNowButton}
                                />
                            </View>
                        ) : (
                            <View>
                                {orders.map(order => renderOrderItem(order))}

                                {orders.length > 3 && (
                                    <Button
                                        title="Voir toutes mes commandes"
                                        variant="secondary"
                                        onPress={() => {
                                            // Navigation vers une page complète d'historique
                                            // router.push("/orders/history");
                                            alert("Navigation vers l'historique complet des commandes");
                                        }}
                                        style={styles.viewAllButton}
                                    />
                                )}
                            </View>
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
                                onValueChange={() => { }}
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
            {renderOrderDetailModal()}
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
    // Styles pour la section des commandes
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textSecondary,
    },
    emptyOrdersContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyOrdersText: {
        marginTop: 10,
        marginBottom: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    orderNowButton: {
        marginTop: 10,
    },
    errorOrdersContainer: {
        alignItems: 'center',
        padding: 20,
    },
    errorOrdersText: {
        marginBottom: 15,
        color: COLORS.accent,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 10,
    },
    orderItem: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: 12,
        padding: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderIdContainer: {
        flex: 1,
    },
    orderId: {
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderInfo: {
        flex: 1,
    },
    orderRestaurant: {
        fontSize: 14,
    },
    orderItems: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    orderPrice: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalPrice: {
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: 5,
    },
    viewAllButton: {
        marginTop: 10,
    },
    // Styles modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: COLORS.background,
        width: '90%',
        maxHeight: '80%',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        backgroundColor: COLORS.cardBg,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        color: COLORS.text,
    },
    modalCloseButton: {
        padding: 5,
    },
    modalContent: {
        padding: 20,
    },
    modalFooter: {
        backgroundColor: COLORS.cardBg,
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    cancelOrderButton: {
        backgroundColor: COLORS.accent,
    },
    // Styles détails commande
    orderDetailSection: {
        marginBottom: 20,
    },
    orderDetailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDetailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    orderDetailDate: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    orderDetailSectionTitle: {
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: 10,
    },
    orderDetailText: {
        marginBottom: 5,
    },
    noItemsText: {
        fontStyle: 'italic',
        color: COLORS.textSecondary,
    },
    mealItem: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: COLORS.cardBg,
        borderRadius: 6,
    },
    mealItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealName: {
        flex: 1,
        marginLeft: 8,
    },
    mealQuantity: {
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 16,
    },
    mealPrice: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        marginTop: 4,
    },
    orderPricingSection: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pricingTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pricingTotalValue: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});