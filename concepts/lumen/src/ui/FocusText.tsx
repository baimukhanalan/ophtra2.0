import { createElement, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { reducedMotion, whenReady } from '../lib/env';
import { gsap, ScrollTrigger } from '../lib/scroll';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'blockquote';

interface Props {
  as?: Tag;
  text: string;
  className?: string;
  /** 'load' focuses on mount (hero), 'scroll' is scrubbed by scroll position. */
  mode?: 'load' | 'scroll';
  delay?: number;
  /** Words (0-based) rendered in the accent style. */
  accent?: number[];
  id?: string;
  tabIndex?: number;
  after?: ReactNode;
}

/**
 * Text that goes from defocused to focused: the whole line un-blurs while each
 * word's letters close in from wide tracking. Only transforms/filter on one
 * layer — no layout, so no layout shift and no reflow per frame.
 */
export function FocusText({ as = 'h2', text, className, mode = 'scroll', delay = 0, accent, id, tabIndex, after }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('.ft');
    if (!el) return;
    if (reducedMotion) {
      el.style.setProperty('--p', '1');
      el.classList.add('is-done');
      return;
    }
    el.classList.remove('is-done');
    el.style.setProperty('--p', '0');
    if (mode === 'load') {
      const o = { p: 0 };
      let alive = true;
      let tw: gsap.core.Tween | null = null;
      whenReady().then(() => {
        if (!alive) return;
        tw = gsap.to(o, {
        p: 1,
        duration: 1.6,
        delay: 0.25 + delay,
        ease: 'expo.out',
        onUpdate: () => el.style.setProperty('--p', o.p.toFixed(4)),
        onComplete: () => el.classList.add('is-done'),
        });
      });
      return () => {
        alive = false;
        tw?.kill();
      };
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 94%',
      end: 'top 52%',
      scrub: 0.4,
      onUpdate: (self) => {
        el.style.setProperty('--p', self.progress.toFixed(4));
        el.classList.toggle('is-done', self.progress > 0.999);
      },
    });
    // If already scrolled past on mount (e.g. back navigation), show it focused.
    if (st.progress >= 1) {
      el.style.setProperty('--p', '1');
      el.classList.add('is-done');
    }
    return () => st.kill();
  }, [mode, delay, text]);

  const n = Math.max(1, words.length - 1);
  return createElement(
    as,
    { ref, className, id, tabIndex },
    <>
      <span className="sr-only">{text}</span>
      <span className="ft" aria-hidden="true">
        {words.map((w, wi) => {
          const chars = [...w];
          const mid = (chars.length - 1) / 2;
          return (
            <span key={wi}>
              <span className={'ft-w' + (accent?.includes(wi) ? ' accent' : '')} style={{ ['--wi' as string]: (wi / n).toFixed(3) }}>
                {chars.map((c, ci) => (
                  <span key={ci} className="ft-c" style={{ ['--o' as string]: (ci - mid).toFixed(2) }}>
                    {c}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </span>
          );
        })}
      </span>
      {after}
    </>,
  );
}
