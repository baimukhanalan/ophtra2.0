import { useEffect, useRef, type RefObject } from 'react';

/**
 * Pauses looping decorative animations while they are off screen.
 *
 * The illustrations (orbiting rings, float, breathe), the marquee ribbon and
 * the assistant launcher's pulse are all `animation: … infinite`. Left alone
 * they keep producing frames for the whole session no matter where the visitor
 * has scrolled to — several of them at once on most pages — which on a phone is
 * a constant compositor and battery cost competing with the scroll itself.
 *
 * One shared observer marks each registered root, and a single CSS rule pauses
 * every animation inside a root that is not visible. Paused is the default so
 * nothing runs before the observer has had its first callback.
 */

const ATTRIBUTE = 'data-oph-loop';

let observer: IntersectionObserver | undefined;
const roots = new Set<HTMLElement>();

const setState = (node: HTMLElement, running: boolean) => {
  node.setAttribute(ATTRIBUTE, running && !document.hidden ? 'running' : 'paused');
};

const getObserver = () => {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => setState(entry.target as HTMLElement, entry.isIntersecting));
    },
    // A little margin so an animation is already moving by the time it is read.
    { rootMargin: '15% 0px' },
  );

  // A backgrounded tab still runs CSS animations; stop them with the page.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    roots.forEach((node) => node.setAttribute(ATTRIBUTE, 'paused'));
  });

  return observer;
};

export const useLoopPause = <T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.setAttribute(ATTRIBUTE, 'running');
      return;
    }

    node.setAttribute(ATTRIBUTE, 'paused');
    roots.add(node);
    const shared = getObserver();
    shared.observe(node);

    return () => {
      shared.unobserve(node);
      roots.delete(node);
    };
  }, []);

  return ref;
};
