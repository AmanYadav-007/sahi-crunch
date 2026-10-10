import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/auth';
import { getLoyalty } from '@/server/db';
import { tierOf } from '@/store';

const TIERS = [
  { name: 'Makhana Rookie', minPoints: 0, discount: 0, color: '#9ca3af' },
  { name: 'Crunch Insider', minPoints: 500, discount: 5, color: '#D48924' },
  { name: 'Bhopal Legend', minPoints: 2000, discount: 10, color: '#681121' },
  { name: 'Sahi VIP', minPoints: 5000, discount: 15, color: '#1a0a0e' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const loyalty = getLoyalty(user.id);
  const points = loyalty?.points ?? 0;
  const tierIndex = tierOf(points);
  const tier = TIERS[tierIndex];
  const nextTier = TIERS[tierIndex + 1] ?? null;

  return res.status(200).json({
    points,
    tier,
    nextTier,
    history: loyalty?.history ?? [],
    progressToNext: nextTier ? Math.min(100, Math.round(((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)) : 100,
  });
}
