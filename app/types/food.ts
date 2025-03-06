export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  restaurantId: string; // array ?
  categoryIds: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconType: string;
  iconName: string;
}
