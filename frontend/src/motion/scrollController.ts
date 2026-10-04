/**
 * Central scroll controller.
 *
 * Every scroll-driven effect on the site subscribes here instead of attaching
 * its own listener. One passive listener + one rAF loop means the browser does
 * a single layout read per frame and all writes happen together, which is what
 * keeps long scrollytelling pages at 60 FPS.
 */

export interface ScrollState {
  /** Vertical scroll offset in px. */
  y: number;
  /** Scroll delta since the previous frame. */
  delta: number;
  /** 0..1 progress through the whole document. */
  progress: number;
  /** Smoothed 0..1 progress; use for progress bars so they glide. */
  smoothProgress: number;
  /**
   * How far the damped position trails the real scroll offset, in px.
   *
   * A touch flick delivers scroll in large, uneven jumps, so an effect that
   * maps `getBoundingClientRect().top` straight to a transform snaps from one
   * position to the next. Adding `lag` to a freshly measured `top` yields the
   * damped position instead, which is what makes the motion read as gliding
   * rather than teleporting.
   *
   * Always zero under reduced motion AND on touch devices. On a phone the page
   * itself is scrolled by the compositor, so anything that trails the real
   * offset is visibly drawn at a different place than the content around it:
   * during a flick it falls behind, and when the finger lifts it keeps sliding
   * and then snaps into place. Touch therefore follows native scroll exactly.
   */
  lag: number;
  /** Viewport height in px. */
  viewport: number;
  /** Total scrollable height in px. */
  documentHeight: number;
  direction: 'up' | 'down';
}

type Subscriber = (state: ScrollState) => void;

const subscribers = new Set<Subscriber>();

let state: ScrollState = {
  y: 0,
  delta: 0,
  progress: 0,
  smoothProgress: 0,
  lag: 0,
  viewport: 0,
  documentHeight: 0,
  direction: 'down',
};

let frame = 0;
let started = false;
let dirty = true;

/* ------------------------------------------------------------ TOUCH GUARD */

/**
 * The media query every touch-specific branch of the motion system keys on —
 * phones and tablets whose primary pointer is a finger. Exported so page CSS
 * (`@media (hover: none) and (pointer: coarse)`) and page code agree with the
 * engine about what "touch" means.
 */
export const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

let touchQuery: MediaQueryList | undefined;

/**
 * True on a touch-first device. Scroll-linked motion that moves an element
 * against the native scroll (parallax, pinned horizontal tracks, sticky scale
 * stacks) is switched off or made exact when this is true: the compositor
 * scrolls the page on its own thread, so a transform the main thread writes a
 * frame later can only ever wobble against it.
 */
export const isTouch = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  touchQuery ??= window.matchMedia(TOUCH_QUERY);
  return touchQuery.matches;
};

/**
 * Motion follows the real scroll offset with no smoothing. Cached with
 * `reducedMotion` and refreshed whenever the loop starts.
 */
let exact = false;

/**
 * Layout width at the last accepted resize. A phone fires `resize` whenever its
 * URL bar slides in or out, but only the height changes then; re-measuring on
 * those made every scroll-linked value jump by the bar's height mid-scroll.
 */
let lastWidth = 0;

/**
 * Cached because `damp` reads it every frame and `matchMedia` is a live query.
 * Refreshed whenever the loop starts, which covers the in-app toggle.
 */
let reducedMotion = false;

/** Damped position that chases `state.y`. */
let smoothY = 0;
let lastFrameTime = 0;

/**
 * Time for the damped position to cover half the remaining distance.
 *
 * Higher trails further behind and feels heavier; lower snaps. At 110ms the
 * damped value was still gliding 0.5-1s after a desktop wheel stopped, which
 * read as the page settling on its own. 55ms settles in about 0.4s and keeps
 * the glide on progress fills only: every positional effect (parallax, pins,
 * stacks, --p / --pin / --enter) now reads the exact offset, so nothing can
 * drift after the page has stopped. Touch and reduced motion stay at lag = 0.
 */
const SMOOTHING_HALFLIFE = 55;

/** Below this the damped position is treated as arrived, so the loop can stop. */
const SETTLE_EPSILON = 0.08;

/**
 * Viewport height used by every scroll-linked calculation.
 *
 * On touch this is the layout viewport (`documentElement.clientHeight`), which
 * mobile browsers keep at the small-viewport height (= `100svh`) whether the
 * URL bar is showing or not. `innerHeight` grows and shrinks with the bar, so
 * values derived from it jumped by ~56px each time the bar moved. Desktop has
 * no such bar and keeps `innerHeight`.
 */
const readViewport = () =>
  exact && !reducedMotion
    ? document.documentElement.clientHeight || window.innerHeight
    : window.innerHeight;

/**
 * Document height is cached and refreshed by a ResizeObserver instead of being
 * read on every scroll frame: reading `scrollHeight` right after the previous
 * frame's style writes forced a synchronous style + layout pass per frame.
 */
let cachedDocumentHeight = 0;
let documentObserver: ResizeObserver | undefined;

const readDocumentHeight = () =>
  Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);

const measure = () => {
  const y = window.scrollY || window.pageYOffset || 0;
  const viewport = readViewport();
  if (!cachedDocumentHeight || !documentObserver) cachedDocumentHeight = readDocumentHeight();
  const documentHeight = cachedDocumentHeight;
  const scrollable = Math.max(documentHeight - viewport, 1);
  const delta = y - state.y;

  state = {
    ...state,
    y,
    delta,
    progress: Math.min(Math.max(y / scrollable, 0), 1),
    viewport,
    documentHeight,
    direction: delta >= 0 ? 'down' : 'up',
  };
};

/** Advance the damped position. Returns true while it is still catching up. */
const damp = (now: number): boolean => {
  const scrollable = Math.max(state.documentHeight - state.viewport, 1);

  if (reducedMotion || exact) {
    smoothY = state.y;
    lastFrameTime = 0;
    state = { ...state, lag: 0, smoothProgress: state.progress };
    return false;
  }

  // Frame-rate independent: the same distance is covered per millisecond
  // whether the device paints at 60 or 120 Hz. Clamped so a backgrounded tab
  // resuming after seconds does not jump the easing.
  const elapsed = lastFrameTime ? Math.min(now - lastFrameTime, 64) : 16.7;
  lastFrameTime = now;

  smoothY += (state.y - smoothY) * (1 - Math.pow(2, -elapsed / SMOOTHING_HALFLIFE));

  const remaining = state.y - smoothY;
  const moving = Math.abs(remaining) > SETTLE_EPSILON;
  if (!moving) smoothY = state.y;

  state = {
    ...state,
    lag: state.y - smoothY,
    smoothProgress: Math.min(Math.max(smoothY / scrollable, 0), 1),
  };

  return moving;
};

const tick = (now: number) => {
  frame = 0;

  const measured = dirty;
  if (dirty) {
    measure();
    dirty = false;
  }

  // Read phase is done; every subscriber now only writes.
  const moving = damp(now);
  if (measured || moving) {
    subscribers.forEach((subscriber) => subscriber(state));
  }

  if (subscribers.size === 0) {
    started = false;
    lastFrameTime = 0;
    return;
  }

  if (dirty || moving) {
    schedule();
  } else {
    // Nothing left to animate: park the loop until the next scroll event so an
    // idle page costs zero frames.
    lastFrameTime = 0;
  }
};

const schedule = () => {
  if (frame) return;
  frame = requestAnimationFrame(tick);
};

const markDirty = () => {
  dirty = true;
  schedule();
};

/**
 * On touch, a resize that only changes the height is the URL bar moving: the
 * layout viewport and every vh / svh / lvh length stay put, so there is nothing
 * to re-measure and doing so would only shift scroll-linked values mid-scroll.
 */
const handleResize = () => {
  const width = window.innerWidth;
  if (exact && width === lastWidth) return;
  lastWidth = width;
  cachedDocumentHeight = 0;
  markDirty();
};

const refreshDocumentHeight = () => {
  const next = readDocumentHeight();
  if (next === cachedDocumentHeight) return;
  cachedDocumentHeight = next;
  markDirty();
};

const start = () => {
  if (started || typeof window === 'undefined') return;
  started = true;
  reducedMotion = prefersReducedMotion();
  exact = reducedMotion || isTouch();
  lastWidth = window.innerWidth;
  smoothY = window.scrollY || window.pageYOffset || 0;
  cachedDocumentHeight = readDocumentHeight();
  if (typeof ResizeObserver !== 'undefined') {
    documentObserver = new ResizeObserver(refreshDocumentHeight);
    documentObserver.observe(document.documentElement);
    if (document.body) documentObserver.observe(document.body);
  }
  window.addEventListener('scroll', markDirty, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleResize, { passive: true });
  markDirty();
};

const stop = () => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('scroll', markDirty);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('orientationchange', handleResize);
  documentObserver?.disconnect();
  documentObserver = undefined;
  cachedDocumentHeight = 0;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  started = false;
};

/** Subscribe to per-frame scroll state. Returns an unsubscribe function. */
export const onScroll = (subscriber: Subscriber): (() => void) => {
  subscribers.add(subscriber);
  start();
  // Give the new subscriber the current state immediately so it can paint
  // its correct position before the next frame. A element that mounts
  // mid-scroll starts already settled, so it never slides in from a stale spot.
  if (typeof window !== 'undefined') {
    measure();
    smoothY = state.y;
    state = { ...state, lag: 0, smoothProgress: state.progress };
    subscriber(state);
  }

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) stop();
  };
};

/** Force a re-measure, e.g. after content of unknown height finishes loading. */
export const invalidateScroll = () => {
  cachedDocumentHeight = 0;
  markDirty();
};

export const getScrollState = (): ScrollState => state;

/** Clamp helper shared by the scroll hooks. */
export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

/** Map a value from one range to another, clamped. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * t;
};

/** True when the visitor has asked for reduced motion (OS or in-app toggle). */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (document.documentElement.dataset.reducedMotion === 'true') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
