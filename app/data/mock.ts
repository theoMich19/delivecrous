import { Category, Meal } from "../types/food";
import { Restaurant } from "../types/restaurant";

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "RU Luminy",
    description:
      "Restaurant universitaire situé sur le campus de Luminy. Propose des menus variés et équilibrés à prix étudiant.",
    imageUrl: "https://placehold.co/600x400",
    address: "163 Avenue de Luminy",
    city: "Marseille",
    postalCode: "13009",
    rating: 4.2,
    timeEstimate: "15-25 min",
    tags: ["Menu à 1€", "Végétarien", "Sur place"],
    openingHours: {
      monday: "11h00-14h00",
      tuesday: "11h00-14h00",
      wednesday: "11h00-14h00",
      thursday: "11h00-14h00",
      friday: "11h00-14h00",
    },
  },
  {
    id: "2",
    name: "Cafétéria Canebière",
    description:
      "Cafétéria universitaire située en plein centre-ville. Parfait pour une pause déjeuner rapide.",
    imageUrl: "https://placehold.co/600x400",
    address: "110 La Canebière",
    city: "Marseille",
    postalCode: "13001",
    rating: 4.5,
    timeEstimate: "10-20 min",
    tags: ["Sandwichs", "À emporter", "Menu étudiant"],
    openingHours: {
      monday: "08h00-18h00",
      tuesday: "08h00-18h00",
      wednesday: "08h00-18h00",
      thursday: "08h00-18h00",
      friday: "08h00-18h00",
      saturday: "10h00-15h00",
    },
  },
  {
    id: "3",
    name: "RU St-Charles",
    description:
      "Restaurant universitaire du campus Saint-Charles proposant une cuisine diversifiée avec des options végétaliennes.",
    imageUrl: "https://placehold.co/600x400",
    address: "3 Place Victor Hugo",
    city: "Marseille",
    postalCode: "13003",
    rating: 3.9,
    timeEstimate: "20-30 min",
    tags: ["Menu complet", "Végétalien", "Sur place"],
    openingHours: {
      monday: "11h30-14h00",
      tuesday: "11h30-14h00",
      wednesday: "11h30-14h00",
      thursday: "11h30-14h00",
      friday: "11h30-14h00",
    },
  },
  {
    id: "4",
    name: "Foodtruck Sciences",
    description:
      "Food truck proposant une cuisine rapide et créative, situé sur le campus scientifique.",
    imageUrl: "https://placehold.co/600x400",
    address: "52 Avenue Escadrille Normandie Niemen",
    city: "Marseille",
    postalCode: "13013",
    rating: 4.7,
    timeEstimate: "5-15 min",
    tags: ["Street food", "Rapide", "À emporter"],
    openingHours: {
      monday: "11h00-15h00",
      tuesday: "11h00-15h00",
      wednesday: "11h00-15h00",
      thursday: "11h00-15h00",
      friday: "11h00-15h00",
    },
  },
  {
    id: "5",
    name: "Cafet' Médecine",
    description:
      "Cafétéria située dans la faculté de médecine. Idéale pour une pause café ou un repas léger.",
    imageUrl: "https://placehold.co/600x400",
    address: "27 Boulevard Jean Moulin",
    city: "Marseille",
    postalCode: "13005",
    rating: 4.0,
    timeEstimate: "5-10 min",
    tags: ["Snacks", "Boissons", "Café", "À emporter"],
    openingHours: {
      monday: "07h30-17h00",
      tuesday: "07h30-17h00",
      wednesday: "07h30-17h00",
      thursday: "07h30-17h00",
      friday: "07h30-16h00",
    },
  },
  {
    id: "6",
    name: "Brasserie des Arts",
    description:
      "Brasserie universitaire proposant des plats traditionnels dans un cadre convivial.",
    imageUrl: "https://placehold.co/600x400",
    address: "29 Avenue Robert Schuman",
    city: "Aix-en-Provence",
    postalCode: "13100",
    rating: 4.3,
    timeEstimate: "15-25 min",
    tags: ["Brasserie", "Sur place", "Terrasse"],
    openingHours: {
      monday: "11h00-15h00",
      tuesday: "11h00-15h00",
      wednesday: "11h00-15h00",
      thursday: "11h00-15h00",
      friday: "11h00-15h00",
      saturday: "11h00-14h00",
    },
  },
  {
    id: "7",
    name: "Crous Truck",
    description:
      "Food truck du CROUS proposant une cuisine rapide, variée et économique.",
    imageUrl: "https://placehold.co/600x400",
    address: "Campus de Saint-Jérôme",
    city: "Marseille",
    postalCode: "13013",
    rating: 4.1,
    timeEstimate: "5-15 min",
    tags: ["Food truck", "Menu étudiant", "À emporter"],
    openingHours: {
      monday: "11h30-14h00",
      tuesday: "11h30-14h00",
      wednesday: "11h30-14h00",
      thursday: "11h30-14h00",
      friday: "11h30-14h00",
    },
  },
  {
    id: "8",
    name: "Resto U Gaston Berger",
    description:
      "Grand restaurant universitaire offrant une large gamme de plats dans un espace lumineux et moderne.",
    imageUrl: "https://placehold.co/600x400",
    address: "413 Avenue Gaston Berger",
    city: "Aix-en-Provence",
    postalCode: "13100",
    rating: 4.4,
    timeEstimate: "15-30 min",
    tags: ["Cuisine internationale", "Menu à 1€", "Sur place"],
    openingHours: {
      monday: "11h00-14h00",
      tuesday: "11h00-14h00",
      wednesday: "11h00-14h00",
      thursday: "11h00-14h00",
      friday: "11h00-14h00",
    },
  },
  {
    id: "9",
    name: "Cafétéria Château-Gombert",
    description:
      "Cafétéria de l'école d'ingénieurs proposant des formules rapides et équilibrées.",
    imageUrl: "https://placehold.co/600x400",
    address: "60 Rue Joliot Curie",
    city: "Marseille",
    postalCode: "13013",
    rating: 3.8,
    timeEstimate: "10-15 min",
    tags: ["Formules midi", "Sandwichs", "À emporter"],
    openingHours: {
      monday: "08h00-16h00",
      tuesday: "08h00-16h00",
      wednesday: "08h00-16h00",
      thursday: "08h00-16h00",
      friday: "08h00-15h00",
    },
  },
  {
    id: "10",
    name: "L'Epicurien",
    description:
      "Restaurant universitaire haut de gamme proposant une cuisine raffinée à prix accessibles.",
    imageUrl: "https://placehold.co/600x400",
    address: "58 Boulevard Charles Livon",
    city: "Marseille",
    postalCode: "13007",
    rating: 4.6,
    timeEstimate: "20-35 min",
    tags: ["Gastronomique", "Sur place", "Réservation conseillée"],
    openingHours: {
      monday: "11h30-14h30",
      tuesday: "11h30-14h30",
      wednesday: "11h30-14h30",
      thursday: "11h30-14h30",
      friday: "11h30-14h30",
    },
  },
];

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Plats",
    iconType: "svg",
    iconName: "main-dish",
  },
  {
    id: "cat2",
    name: "Sandwichs",
    iconType: "svg",
    iconName: "sandwich",
  },
  {
    id: "cat3",
    name: "Desserts",
    iconType: "svg",
    iconName: "dessert",
  },
  {
    id: "cat4",
    name: "Boissons",
    iconType: "svg",
    iconName: "drink",
  },
  {
    id: "cat5",
    name: "Végétarien",
    iconType: "svg",
    iconName: "vegetarian",
  },
  {
    id: "cat6",
    name: "Promotions",
    iconType: "svg",
    iconName: "promotion",
  },
];

export const meals: Meal[] = [
  {
    id: "meal1",
    name: "Salade César",
    imageUrl: "/api/placeholder/200/200",
    price: "3,30€",
    categoryIds: ["cat1", "cat3"],
    description: "Salade, poulet grillé, croûtons, parmesan",
    restaurantId: "1",
  },
  {
    id: "meal2",
    name: "Lasagnes bolognaise",
    imageUrl: "/api/placeholder/200/200",
    price: "3,80€",
    categoryIds: ["cat2"],
    description: "Pâtes, viande hachée, sauce tomate, béchamel",
    restaurantId: "1",
  },
  {
    id: "meal3",
    name: "Burger végétarien",
    imageUrl: "/api/placeholder/200/200",
    price: "3,50€",
    categoryIds: ["cat2", "cat3"],
    description: "Steak végétal, cheddar, tomate, salade",
    restaurantId: "4",
  },
  {
    id: "meal4",
    name: "Sandwich jambon-beurre",
    imageUrl: "/api/placeholder/200/200",
    price: "2,80€",
    categoryIds: ["cat4"],
    description: "Baguette, jambon, beurre",
    restaurantId: "2",
  },
  {
    id: "meal5",
    name: "Yaourt nature",
    imageUrl: "/api/placeholder/200/200",
    price: "0,80€",
    categoryIds: ["cat5"],
    description: "Yaourt nature 125g",
    restaurantId: "1",
  },
  {
    id: "meal6",
    name: "Eau minérale 50cl",
    imageUrl: "/api/placeholder/200/200",
    price: "0,70€",
    categoryIds: ["cat6"],
    description: "Bouteille d'eau 50cl",
    restaurantId: "3",
  },
];
