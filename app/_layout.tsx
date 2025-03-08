import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from "@/components/AuthGuard";

export default function RootLayout() {
  return (
  <AuthProvider>
    <AuthGuard>
      <SafeAreaProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </SafeAreaProvider>
    </AuthGuard>
  </AuthProvider>
  );
}
