import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Eyebrow, R, SplitTitle } from '../components/ui';
import { deptById, doctorById, patientDemo as P, serviceById } from '../lib/data';
import { date, tenge } from '../lib/format';

const TABS = ['Визиты', 'Результаты', 'Назначения', 'Счета'] as const;
const STATUS: Record<string, [string, string]> = {
  confirmed: ['Подтверждён', 'ok'],
  completed: ['Завершён', ''],
  cancelled: ['Отменён', 'warn'],
  paid: ['Оплачен', 'ok'],
  unpaid: ['К оплате', 'warn'],
  refunded: ['Возврат', ''],
};

export default function Account() {
  const [tab, setTab] = useState(0);
  const [apts, setApts] = useState(P.appointments);
  const [confirming, setConfirming] = useState<string | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const i = e.key === 'Home' ? 0 : TABS.length - 1;
      setTab(i);
      refs.current[i]?.focus();
    }
    if (!dir) return;
    e.preventDefault();
    const i = (tab + dir + TABS.length) % TABS.length;
    setTab(i);
    refs.current[i]?.focus();
  };
  const upcoming = apts.filter((a) => a.status === 'confirmed');
  const past = apts.filter((a) => a.status !== 'confirmed');
  const Apt = ({ a }: { a: (typeof apts)[number] }) => {
    const s = serviceById(a.serviceId);
    const d = doctorById(a.doctorId);
    const [label, tone] = STATUS[a.status] ?? [a.status, ''];
    return (
      <li className="row" style={{ gridTemplateColumns: '1.3fr 1fr auto' }}>
        <div>
          <strong style={{ fontWeight: 500 }}>{s?.name}</strong>
          <div className="muted" style={{ fontSize: 14 }}>
            {d?.name} · {deptById(a.departmentId)?.name}
          </div>
          <div className="coord" style={{ marginTop: 4 }}>
            {a.reference}
          </div>
        </div>
        <div>
          <div className="mono">
            {date(a.date)} · {a.time}
          </div>
          <span className={`status status--${tone}`} style={{ marginTop: 6, display: 'inline-block' }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {a.status === 'confirmed' &&
            (confirming === a.id ? (
              <>
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => {
                    setApts((l) => l.map((x) => (x.id === a.id ? { ...x, status: 'cancelled' } : x)));
                    setConfirming(null);
                  }}
                >
                  Да, отменить
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(null)}>
                  Нет
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--ghost btn--sm" to={`/booking?service=${s?.slug ?? ''}`}>
                  Перенести
                </Link>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(a.id)}>
                  Отменить
                </button>
              </>
            ))}
        </div>
      </li>
    );
  };
  return (
    <Page title="Личный кабинет">
      <Chapter shot="account" pin={false} size="auto" label="Кабинет">
        <div style={{ paddingTop: 'calc(var(--header-h) - 20px)' }}>
          <Eyebrow>Личный кабинет · демо</Eyebrow>
          <SplitTitle as="h1" className="h2" text={`Здравствуйте, *${P.patient.fullName.split(' ')[0]}*`} />
          <R d={150}>
            <p className="lead">История визитов, результаты и назначения — в одном месте и доступны лечащему врачу.</p>
            <p className="note" role="note">
              Демонстрационный кабинет с тестовыми данными: действия меняют только эту страницу и сбрасываются при перезагрузке.
            </p>
          </R>
        </div>

        <div className="grid grid--4" style={{ margin: '32px 0 40px' }}>
          {[
            ['Ближайший визит', upcoming[0] ? `${date(upcoming[0].date)}, ${upcoming[0].time}` : 'Нет записей'],
            ['Визитов', String(apts.length)],
            ['Результатов', String(P.results.length)],
            ['К оплате', tenge(P.invoices.filter((i) => i.status === 'unpaid').reduce((a, i) => a + i.amount, 0))],
          ].map(([k, v]) => (
            <div key={k} className="panel panel--glass" style={{ padding: 20 }}>
              <p className="coord" style={{ margin: 0 }}>
                {k}
              </p>
              <p style={{ margin: '6px 0 0', fontFamily: 'var(--f-display)', fontSize: 24 }}>{v}</p>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="tabs" role="tablist" aria-label="Разделы кабинета" onKeyDown={onKey}>
            {TABS.map((t, i) => (
              <button
                key={t}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                role="tab"
                id={`tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`panel-${i}`}
                tabIndex={tab === i ? 0 : -1}
                type="button"
                onClick={() => setTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0}>
            {tab === 0 && (
              <>
                <h2 className="h3" style={{ fontSize: 22 }}>
                  Предстоящие
                </h2>
                {upcoming.length ? (
                  <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {upcoming.map((a) => (
                      <Apt key={a.id} a={a} />
                    ))}
                  </ul>
                ) : (
                  <p className="body">
                    Предстоящих визитов нет. <Link to="/booking">Записаться</Link>
                  </p>
                )}
                <h2 className="h3" style={{ fontSize: 22, marginTop: 36 }}>
                  История
                </h2>
                <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {past.map((a) => (
                    <Apt key={a.id} a={a} />
                  ))}
                </ul>
              </>
            )}
            {tab === 1 && (
              <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {P.results.map((r) => (
                  <li key={r.id} className="row">
                    <div>
                      <strong style={{ fontWeight: 500 }}>{r.name}</strong>
                      <div className="muted" style={{ fontSize: 14 }}>
                        {r.summary}
                      </div>
                    </div>
                    <span className="mono">{date(r.date)}</span>
                    <span className="tag" title="В демо файл недоступен">
                      {r.fileName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {tab === 2 && (
              <div className="grid grid--2">
                {P.prescriptions.map((p) => (
                  <div key={p.id} className="card">
                    <span className="card__k">
                      Назначение · {date(p.date)} · {doctorById(p.doctorId)?.name}
                    </span>
                    <h3 className="card__t" style={{ fontSize: 20 }}>
                      {p.title}
                    </h3>
                    <p className="card__p">{p.detail}</p>
                  </div>
                ))}
                {P.recommendations.map((r) => (
                  <div key={r.id} className="card">
                    <span className="card__k">
                      Рекомендация · {date(r.date)} · {doctorById(r.doctorId)?.name}
                    </span>
                    <p className="card__p" style={{ color: 'var(--cream)' }}>
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {tab === 3 && (
              <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {P.invoices.map((inv) => {
                  const [label, tone] = STATUS[inv.status] ?? [inv.status, ''];
                  return (
                    <li key={inv.id} className="row">
                      <div>
                        <strong className="mono" style={{ fontWeight: 500 }}>
                          {inv.number}
                        </strong>
                        <div className="muted" style={{ fontSize: 14 }}>
                          {inv.kind === 'prepayment' ? 'Предоплата' : 'Услуга'} · {date(inv.issuedAt)}
                        </div>
                      </div>
                      <span className="price">{tenge(inv.amount)}</span>
                      <span className={`status status--${tone}`}>{label}</span>
                    </li>
                  );
                })}
                <li className="note" style={{ paddingTop: 12 }}>
                  Оплата в демо-кабинете отключена.
                </li>
              </ul>
            )}
          </div>
        </div>
      </Chapter>
    </Page>
  );
}
