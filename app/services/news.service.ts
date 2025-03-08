import { API_CONFIG } from '@/config/api.config';
import { News } from '@/models/news.model';

const API_URL = API_CONFIG.BASE_URL;

export const NewsService = {
  async getNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_URL}/news`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getNews:', error);
      throw error;
    }
  },

  async getPublishedNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_URL}/news?isPublished=true`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités publiées');
      }
      return response.json();
    } catch (error) {
      console.error('Erreur getPublishedNews:', error);
      throw error;
    }
  }
}; 