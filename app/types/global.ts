export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  //favorites?: string[]; // list des items enregistré en local ? ou appels api ? ou les 2 ?
  // orders?: Order[];  // list des items enregistré en local ? ou appels api ? ou les 2 ?
  address?: string; // Adresse principale
}
