export interface Location {
  id: string;
  city: string;
  area: string;
  country: string;
  coords: [number, number]; // [lon, lat]
  status: 'open' | 'opening' | 'future';
  tagline: string;
  address: string;
  phone: string;
  hours: string;
  delivery: boolean;
  mapUrl: string;
  openingDate?: string;
}

export const locations: Location[] = [
  {
    id: 'bhopal-main',
    city: 'Bhopal',
    area: 'Arera Colony',
    country: 'India',
    coords: [77.4977, 23.2280],
    status: 'open',
    tagline: 'The home kitchen. Small-batch, fresh, WhatsApp-first.',
    address: 'E-3 Arera Colony, Bhopal 462016, Madhya Pradesh',
    phone: '+91 98xxx xxxxx',
    hours: 'Order by 12pm for same-day delivery · Mon–Sat',
    delivery: true,
    mapUrl: 'https://maps.google.com/?q=Arera+Colony+Bhopal',
  },
  {
    id: 'bhopal-kolar',
    city: 'Bhopal',
    area: 'Kolar Road',
    country: 'India',
    coords: [77.4553, 23.1844],
    status: 'opening',
    tagline: 'Second micro-kitchen. Coming Month 3.',
    address: 'Kolar Road, Bhopal, Madhya Pradesh',
    phone: '+91 98xxx xxxxx',
    hours: 'Opening Month 3',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Kolar+Road+Bhopal',
    openingDate: 'Month 3',
  },
  {
    id: 'bhopal-shahpura',
    city: 'Bhopal',
    area: 'Shahpura',
    country: 'India',
    coords: [77.4671, 23.1950],
    status: 'future',
    tagline: 'Third cluster. Demand-gated expansion.',
    address: 'Shahpura, Bhopal, Madhya Pradesh',
    phone: 'To be announced',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Shahpura+Bhopal',
    openingDate: 'Month 6',
  },
  {
    id: 'indore',
    city: 'Indore',
    area: 'Vijay Nagar',
    country: 'India',
    coords: [75.8869, 22.7500],
    status: 'future',
    tagline: 'Madhya Pradesh\'s snack capital. The next frontier.',
    address: 'Vijay Nagar, Indore, Madhya Pradesh',
    phone: 'To be announced',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Vijay+Nagar+Indore',
    openingDate: '2025',
  },
];

export const hub = locations[0];
