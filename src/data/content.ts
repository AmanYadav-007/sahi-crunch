export interface Signature {
  no: string;
  id: string;
  dishId: string;
  title: string;
  sub: string;
  story: string;
  image: string;
}

export const signatures: Signature[] = [
  {
    no: '01',
    id: 'sig-biryani',
    dishId: 'by-1',
    title: 'Dum Nizami Biryani',
    sub: 'Sealed with dough. Opened at the table.',
    story:
      'Aged basmati rested overnight, mutton marinated for twenty-four hours, saffron drawn in warm milk. The handi is sealed with atta and opened only in front of you — the first breath is the recipe.',
    image: 'in-02',
  },
  {
    no: '02',
    id: 'sig-grill',
    dishId: 'gr-1',
    title: 'Fire-Grilled Platter',
    sub: 'Eight hundred degrees of charcoal.',
    story:
      'Ribs glazed with jaggery and smoked chilli, lamb chops rested in rosemary butter, chicken thigh brined in buttermilk. Built for two, argued over by three.',
    image: 'fire-01',
  },
  {
    no: '03',
    id: 'sig-pasta',
    dishId: 'pa-2',
    title: 'Lobster Aglio',
    sub: 'The sea, finished in garlic butter.',
    story:
      'Half a lobster, garlic cooked soft in olive oil, a pinch of Calabrian chilli, angel hair lifted straight from the pan. Nothing on the plate that does not belong.',
    image: 'dish-03',
  },
  {
    no: '04',
    id: 'sig-chef',
    dishId: 'sp-1',
    title: "Chef's Table Lamb Shank",
    sub: 'Twelve hours. One plate.',
    story:
      'Braised until the bone slides free, set on saffron potato with a port jus reduced through service. Available at the chef’s counter, Indiranagar only.',
    image: 'in-21',
  },
];

export const storyStages = [
  { no: '01', label: 'INGREDIENTS', text: 'It begins in the market — before the fire, before the knife.', image: 'prep-03' },
  { no: '02', label: 'PREPARATION', text: 'Hands, rhythm, repetition. The craft lives in the prep.', image: 'prep-04' },
  { no: '03', label: 'FIRE', text: 'Then heat. Charcoal, wok flame, the sound of the sear.', image: 'chef-04' },
  { no: '04', label: 'PLATE', text: 'Every plate is composed, not merely served.', image: 'chef-05' },
  { no: '05', label: 'TABLE', text: 'The room does the rest — light, sound, company.', image: 'int-07' },
  { no: '06', label: 'EXPERIENCE', text: 'And a memory leaves with you.', image: 'int-10' },
];

export const ingredientSwarm = [
  { name: 'BASIL', hint: 'picked at dawn' },
  { name: 'CHILLI', hint: 'Guntur heat' },
  { name: 'GARLIC', hint: 'roasted whole' },
  { name: 'GINGER', hint: 'young root' },
  { name: 'SAFFRON', hint: 'Kashmiri threads' },
  { name: 'TOMATO', hint: 'slow-confit' },
  { name: 'PEPPER', hint: 'Malabar coast' },
  { name: 'CORIANDER', hint: 'stems included' },
];

export interface Testimonial {
  quote: string;
  name: string;
  place: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'The biryani arrived sealed and the whole table went quiet. That is not a meal, that is theatre — and it tasted even better than it looked.',
    name: 'Ananya Menon',
    place: 'Bengaluru',
    rating: 5,
  },
  {
    quote:
      'I have eaten at chef’s counters in Tokyo and Copenhagen. The lamb shank at Gharelu belongs in that conversation.',
    name: 'Rohan Kapoor',
    place: 'Mumbai',
    rating: 5,
  },
  {
    quote:
      'They light the room like a film set and cook like your grandmother is watching. Impossible combination, perfectly done.',
    name: 'Sarah Whitfield',
    place: 'London',
    rating: 5,
  },
  {
    quote:
      'We booked for one hour and stayed four. The staff let us linger, the wine kept coming, nobody rushed a single course.',
    name: 'Karthik Iyer',
    place: 'Chennai',
    rating: 5,
  },
  {
    quote:
      'The truffle paneer is the only thing my vegetarian wife and I have ever agreed on ordering twice.',
    name: 'Devika Sharma',
    place: 'Dubai',
    rating: 5,
  },
];

export const socialGallery = [
  { image: 'int-09', caption: 'Sunday spread, Koramangala', tag: 'THE TABLE' },
  { image: 'chef-04', caption: 'Service, 21:40', tag: 'THE FIRE' },
  { image: 'dessert-01', caption: 'Caramel, mid-pour', tag: 'THE SWEET END' },
  { image: 'int-07', caption: 'Before doors open', tag: 'THE ROOM' },
  { image: 'prep-03', caption: 'Masala, ground at 6am', tag: 'THE PREP' },
  { image: 'drink-02', caption: 'Monsoon Leaf', tag: 'THE BAR' },
  { image: 'int-10', caption: 'Long table, longer night', tag: 'THE PEOPLE' },
  { image: 'fire-02', caption: 'Straight off the coals', tag: 'THE GRILL' },
  { image: 'coffee-01', caption: 'First pour', tag: 'THE MORNING' },
  { image: 'table-03', caption: 'Pairing flight', tag: 'THE PAIRING' },
];
