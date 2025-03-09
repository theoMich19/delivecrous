import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SubHeading, RegularText } from '@/components/common/crous-components';
import { News } from '@/models/news.model';
import { COLORS } from '@/styles/global';

interface NewsItemProps {
    item: News;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
    return (
        <View style={styles.newsCard}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.newsImage}
                defaultSource={require('@assets/images/default42.png')}
            />
            <View style={styles.newsContent}>
                <SubHeading style={styles.newsTitle}>{item.title}</SubHeading>
                <RegularText style={styles.newsSummary}>{item.summary}</RegularText>
                <RegularText style={styles.newsDate}>
                    {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                </RegularText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default NewsItem;