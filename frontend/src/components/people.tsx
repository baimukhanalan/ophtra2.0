import { Children, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { Language } from '@/i18n/types';
import { LANGUAGE_LABELS } from '@/i18n/types';
import { Reveal } from '@/motion';
import { DoctorPortrait } from '@/services/images';
import { SwirlMark } from '@/layout/SwirlMark';
import { ROUTES } from '@/app/navigation';
import type { Doctor } from '@/types';
import { DOCTORS_ARE_DEMO, PEOPLE_COMMON } from '@/content/pages/people';

/* ================================================================ HELPERS */

const ruPlural = new Intl.PluralRules('ru-RU');

/**
 * «22 года», «5 лет», «1 жыл», «1 year» — Figma printed «СТАЖ 22 ЛЕТ», which is
 * ungrammatical in Russian; the word now agrees with the number.
 */
export const yearsWord = (n: number, language: Language): string => {
  if (language === 'kk') return 'жыл';
  if (language === 'en') return n === 1 ? 'year' : 'years';
  const rule = ruPlural.select(n);
  return rule === 'one' ? 'год' : rule === 'few' ? 'года' : 'лет';
};

export const languageNames = (codes: string[]): string =>
  codes.map((code) => LANGUAGE_LABELS[code as Language]?.full ?? code.toUpperCase()).join(' · ');

/* ============================================================ BALANCED GRID */

/**
 * Column count that leaves the fewest empty cells in the last row, never more
 * columns than cards (8 → 4, 7 → 4, 6 → 3, 5 → 3, 3 → 3, 2 → 2).
 */
export const balancedCols = (count: number, max: number): number => {
  if (count <= max) return Math.max(1, count);
  let best = max;
  let bestHoles = (max - (count % max)) % max;
  for (let cols = max - 1; cols >= Math.max(2, max - 2); cols -= 1) {
    const holes = (cols - (count % cols)) % cols;
    if (holes < bestHoles) {
      best = cols;
      bestHoles = holes;
    }
  }
  return best;
};

/**
 * Card grid with a real gutter (Figma error 4) whose column count is chosen
 * per breakpoint from the number of cards, so rows never end half-empty
 * (audit D2/D3/X10: the 3 + 3 + 2 doctors grid on tablet).
 */
export const BalancedGrid = ({
  children,
  className,
  max = 4,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Columns on wide screens; tablets use at most `max - 1`. */
  max?: number;
  as?: 'div' | 'ul';
}) => {
  const count = Children.count(children);
  const lg = balancedCols(count, max);
  const style = {
    '--cols-lg': lg,
    '--cols-md': balancedCols(count, Math.max(2, max - 1)),
  } as CSSProperties;
  return (
    <Tag className={`ppl-bgrid ${className ?? ''}`} style={style} data-cols={lg}>
      {children}
    </Tag>
  );
};

/** Discreet label for demonstration records (DESIGN.md §5). */
export const DemoTag = ({ className }: { className?: string }) => {
  const { L } = useI18n();
  if (!DOCTORS_ARE_DEMO) return null;
  return <span className={`oph-tag ppl-demotag ${className ?? ''}`}>{L(PEOPLE_COMMON.demo)}</span>;
};

/* ============================================================ DOCTOR TILE */

/**
 * Figma «03 Врачи» card: 3:4 portrait on top, serif name, role, «СТАЖ N ЛЕТ»
 * pill and an arrow. Figma fixes: cards touched with no gutter (the grid owns
 * a real gap) and initials were pasted over clinic photos (DoctorPortrait now
 * draws a forest monogram card, never a photo behind the letters). The whole
 * card is one link; the portrait is decorative because the name is text.
 * On phones the card turns into a compact row so eight doctors fit in a few
 * screens instead of eight full-height portraits.
 */
export const DoctorTile = ({ doctor, delay = 0 }: { doctor: Doctor; delay?: number }) => {
  const { L, t, language } = useI18n();
  return (
    <Reveal variant="up" delay={delay} className="ppl-dtile-wrap">
      <Link className="ppl-dtile" to={`${ROUTES.doctors}/${doctor.slug}`}>
        <span className="ppl-dtile__media" aria-hidden="true">
          <DoctorPortrait photo={doctor.photo} seed={doctor.id} label={L(doctor.name)} />
        </span>
        <span className="ppl-dtile__body">
          <DemoTag />
          <span className="ppl-dtile__name">{L(doctor.name)}</span>
          <span className="ppl-dtile__role">{L(doctor.role)}</span>
          <span className="ppl-dtile__foot">
            <span className="oph-tag">
              {t.common.experience} {doctor.experience} {yearsWord(doctor.experience, language)}
            </span>
            <ArrowRight size={18} aria-hidden="true" className="ppl-dtile__arrow" />
          </span>
        </span>
      </Link>
    </Reveal>
  );
};

/* =============================================================== MONOGRAM */

/**
 * Typographic stand-in for the founder's portrait. There is no photograph of
 * him in the asset set, and a stock face would misrepresent a named doctor,
 * so the brand swirl carries the monogram instead. The swirl assembles blade
 * by blade as it scrolls in (driven by --enter from a parent ScrollFx).
 */
export const Monogram = ({
  letters,
  caption,
  lit,
  className,
}: {
  letters: string;
  caption?: string;
  /** Number of lit blades (0–12); all lit when omitted. */
  lit?: number;
  className?: string;
}) => (
  <div
    className={`ppl-monogram ${className ?? ''}`}
    style={typeof lit === 'number' ? { ['--lit' as string]: lit } : undefined}
    data-progressive={typeof lit === 'number' || undefined}
    aria-hidden="true"
  >
    <span className="ppl-monogram__ring" />
    <SwirlMark className="ppl-monogram__swirl" animated />
    <span className="ppl-monogram__letters">{letters}</span>
    {caption ? <span className="ppl-monogram__caption">{caption}</span> : null}
  </div>
);

/* ======================================================= YOUTUBE (FACADE) */

/**
 * Click-to-load video. Nothing is requested from YouTube until the visitor
 * presses play — no third-party cookies or scripts on page load. The iframe
 * uses the privacy-enhanced youtube-nocookie domain.
 */
export const VideoFacade = ({
  youtubeId,
  poster,
  title,
  playLabel,
  note,
}: {
  youtubeId: string;
  poster: string;
  title: string;
  playLabel: string;
  note?: string;
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="ppl-video">
      <div className="ppl-video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button type="button" className="ppl-video__poster" onClick={() => setPlaying(true)}>
            <img src={poster} alt="" width={480} height={360} loading="lazy" decoding="async" />
            <span className="ppl-video__play">
              <Play size={22} aria-hidden="true" />
            </span>
            <span className="oph-visually-hidden">
              {playLabel}: {title}
            </span>
          </button>
        )}
      </div>
      {note && !playing ? <p className="ppl-video__note">{note}</p> : null}
    </div>
  );
};
