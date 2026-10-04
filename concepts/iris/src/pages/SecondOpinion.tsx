import type { CSSProperties } from 'react';
import { C } from '../content';
import { usePage } from '../lib/usePage';
import { Accordion, Arrow, Chapter, Counter, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { RequestForm, contactFields } from '../components/forms';

const S = C.patients_second_opinion.second;
const PT = C.patients;

export default function SecondOpinion() {
  usePage('Второе мнение', 'aqueous');
  return (
    <>
      <Hero station="cornea" layer="Хрусталик — второй взгляд наводит резкость" eyebrow={S.eyebrow} title={S.title} accent={['второе', 'мнение']} lead={S.lead}>
        <a href="#request" className="btn">
          {S.heroUpload} <Arrow />
        </a>
        <a href="#process" className="btn btn--ghost">
          {S.heroProcess}
        </a>
      </Hero>

      <section className="sect so-docs" aria-label="Какие документы подходят">
        <Station id="aqueous" />
        <div className="wrap so-docs__in">
          {S.heroDocs.map((d: string, i: number) => (
            <div key={d} className="so-doc" data-reveal style={{ '--d': i * 140, '--r': `${(i - 1) * 7}deg` } as CSSProperties}>
              <span className="so-doc__lines" aria-hidden="true" />
              <span className="h4">{d}</span>
            </div>
          ))}
          <p className="small so-docs__note" data-reveal>
            {S.heroDocsNote}
          </p>
        </div>
      </section>

      <section className="sect" aria-labelledby="adv-h">
        <Station id="lens" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {S.advEyebrow}
          </p>
          <Scrub className="quote" text={S.advStatement} />
          <div className="split-2 so-adv">
            <p id="adv-h" className="lead" data-reveal>
              {S.advText}
            </p>
            <ul className="stat-stack list-plain">
              {S.stats.map((s: { value: number; unit?: string; label: string }) => (
                <li key={s.label} className="stat" data-reveal>
                  <Counter value={s.value} suffix={s.unit ?? ''} className="stat__n" />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div id="process" />
      <Chapter steps={S.process.length} vh={70} stations={['lens', 'lens', 'vitreous', 'retina']} className="focus" label={S.processTitle}>
        {(active, p) => (
          <div className="wrap focus__in" style={{ '--blur': `${Math.max(0, 1 - p * 1.3) * 10}px` } as CSSProperties}>
            <div>
              <p className="eyebrow">{S.processEyebrow}</p>
              <h2 className="h2">{S.processTitle}</h2>
              <p className="focus__hint small">Резкость растёт с каждым шагом — как при фокусировке хрусталика.</p>
            </div>
            <ol className="focus__list">
              {S.process.map((s: { title: string; text: string }, i: number) => (
                <li key={s.title} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>
                  <span className="focus__n">0{i + 1}</span>
                  <div>
                    <h3 className="h3">{s.title}</h3>
                    <p className="body">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Chapter>

      <section className="sect" aria-labelledby="ft-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={S.featEyebrow} title={S.featTitle} />
          <h2 id="ft-h" className="sr-only">
            {S.featTitle}
          </h2>
          <div className="grid-3">
            {S.features.map((f: { title: string; text: string }, i: number) => (
              <div key={f.title} className="card" data-reveal style={{ '--d': (i % 3) * 90 } as CSSProperties}>
                <span className="tag">0{i + 1}</span>
                <span className="h3">{f.title}</span>
                <span className="body">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="st-h">
        <Station id="retina" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={S.statusEyebrow} title={S.statusTitle} />
            <h2 id="st-h" className="sr-only">
              {S.statusTitle}
            </h2>
            <ol className="steps">
              {S.statuses.map((s: { title: string; text: string; meta: string }) => (
                <li key={s.title} data-reveal>
                  <div>
                    <h3 className="h3">{s.title}</h3>
                    <p className="body">{s.text}</p>
                    <p className="meta">{s.meta}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="status-card panel panel--gold" data-reveal aria-label={S.statusCardTitle}>
            <p className="eyebrow">{S.statusCardTitle}</p>
            <p className="h2">SO-26 · пример</p>
            <ol className="status-card__track">
              {S.statuses.map((s: { title: string }, i: number) => (
                <li key={s.title} className={i < 1 ? 'is-done' : i === 1 ? 'is-now' : ''}>
                  <span>{s.title}</span>
                  {i === 1 && <b>{S.statusNow}</b>}
                </li>
              ))}
            </ol>
            <p className="small">Пример отображения статуса. Реальные заявки видны в личном кабинете.</p>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="at-h">
        <Station id="macula" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={S.attachEyebrow} title={S.attachTitle} />
            <h2 id="at-h" className="sr-only">
              {S.attachTitle}
            </h2>
            <ul className="ring-list">
              {S.attach.map((a: string) => (
                <li key={a} data-reveal>
                  {a}
                </li>
              ))}
            </ul>
            <p className="notice" style={{ marginTop: 24 }} data-reveal>
              {S.attachTip}
            </p>
          </div>
          <div className="stack">
            <div className="card" data-reveal>
              <h3 className="h3">{S.turnaroundTitle}</h3>
              <p className="body">{S.turnaroundText}</p>
            </div>
            <div className="card" data-reveal>
              <h3 className="h3">{S.privacyTitle}</h3>
              <p className="body">{S.privacyText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sect" id="request" aria-labelledby="rq-h">
        <Station id="micro" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">{PT.ptShared.formEyebrow}</p>
            <h2 id="rq-h" className="h2">
              {S.formTitle}
            </h2>
            <p className="body">{S.formLead}</p>
            <p className="small">{PT.ptShared.disclaimer}</p>
          </div>
          <div className="panel">
            <RequestForm
              prefix="SO"
              submit={S.formSubmit}
              successTitle="Заявка на второе мнение принята"
              next={S.statuses.map((s: { title: string; meta: string }) => `${s.title} — ${s.meta}`)}
              fields={[
                ...contactFields({ email: true, emailRequired: true }),
                { name: 'country', label: PT.ptFieldLabels.country, type: 'select', options: PT.ptCountries },
                { name: 'language', label: 'Язык заключения', type: 'select', required: true, options: PT.ptLanguages },
                { name: 'question', label: PT.ptFieldLabels.question, type: 'textarea', required: true, placeholder: PT.ptFieldLabels.questionHint },
                { name: 'files', label: S.filesLabel, type: 'files', hint: 'PDF, JPG или PNG, до 10 файлов по 10 МБ. Можно дослать позже.' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sect sect--tight" aria-labelledby="sfaq-h">
        <div className="wrap split-2">
          <SectionHead eyebrow={PT.ptShared.faqEyebrow} title={PT.ptShared.faqTitle} />
          <div>
            <h2 id="sfaq-h" className="sr-only">
              {PT.ptShared.faqTitle}
            </h2>
            <Accordion items={S.faq.map((f: { q: string; a: string }) => ({ q: f.q, a: <p>{f.a}</p> }))} />
          </div>
        </div>
      </section>
    </>
  );
}
