import { useEffect, useRef, useState, type FormEvent } from 'react';
import { C, byId, departments, doctors, fmtDate, fmtPrice, patientDemo, services } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { refreshMarkers, setStationOverride } from '../lib/engine';
import { Arrow, Station } from '../components/ui';

const AC = C.platform.accountCopy;
const OPS = C.platform.demoOpinions as Array<{ id: string; reference: string; topic: string; submitted: string; eta: string; files: number; status: string }>;
const OPST = C.platform.opinionStatuses as Array<{ id: string; label: string; text: string }>;

const STATUS: Record<string, string> = { confirmed: AC.statusConfirmed, cancelled: AC.statusCancelled, completed: AC.statusCompleted };
const TABS = [
  { id: 'visits', label: 'Записи' },
  { id: 'results', label: 'Результаты' },
  { id: 'care', label: 'Назначения' },
  { id: 'bills', label: 'Счета' },
  { id: 'opinions', label: 'Второе мнение' },
] as const;
type Tab = (typeof TABS)[number]['id'];

function Login({ onIn }: { onIn: () => void }) {
  const [phase, setPhase] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [demo, setDemo] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (phone.replace(/\D/g, '').length < 10) {
      setErr('Укажите номер полностью, с кодом страны');
      return;
    }
    setErr('');
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setDemo(String(Math.floor(1000 + Math.random() * 9000)));
    setPhase('code');
    setBusy(false);
    requestAnimationFrame(() => codeRef.current?.focus());
  };
  const verify = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!/^\d{4}$/.test(code)) {
      setErr(AC.codeInvalid);
      return;
    }
    if (code !== demo) {
      setErr('Код не совпадает — проверьте цифры');
      return;
    }
    setErr('');
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    onIn();
  };

  return (
    <div className="login panel">
      <p className="eyebrow">{phase === 'phone' ? `01 · ${AC.step1}` : `02 · ${AC.step2}`}</p>
      <h2 className="h2">Вход в кабинет</h2>
      {phase === 'phone' ? (
        <form onSubmit={sendCode} noValidate className="form">
          <div className={`fld ${err ? 'has-err' : ''}`}>
            <label htmlFor="acc-phone">Номер телефона</label>
            <input
              id="acc-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 ___ ___ __ __"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!err || undefined}
              aria-describedby={err ? 'acc-err' : undefined}
            />
            {err && (
              <p id="acc-err" className="fld__err" role="alert">
                {err}
              </p>
            )}
          </div>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? <span className="spin" aria-hidden="true" /> : null} Получить код
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="form">
          <p className="notice" role="status">
            Демонстрационный режим: SMS не отправляется. Ваш код — <b className="login__code">{demo}</b>
          </p>
          <div className={`fld ${err ? 'has-err' : ''}`}>
            <label htmlFor="acc-code">Код из сообщения</label>
            <input
              ref={codeRef}
              id="acc-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              aria-invalid={!!err || undefined}
              aria-describedby={err ? 'acc-err2' : undefined}
            />
            {err && (
              <p id="acc-err2" className="fld__err" role="alert">
                {err}
              </p>
            )}
          </div>
          <div className="btn-row">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? <span className="spin" aria-hidden="true" /> : null} Подтвердить
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => { setPhase('phone'); setCode(''); setErr(''); }}>
              {AC.changePhone}
            </button>
          </div>
        </form>
      )}
      <p className="small">{AC.secureNote}</p>
    </div>
  );
}

export default function Account() {
  usePage('Личный кабинет', 'retina');
  const [signed, setSigned] = useState(false);
  const [tab, setTab] = useState<Tab>('visits');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const P = patientDemo;

  useEffect(() => {
    setStationOverride(signed ? 'macula' : null);
    requestAnimationFrame(refreshMarkers);
    return () => setStationOverride(null);
  }, [signed]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    tabRefs.current[TABS[n].id]?.focus();
  };

  return (
    <section className="acc-page">
      <Station id="retina" />
      <div className="wrap">
        <p className="hero__layer">
          <span>Слой</span> Сетчатка — ваша личная карта
        </p>
        <h1 className="display d-l">{signed ? `${AC.welcome}, ${P.patient.fullName.split(' ')[0]}` : 'Личный кабинет'}</h1>
        <p className="notice acc-page__demo">{AC.demoBanner} Все данные ниже — демонстрационные.</p>

        {!signed ? (
          <div className="split-2 acc-page__login">
            <p className="lead">Записи, результаты обследований, назначения врача, счета и статусы второго мнения — в одном месте.</p>
            <Login onIn={() => setSigned(true)} />
          </div>
        ) : (
          <div className="dash">
            <div className="dash__tabs" role="tablist" aria-label={AC.menu}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => (tabRefs.current[t.id] = el)}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  className="chip"
                  aria-pressed={undefined}
                  data-on={tab === t.id || undefined}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {t.label}
                </button>
              ))}
              <button type="button" className="chip dash__out" onClick={() => setSigned(false)}>
                Выйти
              </button>
            </div>

            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="dash__panel" tabIndex={0}>
              {tab === 'visits' && (
                <ul className="dash__list">
                  {P.appointments.map((a: { id: string; reference: string; serviceId: string; doctorId: string; departmentId: string; date: string; time: string; status: string; price: number }) => (
                    <li key={a.id} className="card dash__row">
                      <span className={`pill pill--${a.status}`}>{STATUS[a.status] ?? a.status}</span>
                      <span className="h4">{byId(services, a.serviceId)?.name}</span>
                      <span className="small">
                        {fmtDate(a.date)}, {a.time} · {byId(doctors, a.doctorId)?.name} · {byId(departments, a.departmentId)?.name}
                      </span>
                      <span className="small">
                        № {a.reference} · {fmtPrice(a.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'results' && (
                <ul className="dash__list">
                  {P.results.map((r: { id: string; date: string; name: string; summary: string; fileName: string }) => (
                    <li key={r.id} className="card dash__row">
                      <span className="h4">{r.name}</span>
                      <span className="small">{fmtDate(r.date)}</span>
                      <span className="body">{r.summary}</span>
                      <button type="button" className="btn btn--sm btn--ghost" aria-disabled="true" title="В демо-режиме файлы не загружаются">
                        {r.fileName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'care' && (
                <ul className="dash__list">
                  {P.prescriptions.map((p: { id: string; date: string; title: string; detail: string; doctorId: string }) => (
                    <li key={p.id} className="card dash__row">
                      <span className="tag">Назначение</span>
                      <span className="h4">{p.title}</span>
                      <span className="body">{p.detail}</span>
                      <span className="small">
                        {byId(doctors, p.doctorId)?.name} · {fmtDate(p.date)}
                      </span>
                    </li>
                  ))}
                  {P.recommendations.map((r: { id: string; date: string; text: string; doctorId: string }) => (
                    <li key={r.id} className="card dash__row">
                      <span className="tag">Рекомендация</span>
                      <span className="body">{r.text}</span>
                      <span className="small">
                        {byId(doctors, r.doctorId)?.name} · {fmtDate(r.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'bills' && (
                <table className="bills">
                  <caption className="sr-only">Счета</caption>
                  <thead>
                    <tr>
                      <th scope="col">Номер</th>
                      <th scope="col">Дата</th>
                      <th scope="col">Сумма</th>
                      <th scope="col">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {P.invoices.map((i: { id: string; number: string; issuedAt: string; amount: number; status: string }) => (
                      <tr key={i.id}>
                        <td>{i.number}</td>
                        <td>{fmtDate(i.issuedAt.slice(0, 10))}</td>
                        <td>{fmtPrice(i.amount)}</td>
                        <td>
                          <span className={`pill pill--${i.status}`}>{i.status === 'paid' ? 'Оплачено' : i.status === 'unpaid' ? 'Ожидает оплаты' : i.status === 'refunded' ? 'Возврат' : i.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === 'opinions' && (
                <>
                  <p className="body">{AC.opinionsLead}</p>
                  <ul className="dash__list">
                    {OPS.map((o) => {
                      const idx = OPST.findIndex((s) => s.id === o.status);
                      return (
                        <li key={o.id} className="card dash__row">
                          <span className="h4">{o.topic}</span>
                          <span className="small">
                            № {o.reference} · {AC.submitted} {fmtDate(o.submitted)} · {AC.eta} {fmtDate(o.eta)} · {AC.files}: {o.files}
                          </span>
                          <ol className="status-card__track">
                            {OPST.map((s, i) => (
                              <li key={s.id} className={i < idx ? 'is-done' : i === idx ? 'is-now' : ''}>
                                <span>{s.label}</span>
                              </li>
                            ))}
                          </ol>
                        </li>
                      );
                    })}
                  </ul>
                  <IrisLink to="/second-opinion" className="link">
                    {AC.newRequest} <Arrow />
                  </IrisLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
