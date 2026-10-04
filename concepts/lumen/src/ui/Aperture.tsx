import { useEffect, useRef, type ReactNode } from 'react';
import { reducedMotion } from '../lib/env';
import { ScrollTrigger } from '../lib/scroll';

/**
 * A photo (or any content) seen through an iris that opens with scroll:
 * the aperture grows from a small circle to the full frame while the image
 * comes into focus. clip-path + one filter, scrubbed — no layout work.
 */
export function Aperture({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.style.setProperty('--a', '1');
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'center 45%',
      scrub: 0.5,
      onUpdate: (s) => el.style.setProperty('--a', s.progress.toFixed(4)),
    });
    return () => st.kill();
  }, []);
  return (
    <div ref={ref} className={'aperture ' + (className ?? '')} aria-label={label}>
      <div className="aperture__clip">{children}</div>
      <span className="aperture__ring" aria-hidden="true" />
    </div>
  );
}
