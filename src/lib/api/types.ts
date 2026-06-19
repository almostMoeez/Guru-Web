// Shapes returned by / sent to the Guru NestJS backend.
// Numeric ids are bigint in MySQL and arrive as strings; decimals (basePrice,
// extraPrice, totals) are serialized by mysql2 as strings too.

export interface ApiModifierItem {
  id: string;
  modifierGroupId: string;
  name: string;
  extraPrice: string | number;
}

export interface ApiModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  items: ApiModifierItem[];
}

// Junction row attached to a menu item; carries the nested modifier group.
export interface ApiMenuItemModifier {
  id: string;
  menuItemId: string;
  modifierGroupId: string;
  modifierGroup: ApiModifierGroup;
}

export interface ApiMenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: string | number;
  /** Canonical image field (matches the backend entity). */
  imageUrl: string | null;
  /** Alternate base64 payload (raw base64 or a full data URI); may be absent. */
  imageBase64?: string | null;
  isVeg: boolean | null;
  spicyLevel: number | null;
  modifiers?: ApiMenuItemModifier[];
}

// GET /menu returns categories each with their items nested.
export interface ApiCategoryGroup {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number | null;
  icon: string | null;
  items: ApiMenuItem[];
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number | null;
  icon: string | null;
}

// ----- Auth -----
export interface RequestOtpResponse {
  message?: string;
  error?: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  isNewUser: boolean;
}

// ----- Users -----
export interface ApiUser {
  id: string;
  email: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ApiUserAddress {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  landmark: string | null;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  landmark?: string;
  isDefault?: boolean;
}

// ----- Orders -----
export type OrderType = 'delivery' | 'takeaway' | 'dine_in';

export interface CreateOrderItem {
  menuItemId: string;
  quantity: number;
  modifierItemIds?: string[];
}

export interface CreateOrderPayload {
  branchId: string;
  orderType: OrderType;
  deliveryAddressId?: string;
  specialInstructions?: string;
  orderItems: CreateOrderItem[];
}

export interface ApiOrder {
  id: string;
  userId: string;
  branchId: string;
  orderType: OrderType;
  status: string;
  specialInstructions: string | null;
  subtotal: string | number;
  taxAmount: string | number;
  deliveryFee: string | number;
  totalPrice: string | number;
  orderTime: string;
  estimatedTime: string | null;
  orderItems: unknown[];
}
