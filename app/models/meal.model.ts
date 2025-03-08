export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  categoryIds: string[];
  description: string;
  restaurantId: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    Calories: string;
    Protéines?: string;
    Glucides?: string;
    Lipides?: string;
    Sel?: string;
    Fibres?: string;
    'dont Sucres'?: string;
    Sucres?: string;
    Minéraux?: string;
    Caféine?: string;
  };
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal?: boolean;
  preparationTime: string;
  popularity: number;
  inPromotion?: boolean;
  promotionPrice?: string;
} 