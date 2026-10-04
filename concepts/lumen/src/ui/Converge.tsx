import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/env';
import { ScrollTrigger } from '../lib/scroll';

/**
 * Scattered, defocused cards that converge into one sharp stack as the
 * section scrolls through — "years of paperwork become one profile".
 * Pure transforms + one CSS variable; the section is sticky, not pinned by JS.
 */
export function Converge({ items, core, caption }: { items: Array<{ id: string; title: string; meta: string }>; core: { title: string; meta: string }; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.style.setProperty('--k', '1');
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: (s) => el.style.setProperty('--k', s.progress.toFixed(4)),
    });
    return () => st.kill();
  }, []);
  return (
    <div ref={ref} className="converge">
      <div className="converge__frame">
        <div className="converge__field" aria-hidden="true">
          {items.map((it, i) => {
            const a = (i / items.length) * Math.PI * 2;
            return (
              <span
                key={it.id}
                className="converge__card"
                style={{
                  ['--x' as string]: `${Math.cos(a) * 38}vw`,
                  ['--y' as string]: `${Math.sin(a) * 30}vh`,
                  ['--r' as string]: `${((i * 37) % 30) - 15}deg`,
                }}
              >
                <strong>{it.title}</strong>
                <span>{it.meta}</span>
              </span>
            );
          })}
          <span className="converge__core">
            <strong>{core.title}</strong>
            <span>{core.meta}</span>
          </span>
        </div>
        <p className="converge__cap lead">{caption}</p>
      </div>
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.id}>
            {it.title}, {it.meta}
          </li>
        ))}
      </ul>
    </div>
  );
}
