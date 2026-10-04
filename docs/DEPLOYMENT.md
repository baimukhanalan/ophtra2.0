# Deployment

## What is deployed today

**https://ophtra.vercel.app** — the site, as a static SPA on Vercel.

The API is *not* deployed with it. `.vercelignore` excludes `backend/`, which
also stops Vercel from treating the repo as a multi-service project. The site
runs completely without it: the catalogue is bundled, the assistant runs the
shared engine in the browser, booking falls back to the local slot rules, and
the account and admin panels run against demo data and say so.

## Site (Vercel)

Configuration is `vercel.json` at the repository root:

```json
{
  "framework": "vite",
  "installCommand": "npm --prefix frontend install --no-audit --no-fund",
  "buildCommand": "npm --prefix frontend run seo:generate && npm --prefix frontend run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The build runs from the repository root, not from `frontend/`, because the
frontend imports `../data` and `../shared`.

Two things that matter and are easy to get wrong:

- **The SPA rewrite must be a plain catch-all.** Vercel serves existing static
  files before applying rewrites, so `/(.*)` cannot shadow `/assets` or
  `/sitemap.xml`.
- **`cleanUrls` must stay off.** It rewrites `/index.html` to `/`, which makes
  `/index.html` an invalid rewrite destination and 404s every deep link.

Deploy:

```bash
vercel deploy --prod
```

### Environment variables

Set in *Project → Settings → Environment Variables*. All optional — see
`frontend/.env.example`. An unset analytics ID means that vendor tag is never
loaded.

## API

The API is a long-running Express service (`backend/`) that owns a database and
outbound integrations. Deploy it to any Node host:

```bash
npm --prefix backend install
DB_DRIVER=postgres DATABASE_URL=… npm --prefix backend start
```

Then point the site at it with `VITE_API_URL=https://api.ophtra.kz/api` and add
that origin to `CORS_ORIGINS` on the API.

`GET /api/health` reports the database driver and whether each integration is
live or simulated — check it first after any deploy.

## Adding a Neon database on Vercel

1. Vercel dashboard → **Storage → Create Database → Neon**. Vercel injects
   `DATABASE_URL` into the project.
2. Implement the PostgreSQL driver and register it — the full checklist is in
   [DATABASE.md](DATABASE.md). Until that driver exists, setting
   `DB_DRIVER=postgres` fails fast with an explicit message rather than
   silently falling back to SQLite.
3. Seed: `DB_DRIVER=postgres DATABASE_URL=… npm --prefix backend run db:seed`.

Note that attaching Neon to the *site* project does nothing on its own: the
site never talks to a database directly, only to the API. The database belongs
to whichever project runs `backend/`.

## Verifying a release

```bash
npm run verify    # type-check both packages, 36 tests, production build
```

Then against the deployed URL:

```bash
curl -sI https://ophtra.vercel.app/ | grep -i strict-transport   # headers applied
curl -s  https://ophtra.vercel.app/robots.txt                    # SEO files served
curl -s -o /dev/null -w '%{http_code}' https://ophtra.vercel.app/pricing   # deep links
```
