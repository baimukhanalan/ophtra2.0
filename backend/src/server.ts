import express, { type NextFunction, type Request, type Response } from 'express';
import { env } from './config/env.ts';
import { errorHandler } from './lib/http.ts';
import { logger } from './lib/logger.ts';
import { closeDatabase, getDatabase } from './db/index.ts';
import { seed } from './db/seed.ts';
import { catalogRouter } from './modules/catalog.ts';
import { bookingRouter } from './modules/booking.ts';
import { crmRouter } from './modules/crm.ts';
import { accountRouter } from './modules/account.ts';
import { paymentsRouter } from './modules/payments.ts';
import { assistantRouter } from './modules/assistant.ts';
import { adminRouter } from './modules/admin.ts';
import { analyticsRouter } from './modules/analytics.ts';
import { seoRouter } from './modules/seo.ts';
import { mis } from './integrations/mis.ts';
import { payments } from './integrations/payments.ts';

/**
 * OPHTRA API.
 *
 * API-first and modular: each capability is a router that owns its routes and
 * nothing else, integrations sit behind adapters, and storage sits behind a
 * driver port. The contract is documented in openapi.yaml.
 */

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

/* -------------------------------------------------------------------- CORS */
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.header('origin');
  if (origin && env.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

/* ---------------------------------------------------------------- LOGGING */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  res.on('finish', () => {
    logger.info('http', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Math.round(performance.now() - start),
    });
  });
  next();
});

/* ----------------------------------------------------------------- ROUTES */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    database: getDatabase().driver,
    integrations: {
      mis: mis.mode(),
      payments: payments.mode,
      crm: env.crm.enabled ? 'live' : 'simulated',
      whatsapp: env.whatsapp.enabled ? 'live' : 'simulated',
    },
  });
});

app.use('/api', catalogRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/crm', crmRouter);
app.use('/api/account', accountRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);

// SEO documents are served from the site root, not under /api.
app.use('/', seoRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found', code: 'not_found' });
});

app.use(errorHandler);

/* --------------------------------------------------------------- BOOTSTRAP */
const start = async () => {
  const db = getDatabase();
  await db.migrate();

  // The demo database seeds itself on first boot so `npm run dev` is enough to
  // get a working API with the full catalogue.
  const seeded = await db.get<{ count: number }>('SELECT COUNT(*) AS count FROM content');
  if (!seeded || seeded.count === 0) await seed();

  const server = app.listen(env.port, () => {
    logger.info('server.listening', { port: env.port, env: env.nodeEnv });
  });

  const shutdown = async (signal: string) => {
    logger.info('server.shutdown', { signal });
    server.close();
    await closeDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
};

start().catch((error) => {
  logger.error('server.start_failed', { error: String(error) });
  process.exit(1);
});

export { app };
