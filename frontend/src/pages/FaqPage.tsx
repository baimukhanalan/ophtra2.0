import { useMemo, useState } from 'react';
import { MessageCircle, Phone, Search } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Accordion, Container, EmptyState, Input, Section } from '@/ui';
import { Reveal, ScrollFx, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { SectionHead, SectionIndex } from '@/components/editorial';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { faq } from '@/content/faq';
import { site } from '@/content';
import { faqCopy as C } from '@/content/pages/platform';
import { track } from '@/services/analytics';

const TOPIC_LABELS: Record<string, { ru: string; kk: string; en: string }> = {
  booking: { ru: 'Запись', kk: 'Жазылу', en: 'Booking' },
  diagnostics: { ru: 'Диагностика', kk: 'Диагностика', en: 'Diagnostics' },
  laser: { ru: 'Лазерная коррекция', kk: 'Лазерлік түзету', en: 'Laser correction' },
  cataract: { ru: 'Катаракта', kk: 'Катаракта', en: 'Cataract' },
  pediatric: { ru: 'Дети', kk: 'Балалар', en: 'Children' },
  payments: { ru: 'Оплата', kk: 'Төлем', en: 'Payments' },
  general: { ru: 'Общие', kk: 'Жалпы', en: 'General' },
};

/** Page-specific hero visual (L1): a serif question mark inside the ring. */
const FaqMotif = () => (
  <div className="oph-heromark" aria-hidden="true">
    <svg viewBox="0 0 200 200" className="oph-heromark__svg">
      <circle cx="100" cy="100" r="92" className="oph-heromark__ring" />
      <circle cx="100" cy="100" r="70" className="oph-heromark__ring oph-heromark__ring--soft" />
    </svg>
    <span className="oph-heromark__glyph">?</span>
  </div>
);

/**
 * FAQ (Figma language): forest hero, numbered sections, search panel with
 * topic chips, accordion list, «Не нашли ответ?» sand box, booking band.
 * The full question set is published as FAQPage JSON-LD regardless of the
 * active filter, so search engines and AI answer engines see every answer.
 */
const FaqPage = () => {
  const { t, L, language } = useI18n();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');

  const topics = useMemo(() => [...new Set(faq.map((item) => item.topic))], []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return faq.filter((item) => {
      if (topic !== 'all' && item.topic !== topic) return false;
      if (!needle) return true;
      return (
        L(item.question).toLocaleLowerCase().includes(needle) ||
        L(item.answer).toLocaleLowerCase().includes(needle)
      );
    });
  }, [query, topic, L]);

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.title), url: ROUTES.faq },
      ]),
      faqSchema(faq.map((item) => ({ question: L(item.question), answer: L(item.answer) }))),
    ],
    [t.common.breadcrumbHome, L],
  );

  const topicLabel = (id: string) => TOPIC_LABELS[id]?.[language] ?? id;

  return (
    <>
      <Seo title={L(C.title)} description={L(C.lead)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={L(C.title)}
        text={L(C.lead)}
        crumbs={[{ label: L(C.title) }]}
        aside={<FaqMotif />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>{t.common.bookNow} →</HeroLink>
            <HeroLink to={ROUTES.contacts} muted>
              {L(C.contacts)}
            </HeroLink>
          </>
        }
      />

      <Section aria-labelledby="faq-list" className="oph-faq">
        <Container size="narrow">
          <SectionIndex n={1} label={L(C.topics)} />
          <SectionHead id="faq-list" title={L(C.title)} size="sm" />

          <Reveal variant="up">
            <div className="oph-panel oph-faq__filters" role="search">
              <Input
                label={L(C.searchLabel)}
                type="search"
                placeholder={L(C.searchPlaceholder)}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                icon={<Search size={18} aria-hidden="true" />}
              />
              <div className="oph-chips" role="group" aria-label={L(C.topics)}>
                {['all', ...topics].map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="oph-chip"
                    aria-pressed={topic === id}
                    onClick={() => setTopic(id)}
                  >
                    {id === 'all' ? t.common.all : topicLabel(id)}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <p className="oph-faq__count" aria-live="polite">
            {L(C.found)}: <strong>{filtered.length}</strong>
          </p>

          {filtered.length > 0 ? (
            <Reveal variant="up">
              <Accordion
                multiple
                items={filtered.map((item) => ({
                  id: item.id,
                  question: L(item.question),
                  answer: L(item.answer),
                }))}
              />
            </Reveal>
          ) : (
            <EmptyState title={t.common.nothingFound} text={t.common.nothingFoundText} />
          )}

          <p className="oph-faq__disclaimer">{L(C.disclaimer)}</p>
        </Container>
      </Section>

      <Section tone="tint" aria-labelledby="faq-ask">
        <Container size="narrow">
          <SectionIndex n={2} label={L(C.askTitle)} />
          <ScrollFx className="oph-faq__ask">
            <h2 id="faq-ask" className="oph-display oph-display--sm">
              {L(C.askTitle)}
            </h2>
            <TextFill text={L(C.askText)} className="oph-faq__asktext" />
            <div className="oph-faq__channels">
              <a
                className="oph-btn oph-btn--primary"
                href={`https://wa.me/${site.organization.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { from: 'faq' })}
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
              <a className="oph-btn oph-btn--outline" href={`tel:${site.organization.phoneHref}`} onClick={() => track('call_click', { from: 'faq' })}>
                <Phone size={16} aria-hidden="true" />
                {site.organization.phone}
              </a>
            </div>
          </ScrollFx>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default FaqPage;
