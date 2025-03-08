export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  city: string;
  postalCode: string;
  rating: number;
  timeEstimate: string;
  tags: string[];
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
  isOpen?: boolean;
  minimumOrder?: number;
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
