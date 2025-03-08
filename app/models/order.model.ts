export interface OrderItem {
  mealId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  meals: OrderItem[];
  totalPrice: number;
  status: "delivered" | "pending" | "preparing" | "canceled";
  createdAt: string;
}

export interface DeliveryAddress {
  street: string;
  postalCode: string;
  city: string;
  buildingInfo?: string;
  accessCode?: string;
  instructions?: string;
}

export interface CreateOrderDTO {
  restaurantId: string;
  meals: OrderItem[];
  totalPrice: number;
  deliveryAddress: DeliveryAddress;
}

export interface OrderSummary {
  id: string;
  status: "delivered" | "pending" | "preparing" | "canceled";
  createdAt: string;
  totalPrice: number;
  restaurantName: string;
}
