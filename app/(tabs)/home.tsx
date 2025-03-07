import { RegularText, SubHeading } from '@/components/common/crous-components';
import Header from '@/components/common/header';
import { restaurants } from '@/data/mock';
import { COLORS } from '@/styles/global';
import { Restaurant } from '@/types/restaurant';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    ImageBackground
} from 'react-native';


interface NewsItem {
    id: string;
    title: string;
    summary: string;
    date: string;
    imageUrl: string;
}


const HomeScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const news: NewsItem[] = [
        {
            id: 'news1',
            title: 'Menu à 1€ pour tous les étudiants boursiers',
            summary: 'À partir du 1er mars, tous les étudiants boursiers peuvent bénéficier du repas à 1€ dans nos restaurants universitaires.',
            date: '27/02/2025',
            imageUrl: '/api/placeholder/600/300',
        },
        {
            id: 'news2',
            title: 'Nouveaux horaires pour le RU Saint-Charles',
            summary: 'Le restaurant universitaire Saint-Charles étend ses horaires d\'ouverture jusqu\'à 21h du lundi au vendredi.',
            date: '25/02/2025',
            imageUrl: '/api/placeholder/600/300',
        },
    ];



    const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
        <TouchableOpacity key={item.id} style={styles.restaurantCard} onPress={() => alert(`Voir le menu de ${item.name}`)}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
                <SubHeading>{item.name}</SubHeading>
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                        <RegularText>{item.rating.toFixed(1)}</RegularText>
                    </View>
                    <RegularText> • {item.timeEstimate}</RegularText>
                </View>
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag, index) => (
                        <View key={index} style={styles.tagBadge}>
                            <RegularText style={styles.tagText}>{tag}</RegularText>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );


    // Rendu d'une actualité
    const renderNewsItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity
            style={styles.newsCard}
            onPress={() => alert(`Lire l'article: ${item.title}`)}
        >

            <Image
                source={typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl}
                style={styles.newsImage}
                defaultSource={require('@assets/images/default42.png')}
                onError={() => console.log('Erreur de chargement')}
            />
            <View style={styles.newsContent}>
                <SubHeading style={styles.newsTitle}>{item.title}</SubHeading>
                <RegularText style={styles.newsSummary}>{item.summary}</RegularText>
                <RegularText style={styles.newsDate}>{item.date}</RegularText>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionContainer}>
                    <SubHeading>Dernières actualités</SubHeading>
                    {news.map((item, index) => (
                        <View key={item.id}>
                            {renderNewsItem({ item })}
                            {index < news.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>
                <View style={styles.sectionContainer}>
                    <SubHeading>Restaurants universitaires</SubHeading>
                    {restaurants.map(restaurant => renderRestaurantItem({ item: restaurant }))}
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};


// Styles pour la page d'accueil
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: 'white',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    locationContainer: {
        flex: 1,
    },
    deliveryTo: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: 'white',
        marginRight: 5,
    },
    chevronDown: {
        width: 12,
        height: 12,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: 'white',
        transform: [{ rotate: '45deg' }],
        marginTop: -5,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    searchContainer: {
        marginBottom: 5,
    },
    content: {
        flex: 1,
        padding: 15,
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
    clearFilter: {
        color: COLORS.secondary,
        fontSize: 14,
    },
    categoriesList: {
        paddingVertical: 15,
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
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryImageSelected: {
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
    restaurantCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        backgroundColor: 'lightgray'
    },
    restaurantInfo: {
        padding: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8,
    },
    ratingBadge: {
        backgroundColor: COLORS.secondaryLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tagBadge: {
        backgroundColor: COLORS.tag,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    // Styles pour les plats
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
        height: 100,
    },
    mealInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    mealName: {
        fontSize: 16,
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
    // Styles pour les actualités
    newsCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 5,
    },
    newsImage: {
        width: '100%',
        height: 160,
        backgroundColor: 'lightgray'
    },
    newsContent: {
        padding: 15,
    },
    newsTitle: {
        marginBottom: 8,
    },
    newsSummary: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: 10,
    },
    newsDate: {
        color: COLORS.textSecondary,
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 15,
    },
});

export default HomeScreen;