import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/auth';
import { getReservationsByUser, createReservation, cancelReservation } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const reservations = getReservationsByUser(user.id);
    return res.status(200).json({ reservations });
  }

  if (req.method === 'POST') {
    const { locationId, date, time, guests, notes } = req.body ?? {};
    if (!locationId) return res.status(400).json({ error: 'Location required.' });
    if (!date) return res.status(400).json({ error: 'Date required.' });
    if (!time) return res.status(400).json({ error: 'Time required.' });
    if (!guests || guests < 1) return res.status(400).json({ error: 'Number of guests required.' });

    const reservation = createReservation({ userId: user.id, locationId, date, time, guests, notes });
    return res.status(201).json({ reservation });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {};
    if (!id) return res.status(400).json({ error: 'Reservation ID required.' });
    const ok = cancelReservation(id, user.id);
    if (!ok) return res.status(404).json({ error: 'Reservation not found.' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
