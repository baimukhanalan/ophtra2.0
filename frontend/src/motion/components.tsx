import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { onScroll, prefersReducedMotion } from './scrollController';
import { useReveal, useStagger } from './useReveal';
import { useLoopPause } from './useLoopPause';
import {
  mergeRefs,
  useAutoRail,
  useCounter,
  useHorizontalScroll,
  useTimelineProgress,
} from './hooks';

/* ================================================================ REVEAL */

type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'fade';

// Travel is expressed through --oph-reveal-distance so the touch override in
// tokens.css shortens every variant at once.
const D = 'var(--oph-reveal-distance)';

const variantVars: Record<RevealVariant, CSSProperties> = {
  up: { ['--oph-reveal-y' as string]: D },
  down: { ['--oph-reveal-y' as string]: `calc(${D} * -1)` },
  left: { ['--oph-reveal-x' as string]: `calc(${D} * 1.15)`, ['--oph-reveal-y' as string]: '0px' },
  right: { ['--oph-reveal-x' as string]: `calc(${D} * -1.15)`, ['--oph-reveal-y' as string]: '0px' },
  scale: { ['--oph-reveal-scale' as string]: '0.94', ['--oph-reveal-y' as string]: `calc(${D} * 0.5)` },
  blur: { ['--oph-reveal-y' as string]: `calc(${D} * 0.65)` },
  fade: { ['--oph-reveal-y' as string]: '0px' },
};

export interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/** Fade/slide a block in the first time it enters the viewport. */
export const Reveal = ({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  threshold = 0.12,
  once = true,
  className,
  style,
  id,
}: RevealProps) => {
  const ref = useReveal<HTMLElement>({ threshold, once, delay });

  return (
    <Tag
      ref={ref}
      id={id}
      data-oph-reveal={variant === 'blur' ? 'blur' : ''}
      className={className}
      style={{ ...variantVars[variant], ...style }}
    >
      {children}
    </Tag>
  );
};

/** Applies an increasing reveal delay to every `Reveal` child. */
export const Stagger = ({
  children,
  as: Tag = 'div',
  step = 90,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  step?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const ref = useStagger<HTMLElement>(step);
  return (
    <Tag ref={ref} data-oph-stagger="" className={className} style={style}>
      {children}
    </Tag>
  );
};

/* ============================================================= SPLIT TEXT */

/**
 * Headline that rises word by word out of its own baseline.
 * Falls back to plain text when motion is reduced.
 */
export const SplitText = ({
  text,
  as: Tag = 'h2',
  className,
  step = 60,
  highlight,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  step?: number;
  /** Optional word (case-insensitive) rendered in the brand colour. */
  highlight?: string;
}) => {
  const ref = useReveal<HTMLElement>({ threshold: 0.2 });
  const words = text.split(' ');
  const target = highlight?.toLocaleLowerCase();

  return (
    <Tag ref={ref} data-oph-reveal="fade" className={className} style={{ ['--oph-reveal-y' as string]: '0px' }}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="oph-split-word"
          style={{ ['--oph-reveal-delay' as string]: `${index * step}ms` }}
        >
          <span style={target && word.toLocaleLowerCase().replace(/[.,!?]/g, '') === target ? { color: 'var(--oph-primary)' } : undefined}>
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
};

/* =========================================================== IMAGE REVEAL */

/** Masked image reveal with a slow settle-in zoom. */
export const ImageReveal = ({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.18, delay });
  return (
    <div ref={ref} className={`oph-image-reveal ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
};

/* ================================================================ COUNTER */

/** Number that counts up when scrolled into view. */
export const Counter = ({
  value,
  decimals = 0,
  prefix,
  suffix,
  duration,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const [ref, display] = useCounter(value, { decimals, ...(duration ? { duration } : {}) });
  const locale = typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en-US' : 'ru-RU';
  const format = (n: number) =>
    `${prefix ?? ''}${n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix ?? ''}`;
  // The final value sits invisibly in the same grid cell, so the counter
  // occupies its finished width from the first frame and nothing beside it
  // shifts while the digits (and the thousands separator) appear.
  return (
    <span className="oph-counter" ref={ref}>
      <span className="oph-counter__live">{format(Number(display))}</span>
      <span className="oph-counter__final" aria-hidden="true">
        {format(value)}
      </span>
    </span>
  );
};

/* ======================================================== SCROLL PROGRESS */

/** Thin brand bar that tracks reading progress across the page. */
export const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return onScroll(({ smoothProgress }) => {
      node.style.setProperty('--oph-scroll-progress', smoothProgress.toFixed(4));
    });
  }, []);

  return <div ref={ref} className="oph-scroll-progress" aria-hidden="true" />;
};

/* ========================================================= PREMIUM CURSOR */

/** Soft ring cursor that expands over interactive targets. Desktop only. */
export const PremiumCursor = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let frame = 0;
    let x = -100;
    let y = -100;
    let currentX = -100;
    let currentY = -100;
    let lastTime = 0;

    const render = (now: number) => {
      frame = 0;
      // Frame-rate independent follow (the old fixed 0.22 per frame ran twice
      // as fast at 120Hz): ~0.22 of the gap per 16.7ms.
      const elapsed = lastTime ? Math.min(now - lastTime, 64) : 16.7;
      lastTime = now;
      const k = 1 - Math.pow(0.78, elapsed / 16.7);
      currentX += (x - currentX) * k;
      currentY += (y - currentY) * k;
      if (Math.abs(x - currentX) < 0.1 && Math.abs(y - currentY) < 0.1) {
        currentX = x;
        currentY = y;
      }
      node.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      // Park once the ring has arrived: an idle pointer costs no frames.
      if (currentX !== x || currentY !== y) frame = requestAnimationFrame(render);
      else lastTime = 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      node.dataset.active = 'true';
      wake();
    };

    const resolveHover = (target: Element | null) => {
      const interactive = Boolean(target?.closest('a, button, [role="button"], input, select, textarea'));
      const text = !interactive && Boolean(target?.closest('p, li, blockquote, h1, h2, h3, td'));
      // Write only on change: every attribute write restyles the ring.
      if (node.dataset.hovering !== String(interactive)) node.dataset.hovering = String(interactive);
      if (node.dataset.text !== String(text)) node.dataset.text = String(text);
    };

    /*
     * While the wheel scrolls the page under a still pointer, the browser fires
     * pointerover for every link and paragraph that passes beneath it. Acting
     * on those made the ring grow, shrink and blink (hidden over text) dozens
     * of times per scroll. Hover changes are therefore ignored while scrolling;
     * once the page has been still for SCROLL_IDLE ms, the element actually
     * under the pointer is resolved once.
     */
    const SCROLL_IDLE = 150;
    let scrolling = false;
    let idleTimer = 0;
    const handleScroll = () => {
      scrolling = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        scrolling = false;
        if (node.dataset.active === 'true') resolveHover(document.elementFromPoint(x, y));
      }, SCROLL_IDLE);
    };

    // Hover state is resolved on pointerover, which fires only when the target
    // element changes — running closest() on every pointermove was a DOM walk
    // per mouse pixel.
    const handleOver = (event: PointerEvent) => {
      if (scrolling) return;
      resolveHover(event.target as Element | null);
    };

    const handleLeave = () => {
      node.dataset.active = 'false';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('pointerleave', handleLeave);
    wake();

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('pointerleave', handleLeave);
      window.clearTimeout(idleTimer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="oph-cursor" aria-hidden="true" />;
};

/* ================================================================ MARQUEE */

/** Infinite ribbon; the content is duplicated so the loop is seamless. */
export const Marquee = ({
  children,
  duration = 34,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) => {
  const ref = useLoopPause<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`oph-marquee ${className ?? ''}`}
      style={{ ['--oph-marquee-duration' as string]: `${duration}s` }}
      aria-hidden="true"
    >
      <div className="oph-marquee__group">{children}</div>
      <div className="oph-marquee__group">{children}</div>
    </div>
  );
};

/* =============================================================== TIMELINE */

/** Vertical timeline whose rail fills as the visitor scrolls past it. */
export const Timeline = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useTimelineProgress<HTMLOListElement>();
  return (
    <ol ref={ref} className={`oph-timeline ${className ?? ''}`}>
      {children}
    </ol>
  );
};

export const TimelineItem = ({ children }: { children: ReactNode }) => {
  const ref = useReveal<HTMLLIElement>({ threshold: 0.3 });
  return (
    <li ref={ref} className="oph-timeline__item" data-oph-reveal="">
      {children}
    </li>
  );
};

/* ======================================================= HORIZONTAL SCROLL */

/** Panels that slide sideways while the section is pinned. */
export const HorizontalScroll = ({
  children,
  length = 300,
  className,
}: {
  children: ReactNode;
  length?: number;
  className?: string;
}) => {
  const [trackRef, innerRef] = useHorizontalScroll<HTMLDivElement>();
  return (
    <div
      ref={trackRef}
      className={`oph-hscroll ${className ?? ''}`}
      style={{ ['--oph-hscroll-length' as string]: length }}
    >
      <div className="oph-hscroll__pin">
        <div ref={innerRef} className="oph-hscroll__track">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ============================================================== AUTO RAIL */

/**
 * Card row that pans itself on phones and is an ordinary grid above 768px.
 * Children keep their own reveal animations.
 */
export const AutoRail = ({
  children,
  step = 90,
  className,
  style,
}: {
  children: ReactNode;
  /** Stagger step for the children's own reveals. */
  step?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const [hostRef, pinRef, trackRef] = useAutoRail<HTMLDivElement>();
  const staggerRef = useStagger<HTMLDivElement>(step);

  return (
    <div ref={hostRef} className="oph-autorail" style={style}>
      <div ref={pinRef} className="oph-autorail__pin">
        <div
          ref={mergeRefs(trackRef, staggerRef)}
          data-oph-stagger=""
          className={`oph-autorail__track ${className ?? ''}`}
        >
          {children}
        </div>
      </div>
      {/* The scroll room the pinned rail pans across. It has to be a sibling in
          normal flow, not padding on the host: a sticky element can only travel
          inside its parent's CONTENT box, and padding sits outside it. */}
      <div className="oph-autorail__spacer" aria-hidden="true" />
    </div>
  );
};

/* ============================================================ TYPING TEXT */

/** Rotating headline word used in the hero. Pauses when off-screen. */
export const RotatingWord = ({ words, interval = 2600 }: { words: string[]; interval?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      key={index}
      style={{
        display: 'inline-block',
        color: 'var(--oph-primary)',
        animation: 'oph-page-in 520ms var(--oph-ease-out)',
      }}
    >
      {words[index]}
    </span>
  );
};
