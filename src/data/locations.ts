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
    id: 'indiranagar',
    city: 'Bengaluru',
    area: 'Indiranagar',
    country: 'India',
    coords: [77.6408, 12.9784],
    status: 'open',
    tagline: 'The flagship room. Charcoal, candlelight and the full menu.',
    address: '12, 100 Feet Road, Indiranagar, Bengaluru 560038',
    phone: '+91 80 4567 8900',
    hours: 'Daily · 12:00–15:00 · 19:00–23:30',
    delivery: true,
    mapUrl: 'https://maps.google.com/?q=Indiranagar+100+Feet+Road+Bengaluru',
  },
  {
    id: 'koramangala',
    city: 'Bengaluru',
    area: 'Koramangala',
    country: 'India',
    coords: [77.6245, 12.9345],
    status: 'open',
    tagline: 'The louder sibling. Longer tables, later nights.',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    phone: '+91 80 4567 8901',
    hours: 'Daily · 12:00–15:00 · 19:00–00:00',
    delivery: true,
    mapUrl: 'https://maps.google.com/?q=Koramangala+80+Feet+Road+Bengaluru',
  },
  {
    id: 'panjim',
    city: 'Panjim',
    area: 'Miramar',
    country: 'India',
    coords: [73.8316, 15.4909],
    status: 'opening',
    tagline: 'A coastal room by the water. Opening soon.',
    address: 'Miramar Circle, Panjim, Goa 403001',
    phone: '+91 80 4567 8902',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Miramar+Panjim+Goa',
    openingDate: 'Soon',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    area: 'Marina',
    country: 'UAE',
    coords: [55.1402, 25.0772],
    status: 'future',
    tagline: 'The first table outside India.',
    address: 'Dubai Marina, Dubai, UAE',
    phone: 'To be announced',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Dubai+Marina',
    openingDate: '2027',
  },
  {
    id: 'london',
    city: 'London',
    area: 'Shoreditch',
    country: 'UK',
    coords: [-0.0759, 51.5255],
    status: 'future',
    tagline: 'East London, late kitchen, long tables.',
    address: 'Shoreditch, London, UK',
    phone: 'To be announced',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Shoreditch+London',
    openingDate: '2027',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    area: 'Tanjong Pagar',
    country: 'Singapore',
    coords: [103.8444, 1.2762],
    status: 'future',
    tagline: 'A small room with a very long waiting list.',
    address: 'Tanjong Pagar, Singapore',
    phone: 'To be announced',
    hours: 'To be announced',
    delivery: false,
    mapUrl: 'https://maps.google.com/?q=Tanjong+Pagar+Singapore',
    openingDate: '2028',
  },
];

export const hub = locations[0];
