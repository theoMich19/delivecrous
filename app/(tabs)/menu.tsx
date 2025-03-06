import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubHeading, RegularText } from '@components/common/crous-components';
import { COLORS } from '@/styles/global';

const MenuScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <SubHeading style={styles.headerTitle}>Menu du jour</SubHeading>
            </View>
            <View style={styles.content}>
                <RegularText>Contenu de la page Menu à venir</RegularText>
            </View>
        </SafeAreaView>
    );
};

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
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MenuScreen;