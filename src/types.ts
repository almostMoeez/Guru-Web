export interface CustomizationOption {
  name: string; // e.g. "Milk Option", "Size", "Doneness"
  choices: {
    name: string;
    extraPrice?: number;
  }[];
  required?: boolean;
}

export interface SelectedConfig {
  [optionName: string]: {
    name: string;
    extraPrice?: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'drinks';
  image: string;
  badge?: string;
  calories?: number;
  customizable?: boolean;
  customizationOptions?: CustomizationOption[];
}

export interface CartItem {
  cartId: string; // Unique ID generated from item and configurations
  menuItem: MenuItem;
  quantity: number;
  selectedConfig?: SelectedConfig;
}

export interface Reservation {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}
