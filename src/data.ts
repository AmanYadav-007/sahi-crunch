import type { Dish } from './data/menu';

/* ---------------- cravings (home rails) ---------------- */

export interface Craving {
  id: string;
  label: string;
  hint: string;
  test: (d: Dish) => boolean;
}

export const cravings: Craving[] = [
  { id: 'spicy', label: 'SPICY', hint: 'bring the heat', test: (d) => d.spiceLevel >= 2 },
  { id: 'comfort', label: 'COMFORT FOOD', hint: 'slow and warm', test: (d) => ['north-indian', 'main-course', 'indian'].includes(d.category) },
  { id: 'grilled', label: 'GRILLED', hint: 'straight off the coals', test: (d) => ['tandoor', 'grill'].includes(d.category) },
  { id: 'sweet', label: 'SWEET', hint: 'the last word', test: (d) => ['desserts', 'coffee'].includes(d.category) },
  { id: 'light', label: 'LIGHT', hint: 'easy on the night', test: (d) => d.spiceLevel <= 1 && d.price <= 420 },
  { id: 'chef', label: "CHEF'S SPECIAL", hint: 'off-menu thinking', test: (d) => !!d.bestseller || d.category === 'specials' },
];

/* ---------------- search intent keywords ---------------- */

export const intentMap: Array<{ keys: string[]; test: (d: Dish) => boolean }> = [
  { keys: ['spicy', 'hot', 'chilli', 'chili', 'fire'], test: (d) => d.spiceLevel >= 2 },
  { keys: ['mild', 'not spicy', 'light spicy'], test: (d) => d.spiceLevel <= 1 },
  { keys: ['sweet', 'dessert', 'sugar'], test: (d) => ['desserts'].includes(d.category) },
  { keys: ['vegetarian', 'veg', 'paneer'], test: (d) => d.veg },
  { keys: ['protein', 'chicken', 'fish', 'prawn', 'mutton', 'lamb'], test: (d) => !d.veg },
  { keys: ['healthy', 'light', 'low calorie'], test: (d) => d.spiceLevel <= 1 && d.price <= 400 },
  { keys: ['bestseller', 'popular', 'famous', 'top'], test: (d) => !!d.bestseller },
  { keys: ['cheap', 'under 400', 'budget'], test: (d) => d.price <= 400 },
];

/* ---------------- filters ---------------- */

export interface FilterDef {
  id: string;
  label: string;
  test: (d: Dish) => boolean;
}

export const filters: FilterDef[] = [
  { id: 'veg', label: 'VEGETARIAN', test: (d) => d.veg },
  { id: 'nonveg', label: 'NON-VEG', test: (d) => !d.veg },
  { id: 'spicy', label: 'SPICY', test: (d) => d.spiceLevel >= 2 },
  { id: 'mild', label: 'MILD', test: (d) => d.spiceLevel <= 1 },
  { id: 'best', label: 'BESTSELLER', test: (d) => !!d.bestseller },
  { id: 'under400', label: 'UNDER ₹400', test: (d) => d.price <= 400 },
  { id: 'special', label: "CHEF'S SPECIAL", test: (d) => d.category === 'specials' || !!d.bestseller },
];

/* ---------------- customizations ---------------- */

export interface OptionGroup {
  id: string;
  label: string;
  required?: boolean;
  multi?: boolean;
  choices: Array<{ id: string; label: string; delta: number }>;
}

const SIZE_GROUP: OptionGroup = {
  id: 'size',
  label: 'SIZE',
  required: true,
  choices: [
    { id: 'reg', label: 'Regular', delta: 0 },
    { id: 'med', label: 'Medium', delta: 120 },
    { id: 'lg', label: 'Large', delta: 240 },
  ],
};

const CRUST_GROUP: OptionGroup = {
  id: 'crust',
  label: 'CRUST',
  required: true,
  choices: [
    { id: 'classic', label: 'Classic', delta: 0 },
    { id: 'thin', label: 'Thin', delta: 40 },
    { id: 'burst', label: 'Cheese Burst', delta: 90 },
  ],
};

const TOPPINGS_GROUP: OptionGroup = {
  id: 'toppings',
  label: 'TOPPINGS',
  multi: true,
  choices: [
    { id: 'paneer', label: 'Paneer', delta: 60 },
    { id: 'olives', label: 'Olives', delta: 40 },
    { id: 'jalapeno', label: 'Jalapeño', delta: 40 },
    { id: 'mushroom', label: 'Mushroom', delta: 50 },
    { id: 'corn', label: 'Corn', delta: 40 },
  ],
};

const EXTRAS_GROUP: OptionGroup = {
  id: 'extras',
  label: 'EXTRAS',
  multi: true,
  choices: [
    { id: 'cheese', label: 'Extra Cheese', delta: 70 },
    { id: 'sauce', label: 'Extra Sauce', delta: 30 },
    { id: 'raita', label: 'Raita', delta: 60 },
    { id: 'salad', label: 'House Salad', delta: 80 },
  ],
};

const SPICE_GROUP: OptionGroup = {
  id: 'spice',
  label: 'SPICE LEVEL',
  required: true,
  choices: [
    { id: 'mild', label: 'Mild', delta: 0 },
    { id: 'medium', label: 'Medium', delta: 0 },
    { id: 'hot', label: "Chef's Hot", delta: 0 },
  ],
};

const SWEETNESS: OptionGroup = {
  id: 'sweetness',
  label: 'SWEETNESS',
  required: true,
  choices: [
    { id: 'full', label: 'Regular Sweet', delta: 0 },
    { id: 'half', label: 'Half Sweet', delta: 0 },
    { id: 'none', label: 'No Sugar', delta: 0 },
  ],
};

const ICE_GROUP: OptionGroup = {
  id: 'ice',
  label: 'ICE',
  required: true,
  choices: [
    { id: 'regular', label: 'Regular Ice', delta: 0 },
    { id: 'less', label: 'Less Ice', delta: 0 },
    { id: 'none', label: 'No Ice', delta: 0 },
  ],
};

const customizationMap: Record<string, OptionGroup[]> = {
  pizza: [SIZE_GROUP, CRUST_GROUP, TOPPINGS_GROUP],
  pasta: [SIZE_GROUP, EXTRAS_GROUP],
  burgers: [EXTRAS_GROUP],
  sandwiches: [EXTRAS_GROUP],
  biryani: [SPICE_GROUP, EXTRAS_GROUP],
  'north-indian': [SPICE_GROUP, EXTRAS_GROUP],
  indian: [SPICE_GROUP, EXTRAS_GROUP],
  'main-course': [SPICE_GROUP, EXTRAS_GROUP],
  'south-indian': [SPICE_GROUP],
  tandoor: [SPICE_GROUP],
  grill: [SPICE_GROUP],
  beverages: [ICE_GROUP, SWEETNESS],
  coffee: [SWEETNESS],
  mocktails: [ICE_GROUP, SWEETNESS],
  desserts: [],
};

export const customizationsFor = (d: Dish): OptionGroup[] => customizationMap[d.category] ?? [];

/* ---------------- order tracking ---------------- */

export const ORDER_STAGES = [
  { id: 'placed', label: 'ORDER PLACED', sub: 'We have your order' },
  { id: 'accepted', label: 'KITCHEN ACCEPTED', sub: 'The pass has it' },
  { id: 'preparing', label: 'PREPARING', sub: 'Your food is being prepared' },
  { id: 'packed', label: 'PACKED', sub: 'Boxed with care' },
  { id: 'out', label: 'OUT FOR DELIVERY', sub: 'On the way to you' },
  { id: 'arriving', label: 'ARRIVING', sub: 'Almost at your door' },
  { id: 'delivered', label: 'DELIVERED', sub: 'Enjoy. Earned points added.' },
];

/* ---------------- pairings ---------------- */

const pairingRules: Array<{ cats: string[]; picks: string[] }> = [
  { cats: ['biryani'], picks: ['in-1', 'td-4', 'bv-2', 'ds-1'] },
  { cats: ['tandoor', 'grill'], picks: ['td-1', 'si-2', 'bv-1', 'ds-3'] },
  { cats: ['pizza', 'pasta', 'italian'], picks: ['it-1', 'co-2', 'bv-3', 'ds-2'] },
  { cats: ['burgers', 'sandwiches'], picks: ['bg-2', 'sd-1', 'bv-2', 'ds-4'] },
  { cats: ['north-indian', 'indian', 'main-course'], picks: ['ni-2', 'td-3', 'bv-2', 'ds-1'] },
  { cats: ['south-indian'], picks: ['si-2', 'st-1', 'cf-2', 'ds-2'] },
  { cats: ['asian', 'chinese'], picks: ['as-3', 'ch-3', 'mk-1', 'ds-3'] },
  { cats: ['starters'], picks: ['by-1', 'bv-2', 'ds-1'] },
  { cats: ['desserts'], picks: ['cf-1', 'mk-2'] },
  { cats: ['beverages', 'coffee', 'mocktails'], picks: ['ds-1', 'st-1'] },
];

export const pairingsFor = (d: Dish, all: Dish[]): Dish[] => {
  const rule = pairingRules.find((r) => r.cats.includes(d.category));
  const ids = rule?.picks ?? ['by-1', 'td-1', 'ds-1'];
  return ids.filter((id) => id !== d.id).map((id) => all.find((x) => x.id === id)).filter(Boolean) as Dish[];
};

/* ---------------- offers ---------------- */

export interface Offer {
  id: string;
  title: string;
  sub: string;
  code: string;
  value: string;
  locations?: string[]; // undefined = all
}

export const offers: Offer[] = [
  { id: 'first', title: 'FIRST ORDER', sub: 'Welcome to the table', code: 'GHARELU10', value: '10% OFF' },
  { id: 'lunch', title: 'LUNCH SPECIAL', sub: 'Weekdays · 12:00–15:00', code: 'LUNCH25', value: '₹250 OFF', locations: ['indiranagar', 'koramangala'] },
  { id: 'weekday', title: 'WEEKDAY DINING', sub: 'Mon–Thu, any hour', code: 'MIDWEEK', value: '15% OFF' },
  { id: 'family', title: 'FAMILY COMBO', sub: 'Orders above ₹1,499', code: 'FAMILY', value: 'FREE DESSERT' },
  { id: 'birthday', title: 'BIRTHDAY TABLE', sub: 'Show your ID, dessert is on us', code: 'BIRTHDAY', value: 'FREE DESSERT' },
  { id: 'member', title: 'MEMBER EXCLUSIVE', sub: 'Signature tier and above', code: 'INNER', value: '20% OFF', locations: ['indiranagar'] },
];

export const offersFor = (locationId: string | null) =>
  offers.filter((o) => !o.locations || !locationId || o.locations.includes(locationId));

/* ---------------- loyalty ---------------- */

export const TIERS = [
  { id: 'welcome', name: 'WELCOME', from: 0, perks: ['Earn 1 point per ₹10', 'Birthday dessert'] },
  { id: 'insider', name: 'INSIDER', from: 500, perks: ['5% back in points', 'Priority reservations', 'Member offers'] },
  { id: 'signature', name: 'SIGNATURE', from: 2000, perks: ['10% back in points', 'Early menu access', 'Complimentary welcome drink'] },
  { id: 'founders', name: 'FOUNDERS', from: 5000, perks: ['15% back in points', "Chef's table invitations", 'Founding member events'] },
];

export const rewards = [
  { id: 'r1', name: 'Welcome Drink', cost: 300 },
  { id: 'r2', name: 'Dessert on the House', cost: 500 },
  { id: 'r3', name: '₹300 Off Any Order', cost: 800 },
  { id: 'r4', name: 'Priority Table', cost: 1200 },
  { id: 'r5', name: "Chef's Tasting for Two", cost: 4000 },
];

/* ---------------- discover ---------------- */

export const chefStory = {
  name: 'Chef Aarav Menon',
  role: 'HEAD CHEF & FOUNDER',
  image: 'chef-04',
  story:
    'Trained between Delhi and Copenhagen, Aarav opened Gharelu with one tandoor and a notebook of family recipes. He still writes the menu by hand every Monday.',
  specialty: 'Dum cooking & charcoal',
  favorite: 'Kasundi Fish Tikka',
};

export const foodStories = [
  { id: 's1', title: 'WHY OUR BIRYANI TAKES 8 HOURS', image: 'in-03', tag: 'THE CRAFT', steps: ['24-hour marination', 'Sealed with dough', 'Dum over slow coal', 'Opened at your table'] },
  { id: 's2', title: '800 DEGREES OF CHARCOAL', image: 'fire-01', tag: 'THE FIRE', steps: ['Natural lump coal', 'No gas, ever', 'Rest before serving', 'Finished with ghee'] },
  { id: 's3', title: 'THE DOSA THAT FERMENTS OVERNIGHT', image: 'in-24', tag: 'THE PATIENCE', steps: ['Rice & urad ground at dawn', 'Fermented 14 hours', 'Cast-iron heat', 'Ghee from Coorg'] },
];

export const events = [
  { id: 'e1', title: "CHEF'S TABLE", date: 'Every Saturday', time: '20:00', location: 'Indiranagar', seats: 8, price: 2400, image: 'chef-05', desc: 'Seven courses served by the chef, at the pass.' },
  { id: 'e2', title: 'TASTING NIGHT', date: 'Last Friday monthly', time: '19:30', location: 'Koramangala', seats: 20, price: 1500, image: 'int-09', desc: 'Six plates, three pours, one long table.' },
  { id: 'e3', title: 'LIVE MUSIC FRIDAYS', date: 'Every Friday', time: '21:00', location: 'Indiranagar', seats: 60, price: 0, image: 'int-10', desc: 'Acoustic sets, late kitchen, no cover.' },
];

export const timeSlots = [
  ...['12:00', '12:30', '13:00', '13:30', '14:00'].map((t) => ({ t, meal: 'Lunch' })),
  ...['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((t) => ({ t, meal: 'Dinner' })),
];

/** deterministic pseudo-availability so slots feel real but stable */
export const slotStatus = (date: string, time: string): 'available' | 'limited' | 'unavailable' => {
  const h = [...(date + time)].reduce((n, c) => n + c.charCodeAt(0), 0);
  const v = h % 10;
  if (v < 2) return 'unavailable';
  if (v < 5) return 'limited';
  return 'available';
};

export const hourLabel = () => {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 16) return 'GOOD AFTERNOON';
  if (h < 21) return 'GOOD EVENING';
  return 'GOOD NIGHT';
};
