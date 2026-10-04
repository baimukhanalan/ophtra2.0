import peopleJson from '../content/people.json';
import { clinic } from '../lib/data';
import { mapLink } from '../lib/links';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { Aperture } from '../ui/Aperture';
import { FocusText } from '../ui/FocusText';
import { Arrow, Counter, ElementTag, Hero, LensCta, LensGlyph, PinnedSteps, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';

type Item = { id: string; title: string; text: string; to?: string; step?: string; name?: string };
const A = (peopleJson as unknown as { ABOUT: Record<string, any> }).ABOUT;

export default function About() {
  useScenePreset(PRESETS.about);
  usePageTitle('О центре');
  const facts = A.facts as Array<{ id: string; value: number; suffix: string; label: string }>;
  const team = (A.team as Item[]).filter((t) => t.id !== 'vacancies');

  return (
    <div className="about">
      <Hero
        eyebrow={A.eyebrow}
        title={A.metricsLabel}
        accent={[3]}
        lead={A.lead}
        tag="Элемент 01 / 04 — плоскопараллельная пластина"
        actions={
          <>
            <TLink to={R.founder} className="btn">
              {A.founderLink} <Arrow />
            </TLink>
            <TLink to={R.contacts} className="btn btn--ghost">
              {A.clinicsLink}
            </TLink>
          </>
        }
      />

      <section className="sec sec--paper" aria-labelledby="facts-h">
        <div className="wrap">
          <div className="about-photo">
            <Aperture label={A.photoAlt}>
              <picture>
                <source media="(max-width: 700px)" srcSet="/media/clinic-facade.sm.jpg" />
                <img src="/media/clinic-facade.jpg" alt={A.photoAlt} width={1440} height={1079} loading="lazy" />
              </picture>
            </Aperture>
          </div>
          <h2 id="facts-h" className="anno mt-l">
            {A.metricsLabel}
          </h2>
          <div className="metrics mt-m">
            {facts.map((f) => (
              <div key={f.id} className="metric rv">
                <Counter className="num" value={f.value} suffix={f.suffix} />
                <p>{f.label}</p>
              </div>
            ))}
          </div>
          <p className="small muted mt-m">{A.metricsNote}</p>
        </div>
      </section>

      {/* history — pinned, the lens gathers four steps into one centre */}
      <section className="stage" data-stage data-el={1} aria-labelledby="hist-h">
        <div className="wrap page-chapter-head">
          <ElementTag n={2} of={4} label="собирающая линза" />
          <p className="eyebrow">{A.historyEyebrow}</p>
          <FocusText as="h2" id="hist-h" className="h2" text={A.historyTitle} />
        </div>
        <PinnedSteps
          className="timeline-pin"
          items={A.history as Item[]}
          aside={(a) => (
            <div className="timeline-pin__aside" aria-hidden="true">
              <span className="timeline-pin__step" key={a}>
                {(A.history as Item[])[a].step}
              </span>
              <span className="timeline-pin__track">
                {(A.history as Item[]).map((_, i) => (
                  <i key={i} className={i <= a ? 'on' : ''} />
                ))}
              </span>
            </div>
          )}
          render={(h) => (
            <article className="glass timeline-pin__card">
              <p className="anno">{h.step}</p>
              <h3 className="h3">{h.title}</h3>
              <p className="body">{h.text}</p>
            </article>
          )}
        />
      </section>

      <section className="sec sec--solid" aria-labelledby="val-h">
        <div className="wrap">
          <SectionHead eyebrow={A.valuesEyebrow} title={A.valuesTitle} id="val-h" />
          <div className="values mt-l">
            {(A.values as Item[]).map((v, i) => (
              <article key={v.id} className="value rv" style={{ ['--d' as string]: `${i * 0.07}s` }} tabIndex={0}>
                <span className="value__lens" aria-hidden="true" />
                <h3 className="h3">{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--sand" aria-labelledby="exc-h">
        <div className="wrap">
          <SectionHead eyebrow={A.excellenceEyebrow} title={A.excellenceTitle} text={A.excellenceText} id="exc-h" />
          <div className="tiles mt-l">
            {(A.excellence as Item[]).map((e, i) => (
              <TLink key={e.id} to={mapLink(e.to!)} className="tile rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <LensGlyph curve={[0.2, 0.7, 0.45, 0.3, 0.85][i]} />
                <span className="h3">{e.title}</span>
                <p>{e.text}</p>
                <span className="tile__foot">
                  {A.open} <Arrow />
                </span>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      {/* equipment on a rail — the cylinder lens floats behind */}
      <section className="stage about-eq" data-stage data-el={2} aria-labelledby="eq-h">
        <div className="wrap">
          <ElementTag n={3} of={4} label="цилиндрическая линза" />
          <SectionHead eyebrow={A.equipmentEyebrow} title={A.equipmentTitle} text={A.equipmentText} id="eq-h" />
          <ol className="rail mt-l" role="list">
            {(A.equipment as Item[]).map((e, i) => (
              <li key={e.id} className="rail__stop rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className="rail__pin" aria-hidden="true" />
                <span className="anno">0{i + 1}</span>
                <h3 className="h3">{e.name}</h3>
                <p>{e.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="team-h">
        <div className="wrap">
          <SectionHead eyebrow={A.teamEyebrow} title={A.teamTitle} id="team-h" />
          <div className="tiles mt-l">
            {team.map((t, i) => (
              <TLink key={t.id} to={mapLink(t.to!)} className="tile rv" style={{ ['--d' as string]: `${i * 0.05}s` }}>
                <span className="tile__n">0{i + 1}</span>
                <span className="h3">{t.title}</span>
                <p>{t.text}</p>
                <span className="tile__foot">
                  {A.open} <Arrow />
                </span>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="where-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{A.clinicsEyebrow}</p>
            <FocusText as="h2" id="where-h" className="h2" text={A.clinicsTitle} />
            <p className="body rv">{A.clinicsText}</p>
            <p className="lead rv">{clinic.address}</p>
            <p className="body rv">{clinic.schedule}</p>
            <TLink to={R.contacts} className="link rv">
              {A.clinicsLink} <Arrow />
            </TLink>
          </div>
          <figure className="photo rv about-where">
            <img src="/media/clinic-evening.jpg" alt="Здание офтальмологического центра доктора Кулмаганбетова вечером, подсвеченная вывеска" width={1440} height={1085} loading="lazy" />
          </figure>
        </div>
      </section>

      <LensCta el={3} title="Консультация в центре доктора Кулмаганбетова" secondary={{ to: R.doctors, label: 'Врачи центра' }} />
    </div>
  );
}
