import { useEffect, useRef, useState, type RefObject } from 'react';
import { clamp, isTouch, onScroll, prefersReducedMotion } from './scrollController';

/**
 * Where a pinned horizontal track becomes a native swipe row instead: every
 * touch device, and any window too narrow for a pinned 100svh stage. Mirrors the
 * media query in motion.css so markup, CSS and JS agree on first paint.
 */
export const NATIVE_HSCROLL_QUERY = '(hover: none) and (pointer: coarse), (max-width: 767px)';

/* ============================================================== PARALLAX */

/**
 * Translate an element against the scroll direction while it is on screen.
 * `speed` is the fraction of the travelled distance: 0.2 is subtle, 0.6 strong.
 */
export const useParallax = <T extends HTMLElement = HTMLDivElement>(
  speed = 0.18,
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    // Off on touch: a layer that moves at a different rate from the page it
    // sits in can only be updated a frame behind the compositor's own scroll,
    // which reads as the element shaking during a flick.
    if (!node || prefersReducedMotion() || isTouch()) return;

    node.setAttribute('data-oph-parallax', '');

    const unsubscribe = onScroll(({ viewport }) => {
      const rect = node.getBoundingClientRect();
      // Skip work entirely for off-screen layers.
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;
      /*
       * Exact position, no `lag`. A damped parallax shift keeps changing after
       * the page has stopped, and because the shift runs against the scroll it
       * always settles BACKWARDS (the founder quote, rings and marks drifted
       * 30-70px the wrong way for up to a second). Tied to the real offset the
       * layer stops on the same frame as the page.
       */
      const center = rect.top + rect.height / 2 - viewport / 2;
      // Fractional: the layer is promoted (see [data-oph-parallax]), so the
      // compositor resamples it for free and snapping to whole pixels would
      // only make it judder.
      node.style.setProperty('--oph-parallax-shift', `${(-center * speed).toFixed(2)}px`);
    });
    return () => {
      unsubscribe();
      node.removeAttribute('data-oph-parallax');
      node.style.removeProperty('--oph-parallax-shift');
    };
  }, [speed]);

  return ref;
};

/* ========================================================= STICKY SCENES */

export interface SceneState {
  /** 0..1 progress through the pinned track. */
  progress: number;
  /** Index of the currently active layer. */
  index: number;
}

/**
 * Drives a pinned "scrollytelling" section: the track scrolls, the pinned
 * viewport stays, and the active layer index advances with progress.
 */
export const useScrollScene = <T extends HTMLElement = HTMLDivElement>(
  layerCount: number,
): [RefObject<T | null>, SceneState] => {
  const ref = useRef<T>(null);
  const [scene, setScene] = useState<SceneState>({ progress: 0, index: 0 });
  const lastIndex = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || layerCount < 1) return;

    if (prefersReducedMotion()) {
      setScene({ progress: 1, index: 0 });
      return;
    }

    // Exact position: the scene is pinned by native sticky, so the active layer
    // must change with the pin, not a damped moment later (see useHorizontalScroll).
    return onScroll(({ viewport }) => {
      const rect = node.getBoundingClientRect();
      const travel = Math.max(rect.height - viewport, 1);
      const progress = clamp(-rect.top / travel);
      const index = Math.min(layerCount - 1, Math.floor(progress * layerCount * 0.999));

      // Only re-render on an index change; nothing else here touches the DOM,
      // so scrolling through a scene costs no style writes at all.
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        setScene({ progress, index });
      }
    });
  }, [layerCount]);

  return [ref, scene];
};

/**
 * Horizontal panel track driven by vertical scroll.
 *
 * On touch and on narrow windows the track is NOT pinned and NOT driven: the
 * CSS (see NATIVE_HSCROLL_QUERY) turns it into a native swipe row with scroll
 * snap, and this hook stays detached. A 100svh pin whose sideways offset is
 * written from the main thread lagged the compositor-driven page by a frame
 * and visibly shook during a flick; the finger moving the row directly cannot.
 */
export const useHorizontalScroll = <T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  RefObject<HTMLDivElement | null>,
] => {
  const trackRef = useRef<T>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;

    const native = window.matchMedia(NATIVE_HSCROLL_QUERY);
    let unsubscribe: (() => void) | undefined;
    // Measured on resize only; reading scrollWidth per frame forced layout.
    let distance = 0;
    const measure = () => {
      distance = Math.max(inner.scrollWidth - window.innerWidth + 48, 0);
    };
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;

    const attach = () => {
      unsubscribe?.();
      unsubscribe = undefined;
      resize?.disconnect();
      inner.style.removeProperty('--oph-hscroll-offset');

      const isNative = native.matches;
      track.dataset.native = String(isNative);
      const pin = inner.parentElement;
      // The swipe row is a scroll container of its own; keyboard users reach
      // it with Tab and pan it with the arrow keys.
      const isStatic = isNative || prefersReducedMotion();
      if (pin) {
        if (isStatic) pin.tabIndex = 0;
        else pin.removeAttribute('tabindex');
      }
      if (isStatic) return;

      measure();
      resize?.observe(inner);
      unsubscribe = onScroll(({ viewport }) => {
        const rect = track.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) return;
        const travel = Math.max(rect.height - viewport, 1);
        /*
         * Exact scroll position, never the damped one. The pin itself is native
         * `position: sticky`, i.e. exact; driving the row from the lagged value
         * made the two disagree at both pin edges — the section started to
         * scroll away while the row was still 100-450px short of its end.
         * Exact progress reaches 0 / 1 on the very frame the pin engages /
         * releases.
         */
        const progress = clamp(-rect.top / travel);
        /*
         * Fractional, because the track carries a permanent `will-change:
         * transform` and is therefore its own compositor layer: the GPU moves the
         * finished texture and a sub-pixel offset costs nothing.
         */
        inner.style.setProperty('--oph-hscroll-offset', `${(-distance * progress).toFixed(2)}px`);
      });
    };

    attach();
    native.addEventListener('change', attach);
    return () => {
      native.removeEventListener('change', attach);
      resize?.disconnect();
      unsubscribe?.();
    };
  }, []);

  return [trackRef, innerRef];
};

/**
 * Phone-only rail that pans itself sideways as the page scrolls past it.
 *
 * A swipeable rail hides everything after the second card behind a gesture most
 * visitors never make. Here the track is driven by vertical scroll instead, so
 * the whole set passes by on the way down without any interaction. Above the
 * breakpoint the markup stays a plain grid and the hook does nothing.
 */
export const useAutoRail = <T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  RefObject<HTMLDivElement | null>,
  RefObject<HTMLDivElement | null>,
] => {
  const trackHostRef = useRef<T>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = trackHostRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!host || !pin || !track) return;

    const phone = window.matchMedia('(max-width: 767px)');

    let unsubscribe: (() => void) | undefined;
    let travel = 0;

    /**
     * The section is a tall track with a sticky viewport, so the cards pan
     * while the page is held rather than while it flies past. Its extra height
     * IS the pan distance: one pixel of scroll to one pixel sideways, which is
     * what gives each doctor time to be read instead of sweeping the whole set
     * by in half a screen.
     */
    const measure = () => {
      const style = getComputedStyle(pin);
      const inner =
        pin.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      travel = Math.max(track.scrollWidth - inner, 0);
      host.style.setProperty('--oph-autorail-travel', `${Math.round(travel)}px`);
    };

    const attach = () => {
      unsubscribe?.();
      unsubscribe = undefined;
      track.style.setProperty('--oph-autorail-offset', '0px');

      // Without the scroll driver the track would sit frozen on the first card
      // with the rest clipped, so it falls back to a swipeable rail instead.
      // Touch always gets the swipe rail: a vertical-scroll-driven sideways
      // offset is written a frame behind the compositor's scroll and shakes.
      const swipe = prefersReducedMotion() || isTouch();
      const off = swipe || !phone.matches;
      host.dataset.static = String(swipe && phone.matches);
      host.dataset.panning = String(!off);
      if (off) {
        host.style.setProperty('--oph-autorail-travel', '0px');
        return;
      }

      measure();

      unsubscribe = onScroll(() => {
        if (travel <= 0) return;
        // Both tops exact: `lag` on one operand only (as StackCards had) reads
        // any fast scroll as the pin having travelled further than it has.
        const hostTop = host.getBoundingClientRect().top;
        const pinTop = pin.getBoundingClientRect().top;
        // How far the sticky viewport has been dragged down its own track.
        const progress = clamp((pinTop - hostTop) / travel);
        // Fractional on purpose: the track is a composited layer, so the
        // compositor resamples it for free, whereas snapping to whole pixels
        // makes it sit still for several frames and then jump.
        track.style.setProperty('--oph-autorail-offset', `${(-travel * progress).toFixed(2)}px`);
      });
    };

    attach();
    phone.addEventListener('change', attach);

    // Card widths are percentages of the viewport, so the travel changes with
    // the device rotating or the URL bar collapsing.
    const resize = new ResizeObserver(() => {
      if (host.dataset.panning === 'true') measure();
    });
    resize.observe(pin);
    resize.observe(track);

    return () => {
      phone.removeEventListener('change', attach);
      resize.disconnect();
      unsubscribe?.();
    };
  }, []);

  return [trackHostRef, pinRef, trackRef];
};

/* ======================================================== SCROLL PROGRESS */

/** Fills a timeline rail as the visitor scrolls through it. */
export const useTimelineProgress = <T extends HTMLElement = HTMLDivElement>(): RefObject<
  T | null
> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      node.style.setProperty('--oph-timeline-progress', '1');
      return;
    }

    return onScroll(({ viewport, lag }) => {
      const rect = node.getBoundingClientRect();
      const progress = clamp((viewport * 0.65 - (rect.top + lag)) / Math.max(rect.height, 1));
      node.style.setProperty('--oph-timeline-progress', progress.toFixed(4));
    });
  }, []);

  return ref;
};

/* =============================================================== COUNTER */

/**
 * Animated number counter that starts when the element scrolls into view.
 * Eases out so the last digits settle rather than snapping.
 */
export const useCounter = (
  target: number,
  { duration = 1600, decimals = 0 }: { duration?: number; decimals?: number } = {},
): [RefObject<HTMLSpanElement | null>, string] => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = clamp((now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return [ref, value.toFixed(decimals)];
};

/* ======================================================= MICRO-INTERACTION */

/** Magnetic pointer attraction for primary CTAs. */
export const useMagnetic = <T extends HTMLElement = HTMLButtonElement>(
  strength = 0.28,
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    node.setAttribute('data-oph-magnetic', '');

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
      node.style.setProperty('--oph-magnetic-x', `${x.toFixed(2)}px`);
      node.style.setProperty('--oph-magnetic-y', `${y.toFixed(2)}px`);
    };

    const reset = () => {
      node.style.setProperty('--oph-magnetic-x', '0px');
      node.style.setProperty('--oph-magnetic-y', '0px');
    };

    node.addEventListener('pointermove', handleMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', handleMove);
      node.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [strength]);

  return ref;
};

/** Adds a ripple span on pointer-down; the CSS animation removes itself. */
export const useRipple = <T extends HTMLElement = HTMLButtonElement>(): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const handleDown = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'oph-btn__ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      node.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    node.addEventListener('pointerdown', handleDown);
    return () => node.removeEventListener('pointerdown', handleDown);
  }, []);

  return ref;
};

/** Merge several refs onto one node (e.g. magnetic + ripple on one button). */
export const mergeRefs =
  <T,>(...refs: Array<RefObject<T | null> | ((node: T | null) => void) | null | undefined>) =>
  (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else (ref as { current: T | null }).current = node;
    });
  };
