import secondJson from '../content/second.json';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { FocusText } from '../ui/FocusText';
import { Arrow, Counter, ElementTag, Hero, JumpLink, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import { OtherPortals, PortalFaq, PortalForm, PT } from '../ui/PortalBits';
import { R } from '../routes';
import './pages.css';
import './portals.css';

const S = (secondJson as unknown as { second: Record<string, any> }).second;
type TT = { title: string; text: string; meta?: string };

export default function SecondOpinion() {
  useScenePreset(PRESETS.second);
  usePageTitle(S.seoTitle);

  return (
    <div className="portal second">
      <Hero
        eyebrow={S.eyebrow}
        title={S.title}
        accent={[0, 1]}
        lead={S.lead}
        tag="Два взгляда · две линзы · Элемент 01 / 04"
        aside={
          <div className="docs-stack rv" aria-label={`Примеры документов: ${(S.heroDocs as string[]).join(', ')}`} role="img">
            {(S.heroDocs as string[]).map((d, i) => (
              <div key={d} className="doc-sheet" aria-hidden="true">
                <span className="doc-sheet__t">{d}</span>
                {i === 1 && <span className="doc-sheet__oct" />}
                {i === 2 && <span className="doc-sheet__field" />}
                {i === 0 && (
                  <>
                    <i style={{ width: '90%' }} />
                    <i style={{ width: '70%' }} />
                    <i style={{ width: '82%' }} />
                    <i style={{ width: '60%' }} />
                  </>
                )}
                <span className="anno">{S.heroDocsNote}</span>
              </div>
            ))}
          </div>
        }
        actions={
          <>
            <JumpLink to="request" className="btn">
              {S.heroUpload} <Arrow />
            </JumpLink>
            <JumpLink to="process" className="btn btn--ghost">
              {S.heroProcess}
            </JumpLink>
          </>
        }
      />

      <section className="sec sec--ink" aria-labelledby="adv-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{S.advEyebrow}</p>
            <FocusText as="p" id="adv-h" className="statement" text={S.advStatement} />
            <p className="rv" style={{ color: 'rgba(244,242,237,.78)', maxWidth: '52ch' }}>
              {S.advText}
            </p>
          </div>
          <dl className="dark-stats">
            {(S.stats as Array<{ value: number; unit?: string; label: string }>).map((s) => (
              <div key={s.label} className="rv">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter className="num" value={s.value} suffix={s.unit ?? ''} />
                  <span>{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="stage second-process" id="process" data-stage data-el={1} aria-labelledby="proc-h">
        <div className="wrap">
          <ElementTag n={2} of={4} label="вторая линза" />
          <SectionHead eyebrow={S.processEyebrow} title={S.processTitle} id="proc-h" />
          <ol className="intl-travel__grid mt-l" role="list">
            {(S.process as TT[]).map((p, i) => (
              <li key={p.title} className="glass rv" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{p.title}</h3>
                <p className="body">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="feat-h">
        <div className="wrap">
          <SectionHead eyebrow={S.featEyebrow} title={S.featTitle} id="feat-h" />
          <div className="tiles mt-l">
            {(S.features as TT[]).map((f, i) => (
              <article key={f.title} className="tile rv" style={{ ['--d' as string]: `${(i % 3) * 0.06}s` }}>
                <h3 className="h3">{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stage second-status" data-stage data-el={2} aria-labelledby="stat-h">
        <div className="wrap">
          <ElementTag n={3} of={4} label="пластина" />
          <SectionHead eyebrow={S.statusEyebrow} title={S.statusTitle} id="stat-h" />
          <p className="anno mt-m">
            {S.statusCardTitle} · {S.statusNow}: {(S.statuses as TT[])[1].title}
          </p>
          <ol className="statuses mt-s" role="list">
            {(S.statuses as TT[]).map((s, i) => (
              <li key={s.title} className={'status glass rv' + (i === 1 ? ' is-now' : '')} aria-current={i === 1 ? 'step' : undefined}>
                <span className="anno">{s.meta}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="body">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="att-h">
        <div className="wrap split">
          <div className="stack">
            <SectionHead eyebrow={S.attachEyebrow} title={S.attachTitle} id="att-h" />
            <p className="body rv">{S.attachTip}</p>
          </div>
          <div className="stack">
            <ul className="list-dots rv">
              {(S.attach as string[]).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <div className="tiles">
              <div className="tile rv">
                <h3 className="h3">{S.turnaroundTitle}</h3>
                <p>{S.turnaroundText}</p>
              </div>
              <div className="tile rv">
                <h3 className="h3">{S.privacyTitle}</h3>
                <p>{S.privacyText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--sand" id="request" aria-labelledby="req-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{PT.ptShared.formEyebrow}</p>
            <FocusText as="h2" id="req-h" className="h2" text={S.formTitle} />
            <p className="body rv">{S.formLead}</p>
          </div>
          <PortalForm variant="second" submit={S.formSubmit} />
        </div>
      </section>

      <PortalFaq items={S.faq} />
      <OtherPortals current="secondOpinion" />
      <LensCta el={3} title={S.title} primary={{ to: R.consult, label: 'Онлайн-консультация' }} secondary={{ to: R.international, label: 'Международные пациенты' }} />
    </div>
  );
}
