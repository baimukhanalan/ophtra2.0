import { Suspense, use, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarPlus, Clock, Stethoscope } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Accordion, ButtonLink, Container, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, autoDescription, breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { DoctorCard } from '@/components/cards';
import {
  ArticleBody,
  ContinueBox,
  EditorialCard,
  EditorialGrid,
  SectionHead,
  SectionIndex,
  SourcesBox,
  type ArticleSection,
} from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { byId, bySlug, departments, doctorsForService, services, servicesOfDepartment } from '@/content';
import { publishedArticles } from '@/content/articles';
import { loadServiceContent } from '@/content/pages/services-content';
import {
  serviceDetailCopy as C,
  servicesIndexCopy,
  sharedCopy,
  type ServiceContent,
} from '@/content/pages/services';
import {
  CLINIC_ID,
  DepartmentArt,
  Disclaimer,
  FromPrice,
  SITE_ORIGIN,
  bookServiceRoute,
  departmentRoute,
  serviceRoute,
  NamedSection,
} from '@/features/services/parts';
import type { Article, Service } from '@/types';

/** Knowledge-base articles per department, used when topic matching finds nothing. */
const DEPARTMENT_ARTICLES: Record<string, string[]> = {
  diagnostics: ['art-glaucoma', 'art-dryeye'],
  treatment: ['art-glaucoma', 'art-dryeye'],
  laser: ['art-laser-prep'],
  cataract: ['art-cataract'],
  pediatric: ['art-myopia'],
  optical: ['art-lenses', 'art-dryeye'],
};

const relatedArticles = (service: Service, content?: ServiceContent): Article[] => {
  const all = publishedArticles();
  const topics = content?.topics ?? [];
  const matched = all.filter((article) => {
    const haystack = `${article.title.ru} ${article.category.ru} ${article.excerpt.ru}`.toLocaleLowerCase('ru');
    return topics.some((topic) => haystack.includes(topic.toLocaleLowerCase('ru')));
  });
  const fallback = (DEPARTMENT_ARTICLES[service.departmentId] ?? [])
    .map((id) => all.find((article) => article.id === id))
    .filter((article): article is Article => Boolean(article));
  const merged = [...matched, ...fallback].filter(
    (article, index, list) => list.findIndex((entry) => entry.id === article.id) === index,
  );
  return (merged.length ? merged : all).slice(0, 3);
};

/*
 * schema.org typing per service (perf/SEO audit SEO-10). Seo.tsx's
 * medicalProcedureSchema() always emits SurgicalProcedure, so it is not used
 * here: tests are MedicalTest, fittings are a plain Service, injections are
 * percutaneous, and only the operations are surgical.
 */
const PROCEDURE_TYPE: Record<ServiceContent['kind'], string> = {
  test: 'https://schema.org/NoninvasiveProcedure',
  consultation: 'https://schema.org/NoninvasiveProcedure',
  therapy: 'https://schema.org/TherapeuticProcedure',
  surgery: 'https://schema.org/SurgicalProcedure',
};

const PROCEDURE_TYPE_BY_SLUG: Record<string, string> = {
  'intravitreal-injection': 'https://schema.org/PercutaneousProcedure',
};

/** Optical fittings are a service of the clinic, not a medical procedure. */
const PLAIN_SERVICES = new Set(['glasses-fitting', 'contact-lens-fitting']);

/**
 * Figma «06 Страница услуги — ОКТ»: hero with category eyebrow, title sized
 * to its length and a price card; then the article template — sticky «На этой
 * странице» contents and numbered sections — followed by doctors, related
 * articles and the consultation request form (spec §6).
 */
const ServiceDetailPage = () => {
  const { slug = '' } = useParams();
  const service = bySlug(services, slug);
  if (!service) return <ServiceNotFound />;
  // The long-form body is a per-slug chunk (≈4 kB). The page, its <Seo> and
  // JSON-LD render only once it has arrived, so crawlers never see a partial
  // schema; the fallback holds the viewport so the footer does not jump.
  return (
    <Suspense fallback={<ServiceFallback />}>
      <ServiceDetail key={service.id} service={service} />
    </Suspense>
  );
};

const ServiceFallback = () => {
  const { L } = useI18n();
  return (
    <div className="svc-fallback" role="status" aria-live="polite">
      <span className="oph-spinner" aria-hidden="true" />
      <span className="oph-visually-hidden">{L(C.loading)}</span>
    </div>
  );
};

const ServiceDetail = ({ service }: { service: Service }) => {
  const { t, L, language, formatPrice } = useI18n();
  const content = use(loadServiceContent(service.slug));
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const department = byId(departments, service.departmentId);
  const doctors = doctorsForService(service.id);
  const articles = useMemo(() => relatedArticles(service, content), [service, content]);
  const siblings = servicesOfDepartment(service.departmentId).filter((entry) => entry.id !== service.id);

  const name = L(service.name);
  const departmentName = department ? L(department.name) : '';
  const lead = content ? L(content.lead) : L(service.short);

  /* ---------------------------------------------------------- sections */
  const sections: ArticleSection[] = [
    {
      id: 'svc-overview',
      title: L(C.overview),
      body: content ? (
        content.overview[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)
      ) : (
        <p>{L(service.short)}</p>
      ),
    },
  ];

  if (content) {
    const lang = language;
    sections.push(
      { id: 'svc-indications', title: L(C.indications), list: content.indications[lang] },
      { id: 'svc-diagnostics', title: L(C.diagnostics), body: <p>{L(content.diagnostics.intro)}</p>, list: content.diagnostics.list[lang] },
      { id: 'svc-treatment', title: L(C.treatment), body: <p>{L(content.treatment.intro)}</p>, list: content.treatment.list[lang] },
    );
    if (content.preparation?.[lang]?.length) {
      sections.push({ id: 'svc-preparation', title: L(C.preparation), list: content.preparation[lang] });
    }
    if (content.result) {
      sections.push({ id: 'svc-result', title: L(C.result), body: <p>{L(content.result)}</p> });
    }
    if (content.faq.length) {
      sections.push({
        id: 'svc-faq',
        title: L(C.faq),
        body: (
          <Accordion
            items={content.faq.map((item, index) => ({
              id: `svc-faq-${index}`,
              question: L(item.q),
              answer: L(item.a),
            }))}
          />
        ),
      });
    }
  }

  /* ------------------------------------------------------------ JSON-LD */
  const path = serviceRoute(service.slug);
  const url = `${SITE_ORIGIN}${path}`;
  const priceLine = L(C.seoPrice)
    .replace('{price}', formatPrice(service.price))
    .replace('{duration}', String(service.duration));
  // 70–160 characters: the lead plus price when it fits, trimmed on a word
  // boundary otherwise (a few leads alone ran to 235 characters).
  const description = autoDescription(lead.length <= 110 ? `${lead} ${priceLine}` : lead);

  const kind = content?.kind ?? 'consultation';
  const offer = {
    '@type': 'Offer',
    price: service.price,
    priceCurrency: 'KZT',
    url,
    offeredBy: { '@id': CLINIC_ID },
  };
  const entity: Record<string, unknown> = PLAIN_SERVICES.has(service.slug)
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${url}#service`,
        name,
        description: lead,
        url,
        serviceType: departmentName || name,
        provider: { '@id': CLINIC_ID },
        offers: offer,
      }
    : kind === 'test'
      ? {
          '@context': 'https://schema.org',
          '@type': 'MedicalTest',
          '@id': `${url}#service`,
          name,
          description: lead,
          url,
          offers: offer,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'MedicalProcedure',
          '@id': `${url}#service`,
          name,
          description: lead,
          url,
          bodyLocation: 'Eye',
          procedureType: PROCEDURE_TYPE_BY_SLUG[service.slug] ?? PROCEDURE_TYPE[kind],
          ...(content?.preparation ? { preparation: content.preparation[language].join(' ') } : {}),
          ...(content?.result ? { followup: L(content.result) } : {}),
          offers: offer,
        };

  const jsonLd = [
    medicalWebPageSchema({ title: name, description, path, language }),
    breadcrumbSchema([
      { name: t.common.breadcrumbHome, url: ROUTES.home },
      { name: L(servicesIndexCopy.seoTitle), url: ROUTES.services },
      ...(department ? [{ name: departmentName, url: departmentRoute(department.id) }] : []),
      { name, url: serviceRoute(service.slug) },
    ]),
    entity,
    ...(content?.faq.length
      ? [faqSchema(content.faq.map((item) => ({ question: L(item.q), answer: L(item.a) })))]
      : []),
  ];

  let n = 0;
  const next = () => (n += 1);

  return (
    <>
      <Seo title={name} description={description} jsonLd={jsonLd} />

      <PageHero
        eyebrow={departmentName}
        title={name}
        text={lead}
        crumbs={[
          { label: L(servicesIndexCopy.seoTitle), to: ROUTES.services },
          ...(department ? [{ label: departmentName, to: departmentRoute(department.id) }] : []),
          { label: name },
        ]}
        meta={
          <>
            <span>
              <FromPrice>{formatPrice(service.price)}</FromPrice>
            </span>
            <span>
              {service.duration} {L(sharedCopy.minutes)}
            </span>
          </>
        }
        actions={
          <>
            <HeroLink to={bookServiceRoute(service.slug)}>
              {t.common.book}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.services} muted>
              {L(sharedCopy.allServices)}
            </HeroLink>
          </>
        }
        aside={
          <aside className="svc-pricecard" aria-label={L(C.price)}>
            <p className="oph-eyebrow">{L(C.price)}</p>
            {/* Money is never animated: a counter mid-flight shows a price
                that does not exist (UI/UX audit S5). */}
            <p className="svc-pricecard__value">
              <FromPrice>{formatPrice(service.price)}</FromPrice>
            </p>
            <dl className="svc-pricecard__facts">
              <div>
                <dt>
                  <Clock size={14} aria-hidden="true" />
                  {L(C.duration)}
                </dt>
                <dd>
                  {service.duration} {L(sharedCopy.minutes)}
                </dd>
              </div>
              {doctors.length ? (
                <div>
                  <dt>
                    <Stethoscope size={14} aria-hidden="true" />
                    {L(C.doctorsCount)}
                  </dt>
                  <dd>{doctors.length}</dd>
                </div>
              ) : null}
            </dl>
            <p className="svc-pricecard__note">{L(C.priceNote)}</p>
            <ButtonLink to={bookServiceRoute(service.slug)} variant="onDark" block>
              <CalendarPlus size={17} aria-hidden="true" />
              {t.common.book}
            </ButtonLink>
          </aside>
        }
      />

      <div ref={startRef} aria-hidden="true" />

      {/* ------------------------------------------------------- ARTICLE */}
      <NamedSection label={name}>
        <Container>
          <ArticleBody
            sections={sections}
            tocLabel={L(C.toc)}
            after={
              <div className="svc-article-after">
                <Disclaimer />
                <ContinueBox
                  title={L(C.continueTitle)}
                  links={[
                    ...(department
                      ? [{ label: `${L(C.departmentLink)}: ${departmentName}`, to: departmentRoute(department.id) }]
                      : []),
                    ...siblings.slice(0, 2).map((entry) => ({ label: L(entry.name), to: serviceRoute(entry.slug) })),
                    { label: t.nav.pricing, to: ROUTES.pricing },
                  ]}
                />
                {content?.sources.length ? (
                  <SourcesBox title={L(C.sourcesTitle)} note={L(C.sourcesNote)} sources={content.sources} />
                ) : null}
              </div>
            }
          />
        </Container>
      </NamedSection>

      {/* ------------------------------------------------------- DOCTORS */}
      {doctors.length ? (
        <Section tone="tint" aria-labelledby="svc-doctors">
          <Container>
            <SectionIndex n={next()} label={L(C.doctorsLabel)} />
            {/* Fewer than four doctors: heading beside the cards instead of a
                four-column row with empty cells (audit X10). */}
            <div
              className={`svc-team svc-team--n${Math.min(doctors.length, 4)} ${doctors.length < 4 ? 'svc-team--duo' : ''}`}
              style={{ ['--count' as string]: Math.min(doctors.length, 4) }}
            >
              <SectionHead id="svc-doctors" title={L(C.doctorsTitle)} text={L(C.doctorsText)} />
              <Stagger className="svc-doctors svc-doctors--rail" step={90}>
                {doctors.slice(0, 4).map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </Stagger>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ ARTICLES */}
      <Section aria-labelledby="svc-articles">
        <Container>
          <SectionIndex n={next()} label={L(C.articlesLabel)} />
          <SectionHead id="svc-articles" title={L(C.articlesTitle)} />
          <div className="svc-block">
            <EditorialGrid>
              {articles.map((article) => (
                <EditorialCard
                  key={article.id}
                  eyebrow={L(article.category)}
                  title={L(article.title)}
                  text={L(article.excerpt)}
                  to={`${ROUTES.knowledge}/${article.slug}`}
                  linkLabel={L(sharedCopy.openMaterial)}
                  meta={
                    <span className="svc-meta__time">
                      <Clock size={13} aria-hidden="true" />
                      {article.readingMinutes} {L(sharedCopy.minutes)}
                    </span>
                  }
                />
              ))}
            </EditorialGrid>
          </div>
        </Container>
      </Section>

      <div ref={endRef} aria-hidden="true" />

      {/* ---------------------------------------------------------- FORM */}
      <Section tone="tint" aria-labelledby="svc-form">
        <Container>
          <SectionIndex n={next()} label={L(C.formLabel)} />
          <div className="oph-duo svc-formduo">
            <div className="svc-formduo__intro">
              <SectionHead id="svc-form" title={L(C.formTitle)} text={L(C.formText)} />
              <Reveal variant="scale" className="svc-formduo__media svc-formduo__media--art">
                <DepartmentArt id={service.departmentId} />
              </Reveal>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm source="service-consultation" serviceId={service.id} withFiles />
            </Reveal>
          </div>
        </Container>
      </Section>

      <StickyBook
        startRef={startRef}
        endRef={endRef}
        to={bookServiceRoute(service.slug)}
        label={t.common.book}
        price={formatPrice(service.price)}
        service={name}
      />

      <CtaBand />
    </>
  );
};

/* ======================================================= STICKY BOOKING */

/**
 * Phones only (UI/UX audit S3): once the hero with its price card has
 * scrolled away, a forest pill «Записаться · от 12 000 ₸» sits at the bottom
 * centre, between the accessibility and assistant launchers, until the
 * consultation form comes into view. Hidden from focus and assistive tech
 * while off-screen.
 */
/** Px each StickyBook edge must be crossed by before the bar toggles. */
const STICKY_BOOK_MARGIN = 40;

const StickyBook = ({
  startRef,
  endRef,
  to,
  label,
  price,
  service,
}: {
  startRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  to: string;
  label: string;
  price: string;
  service: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // A passive, frame-throttled scroll check rather than an
    // IntersectionObserver: a jump (contents link, restored scroll) from
    // below the fold to past the top never "intersects", so an observer
    // would miss it. Two rect reads per frame, only while scrolling.
    let frame = 0;
    const measure = () => {
      frame = 0;
      const start = startRef.current;
      const end = endRef.current;
      if (!start || !end) return;
      // Hysteresis on both edges (the bar shows a margin past each boundary
      // and hides only once back across the other side), measured against the
      // layout viewport rather than innerHeight, which moves with the URL bar.
      const viewport = document.documentElement.clientHeight;
      const startTop = start.getBoundingClientRect().top;
      const endTop = end.getBoundingClientRect().top;
      setVisible((current) => {
        const next = current
          ? startTop < STICKY_BOOK_MARGIN && endTop > viewport - STICKY_BOOK_MARGIN
          : startTop < -STICKY_BOOK_MARGIN && endTop > viewport + STICKY_BOOK_MARGIN;
        return current === next ? current : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [startRef, endRef]);

  return (
    <div className="svc-stickybook" data-visible={visible} inert={!visible}>
      <Link className="svc-stickybook__btn" to={to} aria-label={`${label}: ${service}`}>
        <CalendarPlus size={17} aria-hidden="true" />
        <span>{label}</span>
        <span className="svc-stickybook__price" aria-hidden="true">
          <FromPrice>{price}</FromPrice>
        </span>
      </Link>
    </div>
  );
};

/* ================================================================ 404 */

const ServiceNotFound = () => {
  const { t, L } = useI18n();
  return (
    <>
      <Seo title={L(C.notFoundTitle)} description={L(C.notFoundText)} noIndex />
      <PageHero
        eyebrow="404"
        title={L(C.notFoundTitle)}
        text={L(C.notFoundText)}
        crumbs={[{ label: L(servicesIndexCopy.seoTitle), to: ROUTES.services }, { label: L(C.notFoundTitle) }]}
        actions={
          <>
            <HeroLink to={ROUTES.services}>
              {L(sharedCopy.allServices)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.appointment} muted>
              {t.common.bookNow}
            </HeroLink>
          </>
        }
      />
      <Section aria-labelledby="svc-404-areas">
        <Container>
          <SectionIndex n={1} label={L(servicesIndexCopy.areasLabel)} />
          <SectionHead id="svc-404-areas" title={L(servicesIndexCopy.title)} />
          <div className="svc-block">
            <EditorialGrid>
              {departments.map((department, index) => (
                <EditorialCard
                  key={department.id}
                  index={index + 1}
                  title={L(department.name)}
                  text={L(department.short)}
                  to={departmentRoute(department.id)}
                  linkLabel={L(sharedCopy.aboutDepartment)}
                />
              ))}
            </EditorialGrid>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
};

export default ServiceDetailPage;
