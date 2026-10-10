import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/auth';
import { getOrdersByUser, createOrder } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const orders = getOrdersByUser(user.id);
    return res.status(200).json({ orders });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body?.lines || !Array.isArray(body.lines) || body.lines.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (!body.locationId) return res.status(400).json({ error: 'Location is required.' });
    if (!body.type) return res.status(400).json({ error: 'Order type is required.' });
    if (body.type === 'delivery' && !body.address?.trim()) {
      return res.status(400).json({ error: 'Delivery address is required.' });
    }

    const pointsEarned = Math.round(body.total / 10);

    const order = createOrder({
      userId: user.id,
      type: body.type,
      locationId: body.locationId,
      lines: body.lines,
      subtotal: body.subtotal,
      tax: body.tax,
      discount: body.discount,
      fee: body.fee,
      total: body.total,
      address: body.address,
      eta: body.type === 'delivery' ? '10–15 mins' : '10 mins',
      pointsEarned,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod || 'upi',
    });

    return res.status(201).json({ order });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
