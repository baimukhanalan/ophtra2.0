import homeJson from '../content/home.json';
import { METRIC_LABEL, site } from '../lib/data';
import { latestArticles, categoryLabel } from '../lib/knowledge';
import { mapLink } from '../lib/links';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { Arrow, Counter, ElementTag, Hero, LensCta, LensGlyph, PinnedSteps, SectionHead, trackLight, usePageTitle } from '../ui/parts';
import { GlassPortrait } from '../ui/GlassPortrait';
import './home.css';

const H = (homeJson as unknown as { homeCopy: Record<string, any>; latestPublications: Array<{ title: string; journal: string; year: number; href: string }> }).homeCopy;
const PUBS = (homeJson as unknown as { latestPublications: Array<{ title: string; journal: string; year: number; href: string }> }).latestPublications;

const CURVES = [0.18, 0.62, 0.42, 0.3, 0.8];

export default function Home() {
  useScenePreset(PRESETS.home);
  usePageTitle('Зрение, которому доверяют');
  const articles = latestArticles(3);

  return (
    <div className="home">
      <Hero
        size="xl"
        eyebrow={H.heroEyebrow}
        title={`${H.heroTitle} ${H.heroAccent}`}
        accent={[H.heroTitle.split(' ').length]}
        lead={H.heroText}
        tag={`${H.heroBadge} · Элемент 01 / 05 — собирающая линза`}
        actions={
          <>
            <TLink to={R.booking} className="btn" onPointerMove={trackLight}>
              {H.ctaBook} <Arrow />
            </TLink>
            <TLink to={R.international} className="btn btn--ghost">
              {H.ctaInternational}
            </TLink>
            <TLink to={R.second} className="link home__second">
              {H.ctaSecond}
            </TLink>
          </>
        }
      />

      {/* 02 — aperture: the mission, focused */}
      <section className="stage home-mission" data-stage data-el={1}>
        <div className="wrap home-mission__in">
          <ElementTag n={2} of={5} label="диафрагма" />
          <p className="eyebrow rv">{H.missionEyebrow}</p>
          <FocusText as="p" className="statement home-mission__t" text={H.mission} />
          <p className="lead rv">{H.missionText}</p>
        </div>
      </section>

      {/* metrics: a solid band of sharp numbers */}
      <section className="sec sec--paper sec--tight home-metrics" aria-labelledby="metrics-h">
        <div className="wrap">
          <h2 id="metrics-h" className="anno">
            Центр в цифрах
          </h2>
          <div className="metrics mt-m">
            {site.metrics.map((m) => (
              <div key={m.id} className="metric rv">
                <Counter className="num" value={m.value} suffix={m.suffix} />
                <p>{METRIC_LABEL[m.id]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — prism: trust splits into three components */}
      <section className="stage home-why" data-stage data-el={2} aria-labelledby="why-h">
        <div className="wrap home-why__head">
          <ElementTag n={3} of={5} label="призма" />
          <p className="eyebrow">{H.whyEyebrow}</p>
          <FocusText as="h2" id="why-h" className="h2" text={H.whyTitle} />
        </div>
        <PinnedSteps
          className="home-why__pin"
          label={H.formula}
          items={H.why as Array<{ title: string; text: string; fact: string }>}
          aside={(a) => (
            <div className="home-why__fact" aria-hidden="true">
              <span className="anno">{H.formula}</span>
              <span className="home-why__spectrum">
                {[0, 1, 2].map((i) => (
                  <i key={i} className={i === a ? 'is-on' : ''} />
                ))}
              </span>
              <p className="home-why__factText" key={a}>
                {(H.why as Array<{ fact: string }>)[a].fact}
              </p>
            </div>
          )}
          render={(it, i) => (
            <article className="home-why__item glass">
              <span className="tile__n">0{i + 1}</span>
              <h3 className="h3">{it.title}</h3>
              <p className="body">{it.text}</p>
            </article>
          )}
        />
      </section>

      {/* founder — portrait behind glass */}
      <section className="sec sec--paper home-founder" aria-labelledby="founder-h">
        <div className="wrap split">
          <div className="split__sticky">
            <GlassPortrait monogram="MK" label="Доктор Мухит Кулмаганбетов" caption="MD · PhD · AFHEA" />
          </div>
          <div className="stack" style={{ ['--gap' as string]: '1.6rem' }}>
            <p className="eyebrow rv">{H.founderEyebrow}</p>
            <FocusText as="h2" id="founder-h" className="h2" text={H.founderName} />
            <FocusText as="blockquote" className="statement home-founder__q" text={H.founderQuote} />
            <p className="body rv">{H.founderText}</p>
            <div className="rv">
              <TLink to={R.founder} className="btn btn--ghost">
                {H.founderLink} <Arrow />
              </TLink>
            </div>
          </div>
        </div>
      </section>

      {/* centres of excellence — five lenses, five curvatures */}
      <section className="sec sec--solid home-centres" aria-labelledby="centres-h">
        <div className="wrap">
          <SectionHead eyebrow={H.centresEyebrow} title={H.centresTitle} id="centres-h" />
          <ol className="home-centres__list mt-l" role="list">
            {(H.centres as Array<{ title: string; text: string; to: string }>).map((c, i) => (
              <li key={c.title} className="rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <TLink to={mapLink(c.to)} className="home-centre" onPointerMove={trackLight}>
                  <span className="home-centre__n anno">0{i + 1}</span>
                  <LensGlyph curve={CURVES[i]} size={64} className="home-centre__g" />
                  <span className="home-centre__t h3">{c.title}</span>
                  <span className="home-centre__x">{c.text}</span>
                  <span className="home-centre__go" aria-hidden="true">
                    <Arrow />
                  </span>
                </TLink>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* journey — from blur to sharp */}
      <section className="sec sec--sand home-journey" aria-labelledby="journey-h">
        <div className="wrap">
          <SectionHead eyebrow="Как проходит лечение" title="От первого звонка до контрольного осмотра" id="journey-h" text="Пять этапов, прозрачных от первого звонка до контрольного осмотра." />
          <ol className="home-journey__list mt-l" role="list">
            {site.journey.map((j, i) => (
              <li key={j.id} className="home-journey__step rv" style={{ ['--blur' as string]: `${(4 - i) * 1.1}px`, ['--d' as string]: `${i * 0.08}s` }}>
                <span className="home-journey__meter" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <i key={k} className={k <= i ? 'on' : ''} />
                  ))}
                </span>
                <span className="home-journey__n">0{i + 1}</span>
                <h3 className="h3">{j.title}</h3>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
          <p className="anno mt-m home-journey__note">Наведите или сфокусируйтесь на этапе — он станет резким</p>
        </div>
      </section>

      {/* 04 — meniscus: portals for any country */}
      <section className="stage home-portals" data-stage data-el={3} aria-labelledby="portals-h">
        <div className="wrap">
          <ElementTag n={4} of={5} label="мениск" />
          <SectionHead eyebrow={H.portalsEyebrow} title={H.portalsTitle} id="portals-h" />
          <div className="home-portals__grid mt-l">
            {(H.portals as Array<{ title: string; text: string; to: string }>).map((p, i) => (
              <TLink key={p.to} to={p.to} className="home-portal glass rv" style={{ ['--d' as string]: `${i * 0.08}s` }} onPointerMove={trackLight}>
                <span className="home-portal__ring" aria-hidden="true" />
                <span className="h3">{p.title}</span>
                <span className="body">{p.text}</span>
                <span className="tile__foot">
                  Открыть <Arrow />
                </span>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      {/* global experts — deep band */}
      <section className="sec sec--ink home-experts" aria-labelledby="experts-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{H.expertsEyebrow}</p>
            <FocusText as="h2" id="experts-h" className="h2" text={H.expertsTitle} />
            <p className="rv home-experts__text">{H.expertsText}</p>
            <div className="rv">
              <TLink to={R.experts} className="btn btn--light">
                {H.expertsLink} <Arrow />
              </TLink>
            </div>
          </div>
          <div>
            <dl className="home-experts__stats">
              {(H.expertStats as Array<{ value: number; suffix: string; label: string }>).map((s) => (
                <div key={s.label} className="rv">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <Counter className="num" value={s.value} suffix={s.suffix} />
                    <span>{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="home-experts__regions rv" role="list" aria-label="География">
              {(H.regions as string[]).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* knowledge — a strip of the light table */}
      <section className="sec sec--solid home-kb" aria-labelledby="kb-h">
        <div className="wrap">
          <div className="home-kb__head">
            <SectionHead eyebrow={H.knowledgeEyebrow} title={H.knowledgeTitle} text={H.knowledgeText} id="kb-h" />
            <TLink to={R.knowledge} className="link rv">
              {H.knowledgeLink} <Arrow />
            </TLink>
          </div>
          <div className="home-kb__table mt-l">
            {articles.map((a, i) => (
              <TLink key={a.slug} to={`${R.knowledge}/${a.slug}`} className="slide rv" style={{ ['--d' as string]: `${i * 0.08}s`, ['--tilt' as string]: `${(i - 1) * 1.2}deg` }}>
                <span className="slide__mount" aria-hidden="true" />
                <span className="anno">{categoryLabel(a.category)} · {a.readingMinutes} мин</span>
                <span className="h3">{a.title}</span>
                <span className="small muted">{a.excerpt}</span>
                <span className="tile__foot">
                  {H.openMaterial} <Arrow />
                </span>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      {/* science */}
      <section className="sec sec--paper home-science" aria-labelledby="sci-h">
        <div className="wrap">
          <p className="eyebrow rv">{H.scienceEyebrow}</p>
          <FocusText as="h2" id="sci-h" className="statement home-science__t mt-s" text={H.scienceTitle} />
          <div className="home-science__grid mt-l">
            {(H.scienceCols as Array<{ title: string; text: string; to: string }>).map((c) => (
              <TLink key={c.to} to={c.to} className="tile rv">
                <span className="h3">{c.title}</span>
                <p>{c.text}</p>
                <span className="tile__foot">
                  Подробнее <Arrow />
                </span>
              </TLink>
            ))}
            <div className="home-pubs rv">
              <h3 className="anno">{H.publicationsTitle}</h3>
              <ul role="list">
                {PUBS.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} target="_blank" rel="noreferrer">
                      <span className="home-pubs__j">
                        {p.journal} · {p.year}
                      </span>
                      <span className="home-pubs__t">{p.title}</span>
                      <span className="sr-only"> (откроется в новой вкладке)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* stories — honest principles instead of invented reviews */}
      <section className="sec sec--solid home-stories" aria-labelledby="stories-h">
        <div className="wrap split">
          <div className="split__sticky stack">
            <p className="eyebrow rv">{H.storiesEyebrow}</p>
            <FocusText as="h2" id="stories-h" className="h2" text={H.storiesTitle} />
            <p className="body rv">{H.storiesText}</p>
            <TLink to={R.reviews} className="link rv">
              {H.allReviews} <Arrow />
            </TLink>
          </div>
          <ol className="home-stories__list" role="list">
            {(H.storyPrinciples as Array<{ title: string; text: string }>).map((s, i) => (
              <li key={s.title} className="rv">
                <span className="tile__n">0{i + 1}</span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — the ball lens: the eye */}
      <LensCta el={4} title={H.storiesCta} text="Подберём время, врача и формат приёма. Подтверждение придёт в WhatsApp." secondary={{ to: R.contacts, label: 'Контакты' }} />
    </div>
  );
}
