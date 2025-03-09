import { COLORS } from "@/styles/global"
import { View, StatusBar, StyleSheet, Text } from "react-native"
import { SubHeading } from "./crous-components"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Header = () => {
    return (
        <View style={styles.header}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="white" />
                    <Text style={styles.headerTitle}>DeliCrouss</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        padding: 15,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
})

export default Header