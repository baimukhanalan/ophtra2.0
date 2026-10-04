import type { CSSProperties } from 'react';
import { C, byId, fmtPrice, services } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { Accordion, Arrow, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { RequestForm, contactFields } from '../components/forms';

const K = C.patients_consultation.consult;
const PT = C.patients;

export default function Consultation() {
  usePage('Онлайн-консультация', 'iris');
  const price = byId(services, 'svc-consult')?.price ?? 0;
  return (
    <>
      <Hero station="iris" layer="Зрачок — окно, через которое видно" eyebrow={K.eyebrow} title={K.title} accent={['онлайн']} lead={K.lead}>
        <a href="#book" className="btn">
          {K.heroBook} <Arrow />
        </a>
        <a href="#steps" className="btn btn--ghost">
          {K.heroSteps}
        </a>
      </Hero>

      <section className="sect call" aria-label="Как выглядит видеоконсультация">
        <Station id="approach" />
        <div className="wrap">
          <div className="call__win" data-reveal>
            <div className="call__main">
              <span className="call__who">{K.heroCall.doctor}</span>
              <span className="call__pupil" aria-hidden="true" />
              <span className="call__share">{K.heroCall.shared}</span>
            </div>
            <div className="call__self">
              <span className="call__who">{K.heroCall.you}</span>
            </div>
            <div className="call__bar" aria-hidden="true">
              <i />
              <i />
              <i className="is-end" />
            </div>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="mand-h">
        <Station id="cornea" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {K.statementLabel}
          </p>
          <Scrub className="quote" text={K.statement} />
          <div className="panel panel--gold mand" data-reveal>
            <h2 id="mand-h" className="h3">
              {K.mandatoryTitle}
            </h2>
            <p className="body">{K.mandatoryText}</p>
            <IrisLink to="/international-patients" className="link">
              {K.mandatoryLink} <Arrow />
            </IrisLink>
          </div>
        </div>
      </section>

      <section className="sect" id="steps" aria-labelledby="cs-h">
        <Station id="aqueous" />
        <div className="wrap split-2">
          <div className="sticky-col">
            <SectionHead eyebrow={K.stepsEyebrow} title={K.stepsTitle} />
            <h2 id="cs-h" className="sr-only">
              {K.stepsTitle}
            </h2>
          </div>
          <ol className="steps">
            {K.steps.map((s: { title: string; text: string }, i: number) => (
              <li key={s.title} data-reveal style={{ '--d': i * 60 } as CSSProperties}>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect" aria-labelledby="pf-h">
        <Station id="lens" />
        <div className="wrap">
          <SectionHead eyebrow={K.platformsEyebrow} title={K.platformsTitle} text={K.platformsLead} />
          <h2 id="pf-h" className="sr-only">
            {K.platformsTitle}
          </h2>
          <div className="grid-3">
            {K.platforms.map((p: { id: string; name: string; text: string }, i: number) => (
              <div key={p.id} className="card platform" data-reveal style={{ '--d': i * 100 } as CSSProperties}>
                <span className="platform__name">{p.name}</span>
                <span className="body">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="nd-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={K.needsEyebrow} title={K.needsTitle} />
          <h2 id="nd-h" className="sr-only">
            {K.needsTitle}
          </h2>
          <div className="grid-4">
            {K.needs.map((n: { title: string; text: string }, i: number) => (
              <div key={n.title} className="card" data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="tag">0{i + 1}</span>
                <span className="h3">{n.title}</span>
                <span className="body">{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="pr-h">
        <Station id="retina" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={K.priceEyebrow} title={K.priceTitle} text={K.priceText} />
            <h2 id="pr-h" className="sr-only">
              {K.priceTitle}
            </h2>
          </div>
          <div className="panel panel--gold price-card" data-reveal>
            <p className="eyebrow">{K.priceFrom}</p>
            <p className="price-card__n num">{fmtPrice(price)}</p>
            <p className="small">Консультация офтальмолога · по прейскуранту центра</p>
            <ul className="ring-list">
              {K.priceIncludes.map((x: string) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sect" id="book" aria-labelledby="bk-h">
        <Station id="macula" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">{PT.ptShared.formEyebrow}</p>
            <h2 id="bk-h" className="h2">
              {K.formTitle}
            </h2>
            <p className="body">{K.formLead}</p>
            <h3 className="h4" style={{ marginTop: 28 }}>
              {K.nextTitle}
            </h3>
            <ol className="form-done__next">
              {K.next.map((n: string) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </div>
          <div className="panel">
            <RequestForm
              prefix="OC"
              submit={K.formSubmit}
              next={K.next}
              fields={[
                ...contactFields({ email: true }),
                {
                  name: 'platform',
                  label: PT.ptFieldLabels.platform,
                  type: 'select',
                  required: true,
                  options: K.platforms.map((p: { id: string; name: string }) => ({ value: p.id, label: p.name })),
                },
                { name: 'date', label: PT.ptFieldLabels.date, type: 'date', required: true },
                { name: 'timezone', label: PT.ptFieldLabels.timezone, placeholder: `${K.tzExample}: Ташкент, UTC+5` },
                { name: 'language', label: PT.ptFieldLabels.language, type: 'select', options: PT.ptLanguages },
                { name: 'question', label: PT.ptFieldLabels.question, type: 'textarea' },
                { name: 'files', label: K.filesLabel, type: 'files' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sect sect--tight" aria-labelledby="cfaq-h">
        <div className="wrap split-2">
          <SectionHead eyebrow={PT.ptShared.faqEyebrow} title={PT.ptShared.faqTitle} />
          <div>
            <h2 id="cfaq-h" className="sr-only">
              {PT.ptShared.faqTitle}
            </h2>
            <Accordion items={K.faq.map((f: { q: string; a: string }) => ({ q: f.q, a: <p>{f.a}</p> }))} />
          </div>
        </div>
      </section>
    </>
  );
}
