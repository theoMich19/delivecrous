import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { View } from 'react-native';

interface IconProps {
    size?: number;
    color?: string;
}

export const MainDishIcon = ({ size = 40, color = '#004A8F' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M7 9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9C17 11.7614 14.7614 14 12 14C9.23858 14 7 11.7614 7 9Z"
            fill={color}
        />
        <Path
            d="M5 18C5 16.3431 8.13401 15 12 15C15.866 15 19 16.3431 19 18V20H5V18Z"
            fill={color}
        />
    </Svg>
);

// Icône pour les sandwiches
export const SandwichIcon = ({ size = 40, color = '#004A8F' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M6 8H18C18.5523 8 19 8.44772 19 9C19 9.55228 18.5523 10 18 10H6C5.44772 10 5 9.55228 5 9C5 8.44772 5.44772 8 6 8Z"
            fill={color}
        />
        <Path
            d="M6 11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11Z"
            fill={color}
        />
        <Path
            d="M6 14H18C18.5523 14 19 14.4477 19 15C19 15.5523 18.5523 16 18 16H6C5.44772 16 5 15.5523 5 15C5 14.4477 5.44772 14 6 14Z"
            fill={color}
        />
    </Svg>
);

// Icône pour les desserts
export const DessertIcon = ({ size = 40, color = '#004A8F' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M8 6C8 6 8 4 12 4C16 4 16 6 16 6L17 12H7L8 6Z"
            fill={color}
        />
        <Path
            d="M7 13H17L16 17C16 17 15 20 12 20C9 20 8 17 8 17L7 13Z"
            fill={color}
        />
        <Circle cx="12" cy="8" r="1" fill="white" />
        <Circle cx="14" cy="10" r="1" fill="white" />
        <Circle cx="10" cy="10" r="1" fill="white" />
    </Svg>
);

// Icône pour les boissons
export const DrinkIcon = ({ size = 40, color = '#004A8F' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M7 6H17L16 16C15.5 18 13.5 19 12 19C10.5 19 8.5 18 8 16L7 6Z"
            fill={color}
        />
        <Path
            d="M9 9H15L14.5 14C14.2222 15 13.3333 16 12 16C10.6667 16 9.77778 15 9.5 14L9 9Z"
            fill="white"
        />
        <Path
            d="M12 4V6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </Svg>
);

// Icône pour les options végétariennes
export const VegetarianIcon = ({ size = 40, color = '#4CAF50' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
            fill="white"
        />
        <Path
            d="M12 6C12 6 7 8 7 12C7 16 12 18 12 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <Path
            d="M12 6C12 6 17 8 17 12C17 16 12 18 12 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <Path
            d="M12 6V18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </Svg>
);

// Icône pour les promotions
export const PromotionIcon = ({ size = 40, color = '#FFC107' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="white" />
        <Path
            d="M12 4L14.9389 9.95492L21.5106 10.9099L16.7553 15.5451L17.8779 22.0902L12 19L6.12215 22.0902L7.24472 15.5451L2.48944 10.9099L9.06107 9.95492L12 4Z"
            fill={color}
        />
        <Circle cx="12" cy="12" r="3" fill="white" />
    </Svg>
);

// Fonction utilitaire pour obtenir l'icône en fonction de la catégorie
export const getCategoryIcon = (categoryId: string, size = 40) => {
    switch (categoryId) {
        case 'cat1': // Plats principaux
            return <MainDishIcon size={size} />;
        case 'cat2': // Sandwiches
            return <SandwichIcon size={size} />;
        case 'cat3': // Desserts
            return <DessertIcon size={size} />;
        case 'cat4': // Boissons
            return <DrinkIcon size={size} />;
        case 'cat5': // Végétarien
            return <VegetarianIcon size={size} />;
        case 'cat6': // Promotions
            return <PromotionIcon size={size} color="#EF4123" />;
        default:
            return <MainDishIcon size={size} />;
    }
};