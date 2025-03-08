export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  meals: OrderItem[];
  totalPrice: number;
  status: "pending" | "preparing" | "delivered" | "canceled";
  createdAt: string;
}

export interface OrderItem {
  mealId: string;
  quantity: number;
}
