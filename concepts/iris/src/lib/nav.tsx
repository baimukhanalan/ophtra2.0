import { createContext, useCallback, useContext, useEffect, useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { metaFor } from './routes';
import { env, lockScroll, refreshMarkers, scanReveals, scrollToTop } from './engine';

/**
 * Iris-aperture page transitions: the pupil closes to black over the current
 * page, the route swaps while it is dark, and the aperture opens on the next
 * page while the camera dollies to that page's first station.
 */

interface NavCtx {
  go: (to: string) => void;
}
const Ctx = createContext<NavCtx>({ go: () => undefined });
export const useGo = () => useContext(Ctx).go;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

function animate(el: HTMLElement, from: number, to: number, ms: number, ease: (t: number) => number) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const diag = Math.hypot(window.innerWidth, window.innerHeight) * 0.62;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const k = from + (to - from) * ease(t); // closedness
      el.style.setProperty('--k', k.toFixed(4));
      el.style.setProperty('--r', `${((1 - k) * diag).toFixed(1)}px`);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const raf2 = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

export function NavProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const apRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const internal = useRef(false);
  const labelRef = useRef<HTMLSpanElement>(null);

  const afterRoute = useCallback(async () => {
    await raf2();
    refreshMarkers();
    scanReveals();
    const h1 = document.querySelector<HTMLElement>('main h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, []);

  const go = useCallback(
    async (to: string) => {
      const url = new URL(to, window.location.origin);
      if (url.pathname === window.location.pathname && !url.hash) {
        scrollToTop(false);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      internal.current = true;
      const ap = apRef.current!;
      if (env.reduced) {
        navigate(to);
        scrollToTop(true);
        await afterRoute();
        busy.current = false;
        return;
      }
      lockScroll(true);
      ap.classList.add('is-active');
      if (labelRef.current) labelRef.current.textContent = metaFor(url.pathname)?.layer ?? 'Слепое пятно';
      await animate(ap, 0, 1, 620, easeInOut);
      navigate(to);
      scrollToTop(true);
      await afterRoute();
      await animate(ap, 1, 0, 1050, easeOut);
      ap.classList.remove('is-active');
      lockScroll(false);
      busy.current = false;
    },
    [navigate, afterRoute],
  );

  // Back / forward: a quick blink.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      afterRoute();
      return;
    }
    if (internal.current) {
      internal.current = false;
      return;
    }
    const ap = apRef.current!;
    scrollToTop(true);
    afterRoute();
    if (env.reduced) return;
    ap.classList.add('is-active');
    animate(ap, 1, 0, 800, easeOut).then(() => ap.classList.remove('is-active'));
  }, [location.pathname, afterRoute]);

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div ref={apRef} className="aperture" aria-hidden="true">
        <div className="aperture__iris" />
        <div className="aperture__shade" />
        <span ref={labelRef} className="aperture__label" />
      </div>
    </Ctx.Provider>
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that travels through the iris transition. */
export function IrisLink({ to, onClick, children, ...rest }: LinkProps) {
  const go = useGo();
  const loc = useLocation();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };
  const current = loc.pathname === to ? 'page' : undefined;
  return (
    <a href={to} onClick={handle} aria-current={current} {...rest}>
      {children}
    </a>
  );
}
