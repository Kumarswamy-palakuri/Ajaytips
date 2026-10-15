import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ── Generate signed tokens ────────────────────────────────────────────────────
export const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

// ── Verify tokens ─────────────────────────────────────────────────────────────
export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// ── Hashing for opaque tokens ─────────────────────────────────────────────────
export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateOpaqueToken = () => crypto.randomBytes(32).toString('hex');

// ── Cookie config ─────────────────────────────────────────────────────────────
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
