import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, GraduationCap, Languages, MapPin, MessageSquareQuote } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema, physicianSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionHead, SectionIndex } from '@/components/editorial';
import { ReviewCard } from '@/components/cards';
import { BalancedGrid, DemoTag, DoctorTile, languageNames, yearsWord } from '@/components/people';
import { DoctorPortrait } from '@/services/images';
import { ROUTES } from '@/app/navigation';
import NotFoundPage from './NotFoundPage';
import { byId, bySlug, clinics, departments, doctors, reviewsForDoctor, services } from '@/content';
import { publishedArticles } from '@/content/articles';
import { DEMO_NOTE, DOCTOR, DOCTORS_ARE_DEMO } from '@/content/pages/people';

/** Department ids match the dedicated service routes (diagnostics, laser…). */
const departmentPath = (id: string): string =>
  (ROUTES as Record<string, string>)[id] ?? ROUTES.departments;

/**
 * Figma «04 Профиль врача».
 * Figma fixes: the long name was clipped at the baseline inside a narrow title
 * column (PageHero sizes the title by length); the portrait was initials over
 * a clinic photo (DoctorPortrait now draws a monogram card). Sections with
 * one or two cards use a split layout (heading left, cards right) instead of
 * a four-column row with empty cells (audit D3).
 */
const DoctorDetailPage = () => {
  const { slug = '' } = useParams();
  const { t, L, language, formatPrice, formatDate } = useI18n();
  const doctor = bySlug(doctors, slug);

  if (!doctor) return <NotFoundPage />;

  const doctorDepartments = doctor.departmentIds
    .map((id) => byId(departments, id))
    .filter((department): department is NonNullable<typeof department> => Boolean(department));
  const doctorClinics = doctor.clinicIds
    .map((id) => byId(clinics, id))
    .filter((clinic): clinic is NonNullable<typeof clinic> => Boolean(clinic));
  const doctorServices = services.filter((service) => doctor.departmentIds.includes(service.departmentId));
  const doctorReviews = reviewsForDoctor(doctor.id);
  const doctorArticles = publishedArticles().filter((article) => article.authorId === doctor.id);
  const colleagues = doctors
    .filter((entry) => entry.id !== doctor.id && entry.departmentIds.some((id) => doctor.departmentIds.includes(id)))
    .slice(0, 3);

  const bookUrl = `${ROUTES.appointment}?doctor=${doctor.slug}`;
  let n = 0;
  const next = () => (n += 1);
  // Sections after «services» (tint) alternate default / tint. With no reviews
  // there is no reviews band, so the tones shift instead of two tints meeting.
  let toneIndex = 0;
  const nextTone = (): 'default' | 'tint' => (toneIndex++ % 2 ? 'tint' : 'default');

  return (
    <>
      <Seo
        title={`${L(doctor.name)} — ${L(doctor.role)}`}
        descriptionSource={L(doctor.bio)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.doctors, url: ROUTES.doctors },
            { name: L(doctor.name), url: `${ROUTES.doctors}/${doctor.slug}` },
          ]),
          // Demo profiles are not real physicians — no Physician markup for them.
          ...(DOCTORS_ARE_DEMO
            ? []
            : [
                physicianSchema({
                  name: L(doctor.name),
                  role: L(doctor.role),
                  slug: doctor.slug,
                  departments: doctorDepartments.map((department) => L(department.name)),
                }),
              ]),
        ]}
      />

      <PageHero
        eyebrow={L(doctor.role)}
        title={L(doctor.name)}
        text={L(doctor.bio)}
        crumbs={[{ label: t.nav.doctors, to: ROUTES.doctors }, { label: L(doctor.name) }]}
        actions={
          doctor.acceptsOnline ? (
            <>
              <HeroLink to={bookUrl}>
                {t.common.bookNow}
                <ArrowRight size={16} aria-hidden="true" />
              </HeroLink>
              <HeroLink to={ROUTES.doctors} muted>
                {t.common.allDoctors}
              </HeroLink>
            </>
          ) : (
            <HeroLink to={ROUTES.contacts}>
              {L(DOCTOR.onlineOnly)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
          )
        }
        meta={DOCTORS_ARE_DEMO ? <DemoTag className="ppl-demotag--dark" /> : undefined}
        aside={
          <figure className="ppl-portraitcard">
            <div className="ppl-portraitcard__media" aria-hidden="true">
              <DoctorPortrait photo={doctor.photo} seed={doctor.id} label={L(doctor.name)} />
            </div>
            <figcaption className="ppl-portraitcard__caption">
              <span className="oph-tag">
                {t.common.experience} {doctor.experience} {yearsWord(doctor.experience, language)}
              </span>
              <span>{L(doctor.category)}</span>
            </figcaption>
          </figure>
        }
      />

      {/* ------------------------------------------------ PROFILE CARDS */}
      <Section aria-labelledby="doctor-profile">
        <Container>
          <SectionIndex n={next()} />
          <SectionHead id="doctor-profile" eyebrow={L(DOCTOR.profileEyebrow)} title={L(DOCTOR.profileTitle)} size="sm" />
          <Stagger className="ppl-infocards" step={110}>
            <Reveal variant="up" className="ppl-infocard">
              <span className="ppl-infocard__icon" aria-hidden="true">
                <GraduationCap size={20} />
              </span>
              <h3 className="ppl-infocard__label">{t.common.experience}</h3>
              <p className="ppl-infocard__value">
                {doctor.experience} {yearsWord(doctor.experience, language)}
              </p>
              <p className="ppl-infocard__text">{L(doctor.category)}</p>
              <p className="ppl-infocard__text">
                <strong>{L(DOCTOR.education)}:</strong> {L(doctor.education)}
              </p>
            </Reveal>

            <Reveal variant="up" className="ppl-infocard">
              <span className="ppl-infocard__icon" aria-hidden="true">
                <Languages size={20} />
              </span>
              <h3 className="ppl-infocard__label">{L(DOCTOR.languages)}</h3>
              <p className="ppl-infocard__value ppl-infocard__value--sm">{languageNames(doctor.languages)}</p>
            </Reveal>

            <Reveal variant="up" className="ppl-infocard">
              <span className="ppl-infocard__icon" aria-hidden="true">
                <MapPin size={20} />
              </span>
              <h3 className="ppl-infocard__label">{L(DOCTOR.clinics)}</h3>
              <ul className="ppl-infocard__list">
                {doctorClinics.map((clinic) => (
                  <li key={clinic.id}>
                    <strong>{L(clinic.name)}</strong>
                    <span>{L(clinic.address)}</span>
                  </li>
                ))}
              </ul>
              <div className="ppl-infocard__tags">
                {doctorDepartments.map((department) => (
                  <Link key={department.id} className="oph-tag ppl-taglink" to={departmentPath(department.id)}>
                    {L(department.name)}
                  </Link>
                ))}
              </div>
            </Reveal>
          </Stagger>
          {DOCTORS_ARE_DEMO ? (
            <Reveal variant="fade">
              <p className="ppl-footnote">{L(DEMO_NOTE.profile)}</p>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* ----------------------------------------------------- SERVICES */}
      <Section tone="tint" aria-labelledby="doctor-services">
        <Container>
          <SectionIndex n={next()} />
          <SectionHead id="doctor-services" eyebrow={L(DOCTOR.servicesEyebrow)} title={t.common.allServices} />
          {doctorServices.length ? (
            <BalancedGrid className="ppl-services" max={3}>
              {doctorServices.map((service, index) => (
                <Reveal key={service.id} variant="up" delay={(index % 3) * 70} className="ppl-svc">
                  <h3 className="ppl-svc__title">{L(service.name)}</h3>
                  <p className="ppl-svc__text">{L(service.short)}</p>
                  <div className="ppl-svc__foot">
                    <span className="ppl-svc__price">
                      {t.common.from} {formatPrice(service.price)}
                    </span>
                    <span className="ppl-svc__duration">
                      <Clock size={14} aria-hidden="true" />
                      {service.duration} {t.common.minutes}
                    </span>
                  </div>
                  <Link
                    className="ppl-svc__link"
                    to={`${ROUTES.appointment}?service=${service.slug}&doctor=${doctor.slug}`}
                    aria-label={`${t.common.book}: ${L(service.name)}`}
                  >
                    {t.common.book}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </Reveal>
              ))}
            </BalancedGrid>
          ) : (
            <Reveal variant="up">
              <p className="ppl-footnote">{L(DOCTOR.noServices)}</p>
            </Reveal>
          )}
          {/* No reviews yet: a one-line notice here, not a full numbered
              section around a single dashed line. */}
          {doctorReviews.length ? null : (
            <Reveal variant="up" className="ppl-emptyline ppl-emptyline--after">
              <MessageSquareQuote size={20} aria-hidden="true" />
              <span>{L(DOCTOR.noReviews)}</span>
              <Link className="oph-link" to={ROUTES.reviews}>
                {t.nav.reviews}
              </Link>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* ------------------------------------------------------ REVIEWS */}
      {doctorReviews.length ? (
        <Section tone={nextTone()} aria-labelledby="doctor-reviews">
          <Container>
            <SectionIndex n={next()} />
            <div className="ppl-split">
              <div className="ppl-split__head">
                <SectionHead id="doctor-reviews" eyebrow={L(DOCTOR.reviewsEyebrow)} title={L(DOCTOR.reviewsTitle)} size="sm" />
                {DOCTORS_ARE_DEMO ? <p className="ppl-footnote ppl-footnote--tight">{L(DEMO_NOTE.reviews)}</p> : null}
              </div>
              <div className="ppl-reviews" data-count={Math.min(doctorReviews.length, 2)}>
                {doctorReviews.map((review) => {
                  const service = byId(services, review.serviceId);
                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      doctorName={L(doctor.name)}
                      serviceName={service ? L(service.name) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ----------------------------------------------------- ARTICLES */}
      {doctorArticles.length ? (
        <Section tone={nextTone()} aria-labelledby="doctor-articles">
          <Container>
            <SectionIndex n={next()} />
            <div className={doctorArticles.length < 3 ? 'ppl-split' : undefined}>
            <div className="ppl-split__head">
              <SectionHead id="doctor-articles" eyebrow={L(DOCTOR.articlesEyebrow)} title={L(DOCTOR.articlesTitle)} size="sm" />
              <Reveal variant="up" delay={160}>
                <Link className="oph-link ppl-textlink" to={`${ROUTES.authors}/${doctor.slug}`}>
                  {L(DOCTOR.authorPage)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
            <Stagger as="ul" className="ppl-articles" step={90} style={{ ['--cols' as string]: Math.min(doctorArticles.length, 3) }}>
              {doctorArticles.map((article) => (
                <Reveal as="li" key={article.id} variant="up">
                  <Link className="ppl-article" to={`${ROUTES.knowledge}/${article.slug}`}>
                    <span className="oph-eyebrow">{L(article.category)}</span>
                    <span className="ppl-article__title">{L(article.title)}</span>
                    <span className="ppl-article__text">{L(article.excerpt)}</span>
                    <span className="ppl-article__meta">
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                      <span>
                        {article.readingMinutes} {L(DOCTOR.readMin)}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </Stagger>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* --------------------------------------------------- COLLEAGUES */}
      {colleagues.length ? (
        <Section tone={nextTone()} aria-labelledby="doctor-colleagues">
          <Container>
            <SectionIndex n={next()} />
            <SectionHead id="doctor-colleagues" eyebrow={t.home.doctorsEyebrow} title={L(DOCTOR.otherDoctors)} size="sm" />
            <BalancedGrid className="ppl-dgrid">
              {colleagues.map((entry, index) => (
                <DoctorTile key={entry.id} doctor={entry} delay={index * 80} />
              ))}
            </BalancedGrid>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
};

export default DoctorDetailPage;
