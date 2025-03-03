export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  restaurantId: string; // array ?
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}
