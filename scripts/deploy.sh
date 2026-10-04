#!/usr/bin/env bash
# Production deploy to Vercel with static prerender.
#
#   1. copy the deployable parts (frontend, data, shared, vercel.json) into a
#      clean staging folder — the backend stays out so Vercel does not treat
#      the repo as a multi-service project;
#   2. `vercel build --prod` locally (same install/build commands as vercel.json);
#   3. prerender every sitemap route into .vercel/output/static (headless Chrome);
#   4. `vercel deploy --prebuilt --prod`.
#
# Requires: Vercel CLI (logged in), Google Chrome, e2e/node_modules (Playwright).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="${STAGE:-${TMPDIR:-/tmp}/ophtra2-deploy}"
PROJECT="${VERCEL_PROJECT:-ophtra2}"

rm -rf "$STAGE"
mkdir -p "$STAGE"
rsync -a --exclude node_modules --exclude dist \
  "$ROOT/frontend" "$ROOT/data" "$ROOT/shared" "$ROOT/vercel.json" "$ROOT/.vercelignore" "$STAGE/"

cd "$STAGE"
vercel link --yes --project "$PROJECT" >/dev/null
vercel pull --yes --environment=production >/dev/null
vercel build --prod

node "$ROOT/frontend/scripts/prerender.mjs" "$STAGE/.vercel/output/static"

vercel deploy --prebuilt --prod --yes
