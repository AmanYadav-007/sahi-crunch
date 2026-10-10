import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, safeUser } from '@/server/auth';
import { updateUser } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    return res.status(200).json({ user: safeUser(user) });
  }

  if (req.method === 'PATCH') {
    const { name, email, vegMode, addresses } = req.body ?? {};
    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name;
    if (email !== undefined) patch.email = email;
    if (vegMode !== undefined) patch.vegMode = vegMode;
    if (addresses !== undefined) patch.addresses = addresses;

    const updated = updateUser(user.id, patch);
    if (!updated) return res.status(500).json({ error: 'Failed to update profile.' });
    return res.status(200).json({ user: safeUser(updated) });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
