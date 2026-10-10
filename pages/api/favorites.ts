import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/auth';
import { getFavorites, toggleFavorite } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const dishIds = getFavorites(user.id);
    return res.status(200).json({ dishIds });
  }

  if (req.method === 'POST') {
    const { dishId } = req.body ?? {};
    if (!dishId) return res.status(400).json({ error: 'dishId is required.' });
    const dishIds = toggleFavorite(user.id, dishId);
    return res.status(200).json({ dishIds });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
