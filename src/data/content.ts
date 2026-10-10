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
    id: 'sig-makhana',
    dishId: 'mk-1',
    title: 'Bhopali Masala Makhana',
    sub: 'Sahi Spice. Modern Crunch.',
    story:
      'Fox nuts sourced directly from Bihar farmgates, roasted in a convection deck oven — never fried. Tossed in a spice blend built on 78 years of Bhopali street-food memory: Ratlam masala, Chambal turmeric, a whisper of amchur. Every batch is made-to-order and shipped within 48 hours.',
    image: 'in-03',
  },
  {
    no: '02',
    id: 'sig-nankhatai',
    dishId: 'nk-1',
    title: 'Sahi Nankhatai',
    sub: 'Desi Ghee. Gram Flour. Pure Tradition.',
    story:
      'A recipe unchanged since historic Bhopal. Besan whisked with desi ghee from Chambal farms, sweetened with powdered sugar, spiced with green cardamom and a strand of saffron. Baked fresh every morning, stamped with the made-on date, and delivered within the day.',
    image: 'dessert-01',
  },
  {
    no: '03',
    id: 'sig-ratlam',
    dishId: 'nm-3',
    title: 'Ratlam Sev Deluxe',
    sub: 'Named after the city that perfected it.',
    story:
      'Ratlam has made its sev famous across Madhya Pradesh for over a century. Our version sources Ratlam red chillies directly from producers — bold, full-flavoured, and completely free of artificial colour or preservatives. The crunch that stays with you.',
    image: 'in-12',
  },
  {
    no: '04',
    id: 'sig-gift',
    dishId: 'gf-2',
    title: 'Sahi Snack Box — Grand',
    sub: 'The full Bhopal snacking story. Gift it.',
    story:
      'Every item in the Sahi Crunch lineup, assembled in a kraft box printed with the Bhopal Upper Lake skyline. A Sahi heritage motif runs across the closure. Fresh-made on the day of dispatch, never sitting in a warehouse. The only snack gift that tells a real story.',
    image: 'fire-01',
  },
];

export const storyStages = [
  { no: '01', label: 'FARM SOURCING', text: 'Direct from Bihar fox nut farms, Chambal cold-pressed oils, Ratlam spice producers. No middlemen.', image: 'prep-03' },
  { no: '02', label: 'SMALL-BATCH PREP', text: 'Batch-to-order. Never pre-made, never stored. Made the morning you order it.', image: 'prep-04' },
  { no: '03', label: 'PRECISION ROASTING', text: 'Convection deck oven at controlled temperature. The roast that replaces the fry.', image: 'chef-04' },
  { no: '04', label: 'QUALITY SEAL', text: 'Every pouch gets a made-on-date stamp and a QR code linking to the farm batch.', image: 'chef-05' },
  { no: '05', label: 'FRESH DELIVERY', text: 'Route-optimized morning and evening batches across Arera Colony, Kolar, Shahpura clusters.', image: 'int-07' },
  { no: '06', label: 'THE 48-HOUR PROMISE', text: 'Maximum 48 hours from roast to your table. That is our only SLA.', image: 'int-10' },
];
