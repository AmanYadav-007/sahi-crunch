export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  dietaryTags: string[];
  spiceLevel: 0 | 1 | 2 | 3;
  veg: boolean;
  bestseller?: boolean;
  available: boolean;
  branchAvailability: string[];
  weight?: string;
  shelfLife?: string;
  fresh?: boolean;
  pptHero?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  eyebrow: string;
  line: string;
  archetype: 'plate' | 'grill' | 'bowl' | 'round' | 'glass' | 'cup' | 'dessert';
  tint: string;
  /** Live product count (only returned by /api/admin/categories) */
  count?: number;
}

export interface OrderLine {
  key: string;
  dishId: string;
  qty: number;
  options: Array<{ group: string; choice: string; delta: number }>;
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  type: 'delivery' | 'takeaway' | 'dinein';
  locationId: string;
  lines: OrderLine[];
  subtotal: number;
  tax: number;
  discount: number;
  fee: number;
  total: number;
  placedAt: number;
  status: number;
  address?: string;
  eta: string;
  pointsEarned: number;
  couponCode?: string;
  paymentMethod: string;
}

export interface Reservation {
  id: string;
  code: string;
  userId: string;
  locationId: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: string[];
  vegMode: boolean;
  createdAt: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalDishes: number;
  activeDishesCount: number;
  totalReservations: number;
  upcomingReservations: number;
}
