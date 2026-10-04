import type { NextFunction, Request, Response } from 'express';

/** Domain error carrying an HTTP status and a stable machine-readable code. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  // Fields are assigned explicitly rather than declared as constructor
  // parameter properties: Node's type-stripping loader runs the service
  // directly from TypeScript and does not support that syntax.
  constructor(status: number, message: string, code = 'error') {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }

  static badRequest(message: string, code = 'bad_request') {
    return new HttpError(400, message, code);
  }
  static unauthorized(message = 'Authorization required', code = 'unauthorized') {
    return new HttpError(401, message, code);
  }
  static forbidden(message = 'Access denied', code = 'forbidden') {
    return new HttpError(403, message, code);
  }
  static notFound(message = 'Not found', code = 'not_found') {
    return new HttpError(404, message, code);
  }
  static conflict(message: string, code = 'conflict') {
    return new HttpError(409, message, code);
  }
}

/** Wraps an async handler so rejected promises reach the error middleware. */
export const asyncHandler =
  <T>(handler: (req: Request, res: Response) => Promise<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  // Express identifies the error middleware by its four-parameter signature.
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, code: error.code });
    return;
  }

  console.error('[ophtra] unhandled error', error);
  res.status(500).json({ message: 'Internal server error', code: 'internal_error' });
};

/** Reads a required string field out of a request body. */
export const requireString = (body: unknown, field: string): string => {
  const value = (body as Record<string, unknown>)?.[field];
  if (typeof value !== 'string' || value.trim() === '') {
    throw HttpError.badRequest(`Field "${field}" is required`, 'validation_error');
  }
  return value.trim();
};

export const optionalString = (body: unknown, field: string): string => {
  const value = (body as Record<string, unknown>)?.[field];
  return typeof value === 'string' ? value.trim() : '';
};

const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/;

export const requirePhone = (body: unknown, field = 'phone'): string => {
  const value = requireString(body, field);
  if (!PHONE_PATTERN.test(value)) {
    throw HttpError.badRequest('Invalid phone number', 'validation_error');
  }
  return value;
};
