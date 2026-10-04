import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { BadgeCheck, EyeOff, MessageSquareQuote, ShieldCheck, Star } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { Reveal, StackCards, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { FeatureTile, SectionHead, SectionIndex } from '@/components/editorial';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { byId, doctors, reviews, services } from '@/content';
import { reviewsCopy as C } from '@/content/pages/platform';

const Stars = ({ rating }: { rating: number }) => (
  <span className="oph-stars" role="img" aria-label={`${rating} / 5`}>
    {Array.from({ length: 5 }, (_, index) => (
      <Star key={index} size={15} aria-hidden="true" data-on={index < rating || undefined} />
    ))}
  </span>
);

/**
 * Sticky stacking cards only where they are smooth: a wide screen driven by a
 * mouse / trackpad. On touch (and narrow windows) the per-frame scale of a
 * pinned card fights the native momentum scroll and the stack visibly shakes,
 * so those devices get a plain, stable list instead.
 */
const STACK_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const subscribeStack = (notify: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;
  const media = window.matchMedia(STACK_QUERY);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

const readStack = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(STACK_QUERY).matches;

const useStackEffect = () => useSyncExternalStore(subscribeStack, readStack, () => false);

/** Stacking cards on desktop fine pointers, a static list everywhere else. */
const ReviewList = ({ stacked, listKey, children }: { stacked: boolean; listKey: string; children: ReactNode[] }) =>
  stacked ? (
    <StackCards className="oph-reviews__stack" key={`stack-${listKey}`}>
      {children}
    </StackCards>
  ) : (
    <ul className="oph-reviews__list" key={`list-${listKey}`}>
      {children.map((child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  );

/**
 * Reviews (Figma language): forest hero, a statement that lights up word by
 * word, then the reviews as sticky stacking cards on desktop (each story
 * settles over the previous one while scrolling) and a stable list on touch.
 *
 * Trust rules (compliance A-4, SEO-9, DESIGN.md §7): no aggregate score,
 * review count or "recommend" percentage is claimed, and no Review /
 * AggregateRating markup is emitted — only the breadcrumb. A discreet note
 * states that reviews are verified by the clinic before publication.
 */
const ReviewsPage = () => {
  const { t, L, formatDate } = useI18n();
  const [rating, setRating] = useState<'all' | '5' | '4'>('all');
  const stacked = useStackEffect();

  const filtered = useMemo(
    () =>
      reviews
        .filter((review) => rating === 'all' || review.rating === Number(rating))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [rating],
  );

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.title), url: ROUTES.reviews },
      ]),
    ],
    [t.common.breadcrumbHome, L],
  );

  return (
    <>
      <Seo title={L(C.title)} description={L(C.lead)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={L(C.title)}
        text={L(C.lead)}
        crumbs={[{ label: L(C.title) }]}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>{t.common.bookNow} →</HeroLink>
            <HeroLink to={ROUTES.doctors} muted>
              {t.common.allDoctors}
            </HeroLink>
          </>
        }
      />

      <Section tone="deep" className="oph-on-dark" aria-label={L(C.statement)}>
        <Container size="narrow">
          <SectionIndex n={1} onDark />
          <TextFill text={L(C.statement)} className="oph-reviews__statement" />
        </Container>
      </Section>

      <Section aria-labelledby="reviews-list">
        <Container size="narrow">
          <SectionIndex n={2} label={L(C.listTitle)} />
          <SectionHead
            id="reviews-list"
            title={L(C.listTitle)}
            size="sm"
            aside={
              <div className="oph-chips oph-reviews__filter" role="group" aria-label={L(C.filter)}>
                {(['all', '5', '4'] as const).map((value) => (
                  <button key={value} type="button" className="oph-chip" aria-pressed={rating === value} onClick={() => setRating(value)}>
                    {value === 'all' ? t.common.all : `${value} ★`}
                  </button>
                ))}
              </div>
            }
          />

          <p className="oph-reviews__note">
            <BadgeCheck size={16} aria-hidden="true" />
            <span>{L(C.verifiedNote)}</span>
          </p>

          {filtered.length > 0 ? (
            <ReviewList stacked={stacked} listKey={rating}>
              {filtered.map((review) => {
                const doctor = byId(doctors, review.doctorId);
                const service = byId(services, review.serviceId);
                return (
                  <article className="oph-review" key={review.id}>
                    <header className="oph-review__head">
                      <Stars rating={review.rating} />
                      <time dateTime={review.date}>{formatDate(review.date)}</time>
                    </header>
                    <blockquote className="oph-review__quote">
                      <p>{L(review.text)}</p>
                    </blockquote>
                    <footer className="oph-review__foot">
                      <strong>{L(review.author)}</strong>
                      <span>
                        {service ? `${L(C.service)}: ${L(service.name)}` : null}
                        {service && doctor ? ' · ' : null}
                        {doctor ? `${L(C.doctor)}: ${L(doctor.name)}` : null}
                      </span>
                    </footer>
                  </article>
                );
              })}
            </ReviewList>
          ) : (
            <EmptyState
              title={L(C.emptyTitle)}
              text={L(C.emptyText)}
              icon={<Star size={30} />}
            />
          )}
        </Container>
      </Section>

      <Section tone="tint" aria-labelledby="reviews-policy">
        <Container>
          <SectionIndex n={3} />
          <SectionHead id="reviews-policy" title={L(C.policyTitle)} size="sm" />
          <Stagger className="oph-ftiles" step={90}>
            <Reveal variant="up">
              <FeatureTile icon={<BadgeCheck size={20} />} title={L(C.policy4Title)} text={L(C.policy4)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<ShieldCheck size={20} />} title={L(C.policy1Title)} text={L(C.policy1)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<MessageSquareQuote size={20} />} title={L(C.policy2Title)} text={L(C.policy2)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<EyeOff size={20} />} title={L(C.policy3Title)} text={L(C.policy3)} />
            </Reveal>
          </Stagger>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default ReviewsPage;
