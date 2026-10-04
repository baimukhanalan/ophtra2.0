import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { env } from '../config/env.ts';
import { HttpError } from './http.ts';

/**
 * Signed opaque tokens for the demo deployment.
 *
 * Format: base64url(payload).base64url(hmac). Stateless, tamper-evident and
 * expiring. In production this module is the single seam to replace with the
 * clinic's identity provider — nothing else in the codebase issues or verifies
 * credentials.
 */

export type TokenRole = 'patient' | 'admin';

export interface TokenPayload {
  role: TokenRole;
  /** Patient id, or the administrator login. */
  subject: string;
  /** Expiry, epoch milliseconds. */
  exp: number;
}

const TTL_MS = 1000 * 60 * 60 * 12;

const encode = (input: string) => Buffer.from(input, 'utf8').toString('base64url');
const decode = (input: string) => Buffer.from(input, 'base64url').toString('utf8');

const sign = (body: string): string =>
  createHmac('sha256', env.tokenSecret).update(body).digest('base64url');

export const issueToken = (role: TokenRole, subject: string): string => {
  const payload: TokenPayload = { role, subject, exp: Date.now() + TTL_MS };
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
};

export const verifyToken = (token: string): TokenPayload => {
  const [body, signature] = token.split('.');
  if (!body || !signature) throw HttpError.unauthorized('Malformed token');

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw HttpError.unauthorized('Invalid token signature');
  }

  const payload = JSON.parse(decode(body)) as TokenPayload;
  if (payload.exp < Date.now()) throw HttpError.unauthorized('Token expired', 'token_expired');
  return payload;
};

/** Extracts and verifies the bearer token, asserting the required role. */
export const authenticate = (req: Request, role: TokenRole): TokenPayload => {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) throw HttpError.unauthorized();

  const payload = verifyToken(token);
  if (payload.role !== role) throw HttpError.forbidden();
  return payload;
};
