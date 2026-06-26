export interface CustomizationChoice {
  name: string;
  extraPrice?: number;
  // Backend modifier item id — needed to reference the choice when placing an order.
  modifierItemId?: string;
}

export interface CustomizationOption {
  name: string; // e.g. "Milk Option", "Size", "Doneness"
  choices: CustomizationChoice[];
  required?: boolean;
  // Backend modifier group id this option maps to.
  modifierGroupId?: string;
}

export interface SelectedConfig {
  [optionName: string]: CustomizationChoice;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  // Backend categories are dynamic, so this is the category id (as a string).
  category: string;
  // Human-readable category label for tabs/grouping.
  categoryName?: string;
  image: string;
  badge?: string;
  calories?: number;
  customizable?: boolean;
  customizationOptions?: CustomizationOption[];
  // Lowercased backend tag names (e.g. "signature", "popular").
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder?: number;
}

// A subcategory holds the actual menu items.
export interface MenuSubcategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// A top-level category (the backend "category group") shown in the top tabs.
export interface MenuCategoryGroup {
  id: string;
  name: string;
  subcategories: MenuSubcategory[];
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
