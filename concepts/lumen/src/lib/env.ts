/** Device / preference probes, read once at start-up. */
const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
export const isTouch = mq('(pointer: coarse)') || mq('(hover: none)');

/** 'high' = desktop glass with chromatic refraction; 'low' = phones / weak CPUs. */
export const tier: 'high' | 'low' =
  isTouch || (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 820 ? 'low' : 'high';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Resolves once the boot loader has lifted (html.is-ready). */
let readyResolve: () => void = () => {};
const readyPromise = new Promise<void>((r) => (readyResolve = r));
export const markReady = () => {
  document.documentElement.classList.add('is-ready');
  readyResolve();
};
export const whenReady = () => readyPromise;
