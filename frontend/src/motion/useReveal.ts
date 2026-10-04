import { useEffect, useRef, type RefObject } from 'react';
import { isTouch } from './scrollController';

/**
 * Lazy reveal on scroll.
 *
 * Uses IntersectionObserver (not the scroll loop) because the browser can
 * evaluate intersections off the main thread — reveals stay free even with
 * hundreds of tracked elements on a page.
 */

export interface RevealOptions {
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
  /** Extra margin around the root; negative bottom delays the trigger. */
  rootMargin?: string;
  /** Replay the animation when the element leaves and re-enters. */
  once?: boolean;
  /** Delay in ms before this element animates. */
  delay?: number;
}

const observers = new Map<string, IntersectionObserver>();
const callbacks = new WeakMap<Element, (visible: boolean) => void>();

/**
 * Where the reveal fires, relative to the viewport.
 *
 * On a mouse the trigger is held back (negative bottom) so a block animates
 * once it is properly in view. On touch any in-view trigger arrives too late:
 * a fling crosses a 12% band in 20–60ms, so blocks reached the screen at
 * opacity ~0 and the page arrived blank. Touch therefore starts the (short,
 * opacity-only) fade a full screen ahead, so it is settled when it scrolls in.
 */
const defaultRootMargin = () => (isTouch() ? '0px 0px 100% 0px' : '0px 0px -12% 0px');

const getObserver = (threshold: number, rootMargin: string) => {
  const key = `${threshold}|${rootMargin}`;
  let observer = observers.get(key);
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callbacks.get(entry.target)?.(entry.isIntersecting);
      });
    },
    { threshold, rootMargin },
  );
  observers.set(key, observer);
  return observer;
};

export const useReveal = <T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): RefObject<T | null> => {
  const { threshold = 0.12, rootMargin = defaultRootMargin(), once = true, delay = 0 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (delay > 0) node.style.setProperty('--oph-reveal-delay', `${delay}ms`);

    if (typeof IntersectionObserver === 'undefined') {
      node.dataset.visible = 'true';
      return;
    }

    const observer = getObserver(threshold, rootMargin);
    // Touch never replays: a block that hides when it leaves and rises again
    // when a flick brings it back is movement the visitor did not ask for.
    const single = once || isTouch();
    let release = 0;
    callbacks.set(node, (visible) => {
      if (visible) {
        // Already shown (a `once: false` element bouncing on the threshold):
        // re-setting the attribute would restart nothing, but re-arming the
        // release timer would.
        if (node.dataset.visible === 'true') return;
        node.dataset.visible = 'true';
        if (single) observer.unobserve(node);
        // A revealed element is static. Releasing will-change here (rather than
        // only in CSS) guarantees the layer is dropped, so a long page does not
        // accumulate dozens of promoted layers for the whole session.
        // Waits out the longest entrance (1.1s on desktop) plus this element's
        // own stagger delay, so the hint is never dropped mid-animation.
        window.clearTimeout(release);
        release = window.setTimeout(() => {
          node.style.willChange = 'auto';
          node
            .querySelectorAll<HTMLElement>('.oph-split-word > span')
            .forEach((word) => (word.style.willChange = 'auto'));
        }, 1800 + delay);
      } else if (!single) {
        node.dataset.visible = 'false';
      }
    });

    observer.observe(node);
    return () => {
      window.clearTimeout(release);
      observer.unobserve(node);
      callbacks.delete(node);
    };
  }, [threshold, rootMargin, once, delay]);

  return ref;
};

/**
 * Stagger container: assigns an increasing reveal delay to every direct
 * `[data-oph-reveal]` descendant that is not already inside a nested stagger.
 */
export const useStagger = <T extends HTMLElement = HTMLDivElement>(
  step = 90,
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const assign = () => {
      const items = Array.from(
        container.querySelectorAll<HTMLElement>('[data-oph-reveal]'),
      ).filter((item) => item.closest('[data-oph-stagger]') === container);

      // Items revealed together share a row; the delay restarts every six so
      // cards far down a long list never wait seconds to appear.
      items.forEach((item, index) => {
        item.style.setProperty('--oph-reveal-delay', `${(index % 6) * step}ms`);
      });
    };

    assign();

    // Cards can arrive asynchronously (fetched lists); keep delays coherent.
    const mutation = new MutationObserver(assign);
    mutation.observe(container, { childList: true, subtree: true });
    return () => mutation.disconnect();
  }, [step]);

  return ref;
};
