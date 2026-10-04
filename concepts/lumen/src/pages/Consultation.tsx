import consultJson from '../content/consult.json';
import { byId, money, services } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { Arrow, ElementTag, Hero, JumpLink, LensCta, PinnedSteps, SectionHead, usePageTitle } from '../ui/parts';
import { OtherPortals, PortalFaq, PortalForm, PT } from '../ui/PortalBits';
import './pages.css';
import './portals.css';

const C = (consultJson as unknown as { consult: Record<string, any> }).consult;
type TT = { title: string; text: string };

export default function Consultation() {
  useScenePreset(PRESETS.consult);
  usePageTitle(C.seoTitle);
  const consultSvc = byId(services, 'svc-consult');

  return (
    <div className="portal consult">
      <Hero
        eyebrow={C.eyebrow}
        title={C.title}
        accent={[2]}
        lead={C.lead}
        tag="Диафрагма открыта · Элемент 01 / 03"
        aside={
          <div className="call rv" role="img" aria-label="Иллюстрация видеоконсультации: врач, пациент и снимок ОКТ на экране">
            <div className="call__main" aria-hidden="true">
              <span className="call__avatar">Dr</span>
            </div>
            <span className="call__label" aria-hidden="true">
              {C.heroCall.doctor}
            </span>
            <div className="call__shared" aria-hidden="true">
              <span className="doc-sheet__oct" />
              {C.heroCall.shared}
            </div>
            <span className="call__self" aria-hidden="true">
              {C.heroCall.you}
            </span>
            <div className="call__bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
        }
        actions={
          <>
            <JumpLink to="book" className="btn">
              {C.heroBook} <Arrow />
            </JumpLink>
            <JumpLink to="steps" className="btn btn--ghost">
              {C.heroSteps}
            </JumpLink>
          </>
        }
      />

      <section className="stage consult-why" data-stage data-el={1} aria-labelledby="why-h">
        <div className="wrap split">
          <div className="stack">
            <ElementTag n={2} of={3} label="собирающая линза" />
            <p className="eyebrow">{C.statementLabel}</p>
            <FocusText as="p" id="why-h" className="statement" text={C.statement} />
          </div>
          <aside className="glass consult-must rv">
            <h3 className="h3">{C.mandatoryTitle}</h3>
            <p className="body">{C.mandatoryText}</p>
            <TLink to={R.international} className="link">
              {C.mandatoryLink} <Arrow />
            </TLink>
          </aside>
        </div>
      </section>

      <section className="sec sec--solid" id="steps" aria-labelledby="steps-h" style={{ paddingBottom: 0 }}>
        <div className="wrap page-chapter-head" style={{ paddingTop: 0 }}>
          <p className="eyebrow">{C.stepsEyebrow}</p>
          <FocusText as="h2" id="steps-h" className="h2" text={C.stepsTitle} />
        </div>
        <PinnedSteps
          className="timeline-pin"
          items={C.steps as TT[]}
          aside={(a) => (
            <div className="timeline-pin__aside" aria-hidden="true">
              <span className="timeline-pin__step" key={a}>
                0{a + 1}
              </span>
              <span className="timeline-pin__track">
                {(C.steps as TT[]).map((_, i) => (
                  <i key={i} className={i <= a ? 'on' : ''} />
                ))}
              </span>
            </div>
          )}
          render={(s) => (
            <article className="glass timeline-pin__card">
              <h3 className="h3">{s.title}</h3>
              <p className="body">{s.text}</p>
            </article>
          )}
        />
      </section>

      <section className="sec sec--paper" aria-labelledby="plat-h">
        <div className="wrap">
          <SectionHead eyebrow={C.platformsEyebrow} title={C.platformsTitle} text={C.platformsLead} id="plat-h" />
          <div className="tiles mt-l">
            {(C.platforms as Array<{ id: string; name: string; text: string }>).map((p) => (
              <article key={p.id} className="tile rv">
                <span className="consult-plat" aria-hidden="true">
                  {p.name[0]}
                </span>
                <h3 className="h3">{p.name}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stage consult-needs" data-stage data-el={2} aria-labelledby="needs-h">
        <div className="wrap">
          <ElementTag n={3} of={3} label="пластина" />
          <SectionHead eyebrow={C.needsEyebrow} title={C.needsTitle} id="needs-h" />
          <div className="intl-travel__grid mt-l">
            {(C.needs as TT[]).map((n, i) => (
              <article key={n.title} className="glass rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <h3 className="h3">{n.title}</h3>
                <p className="body">{n.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="price-h">
        <div className="wrap split">
          <SectionHead eyebrow={C.priceEyebrow} title={C.priceTitle} text={C.priceText} id="price-h" />
          <div className="svc-price rv">
            {consultSvc && (
              <div>
                <span>{consultSvc.name}</span>
                <strong>{money(consultSvc.price)}</strong>
              </div>
            )}
            <ul className="list-dots mt-s">
              {(C.priceIncludes as string[]).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <TLink to={R.services} className="link mt-s">
              {C.pricingLink} <Arrow />
            </TLink>
          </div>
        </div>
      </section>

      <section className="sec sec--sand" id="book" aria-labelledby="book-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{PT.ptShared.formEyebrow}</p>
            <FocusText as="h2" id="book-h" className="h2" text={C.formTitle} />
            <p className="body rv">{C.formLead}</p>
            <h3 className="anno rv">{C.nextTitle}</h3>
            <ol className="steps-mini rv" role="list">
              {(C.next as string[]).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </div>
          <PortalForm variant="consult" submit={C.formSubmit} />
        </div>
      </section>

      <PortalFaq items={C.faq} />
      <OtherPortals current="consultation" />
      <LensCta title={C.statement} primary={{ to: R.booking, label: 'Очная запись' }} secondary={{ to: R.second, label: 'Второе мнение' }} />
    </div>
  );
}
