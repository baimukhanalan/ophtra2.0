import { useMemo, useState } from 'react';
import { ArrowRight, Search, UserSearch } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button, Container, EmptyState, Input, Section } from '@/ui';
import { Reveal } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionIndex } from '@/components/editorial';
import { BalancedGrid, DoctorTile } from '@/components/people';
import { ROUTES } from '@/app/navigation';
import { clinics, departments, doctors, site } from '@/content';
import { DEMO_NOTE, DOCTORS, DOCTORS_ARE_DEMO } from '@/content/pages/people';

/**
 * Figma «03 Врачи»: hero, search, two chip rows, portrait grid with a real
 * gutter. Figma fixes: no initials over clinic photos (monogram cards), no
 * half-empty last row (BalancedGrid picks the column count from the number of
 * cards), and the demo dataset is labelled as such.
 */
const DoctorsPage = () => {
  const { t, L } = useI18n();
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [clinicId, setClinicId] = useState('all');

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return doctors.filter((doctor) => {
      if (departmentId !== 'all' && !doctor.departmentIds.includes(departmentId)) return false;
      if (clinicId !== 'all' && !doctor.clinicIds.includes(clinicId)) return false;
      if (!needle) return true;
      const departmentNames = doctor.departmentIds
        .map((id) => departments.find((entry) => entry.id === id))
        .map((entry) => (entry ? L(entry.name) : ''));
      return [L(doctor.name), L(doctor.role), ...departmentNames].join(' ').toLocaleLowerCase().includes(needle);
    });
  }, [query, departmentId, clinicId, L]);

  const filtersActive = Boolean(query.trim()) || departmentId !== 'all' || clinicId !== 'all';
  const reset = () => {
    setQuery('');
    setDepartmentId('all');
    setClinicId('all');
  };

  return (
    <>
      <Seo
        title={t.nav.doctors}
        description={L(DOCTORS.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.doctors, url: ROUTES.doctors },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t.nav.doctors,
            itemListElement: doctors.map((doctor, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: L(doctor.name),
              url: `${site.organization.url}${ROUTES.doctors}/${doctor.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow={t.home.doctorsEyebrow}
        title={t.nav.doctors}
        text={L(DOCTORS.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.doctors }]}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.management} muted>
              {t.nav.management}
            </HeroLink>
          </>
        }
      />

      <Section aria-labelledby="doctors-list">
        <Container>
          <SectionIndex n={1} />
          <h2 id="doctors-list" className="oph-visually-hidden">
            {t.common.allDoctors}
          </h2>

          <Reveal variant="up" className="oph-panel ppl-doctorfilters">
            <div role="search" className="ppl-doctorfilters__inner" aria-label={L(DOCTORS.filtersLabel)}>
              <Input
                label={t.common.search}
                placeholder={L(DOCTORS.searchPlaceholder)}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                icon={<Search size={18} aria-hidden="true" />}
                type="search"
              />
              <div className="ppl-filterrow">
                <span className="ppl-filterrow__label" id="doctors-dept-label">
                  {t.common.department}
                </span>
                <div className="oph-chips ppl-chips-scroll" role="group" aria-labelledby="doctors-dept-label">
                  <button
                    type="button"
                    className="oph-chip"
                    aria-pressed={departmentId === 'all'}
                    onClick={() => setDepartmentId('all')}
                  >
                    {t.common.all}
                  </button>
                  {departments.map((department) => (
                    <button
                      key={department.id}
                      type="button"
                      className="oph-chip"
                      aria-pressed={departmentId === department.id}
                      onClick={() => setDepartmentId(department.id)}
                    >
                      {L(department.name)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ppl-filterrow">
                <span className="ppl-filterrow__label" id="doctors-clinic-label">
                  {t.common.clinic}
                </span>
                <div className="oph-chips ppl-chips-scroll" role="group" aria-labelledby="doctors-clinic-label">
                  <button type="button" className="oph-chip" aria-pressed={clinicId === 'all'} onClick={() => setClinicId('all')}>
                    {t.common.all}
                  </button>
                  {clinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      type="button"
                      className="oph-chip"
                      aria-pressed={clinicId === clinic.id}
                      onClick={() => setClinicId(clinic.id)}
                    >
                      {L(clinic.name)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="ppl-resultbar">
            <p className="ppl-count" role="status" aria-live="polite">
              {L(DOCTORS.countLabel)}: <strong>{filtered.length}</strong>
            </p>
            {filtersActive ? (
              <Button variant="ghost" size="sm" onClick={reset}>
                {t.common.reset}
              </Button>
            ) : null}
          </div>

          {filtered.length > 0 ? (
            <BalancedGrid className="ppl-dgrid">
              {filtered.map((doctor, index) => (
                <DoctorTile key={doctor.id} doctor={doctor} delay={(index % 4) * 70} />
              ))}
            </BalancedGrid>
          ) : (
            <EmptyState
              title={t.common.nothingFound}
              text={t.common.nothingFoundText}
              icon={<UserSearch size={28} />}
              action={
                <Button variant="outline" size="sm" onClick={reset}>
                  {t.common.reset}
                </Button>
              }
            />
          )}

          {DOCTORS_ARE_DEMO ? <p className="ppl-footnote">{L(DEMO_NOTE.doctors)}</p> : null}
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default DoctorsPage;
