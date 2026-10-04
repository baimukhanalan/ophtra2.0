import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isTouch, reducedMotion, whenReady } from '../lib/env';
import { scene } from '../lib/scene-store';
import { gsap, ScrollTrigger, scrollToEl, scrollToTop, stopScroll } from '../lib/scroll';
import { preload } from '../routes';

/**
 * Page transitions: the camera flies THROUGH the nearest lens.
 * out — the bench camera accelerates forward and widens, the page magnifies
 *       and defocuses, a lens rim rushes towards the viewer;
 * in  — the next page appears refracted (magnified, blurred, seen through a
 *       small aperture) and snaps into focus as the aperture opens.
 */

interface Ctx {
  go: (to: string) => void;
}
const TransitionContext = createContext<Ctx>({ go: () => {} });
export const useGo = () => useContext(TransitionContext).go;

const useBlur = !isTouch; // filter on a full page is too costly on phones

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const busy = useRef(false);
  const first = useRef(true);
  const lensRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (to: string) => {
      const here = location.pathname + location.search;
      if (busy.current) return;
      if (to === here) {
        scrollToTop();
        return;
      }
      if (to.split(/[?#]/)[0] === location.pathname) {
        // same page, different filter / anchor: no lens flight
        navigate(to);
        const hash = to.split('#')[1];
        if (hash) setTimeout(() => scrollToEl(document.getElementById(hash)), 50);
        return;
      }
      const main = document.getElementById('main');
      const ready = preload(to);
      if (reducedMotion || !main) {
        ready.then(() => navigate(to));
        return;
      }
      busy.current = true;
      document.documentElement.classList.add('is-warping');
      stopScroll(true);
      const tl = gsap.timeline({
        onComplete: () => {
          ready.then(() => navigate(to));
        },
      });
      tl.to(scene, { warp: 1, duration: 0.62, ease: 'power3.in' }, 0);
      tl.to(
        main,
        {
          scale: 1.22,
          opacity: 0,
          filter: useBlur ? 'blur(16px)' : 'none',
          duration: 0.56,
          ease: 'power3.in',
          transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
        },
        0,
      );
      if (lensRef.current) {
        tl.fromTo(lensRef.current, { scale: 0.18, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.62, ease: 'power3.in' }, 0);
      }
    },
    [location.pathname, location.search, navigate],
  );

  // Every location change (link, back/forward, first load) plays the "in".
  useLayoutEffect(() => {
    const main = document.getElementById('main');
    const lens = lensRef.current;
    const wasFirst = first.current;
    first.current = false;
    scrollToTop();
    stopScroll(false);
    if (!main) return;
    if (reducedMotion) {
      busy.current = false;
      gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.4, clearProps: 'opacity' });
      if (!wasFirst) focusHeading(main);
      return;
    }
    scene.warp = -1;
    const tl = gsap.timeline({
      paused: wasFirst,
      onComplete: () => {
        busy.current = false;
        document.documentElement.classList.remove('is-warping');
        ScrollTrigger.refresh();
      },
    });
    tl.to(scene, { warp: 0, duration: 1.3, ease: 'expo.out' }, 0);
    tl.fromTo(
      main,
      {
        opacity: 0.2,
        scale: 1.14,
        filter: useBlur ? 'blur(14px) saturate(1.3)' : 'none',
        clipPath: 'circle(9vmax at 50% 50vh)',
        transformOrigin: '50% 50vh',
      },
      {
        opacity: 1,
        scale: 1,
        filter: useBlur ? 'blur(0px) saturate(1)' : 'none',
        clipPath: 'circle(150vmax at 50% 50vh)',
        duration: 1.05,
        ease: 'expo.out',
        clearProps: 'transform,filter,clipPath,opacity,transformOrigin',
      },
      0,
    );
    if (lens) {
      tl.fromTo(lens, { scale: 1, opacity: 1 }, { scale: 4.2, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0);
    }
    if (!wasFirst) tl.add(() => focusHeading(main), 0.2);
    if (location.hash) {
      const id = location.hash.slice(1);
      tl.add(() => scrollToEl(document.getElementById(id)), 0.9);
    }
    if (wasFirst) {
      gsap.set(main, { opacity: 0 });
      whenReady().then(() => tl.play());
    }
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div className="warp-lens" ref={lensRef} aria-hidden="true">
        <span />
      </div>
    </TransitionContext.Provider>
  );
}

const focusHeading = (main: HTMLElement) => {
  const h = main.querySelector<HTMLElement>('h1');
  if (h) {
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }
};

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

/** A real link (href, middle-click, copy) whose left-click flies through a lens. */
export const TLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TLink({ to, onClick, ...rest }, ref) {
  const go = useGo();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;
    e.preventDefault();
    go(to);
  };
  return <Link ref={ref} to={to} onClick={handle} onPointerEnter={() => preload(to)} onFocus={() => preload(to)} {...rest} />;
});
