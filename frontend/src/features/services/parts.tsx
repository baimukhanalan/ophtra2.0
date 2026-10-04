import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Aperture, ArrowRight, Baby, Clock, Droplets, Glasses, ScanEye, Zap } from 'lucide-react';
import { useI18n } from '@/i18n';
import { ROUTES } from '@/app/navigation';
import { Photo } from '@/components/Photo';
import { useProgressVars } from '@/motion';
import { site } from '@/content';
import { sharedCopy } from '@/content/pages/services';
import type { Service } from '@/types';

/**
 * Canonical origin, resolved exactly like Seo.tsx (VITE_SITE_URL first, then
 * the organisation URL) so hand-built JSON-LD never disagrees with the
 * canonical links.
 */
export const SITE_ORIGIN = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? site.organization.url
).replace(/\/$/, '');

/** Stable @id of the clinic entity declared once in index.html. */
export const CLINIC_ID = `${SITE_ORIGIN}/#clinic`;

/** Demo-only UI (payment sandbox notices…) stays out of production builds. */
export const SHOW_DEMO_NOTICES =
  import.meta.env.DEV || (import.meta.env.VITE_DEMO_MODE as string | undefined) === 'true';

/**
 * Small pieces shared by the medical-services pages (services index/detail,
 * departments, pricing, booking, contacts). Page-level only — nothing here is
 * part of the global design system.
 */

/** Department id → its landing page. */
export const DEPARTMENT_ROUTES: Record<string, string> = {
  diagnostics: ROUTES.diagnostics,
  treatment: ROUTES.treatment,
  laser: ROUTES.laser,
  cataract: ROUTES.cataract,
  pediatric: ROUTES.pediatric,
  optical: ROUTES.optical,
};

export const departmentRoute = (id: string) => DEPARTMENT_ROUTES[id] ?? ROUTES.departments;

export const serviceRoute = (slug: string) => `${ROUTES.services}/${slug}`;

export const bookServiceRoute = (slug: string) => `${ROUTES.appointment}?service=${encodeURIComponent(slug)}`;

/** Clinic photographs available under /public/media (1440×1079).
 *  Used only where the building itself is the information (contacts). Every
 *  other block uses the drawn department art below, so the same facade does
 *  not illustrate unrelated pages (UI/UX audit X7). */
export const MEDIA = {
  day: '/media/clinic-day.jpg',
  entrance: '/media/clinic-entrance.jpg',
  evening: '/media/clinic-evening.jpg',
  facade: '/media/clinic-facade.jpg',
  night: '/media/clinic-night.jpg',
} as const;

const DEPARTMENT_MEDIA: Record<string, string> = {
  diagnostics: MEDIA.day,
  treatment: MEDIA.entrance,
  laser: MEDIA.evening,
  cataract: MEDIA.facade,
  pediatric: MEDIA.day,
  optical: MEDIA.entrance,
};

export const departmentMedia = (id: string) => DEPARTMENT_MEDIA[id] ?? MEDIA.facade;

/** Clinic photo sized for our media (all 1440×1079 or 1440×1085). */
export const ClinicPhoto = ({
  src,
  alt = '',
  sizes = '(max-width: 900px) 100vw, 50vw',
  className,
  eager,
}: {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}) => <Photo src={src} alt={alt} width={1440} height={1079} sizes={sizes} className={className} eager={eager} />;

/** «от {price}» in the right word order for the active language. */
export const FromPrice = ({ children }: { children: ReactNode }) => {
  const { L } = useI18n();
  const [before, after] = L(sharedCopy.fromPrice).split('{price}');
  return (
    <>
      {before}
      {children}
      {after}
    </>
  );
};

/** «от 12 000 ₸ · 40 мин» meta line for service cards. */
export const ServiceMeta = ({ service }: { service: Service }) => {
  const { L, formatPrice } = useI18n();
  return (
    <>
      <span className="svc-meta__price">
        <FromPrice>{formatPrice(service.price)}</FromPrice>
      </span>
      <span className="svc-meta__time">
        <Clock size={13} aria-hidden="true" />
        {service.duration} {L(sharedCopy.minutes)}
      </span>
    </>
  );
};

/** Figma's calm medical disclaimer line closing every medical page. */
export const Disclaimer = () => {
  const { L } = useI18n();
  return <p className="svc-disclaimer">{L(sharedCopy.disclaimer)}</p>;
};

/** Figma text link on light sections («Записаться →», «Открыть материал →»). */
export const TextLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link className="svc-textlink" to={to}>
    {children}
    <ArrowRight size={16} aria-hidden="true" />
  </Link>
);

/**
 * `Section` from @/ui only accepts aria-labelledby; blocks whose heading is a
 * statement (TextFill) rather than an <h2> are named with aria-label instead.
 * Same classes as `Section`.
 */
export const NamedSection = ({
  label,
  tone = 'default',
  className,
  children,
}: {
  label: string;
  tone?: 'default' | 'tint' | 'deep';
  className?: string;
  children: ReactNode;
}) => (
  <section
    aria-label={label}
    className={['oph-section', tone === 'tint' ? 'oph-section--tint' : '', tone === 'deep' ? 'oph-section--deep' : '', className ?? '']
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </section>
);

/* ================================================================ ART */

/**
 * Touch screens (phones, tablets): the drawn art stays still. Scroll-linked
 * rotation written per frame lags the native (compositor) scroll on touch and
 * reads as a wobble, so the progress variables are not bound there and the
 * CSS defaults (the end state) apply. Mouse/trackpad keeps the motion.
 */
const STATIC_ART =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

type DepartmentKind = 'diagnostics' | 'treatment' | 'laser' | 'cataract' | 'pediatric' | 'optical';
/** Page emblems for heroes that would otherwise all show the same ring motif. */
type PageKind = 'catalogue' | 'network' | 'tenge' | 'percent' | 'year' | 'pin';
type ArtKind = DepartmentKind | PageKind;

const ART_KINDS: ArtKind[] = [
  'diagnostics',
  'treatment',
  'laser',
  'cataract',
  'pediatric',
  'optical',
  'catalogue',
  'network',
  'tenge',
  'percent',
  'year',
  'pin',
];

const asKind = (id: string): ArtKind => (ART_KINDS.includes(id as ArtKind) ? (id as ArtKind) : 'diagnostics');

/** Line drawing per department, on a 240×240 grid centred at 120,120. */
const Glyph = ({ kind }: { kind: ArtKind }) => {
  switch (kind) {
    case 'diagnostics':
      // OCT: an eye crossed by the scan line, retinal layers below.
      return (
        <>
          <path d="M48 112 Q120 52 192 112 Q120 172 48 112 Z" />
          <circle cx="120" cy="112" r="22" />
          <circle className="svc-art__fill" cx="120" cy="112" r="8" />
          <line className="svc-art__accent" x1="28" y1="112" x2="212" y2="112" />
          <path className="svc-art__thin" d="M62 170 Q91 160 120 170 T178 170" />
          <path className="svc-art__thin" d="M62 184 Q91 176 120 184 T178 184" />
          <path className="svc-art__thin" d="M62 198 Q91 192 120 198 T178 198" />
        </>
      );
    case 'treatment':
      // A drop above a calm eye.
      return (
        <>
          <path className="svc-art__accent" d="M120 34 C 108 52 100 62 100 72 a20 20 0 0 0 40 0 C 140 62 132 52 120 34 Z" />
          <path d="M48 146 Q120 90 192 146 Q120 202 48 146 Z" />
          <circle cx="120" cy="146" r="20" />
          <circle className="svc-art__fill" cx="120" cy="146" r="7" />
        </>
      );
    case 'laser':
      // Two beams converging on the cornea.
      return (
        <>
          <line className="svc-art__accent" x1="36" y1="30" x2="110" y2="104" />
          <line className="svc-art__accent" x1="204" y1="30" x2="130" y2="104" />
          <circle className="svc-art__accent svc-art__fill--accent" cx="120" cy="112" r="5" />
          <path d="M44 128 Q120 70 196 128 Q120 186 44 128 Z" />
          <circle cx="120" cy="128" r="22" />
          <circle className="svc-art__fill" cx="120" cy="128" r="8" />
        </>
      );
    case 'cataract':
      // An intraocular lens: optic and two haptics.
      return (
        <>
          <ellipse cx="120" cy="120" rx="40" ry="40" />
          <ellipse className="svc-art__thin" cx="120" cy="120" rx="26" ry="26" />
          <path className="svc-art__accent" d="M120 80 C 150 52 188 58 204 84" />
          <path className="svc-art__accent" d="M120 160 C 90 188 52 182 36 156" />
          <path className="svc-art__thin" d="M104 104 Q114 96 124 100" />
        </>
      );
    case 'pediatric':
      // A tumbling-E chart, rows getting smaller.
      return (
        <>
          <text className="svc-art__letter" x="120" y="92" fontSize="64" textAnchor="middle">E</text>
          <text className="svc-art__letter" x="96" y="140" fontSize="34" textAnchor="middle" transform="rotate(90 96 128)">E</text>
          <text className="svc-art__letter" x="144" y="140" fontSize="34" textAnchor="middle" transform="rotate(180 144 128)">E</text>
          {[84, 108, 132, 156].map((x, index) => (
            <text
              key={x}
              className="svc-art__letter svc-art__letter--small"
              x={x}
              y="182"
              fontSize="18"
              textAnchor="middle"
              transform={`rotate(${index * 90} ${x} 176)`}
            >
              E
            </text>
          ))}
          <line className="svc-art__accent" x1="60" y1="198" x2="180" y2="198" />
        </>
      );
    case 'catalogue':
      // Six tiles, one chosen: the catalogue of services.
      return (
        <>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const x = 66 + (index % 3) * 40;
            const y = 88 + Math.floor(index / 3) * 40;
            return (
              <rect
                key={index}
                className={index === 4 ? 'svc-art__accent svc-art__fill--accent' : undefined}
                x={x - 14}
                y={y - 14}
                width="28"
                height="28"
                rx="6"
              />
            );
          })}
          <line className="svc-art__thin" x1="52" y1="172" x2="188" y2="172" />
        </>
      );
    case 'network': {
      // Six teams around one patient record.
      const nodes = Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
        return [120 + Math.cos(angle) * 66, 120 + Math.sin(angle) * 66];
      });
      return (
        <>
          {nodes.map(([x, y]) => (
            <line key={`l${x}`} className="svc-art__thin" x1="120" y1="120" x2={x} y2={y} />
          ))}
          {nodes.map(([x, y], index) => (
            <circle key={`c${x}`} className={index === 0 ? 'svc-art__accent' : undefined} cx={x} cy={y} r="13" />
          ))}
          <circle className="svc-art__fill" cx="120" cy="120" r="20" />
        </>
      );
    }
    case 'tenge':
      return (
        <>
          <text className="svc-art__letter" x="120" y="156" fontSize="112" textAnchor="middle">₸</text>
          <line className="svc-art__accent" x1="78" y1="182" x2="162" y2="182" />
        </>
      );
    case 'percent':
      return (
        <>
          <text className="svc-art__letter" x="120" y="156" fontSize="112" textAnchor="middle">%</text>
          <line className="svc-art__accent" x1="78" y1="182" x2="162" y2="182" />
        </>
      );
    case 'year':
      // Twelve months, four planned visits.
      return (
        <>
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = 50;
            const outer = index % 3 === 0 ? 70 : 62;
            return (
              <line
                key={index}
                className={index % 3 === 0 ? 'svc-art__accent' : 'svc-art__thin'}
                x1={120 + Math.cos(angle) * inner}
                y1={120 + Math.sin(angle) * inner}
                x2={120 + Math.cos(angle) * outer}
                y2={120 + Math.sin(angle) * outer}
              />
            );
          })}
          <circle cx="120" cy="120" r="34" />
          <path d="M120 98 V120 L136 130" />
        </>
      );
    case 'pin':
      return (
        <>
          <path d="M120 176 C 100 150 88 132 88 112 a32 32 0 1 1 64 0 C 152 132 140 150 120 176 Z" />
          <circle className="svc-art__accent" cx="120" cy="112" r="11" />
          <path className="svc-art__thin" d="M60 196 Q120 180 180 196" />
        </>
      );
    case 'optical':
    default:
      // Spectacles.
      return (
        <>
          <circle cx="80" cy="124" r="32" />
          <circle cx="160" cy="124" r="32" />
          <path d="M112 118 Q120 108 128 118" />
          <path d="M48 116 L26 100" />
          <path d="M192 116 L214 100" />
          <path className="svc-art__accent" d="M64 110 Q72 100 84 100" />
          <path className="svc-art__accent" d="M144 110 Q152 100 164 100" />
        </>
      );
  }
};

/**
 * Drawn illustration for a department: slowly turning measurement rings and a
 * line glyph that rises into place as the block enters the viewport. Tokens
 * only; transform/opacity only; fully painted before any script runs (the
 * scroll variables default to their end state), so a pinned or late-revealed
 * block is never blank.
 */
export const DepartmentArt = ({
  id,
  tone = 'light',
  className,
}: {
  id: string;
  tone?: 'light' | 'dark';
  className?: string;
}) => {
  const ref = useProgressVars<HTMLDivElement>();
  return (
    <div ref={STATIC_ART ? undefined : ref} className={`svc-art svc-art--${tone} ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 240 240" className="svc-art__svg">
        <g className="svc-art__rings">
          <circle cx="120" cy="120" r="114" className="svc-art__ring svc-art__ring--dash" />
          <circle cx="120" cy="120" r="92" className="svc-art__ring" />
          <circle cx="120" cy="6" r="3.5" className="svc-art__dot" />
          <circle cx="234" cy="120" r="2.5" className="svc-art__dot" />
        </g>
        <g className="svc-art__glyph">
          <Glyph kind={asKind(id)} />
        </g>
      </svg>
    </div>
  );
};

const ORBIT_ICONS: Record<DepartmentKind, typeof ScanEye> = {
  diagnostics: ScanEye,
  treatment: Droplets,
  laser: Zap,
  cataract: Aperture,
  pediatric: Baby,
  optical: Glasses,
};

/**
 * «One centre, one record, six teams»: the six departments sit on one orbit
 * around the shared patient record; the orbit turns with scroll. Labels are
 * real text (the list that follows repeats them with links), the ring is
 * decorative.
 */
export const CareOrbit = ({
  center,
  items,
}: {
  center: string;
  items: Array<{ id: string; label: string }>;
}) => {
  const ref = useProgressVars<HTMLDivElement>();
  return (
    <div ref={STATIC_ART ? undefined : ref} className="svc-orbit">
      <svg className="svc-orbit__ring" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="70" className="svc-orbit__ring-dash" />
      </svg>
      <p className="svc-orbit__center">{center}</p>
      <ul className="svc-orbit__nodes">
        {items.map((item, index) => {
          const Icon = ORBIT_ICONS[item.id as DepartmentKind] ?? ScanEye;
          return (
            <li key={item.id} className="svc-orbit__node" style={{ ['--i' as string]: index, ['--n' as string]: items.length }}>
              <span className="svc-orbit__icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="svc-orbit__label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
