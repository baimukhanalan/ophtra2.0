import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import servicesJson from '../content/services.json';
import { byId, bySlug, clinic, departments, doctors, money, services, site } from '../lib/data';
import { reducedMotion } from '../lib/env';
import { PRESETS } from '../lib/presets';
import { scene, useScenePreset } from '../lib/scene-store';
import { gsap } from '../lib/scroll';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { CheckField, TextField, checked, optionalEmail, phoneRule, req, requestNo, useForm } from '../ui/forms';
import { Arrow, usePageTitle } from '../ui/parts';
import { deptShort } from './Services';
import './pages.css';
import './booking.css';

const B = (servicesJson as unknown as { bookingCopy: Record<string, string> }).bookingCopy;

/* Step labels & type copy from the production dictionary (booking.*). */
const STEPS = ['Тип записи', 'Отделение', 'Услуга', 'Врач', 'Дата и время', 'Ваши данные', 'Подтверждение'];
const TYPES = [
  { id: 'consult', title: 'Приём врача', text: 'Консультация офтальмолога, осмотр и назначения.', depts: ['diagnostics', 'treatment', 'pediatric', 'optical'] },
  { id: 'diag', title: 'Диагностика', text: 'Обследование зрения: от базовых замеров до ОКТ и периметрии.', depts: ['diagnostics'] },
  { id: 'surgery', title: 'Операция', text: 'Лазерная коррекция и хирургия катаракты — в главном центре в Астане.', depts: ['laser', 'cataract'] },
];
const CHART = ['Ш', 'Б', 'М', 'Н', 'К', 'Ы', 'М', 'Б', 'Ш'];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const dayLabel = (d: Date) => new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);

function slotsFor(date: Date, doctorId: string) {
  const sunday = date.getDay() === 0;
  const from = sunday ? 9 : 8;
  const to = sunday ? 15 : 20;
  const key = iso(date) + doctorId;
  if (hash(key) % 9 === 0) return [] as string[];
  const out: string[] = [];
  for (let h = from; h < to; h++)
    for (const m of [0, 30]) {
      const t = `${String(h).padStart(2, '0')}:${m ? '30' : '00'}`;
      if (hash(key + t) % 5 < 3) out.push(t);
    }
  return out;
}

export default function Booking() {
  useScenePreset(PRESETS.booking);
  usePageTitle('Онлайн-запись');
  const [params] = useSearchParams();

  const pre = useMemo(() => {
    const s = params.get('service') ? bySlug(services, params.get('service')!) : undefined;
    const d = params.get('doctor') ? bySlug(doctors, params.get('doctor')!) : undefined;
    const dept = s?.departmentId ?? d?.departmentIds[0] ?? '';
    const type = dept ? (TYPES.find((t) => t.depts.includes(dept))?.id ?? 'consult') : '';
    return { type, dept, service: s?.id ?? '', doctor: d?.id ?? '' };
  }, [params]);

  const [type, setType] = useState(pre.type);
  const [dept, setDept] = useState(pre.dept);
  const [service, setService] = useState(pre.service);
  const [doctor, setDoctor] = useState(pre.doctor);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [step, setStep] = useState(() => (pre.service ? (pre.doctor ? 4 : 3) : pre.doctor ? 2 : 0));
  const [done, setDone] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const f = useForm(
    { name: '', phone: '', email: '', consent: '' },
    { name: req('Как к вам обращаться?'), phone: phoneRule, email: optionalEmail, consent: checked('Без согласия запись невозможна') },
  );

  const days = useMemo(() => {
    const out: Date[] = [];
    const base = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const typeDef = TYPES.find((t) => t.id === type);
  const deptList = departments.filter((d) => !typeDef || typeDef.depts.includes(d.id));
  const svcList = services.filter((s) => s.departmentId === dept);
  const docList = doctors.filter((d) => d.departmentIds.includes(dept) && d.acceptsOnline);
  const slots = day ? slotsFor(new Date(day), doctor || 'any') : [];

  const valid = [!!type, !!dept, !!service, !!doctor, !!day && !!time, true, true];
  const reachable = (i: number) => valid.slice(0, i).every(Boolean);
  const progress = done ? 1 : step / (STEPS.length - 1);

  // The aperture in the scene opens as the booking comes into focus.
  useEffect(() => {
    scene.iris = 0.25 + progress * 0.75;
    return () => {
      scene.iris = 1;
    };
  }, [progress]);

  const go = (i: number) => {
    if (i < 0 || i >= STEPS.length || !reachable(i)) return;
    setStep(i);
    const el = panel.current;
    if (el && !reducedMotion) gsap.fromTo(el, { opacity: 0, filter: 'blur(10px)', y: 10 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6, ease: 'expo.out', clearProps: 'filter,transform' });
    requestAnimationFrame(() => el?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true }));
  };

  const onRingKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    let j = i + dir;
    while (j >= 0 && j < STEPS.length && !reachable(j)) j += dir;
    if (j >= 0 && j < STEPS.length) {
      go(j);
      (e.currentTarget.parentElement?.parentElement?.children[j]?.firstElementChild as HTMLElement | null)?.focus();
    }
  };

  const svc = byId(services, service);
  const doc = doctor === 'any' ? null : byId(doctors, doctor);
  const deptObj = byId(departments, dept);

  const choose = <T,>(setter: (v: T) => void, v: T, next: number) => {
    setter(v);
    setTimeout(() => go(next), 180);
  };

  const icsHref = useMemo(() => {
    if (!day || !time || !svc) return '#';
    const [h, m] = time.split(':').map(Number);
    const start = new Date(day);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + svc.duration * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${svc.name}`, `LOCATION:${clinic.address}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }, [day, time, svc]);

  const reset = () => {
    setType('');
    setDept('');
    setService('');
    setDoctor('');
    setDay('');
    setTime('');
    setDone(null);
    f.reset();
    setStep(0);
  };

  const angle = -(step / STEPS.length) * 360;

  return (
    <div className="booking">
      <section className="booking__stage stage" data-stage data-el={0} aria-labelledby="bk-title">
        <div className="wrap booking__grid">
          <div className="booking__dialcol">
            <p className="eyebrow">{B.eyebrow}</p>
            <h1 id="bk-title" className="h2 booking__title">
              {B.wizardTitle}
            </h1>
            <nav className="dial" aria-label="Шаги записи">
              <div className="dial__barrel" aria-hidden="true" style={{ transform: `rotate(${angle}deg)` }}>
                <svg viewBox="0 0 200 200">
                  {Array.from({ length: 120 }, (_, i) => (
                    <line key={i} x1="100" y1="3" x2="100" y2={i % 5 === 0 ? 11 : 7} transform={`rotate(${i * 3} 100 100)`} />
                  ))}
                </svg>
              </div>
              <ol className="dial__steps" role="list" style={{ ['--rot' as string]: `${angle}deg` }}>
                {STEPS.map((s, i) => {
                  const a = (i / STEPS.length) * 360;
                  return (
                    <li key={s} style={{ ['--a' as string]: `${a}deg` }}>
                      <button
                        type="button"
                        className={'dial__step' + (i === step && !done ? ' is-on' : '') + (reachable(i) && valid[i] && i < step ? ' is-done' : '')}
                        aria-current={i === step && !done ? 'step' : undefined}
                        disabled={!reachable(i) || !!done}
                        onClick={() => go(i)}
                        onKeyDown={(e) => onRingKey(e, i)}
                      >
                        <span className="dial__n">{i + 1}</span>
                        <span className="dial__l">{s}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="dial__lens" aria-hidden="true">
                <div className="dial__chart" style={{ filter: reducedMotion ? 'none' : `blur(${(1 - progress) * 7}px)` }}>
                  {CHART.slice(0, 2).join(' ')}
                  <br />
                  {CHART.slice(2, 5).join(' ')}
                  <br />
                  <small>{CHART.slice(5).join(' ')}</small>
                </div>
                <span className="dial__focus">{Math.round(progress * 100)}%</span>
              </div>
            </nav>
            <p className="anno booking__stepof" aria-live="polite">
              {done ? 'Запись оформлена' : B.stepOf.replace('{n}', String(step + 1)).replace('{total}', String(STEPS.length)) + ' · ' + STEPS[step]}
            </p>
          </div>

          <div className="booking__panel glass" ref={panel}>
            {done ? (
              <div className="bk-done" role="status">
                <span className="form-ok__lens" aria-hidden="true" />
                <h2 className="h2" tabIndex={-1}>
                  Запись подтверждена
                </h2>
                <p className="body">{B.successTextPhone}</p>
                <p className="form-ok__no">
                  <span className="anno">Номер записи</span>
                  <strong>{done}</strong>
                </p>
                <dl className="kv">
                  <dt>Услуга</dt>
                  <dd>{svc?.name}</dd>
                  <dt>Врач</dt>
                  <dd>{doc ? doc.name : 'Любой свободный врач'}</dd>
                  <dt>Когда</dt>
                  <dd>
                    {day && dayLabel(new Date(day))}, {time}
                  </dd>
                  <dt>Где</dt>
                  <dd>{clinic.address}</dd>
                </dl>
                <p className="small muted">Концепт: запись не отправляется в клинику, номер сгенерирован для демонстрации.</p>
                <div className="row">
                  <a className="btn btn--ghost btn--sm" href={icsHref} download="ophtra-appointment.ics">
                    Добавить в календарь
                  </a>
                  <button type="button" className="btn btn--sm" onClick={reset}>
                    Новая запись
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <fieldset className="bk-step">
                    <legend className="sr-only">Что вам нужно?</legend>
                    <h2 className="h3" tabIndex={-1}>
                      Что вам нужно?
                    </h2>
                    <div className="bk-options">
                      {TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className="bk-opt"
                          aria-pressed={type === t.id}
                          onClick={() =>
                            choose(
                              (v: string) => {
                                setType(v);
                                if (!t.depts.includes(dept)) {
                                  setDept('');
                                  setService('');
                                  setDoctor('');
                                }
                              },
                              t.id,
                              1,
                            )
                          }
                        >
                          <strong>{t.title}</strong>
                          <span>{t.text}</span>
                        </button>
                      ))}
                    </div>
                    <a className="bk-wa" href={`https://wa.me/${site.organization.whatsapp}`} target="_blank" rel="noreferrer">
                      <strong>Продолжить в WhatsApp</strong>
                      <span>Задайте вопрос врачу или измените запись прямо в переписке.</span>
                    </a>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset className="bk-step">
                    <legend className="sr-only">Выберите отделение</legend>
                    <h2 className="h3" tabIndex={-1}>
                      Выберите отделение
                    </h2>
                    <div className="bk-options">
                      {deptList.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          className="bk-opt"
                          aria-pressed={dept === d.id}
                          onClick={() =>
                            choose(
                              (v: string) => {
                                if (v !== dept) {
                                  setService('');
                                  setDoctor('');
                                }
                                setDept(v);
                              },
                              d.id,
                              2,
                            )
                          }
                        >
                          <strong>{deptShort(d.name)}</strong>
                          <span>{d.short}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset className="bk-step">
                    <legend className="sr-only">Выберите услугу</legend>
                    <h2 className="h3" tabIndex={-1}>
                      Выберите услугу
                    </h2>
                    <div className="bk-options bk-options--list">
                      {svcList.map((s) => (
                        <button key={s.id} type="button" className="bk-opt bk-opt--row" aria-pressed={service === s.id} onClick={() => choose(setService, s.id, 3)}>
                          <strong>{s.name}</strong>
                          <span>
                            {s.duration} мин · от {money(s.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset className="bk-step">
                    <legend className="sr-only">Выберите врача</legend>
                    <h2 className="h3" tabIndex={-1}>
                      Выберите врача
                    </h2>
                    <div className="bk-options bk-options--list">
                      <button type="button" className="bk-opt bk-opt--row" aria-pressed={doctor === 'any'} onClick={() => choose(setDoctor, 'any', 4)}>
                        <strong>Любой свободный врач</strong>
                        <span>Больше свободного времени</span>
                      </button>
                      {docList.map((d) => (
                        <button key={d.id} type="button" className="bk-opt bk-opt--row" aria-pressed={doctor === d.id} onClick={() => choose(setDoctor, d.id, 4)}>
                          <strong>{d.name}</strong>
                          <span>
                            {d.role} · демо-профиль
                          </span>
                        </button>
                      ))}
                    </div>
                    {docList.length === 0 && <p className="body">Онлайн-запись к врачам этого отделения недоступна — выберите «Любой свободный врач» или позвоните.</p>}
                  </fieldset>
                )}

                {step === 4 && (
                  <div className="bk-step">
                    <h2 className="h3" tabIndex={-1}>
                      Выберите дату и время
                    </h2>
                    <div className="bk-days" role="radiogroup" aria-label="Дата">
                      {days.map((d) => {
                        const v = iso(d);
                        return (
                          <button
                            key={v}
                            type="button"
                            role="radio"
                            aria-checked={day === v}
                            className="bk-day"
                            onClick={() => {
                              setDay(v);
                              setTime('');
                            }}
                          >
                            {dayLabel(d)}
                          </button>
                        );
                      })}
                    </div>
                    {!day && <p className="small muted">Сначала выберите дату — покажем свободное время.</p>}
                    {day && slots.length === 0 && (
                      <div className="empty">
                        <p className="h3">На выбранную дату свободных слотов нет</p>
                        <p className="body">Выберите другую дату или другого врача.</p>
                      </div>
                    )}
                    {day && slots.length > 0 && (
                      <div className="bk-times" role="radiogroup" aria-label="Время">
                        {slots.map((t) => (
                          <button key={t} type="button" role="radio" aria-checked={time === t} className="bk-time" onClick={() => setTime(t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="small muted">{clinic.schedule}</p>
                  </div>
                )}

                {step === 5 && (
                  <form
                    id="bk-contacts"
                    className="bk-step form"
                    noValidate
                    onSubmit={(e) => {
                      f.submit()(e);
                      const ok =
                        !!f.values.name.trim() &&
                        !phoneRule(f.values.phone) &&
                        f.values.consent === 'on' &&
                        !optionalEmail(f.values.email);
                      if (ok) go(6);
                    }}
                  >
                    <h2 className="h3" tabIndex={-1}>
                      Ваши данные
                    </h2>
                    <div className="form__row">
                      <TextField f={f.bind('name')} label="Имя и фамилия" autoComplete="name" />
                      <TextField f={f.bind('phone')} label="Телефон (WhatsApp)" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7" />
                    </div>
                    <TextField f={f.bind('email')} label="E-mail" type="email" autoComplete="email" optional />
                    <CheckField f={f.bind('consent')}>Я согласен на обработку персональных данных</CheckField>
                    <p className="small muted">{B.privacyText}</p>
                  </form>
                )}

                {step === 6 && (
                  <div className="bk-step">
                    <h2 className="h3" tabIndex={-1}>
                      Проверьте данные записи
                    </h2>
                    <dl className="kv bk-summary">
                      <dt>Отделение</dt>
                      <dd>{deptObj && deptShort(deptObj.name)}</dd>
                      <dt>Услуга</dt>
                      <dd>
                        {svc?.name} {svc && <span className="muted">· от {money(svc.price)}</span>}
                      </dd>
                      <dt>Врач</dt>
                      <dd>{doc ? doc.name : 'Любой свободный врач'}</dd>
                      <dt>Дата и время</dt>
                      <dd>
                        {day && dayLabel(new Date(day))}, {time}
                      </dd>
                      <dt>Пациент</dt>
                      <dd>
                        {f.values.name}, {f.values.phone}
                      </dd>
                      <dt>Адрес</dt>
                      <dd>{clinic.address}</dd>
                    </dl>
                    <p className="small muted">Подтверждение и напоминания приходят в WhatsApp — за сутки и за два часа до приёма.</p>
                  </div>
                )}

                <BookingNav
                  step={step}
                  canNext={step === 5 ? true : valid[step]}
                  onBack={() => go(step - 1)}
                  formId={step === 5 ? 'bk-contacts' : undefined}
                  onNext={() => go(step + 1)}
                  onConfirm={() => setDone(requestNo('OPH'))}
                />
              </>
            )}
          </div>
        </div>
      </section>
      <section className="sec sec--paper sec--tight">
        <div className="wrap booking__after">
          <p className="small muted">{B.whatsappText}</p>
          <p className="small">
            {B.callInstead}{' '}
            <a href={`tel:${site.organization.phoneHref}`}>{site.organization.phone}</a> ·{' '}
            <TLink to={R.contacts} className="link">
              Контакты <Arrow />
            </TLink>
          </p>
        </div>
      </section>
    </div>
  );
}

function BookingNav({ step, canNext, onBack, onNext, onConfirm, formId }: { step: number; canNext: boolean; onBack: () => void; onNext: () => void; onConfirm: () => void; formId?: string }) {
  const [pending, setPending] = useState(false);
  const last = step === STEPS.length - 1;
  return (
    <div className="bk-nav">
      <button type="button" className="btn btn--ghost btn--sm" onClick={onBack} disabled={step === 0 || pending}>
        Назад
      </button>
      {last ? (
        <button
          type="button"
          className="btn"
          disabled={pending}
          aria-busy={pending}
          onClick={() => {
            if (pending) return;
            setPending(true);
            setTimeout(() => {
              onConfirm();
              setPending(false);
            }, 1100);
          }}
        >
          {pending ? (
            <>
              <span className="spin" aria-hidden="true" /> Подтверждаем…
            </>
          ) : (
            'Подтвердить запись'
          )}
        </button>
      ) : formId ? (
        <button type="submit" form={formId} className="btn">
          Далее <Arrow />
        </button>
      ) : (
        <button type="button" className="btn" onClick={onNext} disabled={!canNext} aria-describedby={!canNext ? 'bk-hint' : undefined}>
          Далее <Arrow />
        </button>
      )}
      {!canNext && !formId && !last && (
        <span id="bk-hint" className="small muted">
          Сначала выберите вариант
        </span>
      )}
    </div>
  );
}
