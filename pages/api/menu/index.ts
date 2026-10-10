import type { NextApiRequest, NextApiResponse } from 'next';
import { dishes } from '@/data/menu';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const { category, location, q } = req.query as Record<string, string>;

  let result = [...dishes];

  if (location) {
    result = result.filter((d) => d.branchAvailability.includes(location));
  }

  if (category && category !== 'all') {
    result = result.filter((d) => d.category === category);
  }

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower) ||
        d.ingredients.some((i) => i.toLowerCase().includes(lower))
    );
  }

  return res.status(200).json({ dishes: result });
}
