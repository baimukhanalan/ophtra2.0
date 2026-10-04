import { useDeferredValue, useMemo, useState } from 'react';
import faqJson from '../content/data/faq.json';
import platformJson from '../content/platform.json';
import { site } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { Accordion, Arrow, ElementTag, Hero, LensCta, usePageTitle } from '../ui/parts';
import './pages.css';
import './misc.css';

const FC = (platformJson as unknown as { faqCopy: Record<string, string> }).faqCopy;
const FAQ = faqJson as unknown as Array<{ id: string; topic: string; question: string; answer: string }>;
/* Topic labels follow the production navigation vocabulary. */
const TOPICS: Record<string, string> = {
  booking: 'Запись',
  diagnostics: 'Диагностика',
  laser: 'Лазерная коррекция',
  cataract: 'Катаракта',
  pediatric: 'Детям',
  payments: 'Оплата',
  general: 'Общие',
};

export default function Faq() {
  useScenePreset(PRESETS.faq);
  usePageTitle(FC.title);
  const [topic, setTopic] = useState('all');
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q.trim().toLowerCase());
  const topics = useMemo(() => [...new Set(FAQ.map((f) => f.topic))], []);
  const list = FAQ.filter((f) => (topic === 'all' || f.topic === topic) && (!dq || (f.question + ' ' + f.answer).toLowerCase().includes(dq)));

  return (
    <div className="faq">
      <Hero eyebrow={FC.eyebrow} title={FC.title} size="xl" accent={[1]} lead={FC.lead} tag="Две диафрагмы · Элемент 01 / 03" />

      <section className="stage faq-main" data-stage data-el={1} aria-label={FC.title}>
        <div className="wrap faq-grid">
          <aside className="faq-side">
            <ElementTag n={2} of={3} label="диафрагма" />
            <div className="field search mt-m" role="search">
              <label htmlFor="faq-q" className="field__label">
                {FC.searchLabel}
              </label>
              <input id="faq-q" className="field__input" type="search" placeholder={FC.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="filters mt-m" role="group" aria-label={FC.topics}>
              <button type="button" className="filter" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
                Все
              </button>
              {topics.map((t) => (
                <button key={t} type="button" className="filter" aria-pressed={topic === t} onClick={() => setTopic(t)}>
                  {TOPICS[t] ?? t}
                </button>
              ))}
            </div>
            <p className="anno mt-m" aria-live="polite">
              {FC.found}: {list.length}
            </p>
          </aside>
          <div className="glass faq-panel">
            {list.length ? (
              <Accordion key={topic + dq} items={list.map((f) => ({ q: f.question, a: f.answer }))} />
            ) : (
              <div className="empty">
                <p className="h3">Ничего не нашли</p>
                <p className="body">Попробуйте другое слово или спросите координатора.</p>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setQ('');
                    setTopic('all');
                  }}
                >
                  Сбросить
                </button>
              </div>
            )}
            <p className="small muted mt-m">{FC.disclaimer}</p>
          </div>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="ask-h">
        <div className="wrap faq-ask">
          <div>
            <h2 id="ask-h" className="h2" style={{ color: 'var(--cream)' }}>
              {FC.askTitle}
            </h2>
            <p className="mt-s" style={{ color: 'rgba(244,242,237,.78)', maxWidth: '52ch' }}>
              {FC.askText}
            </p>
          </div>
          <div className="row">
            <a className="btn btn--gold" href={`https://wa.me/${site.organization.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="btn btn--ghost ftr__ghost" href={`tel:${site.organization.phoneHref}`}>
              {site.organization.phone}
            </a>
            <TLink to={R.contacts} className="btn btn--light">
              {FC.contacts} <Arrow />
            </TLink>
          </div>
        </div>
      </section>

      <LensCta el={2} title="Запишитесь на консультацию офтальмолога" text="Подберём время, врача и формат приёма. Подтверждение придёт в WhatsApp." />
    </div>
  );
}
