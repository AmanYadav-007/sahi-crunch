export type SpiceLevel = 0 | 1 | 2 | 3;

export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  dietaryTags: string[];
  spiceLevel: SpiceLevel;
  veg: boolean;
  bestseller?: boolean;
  available: boolean;
  branchAvailability: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  eyebrow: string;
  line: string;
  archetype: 'plate' | 'grill' | 'bowl' | 'round' | 'glass' | 'cup' | 'dessert';
  tint: string;
  fire?: boolean;
  smoke?: boolean;
}

export const categories: MenuCategory[] = [
  { id: 'starters', name: 'STARTERS', eyebrow: 'Chapter 01', line: 'Small plates. First impressions.', archetype: 'plate', tint: '#e6a756' },
  { id: 'indian', name: 'INDIAN', eyebrow: 'Chapter 02', line: 'The mother cuisine of this house.', archetype: 'bowl', tint: '#e0862f' },
  { id: 'asian', name: 'ASIAN', eyebrow: 'Chapter 03', line: 'Fast fire, clean heat, bright herbs.', archetype: 'bowl', tint: '#d9b26a' },
  { id: 'continental', name: 'CONTINENTAL', eyebrow: 'Chapter 04', line: 'Quiet technique on honest produce.', archetype: 'plate', tint: '#e8c9a0' },
  { id: 'north-indian', name: 'NORTH INDIAN', eyebrow: 'Chapter 05', line: 'Slow gravies, copper pots, patience.', archetype: 'bowl', tint: '#d97b2c' },
  { id: 'south-indian', name: 'SOUTH INDIAN', eyebrow: 'Chapter 06', line: 'Coconut, curry leaf, crackling oil.', archetype: 'round', tint: '#e2b558' },
  { id: 'chinese', name: 'CHINESE', eyebrow: 'Chapter 07', line: 'Wok breath and silk sauces.', archetype: 'bowl', tint: '#c96a3a' },
  { id: 'italian', name: 'ITALIAN', eyebrow: 'Chapter 08', line: 'Flour, olive oil, restraint.', archetype: 'round', tint: '#dba94f' },
  { id: 'pizza', name: 'PIZZA', eyebrow: 'Chapter 09', line: 'Stone-deck heat, 400 degrees.', archetype: 'round', tint: '#e07b3a', fire: true },
  { id: 'pasta', name: 'PASTA', eyebrow: 'Chapter 10', line: 'Rolled at dawn, finished to order.', archetype: 'plate', tint: '#e3b968' },
  { id: 'burgers', name: 'BURGERS', eyebrow: 'Chapter 11', line: 'Pressed, stacked, unapologetic.', archetype: 'plate', tint: '#cf8b4a' },
  { id: 'sandwiches', name: 'SANDWICHES', eyebrow: 'Chapter 12', line: 'Grilled until the bread sings.', archetype: 'plate', tint: '#d9a05b' },
  { id: 'tandoor', name: 'TANDOOR', eyebrow: 'Chapter 13', line: 'Eight hundred degrees of charcoal.', archetype: 'grill', tint: '#ff7a33', fire: true, smoke: true },
  { id: 'grill', name: 'GRILL', eyebrow: 'Chapter 14', line: 'Marks of fire, rest of the craft.', archetype: 'grill', tint: '#ff8c42', fire: true, smoke: true },
  { id: 'main-course', name: 'MAIN COURSE', eyebrow: 'Chapter 15', line: 'The centre of the table.', archetype: 'bowl', tint: '#e0913d' },
  { id: 'biryani', name: 'BIRYANI', eyebrow: 'Chapter 16', line: 'Sealed with dough. Opened with awe.', archetype: 'bowl', tint: '#e6a756', smoke: true },
  { id: 'desserts', name: 'DESSERTS', eyebrow: 'Chapter 17', line: 'The last word, said softly.', archetype: 'dessert', tint: '#e9b8b0' },
  { id: 'beverages', name: 'BEVERAGES', eyebrow: 'Chapter 18', line: 'Cold, bright, alive.', archetype: 'glass', tint: '#9fc0c9' },
  { id: 'coffee', name: 'COFFEE', eyebrow: 'Chapter 19', line: 'Roasted for this room only.', archetype: 'cup', tint: '#d3a06a' },
  { id: 'mocktails', name: 'MOCKTAILS', eyebrow: 'Chapter 20', line: 'Botanicals without the burn.', archetype: 'glass', tint: '#a8c6a0' },
  { id: 'specials', name: 'SPECIALS', eyebrow: 'Chapter 21', line: 'Off-menu, on request, while it lasts.', archetype: 'plate', tint: '#c9a24b' },
];

const ALL = ['indiranagar', 'koramangala'];

const d = (
  id: string,
  name: string,
  category: string,
  price: number,
  image: string,
  description: string,
  ingredients: string[],
  opts: Partial<Dish> = {}
): Dish => ({
  id,
  name,
  category,
  price,
  image,
  description,
  ingredients,
  dietaryTags: opts.dietaryTags ?? [],
  spiceLevel: (opts.spiceLevel ?? 1) as SpiceLevel,
  veg: opts.veg ?? true,
  bestseller: opts.bestseller ?? false,
  available: opts.available ?? true,
  branchAvailability: opts.branchAvailability ?? ALL,
});

export const dishes: Dish[] = [
  // STARTERS
  d('st-1', 'Truffle Khari Fingers', 'starters', 380, 'prep-05', 'Puff pastry fingers brushed with truffle butter and sea salt.', ['puff pastry', 'truffle butter', 'sea salt'], { veg: true, spiceLevel: 0 }),
  d('st-2', 'Kurkuri Bhindi Crisps', 'starters', 360, 'in-33', 'Lace-thin crisp okra dusted with amchur, ajwain and mint chutney.', ['okra', 'ajwain', 'amchur', 'chickpea flour'], { veg: true, spiceLevel: 2, bestseller: true }),
  d('st-3', 'Burnt Garlic Edamame', 'starters', 320, 'as-03', 'Wok-tossed pods, chilli oil, smoked sea salt.', ['edamame', 'burnt garlic', 'chilli oil'], { veg: true, spiceLevel: 2 }),

  // INDIAN
  d('in-1', 'House Dal Gharelu', 'indian', 420, 'in-19', 'Twelve-hour black lentils finished with white butter and smoke.', ['urad dal', 'tomato', 'ginger', 'white butter'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('in-2', 'Kadai Paneer Leher', 'indian', 480, 'in-02', 'Cottage cheese, cracked peppers, kadai masala ground daily.', ['paneer', 'bell pepper', 'kadai masala'], { veg: true, spiceLevel: 2 }),
  d('in-3', 'Dum Aloo Kashmiri', 'indian', 440, 'in-28', 'Slow-simmered baby potatoes, fennel yogurt gravy, dry ginger.', ['baby potatoes', 'fennel', 'kashmiri chilli', 'yogurt'], { veg: true, spiceLevel: 2 }),

  // ASIAN
  d('as-1', 'Crispy Lotus & Water Chestnut', 'asian', 460, 'lux-05', 'Flash-fried lotus roots, sweet chilli soy, scallion crunch.', ['lotus root', 'water chestnut', 'scallion', 'chilli soy'], { veg: true, spiceLevel: 2 }),
  d('as-2', 'Lemongrass Tofu Bao', 'asian', 380, 'as-04', 'Steamed bao, sticky tofu, pickled cucumber.', ['tofu', 'bao', 'lemongrass'], { veg: true, spiceLevel: 1 }),
  d('as-3', 'Wok Hei Noodles', 'asian', 440, 'as-05', 'Hakka noodles thrown over open flame.', ['hakka noodles', 'cabbage', 'soy', 'wok hei'], { veg: true, spiceLevel: 2 }),

  // CONTINENTAL
  d('co-1', 'Stuffed Portobello Melt', 'continental', 540, 'dish-03', 'Baked jumbo mushroom, creamed spinach, herb crust, balsamic drizzle.', ['portobello', 'spinach', 'parmesan', 'herbs'], { veg: true, spiceLevel: 0 }),
  d('co-2', 'Truffle Mushroom Steak', 'continental', 580, 'craft-06', 'Thick-cut portobello, peppercorn cream, confit potato.', ['portobello', 'truffle', 'peppercorn'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('co-3', 'Pan-Roasted Cottage Millefeuille', 'continental', 560, 'dish-01', 'Layered cottage cheese, sun-dried tomato pesto, charred asparagus.', ['cottage cheese', 'sun-dried tomato', 'pesto', 'asparagus'], { veg: true, spiceLevel: 0 }),

  // NORTH INDIAN
  d('ni-1', 'Paneer Butter Masala 1977', 'north-indian', 520, 'in-18', 'The original Delhi recipe — rich cashew, vine tomato, kasuri methi.', ['paneer', 'tomato', 'cashew', 'kasuri methi'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('ni-2', 'Dal Makhani Noir', 'north-indian', 460, 'in-01', 'Black lentils held over fire for a full day.', ['urad dal', 'kidney beans', 'cream'], { veg: true, spiceLevel: 1 }),
  d('ni-3', 'Mathania Paneer Tikka Gravy', 'north-indian', 560, 'in-05', 'Rajasthani smoky gravy with Mathania chillies, desi ghee, roasted spices.', ['paneer', 'mathania chilli', 'ghee', 'coriander'], { veg: true, spiceLevel: 3 }),

  // SOUTH INDIAN
  d('si-1', 'Ghee Roast Masala Dosa', 'south-indian', 320, 'in-24', 'Fermented crepe, potato masala, three chutneys.', ['rice batter', 'urad dal', 'potato', 'ghee'], { veg: true, spiceLevel: 2, bestseller: true }),
  d('si-2', 'Filter Coffee Idli', 'south-indian', 280, 'in-31', 'Steamed rice cakes, podi, gingelly oil, brass tumbler of kaapi.', ['rice', 'urad dal', 'podi'], { veg: true, spiceLevel: 1 }),
  d('si-3', 'Chettinad Pepper Mushroom', 'south-indian', 460, 'in-16', 'Dry-roasted black pepper masala, button mushrooms, fresh curry leaves.', ['button mushroom', 'black pepper', 'curry leaf', 'shallots'], { veg: true, spiceLevel: 3 }),

  // CHINESE
  d('ch-1', 'Szechuan Lotus Stem', 'chinese', 420, 'in-12', 'Crisp lotus stem, dry red chilli, honey glaze.', ['lotus stem', 'szechuan pepper', 'honey'], { veg: true, spiceLevel: 3 }),
  d('ch-2', 'Exotic Veg Dim Sum Basket', 'chinese', 360, 'in-04', 'Crystal dumplings with water chestnut, edamame, bok choy, chilli-vinegar dip.', ['water chestnut', 'edamame', 'bok choy', 'sesame'], { veg: true, spiceLevel: 1 }),
  d('ch-3', 'Hot & Sour Silken Soup', 'chinese', 300, 'in-32', 'Black vinegar, white pepper, shiitake.', ['silken tofu', 'shiitake', 'black vinegar'], { veg: true, spiceLevel: 2 }),

  // ITALIAN
  d('it-1', 'Burrata & Peach', 'italian', 560, 'dish-10', 'Puglian burrata, charred peach, basil oil.', ['burrata', 'peach', 'basil oil'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('it-2', 'Saffron Risotto Milanese', 'italian', 680, 'dish-02', 'Creamy carnaroli rice, Kashmiri saffron threads, 24-month aged parmigiano.', ['carnaroli rice', 'saffron', 'parmigiano', 'butter'], { veg: true, spiceLevel: 0 }),
  d('it-3', 'Wild Mushroom Risotto', 'italian', 620, 'dish-09', 'Carnaroli, porcini stock, 24-month parmigiano.', ['carnaroli rice', 'porcini', 'parmigiano'], { veg: true, spiceLevel: 0 }),

  // PIZZA
  d('pz-1', 'Quattro Formaggi Bianca', 'pizza', 620, 'pizza-02', 'Four artisan cheeses, truffle honey drizzle, roasted garlic, fresh rosemary.', ['mozzarella', 'gorgonzola', 'fontina', 'parmigiano', 'truffle honey'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('pz-2', 'Margherita D.O.P.', 'pizza', 520, 'pizza-01', 'San Marzano, fior di latte, basil — 90 seconds of fire.', ['san marzano', 'fior di latte', 'basil'], { veg: true, spiceLevel: 0 }),
  d('pz-3', 'Tandoori Paneer Pizza', 'pizza', 590, 'pizza-03', 'Tandoori marinade, onion, coriander, mozzarella.', ['paneer', 'tandoori masala', 'mozzarella'], { veg: true, spiceLevel: 2 }),

  // PASTA
  d('pa-1', 'Cacio e Pepe', 'pasta', 540, 'dish-04', 'Tonnarelli, pecorino, cracked pepper — nothing else.', ['tonnarelli', 'pecorino romano', 'black pepper'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('pa-2', 'Truffle Aglio e Olio', 'pasta', 640, 'as-01', 'Slow confit garlic, peperoncino, summer truffle oil, fresh parsley.', ['spaghetti', 'garlic confit', 'peperoncino', 'truffle oil'], { veg: true, spiceLevel: 2 }),
  d('pa-3', 'Pomodoro & Burrata', 'pasta', 560, 'in-29', 'Slow tomato, torn burrata, olive oil.', ['tomato', 'burrata', 'olive oil'], { veg: true, spiceLevel: 1 }),

  // BURGERS
  d('bg-1', 'The Gharelu Herb Stack', 'burgers', 520, 'burger-02', 'Crispy spiced paneer patty, aged cheddar, caramelised onions, brioche.', ['paneer', 'aged cheddar', 'caramelised onions', 'house pickles'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('bg-2', 'Charcoal Veg Crunch Burger', 'burgers', 460, 'burger-01', 'Smoked vegetable medallion, tandoori slaw, charcoal black bun.', ['veggie patty', 'tandoori mayo', 'charcoal bun', 'slaw'], { veg: true, spiceLevel: 2 }),
  d('bg-3', 'Bombay Button Mushroom', 'burgers', 480, 'burger-04', 'Crisp mushroom patty, smoked cheese, chutney.', ['mushroom', 'smoked cheese', 'mint chutney'], { veg: true, spiceLevel: 2 }),

  // SANDWICHES
  d('sd-1', 'Truffle Grilled Cheese', 'sandwiches', 420, 'sand-01', 'Three cheeses, sourdough, truffle honey.', ['sourdough', 'gruyere', 'truffle honey'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('sd-2', 'Club Gharelu Garden', 'sandwiches', 420, 'sand-02', 'Triple-decker sourdough, avocado, grilled zucchini, cheddar, pesto mayo.', ['sourdough', 'avocado', 'zucchini', 'cheddar'], { veg: true, spiceLevel: 0 }),
  d('sd-3', 'Bombay Toastie', 'sandwiches', 340, 'in-34', 'Potato, cheese, green chutney, pressed hard.', ['potato', 'cheese', 'green chutney'], { veg: true, spiceLevel: 2 }),

  // TANDOOR
  d('td-1', 'Smoked Truffle Paneer', 'tandoor', 520, 'in-06', 'Cottage cheese kissed with oak smoke, truffle oil and charred herbs.', ['paneer', 'truffle oil', 'charred herbs', 'oak smoke'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('td-2', 'Kasundi Soya Chaap Tikka', 'tandoor', 480, 'fire-02', 'Charcoal-grilled soya chaap steeped in Bengal mustard and cold-pressed mustard oil.', ['soya chaap', 'kasundi mustard', 'mustard oil'], { veg: true, spiceLevel: 3 }),
  d('td-3', 'Malai Broccoli Char', 'tandoor', 490, 'in-11', 'Floret steeped in cream, green cardamom, roasted white pepper and mace.', ['broccoli', 'cream', 'cardamom', 'cheese'], { veg: true, spiceLevel: 1 }),
  d('td-4', 'Dahi Ke Sholay', 'tandoor', 460, 'in-15', 'Crisp golden rolls filled with hung curd, bell peppers, fresh herbs.', ['hung curd', 'coriander', 'bell pepper', 'spices'], { veg: true, spiceLevel: 2 }),

  // GRILL
  d('gr-1', 'Fire-Grilled Veg Platter', 'grill', 780, 'fire-01', 'Smoked paneer, spiced mushrooms, corn ribs, grilled peppers — built for two.', ['paneer', 'mushrooms', 'sweetcorn', 'bell pepper'], { veg: true, spiceLevel: 2, bestseller: true }),
  d('gr-2', 'Herb-Crusted Grilled Tofu', 'grill', 520, 'fire-03', 'Organic firm tofu, rosemary marinade, charred cipollini onions, lemon butter.', ['firm tofu', 'rosemary', 'charred onion', 'olive oil'], { veg: true, spiceLevel: 1 }),
  d('gr-3', 'Charred Corn & Halloumi', 'grill', 480, 'fire-04', 'Sweetcorn, halloumi, chilli-lime butter.', ['sweetcorn', 'halloumi', 'chilli lime'], { veg: true, spiceLevel: 2 }),

  // MAIN COURSE
  d('mc-1', 'Kashmiri Dum Kathal', 'main-course', 520, 'in-22', 'Tender baby jackfruit cooked on dum with Kashmiri chillies and whole spices.', ['raw jackfruit', 'kashmiri chilli', 'mustard oil', 'garam masala'], { veg: true, spiceLevel: 3 }),
  d('mc-2', 'Kerala Coconut Veg Stew', 'main-course', 480, 'in-20', 'Simmered garden vegetables, fresh coconut milk, green chilli, steamed appam.', ['coconut milk', 'carrots', 'beans', 'green chilli'], { veg: true, spiceLevel: 1, bestseller: true }),
  d('mc-3', 'Paneer Lababdar', 'main-course', 480, 'in-08', 'Silken gravy, crushed kasuri methi, cream swirl.', ['paneer', 'tomato gravy', 'cream'], { veg: true, spiceLevel: 2 }),

  // BIRYANI
  d('by-1', 'Dum Nizami Subz Biryani', 'biryani', 560, 'in-03', 'Sealed-pot aged basmati, saffron, seasonal vegetables, caramelized onions.', ['aged basmati', 'saffron', 'caramelized onion', 'seasonal vegetables'], { veg: true, spiceLevel: 2, bestseller: true }),
  d('by-2', 'Hyderabadi Soya Biryani', 'biryani', 520, 'in-07', 'Kachchi style marinated soya chunks, sealed dough pot, birista and mint.', ['soya chaap', 'basmati', 'birista', 'mint'], { veg: true, spiceLevel: 3 }),
  d('by-3', 'Subz Dum Biryani', 'biryani', 540, 'in-25', 'Seasonal vegetables, mint, fried cashew.', ['seasonal vegetables', 'mint', 'cashew'], { veg: true, spiceLevel: 2 }),

  // DESSERTS
  d('ds-1', 'Burnt Basque Cheesecake', 'desserts', 390, 'dessert-01', 'Caramelised top, molten centre, sea-salt caramel.', ['cream cheese', 'vanilla', 'sea salt'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('ds-2', 'Mishti Doi Panna Cotta', 'desserts', 340, 'dessert-02', 'Bengali curd sweet, set soft, jaggery crumble.', ['yoghurt', 'jaggery', 'cream'], { veg: true, spiceLevel: 0 }),
  d('ds-3', 'Chocolate Soil', 'desserts', 420, 'dessert-03', '70% ganache, malt soil, olive oil ice cream.', ['dark chocolate', 'malt', 'olive oil'], { veg: true, spiceLevel: 0 }),
  d('ds-4', 'Rose & Pistachio Falooda', 'desserts', 360, 'dessert-04', 'Vermicelli, basil seed, rabri, rose.', ['rabri', 'rose', 'pistachio'], { veg: true, spiceLevel: 0 }),

  // BEVERAGES
  d('bv-1', 'Smoked Old Fashioned (0%)', 'beverages', 420, 'lux-04', 'Smoked orange, bitter astringents, cold-brewed tea.', ['black tea', 'orange', 'smoke'], { veg: true, spiceLevel: 0 }),
  d('bv-2', 'Kokoma Colada', 'beverages', 340, 'drink-01', 'Coconut, pineapple, toasted kokum.', ['coconut', 'pineapple', 'kokum'], { veg: true, spiceLevel: 0 }),
  d('bv-3', 'Green Iced Tea', 'beverages', 260, 'coffee-03', 'Sencha, mint, lime, barely sweet.', ['sencha', 'mint', 'lime'], { veg: true, spiceLevel: 0 }),

  // COFFEE
  d('cf-1', 'Hub Single-Origin Flat White', 'coffee', 280, 'coffee-01', 'Chikmagalur beans, chocolate finish, micro-foam.', ['arabica', 'milk'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('cf-2', 'Filter Kaapi', 'coffee', 180, 'coffee-02', 'Decoction, hot milk, brass tumbler.', ['chicory', 'coffee', 'milk'], { veg: true, spiceLevel: 0 }),
  d('cf-3', 'Cold Brew Tonic', 'coffee', 320, 'drink-03', '18-hour cold brew, tonic, grapefruit peel.', ['cold brew', 'tonic', 'grapefruit'], { veg: true, spiceLevel: 0 }),

  // MOCKTAILS
  d('mk-1', 'Monsoon Leaf', 'mocktails', 340, 'drink-02', 'Basil, green apple, lime, soda over crushed ice.', ['basil', 'green apple', 'lime'], { veg: true, spiceLevel: 0, bestseller: true }),
  d('mk-2', 'Saffron Spritz (0%)', 'mocktails', 360, 'dessert-05', 'Saffron cordial, citrus, sparkling water.', ['saffron', 'citrus', 'sparkling water'], { veg: true, spiceLevel: 0 }),
  d('mk-3', 'Charred Pineapple Highball', 'mocktails', 340, 'craft-03', 'Grilled pineapple, chilli salt rim.', ['pineapple', 'chilli salt', 'soda'], { veg: true, spiceLevel: 1 }),

  // SPECIALS
  d('sp-1', "Chef's Table Smoked Jackfruit Shank", 'specials', 880, 'in-10', 'Slow-braised spiced kathal shank, saffron potato puree, truffle port jus.', ['tender jackfruit', 'saffron potato', 'truffle jus'], { veg: true, spiceLevel: 1, bestseller: true, branchAvailability: ['indiranagar'] }),
  d('sp-2', 'Whole Salt-Baked Portobello', 'specials', 920, 'lux-06', 'Salt-crusted whole portobello, shaved black truffle, burnt lemon — for the table.', ['portobello', 'black truffle', 'burnt lemon'], { veg: true, spiceLevel: 0, branchAvailability: ['indiranagar'] }),
  d('sp-3', 'Seasonal Tasting Flight', 'specials', 1450, 'dish-05', 'Seven vegetarian courses from the chef’s notebook.', ['seven courses', 'seasonal produce'], { veg: true, spiceLevel: 1, branchAvailability: ['indiranagar', 'koramangala'] }),
];

export const dishesByCategory = (categoryId: string) =>
  dishes.filter((x) => x.category === categoryId);

export const categoryById = (id: string) => categories.find((c) => c.id === id);

export const dishById = (id: string) => dishes.find((x) => x.id === id);
