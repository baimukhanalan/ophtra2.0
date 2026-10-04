import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, ExternalLink, MapPin, Users } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { Reveal, StackCards, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, StatGrid, StepFlow } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import {
  AUDIENCES,
  academyCopy as C,
  events,
  patientSchools,
  programmes,
  type AcademyAudience,
} from '@/content/pages/academy';
import { SOURCE_EYEINST } from '@/content/pages/science-publications';

const TODAY = () => new Date().toISOString().slice(0, 10);

/** Chip row filter shared by programmes and the calendar. */
const AudienceChips = ({
  value,
  onChange,
  options,
  label,
  allLabel,
}: {
  value: AcademyAudience | 'all';
  onChange: (value: AcademyAudience | 'all') => void;
  options: typeof AUDIENCES;
  label: string;
  allLabel: string;
}) => {
  const { L } = useI18n();
  return (
    <div className="oph-chips oph-kb-chips" role="group" aria-label={label}>
      <button type="button" className="oph-chip" aria-pressed={value === 'all'} onClick={() => onChange('all')}>
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className="oph-chip"
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
        >
          {L(option.label)}
        </button>
      ))}
    </div>
  );
};

/**
 * Academy (spec §10): professional programmes (courses, masterclasses,
 * wet-labs, journal club) → patient schools → events calendar → how it works
 * → application (LeadForm source="academy").
 */
const AcademyPage = () => {
  const { t, L, language, formatDate } = useI18n();
  const [proAudience, setProAudience] = useState<AcademyAudience | 'all'>('all');
  const [eventAudience, setEventAudience] = useState<AcademyAudience | 'all'>('all');

  const upcoming = useMemo(() => {
    const today = TODAY();
    return events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const visibleProgrammes = programmes.filter(
    (programme) => proAudience === 'all' || programme.audience.includes(proAudience),
  );
  const visibleEvents = upcoming.filter(
    (event) => eventAudience === 'all' || event.audience.includes(eventAudience),
  );

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.heroTitle), url: ROUTES.academy },
      ]),
      // No EducationEvent markup: the dates are a provisional plan until the
      // centre opens, and must not surface as scheduled events in search.
    ],
    [t, L],
  );

  const programmeOptions = [
    ...programmes.map((programme) => ({ value: programme.id, label: programme.title })),
    ...patientSchools.map((school) => ({ value: school.id, label: school.title })),
    ...upcoming.map((event) => ({
      value: event.id,
      label: {
        ru: `${event.title.ru} — ${event.date.split('-').reverse().join('.')}`,
        kk: `${event.title.kk} — ${event.date.split('-').reverse().join('.')}`,
        en: `${event.title.en} — ${event.date.split('-').reverse().join('.')}`,
      },
    })),
  ];

  const stats = [
    { value: 6, label: L(C.stats.teaching) },
    { value: programmes.length, label: L(C.stats.programmes) },
    { value: patientSchools.length, label: L(C.stats.schools) },
  ];

  return (
    <>
      <Seo title={L(C.seoTitle)} description={L(C.seoDescription)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.heroEyebrow)}
        title={L(C.heroTitle)}
        text={L(C.heroText)}
        crumbs={[{ label: L(C.heroTitle) }]}
        actions={
          <>
            <a className="oph-herolink" href="#calendar">
              {L(C.heroCalendar)} →
            </a>
            <a className="oph-herolink oph-herolink--muted" href="#apply">
              {L(C.heroApply)}
            </a>
          </>
        }
      />

      {/* 01 — statement + format */}
      <Section aria-labelledby="ac-format">
        <Container>
          <SectionIndex n={1} />
          <h2 id="ac-format" className="oph-visually-hidden">
            {L(C.statsEyebrow)}
          </h2>
          <TextFill text={L(C.statement)} className="oph-kb-statement" />
          <StatGrid stats={stats} />
          <Reveal variant="up" className="oph-kb-factline">
            <p>{L(C.founderTeaching)}</p>
            <a className="oph-kb-textlink" href={SOURCE_EYEINST} target="_blank" rel="noopener noreferrer">
              {L(C.founderProfile)}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </Reveal>
        </Container>
      </Section>

      {/* 02 — professional programmes */}
      <Section tone="tint" aria-labelledby="ac-pro">
        <Container>
          <SectionIndex n={2} />
          <SectionHead
            id="ac-pro"
            eyebrow={L(C.proEyebrow)}
            title={L(C.proTitle)}
            text={L(C.proText)}
            size="sm"
            aside={
              <AudienceChips
                value={proAudience}
                onChange={setProAudience}
                options={AUDIENCES.filter((entry) => entry.key !== 'patients')}
                label={L(C.audienceLabel)}
                allLabel={L(C.filterAll)}
              />
            }
          />
          <div key={proAudience}>
            <EditorialGrid className="oph-kb-egrid">
              {visibleProgrammes.map((programme) => (
                <EditorialCard
                  key={programme.id}
                  eyebrow={L(programme.format)}
                  title={L(programme.title)}
                  text={L(programme.text)}
                  meta={
                    <>
                      <span>{L(programme.duration)}</span>
                      <span>
                        {programme.audience
                          .map((key) => L(AUDIENCES.find((entry) => entry.key === key)!.label))
                          .join(' · ')}
                      </span>
                    </>
                  }
                />
              ))}
            </EditorialGrid>
          </div>
        </Container>
      </Section>

      {/* 03 — patient school (stacking cards) */}
      <Section aria-labelledby="ac-school">
        <Container>
          <div className="oph-kb-formsplit oph-kb-formsplit--top">
            <div className="oph-kb-stickyhead">
              <SectionIndex n={3} />
              <SectionHead
                id="ac-school"
                eyebrow={L(C.schoolEyebrow)}
                title={L(C.schoolTitle)}
                text={L(C.schoolText)}
                size="sm"
              />
            </div>
            <StackCards className="oph-kb-stack">
              {patientSchools.map((school, index) => (
                <article key={school.id} className="oph-kb-study oph-kb-study--school">
                  <span className="oph-kb-study__n">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="oph-kb-study__title">{L(school.title)}</h3>
                    <p className="oph-kb-study__text">{L(school.text)}</p>
                    <ul className="oph-ringlist">
                      {school.points[language].map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="oph-kb-study__status">{L(C.free)}</p>
                </article>
              ))}
            </StackCards>
          </div>
        </Container>
      </Section>

      {/* 04 — events calendar */}
      <Section tone="deep" className="oph-on-dark oph-kb-anchor" id="calendar" aria-labelledby="ac-calendar">
        <Container>
          <SectionIndex n={4} onDark />
          <SectionHead
            id="ac-calendar"
            eyebrow={L(C.calendarEyebrow)}
            title={L(C.calendarTitle)}
            text={L(C.calendarNote)}
            size="sm"
            aside={
              <AudienceChips
                value={eventAudience}
                onChange={setEventAudience}
                options={AUDIENCES}
                label={L(C.audienceLabel)}
                allLabel={L(C.filterAll)}
              />
            }
          />
          {visibleEvents.length ? (
            <Stagger as="ol" className="oph-kb-events" step={80} key={eventAudience}>
              {visibleEvents.map((event) => {
                const day = new Date(`${event.date}T00:00:00`);
                return (
                  <Reveal as="li" key={event.id} variant="up" className="oph-kb-event">
                    <time className="oph-kb-event__date" dateTime={`${event.date}T${event.time}`}>
                      <span className="oph-kb-event__day">{day.getDate()}</span>
                      <span className="oph-kb-event__month">
                        {formatDate(event.date, { month: 'short' }).replace('.', '')}
                      </span>
                    </time>
                    <div className="oph-kb-event__body">
                      <span className="oph-eyebrow">{L(event.format)}</span>
                      <h3 className="oph-kb-event__title">{L(event.title)}</h3>
                      <ul className="oph-kb-event__meta">
                        <li>
                          <CalendarDays size={14} aria-hidden="true" />
                          {formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long' })}
                        </li>
                        <li>
                          <Clock3 size={14} aria-hidden="true" />
                          {event.time}
                        </li>
                        <li>
                          <MapPin size={14} aria-hidden="true" />
                          {L(event.place)}
                        </li>
                        <li>
                          <Users size={14} aria-hidden="true" />
                          {event.free ? L(C.free) : `${event.seats} ${L(C.seats)}`}
                        </li>
                      </ul>
                    </div>
                    <a className="oph-kb-textlink oph-kb-event__cta" href="#apply">
                      {L(C.apply)}
                      <ArrowRight size={15} aria-hidden="true" />
                      <span className="oph-visually-hidden">: {L(event.title)}</span>
                    </a>
                  </Reveal>
                );
              })}
            </Stagger>
          ) : (
            <EmptyState title={L(C.noEvents)} icon={<CalendarDays size={28} />} />
          )}
        </Container>
      </Section>

      {/* 05 — how it works */}
      <Section aria-labelledby="ac-how">
        <Container>
          <SectionIndex n={5} />
          <SectionHead id="ac-how" eyebrow={L(C.howEyebrow)} title={L(C.howTitle)} size="sm" />
          <StepFlow steps={C.steps.map((step) => ({ title: L(step.title), text: L(step.text) }))} />
        </Container>
      </Section>

      {/* 06 — application */}
      <Section tone="tint" id="apply" className="oph-kb-anchor" aria-labelledby="ac-apply">
        <Container>
          <div className="oph-kb-formsplit">
            <div>
              <SectionIndex n={6} />
              <SectionHead
                id="ac-apply"
                eyebrow={L(C.formEyebrow)}
                title={L(C.formTitle)}
                text={L(C.formText)}
                size="sm"
              />
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm
                source="academy"
                submitLabel={L(C.formSubmit)}
                emailRequired
                commentLabel={C.formComment}
                extraFields={[
                  { name: 'role', label: C.formRole, type: 'select', options: [...C.roles], required: true, half: true },
                  {
                    name: 'programme',
                    label: C.formProgramme,
                    type: 'select',
                    options: programmeOptions,
                    required: true,
                    half: true,
                  },
                ]}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand title={L(C.ctaTitle)} />
    </>
  );
};

export default AcademyPage;
