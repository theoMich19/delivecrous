import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData, RegisterData, AuthResponse, UpdateUserData } from '@/models/auth.model';
import { API_CONFIG } from '@/config/api.config';

const API_URL = API_CONFIG.BASE_URL;

export const UserService = {
  async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de connexion');
      }

      const result = await response.json();
      await AsyncStorage.setItem('userToken', result.token);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur d\'inscription');
      }

      const result = await response.json();
      await AsyncStorage.setItem('userToken', result.token);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('userToken');
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return null;

      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/users/me`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Session expirée');
      }

      return response.json();
    } catch (error) {
      await this.logout();
      return null;
    }
  },

  async updateProfile(userId: string, data: UpdateUserData): Promise<AuthResponse['user']> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de mise à jour du profil');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async addToFavorites(userId: string, mealId: string): Promise<AuthResponse['user']> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites/${mealId}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'ajout aux favoris');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async removeFromFavorites(userId: string, mealId: string): Promise<AuthResponse['user']> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites/${mealId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression des favoris');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async getFavorites(userId: string): Promise<string[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la récupération des favoris');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
}; 