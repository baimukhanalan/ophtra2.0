/**
 * The preview server is rebuilt from time to time while the site is being
 * worked on; wait (up to 5 min) for it instead of failing every test with
 * ERR_CONNECTION_REFUSED.
 */
export default async function globalSetup() {
  const base = process.env.BASE_URL ?? 'http://localhost:4173';
  const deadline = Date.now() + 5 * 60_000;
  for (;;) {
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    if (Date.now() > deadline) throw new Error(`Preview server ${base} is not reachable`);
    await new Promise((r) => setTimeout(r, 2000));
  }
}
