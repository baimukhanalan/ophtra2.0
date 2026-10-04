import { useState, type CSSProperties } from 'react';
import { C } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { Arrow, Chapter, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { RouteMap } from '../components/RouteMap';
import { RequestForm, contactFields } from '../components/forms';

const N = C.people_network;
const E = N.EXPERTS;
type Country = { id: string; region: string; name: string; lat: number; lng: number; hub?: boolean };
const COUNTRIES = N.NETWORK_COUNTRIES as Country[];
const SUB = Object.fromEntries((N.SUBSPECIALTIES as Array<{ value: string; label: string }>).map((s) => [s.value, s.label]));
const FMT = Object.fromEntries((N.NETWORK_FORMATS as Array<{ id: string; title: string }>).map((f) => [f.id, f.title]));

export default function Experts() {
  usePage('Глобальные эксперты', 'nerve');
  const [region, setRegion] = useState('all');
  const profiles = (N.DEMO_EXPERTS as Array<{ id: string; code: string; country: string; subspecialty: string; formats: string[]; focus: string; languages: string[] }>).filter(
    (p) => region === 'all' || COUNTRIES.find((c) => c.id === p.country)?.region === region,
  );
  const pts = COUNTRIES.filter((c) => c.hub || region === 'all' || c.region === region).map((c) => ({ ...c, note: c.hub ? E.hub : undefined }));

  return (
    <>
      <Hero station="disc" layer="Нервные волокна — связь с миром" eyebrow={E.eyebrow} title="Сложный случай заслуживает нескольких взглядов" accent={['нескольких', 'взглядов']} lead={E.lead}>
        <a href="#join" className="btn">
          {E.join} <Arrow />
        </a>
        <IrisLink to="/second-opinion" className="btn btn--ghost">
          {E.toSecondOpinion}
        </IrisLink>
      </Hero>

      <Chapter steps={N.NETWORK_FORMATS.length} vh={75} stations={['nerve', 'nerve', 'nerveFar']} className="fibres" label={E.modelTitle}>
        {(active) => (
          <div className="wrap fibres__in">
            <div>
              <p className="eyebrow">{E.modelEyebrow}</p>
              <h2 className="h2">{E.modelTitle}</h2>
              <p className="body">{E.modelText}</p>
            </div>
            <div className="fibres__cards">
              {N.NETWORK_FORMATS.map((f: { id: string; title: string; text: string; points: string[] }, i: number) => (
                <article key={f.id} className={`fcard ${i === active ? 'is-on' : ''}`} aria-hidden={i !== active}>
                  <p className="fcard__mark">0{i + 1}</p>
                  <h3 className="h3">{f.title}</h3>
                  <p className="body">{f.text}</p>
                  <ul className="ring-list">
                    {f.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}
      </Chapter>

      <section className="sect" aria-labelledby="map-h">
        <Station id="nerveFar" />
        <div className="wrap">
          <SectionHead eyebrow={E.mapEyebrow} title={E.mapTitle} text={E.mapText} />
          <h2 id="map-h" className="sr-only">
            {E.mapTitle}
          </h2>
          <div className="toolbar" role="group" aria-label="Регион">
            <button type="button" className="chip" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>
              {E.allRegions}
            </button>
            {N.NETWORK_REGIONS.filter((r: { id: string }) => r.id !== 'central-asia').map((r: { id: string; name: string }) => (
              <button key={r.id} type="button" className="chip" aria-pressed={region === r.id} onClick={() => setRegion(r.id)}>
                {r.name}
              </button>
            ))}
          </div>
          <RouteMap points={pts} label={E.mapLabel} />
        </div>
      </section>

      <section className="sect" aria-labelledby="pf-h">
        <Station id="nerve" />
        <div className="wrap">
          <SectionHead eyebrow={E.profilesEyebrow} title={E.profilesTitle} />
          <h2 id="pf-h" className="sr-only">
            {E.profilesTitle}
          </h2>
          <p className="notice" data-reveal>
            {E.profilesNote}
          </p>
          {profiles.length === 0 ? (
            <p className="empty">{E.noProfiles}</p>
          ) : (
            <ul className="grid-4 experts">
              {profiles.map((p) => (
                <li key={p.id} className="card expert">
                  <span className="monogram">
                    <span>{p.code}</span>
                  </span>
                  <span className="h4">
                    {E.expertName} {p.code} · {COUNTRIES.find((c) => c.id === p.country)?.name}
                  </span>
                  <span className="tag">{SUB[p.subspecialty]}</span>
                  <span className="body">{p.focus}</span>
                  <span className="small">
                    {p.formats.map((f) => FMT[f]).join(' · ')} · {p.languages.map((l) => l.toUpperCase()).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="sect" aria-labelledby="fl-h">
        <Station id="disc" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {E.flowEyebrow}
          </p>
          <Scrub className="quote" text={E.flowStatement} />
          <h2 id="fl-h" className="h2 intl-kz__h" data-reveal>
            {E.flowTitle}
          </h2>
          <ol className="flow">
            {E.flow.map((f: { title: string; text: string }, i: number) => (
              <li key={f.title} data-reveal style={{ '--d': i * 90 } as CSSProperties}>
                <span className="flow__n">0{i + 1}</span>
                <h3 className="h4">{f.title}</h3>
                <p className="small">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect" aria-labelledby="sd-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={E.standardsEyebrow} title={E.standardsTitle} />
          <h2 id="sd-h" className="sr-only">
            {E.standardsTitle}
          </h2>
          <div className="grid-4">
            {E.standards.map((s: { title: string; text: string }, i: number) => (
              <div key={s.title} className="card" data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="h3">{s.title}</span>
                <span className="body">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" id="join" aria-labelledby="jn-h">
        <Station id="nerveFar" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">{E.joinEyebrow}</p>
            <h2 id="jn-h" className="h2">
              {E.joinTitle}
            </h2>
            <p className="body">{E.joinText}</p>
          </div>
          <div className="panel">
            <RequestForm
              prefix="NET"
              submit={E.joinSubmit}
              fields={[
                ...contactFields({ email: true, emailRequired: true }),
                { name: 'country', label: E.fieldCountry, required: true },
                { name: 'sub', label: E.fieldSubspecialty, type: 'select', required: true, options: N.SUBSPECIALTIES },
                {
                  name: 'format',
                  label: E.fieldFormat,
                  type: 'select',
                  options: N.NETWORK_FORMATS.map((f: { id: string; title: string }) => ({ value: f.id, label: f.title })),
                },
                { name: 'profile', label: E.fieldProfile, hint: E.fieldProfileHint },
                { name: 'about', label: E.commentLabel, type: 'textarea' },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
