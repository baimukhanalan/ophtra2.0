import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Clock3,
  Globe2,
  Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { ButtonLink, Container, Section } from '@/ui';
import {
  Reveal,
  SplitText,
  Stagger,
  TextFill,
  useParallax,
  useProgressVars,
} from '@/motion';
import { Seo } from '@/seo/Seo';
import { CtaBand } from '@/components/CtaBand';
import { Photo } from '@/components/Photo';
import {
  EditorialCard,
  EditorialGrid,
  SectionHead,
  SectionIndex,
  StatGrid,
} from '@/components/editorial';
import { SwirlMark } from '@/layout/SwirlMark';
import { ROUTES } from '@/app/navigation';
import { byId, doctors, reviews, services, site } from '@/content';
import { publishedArticles } from '@/content/articles';
import { homeCopy as c } from '@/content/pages/home';

/* ==================================================================== HERO */

const Hero = () => {
  const { t, L } = useI18n();
  const ref = useProgressVars<HTMLElement>();

  return (
    <section ref={ref} className="oph-home-hero">
      <Container>
        <div className="oph-home-hero__grid">
          <div className="oph-home-hero__copy">
            <Reveal variant="fade">
              <span className="oph-home-hero__eyebrow">
                <span aria-hidden="true" />
                {L(c.heroEyebrow)}
              </span>
            </Reveal>

            <h1 className="oph-home-hero__title">
              <SplitText text={L(c.heroTitle)} as="span" className="oph-home-hero__line" step={70} />
              <SplitText text={L(c.heroAccent)} as="span" className="oph-home-hero__accent" step={70} />
            </h1>

            <Reveal variant="up" delay={260}>
              <p className="oph-home-hero__lead">{L(c.heroText)}</p>
            </Reveal>

            <Reveal variant="up" delay={360}>
              <div className="oph-home-hero__actions">
                <ButtonLink to={ROUTES.appointment} size="lg" magnetic>
                  <CalendarPlus size={17} aria-hidden="true" />
                  {L(c.ctaBook)}
                </ButtonLink>
                <ButtonLink to={ROUTES.international} variant="outline" size="lg">
                  {L(c.ctaInternational)}
                </ButtonLink>
                <ButtonLink to={ROUTES.secondOpinion} variant="outline" size="lg">
                  {L(c.ctaSecond)}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal variant="up" delay={460}>
              <ul className="oph-home-hero__chips">
                <li>
                  <Clock3 size={15} aria-hidden="true" />
                  {t.home.chipDiagnostics}
                </li>
                <li>
                  <Stethoscope size={15} aria-hidden="true" />
                  {t.home.chipSurgery}
                </li>
                <li>
                  <Globe2 size={15} aria-hidden="true" />
                  RU · KK · EN
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="oph-home-hero__visual">
            <span className="oph-home-hero__slab" aria-hidden="true" />
            <Reveal variant="scale" delay={200} className="oph-home-hero__frame">
              <Photo
                src="/media/clinic-night.jpg"
                alt={L(c.heroPhotoAlt)}
                width={1440}
                height={1079}
                sizes="(max-width: 900px) 100vw, 48vw"
                eager
              />
            </Reveal>
            <Reveal variant="up" delay={520} className="oph-home-hero__badge">
              <SwirlMark />
              <span>{L(c.heroBadge)}</span>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="oph-home-hero__scroll" aria-hidden="true">
        <span />
        {L(c.scrollHint)}
      </div>
    </section>
  );
};

/* ============================================================= METRICS BAR */

const MetricsBand = () => {
  const { t } = useI18n();
  const labels: Record<string, string> = {
    years: t.home.metricYears,
    operations: t.home.metricOperations,
    doctors: t.home.metricDoctors,
    satisfaction: t.home.metricSatisfaction,
  };

  return (
    <section className="oph-home-metrics" aria-label={t.scenes.figuresTitle}>
      <Container>
        <StatGrid
          band
          stats={site.metrics.map((metric) => ({
            value: metric.value,
            suffix: metric.suffix,
            label: labels[metric.id],
          }))}
        />
      </Container>
    </section>
  );
};

/* ================================================================= MISSION */

const Mission = () => {
  const { L } = useI18n();
  const ref = useProgressVars<HTMLElement>();
  return (
    <section ref={ref} className="oph-home-mission oph-on-dark" aria-labelledby="home-mission">
      <div className="oph-home-mission__mark" aria-hidden="true">
        <SwirlMark />
      </div>
      <Container>
        <SectionIndex n={1} onDark />
        <h2 id="home-mission" className="oph-visually-hidden">
          {L(c.missionEyebrow)}
        </h2>
        <TextFill text={L(c.mission)} className="oph-home-mission__statement" />
        <Reveal variant="up" delay={120} className="oph-home-mission__foot">
          <p>{L(c.missionText)}</p>
          <Link to={ROUTES.about} className="oph-herolink">
            {L({ ru: 'О центре', kk: 'Орталық туралы', en: 'About the centre' })}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
};

/* ================================================================= FOUNDER */

const Founder = () => {
  const { L } = useI18n();
  const quoteRef = useParallax<HTMLQuoteElement>(0.1);
  return (
    <Section tone="tint" aria-labelledby="home-founder" className="oph-home-founder">
      <Container>
        <SectionIndex n={2} />
        <div className="oph-duo">
          <Reveal variant="scale" className="oph-home-founder__panel">
            <div className="oph-home-founder__swirl" aria-hidden="true">
              <SwirlMark />
            </div>
            <span className="oph-home-founder__mono" aria-hidden="true">
              MK
            </span>
            <ul className="oph-home-founder__creds">
              <li>MD · Ophthalmology</li>
              <li>PhD · Vision Sciences, Cardiff University</li>
              <li>AFHEA</li>
            </ul>
          </Reveal>
          <div className="oph-home-founder__copy">
            <Reveal variant="fade">
              <span className="oph-eyebrow">{L(c.founderEyebrow)}</span>
            </Reveal>
            <div id="home-founder">
              <SplitText text={L(c.founderName)} as="h2" className="oph-display oph-display--lg" step={60} />
            </div>
            <Reveal variant="up" delay={140}>
              <p className="oph-lead">{L(c.founderText)}</p>
            </Reveal>
            <blockquote ref={quoteRef} className="oph-home-founder__quote">
              {L(c.founderQuote)}
            </blockquote>
            <Reveal variant="up" delay={220}>
              <Link to={ROUTES.founder} className="oph-textlink">
                {L(c.founderLink)}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
        {/* «Почему доктор» — three reasons as one row instead of a pinned scene. */}
        <h3 className="oph-visually-hidden">{L(c.whyTitle)}</h3>
        <Stagger as="ol" className="oph-home-why" step={100}>
          {c.why.map((item, index) => (
            <Reveal as="li" key={index} variant="up">
              <span className="oph-home-why__n">{String(index + 1).padStart(2, '0')}</span>
              <h4 className="oph-home-why__title">{L(item.title)}</h4>
              <p className="oph-home-why__text">{L(item.text)}</p>
              <p className="oph-home-why__fact">{L(item.fact)}</p>
            </Reveal>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
};

/* ================================================================= CENTRES */

const Centres = () => {
  const { L } = useI18n();
  return (
    <Section aria-labelledby="home-centres">
      <Container>
        <SectionIndex n={3} />
        <SectionHead id="home-centres" eyebrow={L(c.centresEyebrow)} title={L(c.centresTitle)} />
        <EditorialGrid className="oph-home-compact">
          {c.centres.map((centre, index) => (
            <EditorialCard
              key={centre.to}
              index={index + 1}
              title={L(centre.title)}
              text={L(centre.text)}
              to={centre.to}
              linkLabel={L(c.open)}
            />
          ))}
        </EditorialGrid>
      </Container>
    </Section>
  );
};

/* ================================================================= EXPERTS */

/* Each caption sits where it cannot collide with a neighbour or leave the
   sphere, down to a 288 px globe (320 px phone) with the longest language. */
const PINS: Array<{ x: number; y: number; label: 'above' | 'below' | 'below-end' }> = [
  { x: 47, y: 30, label: 'above' }, // United Kingdom
  { x: 80, y: 47, label: 'below' }, // Hong Kong
  { x: 22, y: 33, label: 'below' }, // Canada
  { x: 66, y: 36, label: 'below-end' }, // Kazakhstan (home)
];

const Experts = () => {
  const { L } = useI18n();
  const ref = useProgressVars<HTMLDivElement>();
  return (
    <Section aria-labelledby="home-experts">
      <Container>
        <SectionIndex n={4} />
        <div className="oph-duo oph-home-experts">
          <div>
            <SectionHead id="home-experts" eyebrow={L(c.expertsEyebrow)} title={L(c.expertsTitle)} text={L(c.expertsText)} />
            <StatGrid stats={c.expertStats.map((stat) => ({ value: stat.value, suffix: stat.suffix, label: L(stat.label) }))} />
            <Reveal variant="up" delay={160}>
              <div className="oph-home-experts__links">
                <Link to={ROUTES.experts} className="oph-textlink">
                  {L(c.expertsLink)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link to={ROUTES.science} className="oph-textlink">
                  {L(c.scienceEyebrow)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
          <div ref={ref} className="oph-globe" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="oph-globe__svg">
              <circle cx="100" cy="100" r="92" className="oph-globe__sphere" />
              {[-60, -30, 0, 30, 60].map((lat) => (
                <ellipse key={lat} cx="100" cy={100 + lat * 1.2} rx={92 * Math.cos((lat * Math.PI) / 180)} ry={12 * Math.cos((lat * Math.PI) / 180)} className="oph-globe__line" />
              ))}
              {[0, 30, 60, 90, 120, 150].map((lon) => (
                <ellipse key={lon} cx="100" cy="100" rx={Math.abs(92 * Math.cos((lon * Math.PI) / 180))} ry="92" className="oph-globe__line oph-globe__meridian" />
              ))}
            </svg>
            {PINS.map((pin, index) => (
              <span
                key={index}
                className={`oph-globe__pin ${index === PINS.length - 1 ? 'oph-globe__pin--home' : ''}`}
                data-label={pin.label}
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, ['--i' as string]: index }}
              >
                <i />
                <b>{L(c.regions[index])}</b>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

/* ================================================================= STORIES */

type ReviewItem = (typeof reviews)[number];

const StoryCard = ({ review, index }: { review: ReviewItem; index?: number }) => {
  const { L, formatDate } = useI18n();
  const doctor = byId(doctors, review.doctorId);
  const service = byId(services, review.serviceId);
  return (
    <figure className="oph-story-card" data-index={index}>
      <span className="oph-story-card__mark oph-story-card__mark--quote" aria-hidden="true">
        “
      </span>
      <blockquote>{L(review.text)}</blockquote>
      <figcaption>
        <strong>{L(review.author)}</strong>
        <span>{[service ? L(service.name) : '', doctor ? L(doctor.name) : ''].filter(Boolean).join(' · ')}</span>
        <time dateTime={review.date}>{formatDate(review.date)}</time>
      </figcaption>
    </figure>
  );
};

/**
 * Touch and narrow screens: a native horizontal swipe row. The browser owns
 * the motion (scroll-snap), so nothing is transformed against the vertical
 * scroll; the counter and the arrows follow the card in view.
 */
const StoriesSwipe = ({ labelledBy }: { labelledBy: string }) => {
  const { L } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = reviews.length;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>('.oph-story-card'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { root: rail, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [total]);

  const go = (index: number) => {
    const rail = railRef.current;
    const card = rail?.querySelectorAll<HTMLElement>('.oph-story-card')[index];
    if (!rail || !card) return;
    const reduce = document.documentElement.dataset.reducedMotion === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const padding = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    rail.scrollTo({ left: card.offsetLeft - padding, behavior: reduce ? 'auto' : 'smooth' });
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="oph-home-stories__swipe">
      <div ref={railRef} className="oph-home-stories__row" role="region" aria-labelledby={labelledBy} tabIndex={0}>
        {reviews.map((review, index) => (
          <StoryCard key={review.id} review={review} index={index} />
        ))}
      </div>
      <div className="oph-home-stories__controls">
        <button
          type="button"
          className="oph-home-stories__arrow"
          aria-label={L(c.storiesPrev)}
          disabled={current === 0}
          onClick={() => go(current - 1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <p className="oph-home-stories__count" aria-hidden="true">
          <b>{pad(current + 1)}</b> / {pad(total)}
        </p>
        <span className="oph-home-stories__bar" aria-hidden="true">
          <span style={{ ['--oph-stories-at' as string]: (current + 1) / total }} />
        </span>
        <button
          type="button"
          className="oph-home-stories__arrow"
          aria-label={L(c.storiesNext)}
          disabled={current >= total - 1}
          onClick={() => go(current + 1)}
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const Stories = () => {
  const { L } = useI18n();
  // A native swipe row everywhere: the pinned rail cost the visitor almost
  // three screens of vertical scrolling to read eight cards.
  return (
    <section className="oph-home-stories" aria-labelledby="home-stories" data-mode="swipe">
      <Container>
        <SectionIndex n={5} />
        <SectionHead
          id="home-stories"
          eyebrow={L(c.storiesEyebrow)}
          title={L(c.storiesTitle)}
          aside={
            <Link to={ROUTES.reviews} className="oph-textlink">
              {L(c.allReviews)}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
      </Container>
      {reviews.length > 0 && <StoriesSwipe labelledBy="home-stories" />}
    </section>
  );
};

/* =============================================================== KNOWLEDGE */

const Knowledge = () => {
  const { L } = useI18n();
  const items = publishedArticles().slice(0, 3);
  return (
    <Section tone="tint" aria-labelledby="home-knowledge">
      <Container>
        <SectionIndex n={6} />
        <SectionHead
          id="home-knowledge"
          eyebrow={L(c.knowledgeEyebrow)}
          title={L(c.knowledgeTitle)}
          text={L(c.knowledgeText)}
          aside={
            <ButtonLink to={ROUTES.knowledge} variant="outline">
              {L(c.knowledgeLink)}
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          }
        />
        <EditorialGrid className="oph-home-compact">
          {items.map((article) => (
            <EditorialCard
              key={article.id}
              eyebrow={L(article.category)}
              title={L(article.title)}
              text={L(article.excerpt)}
              to={`${ROUTES.knowledge}/${article.slug}`}
              linkLabel={L(c.openMaterial)}
            />
          ))}
        </EditorialGrid>
      </Container>
    </Section>
  );
};

/* ==================================================================== PAGE */

const HomePage = () => {
  const { t, L } = useI18n();

  return (
    <>
      <Seo
        title={`${t.brand.name} — ${t.brand.tagline}`}
        description={L(c.heroText)}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalClinic',
            name: t.brand.name,
            url: site.organization.url,
            telephone: site.organization.phone,
            email: site.organization.email,
            medicalSpecialty: 'Ophthalmologic',
            founder: { '@type': 'Physician', name: 'Dr Mukhit Kulmaganbetov', url: `${site.organization.url}${ROUTES.founder}` },
            availableLanguage: ['ru', 'kk', 'en'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: t.brand.name,
            url: site.organization.url,
            inLanguage: ['ru', 'kk', 'en'],
          },
        ]}
      />
      <Hero />
      <MetricsBand />
      <Mission />
      <Founder />
      <Centres />
      <Experts />
      <Stories />
      <Knowledge />
      <CtaBand />
    </>
  );
};

export default HomePage;
