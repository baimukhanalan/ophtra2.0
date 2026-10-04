import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { bridge } from '../world/bridge';

/* ---------- rail store: the chapter list shown on the right edge ---------- */
type Item = { el: HTMLElement; label: string };
const rail = {
  items: [] as Item[],
  active: -1,
  snap: { items: [] as Item[], active: -1 },
  ls: new Set<() => void>(),
  emit() {
    this.snap = { items: [...this.items], active: this.active };
    this.ls.forEach((l) => l());
  },
};
export function useRail() {
  return useSyncExternalStore(
    (l) => {
      rail.ls.add(l);
      return () => rail.ls.delete(l);
    },
    () => rail.snap,
  );
}

interface Props {
  shot: string;
  label?: string;
  id?: string;
  size?: 'hero' | 'md' | 'sm' | 'auto' | 'lg';
  align?: 'center' | 'bottom' | 'top';
  pin?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

/**
 * A scroll chapter: registers its element + camera shot with the world. When
 * pinned, the content stays in view (CSS sticky — no scroll hijacking) while
 * the camera flies between this chapter's shot and the next one.
 */
export function Chapter({ shot, label, id, size, align, pin = true, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    return bridge.register(el, shot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (ref.current) bridge.update(ref.current, shot);
  }, [shot]);
  useEffect(() => {
    const el = ref.current;
    if (!el || !label) return;
    const item = { el, label };
    rail.items.push(item);
    rail.items.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    rail.emit();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          rail.active = rail.items.indexOf(item);
          rail.emit();
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      const i = rail.items.indexOf(item);
      if (i >= 0) rail.items.splice(i, 1);
      rail.emit();
    };
  }, [label]);
  return (
    <section ref={ref} id={id} className={`chapter ${className ?? ''}`} data-size={size} aria-label={rest['aria-label']}>
      {pin ? (
        <div className="pin" data-align={align}>
          <div className="wrap">{children}</div>
        </div>
      ) : (
        <div className="wrap pad">{children}</div>
      )}
    </section>
  );
}

export function Rail() {
  const { items, active } = useRail();
  if (items.length < 2) return null;
  const go = (el: HTMLElement) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } }).__lenis;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (lenis) lenis.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: bridge.reduced ? 'auto' : 'smooth' });
  };
  return (
    <nav className="rail" aria-label="Главы страницы">
      {items.map((it, i) => (
        <button key={i} type="button" aria-current={i === active ? 'true' : undefined} onClick={() => go(it.el)}>
          {String(i + 1).padStart(2, '0')} · {it.label}
        </button>
      ))}
    </nav>
  );
}
