import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from 'react';
import { clamp, isTouch, onScroll, prefersReducedMotion } from './scrollController';

/* ============================================================ PROGRESS VAR */

/**
 * Writes the element's passage through the viewport into CSS custom
 * properties — no React re-render per frame:
 *
 *   --p     0 → 1 while the element travels from entering (top at viewport
 *           bottom) to leaving (bottom at viewport top)
 *   --pin   0 → 1 across a pinned track (element taller than the viewport)
 *   --enter 0 → 1 while the element's top moves from the viewport bottom to
 *           the viewport top — useful for "grow while arriving" effects
 *
 * Stylesheets turn these into transforms, clip-paths and colour fills.
 *
 * The values track the native scroll offset exactly on every device, so a
 * fill, clip or transform follows the page with no trailing glide and no
 * settle-after-release. Stylesheets that use them for
 * MOVEMENT against the scroll should additionally multiply by
 * `--oph-scroll-drift`, which motion.css sets to 0 on touch.
 */
export const useProgressVars = <T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.style.setProperty('--p', '0.5');
      node.style.setProperty('--pin', '1');
      node.style.setProperty('--enter', '1');
      return;
    }

    let last = '';
    return onScroll(({ viewport }) => {
      const rect = node.getBoundingClientRect();
      // display:none (e.g. a media column hidden on phones) measures as an
      // empty box at 0,0; driving it from that only produced noise.
      if (!rect.width && !rect.height) return;
      if (rect.bottom < -viewport * 0.5 || rect.top > viewport * 1.5) return;
      /*
       * Exact position on every device. Stylesheets turn these variables into
       * transforms of text (.oph-pagehero__inner) and of pinned media; a damped
       * value kept those moving — and settling backwards against the scroll —
       * for up to a second after the wheel stopped, and let a pinned layer
       * disagree with its native sticky pin.
       */
      const top = rect.top;
      const p = clamp((viewport - top) / (viewport + rect.height));
      const pin = clamp(-top / Math.max(rect.height - viewport, 1));
      const enter = clamp((viewport - top) / viewport);
      const key = `${p.toFixed(4)}|${pin.toFixed(4)}|${enter.toFixed(4)}`;
      if (key === last) return;
      last = key;
      node.style.setProperty('--p', p.toFixed(4));
      node.style.setProperty('--pin', pin.toFixed(4));
      node.style.setProperty('--enter', enter.toFixed(4));
    });
  }, []);

  return ref;
};

/** Any element carrying the progress variables. */
export const ScrollFx = ({
  as: Tag = 'div',
  className,
  style,
  children,
  id,
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
}) => {
  const ref = useProgressVars<HTMLElement>();
  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
};

/* =============================================================== TEXT FILL */

/**
 * Statement paragraph whose words light up one by one as it scrolls through
 * the viewport — the reading pace follows the visitor's scroll.
 */
export const TextFill = ({
  text,
  as: Tag = 'p',
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) => {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const spans = Array.from(node.querySelectorAll<HTMLElement>('[data-w]'));
    if (prefersReducedMotion()) {
      spans.forEach((span) => (span.style.opacity = '1'));
      return;
    }
    let lastLit = -1;
    // Exact position: this is running text, and words that kept lighting up
    // after the wheel stopped read as the page still moving.
    return onScroll(({ viewport }) => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;
      // Fully lit when the paragraph's centre reaches 40% of the viewport.
      const start = viewport * 0.92;
      const end = viewport * 0.4;
      const centre = rect.top + rect.height / 2;
      const progress = clamp((start - centre) / (start - end));
      const lit = Math.round(progress * spans.length);
      if (lit === lastLit) return;
      lastLit = lit;
      spans.forEach((span, index) => {
        span.dataset.lit = String(index < lit);
      });
    });
  }, [text]);

  return (
    <Tag ref={ref} className={`oph-textfill ${className ?? ''}`}>
      {/* Screen readers get the sentence once; the lit words are visual only. */}
      <span className="oph-visually-hidden">{text}</span>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-w="" aria-hidden="true">
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
};

/* ============================================================ CLIP REVEAL */

/**
 * Media that opens from a narrow inset window to full bleed as it scrolls into
 * view, with a counter-zoom on the image inside.
 */
export const ClipReveal = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  const ref = useProgressVars<HTMLDivElement>();
  return (
    <div ref={ref} className={`oph-clipreveal ${className ?? ''}`} style={style}>
      <div className="oph-clipreveal__inner">{children}</div>
    </div>
  );
};

/* ============================================================ STICKY STORY */

/**
 * Pinned storytelling block: the visual stays in place while the chapters on
 * the other side scroll past; the active chapter drives the visual state.
 */
export const StickyStory = ({
  visual,
  children,
  className,
  reverse = false,
}: {
  /** Receives the active chapter index. */
  visual: (active: number) => ReactNode;
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) => {
  const chapters = Children.toArray(children);
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters.length]);

  return (
    <div className={`oph-story ${reverse ? 'oph-story--reverse' : ''} ${className ?? ''}`}>
      <div className="oph-story__visual">
        <div className="oph-story__sticky">{visual(active)}</div>
      </div>
      <div className="oph-story__chapters">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            data-index={index}
            data-active={index === active}
            className="oph-story__chapter"
          >
            {chapter}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================ STACK CARDS */

/**
 * Cards that pin one after another and stack like sheets of paper, each
 * previous card receding slightly as the next one covers it.
 */
export const StackCards = ({ children, className }: { children: ReactNode; className?: string }) => {
  const items = Children.toArray(children);
  return (
    <div className={`oph-stack-cards ${className ?? ''}`} style={{ ['--count' as string]: items.length }}>
      {items.map((item, index) => (
        <StackCard key={index} index={index}>
          {item}
        </StackCard>
      ))}
    </div>
  );
};

const StackCard = ({ children, index }: { children: ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    // Touch: the card stays full size. Scaling a sticky sheet from the main
    // thread while the compositor scrolls the one covering it made the pair
    // shimmer against each other; motion.css also unpins the stack there.
    if (!node || prefersReducedMotion() || isTouch()) return;
    const inner = node.firstElementChild as HTMLElement | null;
    if (!inner) return;
    let last = '';
    return onScroll(({ viewport }) => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;
      // Once pinned (top reached its sticky offset), measure how far the next
      // card has travelled over it via the parent flow position.
      const next = node.nextElementSibling as HTMLElement | null;
      if (!next) return;
      /*
       * Both operands are exact, measured in the same frame. Adding the damped
       * `lag` to one side only read a fast scroll (and every upward one) as the
       * next card already covering this one: an uncovered card shrank and
       * darkened, then sprang back once the wheel stopped.
       */
      const covered = clamp(1 - (next.getBoundingClientRect().top - rect.top) / Math.max(rect.height, 1));
      const value = covered.toFixed(3);
      if (value === last) return;
      last = value;
      inner.style.setProperty('--covered', value);
    });
  }, []);

  return (
    <div ref={ref} className="oph-stack-cards__item" style={{ ['--i' as string]: index }}>
      <div className="oph-stack-cards__card">{children}</div>
    </div>
  );
};
