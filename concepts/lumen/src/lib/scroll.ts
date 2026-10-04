import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { isTouch, reducedMotion } from './env';
import { FRAME_DIST, scene } from './scene-store';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrolling:
 * - desktop pointer: Lenis inertia, driven by the GSAP ticker so ScrollTrigger
 *   and the camera read the same number in the same frame;
 * - touch: native scroll, untouched (no hijacking, no lag on phones);
 * - reduced motion: native scroll.
 */
export let lenis: Lenis | null = null;

let started = false;
export const startScroll = () => {
  if (started) return;
  started = true;
  if (!isTouch && !reducedMotion) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (isTouch) {
    // Mobile URL-bar show/hide must not re-layout pinned/scrubbed sections.
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  // Page progress for the camera, computed once per frame.
  const docEl = document.documentElement;
  const measure = () => {
    scene.anchors = [...document.querySelectorAll<HTMLElement>('[data-el]')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { y: r.top + window.scrollY + r.height / 2, el: Number(el.dataset.el) };
      })
      .sort((a, b) => a.y - b.y);
    scene.anchorsDirty = false;
  };
  window.addEventListener('resize', () => (scene.anchorsDirty = true), { passive: true });
  ScrollTrigger.addEventListener('refresh', () => (scene.anchorsDirty = true));
  let frame = 0;
  gsap.ticker.add(() => {
    const max = Math.max(1, docEl.scrollHeight - window.innerHeight);
    scene.progress = Math.min(1, Math.max(0, window.scrollY / max));
    // re-measure when flagged, and cheaply every ~2 s in case images/fonts moved things
    if (scene.anchorsDirty || ++frame % 120 === 0) measure();
    scene.camZ = anchorZ(window.scrollY + window.innerHeight / 2);
  });

  if (!isTouch) {
    window.addEventListener(
      'pointermove',
      (e) => {
        scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        scene.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true },
    );
  }
};

/** Piecewise-linear camera z between the stages that frame elements. */
const anchorZ = (y: number): number | null => {
  const a = scene.anchors;
  const els = scene.preset.elements;
  if (!a.length || !els.length) return null;
  const zOf = (i: number) => (els[Math.min(i, els.length - 1)]?.z ?? 0) + FRAME_DIST;
  if (y <= a[0].y) return zOf(a[0].el) + Math.min(1.5, (a[0].y - y) / 400);
  for (let i = 0; i < a.length - 1; i++) {
    if (y <= a[i + 1].y) {
      const t = (y - a[i].y) / Math.max(1, a[i + 1].y - a[i].y);
      const s = t * t * (3 - 2 * t);
      return zOf(a[i].el) + (zOf(a[i + 1].el) - zOf(a[i].el)) * s;
    }
  }
  const last = a[a.length - 1];
  return zOf(last.el) - Math.min(4, (y - last.y) / 300);
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
};

export const scrollToEl = (el: Element | null) => {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 88;
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
};

export const stopScroll = (stop: boolean) => {
  if (!lenis) return;
  if (stop) lenis.stop();
  else lenis.start();
};

export { gsap, ScrollTrigger };
