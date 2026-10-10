import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findUserByEmail,
  findUserByPhone,
  createUser,
} from '@/server/db';
import {
  hashPassword,
  verifyPassword,
  signToken,
  setAuthCookie,
  safeUser,
} from '@/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, phone, email, password, mode } = req.body ?? {};

    /* ──── LOGIN ──── */
    if (mode === 'login') {
      if (!email && !phone) return res.status(400).json({ error: 'Email or phone required.' });
      if (!password) return res.status(400).json({ error: 'Password required.' });

      const user = email
        ? findUserByEmail(email)
        : findUserByPhone(phone);

      if (!user) return res.status(401).json({ error: 'No account found. Please register.' });

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Incorrect password.' });

      const token = signToken({ userId: user.id, email: user.email, name: user.name });
      setAuthCookie(res, token);
      return res.status(200).json({ user: safeUser(user), token });
    }

    /* ──── REGISTER ──── */
    if (mode === 'register') {
      if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
      if (!phone?.trim()) return res.status(400).json({ error: 'Phone number is required.' });
      if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });
      if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

      if (findUserByEmail(email)) return res.status(409).json({ error: 'An account with this email already exists.' });
      if (findUserByPhone(phone)) return res.status(409).json({ error: 'An account with this phone already exists.' });

      const passwordHash = await hashPassword(password);
      const user = createUser({ name, phone, email, passwordHash, addresses: [], vegMode: false });

      const token = signToken({ userId: user.id, email: user.email, name: user.name });
      setAuthCookie(res, token);
      return res.status(201).json({ user: safeUser(user), token });
    }

    return res.status(400).json({ error: 'Invalid mode. Use "login" or "register".' });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
