import { Category } from '@prisma/client';

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  category: Category;
  description?: string;
  imageUrl?: string;
}

export const INITIAL_MENU_ITEMS: MenuItemData[] = [
  // Chicken
  {
    id: 'chicken-1',
    name: '12 Piece Bucket',
    price: 1450,
    category: 'CHICKEN',
    description: 'Family-sized bucket with 12 pieces of fried chicken',
  },
  {
    id: 'chicken-2',
    name: '5pc Strips',
    price: 650,
    category: 'CHICKEN',
    description: 'Crispy chicken strips',
  },
  {
    id: 'chicken-3',
    name: 'Bucket for 2',
    price: 890,
    category: 'CHICKEN',
    description: 'Perfect combo for two people',
  },
  
  // Burgers
  {
    id: 'burger-1',
    name: 'Zinger Burger',
    price: 450,
    category: 'BURGERS',
    description: 'Spicy chicken burger',
  },
  {
    id: 'burger-2',
    name: 'Classic Burger',
    price: 380,
    category: 'BURGERS',
    description: 'Traditional chicken burger',
  },
  {
    id: 'burger-3',
    name: 'Double Burger',
    price: 550,
    category: 'BURGERS',
    description: 'Double chicken patty burger',
  },
  
  // Drinks
  {
    id: 'drink-1',
    name: 'Large Soda',
    price: 120,
    category: 'DRINKS',
    description: 'Large soft drink',
  },
  {
    id: 'drink-2',
    name: 'Medium Soda',
    price: 90,
    category: 'DRINKS',
    description: 'Medium soft drink',
  },
  {
    id: 'drink-3',
    name: 'Water Bottle',
    price: 50,
    category: 'DRINKS',
    description: 'Bottled water',
  },
  
  // Extras
  {
    id: 'extra-1',
    name: 'Family Size Fries',
    price: 280,
    category: 'EXTRAS',
    description: 'Large serving of fries',
  },
  {
    id: 'extra-2',
    name: 'Regular Fries',
    price: 150,
    category: 'EXTRAS',
    description: 'Regular serving of fries',
  },
  {
    id: 'extra-3',
    name: 'Coleslaw',
    price: 80,
    category: 'EXTRAS',
    description: 'Fresh coleslaw',
  },
];

export const MENU_CATEGORIES = [
  { value: 'CHICKEN', label: 'Chicken', icon: '🍗' },
  { value: 'BURGERS', label: 'Burgers', icon: '🍔' },
  { value: 'DRINKS', label: 'Drinks', icon: '🥤' },
  { value: 'EXTRAS', label: 'Extras', icon: '📦' },
] as const;
