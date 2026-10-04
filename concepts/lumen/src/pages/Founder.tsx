import founderJson from '../content/founder.json';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { GlassPortrait } from '../ui/GlassPortrait';
import { Arrow, ElementTag, Hero, JumpLink, LensCta, PinnedSteps, SectionHead, usePageTitle } from '../ui/parts';
import { RouteMap, type MapPoint } from '../ui/RouteMap';
import './pages.css';
import './founder.css';

const D = founderJson as unknown as {
  FOUNDER: Record<string, any>;
  FOUNDER_PUBLICATIONS: Array<{ id: string; kind: string; year: number; title: string; venue: string; url: string; summary?: string }>;
  FOUNDER_SOURCE_LIST: Array<{ label: string; href: string }>;
  FOUNDER_VIDEO: { url: string; poster: string; title: string; caption: string };
};
const F = D.FOUNDER;
type PathStep = { id: string; label: string; title: string; text: string; evidence: { mark: string; source: string } };

/** The device principle from the copy, drawn as an optical schematic. */
function Superposition() {
  return (
    <figure className="superpos">
      <svg viewBox="0 0 800 300" role="img" aria-labelledby="sp-t sp-d">
        <title id="sp-t">Схема принципа устройства (иллюстрация)</title>
        <desc id="sp-d">
          Поляризованный и неполяризованный свет в суперпозиции проходят через систему фильтров и линз к сетчатке.
        </desc>
        <defs>
          <linearGradient id="sp-g" x1="0" x2="1">
            <stop offset="0" stopColor="#c9b08a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#a88b5e" />
          </linearGradient>
        </defs>
        {/* polarised: a clean sine */}
        <path className="superpos__wave" d="M20 90 q20 -28 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
        {/* unpolarised: scattered strokes */}
        <g className="superpos__noise">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={24 + i * 20} y1={210 + ((i * 37) % 22) - 11} x2={34 + i * 20} y2={210 - ((i * 53) % 26) + 13} />
          ))}
        </g>
        <path className="superpos__merge" d="M300 90 C360 90 360 150 400 150 M300 210 C360 210 360 150 400 150" />
        <rect x="408" y="96" width="14" height="108" rx="3" className="superpos__filter" />
        <rect x="432" y="96" width="14" height="108" rx="3" className="superpos__filter" />
        <path d="M494 80 Q534 150 494 220 Q474 150 494 80 Z" className="superpos__lens" />
        <path className="superpos__out" d="M446 150 L494 150 M510 150 L660 150" />
        <circle cx="700" cy="150" r="54" className="superpos__eye" />
        <circle cx="700" cy="150" r="20" className="superpos__iris" />
        <text x="20" y="54" className="superpos__lbl">
          поляризованный свет
        </text>
        <text x="20" y="262" className="superpos__lbl">
          неполяризованный свет
        </text>
        <text x="400" y="244" className="superpos__lbl">
          фильтры и линзы
        </text>
        <text x="640" y="236" className="superpos__lbl">
          сетчатка
        </text>
      </svg>
      <figcaption className="anno">Иллюстрация принципа по описанию разработки · не медицинская схема прибора</figcaption>
    </figure>
  );
}

export default function Founder() {
  useScenePreset(PRESETS.founder);
  usePageTitle(F.seoTitle);
  const pubs = D.FOUNDER_PUBLICATIONS.filter((p) => p.kind === 'article');

  return (
    <div className="founder">
      <Hero
        eyebrow={F.eyebrow}
        title={F.title}
        accent={[4, 5]}
        lead={F.lead}
        tag={`${F.credentialsLine} · Элемент 01 / 03 — шаровая линза`}
        actions={
          <>
            <JumpLink to="publications" className="btn">
              {F.toPublications}
            </JumpLink>
            <JumpLink to="media" className="btn btn--ghost">
              {F.toMedia}
            </JumpLink>
          </>
        }
      />

      <section className="sec sec--paper" aria-labelledby="cred-h">
        <div className="wrap founder-id">
          <GlassPortrait monogram={F.monogram} label={F.fullTitle} caption={F.nameLatin} />
          <div>
          <p className="eyebrow">{F.credentialsLine}</p>
          <FocusText as="h2" className="h2 mt-s" text={F.fullTitle} />
          <h3 id="cred-h" className="anno mt-l">
            {F.credentialsLabel}
          </h3>
          <ul className="creds mt-m" role="list">
            {(F.credentials as Array<{ id: string; abbr: string; title: string; text: string }>).map((c, i) => (
              <li key={c.id} className="cred rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <span className="cred__abbr">{c.abbr}</span>
                <span className="cred__t">{c.title}</span>
                <span className="cred__x">{c.text}</span>
              </li>
            ))}
          </ul>
          <p className="small muted mt-m">{F.honoursNote}</p>
          </div>
        </div>
      </section>

      <section className="stage founder-manifesto" data-stage data-el={1} aria-labelledby="man-h">
        <div className="wrap">
          <ElementTag n={2} of={3} label="призма" />
          <p className="eyebrow mt-m" id="man-h">
            {F.manifestoEyebrow}
          </p>
          <FocusText as="blockquote" className="statement founder-manifesto__q mt-m" text={F.manifesto} />
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="path-h">
        <div className="wrap page-chapter-head" style={{ paddingTop: 0 }}>
          <p className="eyebrow">{F.pathEyebrow}</p>
          <FocusText as="h2" id="path-h" className="h2" text={F.pathTitle} />
        </div>
        <PinnedSteps
          className="timeline-pin founder-path"
          items={F.path as PathStep[]}
          aside={(a) => {
            const s = (F.path as PathStep[])[a];
            return (
              <div className="timeline-pin__aside" aria-hidden="true">
                <span className="anno">
                  {String(a + 1).padStart(2, '0')} / {String((F.path as PathStep[]).length).padStart(2, '0')} · {s.label}
                </span>
                <span className="timeline-pin__step" key={a}>
                  {s.evidence.mark}
                </span>
                <span className="small muted">{s.evidence.source}</span>
                <span className="timeline-pin__track">
                  {(F.path as PathStep[]).map((_, i) => (
                    <i key={i} className={i <= a ? 'on' : ''} />
                  ))}
                </span>
              </div>
            );
          }}
          render={(s) => (
            <article className="glass timeline-pin__card">
              <p className="anno">{s.label}</p>
              <h3 className="h3">{s.title}</h3>
              <p className="body">{s.text}</p>
            </article>
          )}
        />
      </section>

      <section className="sec sec--paper" aria-labelledby="sp-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">Квантовая оптика</p>
            <FocusText as="h2" id="sp-h" className="h2" text="Свет в суперпозиции" />
            <p className="body rv">{(F.path as PathStep[]).find((p) => p.id === 'device')?.text}</p>
          </div>
          <div className="rv">
            <Superposition />
          </div>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="glob-h">
        <div className="wrap">
          <SectionHead eyebrow={F.globalEyebrow} title={F.globalTitle} text={F.globalText} id="glob-h" />
          <div className="mt-l rv">
            <RouteMap points={F.routePoints as MapPoint[]} label={F.routeLabel} />
          </div>
          <ul className="places mt-m" role="list">
            {(F.globalPlaces as Array<{ id: string; place: string; title: string; text: string }>).map((p) => (
              <li key={p.id} className="rv">
                <span className="anno">{p.place}</span>
                <span className="h3">{p.title}</span>
                <span className="small muted">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec--sand" aria-labelledby="res-h">
        <div className="wrap">
          <SectionHead eyebrow={F.researchEyebrow} title={F.researchTitle} id="res-h" />
          <div className="tiles mt-l">
            {(F.research as Array<{ id: string; eyebrow: string; title: string; text: string }>).map((r, i) => (
              <article key={r.id} className="tile rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className="anno">{r.eyebrow}</span>
                <h3 className="h3">{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stage founder-vision" data-stage data-el={2} aria-labelledby="vis-h">
        <div className="wrap">
          <ElementTag n={3} of={3} label="линза с короткой фокусной" />
          <p className="eyebrow mt-m">{F.visionEyebrow}</p>
          <FocusText as="p" id="vis-h" className="statement mt-m founder-vision__t" text={F.visionStatement} />
          <div className="founder-vision__pillars mt-l">
            {(F.visionPillars as Array<{ id: string; title: string; text: string }>).map((p, i) => (
              <article key={p.id} className="glass rv" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <h3 className="h3">{p.title}</h3>
                <p className="body">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--paper" id="publications" aria-labelledby="pub-h">
        <div className="wrap">
          <SectionHead eyebrow={F.publicationsEyebrow} title={F.publicationsTitle} text={F.publicationsText} id="pub-h" />
          <ol className="pubs mt-l" role="list">
            {pubs.map((p) => (
              <li key={p.id} className="rv">
                <a href={p.url} target="_blank" rel="noreferrer" className="pub">
                  <span className="pub__v">
                    {p.venue} · {p.year}
                  </span>
                  <span className="pub__t">{p.title}</span>
                  {p.summary && <span className="pub__s">{p.summary}</span>}
                  <span className="sr-only">(откроется в новой вкладке)</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="topics mt-l rv">
            <h3 className="anno">{F.topicsLabel}</h3>
            <ul role="list" className="row mt-s">
              {(F.speakingTopics as string[]).map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec sec--solid" id="media" aria-labelledby="media-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{F.mediaEyebrow}</p>
            <FocusText as="h2" id="media-h" className="h2" text={F.mediaTitle} />
            <a className="video rv" href={D.FOUNDER_VIDEO.url} target="_blank" rel="noreferrer">
              <img src={D.FOUNDER_VIDEO.poster} alt="" width={480} height={360} loading="lazy" />
              <span className="video__play" aria-hidden="true" />
              <span className="video__cap">
                <strong>{F.playVideo}</strong>
                <span className="small">{D.FOUNDER_VIDEO.title}</span>
                <span className="sr-only">(YouTube, откроется в новой вкладке)</span>
              </span>
            </a>
            <p className="small muted rv">{D.FOUNDER_VIDEO.caption}</p>
          </div>
          <div className="stack">
            <h3 className="h3 rv">{F.sourcesTitle}</h3>
            <ul className="sources rv" role="list">
              {D.FOUNDER_SOURCE_LIST.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="small muted rv">{F.sourcesNote}</p>
            <TLink to={R.science} className="link rv">
              Наука и инновации <Arrow />
            </TLink>
          </div>
        </div>
      </section>

      <LensCta title={F.ctaTitle} secondary={{ to: R.second, label: 'Получить второе мнение' }} />
    </div>
  );
}
