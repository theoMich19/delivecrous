import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from '@/contexts/CartContext'

export default function RootLayout() {
  return <SafeAreaProvider>
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  </SafeAreaProvider>
}
