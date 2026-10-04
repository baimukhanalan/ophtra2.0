import { useEffect, useMemo, useState } from 'react';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { faq, site } from '../lib/data';
import { bridge } from '../world/bridge';

const TOPICS: Record<string, string> = {
  booking: 'Запись',
  diagnostics: 'Диагностика',
  laser: 'Лазерная коррекция',
  cataract: 'Катаракта',
  pediatric: 'Дети',
  payments: 'Оплата',
  general: 'Общее',
};

export default function Faq() {
  const [topic, setTopic] = useState('all');
  const [q, setQ] = useState('');
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return faq.filter((f) => (topic === 'all' || f.topic === topic) && (!s || `${f.question} ${f.answer}`.toLowerCase().includes(s)));
  }, [topic, q]);
  // every answered question lights more windows in the building
  useEffect(() => {
    bridge.setOverride({ fx: { windows: Math.min(1, 0.4 + opened.size * 0.12) } });
  }, [opened]);
  useEffect(() => () => bridge.setOverride(null), []);
  return (
    <Page title="Вопросы и ответы">
      <Chapter shot="faq" size="md" label="Ресепшн">
        <div className="col col--wide">
          <Eyebrow>Ресепшн · вопросы и ответы</Eyebrow>
          <SplitTitle as="h1" className="display" text="Спросите — *в окнах станет светлее*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Ответы на частые вопросы о записи, обследовании, операциях и оплате. Каждый открытый ответ зажигает ещё одно окно в здании.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="faq-2" pin={false} size="auto" label="Ответы">
        <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 920, margin: '0 auto' }}>
          <div className="panel" style={{ display: 'grid', gap: 16 }}>
            <div className="field">
              <label htmlFor="faq-q">Поиск по вопросам</label>
              <input id="faq-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Например, «линзы»" />
            </div>
            <div className="chips" role="group" aria-label="Тема">
              <button type="button" className="chip-btn" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
                Все темы
              </button>
              {Object.entries(TOPICS).map(([k, l]) => (
                <button key={k} type="button" className="chip-btn" aria-pressed={topic === k} onClick={() => setTopic(k)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <p className="coord" aria-live="polite">
            Вопросов: {list.length} · открыто: {opened.size}
          </p>
          {list.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center' }}>
              <h2 className="h3">Такого вопроса пока нет</h2>
              <p className="body">Напишите нам — ответим и добавим вопрос сюда.</p>
              <a className="btn btn--ghost" href={site.channels.find((c) => c.id === 'whatsapp')?.href} target="_blank" rel="noreferrer">
                Спросить в WhatsApp
              </a>
            </div>
          ) : (
            <div className="acc">
              {list.map((f) => (
                <details
                  key={f.id}
                  onToggle={(e) => {
                    const open = (e.currentTarget as HTMLDetailsElement).open;
                    setOpened((s) => {
                      const n = new Set(s);
                      if (open) n.add(f.id);
                      return n;
                    });
                  }}
                >
                  <summary>
                    <span>
                      <span className="coord" style={{ display: 'block', marginBottom: 4 }}>
                        {TOPICS[f.topic] ?? f.topic}
                      </span>
                      {f.question}
                    </span>
                  </summary>
                  <div className="acc__body">{f.answer}</div>
                </details>
              ))}
            </div>
          )}
          <div className="actions" style={{ marginTop: 40 }}>
            <BtnLink to="/booking">Записаться</BtnLink>
            <BtnLink to="/contacts" ghost>
              Контакты
            </BtnLink>
          </div>
        </div>
      </Chapter>
    </Page>
  );
}
