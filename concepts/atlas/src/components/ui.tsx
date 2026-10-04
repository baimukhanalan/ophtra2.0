import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { bridge } from '../world/bridge';
import { num } from '../lib/format';

/** Title whose words rise out of a mask. Use *word* for the gold italic accent. */
export function SplitTitle({ text, as = 'h2', className = 'h2', delay = 0, id }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; delay?: number; id?: string }) {
  const plain = text.replace(/\*/g, '');
  const parts = text.split('*');
  let i = 0;
  const nodes: ReactNode[] = [];
  parts.forEach((part, pi) => {
    const em = pi % 2 === 1;
    part.split(/(\s+)/).forEach((w, wi) => {
      if (!w) return;
      if (/^\s+$/.test(w)) {
        nodes.push(' ');
        return;
      }
      const inner = (
        <span className="st__i" style={{ '--i': i++ } as CSSProperties}>
          {w}
        </span>
      );
      nodes.push(
        <span className="st__w" key={`${pi}-${wi}`}>
          {em ? <em>{inner}</em> : inner}
        </span>,
      );
    });
  });
  return createElement(
    as,
    { className: `${className} st`, id, 'aria-label': plain, style: { '--d': delay } as CSSProperties },
    <span aria-hidden="true">{nodes}</span>,
  );
}

export function Eyebrow({ children, d }: { children: ReactNode; d?: number }) {
  return (
    <p className="eyebrow" data-reveal style={{ '--d': d ?? 0 } as CSSProperties}>
      {children}
    </p>
  );
}

export function R({ children, d = 0, as = 'div', className }: { children: ReactNode; d?: number; as?: 'div' | 'p' | 'li' | 'span'; className?: string }) {
  return createElement(as, { 'data-reveal': '', className, style: { '--d': d } as CSSProperties }, children);
}

/** Counts up once when scrolled into view. */
export function Counter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(bridge.reduced ? value : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || bridge.reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 1800);
          const eased = 1 - Math.pow(1 - k, 4);
          setV(Math.round(value * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <div className="metric" ref={ref}>
      <div className="metric__v" aria-hidden="true">
        {num(v)}
        <small>{suffix.trim()}</small>
      </div>
      <span className="sr-only">
        {num(value)}
        {suffix} {label}
      </span>
      <span className="metric__l" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

export function Arrow() {
  return (
    <svg className="btn__arrow" width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BtnLink({ to, children, ghost, sm, className }: { to: string; children: ReactNode; ghost?: boolean; sm?: boolean; className?: string }) {
  return (
    <Link to={to} className={`btn ${ghost ? 'btn--ghost' : ''} ${sm ? 'btn--sm' : ''} ${className ?? ''}`}>
      {children}
      {!ghost && <Arrow />}
    </Link>
  );
}

export function Coord({ children }: { children: ReactNode }) {
  return <span className="coord">{children}</span>;
}
