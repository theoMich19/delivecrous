import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from "@/components/AuthGuard";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ToastProvider } from "./contexts/ToastContext";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGuard>
          <SafeAreaProvider>
            <CartProvider>
              <FavoritesProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </FavoritesProvider>
            </CartProvider>
          </SafeAreaProvider>
        </AuthGuard>
      </AuthProvider>
    </ToastProvider>
  );
}
