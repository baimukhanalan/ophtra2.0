import { useState } from 'react';
import networkJson from '../content/network.json';
import { LANG_NAME } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { AreaField, CheckField, FormSuccess, SelectField, SubmitButton, TextField, checked, emailRule, req, requestNo, useForm } from '../ui/forms';
import { Arrow, ElementTag, Hero, JumpLink, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import { RouteMap, type MapPoint } from '../ui/RouteMap';
import './pages.css';
import './portals.css';
import './experts.css';

const N = networkJson as unknown as Record<string, any>;
const E = N.EXPERTS as Record<string, any>;
type Country = { id: string; region: string; name: string; lat: number; lng: number; hub?: boolean };
type Expert = { id: string; code: string; country: string; subspecialty: string; formats: string[]; focus: string; languages: string[] };

function JoinForm() {
  const [no, setNo] = useState('');
  const countries = (N.NETWORK_COUNTRIES as Country[]).map((c) => ({ value: c.id, label: c.name }));
  const f = useForm(
    { name: '', email: '', country: '', sub: '', format: '', profile: '', comment: '', consent: '' },
    { name: req('Укажите имя'), email: emailRule, country: req('Выберите страну'), sub: req('Выберите субспециализацию'), consent: checked() },
  );
  if (f.status === 'done')
    return (
      <div className="glass">
        <FormSuccess title="Заявка отправлена" text="Мы свяжемся с вами по e-mail после проверки квалификации." number={no} onReset={() => f.reset()} />
      </div>
    );
  return (
    <form className="form glass form-card" noValidate onSubmit={f.submit(() => setNo(requestNo('EXP')))}>
      <div className="form__row">
        <TextField f={f.bind('name')} label="Имя и фамилия" autoComplete="name" />
        <TextField f={f.bind('email')} label="E-mail" type="email" autoComplete="email" />
      </div>
      <div className="form__row">
        <SelectField f={f.bind('country')} label={E.fieldCountry} options={[...countries, { value: 'other', label: 'Другая страна' }]} />
        <SelectField f={f.bind('sub')} label={E.fieldSubspecialty} options={N.SUBSPECIALTIES} />
      </div>
      <SelectField f={f.bind('format')} label={E.fieldFormat} options={(N.NETWORK_FORMATS as Array<{ id: string; title: string }>).map((x) => ({ value: x.id, label: x.title }))} optional />
      <TextField f={f.bind('profile')} label={E.fieldProfile} hint={E.fieldProfileHint} type="url" optional />
      <AreaField f={f.bind('comment')} label={E.commentLabel} optional rows={3} />
      <CheckField f={f.bind('consent')}>Я согласен на обработку персональных данных</CheckField>
      <div className="row">
        <SubmitButton pending={f.status === 'pending'}>{E.joinSubmit}</SubmitButton>
      </div>
    </form>
  );
}

export default function Experts() {
  useScenePreset(PRESETS.experts);
  usePageTitle('Сеть глобальных экспертов');
  const [region, setRegion] = useState('all');
  const countries = N.NETWORK_COUNTRIES as Country[];
  const byCountry = (id: string) => countries.find((c) => c.id === id);
  const experts = (N.DEMO_EXPERTS as Expert[]).filter((x) => region === 'all' || byCountry(x.country)?.region === region);
  const subLabel = (v: string) => (N.SUBSPECIALTIES as Array<{ value: string; label: string }>).find((s) => s.value === v)?.label ?? v;
  const fmtLabel = (v: string) => (N.NETWORK_FORMATS as Array<{ id: string; title: string }>).find((s) => s.id === v)?.title ?? v;
  const points: MapPoint[] = countries.map((c) => ({ id: c.id, lat: c.lat, lng: c.lng, name: c.name, hub: c.hub, note: c.hub ? E.hub : undefined }));
  const activeCountries = region === 'all' ? null : countries.filter((c) => c.region === region).map((c) => c.id);

  return (
    <div className="experts">
      <Hero
        eyebrow={E.eyebrow}
        title="Сложный случай обсуждается не в одиночку"
        accent={[3, 4]}
        lead={E.lead}
        tag="Сеть шаровых линз · Элементы 01–03"
        actions={
          <>
            <JumpLink to="join" className="btn">
              {E.join} <Arrow />
            </JumpLink>
            <TLink to={R.second} className="btn btn--ghost">
              {E.toSecondOpinion}
            </TLink>
          </>
        }
      />

      <section className="sec sec--solid" aria-labelledby="model-h">
        <div className="wrap">
          <SectionHead eyebrow={E.modelEyebrow} title={E.modelTitle} text={E.modelText} id="model-h" />
          <div className="formats mt-l">
            {(N.NETWORK_FORMATS as Array<{ id: string; title: string; text: string; points: string[] }>).map((x, i) => (
              <article key={x.id} className="format rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <span className="format__lens" aria-hidden="true" style={{ ['--k' as string]: i }} />
                <h3 className="h3">{x.title}</h3>
                <p className="body">{x.text}</p>
                <ul className="list-dots small">
                  {x.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="map-h">
        <div className="wrap">
          <SectionHead eyebrow={E.mapEyebrow} title={E.mapTitle} text={E.mapText} id="map-h" />
          <div className="filters mt-m" role="group" aria-label={E.countries}>
            <button type="button" className="filter" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>
              {E.allRegions}
            </button>
            {(N.NETWORK_REGIONS as Array<{ id: string; name: string }>).map((r) => (
              <button key={r.id} type="button" className="filter" aria-pressed={region === r.id} onClick={() => setRegion(r.id)}>
                {r.name}
              </button>
            ))}
          </div>
          <div className="mt-m rv">
            <RouteMap points={points} label={E.mapLabel} active={activeCountries && activeCountries.length === 1 ? activeCountries[0] : null} />
          </div>
        </div>
      </section>

      <section className="stage exp-profiles" data-stage data-el={3} aria-labelledby="prof-h">
        <div className="wrap">
          <ElementTag n={4} of={5} label="собирающая линза" />
          <SectionHead eyebrow={E.profilesEyebrow} title={E.profilesTitle} id="prof-h" />
          <p className="demo-note mt-m rv">{E.profilesNote}</p>
          {experts.length === 0 ? (
            <div className="empty mt-m">
              <p className="h3">{E.noProfiles}</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setRegion('all')}>
                {E.allRegions}
              </button>
            </div>
          ) : (
            <ul className="exp-grid mt-l" role="list">
              {experts.map((x) => (
                <li key={x.id} className="exp glass rv">
                  <span className="exp__code" aria-hidden="true">
                    {x.code}
                  </span>
                  <span className="anno">
                    {E.expertName} {x.code} · {byCountry(x.country)?.name}
                  </span>
                  <h3 className="h3">{subLabel(x.subspecialty)}</h3>
                  <p className="body">{x.focus}</p>
                  <p className="small muted">
                    {x.formats.map(fmtLabel).join(' · ')} · {x.languages.map((l) => LANG_NAME[l] ?? l).join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="flow-h">
        <div className="wrap">
          <p className="eyebrow rv">{E.flowEyebrow}</p>
          <FocusText as="h2" id="flow-h" className="h2 exp-light mt-s" text={E.flowTitle} />
          <ol className="exp-flow mt-l" role="list">
            {(E.flow as Array<{ title: string; text: string }>).map((s, i) => (
              <li key={s.title} className="rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <span className="exp-flow__n">0{i + 1}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <FocusText as="p" className="statement mt-xl exp-light" text={E.flowStatement} />
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="std-h">
        <div className="wrap">
          <SectionHead eyebrow={E.standardsEyebrow} title={E.standardsTitle} id="std-h" />
          <div className="tiles mt-l">
            {(E.standards as Array<{ title: string; text: string }>).map((s, i) => (
              <article key={s.title} className="tile rv">
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--sand" id="join" aria-labelledby="join-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{E.joinEyebrow}</p>
            <FocusText as="h2" id="join-h" className="h2" text={E.joinTitle} />
            <p className="body rv">{E.joinText}</p>
          </div>
          <JoinForm />
        </div>
      </section>

      <LensCta el={4} title="Получить второе мнение по документам" primary={{ to: R.second, label: E.toSecondOpinion }} secondary={{ to: R.founder, label: 'Об основателе' }} />
    </div>
  );
}
