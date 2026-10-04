import { useMemo, useState } from 'react';
import { C, faq } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { Accordion, Arrow, Hero, Station } from '../components/ui';
import { SearchIcon } from './Doctors';

const F = C.platform.faqCopy;
const TOPIC: Record<string, string> = {
  booking: 'Запись',
  diagnostics: 'Диагностика',
  laser: 'Лазерная коррекция',
  cataract: 'Катаракта',
  pediatric: 'Дети',
  payments: 'Оплата',
  general: 'Общее',
};

export default function Faq() {
  usePage('Вопросы и ответы', 'aqueous');
  const [topic, setTopic] = useState('all');
  const [q, setQ] = useState('');
  const topics = Array.from(new Set(faq.map((f) => f.topic)));
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return faq.filter((f) => (topic === 'all' || f.topic === topic) && (!s || `${f.question} ${f.answer}`.toLowerCase().includes(s)));
  }, [topic, q]);

  return (
    <>
      <Hero station="cornea" layer="Водянистая влага — ясность" eyebrow={F.eyebrow} title={F.title} accent={['вопросы']} lead={F.lead} />
      <section className="sect faq" aria-labelledby="faq-h">
        <Station id="aqueous" />
        <div className="wrap faq__in">
          <aside className="faq__side">
            <h2 id="faq-h" className="sr-only">
              Список вопросов
            </h2>
            <label className="search">
              <span className="sr-only">{F.searchLabel}</span>
              <SearchIcon />
              <input type="search" value={q} placeholder={F.searchPlaceholder} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="faq__topics" role="group" aria-label={F.topics}>
              <button type="button" className="chip" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
                Все темы
              </button>
              {topics.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>
                  {TOPIC[t] ?? t}
                </button>
              ))}
            </div>
            <p className="small" aria-live="polite">
              {F.found}: {list.length}
            </p>
          </aside>
          <div>
            {list.length ? (
              <Accordion key={topic + q} items={list.map((f) => ({ q: f.question, a: <p>{f.answer}</p> }))} />
            ) : (
              <div className="empty">
                <p className="h3">Такого вопроса пока нет</p>
                <p>Попробуйте другое слово или спросите координатора.</p>
              </div>
            )}
            <p className="small faq__disc">{F.disclaimer}</p>
          </div>
        </div>
      </section>
      <section className="sect" aria-labelledby="ask-h">
        <Station id="lens" />
        <div className="wrap finale__in">
          <h2 id="ask-h" className="display d-l" data-reveal>
            {F.askTitle}
          </h2>
          <p className="lead" data-reveal>
            {String(F.askText).split(". ")[0]}.
          </p>
          <div className="btn-row" data-reveal>
            <IrisLink to="/contacts" className="btn">
              {F.contacts} <Arrow />
            </IrisLink>
            <IrisLink to="/knowledge-base" className="btn btn--ghost">
              База знаний
            </IrisLink>
          </div>
        </div>
      </section>
    </>
  );
}
