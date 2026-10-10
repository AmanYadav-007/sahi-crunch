import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, safeUser, clearAuthCookie } from '@/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return current user
    const user = await requireAuth(req, res);
    if (!user) return;
    return res.status(200).json({ user: safeUser(user) });
  }

  if (req.method === 'DELETE') {
    // Logout
    clearAuthCookie(res);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
