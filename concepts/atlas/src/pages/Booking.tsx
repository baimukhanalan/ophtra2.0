import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Consent, SelectField, TextArea, TextField, useForm, wait } from '../components/form';
import { Page } from '../components/Shell';
import { Eyebrow, SplitTitle } from '../components/ui';
import { clinic, departments, deptById, doctorById, doctors, services } from '../lib/data';
import { emailOk, phoneOk, reference, tenge } from '../lib/format';
import { bridge } from '../world/bridge';
import { DEPT_FLOOR } from '../world/floors';

const STEP_NAMES = ['Направление', 'Услуга', 'Врач', 'Дата и время', 'Контакты', 'Подтверждение'];
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Slots follow the clinic schedule: Mon–Sat 08:00–20:00, Sun 09:00–15:00. Busy slots are simulated. */
function slotsFor(day: Date, duration: number, doctorKey: string) {
  const sun = day.getDay() === 0;
  const start = sun ? 9 * 60 : 8 * 60;
  const end = sun ? 15 * 60 : 20 * 60;
  const out: Array<{ t: string; busy: boolean }> = [];
  const now = new Date();
  for (let m = start; m + duration <= end; m += 30) {
    const t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const dt = new Date(day);
    dt.setHours(Math.floor(m / 60), m % 60, 0, 0);
    const past = dt.getTime() < now.getTime() + 60 * 60 * 1000;
    out.push({ t, busy: past || hash(`${iso(day)}${t}${doctorKey}`) < 0.38 });
  }
  return out;
}

type C = { name: string; phone: string; email: string; lang: string; comment: string; consent: boolean };

export default function Booking() {
  const [params] = useSearchParams();
  const preDoctor = doctors.find((d) => d.slug === params.get('doctor'));
  const preService = services.find((s) => s.slug === params.get('service'));
  const [step, setStep] = useState(preService ? (preDoctor ? 3 : 2) : preDoctor ? 1 : 0);
  const [dept, setDept] = useState(preService?.departmentId ?? preDoctor?.departmentIds[0] ?? '');
  const [svc, setSvc] = useState(preService?.id ?? '');
  const [doc, setDoc] = useState(preDoctor?.id ?? 'any');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const contact = useForm<C>({ name: '', phone: '', email: '', lang: 'ru', comment: '', consent: false }, (v) => ({
    name: v.name.trim().length < 2 ? 'Укажите имя и фамилию' : undefined,
    phone: !phoneOk(v.phone) ? 'Нужен телефон — пришлём подтверждение и напоминания' : undefined,
    email: v.email && !emailOk(v.email) ? 'Проверьте e-mail или оставьте поле пустым' : undefined,
    consent: !v.consent ? 'Нужно согласие на обработку данных' : undefined,
  }));

  // camera: every step walks closer to the entrance; confirmation steps inside
  useEffect(() => {
    const floor = DEPT_FLOOR[dept] ?? 0;
    const shot = done ? `floor-${floor}` : `book-${Math.min(6, step + 1)}`;
    bridge.setOverride({ shot, fx: done ? {} : undefined });
  }, [step, done, dept]);
  useEffect(() => () => bridge.setOverride(null), []);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, done]);

  const service = services.find((s) => s.id === svc);
  const doctor = doc === 'any' ? null : doctorById(doc);
  const days = useMemo(() => {
    const arr: Date[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);
  const dayObj = days.find((d) => iso(d) === day);
  const slots = dayObj && service ? slotsFor(dayObj, service.duration, doc) : [];

  const canNext = [!!dept, !!svc, !!doc, !!day && !!time, Object.values(contact.errors).every((e) => !e), true][step];
  const hint = ['Выберите направление', 'Выберите услугу', 'Выберите врача', 'Выберите день и свободное время', 'Заполните обязательные поля', ''][step];

  const next = () => {
    if (canNext) setStep((s) => Math.min(5, s + 1));
  };
  const confirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    await wait(1200);
    setDone(reference('OPH'));
    setSubmitting(false);
  };
  const deptSvcs = services.filter((s) => s.departmentId === dept);
  const deptDocs = doctors.filter((d) => d.departmentIds.includes(dept));

  return (
    <Page title="Запись на приём">
      <Chapter shot="book-1" pin={false} size="auto" label="Запись">
        <div style={{ paddingTop: 'calc(var(--header-h) - 20px)' }}>
          <Eyebrow>Запись на приём · {clinic.name}</Eyebrow>
          <SplitTitle as="h1" className="h2" text="Шесть шагов *до двери клиники*" />
          <p className="lead">С каждым шагом камера подходит ближе к входу. Подтверждение приходит сразу, напоминание — за сутки и за два часа.</p>
        </div>

        <ol aria-label="Шаги записи" style={{ listStyle: 'none', padding: 0, margin: '8px 0 28px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STEP_NAMES.map((n, i) => (
            <li key={n} aria-current={i === step && !done ? 'step' : undefined}>
              <button
                type="button"
                className="chip-btn"
                aria-pressed={i === step && !done}
                disabled={i > step || !!done}
                onClick={() => setStep(i)}
                style={{ opacity: i > step ? 0.45 : 1, fontSize: 13 }}
              >
                <span className="mono">{String(i + 1).padStart(2, '0')}</span> {n}
                {i < step && !done && <span aria-label="готово"> ✓</span>}
              </button>
            </li>
          ))}
        </ol>

        <div className="grid book-grid">
          <div className="panel" style={{ minHeight: 420 }}>
            {done ? (
              <div role="status">
                <p className="eyebrow">Запись подтверждена</p>
                <h2 className="h3" ref={heading} tabIndex={-1} style={{ outline: 'none' }}>
                  Ждём вас {dayObj?.getDate()} {dayObj && MONTHS[dayObj.getMonth()]} в {time}
                </h2>
                <p>
                  Номер записи: <span className="success__ref">{done}</span>
                </p>
                <p className="body">Подтверждение придёт на {contact.values.phone}. Перенести или отменить запись можно в личном кабинете или в WhatsApp не позднее чем за 3 часа до приёма.</p>
                <p className="coord">
                  {clinic.address} · этаж 0{(DEPT_FLOOR[dept] ?? 0) + 1}
                </p>
                <div className="actions" style={{ marginTop: 20 }}>
                  <Link className="btn" to="/account">
                    Личный кабинет (демо)
                  </Link>
                  <Link className="btn btn--ghost" to="/contacts">
                    Как добраться
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="h3" ref={heading} tabIndex={-1} style={{ outline: 'none' }}>
                  <span className="coord" style={{ display: 'block', marginBottom: 6 }}>
                    Шаг {step + 1} из 6
                  </span>
                  {STEP_NAMES[step]}
                </h2>

                {step === 0 && (
                  <div className="grid grid--2" role="radiogroup" aria-label="Направление">
                    {departments.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        role="radio"
                        aria-checked={dept === d.id}
                        className="card"
                        style={{ textAlign: 'left', cursor: 'pointer', borderColor: dept === d.id ? 'var(--gold)' : undefined, color: 'inherit', font: 'inherit' }}
                        onClick={() => {
                          if (dept !== d.id) {
                            setSvc('');
                            setDoc('any');
                            setTime('');
                          }
                          setDept(d.id);
                        }}
                      >
                        <span className="card__k">Этаж 0{(DEPT_FLOOR[d.id] ?? 0) + 1}</span>
                        <span className="card__t" style={{ fontSize: 20 }}>
                          {d.name}
                        </span>
                        <span className="card__p" style={{ fontSize: 14 }}>
                          {d.short}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <fieldset>
                    <legend className="sr-only">Услуга</legend>
                    <div className="rows">
                      {deptSvcs.map((s) => (
                        <label key={s.id} className="row" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'pointer' }}>
                          <input type="radio" name="svc" checked={svc === s.id} onChange={() => { setSvc(s.id); setTime(''); }} style={{ accentColor: 'var(--gold)', width: 20, height: 20 }} />
                          <span>
                            <span style={{ display: 'block', fontWeight: 500 }}>{s.name}</span>
                            <span className="muted" style={{ fontSize: 14 }}>
                              {s.short} · {s.duration} мин
                            </span>
                          </span>
                          <span className="price">{tenge(s.price)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="sr-only">Врач</legend>
                    <div className="rows">
                      <label className="row" style={{ gridTemplateColumns: 'auto 1fr', cursor: 'pointer' }}>
                        <input type="radio" name="doc" checked={doc === 'any'} onChange={() => { setDoc('any'); setTime(''); }} style={{ accentColor: 'var(--gold)', width: 20, height: 20 }} />
                        <span>
                          <span style={{ display: 'block', fontWeight: 500 }}>Любой свободный врач</span>
                          <span className="muted" style={{ fontSize: 14 }}>
                            Больше свободного времени
                          </span>
                        </span>
                      </label>
                      {deptDocs.map((d) => (
                        <label key={d.id} className="row" style={{ gridTemplateColumns: 'auto 1fr', cursor: 'pointer' }}>
                          <input type="radio" name="doc" checked={doc === d.id} onChange={() => { setDoc(d.id); setTime(''); }} style={{ accentColor: 'var(--gold)', width: 20, height: 20 }} />
                          <span>
                            <span style={{ display: 'block', fontWeight: 500 }}>{d.name}</span>
                            <span className="muted" style={{ fontSize: 14 }}>
                              {d.role} · стаж {d.experience} лет · {d.category}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 3 && (
                  <div className="stack">
                    <fieldset>
                      <legend className="coord" style={{ marginBottom: 10 }}>
                        День
                      </legend>
                      <div className="hscroll" style={{ gridAutoColumns: '76px' }}>
                        {days.map((d) => {
                          const k = iso(d);
                          const sel = day === k;
                          return (
                            <label key={k} className="chip" style={{ display: 'block' }}>
                              <input type="radio" name="day" checked={sel} onChange={() => { setDay(k); setTime(''); }} />
                              <span style={{ flexDirection: 'column', minHeight: 72, width: '100%', justifyContent: 'center', gap: 0, borderRadius: 14 }}>
                                <span className="mono" style={{ fontSize: 11 }}>
                                  {WD[d.getDay()]}
                                </span>
                                <strong style={{ fontSize: 20, fontWeight: 500 }}>{d.getDate()}</strong>
                                <span style={{ fontSize: 11 }}>{MONTHS[d.getMonth()]}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                    {day ? (
                      <fieldset>
                        <legend className="coord" style={{ marginBottom: 10 }}>
                          Время · {slots.filter((s) => !s.busy).length} свободно
                        </legend>
                        {slots.every((s) => s.busy) ? (
                          <p className="body">На этот день свободного времени нет — выберите другой день.</p>
                        ) : (
                          <div className="chips">
                            {slots.map((s) => (
                              <label key={s.t} className="chip">
                                <input type="radio" name="time" disabled={s.busy} checked={time === s.t} onChange={() => setTime(s.t)} aria-label={`${s.t}${s.busy ? ', занято' : ''}`} />
                                <span style={{ opacity: s.busy ? 0.3 : 1, textDecoration: s.busy ? 'line-through' : undefined, cursor: s.busy ? 'not-allowed' : 'pointer' }} className="mono">
                                  {s.t}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                        <p className="note">График центра: {clinic.schedule}. Занятость в концепте смоделирована.</p>
                      </fieldset>
                    ) : (
                      <p className="body">Выберите день, чтобы увидеть свободное время.</p>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <form id="book-contacts" ref={contact.formRef} className="form" noValidate onSubmit={contact.submit(() => setStep(5))}>
                    <TextField label="Имя и фамилия" name="name" required autoComplete="name" value={contact.values.name} onValue={(x) => contact.set('name', x)} onBlurField={() => contact.blur('name')} error={contact.visible('name')} />
                    <div className="form__row">
                      <TextField label="Телефон" name="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="+7" value={contact.values.phone} onValue={(x) => contact.set('phone', x)} onBlurField={() => contact.blur('phone')} error={contact.visible('phone')} />
                      <TextField label="E-mail" name="email" type="email" autoComplete="email" hint="Необязательно" value={contact.values.email} onValue={(x) => contact.set('email', x)} onBlurField={() => contact.blur('email')} error={contact.visible('email')} />
                    </div>
                    <SelectField label="Язык приёма" name="lang" value={contact.values.lang} onValue={(x) => contact.set('lang', x)} options={[{ value: 'ru', label: 'Русский' }, { value: 'kk', label: 'Казахский' }, { value: 'en', label: 'Английский' }]} />
                    <TextArea label="Комментарий" name="comment" value={contact.values.comment} onValue={(x) => contact.set('comment', x)} hint="Например, жалобы или вопросы к врачу" />
                    <Consent checked={contact.values.consent} onChange={(x) => contact.set('consent', x)} error={contact.visible('consent')} />
                  </form>
                )}

                {step === 5 && (
                  <dl className="rows" style={{ margin: 0 }}>
                    {[
                      ['Направление', deptById(dept)?.name, 0],
                      ['Услуга', service ? `${service.name} · ${service.duration} мин` : '', 1],
                      ['Врач', doctor ? doctor.name : 'Любой свободный врач', 2],
                      ['Дата и время', dayObj ? `${WD[dayObj.getDay()]}, ${dayObj.getDate()} ${MONTHS[dayObj.getMonth()]} · ${time}` : '', 3],
                      ['Пациент', `${contact.values.name} · ${contact.values.phone}`, 4],
                    ].map(([k, v, i]) => (
                      <div key={k as string} className="row" style={{ gridTemplateColumns: '150px 1fr auto' }}>
                        <dt className="coord">{k}</dt>
                        <dd style={{ margin: 0 }}>{v}</dd>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep(i as number)}>
                          Изменить<span className="sr-only">: {k}</span>
                        </button>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="actions" style={{ marginTop: 28, alignItems: 'center' }}>
                  {step > 0 && (
                    <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                      Назад
                    </button>
                  )}
                  {step < 5 ? (
                    <button type={step === 4 ? 'submit' : 'button'} form={step === 4 ? 'book-contacts' : undefined} className="btn" onClick={step === 4 ? undefined : next} disabled={!canNext && step !== 4}>
                      Далее
                    </button>
                  ) : (
                    <button type="button" className="btn" onClick={confirm} disabled={submitting} aria-disabled={submitting || undefined}>
                      {submitting ? (
                        <>
                          <span className="spinner" aria-hidden="true" /> Подтверждаем…
                        </>
                      ) : (
                        'Подтвердить запись'
                      )}
                    </button>
                  )}
                  {!canNext && step !== 4 && (
                    <span className="field__hint" aria-live="polite">
                      {hint}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="panel panel--glass book-aside" aria-label="Ваша запись">
            <p className="coord" style={{ marginTop: 0 }}>
              Ваша запись
            </p>
            <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
              <div>
                <dt className="coord">Этаж</dt>
                <dd style={{ margin: 0 }}>{dept ? `0${(DEPT_FLOOR[dept] ?? 0) + 1} · ${deptById(dept)?.name}` : '—'}</dd>
              </div>
              <div>
                <dt className="coord">Услуга</dt>
                <dd style={{ margin: 0 }}>{service?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="coord">Врач</dt>
                <dd style={{ margin: 0 }}>{doctor?.name ?? (step > 2 ? 'Любой свободный' : '—')}</dd>
              </div>
              <div>
                <dt className="coord">Когда</dt>
                <dd style={{ margin: 0 }}>{dayObj && time ? `${dayObj.getDate()} ${MONTHS[dayObj.getMonth()]}, ${time}` : '—'}</dd>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <dt className="coord">Стоимость по прейскуранту</dt>
                <dd className="price" style={{ margin: 0, fontSize: 24 }}>
                  {service ? tenge(service.price) : '—'}
                </dd>
              </div>
            </dl>
            <p className="note">Демо-запись концепта: данные никуда не отправляются.</p>
          </aside>
        </div>
      </Chapter>
    </Page>
  );
}
