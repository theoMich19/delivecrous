// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';

// Importez vos écrans
import HomeScreen from '@/(tabs)/home';
import MenuScreen from '@/(tabs)/menu';
import ProfileScreen from '@/(tabs)/profile';

// Importez vos icônes
import { HomeIcon, MenuIcon, ProfileIcon } from '@/components/navigation/TabIcons';
import { COLORS } from '@/styles/global';
import { RegularText } from '@components/common/crous-components';

// Définition du type pour les paramètres de navigation
type RootTabParamList = {
    Home: undefined;
    Menu: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: COLORS.secondary,
                    tabBarInactiveTintColor: COLORS.textSecondary,
                    tabBarStyle: {
                        height: 60,
                        paddingTop: 5,
                        paddingBottom: 5,
                        backgroundColor: COLORS.cardBg,
                        borderTopColor: COLORS.border,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 5,
                    },
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontFamily: 'System', // Changez si vous avez une font personnalisée
                        marginBottom: 3,
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Accueil',
                        tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Menu"
                    component={MenuScreen}
                    options={{
                        tabBarLabel: 'Menu',
                        tabBarIcon: ({ color, size }) => <MenuIcon color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profil',
                        tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}