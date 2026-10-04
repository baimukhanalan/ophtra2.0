import Lenis from 'lenis';
import { LAYER, P_LEN, STATIONS, type StationId } from './stations';

/**
 * One requestAnimationFrame loop drives everything that moves:
 * smooth wheel scrolling (desktop only), sticky-chapter progress variables,
 * the journey target the 3D camera follows, and the WebGL render itself.
 *
 * Touch devices keep native scrolling — nothing here ever transforms a
 * scrolling container, so momentum scroll on phones stays jitter-free.
 */

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const env = {
  reduced: mq('(prefers-reduced-motion: reduce)'),
  touch: mq('(hover: none), (pointer: coarse)'),
  small: mq('(max-width: 760px)'),
};

type FrameFn = (t: number, dt: number) => void;
const frameFns = new Set<FrameFn>();
export const onFrame = (fn: FrameFn) => {
  frameFns.add(fn);
  return () => void frameFns.delete(fn);
};

let lenis: Lenis | null = null;
export const scroll = {
  y: 0,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  velocity: 0,
};

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' } as ScrollToOptions);
}

export function scrollToEl(el: Element) {
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  if (lenis && !env.reduced) lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: env.reduced ? 'instant' : 'smooth' } as ScrollToOptions);
}

export function lockScroll(lock: boolean) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.classList.toggle('is-locked', lock);
}

/* ------------------------------------------------------------------ */
/* Progress registry: sticky chapters expose --p (0..1) to CSS.         */

interface ProgressEntry {
  el: HTMLElement;
  cb?: (p: number) => void;
  last: number;
  mode: 'pin' | 'through';
}
const progressEntries = new Set<ProgressEntry>();

/**
 * 'pin': 0 when the element's top reaches the viewport top, 1 when its bottom
 *        reaches the viewport bottom (for tall sections with a sticky child).
 * 'through': 0 when the top enters from below, 1 when the bottom leaves at top.
 */
export function trackProgress(el: HTMLElement, cb?: (p: number) => void, mode: 'pin' | 'through' = 'pin') {
  const entry: ProgressEntry = { el, cb, last: -1, mode };
  progressEntries.add(entry);
  updateEntry(entry);
  return () => void progressEntries.delete(entry);
}

function measure(e: ProgressEntry) {
  const r = e.el.getBoundingClientRect();
  const vh = scroll.vh;
  let p: number;
  if (e.mode === 'pin') {
    const span = r.height - vh;
    p = span > 0 ? -r.top / span : r.top < 0 ? 1 : 0;
  } else {
    p = (vh - r.top) / (r.height + vh);
  }
  return Math.min(1, Math.max(0, p));
}
function apply(e: ProgressEntry, p: number) {
  if (Math.abs(p - e.last) > 0.0005) {
    e.last = p;
    e.el.style.setProperty('--p', p.toFixed(4));
    e.cb?.(p);
  }
}
function updateEntry(e: ProgressEntry) {
  apply(e, measure(e));
}
const measured: Array<[ProgressEntry, number]> = [];
function updateAll() {
  // read every rect first, then write — no layout thrashing
  measured.length = 0;
  progressEntries.forEach((e) => measured.push([e, measure(e)]));
  for (const [e, p] of measured) apply(e, p);
}

/* ------------------------------------------------------------------ */
/* Journey: DOM markers → blended camera station.                       */

interface Marker {
  el: HTMLElement;
  id: StationId;
  anchor: number;
}
let markers: Marker[] = [];
let override: StationId | null = null;
let fallback: StationId = 'gaze';

export const journey = {
  target: new Float32Array(STATIONS.gaze),
  layer: LAYER.gaze.name,
  depth: 0,
  from: 'gaze' as StationId,
  to: 'gaze' as StationId,
  t: 0,
  version: 0,
};

const layerListeners = new Set<(name: string, depth: number) => void>();
export const onLayer = (fn: (name: string, depth: number) => void) => {
  layerListeners.add(fn);
  fn(journey.layer, journey.depth);
  return () => void layerListeners.delete(fn);
};

export function refreshMarkers() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-station]'));
  const sy = window.scrollY;
  markers = els
    .map((el) => {
      const r = el.getBoundingClientRect();
      const h = Math.min(r.height, scroll.vh);
      return { el, id: el.dataset.station as StationId, anchor: r.top + sy + h / 2 };
    })
    .filter((m) => STATIONS[m.id])
    .sort((a, b) => a.anchor - b.anchor);
}

export function setStationOverride(id: StationId | null) {
  override = id;
}
export function setFallbackStation(id: StationId) {
  fallback = id;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function computeJourney() {
  let a: StationId;
  let b: StationId;
  let t = 0;
  if (override) {
    a = b = override;
  } else if (!markers.length) {
    a = b = fallback;
  } else {
    const c = scroll.y + scroll.vh / 2;
    if (c <= markers[0].anchor) {
      a = b = markers[0].id;
    } else if (c >= markers[markers.length - 1].anchor) {
      a = b = markers[markers.length - 1].id;
    } else {
      let i = 0;
      while (i < markers.length - 1 && markers[i + 1].anchor < c) i++;
      const m0 = markers[i];
      const m1 = markers[i + 1];
      a = m0.id;
      b = m1.id;
      t = smooth((c - m0.anchor) / Math.max(1, m1.anchor - m0.anchor));
    }
  }
  if (a === journey.from && b === journey.to && Math.abs(t - journey.t) < 1e-4) return;
  journey.from = a;
  journey.to = b;
  journey.t = t;
  const A = STATIONS[a];
  const B = STATIONS[b];
  for (let i = 0; i < P_LEN; i++) journey.target[i] = A[i] + (B[i] - A[i]) * t;
  journey.version++;
  const cur = t < 0.5 ? a : b;
  const name = LAYER[cur].name;
  const depth = LAYER[a].depth + (LAYER[b].depth - LAYER[a].depth) * t;
  if (name !== journey.layer || Math.abs(depth - journey.depth) > 0.004) {
    journey.layer = name;
    journey.depth = depth;
    layerListeners.forEach((fn) => fn(name, depth));
  }
}

/* ------------------------------------------------------------------ */
/* Reveal-on-view: any [data-reveal] gains .is-in once visible.          */

let io: IntersectionObserver | null = null;
function initReveals() {
  if (!('IntersectionObserver' in window)) return;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io!.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
}
export function scanReveals(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
    if (env.reduced || !io) el.classList.add('is-in');
    else io.observe(el);
  });
}

/* ------------------------------------------------------------------ */

let started = false;
export function startEngine() {
  if (started) return;
  started = true;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!env.touch && !env.reduced) {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
    document.documentElement.classList.add('has-lenis');
  }
  initReveals();

  let lastW = window.innerWidth;
  const onResize = () => {
    // On phones the URL bar changes the height constantly: ignore pure height
    // changes there so nothing re-lays out mid-scroll.
    if (env.touch && window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    scroll.vh = window.innerHeight;
    refreshMarkers();
  };
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(() => refreshMarkers());
  ro.observe(document.body);

  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    lenis?.raf(now);
    const y = window.scrollY;
    scroll.velocity = (y - scroll.y) / Math.max(dt, 0.001);
    scroll.y = y;
    updateAll();
    computeJourney();
    frameFns.forEach((fn) => fn(now / 1000, dt));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
