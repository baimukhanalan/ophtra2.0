import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { C, DEPT_LAYER, DEPT_ORDER, byId, clinic, departments, doctors, fmtPrice, services, site } from '../content';
import { usePage } from '../lib/usePage';
import { setStationOverride } from '../lib/engine';
import type { StationId } from '../lib/stations';
import { IrisLink } from '../lib/nav';
import { Arrow } from '../components/ui';
import { Field, refNumber, validate, type FieldDef } from '../components/forms';

const B = C.services.bookingCopy;

const STEPS: Array<{ key: string; title: string; station: StationId; focus: string }> = [
  { key: 'dept', title: 'Отделение', station: 'approach', focus: 'Размыто' },
  { key: 'service', title: 'Услуга', station: 'cornea', focus: 'Контуры' },
  { key: 'doctor', title: 'Врач', station: 'lens', focus: 'Фокусировка' },
  { key: 'date', title: 'Дата и время', station: 'vitreous', focus: 'Почти резко' },
  { key: 'contacts', title: 'Ваши данные', station: 'retina', focus: 'Резко' },
];

const DAY = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/** Demo availability, deterministic per doctor + day so the grid is stable. */
function slotsFor(date: Date, seed: string): string[] {
  const sunday = date.getDay() === 0;
  const start = sunday ? 9 : 8;
  const end = sunday ? 15 : 20;
  const out: string[] = [];
  let h = 0;
  const key = seed + date.toDateString();
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  for (let t = start * 60; t < end * 60; t += 30) {
    h = (h * 1103515245 + 12345) >>> 0;
    if ((h >>> 16) % 3 === 0) out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  }
  return out;
}

const contactDefs: FieldDef[] = [
  { name: 'name', label: 'Имя и фамилия', required: true, autoComplete: 'name' },
  { name: 'phone', label: 'Телефон (WhatsApp)', type: 'tel', required: true, autoComplete: 'tel', placeholder: '+7 ___ ___ __ __' },
  { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', hint: 'Необязательно — продублируем подтверждение' },
  { name: 'comment', label: 'Комментарий для врача', type: 'textarea' },
  { name: 'consent', label: 'Я согласен на обработку персональных данных', type: 'checkbox', required: true, wide: true },
];

export default function Booking() {
  usePage('Запись на приём', 'approach');
  const [params] = useSearchParams();
  const preService = services.find((s) => s.slug === params.get('service'));
  const preDoctor = doctors.find((d) => d.slug === params.get('doctor'));

  const [step, setStep] = useState(() => (preService ? 2 : preDoctor ? 1 : 0));
  const [dept, setDept] = useState(preService?.departmentId ?? preDoctor?.departmentIds[0] ?? '');
  const [svc, setSvc] = useState(preService?.id ?? '');
  const [doc, setDoc] = useState(preDoctor?.id ?? '');
  const [day, setDay] = useState(0);
  const [time, setTime] = useState('');
  const [vals, setVals] = useState<Record<string, string | boolean>>({ name: '', phone: '', email: '', comment: '', consent: false });
  const [errs, setErrs] = useState<Record<string, string | null>>({});
  const [stepErr, setStepErr] = useState('');
  const [state, setState] = useState<'idle' | 'pending' | 'done'>('idle');
  const [ref, setRef] = useState('');
  const pending = useRef(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const days = useMemo(() => {
    const out: Date[] = [];
    const now = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const deptServices = services.filter((s) => s.departmentId === dept);
  const deptDoctors = doctors.filter((d) => d.departmentIds.includes(dept));
  const slots = useMemo(() => slotsFor(days[day], doc || dept || 'any'), [days, day, doc, dept]);

  // camera follows the wizard: each step brings the image into sharper focus
  useEffect(() => {
    setStationOverride(state === 'done' ? 'macula' : STEPS[step].station);
    return () => setStationOverride(null);
  }, [step, state]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus();
  }, [step, state]);

  const need = (ok: boolean) => {
    if (!ok) {
      setStepErr(B.selectFirst);
      return false;
    }
    setStepErr('');
    return true;
  };

  const next = () => {
    if (step === 0 && !need(!!dept)) return;
    if (step === 1 && !need(!!svc)) return;
    if (step === 3 && !need(!!time)) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => {
    setStepErr('');
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    if (pending.current) return;
    const errors: Record<string, string | null> = {};
    contactDefs.forEach((f) => (errors[f.name] = validate(f, vals[f.name])));
    setErrs(errors);
    const bad = contactDefs.find((f) => errors[f.name]);
    if (bad) {
      document.querySelector<HTMLElement>(`[name="${bad.name}"]`)?.focus();
      return;
    }
    pending.current = true;
    setState('pending');
    await new Promise((r) => setTimeout(r, 1200));
    setRef(refNumber('AP'));
    setState('done');
  };

  const service = byId(services, svc);
  const doctor = byId(doctors, doc);
  const dateLabel = days[day].toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  if (state === 'done') {
    return (
      <section className="book book--done">
        <div className="wrap book__done">
          <p className="hero__layer">
            <span>Слой</span> Макула — изображение в фокусе
          </p>
          <p className="eyebrow">{B.requestNumber}</p>
          <h1 className="display d-xl" ref={headRef} tabIndex={-1}>
            {ref}
          </h1>
          <p className="lead">{vals.email ? B.successTextEmail : B.successTextPhone}</p>
          <dl className="book__sum">
            <div>
              <dt>Услуга</dt>
              <dd>{service?.name}</dd>
            </div>
            <div>
              <dt>Врач</dt>
              <dd>{doctor?.name ?? 'Любой свободный врач'}</dd>
            </div>
            <div>
              <dt>Когда</dt>
              <dd>
                {dateLabel}, {time}
              </dd>
            </div>
            <div>
              <dt>Где</dt>
              <dd>{clinic.address}</dd>
            </div>
          </dl>
          <p className="small">Дизайн-концепт: запись не передана в клинику. {B.whatsappText}</p>
          <div className="btn-row">
            <IrisLink to="/account" className="btn">
              Личный кабинет <Arrow />
            </IrisLink>
            <IrisLink to="/" className="btn btn--ghost">
              На главную
            </IrisLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="book" aria-labelledby="book-h">
      <div className="wrap book__in">
        <aside className="book__aside">
          <p className="hero__layer">
            <span>Слой</span> Фокус — {STEPS[step].focus.toLowerCase()}
          </p>
          <p className="eyebrow">{B.eyebrow}</p>
          <h1 id="book-h" className="display d-l">
            {B.wizardTitle}
          </h1>
          <ol className="book__progress" aria-label="Шаги записи">
            {STEPS.map((s, i) => (
              <li key={s.key} className={i === step ? 'is-on' : i < step ? 'is-past' : ''} aria-current={i === step ? 'step' : undefined}>
                <span>{String(i + 1).padStart(2, '0')}</span> {s.title}
              </li>
            ))}
          </ol>
          <div className="book__lens" aria-hidden="true" style={{ '--f': step / (STEPS.length - 1) } as CSSProperties}>
            <span>Резкость</span>
            <i />
          </div>
          <p className="small">{B.privacyText}</p>
          <p className="small">
            {B.callInstead} <a href={`tel:${site.organization.phoneHref}`}>{site.organization.phone}</a>
          </p>
        </aside>

        <form className="book__panel panel" onSubmit={submit} noValidate aria-busy={state === 'pending'}>
          <p className="small book__of">{B.stepOf.replace('{n}', String(step + 1)).replace('{total}', String(STEPS.length))}</p>
          <h2 className="h2 book__h" ref={headRef} tabIndex={-1}>
            {STEPS[step].title}
          </h2>

          {step === 0 && (
            <fieldset className="opts">
              <legend className="sr-only">Выберите отделение</legend>
              {DEPT_ORDER.map((id) => {
                const d = byId(departments, id)!;
                return (
                  <label key={id} className={`opt ${dept === id ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name="dept"
                      value={id}
                      checked={dept === id}
                      onChange={() => {
                        setDept(id);
                        setSvc('');
                        setDoc('');
                        setTime('');
                        setStepErr('');
                      }}
                    />
                    <span className="opt__t">{d.name}</span>
                    <span className="opt__s">
                      {DEPT_LAYER[id].layer} · {d.short}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="opts">
              <legend className="sr-only">Выберите услугу</legend>
              {deptServices.map((s) => (
                <label key={s.id} className={`opt ${svc === s.id ? 'is-on' : ''}`}>
                  <input type="radio" name="svc" value={s.id} checked={svc === s.id} onChange={() => { setSvc(s.id); setStepErr(''); }} />
                  <span className="opt__t">{s.name}</span>
                  <span className="opt__s">
                    от {fmtPrice(s.price)} · {s.duration} мин
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="opts">
              <legend className="sr-only">Выберите врача</legend>
              <label className={`opt ${doc === '' ? 'is-on' : ''}`}>
                <input type="radio" name="doc" value="" checked={doc === ''} onChange={() => { setDoc(''); setTime(''); }} />
                <span className="opt__t">Любой свободный врач</span>
                <span className="opt__s">Координатор подберёт специалиста по профилю</span>
              </label>
              {deptDoctors.map((d) => (
                <label key={d.id} className={`opt ${doc === d.id ? 'is-on' : ''}`}>
                  <input type="radio" name="doc" value={d.id} checked={doc === d.id} onChange={() => { setDoc(d.id); setTime(''); }} />
                  <span className="opt__t">{d.name}</span>
                  <span className="opt__s">
                    {d.role} · стаж {d.experience} лет
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 3 && (
            <div className="when">
              <fieldset>
                <legend className="h4">Дата</legend>
                <div className="days">
                  {days.map((d, i) => (
                    <label key={i} className={`day ${day === i ? 'is-on' : ''}`}>
                      <input type="radio" name="day" checked={day === i} onChange={() => { setDay(i); setTime(''); }} />
                      <span>{DAY[d.getDay()]}</span>
                      <b>{d.getDate()}</b>
                      <span>{d.toLocaleDateString('ru-RU', { month: 'short' })}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="h4">Время · {dateLabel}</legend>
                {slots.length ? (
                  <div className="slots">
                    {slots.map((t) => (
                      <label key={t} className={`slot ${time === t ? 'is-on' : ''}`}>
                        <input type="radio" name="time" value={t} checked={time === t} onChange={() => { setTime(t); setStepErr(''); }} />
                        {t}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="empty">На выбранную дату свободных слотов нет. Выберите другую дату или другого врача.</p>
                )}
                <p className="small">Слоты демонстрационные. Часы работы: {clinic.schedule}.</p>
              </fieldset>
            </div>
          )}

          {step === 4 && (
            <>
              <div className="form__grid">
                {contactDefs.map((f) => (
                  <Field
                    key={f.name}
                    f={f}
                    value={vals[f.name]}
                    error={errs[f.name]}
                    onChange={(v) => {
                      setVals((s) => ({ ...s, [f.name]: v as string | boolean }));
                      if (errs[f.name]) setErrs((e) => ({ ...e, [f.name]: validate(f, v) }));
                    }}
                    onBlur={() => setErrs((e) => ({ ...e, [f.name]: validate(f, vals[f.name]) }))}
                  />
                ))}
              </div>
              <dl className="book__sum">
                <div>
                  <dt>Услуга</dt>
                  <dd>
                    {service?.name} · от {service && fmtPrice(service.price)}
                  </dd>
                </div>
                <div>
                  <dt>Врач</dt>
                  <dd>{doctor?.name ?? 'Любой свободный врач'}</dd>
                </div>
                <div>
                  <dt>Когда</dt>
                  <dd>
                    {dateLabel}, {time}
                  </dd>
                </div>
              </dl>
            </>
          )}

          {stepErr && (
            <p className="fld__err" role="alert">
              {stepErr}
            </p>
          )}

          <div className="book__nav">
            {step > 0 && (
              <button type="button" className="btn btn--ghost" onClick={back} disabled={state === 'pending'}>
                Назад
              </button>
            )}
            <button type="submit" className="btn" disabled={state === 'pending'}>
              {state === 'pending' ? (
                <>
                  <span className="spin" aria-hidden="true" /> Подтверждаем…
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Подтвердить запись <Arrow />
                </>
              ) : (
                <>
                  Далее <Arrow />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
