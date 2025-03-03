export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  city: string;
  postalCode: string;
  //latitude: number;
  //longitude: number;
  rating: number;
  //reviewsCount: number;
  //categories: string[];
  //meals: Meal[];
  openingHours: OpeningHours;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday?: string;
  sunday?: string;
}
