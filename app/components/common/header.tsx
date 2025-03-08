import { COLORS } from "@/styles/global"
import { View, StatusBar, StyleSheet, TouchableOpacity, Text } from "react-native"
import { SubHeading } from "./crous-components"
import { useRouter } from "expo-router"
import { Feather } from '@expo/vector-icons'

const Header = () => {

    return (
        <View>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <SubHeading style={styles.headerTitle}>DeliCrouss</SubHeading>
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
    },
})

export default Header