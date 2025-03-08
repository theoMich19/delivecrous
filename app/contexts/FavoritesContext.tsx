import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { useAuth } from './AuthContext';

interface FavoritesContextProps {
    favorites: string[];
    addFavorite: (mealId: string) => Promise<void>;
    removeFavorite: (mealId: string) => Promise<void>;
    loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const { user } = useAuth();

    const loadFavorites = async () => {
        if (!user) {
            setFavorites([]);
            return;
        }

        try {
            const userFavorites = await UserService.getFavorites(user.id);
            setFavorites(userFavorites);
        } catch (error) {
            console.error('Erreur lors du chargement des favoris:', error);
        }
    };

    const addFavorite = async (mealId: string) => {
        if (!user) return;

        try {
            await UserService.addToFavorites(user.id, mealId);
            setFavorites(prev => [...prev, mealId]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout aux favoris:', error);
            throw error;
        }
    };

    const removeFavorite = async (mealId: string) => {
        if (!user) return;

        try {
            await UserService.removeFromFavorites(user.id, mealId);
            setFavorites(prev => prev.filter(id => id !== mealId));
        } catch (error) {
            console.error('Erreur lors de la suppression des favoris:', error);
            throw error;
        }
    };

    useEffect(() => {
        loadFavorites();
    }, [user]);

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, loadFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites doit être utilisé à l\'intérieur d\'un FavoritesProvider');
    }
    return context;
};