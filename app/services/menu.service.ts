import { API_CONFIG } from '@/config/api.config';
import { Category } from '@/models/category.model';
import { Meal } from '@/models/meal.model';
import { Restaurant } from '@/models/restaurant.model';

const API_URL = API_CONFIG.BASE_URL;

export const MenuService = {
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await fetch(`${API_URL}/restaurants`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des restaurants');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getRestaurants:', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getCategories:', error);
      throw error;
    }
  },

  async getMeals(): Promise<Meal[]> {
    try {
      const response = await fetch(`${API_URL}/meals`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getMeals:', error);
      throw error;
    }
  },

  async getMealsByRestaurant(restaurantId: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${API_URL}/meals?restaurantId=${restaurantId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats du restaurant');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getMealsByRestaurant:', error);
      throw error;
    }
  },

  async getMealsByCategory(categoryId: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${API_URL}/meals?categoryIds_like=${categoryId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats par catégorie');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getMealsByCategory:', error);
      throw error;
    }
  }
}; 