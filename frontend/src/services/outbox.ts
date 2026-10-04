import type { Lead } from '@/types';

/**
 * Local outbox for enquiries the API could not accept.
 *
 * Until the CRM endpoint is reachable, a failed lead has nowhere to go: the
 * visitor is told something and the clinic hears nothing. Rather than drop it,
 * the payload is kept in localStorage and retried on the next page load and
 * before every new submission, so an enquiry made during an outage still lands
 * once the API is connected.
 *
 * This is a safety net, not a delivery guarantee — it only survives as long as
 * the visitor's browser storage does, which is why the UI that uses it also
 * offers WhatsApp and the phone number rather than claiming the message was
 * sent.
 */

const KEY = 'ophtra.outbox.leads';

/** Older than this and the clinic would be calling back about nothing. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

interface Pending {
  lead: Lead;
  /** ISO timestamp of the first attempt. */
  queuedAt: string;
}

const read = (): Pending[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Pending[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items: Pending[]) => {
  try {
    if (items.length === 0) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage full or unavailable — the enquiry is lost either way */
  }
};

/**
 * Several tabs can queue at the same moment; localStorage has no atomic
 * read-modify-write, so the update runs under a Web Lock when available.
 */
const withLock = (task: () => void) => {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  if (locks?.request) void locks.request(KEY, async () => task());
  else task();
};

export const queueLead = (lead: Lead) => withLock(() => queueLeadNow(lead));

const queueLeadNow = (lead: Lead) => {
  const items = read();
  // Re-submitting the same form twice should not queue it twice.
  const duplicate = items.some(
    (item) => item.lead.phone === lead.phone && item.lead.comment === lead.comment,
  );
  if (duplicate) return;
  write([...items, { lead, queuedAt: new Date().toISOString() }]);
};

export const pendingLeadCount = () => read().length;

/**
 * Retry everything queued. Items that fail again stay for the next attempt;
 * items older than MAX_AGE_MS are dropped.
 */
export const flushOutbox = async (send: (lead: Lead) => Promise<unknown>) => {
  const items = read();
  if (items.length === 0) return;

  const cutoff = Date.now() - MAX_AGE_MS;
  const key = (item: Pending) => `${item.queuedAt}|${item.lead.phone}|${item.lead.comment}`;
  const done = new Set<string>();

  for (const item of items) {
    if (Date.parse(item.queuedAt) < cutoff) {
      done.add(key(item));
      continue;
    }
    try {
      await send(item.lead);
      done.add(key(item));
    } catch {
      /* stays queued for the next attempt */
    }
  }

  // Re-read before writing: another tab (or this one) may have queued new
  // enquiries while the sends were in flight — only the delivered or expired
  // entries are removed, nothing queued meanwhile is overwritten.
  await new Promise<void>((resolve) =>
    withLock(() => {
      write(read().filter((item) => !done.has(key(item))));
      resolve();
    }),
  );
};

/**
 * Read-only view of queued enquiries for the admin panel (demo mode), so a
 * request made during an outage is visible to staff on this device instead of
 * sitting invisible in storage.
 */
export const pendingLeads = (): Array<{ lead: Lead; queuedAt: string }> => read();
