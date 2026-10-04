import { useEffect, useRef, type ReactNode } from 'react';
import { clamp, onScroll, prefersReducedMotion } from './scrollController';

/**
 * Scroll-driven scenes.
 *
 * Each one writes only transform / opacity / filter / clip-path from inside the
 * shared scroll loop, so adding scenes to a page costs no extra listeners and
 * no React renders per frame.
 */

/** Smoothstep — removes the linear feel from scroll-linked motion. */
const ease = (t: number) => t * t * (3 - 2 * t);

/* ================================================================== ORBIT */

export interface OrbitCard {
  id: string;
  title: string;
  meta: string;
}

/**
 * Record orbit.
 *
 * Scattered examinations circle the patient at arm's length, then draw inward
 * and collapse into a single file as the section scrolls. It reuses the site's
 * iris motif — rings around a centre — rather than moving the reader through
 * depth, so it reads as "one eye, one history" instead of a corridor.
 */
export const RecordOrbit = ({
  cards,
  heading,
  caption,
  centreLabel,
  length = 320,
}: {
  cards: OrbitCard[];
  heading: ReactNode;
  caption: ReactNode;
  centreLabel: ReactNode;
  length?: number;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-orbit]'));
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      items.forEach((el) => {
        el.style.position = 'relative';
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      return;
    }

    const seeds = items.map((el, i) => ({
      el,
      i,
      angle: (i / items.length) * Math.PI * 2 - Math.PI / 2,
      /*
       * The card is centred from JS rather than with translate(-50%, -50%).
       * A percentage translate resolves against the card's own box, and these
       * cards are an odd number of pixels tall, so -50% lands on a half pixel —
       * which no amount of rounding on the orbital offsets can cancel. Halving
       * the measured size ourselves keeps the whole transform in pixels.
       */
      halfW: 0,
      halfH: 0,
    }));

    /**
     * The orbit radius is bounded by the card's own size, otherwise cards on
     * the horizontal extremes hang off a narrow screen.
     *
     * Measured only on resize, and from offsetWidth/offsetHeight rather than
     * getBoundingClientRect: the layout box ignores the scale this very handler
     * applies, so the radius stays constant instead of breathing with the
     * animation. Measuring per frame also forced a synchronous reflow between
     * the writes of one subscriber and the reads of the next, which is exactly
     * the pattern the shared scroll loop exists to avoid.
     */
    let radius = 60;

    const measureRadius = () => {
      seeds.forEach((seed) => {
        seed.halfW = seed.el.offsetWidth / 2;
        seed.halfH = seed.el.offsetHeight / 2;
      });
      const card = seeds[0];
      radius = Math.max(
        60,
        Math.min(
          stage.offsetWidth / 2 - card.halfW - 6,
          (stage.offsetHeight / 2 - card.halfH - 6) / 0.72,
        ),
      );
    };

    measureRadius();
    const resize = new ResizeObserver(measureRadius);
    resize.observe(stage);

    const unsubscribe = onScroll(({ viewport }) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;

      const travel = Math.max(wrap.offsetHeight - viewport, 1);
      // Exact position: the stage is pinned by native sticky, so the choreography
      // must reach its first / last beat on the frame the pin engages / releases.
      const progress = clamp(-rect.top / travel);

      // Three beats: arrive on the ring, rotate, then collapse to the centre.
      const arrive = ease(clamp(progress / 0.28));
      const spin = clamp((progress - 0.2) / 0.5) * Math.PI * 0.9;
      const collapse = ease(clamp((progress - 0.66) / 0.28));

      /*
       * Only translate and opacity, never scale.
       *
       * Both are compositor-only: the card is rasterised once and the GPU moves
       * and fades that texture, so the offsets can stay fractional and the
       * motion is perfectly smooth. A transform scale is the exception — the
       * browser re-rasterises the layer to keep the text crisp at the new
       * scale, and doing that every frame under thirteen cards of type is what
       * made this section shimmer. The arrival and the collapse read just as
       * well from distance and fade alone.
       */
      seeds.forEach((card) => {
        const angle = card.angle + spin;
        const r = radius * arrive * (1 - collapse);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * 0.72;

        card.el.style.transform =
          `translate3d(${(x - card.halfW).toFixed(2)}px, ${(y - card.halfH).toFixed(2)}px, 0)`;
        card.el.style.opacity = (arrive * (1 - collapse * 0.95)).toFixed(3);
      });

      if (coreRef.current) {
        coreRef.current.style.opacity = collapse.toFixed(3);
      }
      if (captionRef.current) {
        captionRef.current.style.opacity = collapse.toFixed(3);
        captionRef.current.style.transform = `translate3d(0, ${((1 - collapse) * 18).toFixed(2)}px, 0)`;
      }
    });

    return () => {
      resize.disconnect();
      unsubscribe();
    };
  }, []);

  return (
    <div ref={wrapRef} className="oph-orbit" style={{ height: `${length}vh` }}>
      <div className="oph-orbit__pin">
        <div className="oph-orbit__heading">{heading}</div>

        <div ref={stageRef} className="oph-orbit__stage">
          <span className="oph-orbit__ring oph-orbit__ring--outer" aria-hidden="true" />
          <span className="oph-orbit__ring oph-orbit__ring--inner" aria-hidden="true" />

          {cards.map((card) => (
            <article key={card.id} data-orbit className="oph-orbit__card">
              <span className="oph-orbit__card-meta">{card.meta}</span>
              <strong className="oph-orbit__card-title">{card.title}</strong>
            </article>
          ))}

          <div ref={coreRef} className="oph-orbit__core">
            {centreLabel}
          </div>
        </div>

        <div ref={captionRef} className="oph-orbit__caption">
          {caption}
        </div>
      </div>
    </div>
  );
};
