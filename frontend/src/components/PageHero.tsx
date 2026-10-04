import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container } from '@/ui';
import { Reveal, SplitText, useProgressVars } from '@/motion';
import { ROUTES } from '@/app/navigation';
import { RingMotif } from './editorial';

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Inner-page hero (Figma: full-bleed forest block, breadcrumbs, gold eyebrow,
 * large serif title, lead, text actions, illustration or ring motif on the
 * right).
 *
 * Figma fixes: titles broke mid-word («Направле ния», «Оптичес кая») and were
 * clipped at the baseline («Онлайн-запись», «Динара Омарова»). The title is
 * now sized to its length, never breaks inside a word and keeps room for
 * descenders. The boxed variant used by the knowledge pages is unified with
 * this full-bleed one.
 *
 * On scroll the hero content drifts up and fades while the motif rotates and
 * recedes — the first storytelling beat of every page.
 */
export const PageHero = ({
  eyebrow,
  title,
  text,
  crumbs = [],
  actions,
  aside,
  meta,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  /** Illustration, photo or portrait; the ring motif is used when omitted. */
  aside?: ReactNode;
  /** Small line under the lead (date, author, reading time). */
  meta?: ReactNode;
}) => {
  const { t } = useI18n();
  const ref = useProgressVars<HTMLElement>();
  const longest = Math.max(...title.split(' ').map((word) => word.length));
  const size = title.length > 48 || longest > 13 ? 'sm' : title.length > 26 || longest > 10 ? 'md' : 'lg';

  return (
    <section ref={ref} className="oph-pagehero oph-on-dark">
      <div className="oph-pagehero__grain" aria-hidden="true" />
      <Container>
        <div className="oph-pagehero__layout">
          <div className="oph-pagehero__inner">
            <Reveal variant="fade">
              <nav className="oph-breadcrumbs" aria-label="breadcrumb">
                <Link to={ROUTES.home}>{t.common.breadcrumbHome}</Link>
                {crumbs.map((crumb) => (
                  <span key={crumb.label} style={{ display: 'contents' }}>
                    <ChevronRight size={12} aria-hidden="true" />
                    {crumb.to ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      <span aria-current="page">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </Reveal>

            {eyebrow ? (
              <Reveal variant="up" delay={60}>
                <span className="oph-eyebrow">{eyebrow}</span>
              </Reveal>
            ) : null}

            <SplitText text={title} as="h1" className={`oph-pagehero__title oph-pagehero__title--${size}`} step={55} />

            {text ? (
              <Reveal variant="up" delay={220}>
                <p className="oph-pagehero__lead">{text}</p>
              </Reveal>
            ) : null}

            {meta ? (
              <Reveal variant="up" delay={260}>
                <div className="oph-pagehero__meta">{meta}</div>
              </Reveal>
            ) : null}

            {actions ? (
              <Reveal variant="up" delay={300}>
                <div className="oph-pagehero__actions">{actions}</div>
              </Reveal>
            ) : null}
          </div>

          <Reveal variant="scale" delay={240} className="oph-pagehero__aside">
            {aside ?? <RingMotif />}
          </Reveal>
        </div>
      </Container>
    </section>
  );
};

/** Figma hero text action: white label with arrow, or muted secondary. */
export const HeroLink = ({
  to,
  children,
  muted = false,
  external = false,
}: {
  to: string;
  children: ReactNode;
  muted?: boolean;
  external?: boolean;
}) =>
  external || to.startsWith('#') ? (
    <a
      className={`oph-herolink ${muted ? 'oph-herolink--muted' : ''}`}
      href={to}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  ) : (
    <Link className={`oph-herolink ${muted ? 'oph-herolink--muted' : ''}`} to={to}>
      {children}
    </Link>
  );
