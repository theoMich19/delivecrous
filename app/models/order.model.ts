export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  meals: {
    mealId: string;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'delivered' | 'pending' | 'preparing' | 'canceled';
  createdAt: string;
}

export interface OrderItem {
  mealId: string;
  quantity: number;
}
