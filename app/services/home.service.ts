import { News } from '@/models/news.model';
import { Restaurant } from '@/models/restaurant.model';
import { API_CONFIG } from '@/config/api.config';

const API_URL = API_CONFIG.BASE_URL;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
}

export const HomeService = {
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await fetch(`${API_URL}/restaurants`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des restaurants');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getRestaurants:', error);
      throw error;
    }
  },

  async getRestaurantsByCity(city: string): Promise<Restaurant[]> {
    try {
      const response = await fetch(`${API_URL}/restaurants/city/${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des restaurants par ville');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getRestaurantsByCity:', error);
      throw error;
    }
  },

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    try {
      const response = await fetch(`${API_URL}/restaurants/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des restaurants');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur searchRestaurants:', error);
      throw error;
    }
  },

  async getNews(): Promise<News[]> {
    try {
      console.log('Fetching news from:', `${API_URL}/news`);
      const response = await fetch(`${API_URL}/news`);
      console.log('News response status:', response.status);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getNews:', error);
      return [];
    }
  }
};