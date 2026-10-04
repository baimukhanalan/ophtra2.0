import { useId, useMemo, useState } from 'react';
import intlJson from '../content/intl.json';
import { departments, services } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { scrollToEl } from '../lib/scroll';
import { R } from '../routes';
import { FocusText } from '../ui/FocusText';
import { Accordion, Arrow, Counter, ElementTag, Hero, JumpLink, LensCta, PinnedSteps, SectionHead, usePageTitle } from '../ui/parts';
import { OtherPortals, PortalFaq, PortalForm, PT } from '../ui/PortalBits';
import { deptShort } from './Services';
import './pages.css';
import './portals.css';

const I = (intlJson as unknown as { intl: Record<string, any> }).intl;

/* Estimator constants mirror the production CostEstimator (typical travel costs; a guide, not a bill). */
const KZT_PER_USD = 510;
const MEDICAL_MARGIN = 1.2;
const AIRPORT = { min: 15000, max: 25000 };
const DAILY_RIDE = { min: 8000, max: 12000 };
const INTERPRETER_DAY = { min: 25000, max: 40000 };
type Range = { min: number; max: number };
const add = (a: Range, b: Range): Range => ({ min: a.min + b.min, max: a.max + b.max });
const times = (r: Range, n: number): Range => ({ min: r.min * n, max: r.max * n });
const round = (v: number, s: number) => Math.round(v / s) * s;
const nf = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const kzt = (r: Range) => (r.min === r.max ? `${nf(r.min)} ₸` : `${nf(r.min)} – ${nf(r.max)} ₸`);
const usd = (r: Range) => `≈ $${nf(round(r.min / KZT_PER_USD, 10))} – $${nf(round(r.max / KZT_PER_USD, 10))}`;

function Estimator({ onApply }: { onApply: (summary: string) => void }) {
  const id = useId();
  const [selected, setSelected] = useState<string[]>(['svc-complex']);
  const [nights, setNights] = useState(4);
  const [days, setDays] = useState(2);
  const [tier, setTier] = useState('comfort');
  const [transfer, setTransfer] = useState('airport');
  const [interp, setInterp] = useState(false);
  const tiers = I.stayTiers as Array<{ value: string; label: string; min: number; max: number }>;

  const est = useMemo(() => {
    const sum = services.filter((s) => selected.includes(s.id)).reduce((t, s) => t + s.price, 0);
    const medical = { min: sum, max: round(sum * MEDICAL_MARGIN, 1000) };
    const st = tiers.find((t) => t.value === tier)!;
    let travel = times({ min: st.min, max: st.max }, nights);
    if (transfer !== 'none') travel = add(travel, AIRPORT);
    if (transfer === 'full') travel = add(travel, times(DAILY_RIDE, days));
    if (interp) travel = add(travel, times(INTERPRETER_DAY, days));
    return { medical, travel, total: add(medical, travel) };
  }, [selected, nights, days, tier, transfer, interp, tiers]);

  const toggle = (sid: string) => setSelected((c) => (c.includes(sid) ? c.filter((x) => x !== sid) : [...c, sid]));

  return (
    <div className="est">
      <fieldset className="est__svc">
        <legend className="anno">
          {I.estServices} · {I.estSelected}: {selected.length}
        </legend>
        {departments.map((d) => (
          <div key={d.id} className="est__group">
            <p className="est__gt">{deptShort(d.name)}</p>
            {services
              .filter((s) => s.departmentId === d.id)
              .map((s) => (
                <label key={s.id} className="est__opt">
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
                  <span>{s.name}</span>
                  <span className="est__p">{nf(s.price)} ₸</span>
                </label>
              ))}
          </div>
        ))}
      </fieldset>
      <div className="est__side">
        <div className="est__controls glass">
          <label className="est__range" htmlFor={id + 'n'}>
            <span>
              {I.estNights}: <strong>{nights}</strong>
            </span>
            <input id={id + 'n'} type="range" min={0} max={14} value={nights} onChange={(e) => setNights(+e.target.value)} />
          </label>
          <label className="est__range" htmlFor={id + 'd'}>
            <span>
              {I.estClinicDays}: <strong>{days}</strong>
            </span>
            <input id={id + 'd'} type="range" min={1} max={7} value={days} onChange={(e) => setDays(+e.target.value)} />
          </label>
          <fieldset className="est__seg">
            <legend>{I.estStay}</legend>
            <div className="filters">
              {tiers.map((t) => (
                <button key={t.value} type="button" className="filter" aria-pressed={tier === t.value} onClick={() => setTier(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="est__seg">
            <legend>{I.estTransfer}</legend>
            <div className="filters">
              {(I.transferOptions as Array<{ value: string; label: string }>).map((t) => (
                <button key={t.value} type="button" className="filter" aria-pressed={transfer === t.value} onClick={() => setTransfer(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="check">
            <input type="checkbox" checked={interp} onChange={(e) => setInterp(e.target.checked)} />
            <span>{I.estInterpreter}</span>
          </label>
        </div>
        <div className="est__out" aria-live="polite">
          {selected.length === 0 ? (
            <p className="body">{I.estEmpty}</p>
          ) : (
            <>
              <p className="anno">{I.estResult}</p>
              <p className="est__total">{kzt(est.total)}</p>
              <p className="small muted">{usd(est.total)}</p>
              <dl className="kv mt-s">
                <dt>{I.estMedical}</dt>
                <dd>{kzt(est.medical)}</dd>
                <dt>{I.estTravel}</dt>
                <dd>{kzt(est.travel)}</dd>
              </dl>
              <button
                type="button"
                className="btn btn--sm mt-s"
                onClick={() =>
                  onApply(
                    `${I.estPrefill}: ${services
                      .filter((s) => selected.includes(s.id))
                      .map((s) => s.name)
                      .join(', ')}; ${I.estNights.toLowerCase()} — ${nights}; ${I.estResult.toLowerCase()} ${kzt(est.total)}`,
                  )
                }
              >
                {I.estCta}
              </button>
            </>
          )}
          <p className="small muted mt-s">{I.estNote}</p>
        </div>
      </div>
    </div>
  );
}

export default function International() {
  useScenePreset(PRESETS.international);
  usePageTitle(I.seoTitle);
  const [prefill, setPrefill] = useState<string | undefined>();
  type Step = { title: string; text: string; meta: string };

  return (
    <div className="portal intl">
      <Hero
        eyebrow={I.eyebrow}
        title={I.title}
        accent={[3]}
        lead={I.lead}
        tag="Портал · Элемент 01 / 04"
        aside={
          <figure className="lens-photo rv">
            <img src="/media/clinic-day.sm.jpg" alt={I.heroPhotoAlt} width={780} height={584} />
          </figure>
        }
        actions={
          <>
            <JumpLink to="apply" className="btn">
              {I.heroApply} <Arrow />
            </JumpLink>
            <JumpLink to="estimate" className="btn btn--ghost">
              {I.heroEstimate}
            </JumpLink>
          </>
        }
      />

      <section className="stage intl-kz" data-stage data-el={1} aria-labelledby="kz-h">
        <div className="wrap">
          <ElementTag n={2} of={4} label="шаровая линза" />
          <p className="eyebrow mt-m">{I.whyKzEyebrow}</p>
          <FocusText as="h2" id="kz-h" className="h2 mt-s" text={I.whyKzTitle} />
          <FocusText as="p" className="statement mt-m intl-kz__st" text={I.whyKzStatement} />
          <div className="intl-kz__grid mt-l">
            {(I.whyKz as Array<{ title: string; text: string }>).map((w, i) => (
              <article key={w.title} className="glass rv" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <h3 className="h3">{w.title}</h3>
                <p className="body">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="us-h">
        <div className="wrap">
          <SectionHead eyebrow={I.whyUsEyebrow} title={I.whyUsTitle} text={I.whyUsLead} id="us-h" />
          <div className="tiles mt-l">
            {(I.whyUs as Array<{ title: string; text: string }>).map((w, i) => (
              <article key={w.title} className="tile rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
          <div className="proof mt-l rv">
            <div>
              <h3 className="h3">{I.proofTitle}</h3>
              <p className="body mt-s">{I.proofText}</p>
              <a href={I.proofUrl} target="_blank" rel="noreferrer" className="small">
                {I.proofSource}
              </a>
            </div>
            <dl className="proof__nums">
              {(I.proof as Array<{ value?: number; text?: string; label: string }>).map((p) => (
                <div key={p.label}>
                  <dt className="sr-only">{p.label}</dt>
                  <dd>
                    {p.value ? <Counter className="num" value={p.value} /> : <span className="num">{p.text}</span>}
                    <span className="small muted">{p.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="journey-h" style={{ paddingBottom: 0 }}>
        <div className="wrap page-chapter-head" style={{ paddingTop: 0 }}>
          <p className="eyebrow">{I.journeyEyebrow}</p>
          <FocusText as="h2" id="journey-h" className="h2" text={I.journeyTitle} />
        </div>
        <PinnedSteps
          className="timeline-pin"
          items={I.journey as Step[]}
          aside={(a) => (
            <div className="timeline-pin__aside" aria-hidden="true">
              <span className="anno">
                {I.journeyStepLabel} {a + 1} / {(I.journey as Step[]).length}
              </span>
              <span className="timeline-pin__step" key={a}>
                {(I.journey as Step[])[a].meta}
              </span>
              <span className="timeline-pin__track">
                {(I.journey as Step[]).map((_, i) => (
                  <i key={i} className={i <= a ? 'on' : ''} />
                ))}
              </span>
            </div>
          )}
          render={(s, i) => (
            <article className="glass timeline-pin__card">
              <p className="anno">
                {I.journeyStepLabel} {i + 1}
              </p>
              <h3 className="h3">{s.title}</h3>
              <p className="body">{s.text}</p>
            </article>
          )}
        />
      </section>

      <section className="sec sec--sand" id="estimate" aria-labelledby="est-h">
        <div className="wrap">
          <SectionHead eyebrow={I.estEyebrow} title={I.estTitle} text={I.estLead} id="est-h" />
          <div className="mt-l">
            <Estimator
              onApply={(s) => {
                setPrefill(s);
                setTimeout(() => scrollToEl(document.getElementById('apply')), 30);
              }}
            />
          </div>
        </div>
      </section>

      <section className="stage intl-travel" data-stage data-el={2} aria-labelledby="travel-h">
        <div className="wrap">
          <ElementTag n={3} of={4} label="собирающая линза" />
          <SectionHead eyebrow={I.travelEyebrow} title={I.travelTitle} id="travel-h" />
          <div className="intl-travel__grid mt-l">
            {(I.travel as Array<{ title: string; text: string; list: string[] }>).map((t, i) => (
              <article key={t.title} className="glass rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{t.title}</h3>
                <p className="body">{t.text}</p>
                <ul className="list-dots small">
                  {t.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="coord-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{I.coordEyebrow}</p>
            <FocusText as="h2" id="coord-h" className="h2" text={I.coordTitle} />
            <p className="body rv">{I.coordText}</p>
            <p className="small muted rv">
              {I.coordRole} · {I.coordHours}
            </p>
          </div>
          <div className="stack">
            <p className="eyebrow rv">{I.langEyebrow}</p>
            <h3 className="h3 rv">{I.langTitle}</h3>
            <ul className="langs rv" role="list">
              {(I.langs as Array<{ code: string; name: string; ready: boolean }>).map((l) => (
                <li key={l.code} className={l.ready ? '' : 'is-soon'}>
                  <span className="langs__c">{l.code}</span>
                  <span>{l.name}</span>
                  {!l.ready && <span className="chip">{I.langSoon}</span>}
                </li>
              ))}
            </ul>
            <p className="small muted rv">
              {I.langLead} {I.langNote}
            </p>
          </div>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="guide-h">
        <div className="wrap split">
          <SectionHead eyebrow={I.guideLabel} title={(I.guide as Array<{ title: string }>)[0].title} id="guide-h" />
          <Accordion
            items={(I.guide as Array<{ title: string; text: string; list?: string[] }>).map((g) => ({
              q: g.title,
              a: (
                <>
                  <p>{g.text}</p>
                  {g.list && (
                    <ul className="list-dots mt-s">
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
      </section>

      <section className="sec sec--sand" id="apply" aria-labelledby="apply-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{PT.ptShared.formEyebrow}</p>
            <FocusText as="h2" id="apply-h" className="h2" text={I.formTitle} />
            <p className="body rv">{I.formLead}</p>
            <h3 className="anno rv">{I.formAsideTitle}</h3>
            <ol className="steps-mini rv" role="list">
              {(I.formAside as string[]).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
            {prefill && <p className="demo-note">{I.prefillNote}</p>}
          </div>
          <PortalForm key={prefill ?? 'blank'} variant="international" submit={I.formSubmit} prefill={prefill} />
        </div>
      </section>

      <PortalFaq items={I.faq} />
      <OtherPortals current="international" />
      <LensCta el={3} title={I.continueTitle} primary={{ to: R.consult, label: 'Онлайн-консультация' }} secondary={{ to: R.second, label: 'Второе мнение' }} />
    </div>
  );
}
