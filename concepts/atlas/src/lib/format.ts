const nf = new Intl.NumberFormat('ru-RU');
export const tenge = (n: number) => `${nf.format(n)} ₸`;
export const num = (n: number) => nf.format(n);

const df = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
export const date = (iso: string) => df.format(new Date(iso.length === 10 ? `${iso}T12:00:00` : iso));

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/** Demo reference like OPH-4KD7QM. */
export function reference(prefix = 'OPH') {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  buf.forEach((v) => (s += abc[v % abc.length]));
  return `${prefix}-${s}`;
}

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 10;
