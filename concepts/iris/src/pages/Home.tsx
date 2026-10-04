import type { CSSProperties } from 'react';
import { C, METRIC_LABEL, site } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Arrow, Chapter, Counter, Scrub, SectionHead, Split, Station } from '../components/ui';

const H = C.home.homeCopy;
const KI = C.knowledge_articles_index.KNOWLEDGE_INDEX;

const CENTRE_LINK = ['/services/complex-diagnostics', '/services/phacoemulsification', '/services/retina-treatment', '/services/myopia-control', '/science'];
const CENTRE_LAYER = ['Все слои', 'Роговица · хрусталик', 'Сетчатка · макула', 'Растущий глаз', 'Фоторецепторы'];

const BEATS = [
  { layer: 'Радужка', n: '01' },
  { layer: 'Роговица', n: '02' },
  { layer: 'Водянистая влага', n: '03' },
  { layer: 'Хрусталик', n: '04' },
  { layer: 'Стекловидное тело', n: '05' },
];

export default function Home() {
  usePage('Зрение, которому доверяют', 'gaze');
  const why = H.why as Array<{ title: string; text: string; fact: string }>;
  const articles = [...KI].sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      {/* I — the gaze */}
      <section className="home-hero" aria-labelledby="home-title">
        <Station id="gaze" />
        <div className="wrap home-hero__in">
          <p className="home-hero__top" data-reveal>
            <span>{site.organization.legalName}</span>
            <span>Астана</span>
          </p>
          <div className="home-hero__main">
            <p className="eyebrow" data-reveal style={{ '--d': 200 } as CSSProperties}>
              {H.heroEyebrow}
            </p>
            <h1 id="home-title" className="display d-xxl home-hero__title">
              <Split text={H.heroTitle} delay={250} />
              <br />
              <Split text={H.heroAccent} className="home-hero__accent" delay={520} />
            </h1>
          </div>
          <div className="home-hero__foot">
            <p className="lead" data-reveal style={{ '--d': 800 } as CSSProperties}>
              {H.heroText}
            </p>
            <div className="btn-row" data-reveal style={{ '--d': 950 } as CSSProperties}>
              <IrisLink to="/appointment" className="btn">
                {H.ctaBook} <Arrow />
              </IrisLink>
              <IrisLink to="/international-patients" className="btn btn--ghost">
                {H.ctaInternational}
              </IrisLink>
              <IrisLink to="/second-opinion" className="btn btn--ghost">
                {H.ctaSecond}
              </IrisLink>
            </div>
          </div>
        </div>
        <div className="hero__cue" aria-hidden="true">
          <span>{H.scrollHint} — внутрь глаза</span>
          <i />
        </div>
      </section>

      {/* II — through the front of the eye */}
      <Chapter steps={5} stations={['approach', 'cornea', 'aqueous', 'lens', 'vitreous']} className="voyage" label={H.whyTitle}>
        {(active, p) => (
          <div className="wrap voyage__in">
            <div className="voyage__rail" aria-hidden="true">
              {BEATS.map((b, i) => (
                <span key={b.n} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>
                  <b>{b.n}</b> {b.layer}
                </span>
              ))}
              <i style={{ transform: `scaleY(${p})` }} />
            </div>
            <div className="voyage__beats">
              <article className={`beat ${active === 0 ? 'is-on' : ''}`} aria-hidden={active !== 0}>
                <p className="eyebrow">{H.whyEyebrow}</p>
                <h2 className="display d-l">{H.whyTitle}</h2>
                <p className="lead">{H.formula}: опыт, наука и забота. Листайте — зрачок раскрывается, и мы проходим сквозь роговицу.</p>
              </article>
              {why.map((w, i) => (
                <article key={w.title} className={`beat ${active === i + 1 ? 'is-on' : ''}`} aria-hidden={active !== i + 1}>
                  <p className="eyebrow">
                    <b>0{i + 1}</b> {H.formula}
                  </p>
                  <h2 className="display d-l">{w.title}</h2>
                  <p className="lead">{w.text}</p>
                  <p className="beat__fact">{w.fact}</p>
                </article>
              ))}
              <article className={`beat ${active === 4 ? 'is-on' : ''}`} aria-hidden={active !== 4}>
                <p className="eyebrow">{H.missionEyebrow}</p>
                <h2 className="display d-l">{H.mission}</h2>
                <p className="lead">{H.missionText}</p>
              </article>
            </div>
          </div>
        )}
      </Chapter>

      {/* III — retina: numbers */}
      <section className="sect metrics" aria-labelledby="m-title">
        <Station id="retina" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            <b>III</b> Сетчатка — здесь свет становится образом
          </p>
          <h2 id="m-title" className="sr-only">
            Центр в цифрах
          </h2>
          <ul className="metrics__grid">
            {site.metrics.map((m: { id: string; value: number; suffix: string }, i: number) => (
              <li key={m.id} data-reveal style={{ '--d': i * 120 } as CSSProperties}>
                <Counter value={m.value} suffix={m.suffix} className="metrics__n" />
                <span>{METRIC_LABEL[m.id]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* IV — macula: the founder */}
      <section className="sect founder-teaser" aria-labelledby="f-title">
        <Station id="macula" />
        <div className="wrap founder-teaser__in">
          <p className="eyebrow" data-reveal>
            <b>IV</b> Макула · {H.founderEyebrow}
          </p>
          <Split as="h2" className="display d-xl" text={H.founderName} />
          <p id="f-title" className="founder-teaser__cred" data-reveal>
            MD · PhD · AFHEA
          </p>
          <div className="founder-teaser__grid">
            <p className="lead" data-reveal>
              {H.founderText}
            </p>
            <blockquote className="quote" data-reveal style={{ '--d': 200 } as CSSProperties}>
              {H.founderQuote}
            </blockquote>
          </div>
          <IrisLink to="/dr-kulmaganbetov" className="link" data-reveal>
            {H.founderLink} <Arrow />
          </IrisLink>
        </div>
      </section>

      {/* V — every layer: centres of excellence */}
      <section className="sect centres" aria-labelledby="c-title">
        <Station id="micro" />
        <div className="wrap">
          <SectionHead eyebrow={H.centresEyebrow} index="V" title={H.centresTitle} />
          <ol className="centres__list" id="c-title">
            {H.centres.map((c: { title: string; text: string }, i: number) => (
              <li key={c.title} data-reveal style={{ '--d': i * 90 } as CSSProperties}>
                <IrisLink to={CENTRE_LINK[i]} className="centre">
                  <span className="centre__n">0{i + 1}</span>
                  <span className="centre__layer">{CENTRE_LAYER[i]}</span>
                  <span className="centre__t">{c.title}</span>
                  <span className="centre__x">{c.text}</span>
                  <span className="centre__go" aria-hidden="true">
                    <Arrow />
                  </span>
                </IrisLink>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VI — optic disc: global network */}
      <section className="sect experts-teaser" aria-labelledby="e-title">
        <Station id="disc" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={H.expertsEyebrow} index="VI" title={H.expertsTitle} text={H.expertsText} />
            <IrisLink to="/global-experts" className="link" data-reveal>
              {H.expertsLink} <Arrow />
            </IrisLink>
          </div>
          <div className="stat-stack">
            {H.expertStats.map((s: { value: number; label: string }, i: number) => (
              <div key={s.label} className="stat" data-reveal style={{ '--d': i * 120 } as CSSProperties}>
                <Counter value={s.value} className="stat__n" />
                <span>{s.label}</span>
              </div>
            ))}
            <p className="regions" data-reveal>
              {H.regions.join(' · ')}
            </p>
          </div>
        </div>
        <h2 id="e-title" className="sr-only">
          {H.expertsTitle}
        </h2>
      </section>

      {/* VII — optic nerve: portals */}
      <section className="sect portals" aria-labelledby="p-title">
        <Station id="nerve" />
        <div className="wrap">
          <SectionHead eyebrow={H.portalsEyebrow} index="VII" title={H.portalsTitle} />
          <div className="portal-grid" id="p-title">
            {H.portals.map((p: { title: string; text: string; to: string }, i: number) => (
              <IrisLink key={p.title} to={p.to} className="portal" data-reveal style={{ '--d': i * 120 } as CSSProperties}>
                <span className="portal__n">0{i + 1}</span>
                <span className="h3">{p.title}</span>
                <span className="body">{p.text}</span>
                <span className="link">
                  {H.open ?? 'Открыть'} <Arrow />
                </span>
              </IrisLink>
            ))}
          </div>
        </div>
      </section>

      {/* VIII — into the world: knowledge */}
      <section className="sect know-teaser" aria-labelledby="k-title">
        <Station id="nerveFar" />
        <div className="wrap">
          <SectionHead eyebrow={H.knowledgeEyebrow} index="VIII" title={H.knowledgeTitle} text={H.knowledgeText} />
          <ul className="art-grid" id="k-title">
            {articles.map((a: { slug: string; title: string; excerpt: string; readingMinutes: number }, i: number) => (
              <li key={a.slug} data-reveal style={{ '--d': i * 120 } as CSSProperties}>
                <IrisLink to={`/knowledge-base/${a.slug}`} className="art">
                  <span className="small">{a.readingMinutes} мин чтения</span>
                  <span className="h3">{a.title}</span>
                  <span className="body">{a.excerpt}</span>
                </IrisLink>
              </li>
            ))}
          </ul>
          <IrisLink to="/knowledge-base" className="link" data-reveal>
            {H.knowledgeLink} <Arrow />
          </IrisLink>
        </div>
      </section>

      <section className="sect finale" aria-labelledby="fin-title">
        <div className="wrap finale__in">
          <Scrub className="quote finale__q" text={H.scienceTitle} />
          <h2 id="fin-title" className="display d-l" data-reveal>
            Начните с <em>ранней</em> диагностики
          </h2>
          <div className="btn-row" data-reveal>
            <IrisLink to="/appointment" className="btn">
              {H.ctaBook} <Arrow />
            </IrisLink>
            <IrisLink to="/online-consultation" className="btn btn--ghost">
              Онлайн-консультация
            </IrisLink>
          </div>
        </div>
      </section>
    </>
  );
}
