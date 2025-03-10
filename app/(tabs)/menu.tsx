import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import { Button, Heading, SubHeading, RegularText, Input } from '@components/common/crous-components';
import { MenuService } from '@/services/menu.service';
import { getCategoryIcon } from '@/components/categories/CategoryIcons';
import { COLORS } from '@/styles/global';
import Header from '@/components/common/header';
import { useCart } from '@/contexts/CartContext';
import { Category, Meal } from '@/models/food.model';
import { Restaurant } from '@/models/restaurant.model';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import PlateIllustration from '@/components/placeholders/PlateIllustration';
import { useToast } from '@/contexts/ToastContext';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ImageKey = 'desserts' | 'sandwich' | 'promo' | 'vege' | 'drink' | 'default';

interface ImageMapping {
    [key: string]: any;
}

export default function MenuScreen() {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const favoriteAnimRef = useRef(new Animated.Value(1)).current;
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [restaurantModalVisible, setRestaurantModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [mealModalVisible, setMealModalVisible] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    const imageMapping: ImageMapping = {
        'desserts.jpg': require('@assets/images/desserts.jpg'),
        'sandwich.png': require('@assets/images/sandwich.png'),
        'promo.png': require('@assets/images/promo.png'),
        'vege.jpg': require('@assets/images/vege.jpg'),
        'drink.jpg': require('@assets/images/drink.jpg'),
        'plat.png': require('@assets/images/plat.png'),
        'default': null
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = useCallback(async () => {
        const [restaurantsData, categoriesData, mealsData] = await Promise.all([
            MenuService.getRestaurants(),
            MenuService.getCategories(),
            MenuService.getMeals()
        ]);
        setRestaurants(restaurantsData);
        setCategories(categoriesData);
        setMeals(mealsData);
        setFilteredMeals(mealsData);
        setFilteredRestaurants(restaurantsData);
    }, []);

    const toggleFavorite = useCallback(async (mealId: string) => {
        if (!user) return;

        try {
            if (favorites.includes(mealId)) {
                await removeFavorite(mealId);
            } else {
                await addFavorite(mealId);
            }
        } catch (error) {
            console.error('Erreur lors de la modification des favoris:', error);
        }
    }, [user, favorites, removeFavorite, addFavorite]);

    useEffect(() => {
        const updateFilteredMeals = async () => {
            let filtered: Meal[];

            if (selectedRestaurant && selectedCategory) {
                const restaurantMeals = await MenuService.getMealsByRestaurant(selectedRestaurant.id);
                filtered = restaurantMeals.filter(meal => meal.categoryIds.includes(selectedCategory));
            } else if (selectedRestaurant) {
                filtered = await MenuService.getMealsByRestaurant(selectedRestaurant.id);
            } else if (selectedCategory) {
                filtered = await MenuService.getMealsByCategory(selectedCategory);
            } else {
                filtered = meals;
            }

            if (showOnlyFavorites) {
                filtered = filtered.filter(meal => favorites.includes(meal.id));
            }

            const sortedMeals = [...filtered].sort((a, b) => {
                const aIsFavorite = favorites.includes(a.id);
                const bIsFavorite = favorites.includes(b.id);
                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;
                return 0;
            });

            setFilteredMeals(sortedMeals);
        };

        updateFilteredMeals();
    }, [selectedRestaurant, selectedCategory, favorites, showOnlyFavorites, meals]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredRestaurants(restaurants);
        } else {
            const filtered = restaurants.filter(
                restaurant => restaurant.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredRestaurants(filtered);
        }
    }, [searchText, restaurants]);

    const openMealDetails = useCallback((meal: Meal) => {
        setSelectedMeal(meal);
        setMealModalVisible(true);
    }, []);

    const handleFavoritePress = useCallback((mealId: string) => {
        Animated.sequence([
            Animated.timing(favoriteAnimRef, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.spring(favoriteAnimRef, {
                toValue: 1.2,
                friction: 2,
                tension: 120,
                useNativeDriver: true
            }),
            Animated.spring(favoriteAnimRef, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true
            })
        ]).start();

        setTimeout(() => {
            toggleFavorite(mealId);
        }, 100);
    }, [toggleFavorite]);


    const CategoryItem = ({ item, isSelected, onSelect }: {
        item: Category;
        isSelected: boolean;
        onSelect: (id: string) => void;
    }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePress = () => {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 150,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                })
            ]).start(() => {
                onSelect(item.id);
            });
        };

        return (
            <TouchableOpacity
                style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected
                ]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Animated.View
                    style={[
                        styles.categoryImageContainer,
                        isSelected && styles.categoryImageContainerSelected,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    {item.iconType === 'svg' ? (
                        getCategoryIcon(item.id, 40)
                    ) : (
                        <View></View>
                    )}
                </Animated.View>
                <RegularText
                    style={[
                        styles.categoryTitle,
                        isSelected && styles.categoryTitleSelected
                    ]}
                >
                    {item.name}
                </RegularText>
            </TouchableOpacity>
        );
    };

    const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
        <CategoryItem
            item={item}
            isSelected={selectedCategory === item.id}
            onSelect={(id: string) => setSelectedCategory(selectedCategory === id ? null : id)}
        />
    ), [selectedCategory]);

    const renderMealItem = useCallback(({ item }: { item: Meal }) => {
        const restaurant = restaurants.find(r => r.id === item.restaurantId);
        const isFavorite = favorites.includes(item.id);
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.mealCard}
                onPress={() => openMealDetails(item)}
            >
                {(imageMapping[item.imageUrl as ImageKey] || imageMapping.default) !== null ? (
                    <Image
                        source={imageMapping[item.imageUrl as ImageKey] || imageMapping.default}
                        style={styles.mealImage}
                    />
                ) : (
                    <PlateIllustration style={styles.mealImage} />
                )}
                <View style={styles.mealInfo}>
                    <View style={styles.mealHeader}>
                        <SubHeading style={styles.mealName}>{item.name}</SubHeading>
                        {isFavorite && (
                            <Ionicons
                                name="heart"
                                size={20}
                                color={COLORS.accent}
                                style={styles.favoriteIcon}
                            />
                        )}
                    </View>
                    <RegularText style={styles.mealDescription} numberOfLines={2}>{item.description}</RegularText>
                    <View style={styles.mealBottom}>
                        <Text style={styles.mealPrice}>{item.price}</Text>
                        {!selectedRestaurant && restaurant && (
                            <RegularText style={styles.mealRestaurant}>
                                {restaurant.name}
                            </RegularText>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [restaurants, favorites, selectedRestaurant, openMealDetails]);

    const renderRestaurantModalItem = useCallback(({ item }: { item: Restaurant }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.modalRestaurantItem}
            onPress={() => {
                setSelectedRestaurant(item);
                setRestaurantModalVisible(false);
            }}
        >
            <Image
                source={require('@assets/images/crouss_restau.jpg')}
                style={styles.modalRestaurantImage}
            />
            <View style={styles.modalRestaurantInfo}>
                <SubHeading style={styles.modalRestaurantName}>{item.name}</SubHeading>
                <View style={styles.tagsContainer}>
                    {item.tags.slice(0, 2).map((tag, index) => (
                        <View key={index} style={styles.tagBadge}>
                            <RegularText style={styles.tagText}>{tag}</RegularText>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    ), []);

    const mealDetailsModal = useMemo(() => {
        if (!selectedMeal) return null;

        const mealRestaurant = restaurants.find(r => r.id === selectedMeal.restaurantId);
        const mealCategories = categories.filter(category =>
            selectedMeal.categoryIds.includes(category.id)
        );
        const isFavorite = favorites.includes(selectedMeal.id);

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={mealModalVisible}
                onRequestClose={() => setMealModalVisible(false)}
            >
                <View style={styles.mealModalOverlay}>
                    <SafeAreaView style={styles.mealModalContainer}>
                        <View style={styles.mealModalHeader}>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setMealModalVisible(false)}
                            >
                                <Text style={styles.modalCloseText}>Fermer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => handleFavoritePress(selectedMeal.id)}
                            >
                                <Animated.View style={{ transform: [{ scale: favoriteAnimRef }] }}>
                                    <Ionicons
                                        name={isFavorite ? "heart" : "heart-outline"}
                                        size={28}
                                        color={isFavorite ? COLORS.accent : "white"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.mealModalContent}>
                            {(imageMapping[selectedMeal.imageUrl as ImageKey] || imageMapping.default) !== null ? (
                                <Image
                                    source={imageMapping[selectedMeal.imageUrl as ImageKey] || imageMapping.default}
                                    style={styles.mealModalImage}
                                />
                            ) : (
                                <PlateIllustration style={styles.mealImage} />
                            )}

                            <View style={styles.mealModalTitleContainer}>
                                <Heading style={styles.mealModalTitle}>{selectedMeal.name}</Heading>
                                <Text style={styles.mealModalPrice}>{selectedMeal.price}</Text>
                            </View>

                            <View style={styles.mealModalSection}>
                                <SubHeading style={styles.mealModalSectionTitle}>Description</SubHeading>
                                <RegularText style={styles.mealModalDescription}>
                                    {selectedMeal.description}
                                </RegularText>

                                {selectedMeal.ingredients && (
                                    <View style={styles.mealModalIngredients}>
                                        <SubHeading style={styles.mealModalSectionTitle}>Ingrédients</SubHeading>
                                        <View style={styles.ingredientsList}>
                                            {selectedMeal.ingredients.map((ingredient, index) => (
                                                <View key={index} style={styles.ingredientItem}>
                                                    <View style={styles.ingredientDot} />
                                                    <RegularText style={styles.ingredientText}>
                                                        {ingredient}
                                                    </RegularText>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>

                            {mealRestaurant && (
                                <View style={styles.mealModalSection}>
                                    <SubHeading style={styles.mealModalSectionTitle}>Restaurant</SubHeading>
                                    <TouchableOpacity
                                        style={styles.mealModalRestaurantCard}
                                        onPress={() => {
                                            setMealModalVisible(false);
                                            setSelectedRestaurant(mealRestaurant);
                                        }}
                                    >
                                        <Image
                                            source={require(`@assets/images/crouss_restau.jpg`)}
                                            style={styles.mealModalRestaurantImage}
                                        />
                                        <View style={styles.mealModalRestaurantInfo}>
                                            <SubHeading style={styles.modalRestaurantName}>{mealRestaurant.name}</SubHeading>
                                            <View style={styles.ratingContainer}>
                                                <View style={styles.ratingBadge}>
                                                    <RegularText>{mealRestaurant.rating.toFixed(1)}</RegularText>
                                                </View>
                                                <RegularText> • {mealRestaurant.timeEstimate}</RegularText>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {mealCategories.length > 0 && (
                                <View style={styles.mealModalSection}>
                                    <SubHeading style={styles.mealModalSectionTitle}>Catégories</SubHeading>
                                    <View style={styles.mealModalCategories}>
                                        {mealCategories.map(category => (
                                            <View key={category.id} style={styles.categoryBadge}>
                                                <RegularText style={styles.categoryBadgeText}>{category.name}</RegularText>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {selectedMeal.allergens && selectedMeal.allergens.length > 0 && (
                                <View style={styles.mealModalSection}>
                                    <SubHeading style={styles.mealModalSectionTitle}>Allergènes</SubHeading>
                                    <RegularText style={styles.mealModalAllergens}>
                                        {selectedMeal.allergens.join(', ')}
                                    </RegularText>
                                </View>
                            )}

                            {selectedMeal.nutritionalInfo && (
                                <View style={styles.mealModalSection}>
                                    <SubHeading style={styles.mealModalSectionTitle}>
                                        Informations nutritionnelles
                                    </SubHeading>
                                    <View style={styles.nutritionalInfoContainer}>
                                        {Object.entries(selectedMeal.nutritionalInfo).map(([key, value], index) => (
                                            <View key={index} style={styles.nutritionalInfoItem}>
                                                <RegularText style={styles.nutritionalInfoLabel}>
                                                    {key}:
                                                </RegularText>
                                                <RegularText style={styles.nutritionalInfoValue}>
                                                    {value}
                                                </RegularText>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <Button
                                title="Commander ce plat"
                                onPress={() => {
                                    const restaurantName = mealRestaurant ? mealRestaurant.name : "Restaurant inconnu";
                                    addToCart(selectedMeal, restaurantName);
                                    showToast(`${selectedMeal.name} ajouté au panier`, 'success', 3000);
                                    setMealModalVisible(false);
                                }}
                                style={styles.orderButton}
                            />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        );
    }, [selectedMeal, mealModalVisible, restaurants, categories, favorites, toggleFavorite, addToCart]);

    const sectionTitle = useMemo(() => {
        if (selectedCategory) {
            const categoryName = categories.find(c => c.id === selectedCategory)?.name || "";
            if (selectedRestaurant) {
                return `${categoryName} - ${selectedRestaurant.name}`;
            }
            return categoryName;
        }
        if (selectedRestaurant) {
            return `Tous les plats - ${selectedRestaurant.name}`;
        }
        return "Tous les plats";
    }, [selectedCategory, selectedRestaurant, categories]);

    const emptyState = useMemo(() => (
        <View style={styles.emptyStateContainer}>
            <RegularText style={styles.emptyStateText}>
                {showOnlyFavorites
                    ? "Vous n'avez pas encore de plats favoris"
                    : "Aucun plat ne correspond à vos critères de recherche."}
            </RegularText>
        </View>
    ), [showOnlyFavorites]);

    const restaurantModal = useMemo(() => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={restaurantModalVisible}
            onRequestClose={() => setRestaurantModalVisible(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setRestaurantModalVisible(false)}
                    >
                        <Text style={styles.modalCloseText}>Annuler</Text>
                    </TouchableOpacity>
                    <SubHeading style={styles.modalTitle}>Choisir un restaurant</SubHeading>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.modalSearchContainer}>
                    <Input
                        placeholder="Rechercher un restaurant..."
                        value={searchText}
                        onChangeText={setSearchText}
                        style={styles.modalSearchInput}
                    />
                </View>

                <ScrollView style={styles.modalContent}>
                    {filteredRestaurants.map(restaurant => (
                        renderRestaurantModalItem({ item: restaurant })
                    ))}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    ), [restaurantModalVisible, filteredRestaurants, searchText, renderRestaurantModalItem]);

    const selectedRestaurantCard = useMemo(() => {
        if (!selectedRestaurant) {
            return (
                <Button
                    title="Choisir un restaurant"
                    onPress={() => setRestaurantModalVisible(true)}
                    style={styles.chooseRestaurantButton}
                />
            );
        }

        return (
            <TouchableOpacity
                style={styles.selectedRestaurantCard}
                onPress={() => setRestaurantModalVisible(true)}
            >
                <Image
                    source={require('@assets/images/crouss_restau.jpg')}
                    style={styles.selectedRestaurantImage}
                />
                <View style={styles.selectedRestaurantInfo}>
                    <SubHeading style={styles.selectedRestaurantName}>
                        {selectedRestaurant.name}
                    </SubHeading>
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                            <RegularText>{selectedRestaurant.rating.toFixed(1)}</RegularText>
                        </View>
                        <RegularText> • {selectedRestaurant.timeEstimate}</RegularText>
                    </View>
                </View>
                <View style={styles.changeButton}>
                    <Text style={styles.changeButtonText}>Changer</Text>
                </View>
            </TouchableOpacity>
        );
    }, [selectedRestaurant]);

    const filterActions = useMemo(() => (
        <View style={styles.filterActions}>
            {user && (
                <TouchableOpacity
                    style={[
                        styles.favoriteFilterButton,
                        showOnlyFavorites && styles.favoriteFilterActive
                    ]}
                    onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
                >
                    <Ionicons
                        name={showOnlyFavorites ? "heart" : "heart-outline"}
                        size={18}
                        color={showOnlyFavorites ? COLORS.accent : COLORS.textSecondary}
                    />
                    <RegularText
                        style={[
                            styles.favoriteFilterText,
                            showOnlyFavorites && styles.favoriteFilterTextActive
                        ]}
                    >
                        Favoris
                    </RegularText>
                </TouchableOpacity>
            )}
            {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                    <RegularText style={styles.clearFilter}>Effacer</RegularText>
                </TouchableOpacity>
            )}
        </View>
    ), [user, showOnlyFavorites, selectedCategory]);

    const mealsList = useMemo(() => {
        if (filteredMeals.length === 0) {
            return emptyState;
        }

        return filteredMeals.map(meal => renderMealItem({ item: meal }));
    }, [filteredMeals, renderMealItem, emptyState]);

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.restaurantFilterSection}>
                    <View style={styles.filterHeader}>
                        <SubHeading>Restaurant</SubHeading>
                        {selectedRestaurant && (
                            <TouchableOpacity onPress={() => setSelectedRestaurant(null)}>
                                <RegularText style={styles.clearFilter}>Effacer</RegularText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {selectedRestaurantCard}
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <SubHeading>Catégories</SubHeading>
                        {selectedCategory && (
                            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                                <RegularText style={styles.clearFilter}>Effacer</RegularText>
                            </TouchableOpacity>
                        )}
                    </View>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View></View>
                        {/* <SubHeading>{sectionTitle}</SubHeading> */}
                        {filterActions}
                    </View>

                    {mealsList}
                </View>
            </ScrollView>

            {restaurantModal}
            {mealDetailsModal}
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
    content: {
        flex: 1,
        padding: 15,
    },
    restaurantFilterSection: {
        marginBottom: 20,
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    clearFilter: {
        color: COLORS.secondary,
        fontSize: 14,
    },
    selectedRestaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryLight,
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
    },
    selectedRestaurantImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    selectedRestaurantInfo: {
        flex: 1,
    },
    selectedRestaurantName: {
        fontSize: 16,
        marginBottom: 4,
    },
    changeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.secondary,
        borderRadius: 4,
    },
    changeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    chooseRestaurantButton: {
        marginTop: 5,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoriesList: {
        paddingVertical: 10,
    },
    categoryItem: {
        marginRight: 15,
        alignItems: 'center',
        width: 80,
    },
    categoryItemSelected: {
        transform: [{ scale: 1.05 }],
    },
    categoryImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    categoryImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: COLORS.secondaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    categoryImageContainerSelected: {
        borderColor: COLORS.secondary,
    },
    categoryTitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    categoryTitleSelected: {
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    mealCard: {
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
    },
    mealImage: {
        width: 100,
        height: '100%',
        margin: 5,
        borderRadius: 6,
        resizeMode: 'contain'
    },
    mealInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    mealName: {
        fontSize: 16,
        flex: 1,
        marginRight: 8,
    },
    favoriteIcon: {
        marginLeft: 'auto',
    },
    mealDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginVertical: 4,
    },
    mealBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    mealPrice: {
        fontWeight: 'bold',
        color: COLORS.text,
        fontSize: 15,
    },
    mealRestaurant: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        backgroundColor: COLORS.secondaryLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    emptyStateContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
    },
    emptyStateText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
        padding: 15,
    },
    modalTitle: {
        color: 'white',
        textAlign: 'center',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalCloseText: {
        color: 'white',
        fontSize: 16,
    },
    modalSearchContainer: {
        padding: 15,
        backgroundColor: COLORS.primary,
        paddingBottom: 20,
    },
    modalSearchInput: {
        backgroundColor: 'white',
        marginBottom: 0,
    },
    modalContent: {
        flex: 1,
        padding: 15,
    },
    modalRestaurantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    modalRestaurantImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: 'lightgray',
    },
    modalRestaurantInfo: {
        flex: 1,
    },
    modalRestaurantName: {
        fontSize: 16,
        marginBottom: 6,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagBadge: {
        backgroundColor: COLORS.tag,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    mealModalOverlay: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mealModalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mealModalHeader: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    mealModalContent: {
        flex: 1,
    },
    mealModalImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.7,
        backgroundColor: 'lightgray',
    },
    mealModalTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 16,
        backgroundColor: COLORS.cardBg,
    },
    mealModalTitle: {
        flex: 1,
        fontSize: 22,
    },
    mealModalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    mealModalSection: {
        backgroundColor: COLORS.cardBg,
        marginBottom: 8,
        padding: 15,
    },
    mealModalSectionTitle: {
        marginBottom: 8,
        color: COLORS.primary,
    },
    mealModalDescription: {
        lineHeight: 22,
        color: COLORS.text,
    },
    mealModalIngredients: {
        marginTop: 16,
    },
    ingredientsList: {
        marginTop: 8,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ingredientDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.secondary,
        marginRight: 8,
    },
    ingredientText: {
        fontSize: 14,
    },
    mealModalRestaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryLight,
        borderRadius: 8,
        padding: 12,
        marginTop: 5,
    },
    mealModalRestaurantImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: 'lightgray',
    },
    mealModalRestaurantInfo: {
        flex: 1,
    },
    mealModalCategories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryBadge: {
        backgroundColor: COLORS.secondaryLight,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryBadgeText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    mealModalAllergens: {
        color: COLORS.accent,
        fontSize: 14,
    },
    nutritionalInfoContainer: {
        marginTop: 8,
    },
    nutritionalInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    nutritionalInfoLabel: {
        color: COLORS.textSecondary,
    },
    nutritionalInfoValue: {
        fontWeight: '600',
    },
    orderButton: {
        margin: 15,
        marginTop: 5,
        marginBottom: 30,
    },
    favoriteButton: {
        padding: 8,
    },
    filterActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    favoriteFilterActive: {
        backgroundColor: COLORS.secondaryLight,
        borderColor: COLORS.accent,
    },
    favoriteFilterText: {
        fontSize: 12,
        marginLeft: 4,
        color: COLORS.textSecondary,
    },
    favoriteFilterTextActive: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
});