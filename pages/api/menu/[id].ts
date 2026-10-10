import type { NextApiRequest, NextApiResponse } from 'next';
import { dishById } from '@/data/menu';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  const { id } = req.query as { id: string };
  const dish = dishById(id);
  if (!dish) return res.status(404).json({ error: 'Dish not found.' });
  return res.status(200).json({ dish });
}
