import { Order } from "./order.model";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  favorites: string[];
  orders: string[];
  address?: string;
} 