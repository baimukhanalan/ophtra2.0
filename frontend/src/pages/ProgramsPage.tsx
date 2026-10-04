import { ArrowRight, CalendarPlus, ClipboardList, MessageCircle, Wallet } from 'lucide-react';
import { useI18n } from '@/i18n';
import { ButtonLink, Container, Section } from '@/ui';
import { Reveal, StackCards, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, offerCatalogSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { FeatureTile, SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { programs } from '@/content';
import { programsCopy as C } from '@/content/pages/services';
import { DepartmentArt, Disclaimer, NamedSection } from '@/features/services/parts';

/**
 * Medical programmes: each package is a paper sheet that pins and stacks on
 * scroll (price, format, ring-bullet list of what is included), then
 * a scroll-lit statement, the four-step flow and the three benefits.
 */
const ProgramsPage = () => {
  const { t, L, language, formatPrice } = useI18n();

  return (
    <>
      <Seo
        title={t.nav.programs}
        description={L(C.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.programs, url: ROUTES.programs },
          ]),
          offerCatalogSchema(programs.map((program) => ({ name: L(program.name), price: program.price }))),
        ]}
      />

      <PageHero
        eyebrow={t.home.programsEyebrow}
        title={t.nav.programs}
        text={L(C.lead)}
        crumbs={[{ label: t.nav.programs }]}
        aside={<DepartmentArt id="year" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.pricing} muted>
              {t.nav.pricing}
            </HeroLink>
          </>
        }
      />

      {/* ---------------------------------------------------- 01 · LIST */}
      <Section aria-labelledby="programs-list">
        <Container>
          <SectionIndex n={1} label={L(C.listLabel)} />
          <SectionHead id="programs-list" title={L(C.listTitle)} text={t.home.programsText} />
          <div className="svc-block">
            <StackCards>
              {programs.map((program, index) => (
                <article key={program.id} className="svc-program" aria-labelledby={`prog-${program.id}`}>
                  <div className="svc-program__head">
                    <span className="svc-sheet__n">{String(index + 1).padStart(2, '0')}</span>
                    <h3 id={`prog-${program.id}`} className="svc-sheet__title">
                      {L(program.name)}
                    </h3>
                    <p className="svc-sheet__text">{L(program.short)}</p>
                    <dl className="svc-program__facts">
                      <div>
                        <dt>{L(C.price)}</dt>
                        {/* Static: an animated counter shows prices that do not
                            exist mid-flight («154 222 ₸», UI/UX audit S5). */}
                        <dd className="svc-program__price">{formatPrice(program.price)}</dd>
                      </div>
                      <div>
                        <dt>{L(C.duration)}</dt>
                        <dd>{L(program.duration)}</dd>
                      </div>
                    </dl>
                    <ButtonLink to={ROUTES.appointment} variant="primary">
                      <CalendarPlus size={17} aria-hidden="true" />
                      {L(C.book)}
                    </ButtonLink>
                  </div>
                  <div className="svc-program__includes">
                    <p className="oph-eyebrow">{L(C.includes)}</p>
                    <ul className="oph-ringlist">
                      {(program.includes[language] ?? program.includes.ru ?? []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </StackCards>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------- 02 · STATEMENT */}
      <NamedSection tone="deep" label={L(C.statementLabel)}>
        <Container>
          <SectionIndex n={2} label={L(C.statementLabel)} onDark />
          <TextFill text={L(C.statement)} className="svc-statement__text svc-statement__text--wide" />
        </Container>
      </NamedSection>

      {/* ---------------------------------------------------- 03 · FLOW */}
      <Section aria-labelledby="programs-flow">
        <Container>
          <SectionIndex n={3} label={L(C.flowLabel)} />
          <SectionHead id="programs-flow" title={L(C.flowTitle)} />
          <div className="svc-block">
            <StepFlow
              steps={[
                { title: L(C.f1), text: L(C.f1Text) },
                { title: L(C.f2), text: L(C.f2Text) },
                { title: L(C.f3), text: L(C.f3Text) },
                { title: L(C.f4), text: L(C.f4Text) },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------ 04 · BENEFITS */}
      <NamedSection tone="tint" label={L(C.benefitsLabel)}>
        <Container>
          <SectionIndex n={4} label={L(C.benefitsLabel)} />
          <Stagger className="oph-ftiles" step={100}>
            <Reveal variant="up">
              <FeatureTile icon={<Wallet size={20} />} title={L(C.b1)} text={L(C.b1Text)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<MessageCircle size={20} />} title={L(C.b2)} text={L(C.b2Text)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<ClipboardList size={20} />} title={L(C.b3)} text={L(C.b3Text)} />
            </Reveal>
          </Stagger>
          <Disclaimer />
        </Container>
      </NamedSection>

      <CtaBand />
    </>
  );
};

export default ProgramsPage;
