import { Tabs } from "expo-router";
import { COLORS } from "@/styles/global";
import { HomeIcon, MenuIcon, ProfileIcon, CartIcon } from "@/components/navigation/TabIcons";

export default function TabsLayout() {
    return (
        <Tabs
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
                    marginBottom: 3,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "Accueil",
                    tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    tabBarLabel: "Menu",
                    tabBarIcon: ({ color, size }) => <MenuIcon color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarLabel: "Panier",
                    tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profil",
                    tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}