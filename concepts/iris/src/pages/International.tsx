import { useMemo, useState, type CSSProperties } from 'react';
import { C, DEPT_LAYER, DEPT_ORDER, byId, departments, fmtPrice, services } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { Accordion, Arrow, Chapter, Counter, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { RequestForm, contactFields } from '../components/forms';

const I = C.patients_international.intl;
const PT = C.patients;

/* Same assumptions as the production estimator (typical Astana ranges, not clinic prices). */
const KZT_PER_USD = 510;
const MARGIN = 1.2;
const AIRPORT = { min: 15000, max: 25000 };
const DAILY_RIDE = { min: 8000, max: 12000 };
const INTERPRETER_DAY = { min: 25000, max: 40000 };
type R = { min: number; max: number };
const add = (a: R, b: R): R => ({ min: a.min + b.min, max: a.max + b.max });
const times = (r: R, n: number): R => ({ min: r.min * n, max: r.max * n });
const round = (v: number, s: number) => Math.round(v / s) * s;
const nf = new Intl.NumberFormat('ru-RU');
const kzt = (r: R) => (r.min === r.max ? `${nf.format(r.min)} ₸` : `${nf.format(r.min)} – ${nf.format(r.max)} ₸`);
const usd = (r: R) => `≈ $${nf.format(round(r.min / KZT_PER_USD, 10))} – $${nf.format(round(r.max / KZT_PER_USD, 10))}`;

function Stepper({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <div className="stepper">
      <span className="stepper__l" id={`st-${label}`}>
        {label}
      </span>
      <div className="stepper__c" role="group" aria-labelledby={`st-${label}`}>
        <button type="button" onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: меньше`}>
          −
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: больше`}>
          +
        </button>
      </div>
    </div>
  );
}

function Estimator({ onApply }: { onApply: (summary: string) => void }) {
  const [sel, setSel] = useState<string[]>(['svc-complex']);
  const [nights, setNights] = useState(4);
  const [days, setDays] = useState(2);
  const [tier, setTier] = useState('comfort');
  const [transfer, setTransfer] = useState('airport');
  const [interp, setInterp] = useState(false);

  const est = useMemo(() => {
    const sum = services.filter((s) => sel.includes(s.id)).reduce((t, s) => t + s.price, 0);
    const medical = { min: sum, max: round(sum * MARGIN, 1000) };
    const st = I.stayTiers.find((t: { value: string }) => t.value === tier);
    let travel = times({ min: st.min, max: st.max }, nights);
    if (transfer !== 'none') travel = add(travel, AIRPORT);
    if (transfer === 'full') travel = add(travel, times(DAILY_RIDE, days));
    if (interp) travel = add(travel, times(INTERPRETER_DAY, days));
    return { medical, travel, total: add(medical, travel) };
  }, [sel, nights, days, tier, transfer, interp]);

  const toggle = (id: string) => setSel((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <div className="est">
      <fieldset className="est__svc">
        <legend className="h4">{I.estServices}</legend>
        {DEPT_ORDER.map((dId) => (
          <div key={dId} className="est__grp">
            <p className="est__dept">
              {DEPT_LAYER[dId].layer} · {byId(departments, dId)?.name}
            </p>
            {services
              .filter((s) => s.departmentId === dId)
              .map((s) => (
                <label key={s.id} className="est__opt">
                  <input type="checkbox" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} />
                  <span>{s.name}</span>
                  <span className="small">{fmtPrice(s.price)}</span>
                </label>
              ))}
          </div>
        ))}
      </fieldset>
      <div className="est__side">
        <div className="est__trip">
          <Stepper label={I.estNights} value={nights} set={setNights} min={0} max={30} />
          <Stepper label={I.estClinicDays} value={days} set={setDays} min={1} max={10} />
          <label className="fld">
            <span>{I.estStay}</span>
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              {I.stayTiers.map((t: { value: string; label: string; min: number; max: number }) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                  {t.max ? ` · ${nf.format(t.min)}–${nf.format(t.max)} ₸ ${I.estPerNight}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="fld">
            <span>{I.estTransfer}</span>
            <select value={transfer} onChange={(e) => setTransfer(e.target.value)}>
              {I.transferOptions.map((t: { value: string; label: string }) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="est__opt est__opt--line">
            <input type="checkbox" checked={interp} onChange={(e) => setInterp(e.target.checked)} />
            <span>{I.estInterpreter}</span>
          </label>
        </div>
        <div className="est__out" aria-live="polite">
          {sel.length === 0 ? (
            <p className="body">{I.estEmpty}</p>
          ) : (
            <>
              <p className="eyebrow">{I.estResult}</p>
              <p className="est__total">{kzt(est.total)}</p>
              <p className="small">{usd(est.total)}</p>
              <dl>
                <div>
                  <dt>{I.estMedical}</dt>
                  <dd>{kzt(est.medical)}</dd>
                </div>
                <div>
                  <dt>{I.estTravel}</dt>
                  <dd>{kzt(est.travel)}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() =>
                  onApply(
                    `${I.estPrefill}: ${services
                      .filter((s) => sel.includes(s.id))
                      .map((s) => s.name)
                      .join(', ')}; ${I.estNights}: ${nights}; ${I.estResult}: ${kzt(est.total)}`,
                  )
                }
              >
                {I.estCta} <Arrow />
              </button>
            </>
          )}
          <p className="small est__note">{I.estNote.replace('{rate}', String(KZT_PER_USD))}</p>
        </div>
      </div>
    </div>
  );
}

export default function International() {
  usePage('Международным пациентам', 'disc');
  const [prefill, setPrefill] = useState('');
  const [formKey, setFormKey] = useState(0);

  const applyEstimate = (summary: string) => {
    setPrefill(summary);
    setFormKey((k) => k + 1);
    requestAnimationFrame(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <>
      <Hero station="disc" layer="Зрительный нерв — свет уходит в мир" eyebrow={I.eyebrow} title={I.title} accent={['барьеров']} lead={I.lead}>
        <a href="#apply" className="btn">
          {I.heroApply} <Arrow />
        </a>
        <a href="#estimate" className="btn btn--ghost">
          {I.heroEstimate}
        </a>
      </Hero>

      <section className="sect" aria-labelledby="kz-h">
        <Station id="nerve" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {I.whyKzEyebrow}
          </p>
          <Scrub className="quote" text={I.whyKzStatement} />
          <h2 id="kz-h" className="h2 intl-kz__h" data-reveal>
            {I.whyKzTitle}
          </h2>
          <div className="grid-3">
            {I.whyKz.map((w: { title: string; text: string }, i: number) => (
              <div key={w.title} className="card" data-reveal style={{ '--d': i * 100 } as CSSProperties}>
                <span className="h3">{w.title}</span>
                <span className="body">{w.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Chapter steps={I.journey.length} vh={70} stations={['nerve', 'nerve', 'nerveFar']} className="nerve" label={I.journeyTitle}>
        {(active, p) => (
          <div className="wrap nerve__in">
            <div className="nerve__head">
              <p className="eyebrow">{I.journeyEyebrow}</p>
              <h2 className="h2">{I.journeyTitle}</h2>
            </div>
            <div className="nerve__line" aria-hidden="true">
              <i style={{ transform: `scaleX(${p})` }} />
              {I.journey.map((_: unknown, i: number) => (
                <span key={i} className={i <= active ? 'is-on' : ''} style={{ left: `${(i / (I.journey.length - 1)) * 100}%` }} />
              ))}
            </div>
            <div className="nerve__cards">
              {I.journey.map((j: { title: string; text: string; meta: string }, i: number) => (
                <article key={j.title} className={`ncard ${i === active ? 'is-on' : ''}`} aria-hidden={i !== active}>
                  <p className="ncard__n">
                    {I.journeyStepLabel} {i + 1}
                  </p>
                  <h3 className="display d-l">{j.title}</h3>
                  <p className="lead">{j.text}</p>
                  <p className="tag">{j.meta}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </Chapter>

      <section className="sect" aria-labelledby="us-h">
        <Station id="nerveFar" />
        <div className="wrap">
          <SectionHead eyebrow={I.whyUsEyebrow} title={I.whyUsTitle} text={I.whyUsLead} />
          <h2 id="us-h" className="sr-only">
            {I.whyUsTitle}
          </h2>
          <div className="grid-4">
            {I.whyUs.map((w: { title: string; text: string }, i: number) => (
              <div key={w.title} className="card" data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="h3">{w.title}</span>
                <span className="body">{w.text}</span>
              </div>
            ))}
          </div>
          <div className="proof panel panel--gold" data-reveal>
            <div>
              <h3 className="h3">{I.proofTitle}</h3>
              <p className="body">{I.proofText}</p>
              <a className="link" href={I.proofUrl} target="_blank" rel="noreferrer">
                {I.proofSource}
              </a>
            </div>
            <ul className="proof__list">
              {I.proof.map((p: { value?: number; text?: string; label: string }) => (
                <li key={p.label}>
                  {p.value ? <Counter value={p.value} className="proof__n" /> : <span className="proof__n num">{p.text}</span>}
                  <span className="small">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sect" id="estimate" aria-labelledby="es-h">
        <Station id="nerve" />
        <div className="wrap">
          <SectionHead eyebrow={I.estEyebrow} title={I.estTitle} text={I.estLead} />
          <h2 id="es-h" className="sr-only">
            {I.estTitle}
          </h2>
          <Estimator onApply={applyEstimate} />
        </div>
      </section>

      <section className="sect" aria-labelledby="tr-h">
        <Station id="disc" />
        <div className="wrap">
          <SectionHead eyebrow={I.travelEyebrow} title={I.travelTitle} />
          <h2 id="tr-h" className="sr-only">
            {I.travelTitle}
          </h2>
          <div className="grid-2">
            {I.travel.map((t: { title: string; text: string; list: string[] }, i: number) => (
              <div key={t.title} className="card" data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="h3">{t.title}</span>
                <span className="body">{t.text}</span>
                <ul className="ring-list">
                  {t.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="guide">
            <h3 className="h2" data-reveal>
              {I.guideLabel}
            </h3>
            <Accordion
              items={I.guide.map((g: { title: string; text: string; list?: string[] }) => ({
                q: g.title,
                a: (
                  <>
                    <p>{g.text}</p>
                    {g.list && (
                      <ul className="ring-list">
                        {g.list.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                  </>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section className="sect" id="apply" aria-labelledby="ap-h">
        <Station id="nerveFar" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">{PT.ptShared.formEyebrow}</p>
            <h2 id="ap-h" className="h2">
              {I.formTitle}
            </h2>
            <p className="body">{I.formLead}</p>
            {prefill && (
              <p className="notice" role="status">
                {I.prefillNote}
              </p>
            )}
            <p className="small">{PT.ptShared.disclaimer}</p>
          </div>
          <div className="panel">
            <RequestForm
              key={formKey}
              prefix="INT"
              submit={I.formSubmit}
              next={['Номер заявки — сразу на экране', 'Координатор свяжется в течение рабочего дня', 'Врач начнёт медицинское рассмотрение документов']}
              fields={[
                ...contactFields({ email: true, emailRequired: true }),
                { name: 'country', label: PT.ptFieldLabels.country, type: 'select', required: true, options: PT.ptCountries },
                { name: 'language', label: PT.ptFieldLabels.language, type: 'select', options: PT.ptLanguages },
                {
                  name: 'service',
                  label: PT.ptFieldLabels.service,
                  type: 'select',
                  options: [...services.map((s) => ({ value: s.id, label: s.name })), { value: 'unknown', label: PT.ptFieldLabels.otherService }],
                },
                { name: 'dates', label: PT.ptFieldLabels.dates, placeholder: PT.ptFieldLabels.datesHint },
                { name: 'diagnosis', label: PT.ptFieldLabels.diagnosis, type: 'textarea', placeholder: PT.ptFieldLabels.diagnosisHint, initial: prefill },
                { name: 'files', label: 'Документы (PDF, JPG, PNG — до 10 файлов по 10 МБ)', type: 'files' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sect sect--tight" aria-labelledby="ifaq-h">
        <div className="wrap split-2">
          <SectionHead eyebrow={PT.ptShared.faqEyebrow} title={PT.ptShared.faqTitle} />
          <div>
            <h2 id="ifaq-h" className="sr-only">
              {PT.ptShared.faqTitle}
            </h2>
            <Accordion items={I.faq.map((f: { q: string; a: string }) => ({ q: f.q, a: <p>{f.a}</p> }))} />
            <p className="small" style={{ marginTop: 24 }}>
              Также: <IrisLink to="/second-opinion">второе мнение</IrisLink> · <IrisLink to="/online-consultation">онлайн-консультация</IrisLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
