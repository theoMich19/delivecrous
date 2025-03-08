import { API_CONFIG } from "@/config/api.config";
import { Order, OrderItem } from "@/models/order.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = API_CONFIG.BASE_URL;

export const OrderService = {
  async createOrder(orderData: {
    restaurantId: string;
    meals: OrderItem[];
    totalPrice: number;
    deliveryAddress: {
      street: string;
      postalCode: string;
      city: string;
      buildingInfo?: string;
      accessCode?: string;
      instructions?: string;
    };
  }): Promise<Order> {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création de la commande"
        );
      }

      return response.json();
    } catch (error) {
      console.error("Erreur createOrder:", error);
      throw error;
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des commandes");
      }

      return response.json();
    } catch (error) {
      console.error("Erreur getUserOrders:", error);
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la commande");
      }

      return response.json();
    } catch (error) {
      console.error("Erreur getOrderById:", error);
      throw error;
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: "delivered" | "pending" | "preparing" | "canceled"
  ): Promise<Order> {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la mise à jour du statut de la commande"
        );
      }

      return response.json();
    } catch (error) {
      console.error("Erreur updateOrderStatus:", error);
      throw error;
    }
  },
};
