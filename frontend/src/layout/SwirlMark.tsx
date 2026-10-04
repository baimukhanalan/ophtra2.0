/**
 * Vector rebuild of the brand's iris swirl: twelve crescent blades around a
 * centre. Used by the logo reveal and as a decorative watermark; the header
 * and footer lockups still use the supplied artwork.
 */

const R = 50;
const BLADES = 12;
const BLADE_WIDTH = 16; // degrees of arc per blade

const polar = (deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return `${(R * Math.cos(rad)).toFixed(2)} ${(R * Math.sin(rad)).toFixed(2)}`;
};

export const BLADE_PATHS = Array.from({ length: BLADES }, (_, i) => {
  const start = (i * 360) / BLADES;
  return `M0 0A${R * 0.6} ${R * 0.6} 0 0 0 ${polar(start)}A${R} ${R} 0 0 1 ${polar(start + BLADE_WIDTH)}A${R * 0.68} ${R * 0.68} 0 0 1 0 0Z`;
});

export const SwirlMark = ({
  className,
  animated = false,
}: {
  className?: string;
  /** Adds the blade-by-blade assembly used by scroll scenes. */
  animated?: boolean;
}) => (
  <svg
    className={['oph-swirl', animated ? 'oph-swirl--animated' : '', className ?? ''].filter(Boolean).join(' ')}
    viewBox="-52 -52 104 104"
    aria-hidden="true"
    focusable="false"
  >
    {BLADE_PATHS.map((d, i) => (
      <path key={d} d={d} style={{ ['--i' as string]: i }} />
    ))}
  </svg>
);
