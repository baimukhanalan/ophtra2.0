import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { env, trackProgress } from '../lib/engine';
import type { StationId } from '../lib/stations';

export const Arrow = () => (
  <svg className="arrow" viewBox="0 0 18 10" aria-hidden="true">
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const Mark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="1.2 4.036" />
    <path d="M24 50 Q50 31 76 50 Q50 69 24 50Z" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <circle cx="50" cy="50" r="7.5" fill="currentColor" />
  </svg>
);

/** Invisible camera marker: the scene flies to `id` while this box crosses the viewport centre. */
export const Station = ({ id, className, style }: { id: StationId; className?: string; style?: CSSProperties }) => (
  <div data-station={id} className={`station ${className ?? ''}`} style={style} aria-hidden="true" />
);

/** Words rise from a mask when the block enters the viewport. */
export function Split({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  accent,
}: {
  text: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  /** words (exact) rendered in italic gold */
  accent?: string[];
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`split ${className}`} data-reveal style={{ '--d': delay } as CSSProperties}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ '--i': i } as CSSProperties}>{accent?.includes(w) ? <em>{w}</em> : w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Statement that lights up word by word as it scrolls through the viewport. */
export function Scrub({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => trackProgress(ref.current!, undefined, 'through'), []);
  const words = text.split(/\s+/);
  return (
    <p ref={ref} className={`scrub ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="sw" style={{ '--t': (0.18 + 0.38 * (i / words.length)).toFixed(3) } as CSSProperties}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}

/** Number that counts up once visible. */
export function Counter({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(env.reduced ? value : 0);
  useEffect(() => {
    if (env.reduced) return;
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          setV(Math.round(value * (1 - Math.pow(1 - t, 4))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const fmt = new Intl.NumberFormat('ru-RU').format(v);
  return (
    <span ref={ref} className={`num ${className}`} aria-label={`${new Intl.NumberFormat('ru-RU').format(value)}${suffix}`}>
      <span aria-hidden="true">
        {fmt}
        {suffix}
      </span>
    </span>
  );
}

/**
 * Tall section with a sticky stage (pure CSS sticky — no JS pinning, so touch
 * scrolling stays native). `steps` markers are laid over the height; the
 * render prop receives the active step and 0..1 progress.
 */
export function Chapter({
  steps,
  stations,
  className = '',
  vh = 100,
  label,
  children,
}: {
  steps: number;
  stations?: StationId[];
  className?: string;
  vh?: number;
  label?: string;
  children: (active: number, p: number) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [p, setP] = useState(0);
  useEffect(
    () =>
      trackProgress(ref.current!, (pp) => {
        setP(Math.round(pp * 100) / 100);
        setActive(Math.min(steps - 1, Math.floor(pp * steps * 0.999)));
      }),
    [steps],
  );
  return (
    <section ref={ref} className={`chapter ${className}`} style={{ height: `${steps * vh}svh` }} aria-label={label}>
      {stations?.map((s, i) => (
        <Station key={i} id={s} style={{ position: 'absolute', left: 0, width: 1, top: `${(i / stations.length) * 100}%`, height: `${100 / stations.length}%` }} />
      ))}
      <div className="chapter__stage">{children(active, p)}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  index,
  className = '',
  accent,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  index?: string;
  className?: string;
  accent?: string[];
}) {
  return (
    <header className={`shead ${className}`}>
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          {index && <b>{index}</b>}
          {eyebrow}
        </p>
      )}
      <Split as="h2" className="h2" text={title} accent={accent} />
      {text && (
        <p className="body" data-reveal style={{ '--d': 150 } as CSSProperties}>
          {text}
        </p>
      )}
    </header>
  );
}

export function Accordion({ items }: { items: Array<{ q: string; a: ReactNode }> }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  return (
    <div className="acc">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className={`acc__item ${isOpen ? 'is-open' : ''}`} key={i}>
            <h3 className="acc__h">
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{it.q}</span>
                <i aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} className="acc__p" hidden={!isOpen}>
              <div className="acc__in">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Standard page opener: layer label, giant title, lead, actions. */
export function Hero({
  layer,
  eyebrow,
  title,
  accent,
  lead,
  children,
  station,
  className = '',
  size = 'd-xl',
}: {
  layer: string;
  eyebrow: string;
  title: string;
  accent?: string[];
  lead?: string;
  children?: ReactNode;
  station: StationId;
  className?: string;
  size?: string;
}) {
  return (
    <section className={`hero ${className}`}>
      <Station id={station} />
      <div className="wrap hero__in">
        <p className="hero__layer" data-reveal>
          <span>Слой</span> {layer}
        </p>
        <p className="eyebrow" data-reveal style={{ '--d': 120 } as CSSProperties}>
          {eyebrow}
        </p>
        <Split as="h1" className={`display ${size}`} text={title} accent={accent} delay={150} />
        {lead && (
          <p className="lead hero__lead" data-reveal style={{ '--d': 500 } as CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className="hero__act" data-reveal style={{ '--d': 650 } as CSSProperties}>
            {children}
          </div>
        )}
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span>Глубже</span>
        <i />
      </div>
    </section>
  );
}
