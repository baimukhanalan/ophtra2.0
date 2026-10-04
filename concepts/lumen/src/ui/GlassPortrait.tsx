import { useEffect, useRef } from 'react';
import { isTouch } from '../lib/env';

/**
 * A portrait behind glass. Until real photos are approved, the subject is a
 * typographic monogram (no invented faces). It sits out of focus behind a
 * pane and snaps sharp on hover / keyboard focus — or, on touch screens, when
 * the card reaches the middle of the viewport.
 */
export function GlassPortrait({
  monogram,
  label,
  caption,
  tone = 0,
  compact = false,
}: {
  monogram: string;
  label: string;
  caption?: string;
  tone?: number;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isTouch || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-sharp', e.isIntersecting), {
      rootMargin: '-35% 0px -35% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className={'gp' + (compact ? ' gp--compact' : '')} style={{ ['--tone' as string]: tone }}>
      <div className="gp__frame" role="img" aria-label={label}>
        <div className="gp__subject" aria-hidden="true">
          <span className="gp__halo" />
          <span className="gp__mono">{monogram}</span>
        </div>
        <span className="gp__pane" aria-hidden="true" />
        <span className="gp__rim" aria-hidden="true" />
      </div>
      {caption && <figcaption className="anno gp__cap">{caption}</figcaption>}
    </figure>
  );
}
