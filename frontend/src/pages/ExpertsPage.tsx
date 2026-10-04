import { useMemo, useState } from 'react';
import { ArrowRight, FlaskConical, Globe2, Scissors, Users, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { ClipReveal, Reveal, ScrollFx, Stagger, StackCards, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm, type LeadExtraField } from '@/components/LeadForm';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { Photo } from '@/components/Photo';
import { languageNames } from '@/components/people';
import { ROUTES } from '@/app/navigation';
import { PEOPLE_COMMON } from '@/content/pages/people';
import {
  DEMO_EXPERTS,
  EXPERTS,
  NETWORK_COUNTRIES,
  NETWORK_FORMATS,
  NETWORK_REGIONS,
  SUBSPECIALTIES,
  type NetworkCountry,
  type NetworkFormat,
  type RegionId,
} from '@/content/pages/people-network';

type RegionFilter = 'all' | RegionId;

const FORMAT_ICONS: Record<NetworkFormat, ReactNode> = {
  advisory: <Users size={22} />,
  visiting: <Scissors size={22} />,
  tele: <Video size={22} />,
  research: <FlaskConical size={22} />,
};

const countryById = (id: string) => NETWORK_COUNTRIES.find((country) => country.id === id);

/* ================================================================== MAP */

/** Equirectangular projection into a 1000×500 plane, cropped by the viewBox. */
const project = (country: Pick<NetworkCountry, 'lat' | 'lng'>) => ({
  x: ((country.lng + 180) / 360) * 1000,
  y: ((90 - country.lat) / 180) * 500,
});

const HUB = NETWORK_COUNTRIES.find((country) => country.hub) ?? NETWORK_COUNTRIES[0];
const HUB_POINT = project(HUB);

const arcPath = (to: NetworkCountry) => {
  const target = project(to);
  const mx = (HUB_POINT.x + target.x) / 2;
  const my = (HUB_POINT.y + target.y) / 2;
  const distance = Math.hypot(target.x - HUB_POINT.x, target.y - HUB_POINT.y);
  return `M${HUB_POINT.x.toFixed(1)} ${HUB_POINT.y.toFixed(1)} Q${mx.toFixed(1)} ${(my - distance * 0.32).toFixed(1)} ${target.x.toFixed(1)} ${target.y.toFixed(1)}`;
};

/**
 * Schematic network map (no external libraries, no tiles): a dotted
 * graticule, every country as a node and an arc back to the hub in
 * Kazakhstan. The selected region lights up; clicking a node selects its
 * region. The region buttons beside it are the keyboard/screen-reader path —
 * the SVG itself is a labelled image.
 */
const NetworkMap = ({ region, onSelect }: { region: RegionFilter; onSelect: (id: RegionId) => void }) => {
  const { L } = useI18n();
  const others = NETWORK_COUNTRIES.filter((country) => !country.hub);

  return (
    <ScrollFx className="ppl-map">
      <svg className="ppl-map__svg" viewBox="230 40 710 185" role="img" aria-label={L(EXPERTS.mapLabel)}>
        <defs>
          <pattern id="ppl-map-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.9" className="ppl-map__dot" />
          </pattern>
        </defs>
        <rect x="230" y="40" width="710" height="185" fill="url(#ppl-map-dots)" />
        <g className="ppl-map__graticule">
          {[-30, 0, 30, 60, 90, 120, 150].map((lng) => {
            const x = ((lng + 180) / 360) * 1000;
            return <line key={`lng${lng}`} x1={x} x2={x} y1={40} y2={225} />;
          })}
          {[60, 30].map((lat) => {
            const y = ((90 - lat) / 180) * 500;
            return <line key={`lat${lat}`} x1={230} x2={940} y1={y} y2={y} />;
          })}
        </g>

        <g className="ppl-map__arcs">
          {others.map((country, index) => (
            <path
              key={country.id}
              d={arcPath(country)}
              data-active={region === 'all' || region === country.region || undefined}
              style={{ ['--i' as string]: index }}
            />
          ))}
        </g>

        <g>
          {NETWORK_COUNTRIES.map((country, index) => {
            const point = project(country);
            const active = country.hub || region === 'all' || region === country.region;
            return (
              <g
                key={country.id}
                className={`ppl-map__node ${country.hub ? 'ppl-map__node--hub' : ''}`}
                data-active={active || undefined}
                transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}
                style={{ ['--i' as string]: index }}
                onClick={() => onSelect(country.region)}
              >
                <title>{country.hub ? L(EXPERTS.hub) : L(country.name)}</title>
                <circle className="ppl-map__halo" r={country.hub ? 14 : 9} />
                <circle className="ppl-map__pin" r={country.hub ? 5 : 3.4} />
                {active ? (
                  <text
                    className="ppl-map__label"
                    x={country.hub || country.labelAbove ? 0 : 7}
                    y={country.hub ? -18 : country.labelAbove ? -9 : 3}
                    textAnchor={country.hub || country.labelAbove ? 'middle' : 'start'}
                  >
                    {L(country.name)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </ScrollFx>
  );
};

/* ================================================================= PAGE */

const ExpertsPage = () => {
  const { t, L } = useI18n();
  const [region, setRegion] = useState<RegionFilter>('all');

  const formatName = (id: NetworkFormat) => L(NETWORK_FORMATS.find((format) => format.id === id)!.title);
  const subspecialtyName = (id: string) => {
    const match = SUBSPECIALTIES.find((entry) => entry.value === id);
    return match ? L(match.label) : id;
  };

  const experts = useMemo(
    () =>
      DEMO_EXPERTS.filter((expert) => region === 'all' || countryById(expert.country)?.region === region),
    [region],
  );

  const regionCountries = NETWORK_COUNTRIES.filter((country) => region === 'all' || country.region === region);

  const joinFields: LeadExtraField[] = [
    { name: 'country', label: EXPERTS.fieldCountry, required: true, half: true },
    {
      name: 'subspecialty',
      label: EXPERTS.fieldSubspecialty,
      type: 'select',
      required: true,
      half: true,
      options: SUBSPECIALTIES,
    },
    {
      name: 'format',
      label: EXPERTS.fieldFormat,
      type: 'select',
      required: true,
      options: NETWORK_FORMATS.map((format) => ({ value: format.id, label: format.title })),
    },
    { name: 'profile', label: EXPERTS.fieldProfile, placeholder: EXPERTS.fieldProfileHint },
  ];

  return (
    <>
      <Seo
        title={t.nav.experts}
        description={L(EXPERTS.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.about, url: ROUTES.about },
            { name: t.nav.experts, url: ROUTES.experts },
          ]),
        ]}
      />

      <PageHero
        eyebrow={L(EXPERTS.eyebrow)}
        title={t.nav.experts}
        text={L(EXPERTS.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.experts }]}
        actions={
          <>
            <HeroLink to="#experts-join">
              {L(EXPERTS.join)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.secondOpinion} muted>
              {t.nav.secondOpinion}
            </HeroLink>
          </>
        }
      />

      {/* 01 ------------------------------------------------- MODEL */}
      <Section aria-labelledby="experts-model">
        <Container>
          <SectionIndex n={1} />
          <SectionHead
            id="experts-model"
            eyebrow={L(EXPERTS.modelEyebrow)}
            title={L(EXPERTS.modelTitle)}
            text={L(EXPERTS.modelText)}
          />
          <StackCards className="ppl-stack ppl-stack--light">
            {NETWORK_FORMATS.map((format, index) => (
              <article key={format.id} className="ppl-stackcard ppl-stackcard--split">
                <div>
                  <span className="ppl-stackcard__n">{String(index + 1).padStart(2, '0')}</span>
                  <span className="ppl-stackcard__icon" aria-hidden="true">
                    {FORMAT_ICONS[format.id]}
                  </span>
                  <h3 className="ppl-stackcard__title">{L(format.title)}</h3>
                  <p className="ppl-stackcard__text">{L(format.text)}</p>
                </div>
                <ul className="oph-ringlist">
                  {format.points.map((point) => (
                    <li key={point.en}>{L(point)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </StackCards>
        </Container>
      </Section>

      {/* 02 --------------------------------------------------- MAP */}
      <Section tone="tint" aria-labelledby="experts-map">
        <Container>
          <SectionIndex n={2} />
          <SectionHead id="experts-map" eyebrow={L(EXPERTS.mapEyebrow)} title={L(EXPERTS.mapTitle)} text={L(EXPERTS.mapText)} />
          <div className="ppl-network">
            <Reveal variant="scale" className="ppl-network__map">
              <NetworkMap region={region} onSelect={setRegion} />
            </Reveal>
            <Reveal variant="up" delay={120} className="ppl-network__side">
              <div className="ppl-regions" role="group" aria-label={L(EXPERTS.mapTitle)}>
                <button type="button" className="ppl-region" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>
                  <span>{L(EXPERTS.allRegions)}</span>
                  <span className="ppl-region__n">{NETWORK_COUNTRIES.length}</span>
                </button>
                {NETWORK_REGIONS.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="ppl-region"
                    aria-pressed={region === entry.id}
                    onClick={() => setRegion(entry.id)}
                  >
                    <span>{L(entry.name)}</span>
                    <span className="ppl-region__n">
                      {NETWORK_COUNTRIES.filter((country) => country.region === entry.id).length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="ppl-countries" aria-live="polite">
                <p className="ppl-filterrow__label">{L(EXPERTS.countries)}</p>
                <ul>
                  {regionCountries.map((country) => (
                    <li key={country.id}>{L(country.name)}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 03 ---------------------------------------------- PROFILES */}
      <Section aria-labelledby="experts-profiles">
        <Container>
          <SectionIndex n={3} />
          <SectionHead
            id="experts-profiles"
            eyebrow={L(EXPERTS.profilesEyebrow)}
            title={L(EXPERTS.profilesTitle)}
            aside={<p className="ppl-footnote ppl-footnote--flush">{L(EXPERTS.profilesNote)}</p>}
          />
          <Reveal variant="fade" className="ppl-regionchips">
            <div className="oph-chips" role="group" aria-label={L(EXPERTS.mapTitle)}>
              <button type="button" className="oph-chip" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>
                {L(EXPERTS.allRegions)}
              </button>
              {NETWORK_REGIONS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="oph-chip"
                  aria-pressed={region === entry.id}
                  onClick={() => setRegion(entry.id)}
                >
                  {L(entry.name)}
                </button>
              ))}
            </div>
          </Reveal>

          {experts.length ? (
            <Stagger className="ppl-experts" step={80} key={region}>
              {experts.map((expert) => {
                const country = countryById(expert.country);
                return (
                  <Reveal key={expert.id} variant="up" className="ppl-expert">
                    <div className="ppl-expert__head">
                      <span className="ppl-expert__mono" aria-hidden="true">
                        {expert.code}
                      </span>
                      <span className="ppl-expert__name">
                        {L(EXPERTS.expertName)} {expert.code}
                      </span>
                      <span className="oph-tag ppl-expert__demo">{L(PEOPLE_COMMON.demo)}</span>
                    </div>
                    <span className="oph-eyebrow">{country ? L(country.name) : ''}</span>
                    <h3 className="ppl-expert__title">{subspecialtyName(expert.subspecialty)}</h3>
                    <p className="ppl-expert__text">{L(expert.focus)}</p>
                    <div className="ppl-expert__tags">
                      {expert.formats.map((format) => (
                        <span key={format} className="ppl-expert__format">
                          {formatName(format)}
                        </span>
                      ))}
                    </div>
                    <p className="ppl-expert__langs">{languageNames(expert.languages)}</p>
                  </Reveal>
                );
              })}
            </Stagger>
          ) : (
            <EmptyState title={L(EXPERTS.noProfiles)} icon={<Globe2 size={28} />} />
          )}
        </Container>
      </Section>

      {/* 04 ------------------------------------------------- FLOW */}
      <Section tone="deep" className="ppl-darkflow" aria-labelledby="experts-flow">
        <Container>
          <SectionIndex n={4} onDark />
          <SectionHead id="experts-flow" eyebrow={L(EXPERTS.flowEyebrow)} title={L(EXPERTS.flowTitle)} />
          <StepFlow steps={EXPERTS.flow.map((step) => ({ title: L(step.title), text: L(step.text) }))} />
          <div className="ppl-flow__foot">
            <TextFill text={L(EXPERTS.flowStatement)} className="ppl-statement ppl-statement--sm" />
            <Reveal variant="up">
              <HeroLink to={ROUTES.secondOpinion}>
                {L(EXPERTS.toSecondOpinion)}
                <ArrowRight size={16} aria-hidden="true" />
              </HeroLink>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 05 --------------------------------------------- STANDARDS */}
      <Section aria-labelledby="experts-standards">
        <Container>
          <SectionIndex n={5} />
          <SectionHead id="experts-standards" eyebrow={L(EXPERTS.standardsEyebrow)} title={L(EXPERTS.standardsTitle)} />
          <EditorialGrid>
            {EXPERTS.standards.map((item, index) => (
              <EditorialCard key={item.title.en} index={index + 1} title={L(item.title)} text={L(item.text)} />
            ))}
          </EditorialGrid>
        </Container>
      </Section>

      {/* 06 -------------------------------------------------- JOIN */}
      <Section tone="tint" id="experts-join" aria-labelledby="experts-join-title" className="ppl-anchor">
        <Container>
          <SectionIndex n={6} />
          <div className="ppl-formsplit">
            <div className="ppl-formsplit__intro">
              <SectionHead
                id="experts-join-title"
                eyebrow={L(EXPERTS.joinEyebrow)}
                title={L(EXPERTS.joinTitle)}
                text={L(EXPERTS.joinText)}
                size="sm"
              />
              <ClipReveal className="ppl-formsplit__media">
                <Photo src="/media/clinic-entrance.jpg" alt="" width={1440} height={1079} sizes="(max-width: 900px) 100vw, 40vw" />
              </ClipReveal>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm
                source="expert-network"
                submitLabel={L(EXPERTS.joinSubmit)}
                extraFields={joinFields}
                emailRequired
                commentLabel={EXPERTS.commentLabel}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default ExpertsPage;
