import { User } from "./user.model";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateUserData {
  phone?: string;
  address?: string;
  buildingInfo?: string;
  accessCode?: string;
  deliveryInstructions?: string;
}
