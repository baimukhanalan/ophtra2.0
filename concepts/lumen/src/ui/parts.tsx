import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { reducedMotion } from '../lib/env';
import { gsap, ScrollTrigger, scrollToEl } from '../lib/scroll';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from './FocusText';

/* -------------------------------------------------------------- icons */

export const Arrow = () => (
  <svg className="arr" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Cross-section of a lens with a given curvature — the signature glyph. */
export function LensGlyph({ curve = 0.4, size = 56, meniscus = false, className }: { curve?: number; size?: number; meniscus?: boolean; className?: string }) {
  const h = 6 + curve * 16;
  const w = 3;
  const top = 4;
  const bot = 52;
  const cx = 28;
  const d = meniscus
    ? `M${cx - w} ${top} Q${cx + h} 28 ${cx - w} ${bot} L${cx + w} ${bot} Q${cx + h * 1.9} 28 ${cx + w} ${top} Z`
    : `M${cx - w} ${top} Q${cx - w - h} 28 ${cx - w} ${bot} L${cx + w} ${bot} Q${cx + w + h} 28 ${cx + w} ${top} Z`;
  return (
    <svg className={'lens-glyph ' + (className ?? '')} width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <line x1="0" y1="28" x2="56" y2="28" className="lens-glyph__axis" />
      <path d={d} className="lens-glyph__glass" />
      <path d={`M2 18 L${cx} 18 L54 ${28 + (1 - curve) * 4}`} className="lens-glyph__ray" />
      <path d={`M2 38 L${cx} 38 L54 ${28 - (1 - curve) * 4}`} className="lens-glyph__ray" />
    </svg>
  );
}

/* -------------------------------------------------------------- headings */

export function SectionHead({
  eyebrow,
  title,
  text,
  accent,
  align = 'left',
  id,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  accent?: number[];
  align?: 'left' | 'center';
  id?: string;
  children?: ReactNode;
}) {
  return (
    <header className={'shead' + (align === 'center' ? ' shead--center' : '')}>
      {eyebrow && <p className="eyebrow rv">{eyebrow}</p>}
      <FocusText as="h2" className="h2" text={title} accent={accent} id={id} />
      {text && <p className="body rv shead__text">{text}</p>}
      {children}
    </header>
  );
}

/** Element counter in the optical-bench vocabulary: «ЭЛЕМЕНТ 02 / 05». */
export const ElementTag = ({ n, of, label }: { n: number; of: number; label?: string }) => (
  <p className="anno eltag" aria-hidden="true">
    <span className="eltag__dot" />
    Элемент {String(n).padStart(2, '0')} / {String(of).padStart(2, '0')}
    {label ? <em> · {label}</em> : null}
  </p>
);

/* -------------------------------------------------------------- hero */

export function Hero({
  eyebrow,
  title,
  accent,
  lead,
  actions,
  aside,
  tag,
  size = 'l',
  className,
  children,
  el = 0,
}: {
  el?: number;
  eyebrow: string;
  title: string;
  accent?: number[];
  lead?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  tag?: string;
  size?: 'l' | 'xl';
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className={'hero stage ' + (className ?? '')} data-stage data-el={el}>
      <div className="wrap hero__in">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{eyebrow}</p>
          <FocusText
            as="h1"
            mode="load"
            className={'h1' + (size === 'xl' ? ' h1--xl' : title.length > 30 ? ' h1--m' : '')}
            text={title}
            accent={accent}
          />
          {lead && (
            <p className="lead rv hero__lead" style={{ '--d': '0.5s' } as CSSProperties}>
              {lead}
            </p>
          )}
          {actions && (
            <div className="row hero__actions rv" style={{ '--d': '0.7s' } as CSSProperties}>
              {actions}
            </div>
          )}
          {children}
        </div>
        {aside && <div className="hero__aside">{aside}</div>}
      </div>
      {tag && (
        <div className="wrap hero__foot" aria-hidden="true">
          <span className="anno">{tag}</span>
          <span className="hero__scroll anno">
            Листайте <i />
          </span>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- counter */

export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + suffix;
    if (reducedMotion) {
      el.textContent = fmt(value);
      return;
    }
    const o = { v: 0 };
    el.textContent = fmt(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(o, { v: value, duration: 1.8, ease: 'expo.out', onUpdate: () => (el.textContent = fmt(o.v)) }),
    });
    return () => st.kill();
  }, [value, suffix]);
  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {new Intl.NumberFormat('ru-RU').format(value) + suffix}
      </span>
      <span className="sr-only">{new Intl.NumberFormat('ru-RU').format(value) + suffix}</span>
    </span>
  );
}

/* -------------------------------------------------------------- accordion */

export function Accordion({ items, name }: { items: Array<{ q: string; a: ReactNode }>; name?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  return (
    <div className="acc" data-name={name}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={'acc__item' + (isOpen ? ' is-open' : '')}>
            <h3 className="acc__h">
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{it.q}</span>
                <span className="acc__icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="acc__p" id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!isOpen}>
              <div className="acc__body">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- pinned chapters */

/**
 * A pinned chapter: the frame sticks (CSS sticky — native, no scroll-jacking,
 * no jitter on phones) while the scroll position steps through items.
 */
export function PinnedSteps<T>({
  items,
  render,
  aside,
  className,
  label,
}: {
  items: T[];
  render: (item: T, i: number, active: number) => ReactNode;
  aside?: (active: number, progress: number) => ReactNode;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const i = Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999));
        setActive((a) => (a === i ? a : i));
        el.style.setProperty('--cp', self.progress.toFixed(4));
        setProg((p) => (Math.abs(p - self.progress) > 0.02 ? self.progress : p));
      },
    });
    return () => st.kill();
  }, [items.length]);
  return (
    <div ref={ref} className={'pin ' + (className ?? '')} style={{ height: `${Math.max(2, items.length) * 70 + 30}svh` }}>
      <div className="pin__frame" aria-label={label}>
        {aside && <div className="pin__aside">{aside(active, prog)}</div>}
        <ol className="pin__list" role="list">
          {items.map((it, i) => (
            <li key={i} className={'pin__item' + (i === active ? ' is-active' : i < active ? ' is-past' : '')}>
              {render(it, i, active)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- CTA */

export function LensCta({ title, text, primary, secondary, el }: { title: string; text?: string; primary?: { to: string; label: string }; secondary?: { to: string; label: string }; el?: number }) {
  const p = primary ?? { to: R.booking, label: 'Записаться на консультацию' };
  return (
    <section className="cta stage" data-stage data-el={el}>
      <div className="wrap cta__in">
        <div className="cta__ring" aria-hidden="true" />
        <FocusText as="h2" className="h2 cta__title" text={title} />
        {text && <p className="lead rv cta__text">{text}</p>}
        <div className="row cta__actions rv">
          <TLink to={p.to} className="btn">
            {p.label} <Arrow />
          </TLink>
          {secondary && (
            <TLink to={secondary.to} className="btn btn--ghost">
              {secondary.label}
            </TLink>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- page meta */

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} · LUMEN · Dr Kulmaganbetov`;
  }, [title]);
};

/** Tracks the cursor over an element into --mx/--my (for lens highlights). */
export const trackLight = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
};

/** In-page jump that uses the smooth scroller and moves focus to the target. */
export function JumpLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={'#' + to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(to);
        scrollToEl(el);
        if (el) {
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
        }
      }}
    >
      {children}
    </a>
  );
}
