import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dishById, dishes } from './data/menu';

/* ---------------- types ---------------- */

export type Phase = 'splash' | 'onboarding' | 'location' | 'app';
export type Tab = 'home' | 'menu' | 'orders' | 'reservations' | 'profile';
export type OrderType = 'delivery' | 'takeaway' | 'dinein';

export interface OptionChoice {
  group: string;
  choice: string;
  delta: number;
}

export interface CartLine {
  key: string;
  dishId: string;
  qty: number;
  options: OptionChoice[];
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  type: OrderType;
  locationId: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  discount: number;
  fee: number;
  total: number;
  placedAt: number;
  status: number; // index into ORDER_STAGES
  address?: string;
  eta: string;
  pointsEarned: number;
}

export interface Reservation {
  id: string;
  code: string;
  locationId: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface Profile {
  name: string;
  phone: string;
  email: string;
  guest: boolean;
  addresses: string[];
  vegMode?: boolean;
}

export type StackScreen =
  | { type: 'dish'; id: string }
  | { type: 'checkout' }
  | { type: 'track'; orderId: string }
  | { type: 'reserve' }
  | { type: 'loyalty' }
  | { type: 'offers' }
  | { type: 'search' }
  | { type: 'location' };

/* ---------------- store ---------------- */

interface AppState {
  phase: Phase;
  onboarded: boolean;
  locationId: string | null;
  profile: Profile;

  tab: Tab;
  stack: StackScreen[];

  cart: CartLine[];
  cartOpen: boolean;
  orders: Order[];
  reservations: Reservation[];
  favorites: string[];
  points: number;
  referralCode: string;

  online: boolean;

  /* actions */
  setLocation: (id: string) => void;
  goApp: () => void;
  setPhase: (p: Phase) => void;

  setTab: (t: Tab) => void;
  push: (s: StackScreen) => void;
  pop: () => void;

  addToCart: (line: Omit<CartLine, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (v: boolean) => void;

  placeOrder: (o: Omit<Order, 'id' | 'code' | 'placedAt' | 'status' | 'pointsEarned'>) => Order;
  advanceOrder: (id: string) => void;

  addReservation: (r: Omit<Reservation, 'id' | 'code'>) => Reservation;
  cancelReservation: (id: string) => void;

  toggleFavorite: (id: string) => void;
  addPoints: (n: number) => void;
  setProfile: (p: Partial<Profile>) => void;
  setOnline: (v: boolean) => void;
  reset: () => void;
}

const initialProfile: Profile = {
  name: '',
  phone: '',
  email: '',
  guest: true,
  addresses: [],
};

const randCode = (p: string) =>
  `${p}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;

export const lineTotal = (l: CartLine) => {
  const d = dishById(l.dishId);
  if (!d) return 0;
  const delta = l.options.reduce((n, o) => n + o.delta, 0);
  return (d.price + delta) * l.qty;
};

export const cartCount = (cart: CartLine[]) => cart.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (cart: CartLine[]) => cart.reduce((n, l) => n + lineTotal(l), 0);

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      phase: 'splash',
      onboarded: false,
      locationId: null,
      profile: initialProfile,

      tab: 'home',
      stack: [],

      cart: [],
      cartOpen: false,
      orders: [],
      reservations: [],
      favorites: [],
      points: 120,
      referralCode: randCode('GH'),

      online: true,

      setLocation: (id) => set({ locationId: id, phase: 'app' }),
      goApp: () => set({ phase: 'app' }),
      setPhase: (p) => set({ phase: p }),

      setTab: (t) => set({ tab: t, stack: [] }),
      push: (s) => set((st) => ({ stack: [...st.stack, s] })),
      pop: () => set((st) => ({ stack: st.stack.slice(0, -1) })),

      addToCart: (line) => {
        const key = line.dishId + '|' + line.options.map((o) => o.choice).join(',');
        set((st) => {
          const found = st.cart.find((l) => l.key === key);
          if (found) {
            return {
              cart: st.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l)),
            };
          }
          return { cart: [...st.cart, { ...line, key }] };
        });
      },
      setQty: (key, qty) =>
        set((st) => ({
          cart: qty <= 0 ? st.cart.filter((l) => l.key !== key) : st.cart.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),
      clearCart: () => set({ cart: [] }),
      setCartOpen: (v) => set({ cartOpen: v }),

      placeOrder: (o) => {
        const order: Order = {
          ...o,
          id: Math.random().toString(36).slice(2),
          code: randCode('GH'),
          placedAt: Date.now(),
          status: 0,
          pointsEarned: Math.round(o.total / 10),
        };
        set((st) => ({
          orders: [order, ...st.orders],
          cart: [],
          cartOpen: false,
          points: st.points + order.pointsEarned,
          stack: [{ type: 'track', orderId: order.id }],
          tab: 'orders',
        }));
        return order;
      },
      advanceOrder: (id) =>
        set((st) => ({
          orders: st.orders.map((o) => (o.id === id && o.status < 6 ? { ...o, status: o.status + 1 } : o)),
        })),

      addReservation: (r) => {
        const res: Reservation = { ...r, id: Math.random().toString(36).slice(2), code: randCode('TB') };
        set((st) => ({ reservations: [res, ...st.reservations], points: st.points + 50 }));
        return res;
      },
      cancelReservation: (id) => set((st) => ({ reservations: st.reservations.filter((r) => r.id !== id) })),

      toggleFavorite: (id) =>
        set((st) => ({
          favorites: st.favorites.includes(id) ? st.favorites.filter((f) => f !== id) : [...st.favorites, id],
        })),
      addPoints: (n) => set((st) => ({ points: st.points + n })),
      setProfile: (p) => set((st) => ({ profile: { ...st.profile, ...p } })),
      setOnline: (v) => set({ online: v }),
      reset: () =>
        set({
          phase: 'app',
          onboarded: false,
          locationId: null,
          profile: initialProfile,
          tab: 'home',
          stack: [],
          cart: [],
          orders: [],
          reservations: [],
          favorites: [],
          points: 120,
        }),
    }),
    {
      name: 'gharelu-app',
      partialize: (s) => ({
        onboarded: s.onboarded,
        locationId: s.locationId,
        profile: s.profile,
        tab: s.tab,
        cart: s.cart,
        orders: s.orders,
        reservations: s.reservations,
        favorites: s.favorites,
        points: s.points,
        referralCode: s.referralCode,
      }),
    }
  )
);

/* ---------------- selectors ---------------- */

export const activeDishes = (locationId: string | null) =>
  locationId ? dishes.filter((d) => d.branchAvailability.includes(locationId)) : dishes;

export const tierOf = (points: number) =>
  points >= 5000 ? 3 : points >= 2000 ? 2 : points >= 500 ? 1 : 0;
