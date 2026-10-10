/**
 * db.ts — JSON database storage for Sahi Crunch standalone backend
 */

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'sahi-crunch-db.json');

/* ─────────────── Types ─────────────── */

export interface DBUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  addresses: string[];
  vegMode: boolean;
  createdAt: number;
}

export interface DBOrder {
  id: string;
  code: string;
  userId: string;
  type: 'delivery' | 'takeaway' | 'dinein';
  locationId: string;
  lines: Array<{
    key: string;
    dishId: string;
    qty: number;
    options: Array<{ group: string; choice: string; delta: number }>;
    note?: string;
  }>;
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

export interface DBReservation {
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

export interface DBLoyalty {
  userId: string;
  points: number;
  history: Array<{
    id: string;
    type: 'earn' | 'redeem';
    points: number;
    description: string;
    at: number;
  }>;
}

export interface DBFavorite {
  userId: string;
  dishIds: string[];
}

export interface DBData {
  users: DBUser[];
  orders: DBOrder[];
  reservations: DBReservation[];
  loyalty: DBLoyalty[];
  favorites: DBFavorite[];
}

/* ─────────────── Load / Save ─────────────── */

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadDB(): DBData {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const empty: DBData = { users: [], orders: [], reservations: [], loyalty: [], favorites: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), 'utf-8');
    return empty;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DBData;
  } catch {
    const empty: DBData = { users: [], orders: [], reservations: [], loyalty: [], favorites: [] };
    return empty;
  }
}

export function saveDB(data: DBData): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/* ─────────────── Helpers ─────────────── */

export const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const randCode = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;

/* ─────────────── User Queries ─────────────── */

export function findUserByEmail(email: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByPhone(phone: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.phone === phone);
}

export function findUserById(id: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.id === id);
}

export function createUser(data: Omit<DBUser, 'id' | 'createdAt'>): DBUser {
  const db = loadDB();
  const user: DBUser = { ...data, id: genId(), createdAt: Date.now() };
  db.users.push(user);
  // Initialize loyalty + favorites
  db.loyalty.push({
    userId: user.id,
    points: 120,
    history: [{ id: genId(), type: 'earn', points: 120, description: 'Welcome bonus!', at: Date.now() }],
  });
  db.favorites.push({ userId: user.id, dishIds: [] });
  saveDB(db);
  return user;
}

export function updateUser(id: string, patch: Partial<DBUser>): DBUser | null {
  const db = loadDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...patch };
  saveDB(db);
  return db.users[idx];
}

/* ─────────────── Order Queries ─────────────── */

export function getOrdersByUser(userId: string): DBOrder[] {
  const db = loadDB();
  return db.orders.filter((o) => o.userId === userId).sort((a, b) => b.placedAt - a.placedAt);
}

export function getOrderById(id: string): DBOrder | undefined {
  const db = loadDB();
  return db.orders.find((o) => o.id === id);
}

export function createOrder(data: Omit<DBOrder, 'id' | 'code' | 'placedAt' | 'status'>): DBOrder {
  const db = loadDB();
  const order: DBOrder = {
    ...data,
    id: genId(),
    code: randCode('GH'),
    placedAt: Date.now(),
    status: 0,
  };
  db.orders.push(order);
  // Add loyalty points
  const loyaltyIdx = db.loyalty.findIndex((l) => l.userId === data.userId);
  if (loyaltyIdx !== -1) {
    db.loyalty[loyaltyIdx].points += order.pointsEarned;
    db.loyalty[loyaltyIdx].history.push({
      id: genId(),
      type: 'earn',
      points: order.pointsEarned,
      description: `Order ${order.code}`,
      at: Date.now(),
    });
  }
  saveDB(db);
  return order;
}

export function updateOrderStatus(id: string, status: number): DBOrder | null {
  const db = loadDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  if (status > 6) return db.orders[idx];
  db.orders[idx].status = status;
  saveDB(db);
  return db.orders[idx];
}

/* ─────────────── Reservation Queries ─────────────── */

export function getReservationsByUser(userId: string): DBReservation[] {
  const db = loadDB();
  return db.reservations.filter((r) => r.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function createReservation(data: Omit<DBReservation, 'id' | 'code' | 'createdAt' | 'status'>): DBReservation {
  const db = loadDB();
  const res: DBReservation = { ...data, id: genId(), code: randCode('TB'), status: 'confirmed', createdAt: Date.now() };
  db.reservations.push(res);
  // Add 50 bonus points for reservation
  const loyaltyIdx = db.loyalty.findIndex((l) => l.userId === data.userId);
  if (loyaltyIdx !== -1) {
    db.loyalty[loyaltyIdx].points += 50;
    db.loyalty[loyaltyIdx].history.push({
      id: genId(),
      type: 'earn',
      points: 50,
      description: `Table reservation ${res.code}`,
      at: Date.now(),
    });
  }
  saveDB(db);
  return res;
}

export function cancelReservation(id: string, userId: string): boolean {
  const db = loadDB();
  const idx = db.reservations.findIndex((r) => r.id === id && r.userId === userId);
  if (idx === -1) return false;
  db.reservations[idx].status = 'cancelled';
  saveDB(db);
  return true;
}

/* ─────────────── Loyalty Queries ─────────────── */

export function getLoyalty(userId: string): DBLoyalty | null {
  const db = loadDB();
  return db.loyalty.find((l) => l.userId === userId) ?? null;
}

/* ─────────────── Favorites Queries ─────────────── */

export function getFavorites(userId: string): string[] {
  const db = loadDB();
  return db.favorites.find((f) => f.userId === userId)?.dishIds ?? [];
}

export function toggleFavorite(userId: string, dishId: string): string[] {
  const db = loadDB();
  let fav = db.favorites.find((f) => f.userId === userId);
  if (!fav) {
    fav = { userId, dishIds: [] };
    db.favorites.push(fav);
  }
  const idx = fav.dishIds.indexOf(dishId);
  if (idx !== -1) {
    fav.dishIds.splice(idx, 1);
  } else {
    fav.dishIds.push(dishId);
  }
  saveDB(db);
  return fav.dishIds;
}
