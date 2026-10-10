/**
 * auth.ts — JWT authentication helpers for Sahi Crunch
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { findUserById, type DBUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'sahi-crunch-super-secret-jwt-key-2024-bhopal';
const COOKIE_NAME = 'sc_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/* ─────────────── Password Helpers ─────────────── */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ─────────────── JWT Helpers ─────────────── */

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/* ─────────────── Cookie Helpers ─────────────── */

export function setAuthCookie(res: NextApiResponse, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax${secure}`
  );
}

export function clearAuthCookie(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`
  );
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  // 1. Try cookie
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);
  // 2. Try Authorization header
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

/* ─────────────── Auth Middleware ─────────────── */

export interface AuthedRequest extends NextApiRequest {
  user: DBUser;
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DBUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated. Please login.' });
    return null;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired session. Please login again.' });
    return null;
  }
  const user = findUserById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User not found.' });
    return null;
  }
  return user;
}

/* ─────────────── Safe User (strip passwordHash) ─────────────── */

export function safeUser(user: DBUser) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}
