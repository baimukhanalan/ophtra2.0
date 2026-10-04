import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { ClipReveal, Reveal, Stagger, StackCards, Timeline, TimelineItem } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionHead, SectionIndex, StatGrid } from '@/components/editorial';
import { site } from '@/content';
import { Photo } from '@/components/Photo';
import { ROUTES } from '@/app/navigation';
import { ABOUT } from '@/content/pages/people';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Figma «02 О центре».
 * Figma error 7: the frame pasted the home page inside this page (care-map
 * bento, the dark «Наука» block, the mission statement, the equipment
 * marquee). About now tells its own story — the verified science behind the
 * new centre, values, how the centre began, its areas as a short index, the
 * technology explained, where it is and the people — and leaves the
 * home-page scenes to the home page.
 *
 * Facts: DESIGN.md §7 only. The centre is new (Astana); the unverified
 * site-wide metrics (years, operations, doctors, satisfaction) and the 2009
 * timeline are not used here.
 */
const AboutPage = () => {
  const { t, L } = useI18n();

  return (
    <>
      <Seo
        title={t.nav.aboutClinic}
        description={L(ABOUT.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.aboutClinic, url: ROUTES.about },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: t.nav.aboutClinic,
            description: L(ABOUT.lead),
            about: { '@type': 'MedicalClinic', name: t.brand.name, address: { '@type': 'PostalAddress', addressLocality: 'Astana', addressCountry: 'KZ' } },
          },
        ]}
      />

      <PageHero
        eyebrow={L(ABOUT.eyebrow)}
        title={t.nav.aboutClinic}
        text={L(ABOUT.lead)}
        crumbs={[{ label: t.nav.aboutClinic }]}
        actions={
          <>
            <HeroLink to={ROUTES.doctors}>
              {t.common.allDoctors}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.management} muted>
              {t.nav.management}
            </HeroLink>
          </>
        }
        aside={
          <Photo
            className="oph-pagehero__photo"
            src="/media/clinic-facade.jpg"
            alt={L(ABOUT.photoAlt)}
            width={1440}
            height={1079}
            sizes="(max-width: 900px) 100vw, 460px"
            eager
          />
        }
      />

      {/* 01 ------------------------------------------ METRICS (Figma) */}
      <Section tight aria-labelledby="about-metrics">
        <Container>
          <SectionIndex n={1} />
          <div className="ppl-metrics">
            <h2 id="about-metrics" className="oph-eyebrow ppl-creds__label">
              {L(ABOUT.metricsLabel)}
            </h2>
            {/* Figma «02 О центре»: the four centre metrics. */}
            <StatGrid
              stats={site.metrics.map((metric) => ({
                value: metric.value,
                suffix: metric.suffix,
                label: {
                  years: t.home.metricYears,
                  operations: t.home.metricOperations,
                  doctors: t.home.metricDoctors,
                  satisfaction: t.home.metricSatisfaction,
                }[metric.id] ?? metric.id,
              }))}
            />
            {/* Founder facts row: the same card grid, second row. */}
            <StatGrid stats={ABOUT.facts.map((fact) => ({ value: fact.value, suffix: fact.suffix, label: L(fact.label) }))} />
          </div>
          <Reveal variant="fade">
            <p className="ppl-footnote">{L(ABOUT.metricsNote)}</p>
          </Reveal>
        </Container>
      </Section>

      {/* 02 ------------------------------------------------- VALUES */}
      <Section tone="tint" aria-labelledby="about-values">
        <Container>
          <SectionIndex n={2} />
          <SectionHead id="about-values" eyebrow={L(ABOUT.valuesEyebrow)} title={L(ABOUT.valuesTitle)} />
          <StackCards className="ppl-stack ppl-stack--light ppl-values">
            {ABOUT.values.map((value, index) => (
              <article key={value.id} className="ppl-stackcard">
                <span className="ppl-stackcard__n">{pad(index + 1)}</span>
                <h3 className="ppl-stackcard__title">{L(value.title)}</h3>
                <p className="ppl-stackcard__text">{L(value.text)}</p>
              </article>
            ))}
          </StackCards>
        </Container>
      </Section>

      {/* 03 ------------------------------------------------ HISTORY */}
      <Section aria-labelledby="about-history">
        <Container>
          <SectionIndex n={3} />
          <div className="ppl-history">
            <div className="ppl-history__aside">
              <SectionHead id="about-history" eyebrow={L(ABOUT.historyEyebrow)} title={L(ABOUT.historyTitle)} size="sm" />
            </div>
            <Timeline className="ppl-timeline">
              {ABOUT.history.map((entry) => (
                <TimelineItem key={entry.id}>
                  <span className="ppl-timeline__year">{L(entry.step)}</span>
                  <h3 className="ppl-timeline__title">{L(entry.title)}</h3>
                  <p className="ppl-timeline__text">{L(entry.text)}</p>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </Section>

      {/* 04 ------------------------------- DEPARTMENTS (index, not bento) */}
      <Section tone="tint" aria-labelledby="about-excellence">
        <Container>
          <SectionIndex n={4} />
          <SectionHead
            id="about-excellence"
            eyebrow={L(ABOUT.excellenceEyebrow)}
            title={L(ABOUT.excellenceTitle)}
            text={L(ABOUT.excellenceText)}
          />
          <Stagger as="ol" className="ppl-index" step={70}>
            {ABOUT.excellence.map((item, index) => (
              <Reveal as="li" key={item.id} variant="up">
                <Link className="ppl-index__row" to={item.to}>
                  <span className="ppl-index__n">{pad(index + 1)}</span>
                  <span className="ppl-index__title">{L(item.title)}</span>
                  <span className="ppl-index__text">{L(item.text)}</span>
                  <span className="ppl-index__go">
                    <span className="oph-visually-hidden">{L(ABOUT.open)}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 05 ------------------------------------ EQUIPMENT (explained) */}
      <Section aria-labelledby="about-equipment">
        <Container>
          <SectionIndex n={5} />
          <SectionHead
            id="about-equipment"
            eyebrow={L(ABOUT.equipmentEyebrow)}
            title={L(ABOUT.equipmentTitle)}
            text={L(ABOUT.equipmentText)}
          />
          <Stagger as="dl" className="ppl-equip" step={80}>
            {ABOUT.equipment.map((item, index) => (
              <Reveal key={item.id} variant="up" className="ppl-equip__item">
                <dt className="ppl-equip__name">
                  <span className="ppl-equip__n" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  {L(item.name)}
                </dt>
                <dd className="ppl-equip__text">{L(item.text)}</dd>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 06 --------------------------------------------------- WHERE */}
      <Section tone="tint" aria-labelledby="about-clinics">
        <Container>
          <SectionIndex n={6} />
          <div className="ppl-where">
            <ClipReveal className="ppl-where__media">
              <Photo src="/media/clinic-day.jpg" alt="" width={1440} height={1079} sizes="(max-width: 900px) 100vw, 55vw" />
            </ClipReveal>
            <div className="ppl-where__body">
              <SectionHead
                id="about-clinics"
                eyebrow={L(ABOUT.clinicsEyebrow)}
                title={L(ABOUT.clinicsTitle)}
                text={L(ABOUT.clinicsText)}
                size="sm"
              />
              <Reveal variant="up" delay={180}>
                <Link className="oph-link ppl-textlink" to={ROUTES.contacts}>
                  {L(ABOUT.clinicsLink)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 07 ------------------------------------- PEOPLE (entry points) */}
      <Section tone="deep" aria-labelledby="about-team">
        <Container>
          <SectionIndex n={7} onDark />
          <SectionHead id="about-team" eyebrow={L(ABOUT.teamEyebrow)} title={L(ABOUT.teamTitle)} />
          <Stagger as="ul" className="ppl-entries" step={90}>
            {ABOUT.team.map((entry, index) => (
              <Reveal as="li" key={entry.id} variant="up" className={entry.id === 'founder' ? 'ppl-entries__lead' : undefined}>
                <Link className="ppl-entry" to={entry.to}>
                  <span className="ppl-entry__n">{pad(index + 1)}</span>
                  <span className="ppl-entry__title">{L(entry.title)}</span>
                  <span className="ppl-entry__text">{L(entry.text)}</span>
                  <ArrowUpRight size={20} aria-hidden="true" className="ppl-entry__arrow" />
                </Link>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default AboutPage;
