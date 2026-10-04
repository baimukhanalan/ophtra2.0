import type { ReactElement } from 'react';
import { useLoopPause } from '@/motion';

/**
 * OPHTRA illustration set.
 *
 * Custom, fully vector, theme-aware artwork built on one motif — the iris.
 * Everything is drawn with design-system colours so illustrations restyle
 * automatically in high-contrast mode. No external assets, no raster files:
 * they cost nothing to load and stay crisp at any density.
 */

export type IllustrationName =
  | 'iris'
  | 'diagnostics'
  | 'laser'
  | 'cataract'
  | 'pediatric'
  | 'optics'
  | 'calendar'
  | 'clinic';

const brand = 'var(--oph-primary)';
const accent = 'var(--oph-accent)';
const soft = 'var(--oph-brand-100)';
const line = 'var(--oph-line-strong)';

/** The signature mark: concentric iris rings with a slow orbit. */
const Iris = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <circle cx="100" cy="100" r="92" fill={soft} opacity="0.6" />
    <g className="oph-illustration__ring" style={{ transformOrigin: '100px 100px' }}>
      <circle
        cx="100"
        cy="100"
        r="76"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="6 12"
        opacity="0.8"
      />
    </g>
    <g
      className="oph-illustration__ring oph-illustration__ring--reverse"
      style={{ transformOrigin: '100px 100px', ['--oph-orbit-duration' as string]: '40s' }}
    >
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke={brand}
        strokeWidth="1.2"
        strokeDasharray="2 10"
        opacity="0.55"
      />
    </g>
    <circle cx="100" cy="100" r="46" fill="var(--oph-surface)" />
    <circle cx="100" cy="100" r="46" fill="none" stroke={brand} strokeWidth="2" opacity="0.35" />
    {Array.from({ length: 24 }, (_, index) => {
      const angle = (index / 24) * Math.PI * 2;
      return (
        <line
          key={index}
          x1={100 + Math.cos(angle) * 20}
          y1={100 + Math.sin(angle) * 20}
          x2={100 + Math.cos(angle) * 44}
          y2={100 + Math.sin(angle) * 44}
          stroke={brand}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={index % 2 === 0 ? 0.5 : 0.25}
        />
      );
    })}
    <circle cx="100" cy="100" r="18" fill="var(--oph-brand-900)" />
    <circle cx="92" cy="92" r="6" fill="#fff" opacity="0.85" />
  </svg>
);

/** Diagnostics — a retina scan sweeping across a measurement grid. */
const Diagnostics = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <rect x="16" y="34" width="168" height="132" rx="18" fill={soft} />
    <rect x="16" y="34" width="168" height="132" rx="18" fill="none" stroke={line} />
    {[0, 1, 2, 3, 4].map((row) => (
      <line key={`h${row}`} x1="32" y1={58 + row * 22} x2="168" y2={58 + row * 22} stroke={line} strokeWidth="1" />
    ))}
    {[0, 1, 2, 3, 4, 5].map((col) => (
      <line key={`v${col}`} x1={38 + col * 25} y1="48" x2={38 + col * 25} y2="152" stroke={line} strokeWidth="1" />
    ))}
    <path
      d="M40 132c22-52 44-72 60-72s38 20 60 72"
      fill="none"
      stroke={brand}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="100" cy="100" r="26" fill="none" stroke={accent} strokeWidth="2.4" />
    <circle cx="100" cy="100" r="8" fill={brand} />
    <rect x="32" y="96" width="136" height="8" rx="4" fill={accent} opacity="0.24" className="oph-breathe" />
  </svg>
);

/** Laser correction — a focused beam shaping the corneal profile. */
const Laser = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <circle cx="100" cy="118" r="66" fill={soft} />
    <path d="M34 118a66 66 0 0 1 132 0Z" fill="var(--oph-surface)" opacity="0.7" />
    <path
      d="M52 118c0-26 21-46 48-46s48 20 48 46"
      fill="none"
      stroke={brand}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M100 12v40" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    <path d="M100 12 88 40h24Z" fill={accent} opacity="0.35" />
    <circle cx="100" cy="118" r="14" fill={brand} />
    <circle cx="100" cy="118" r="26" fill="none" stroke={accent} strokeWidth="1.6" strokeDasharray="4 8" />
    <line x1="34" y1="118" x2="166" y2="118" stroke={line} strokeWidth="2" />
  </svg>
);

/** Cataract — a clouded lens replaced by a clear intraocular one. */
const Cataract = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <ellipse cx="66" cy="100" rx="42" ry="54" fill={soft} />
    <ellipse cx="66" cy="100" rx="42" ry="54" fill="none" stroke={line} />
    <ellipse cx="66" cy="100" rx="24" ry="34" fill="var(--oph-muted-soft)" opacity="0.5" />
    <path d="M112 100h34" stroke={brand} strokeWidth="3" strokeLinecap="round" />
    <path d="M138 92l10 8-10 8" fill="none" stroke={brand} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="156" cy="100" rx="30" ry="42" fill="var(--oph-surface)" stroke={brand} strokeWidth="2.4" />
    <path d="M146 76c-8 12-8 36 0 48" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Pediatric — a child-friendly occlusion test. */
const Pediatric = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <circle cx="100" cy="86" r="52" fill={soft} />
    <circle cx="100" cy="86" r="52" fill="none" stroke={line} />
    <circle cx="80" cy="80" r="9" fill={brand} />
    <path d="M108 72h26a8 8 0 0 1 8 8v6a8 8 0 0 1-8 8h-26Z" fill={accent} opacity="0.5" />
    <path d="M76 108c14 10 34 10 48 0" fill="none" stroke={brand} strokeWidth="3" strokeLinecap="round" />
    <path d="M52 172c8-24 26-36 48-36s40 12 48 36" fill="none" stroke={brand} strokeWidth="3" strokeLinecap="round" />
    <circle cx="152" cy="44" r="12" fill={accent} opacity="0.5" className="oph-float" />
    <circle cx="44" cy="52" r="7" fill={brand} opacity="0.35" className="oph-float" style={{ ['--oph-float-delay' as string]: '1.2s' }} />
  </svg>
);

/** Optics — a spectacle frame on a lens-selection tray. */
const Optics = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <rect x="20" y="120" width="160" height="46" rx="16" fill={soft} />
    <circle cx="68" cy="92" r="32" fill="var(--oph-surface)" stroke={brand} strokeWidth="3.4" />
    <circle cx="132" cy="92" r="32" fill="var(--oph-surface)" stroke={brand} strokeWidth="3.4" />
    <path d="M100 92c-2-8-10-8-14-4M100 92c2-8 10-8 14-4" fill="none" stroke={brand} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M36 92 14 74M164 92l22-18" stroke={brand} strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="68" cy="92" r="18" fill={accent} opacity="0.18" />
    <circle cx="132" cy="92" r="18" fill={accent} opacity="0.18" />
    <rect x="52" y="140" width="96" height="8" rx="4" fill={line} />
  </svg>
);

/** Booking — an appointment card with a confirmed slot. */
const Calendar = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <rect x="26" y="38" width="148" height="132" rx="20" fill="var(--oph-surface)" stroke={line} strokeWidth="2" />
    <rect x="26" y="38" width="148" height="34" rx="20" fill={brand} />
    <rect x="26" y="58" width="148" height="14" fill={brand} />
    <circle cx="60" cy="34" r="7" fill={accent} />
    <circle cx="140" cy="34" r="7" fill={accent} />
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={46 + col * 30}
          y={90 + row * 26}
          width="20"
          height="16"
          rx="5"
          fill={row === 1 && col === 2 ? brand : soft}
        />
      )),
    )}
    <circle cx="146" cy="150" r="22" fill={accent} />
    <path d="M136 150l7 7 14-14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Clinic — the building silhouette used on contacts and about pages. */
const Clinic = () => (
  <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
    <rect x="30" y="72" width="64" height="98" rx="12" fill={soft} />
    <rect x="102" y="46" width="68" height="124" rx="12" fill="var(--oph-surface)" stroke={line} strokeWidth="2" />
    {[0, 1, 2, 3].map((row) =>
      [0, 1].map((col) => (
        <rect key={`w${row}${col}`} x={116 + col * 28} y={64 + row * 26} width="18" height="16" rx="4" fill={soft} />
      )),
    )}
    {[0, 1, 2].map((row) => (
      <rect key={`l${row}`} x="46" y={90 + row * 26} width="32" height="14" rx="4" fill="var(--oph-surface)" />
    ))}
    <path d="M136 20v18M127 29h18" stroke={brand} strokeWidth="5" strokeLinecap="round" />
    <rect x="20" y="168" width="160" height="8" rx="4" fill={line} />
  </svg>
);

const registry: Record<IllustrationName, () => ReactElement> = {
  iris: Iris,
  diagnostics: Diagnostics,
  laser: Laser,
  cataract: Cataract,
  pediatric: Pediatric,
  optics: Optics,
  calendar: Calendar,
  clinic: Clinic,
};

export const Illustration = ({
  name,
  size = 220,
  className,
}: {
  name: IllustrationName;
  size?: number;
  className?: string;
}) => {
  const Art = registry[name];
  // The rings orbit and the shapes breathe forever; pause them off screen.
  const ref = useLoopPause<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`oph-illustration ${className ?? ''}`}
      style={{ ['--oph-illustration-size' as string]: `${size}px` }}
    >
      <Art />
    </div>
  );
};
