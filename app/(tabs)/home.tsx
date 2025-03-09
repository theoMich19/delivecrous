import { SubHeading } from '@/components/common/crous-components';
import Header from '@/components/common/header';
import { COLORS } from '@/styles/global';
import { NewsService } from '@/services/news.service';
import { News } from '@/models/news.model';
import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import NewsItem from '@/components/news/NewsItems';

const HomeScreen = () => {
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const newsData = await NewsService.getPublishedNews();
                const sortedNews = [...newsData].sort((a, b) =>
                    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                );
                setNews(sortedNews);
            } catch (error) {
                console.error('Erreur lors du chargement des news:', error);
            }
        };
        loadNews();
    }, []);

    const newsItems = useMemo(() => {
        return news.map((item, index) => (
            <View key={item.id}>
                <NewsItem item={item} />
                {index < news.length - 1 && <View style={styles.divider} />}
            </View>
        ));
    }, [news]);

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionContainer}>
                    <SubHeading>Dernières actualités</SubHeading>
                    {newsItems}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 15,
    },
    // Vous pouvez supprimer les styles liés aux nouvelles qui sont maintenant dans le composant NewsItem
});

export default HomeScreen;