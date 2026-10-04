import { Children, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal, SplitText, Stagger, Counter, useProgressVars } from '@/motion';

/* ============================================================ SECTION INDEX */

/**
 * Figma's section counter: a small gold «01», «02» at the top-left of every
 * content block. It is what gives the pages their editorial rhythm.
 */
export const SectionIndex = ({ n, label, onDark = false }: { n: number; label?: string; onDark?: boolean }) => (
  <Reveal variant="fade" className={`oph-index ${onDark ? 'oph-index--dark' : ''}`}>
    <span className="oph-index__n">{String(n).padStart(2, '0')}</span>
    <span className="oph-index__line" aria-hidden="true" />
    {label ? <span className="oph-index__label">{label}</span> : null}
  </Reveal>
);

/* ============================================================ SECTION HEAD */

/** Eyebrow + serif headline (+ lead) with a word-by-word rise. */
export const SectionHead = ({
  eyebrow,
  title,
  text,
  id,
  as = 'h2',
  size = 'md',
  aside,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  text?: ReactNode;
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: 'sm' | 'md' | 'lg';
  aside?: ReactNode;
  center?: boolean;
}) => (
  <div className={`oph-shead ${aside ? 'oph-shead--aside' : ''} ${center ? 'oph-shead--center' : ''}`}>
    <div className="oph-shead__main">
      {eyebrow ? (
        <Reveal variant="fade">
          <span className="oph-eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}
      <div id={id}>
        <SplitText text={title} as={as} className={`oph-display oph-display--${size}`} step={38} />
      </div>
      {text ? (
        <Reveal variant="up" delay={160}>
          <p className="oph-lead">{text}</p>
        </Reveal>
      ) : null}
    </div>
    {aside ? (
      <Reveal variant="up" delay={200} className="oph-shead__aside">
        {aside}
      </Reveal>
    ) : null}
  </div>
);

/* ========================================================= EDITORIAL GRID */

/**
 * Figma's bordered bento grid (knowledge base, services, «пять направлений»).
 *
 * Figma fix: rows alternated 2 and 3 cards but the last row was left with grey
 * holes (and one card sat in a half-width row). Spans are now computed so every
 * row is always full: the pattern 2-3-2-3… is kept, and the final row is
 * re-balanced to whatever number of cards remains.
 */
const rowPattern = (count: number): number[] => {
  const rows: number[] = [];
  let left = count;
  let wide = true;
  while (left > 0) {
    const want = wide ? 2 : 3;
    if (left <= 3) {
      // Never leave a single orphan after a full row: 4 → 2+2.
      if (left === 1 && rows.length) {
        const prev = rows.pop()!;
        if (prev === 3) rows.push(2, 2);
        else rows.push(prev, 1);
      } else rows.push(left);
      break;
    }
    if (left === 4) {
      rows.push(2, 2);
      break;
    }
    rows.push(want);
    left -= want;
    wide = !wide;
  }
  return rows;
};

export const EditorialGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  const items = Children.toArray(children);
  const rows = rowPattern(items.length);
  const spans: number[] = [];
  rows.forEach((size) => {
    for (let i = 0; i < size; i += 1) spans.push(6 / size);
  });

  let rowIndex = 0;
  let inRow = 0;
  const tints = items.map((_, index) => {
    const size = rows[rowIndex];
    // One tinted cell per row, moving across rows (Figma alternation).
    const tinted = inRow === (rowIndex % 2 === 0 ? size - 1 : 0) && size > 1;
    inRow += 1;
    if (inRow >= size) {
      rowIndex += 1;
      inRow = 0;
    }
    return tinted && index % 1 === 0;
  });

  return (
    <Stagger className={`oph-egrid ${className ?? ''}`} step={70}>
      {items.map((item, index) => (
        <Reveal
          key={index}
          variant="up"
          className="oph-egrid__cell"
          style={{ ['--span' as string]: spans[index] } as CSSProperties}
        >
          <div className="oph-egrid__inner" data-tint={tints[index] || undefined}>
            {item}
          </div>
        </Reveal>
      ))}
    </Stagger>
  );
};

/** Content of one bento cell: gold category, serif title, text, link. */
export const EditorialCard = ({
  index,
  eyebrow,
  title,
  text,
  to,
  linkLabel,
  meta,
  external = false,
}: {
  index?: number;
  eyebrow?: string;
  title: string;
  text?: string;
  to?: string;
  linkLabel?: string;
  meta?: ReactNode;
  external?: boolean;
}) => {
  const body = (
    <>
      <div className="oph-ecard__head">
        {typeof index === 'number' ? <span className="oph-ecard__n">{String(index).padStart(2, '0')}</span> : null}
        {eyebrow ? <span className="oph-eyebrow">{eyebrow}</span> : null}
      </div>
      <h3 className="oph-ecard__title">{title}</h3>
      {text ? <p className="oph-ecard__text">{text}</p> : null}
      {meta ? <div className="oph-ecard__meta">{meta}</div> : null}
      {to && linkLabel ? (
        <span className="oph-ecard__link">
          {linkLabel}
          {external ? <ArrowUpRight size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
        </span>
      ) : null}
    </>
  );

  if (!to) return <div className="oph-ecard">{body}</div>;
  if (external)
    return (
      <a className="oph-ecard oph-ecard--link" href={to} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  return (
    <Link className="oph-ecard oph-ecard--link" to={to}>
      {body}
    </Link>
  );
};

/* ================================================================ STATS */

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

/** Figma metric cards / dark metric band. */
export const StatGrid = ({ stats, band = false }: { stats: Stat[]; band?: boolean }) => (
  <Stagger className={band ? 'oph-statband' : 'oph-statgrid'} step={110}>
    {stats.map((stat) => (
      <Reveal key={stat.label} variant="up" className={band ? 'oph-statband__item' : 'oph-statgrid__item'}>
        <p className="oph-stat__value">
          <Counter value={stat.value} />
          {stat.suffix ?? ''}
        </p>
        <p className="oph-stat__label">{stat.label}</p>
      </Reveal>
    ))}
  </Stagger>
);

/* ============================================================ RING MOTIF */

/**
 * Figma's concentric-ring motif (the iris seen from the front). Rotates and
 * breathes with scroll through its parent's --p variable.
 */
export const RingMotif = ({ className }: { className?: string }) => (
  <div className={`oph-rings ${className ?? ''}`} aria-hidden="true">
    <span className="oph-rings__outer" />
    <span className="oph-rings__mid" />
    <span className="oph-rings__inner" />
    <svg className="oph-rings__scan" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" />
    </svg>
  </div>
);

/* =========================================================== ARTICLE BODY */

export interface ArticleSection {
  id: string;
  title: string;
  body?: ReactNode;
  /** Figma bullet list with ring markers. */
  list?: string[];
}

/**
 * Figma article template (service page, article, international patients):
 * sticky «На этой странице» contents on the left, numbered sections on the
 * right, the active section highlighted while reading.
 */
export const ArticleBody = ({
  sections,
  tocLabel,
  after,
}: {
  sections: ArticleSection[];
  tocLabel: string;
  after?: ReactNode;
}) => {
  const [active, setActive] = useState(sections[0]?.id);
  const progressRef = useProgressVars<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div ref={progressRef} className="oph-article">
      <nav className="oph-article__toc" aria-label={tocLabel}>
        <p className="oph-eyebrow">{tocLabel}</p>
        <div className="oph-article__progress" aria-hidden="true">
          <span />
        </div>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} aria-current={active === section.id ? 'true' : undefined}>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="oph-article__main">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="oph-article__section">
            <Reveal variant="fade" className="oph-article__n">
              {String(index + 1).padStart(2, '0')}
            </Reveal>
            <div className="oph-article__content">
              <SplitText text={section.title} as="h2" className="oph-article__title" step={34} />
              {section.body ? (
                <Reveal variant="up" delay={120}>
                  <div className="oph-article__text">{section.body}</div>
                </Reveal>
              ) : null}
              {section.list?.length ? (
                <Stagger as="ul" className="oph-ringlist" step={70}>
                  {section.list.map((item) => (
                    <Reveal as="li" key={item} variant="left">
                      {item}
                    </Reveal>
                  ))}
                </Stagger>
              ) : null}
            </div>
          </section>
        ))}
        {after}
      </div>
    </div>
  );
};

/** Figma «Продолжить знакомство» box. */
export const ContinueBox = ({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) => (
  <Reveal variant="up" className="oph-continue">
    <h2 className="oph-continue__title">{title}</h2>
    <ul>
      {links.map((link) => (
        <li key={link.to + link.label}>
          <Link to={link.to}>
            {link.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  </Reveal>
);

/** Figma «Источники и дополнительное чтение» dark box. */
export const SourcesBox = ({
  title,
  note,
  sources,
}: {
  title: string;
  note?: string;
  sources: Array<{ label: string; href: string }>;
}) => (
  <Reveal variant="up" className="oph-sources">
    <h2 className="oph-sources__title">{title}</h2>
    {note ? <p className="oph-sources__note">{note}</p> : null}
    <ol>
      {sources.map((source) => (
        <li key={source.href}>
          <a href={source.href} target="_blank" rel="noopener noreferrer">
            {source.label}
          </a>
        </li>
      ))}
    </ol>
  </Reveal>
);

/* ============================================================== STEP FLOW */

/**
 * Horizontal process line (online consultation, second opinion, treatment
 * path). The connecting rail fills with scroll progress.
 */
export const StepFlow = ({ steps }: { steps: Array<{ title: string; text?: string }> }) => {
  const ref = useProgressVars<HTMLOListElement>();
  return (
    <ol ref={ref} className="oph-steps" style={{ ['--count' as string]: steps.length }}>
      <span className="oph-steps__rail" aria-hidden="true">
        <span />
      </span>
      {steps.map((step, index) => (
        <li key={step.title} className="oph-steps__item" style={{ ['--i' as string]: index }}>
          <Reveal variant="up" delay={index * 90}>
            <span className="oph-steps__n">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="oph-steps__title">{step.title}</h3>
            {step.text ? <p className="oph-steps__text">{step.text}</p> : null}
          </Reveal>
        </li>
      ))}
    </ol>
  );
};

/* =========================================================== FEATURE TILE */

/** Figma «Автоматические уведомления / WhatsApp / Политика» tiles. */
export const FeatureTile = ({ icon, title, text }: { icon: ReactNode; title: string; text: string }) => (
  <div className="oph-ftile">
    <span className="oph-ftile__icon" aria-hidden="true">
      {icon}
    </span>
    <h3 className="oph-ftile__title">{title}</h3>
    <p className="oph-ftile__text">{text}</p>
  </div>
);
