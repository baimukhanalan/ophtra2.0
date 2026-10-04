import { useRef, useState, type KeyboardEvent } from 'react';
import demoJson from '../content/data/patient-demo.json';
import platformJson from '../content/platform.json';
import { byId, date, doctors, money, services, site } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { SubmitButton, TextField, phoneRule, useForm } from '../ui/forms';
import { Arrow, LensCta, usePageTitle } from '../ui/parts';
import { Converge } from '../ui/Converge';
import './pages.css';
import './misc.css';

const P = platformJson as unknown as {
  accountCopy: Record<string, string>;
  opinionStatuses: Array<{ id: string; label: string; text: string }>;
  demoOpinions: Array<{ id: string; reference: string; topic: string; submitted: string; eta: string; files: number; status: string }>;
};
const AC = P.accountCopy;
const D = demoJson as unknown as {
  patient: { fullName: string; phone: string; email: string };
  appointments: Array<{ id: string; reference: string; serviceId: string; doctorId: string; date: string; time: string; status: string; price: number }>;
  recommendations: Array<{ id: string; doctorId: string; date: string; text: string }>;
  prescriptions: Array<{ id: string; doctorId: string; date: string; title: string; detail: string }>;
  results: Array<{ id: string; date: string; name: string; summary: string; fileName: string }>;
  invoices: Array<{ id: string; number: string; amount: number; status: string; issuedAt: string; kind: string }>;
};

const STATUS: Record<string, string> = { confirmed: AC.statusConfirmed, cancelled: AC.statusCancelled, completed: AC.statusCompleted };
const INV: Record<string, string> = { unpaid: 'К оплате', paid: 'Оплачен', refunded: 'Возврат' };
const TABS = [
  { id: 'apts', label: 'Записи' },
  { id: 'results', label: 'Результаты' },
  { id: 'rx', label: 'Назначения' },
  { id: 'recs', label: 'Рекомендации' },
  { id: 'inv', label: 'Счета' },
  { id: 'op', label: AC.opinionsTab },
];

function Login({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const f = useForm({ phone: '' }, { phone: phoneRule });
  return (
    <div className="acc-login glass">
      <p className="anno">
        {step === 1 ? '1 / 2 · ' + AC.step1 : '2 / 2 · ' + AC.step2}
      </p>
      {step === 1 ? (
        <form className="form" noValidate onSubmit={f.submit(() => setStep(2))}>
          <TextField f={f.bind('phone')} label={AC.step1} type="tel" inputMode="tel" autoComplete="tel" placeholder="+7" />
          <SubmitButton pending={f.status === 'pending'} pendingLabel="Отправляем код…">
            Получить код
          </SubmitButton>
        </form>
      ) : (
        <form
          className="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (pending) return;
            if (!/^\d{4}$/.test(code)) {
              setErr(AC.codeInvalid);
              return;
            }
            setErr(null);
            setPending(true);
            setTimeout(onDone, 900);
          }}
        >
          <div className={'field' + (err ? ' has-error' : '')}>
            <label htmlFor="acc-code" className="field__label">
              {AC.step2}
            </label>
            <input
              id="acc-code"
              className="field__input acc-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              aria-invalid={!!err}
              aria-describedby="acc-code-h"
              autoFocus
            />
            <p id="acc-code-h" className={err ? 'field__err' : 'field__hint'} role={err ? 'alert' : undefined}>
              {err ?? 'Демо: подойдут любые 4 цифры'}
            </p>
          </div>
          <div className="row">
            <SubmitButton pending={pending} pendingLabel="Входим…">
              Войти
            </SubmitButton>
            <button type="button" className="link" onClick={() => setStep(1)}>
              {AC.changePhone}
            </button>
          </div>
        </form>
      )}
      <p className="small muted">{AC.secureNote}</p>
    </div>
  );
}

export default function Account() {
  useScenePreset(PRESETS.account);
  usePageTitle('Личный кабинет');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('apts');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + TABS.length) % TABS.length;
    setTab(TABS[j].id);
    tabRefs.current[j]?.focus();
  };

  return (
    <div className="account">
      <section className="stage acc-stage" data-stage data-el={0} aria-labelledby="acc-h">
        <div className="wrap">
          <p className="eyebrow">Личный кабинет</p>
          <FocusText as="h1" mode="load" id="acc-h" className="h1 acc-title" text={authed ? `${AC.welcome}, ${D.patient.fullName}` : 'История зрения — в одном профиле'} />
          <p className="demo-note mt-m">{AC.demoBanner}</p>

          {!authed ? (
            <div className="acc-auth mt-l">
              <Login onDone={() => setAuthed(true)} />
              <div className="acc-preview" aria-hidden="true">
                {['ОКТ сетчатки', 'Поля зрения', 'Рецепт', 'План наблюдения'].map((t, i) => (
                  <span key={t} className="acc-sheet" style={{ ['--i' as string]: i }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="acc-dash mt-l">
              <div className="acc-tabs" role="tablist" aria-label={AC.menu}>
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={'tab-' + t.id}
                    role="tab"
                    type="button"
                    aria-selected={tab === t.id}
                    aria-controls={'panel-' + t.id}
                    tabIndex={tab === t.id ? 0 : -1}
                    className="acc-tab"
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {t.label}
                  </button>
                ))}
                <button type="button" className="link acc-out" onClick={() => setAuthed(false)}>
                  Выйти
                </button>
              </div>
              <div className="acc-panel glass" role="tabpanel" id={'panel-' + tab} aria-labelledby={'tab-' + tab} tabIndex={0}>
                {tab === 'apts' && (
                  <ul className="acc-list" role="list">
                    {D.appointments.map((a) => (
                      <li key={a.id}>
                        <span className={'acc-status s-' + a.status}>{STATUS[a.status]}</span>
                        <strong>{byId(services, a.serviceId)?.name}</strong>
                        <span className="small muted">
                          {date(a.date)}, {a.time} · {byId(doctors, a.doctorId)?.name} · {a.reference}
                        </span>
                        <span className="small">{money(a.price)}</span>
                      </li>
                    ))}
                    <li>
                      <TLink to={R.booking} className="btn btn--sm">
                        Новая запись <Arrow />
                      </TLink>
                    </li>
                  </ul>
                )}
                {tab === 'results' && (
                  <ul className="acc-list" role="list">
                    {D.results.map((r) => (
                      <li key={r.id}>
                        <strong>{r.name}</strong>
                        <span className="small muted">{date(r.date)}</span>
                        <span className="body">{r.summary}</span>
                        <span className="small">{r.fileName}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'rx' && (
                  <ul className="acc-list" role="list">
                    {D.prescriptions.map((r) => (
                      <li key={r.id}>
                        <strong>{r.title}</strong>
                        <span className="small muted">
                          {date(r.date)} · {byId(doctors, r.doctorId)?.name}
                        </span>
                        <span className="body">{r.detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'recs' && (
                  <ul className="acc-list" role="list">
                    {D.recommendations.map((r) => (
                      <li key={r.id}>
                        <span className="small muted">
                          {date(r.date)} · {byId(doctors, r.doctorId)?.name}
                        </span>
                        <span className="body">{r.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'inv' && (
                  <ul className="acc-list" role="list">
                    {D.invoices.map((v) => (
                      <li key={v.id}>
                        <span className={'acc-status s-' + v.status}>{INV[v.status] ?? v.status}</span>
                        <strong>{v.number}</strong>
                        <span className="small muted">{date(v.issuedAt)}</span>
                        <span className="small">{money(v.amount)}</span>
                      </li>
                    ))}
                    <li className="small muted">Оплата в концепте недоступна.</li>
                  </ul>
                )}
                {tab === 'op' && (
                  <div>
                    <h2 className="h3">{AC.opinionsTitle}</h2>
                    <p className="small muted mt-s">{AC.opinionsLead}</p>
                    <ul className="acc-list mt-m" role="list">
                      {P.demoOpinions.map((o) => {
                        const idx = P.opinionStatuses.findIndex((s) => s.id === o.status);
                        return (
                          <li key={o.id}>
                            <strong>{o.topic}</strong>
                            <span className="small muted">
                              {o.reference} · {AC.submitted} {date(o.submitted)} · {AC.eta} {date(o.eta)} · {AC.files}: {o.files}
                            </span>
                            <span className="acc-track" aria-label={`Статус: ${P.opinionStatuses[idx]?.label}`}>
                              {P.opinionStatuses.map((s, i) => (
                                <i key={s.id} className={i <= idx ? 'on' : ''}>
                                  {s.label}
                                </i>
                              ))}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <TLink to={R.second} className="link mt-m">
                      {AC.newRequest} <Arrow />
                    </TLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="sec sec--solid acc-corr" aria-labelledby="corr-h">
        <div className="wrap">
          <p className="eyebrow rv">Карта пациента</p>
          <FocusText as="h2" id="corr-h" className="h2 mt-s" text="Обследования собираются в одну карту" />
          <p className="body rv mt-s">
            Снимки, поля зрения, замеры давления, рецепты — за годы это превращается в стопку бумаг в разных клиниках.
          </p>
        </div>
        <Converge
          items={site.records}
          core={{ title: 'Карта пациента', meta: 'Один профиль, вся история' }}
          caption="В центре всё это складывается в один цифровой профиль. Врач на приёме видит динамику за все визиты, а не только сегодняшний результат."
        />
      </section>

      <LensCta el={1} title="Запишитесь на консультацию офтальмолога" />
    </div>
  );
}
