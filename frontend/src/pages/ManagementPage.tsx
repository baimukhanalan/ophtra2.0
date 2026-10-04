import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Languages } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { ClipReveal, Reveal, ScrollFx, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { DemoTag, languageNames, yearsWord } from '@/components/people';
import { DoctorPortrait } from '@/services/images';
import { ROUTES } from '@/app/navigation';
import { departments, managementTeam } from '@/content';
import { ABOUT, DEMO_NOTE, DOCTORS_ARE_DEMO, FOUNDER_BRIEF, MANAGEMENT } from '@/content/pages/people';

const ManagementPage = () => {
  const { t, L, language } = useI18n();
  const team = managementTeam();

  return (
    <>
      <Seo
        title={t.nav.management}
        description={L(MANAGEMENT.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.about, url: ROUTES.about },
            { name: t.nav.management, url: ROUTES.management },
          ]),
          // Leadership records are demo data, so no Physician schema is
          // emitted for them here (it would present them as real people).
        ]}
      />

      <PageHero
        eyebrow={L(MANAGEMENT.eyebrow)}
        title={t.nav.management}
        text={L(MANAGEMENT.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.management }]}
        actions={
          <>
            <HeroLink to={ROUTES.founder}>
              {t.nav.founder}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.doctors} muted>
              {t.common.allDoctors}
            </HeroLink>
          </>
        }
      />

      {/* 01 ---------------------------------------------- STATEMENT */}
      <Section tight>
        <Container>
          <SectionIndex n={1} />
          <TextFill text={L(MANAGEMENT.statement)} className="ppl-statement ppl-statement--ink" />
        </Container>
      </Section>

      {/* 02 ------------------------------------------------ FOUNDER */}
      <Section tone="tint" aria-labelledby="management-founder">
        <Container>
          <SectionIndex n={2} />
          <div className="oph-duo">
            <Reveal variant="scale" className="ppl-credpanel">
              <ScrollFx className="ppl-credpanel__inner">
                <Stagger className="ppl-credpanel__list" step={140}>
                  {FOUNDER_BRIEF.credentials.map((abbr) => (
                    <Reveal key={abbr} variant="up" className="ppl-credpanel__abbr">
                      {abbr}
                    </Reveal>
                  ))}
                </Stagger>
                <span className="ppl-credpanel__rail" aria-hidden="true" />
              </ScrollFx>
            </Reveal>
            <div>
              <SectionHead
                id="management-founder"
                eyebrow={L(MANAGEMENT.founderEyebrow)}
                title={L(FOUNDER_BRIEF.fullTitle)}
                text={L(MANAGEMENT.founderText)}
                size="sm"
              />
              <Reveal variant="up" delay={200}>
                <Link className="oph-link ppl-textlink" to={ROUTES.founder}>
                  {L(ABOUT.founderLink)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03 --------------------------------------------------- TEAM */}
      <Section aria-labelledby="management-team">
        <Container>
          <SectionIndex n={3} />
          <SectionHead id="management-team" eyebrow={L(MANAGEMENT.teamEyebrow)} title={L(MANAGEMENT.teamTitle)} />
          {DOCTORS_ARE_DEMO ? <p className="ppl-footnote ppl-footnote--tight">{L(DEMO_NOTE.doctors)}</p> : null}
          <div className="ppl-leaders">
            {team.map((member, index) => (
              <article key={member.id} className={`ppl-leader ${index % 2 ? 'ppl-leader--reverse' : ''}`}>
                <ClipReveal className="ppl-leader__media">
                  <span className="ppl-leader__portrait" aria-hidden="true">
                    <DoctorPortrait photo={member.photo} seed={member.id} label={L(member.name)} />
                  </span>
                </ClipReveal>
                <Reveal variant={index % 2 ? 'right' : 'left'} className="ppl-leader__body">
                  <div className="ppl-leader__tags">
                    <span className="oph-eyebrow">{L(member.role)}</span>
                    <DemoTag />
                    <span className="oph-tag">
                      {t.common.experience} {member.experience} {yearsWord(member.experience, language)}
                    </span>
                  </div>
                  <h3 className="ppl-leader__name">{L(member.name)}</h3>
                  <p className="ppl-leader__bio">{L(member.bio)}</p>
                  <ul className="ppl-leader__facts">
                    <li>
                      <GraduationCap size={16} aria-hidden="true" />
                      <span>
                        {L(member.education)} · {L(member.category)}
                      </span>
                    </li>
                    <li>
                      <Languages size={16} aria-hidden="true" />
                      <span>{languageNames(member.languages)}</span>
                    </li>
                  </ul>
                  <div className="ppl-infocard__tags">
                    {member.departmentIds.map((id) => {
                      const department = departments.find((entry) => entry.id === id);
                      return department ? (
                        <span key={id} className="oph-tag">
                          {L(department.name)}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <Link className="oph-link ppl-textlink" to={`${ROUTES.doctors}/${member.slug}`}>
                    {L(MANAGEMENT.profile)}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </Reveal>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 04 --------------------------------------------- GOVERNANCE */}
      <Section tone="tint" aria-labelledby="management-governance">
        <Container>
          <SectionIndex n={4} />
          <SectionHead
            id="management-governance"
            eyebrow={L(MANAGEMENT.governanceEyebrow)}
            title={L(MANAGEMENT.governanceTitle)}
          />
          <EditorialGrid>
            {MANAGEMENT.governance.map((item, index) => (
              <EditorialCard key={item.title.en} index={index + 1} title={L(item.title)} text={L(item.text)} />
            ))}
          </EditorialGrid>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default ManagementPage;
