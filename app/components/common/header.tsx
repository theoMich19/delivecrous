import { COLORS } from "@/styles/global"
import { View, StatusBar, StyleSheet } from "react-native"
import { SubHeading } from "./crous-components"

const Header = () => {
    return (
        <View>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={styles.header}>
                <SubHeading style={styles.headerTitle}>DeliCrouss</SubHeading>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        padding: 15,
    },
    headerTitle: {
        color: 'white',
    },
})


export default Header