import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/auth';
import { getOrderById, updateOrderStatus } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const order = getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.userId !== user.id) return res.status(403).json({ error: 'Access denied.' });
    return res.status(200).json({ order });
  }

  if (req.method === 'PATCH') {
    const order = getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.userId !== user.id) return res.status(403).json({ error: 'Access denied.' });

    const { status } = req.body ?? {};
    if (typeof status !== 'number') return res.status(400).json({ error: 'Status must be a number.' });
    const updated = updateOrderStatus(id, status);
    return res.status(200).json({ order: updated });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
