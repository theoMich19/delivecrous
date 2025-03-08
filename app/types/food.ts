export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  restaurantId: string;
  categoryIds: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    [key: string]: string;
  };
  availableAt?: string[];
  preparationTime?: string;
  spicyLevel?: number;
  popularity?: number;
  inPromotion?: boolean;
  promotionPrice?: string;
}

export interface Category {
  id: string;
  name: string;
  iconType: string;
  iconName: string;
}
