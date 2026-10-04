import { useState } from 'react';
import { Chapter } from '../components/Chapter';
import { Consent, Field, SelectField, SubmitButton, Success, TextArea, TextField, useForm, wait } from '../components/form';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { doctors, serviceById } from '../lib/data';
import { emailOk, reference, tenge } from '../lib/format';

const STEPS = [
  { t: 'Заявка пациента', p: 'Вы выбираете платформу и удобную дату, прикладываете документы.' },
  { t: 'Рассмотрение координатором', p: 'Медицинский координатор подбирает врача и подтверждает время с учётом часового пояса.' },
  { t: 'Онлайн-консультация', p: 'Видеосвязь с врачом: разбор документов, ваши вопросы, ответы врача.' },
  { t: 'План лечения', p: 'Письменные рекомендации и, если нужно лечение, — план со сроками и сметой.' },
  { t: 'Визит в клинику', p: 'Приезжаете на подтверждённые даты — обследования и лечение уже согласованы.' },
];
const PLATFORMS = [
  { v: 'zoom', l: 'Zoom', p: 'Работает в браузере и в приложении, удобно показывать документы с экрана.' },
  { v: 'meet', l: 'Google Meet', p: 'Достаточно ссылки и браузера — без установки программ.' },
  { v: 'teams', l: 'Microsoft Teams', p: 'Подойдёт, если вы привыкли к Teams по работе или ваш врач дома его использует.' },
];
const NEEDS = [
  { t: 'Стабильный интернет', p: 'Компьютер или телефон с камерой и микрофоном и связь, на которой не прерывается видео.' },
  { t: 'Свежие документы', p: 'Выписки, снимки ОКТ и результаты исследований за последний год — загрузите их в заявку заранее.' },
  { t: 'Список вопросов', p: 'Запишите, что хотите узнать, и какие лекарства и капли используете.' },
  { t: 'Тихое место', p: 'Хорошее освещение лица и возможность спокойно говорить всю консультацию. Можно подключить родственника.' },
];
const FAQ = [
  ['Можно ли поставить диагноз онлайн?', 'Врач может оценить ваши документы и жалобы, но без осмотра окончательный диагноз не ставится. Консультация помогает понять, какие обследования нужны и есть ли смысл ехать.'],
  ['Что если связь прервётся?', 'Врач попробует подключиться по той же ссылке или связаться в WhatsApp. Если продолжить не получится, координатор предложит другое время.'],
  ['Как перенести или отменить консультацию?', 'Напишите координатору в WhatsApp как можно раньше — подберём другое время.'],
];
const TZ = ['UTC+5 · Астана', 'UTC+3 · Москва, Стамбул', 'UTC+4 · Дубай, Баку, Тбилиси', 'UTC+6 · Бишкек', 'UTC+1 · Европа (центральная)', 'UTC+0 · Лондон', 'UTC+8 · Гонконг, Пекин', 'UTC−5 · Торонто, Нью-Йорк', 'Другой'];

function localTz() {
  const off = -new Date().getTimezoneOffset() / 60;
  const hit = TZ.find((t) => t.startsWith(`UTC${off >= 0 ? '+' : '−'}${Math.abs(off)} `));
  return hit ?? TZ[0];
}

type F = { platform: string; date: string; tz: string; name: string; email: string; phone: string; doctor: string; comment: string; consent: boolean };

export default function Consultation() {
  const price = serviceById('svc-consult')?.price;
  const [done, setDone] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const form = useForm<F>({ platform: 'zoom', date: '', tz: localTz(), name: '', email: '', phone: '', doctor: '', comment: '', consent: false }, (v) => ({
    date: !v.date ? 'Выберите желаемую дату' : v.date < today ? 'Дата уже прошла' : undefined,
    name: v.name.trim().length < 2 ? 'Укажите имя' : undefined,
    email: !emailOk(v.email) ? 'Проверьте e-mail — сюда придёт ссылка' : undefined,
    consent: !v.consent ? 'Нужно согласие на обработку данных' : undefined,
  }));
  const { values: v, set, blur, visible } = form;
  return (
    <Page title="Онлайн-консультация">
      <Chapter shot="oc-hero" size="hero" label="Связь">
        <div className="grid grid--2" style={{ alignItems: 'center', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Онлайн-консультация</Eyebrow>
            <SplitTitle as="h1" className="display" text="Врач на связи — *из любой точки мира*" />
            <R d={250}>
              <p className="lead" style={{ marginTop: 26 }}>
                Поговорите с врачом по видеосвязи из любой точки мира: он изучит ваши документы, ответит на вопросы и предложит план — до того, как вы решите ехать в клинику.
              </p>
              <div className="actions">
                <a className="btn" href="#oc-form">
                  Записаться онлайн
                </a>
                <a className="btn btn--ghost" href="#oc-steps">
                  Как проходит консультация
                </a>
              </div>
            </R>
          </div>
          <R d={400}>
            <div className="panel" aria-hidden="true" style={{ padding: 14, maxWidth: 460, marginLeft: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['Офтальмолог', 'Вы'].map((n, i) => (
                  <div key={n} style={{ aspectRatio: '4/3', borderRadius: 14, background: i ? 'linear-gradient(160deg,#223a32,#0d1a16)' : 'radial-gradient(circle at 50% 40%, rgba(232,194,124,.25), #0d1a16 70%)', display: 'grid', alignItems: 'end', padding: 10, border: '1px solid var(--line-soft)' }}>
                    <span className="coord">{n}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, borderRadius: 14, border: '1px solid var(--line)', padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="coord">Снимок ОКТ · на экране</span>
                <span className="hud__stage" style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '.1em' }}>
                  LIVE
                </span>
              </div>
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="oc-hero" size="md" label="Зачем" align="center">
        <div className="col col--wide">
          <Eyebrow>Зачем это нужно</Eyebrow>
          <SplitTitle className="statement" text="Разговор с врачом — лучший способ понять, нужна ли поездка, *до того как вы купили билет*." />
          <R d={200}>
            <p className="lead" style={{ marginTop: 24 }}>
              Обязательно для международных пациентов: перед поездкой на лечение каждый иностранный пациент проходит онлайн-консультацию. Так врач заранее уточняет показания и план, а вы — сроки и стоимость.
            </p>
            <BtnLink to="/international" ghost>
              Портал для международных пациентов
            </BtnLink>
          </R>
        </div>
      </Chapter>

      <Chapter shot="oc-steps" id="oc-steps" label="Пять шагов">
        <div className="col col--right">
          <Eyebrow>Пять шагов</Eyebrow>
          <SplitTitle text="От заявки *до визита в клинику*" />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <R as="li" key={s.t} d={i * 70}>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </R>
            ))}
          </ol>
        </div>
      </Chapter>

      <Chapter shot="home-return" pin={false} size="auto" label="Подготовка">
        <div className="section__head">
          <div>
            <Eyebrow>Платформы</Eyebrow>
            <SplitTitle text="Там, где *вам привычно*" />
          </div>
          <R>
            <p className="lead">Ссылку на встречу координатор пришлёт в WhatsApp или на e-mail после подтверждения времени.</p>
          </R>
        </div>
        <div className="grid grid--3">
          {PLATFORMS.map((p, i) => (
            <R key={p.v} d={i * 80}>
              <div className="card" style={{ height: '100%' }}>
                <h3 className="card__t">{p.l}</h3>
                <p className="card__p">{p.p}</p>
              </div>
            </R>
          ))}
        </div>
        <div style={{ marginTop: 72 }}>
          <Eyebrow>Что понадобится</Eyebrow>
          <div className="grid grid--4">
            {NEEDS.map((n, i) => (
              <R key={n.t} d={i * 70}>
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{n.t}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {n.p}
                </p>
              </R>
            ))}
          </div>
        </div>
        {price && (
          <R>
            <div className="panel" style={{ marginTop: 56, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}>
              <div>
                <p className="coord" style={{ margin: 0 }}>
                  Стоимость · по прейскуранту
                </p>
                <p style={{ fontFamily: 'var(--f-display)', fontSize: 44, margin: '6px 0 0' }}>{tenge(price)}</p>
              </div>
              <p className="body" style={{ maxWidth: 520, margin: 0 }}>
                Онлайн-консультация оплачивается по тарифу консультации офтальмолога из прейскуранта центра. Итоговую сумму координатор подтвердит вместе со временем встречи. Включено: разбор присланных документов, видеоконсультация, письменные рекомендации.
              </p>
            </div>
          </R>
        )}
      </Chapter>

      <Chapter shot="net-flow" pin={false} size="auto" label="Запись" id="oc-form">
        <div className="grid grid--2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Запись</Eyebrow>
            <SplitTitle text="Записаться *на онлайн-консультацию*" />
            <R>
              <p className="lead">Укажите платформу, желаемую дату и часовой пояс — координатор подтвердит время и пришлёт ссылку.</p>
            </R>
            <div className="acc" style={{ marginTop: 40 }}>
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <div className="acc__body">{a}</div>
                </details>
              ))}
            </div>
          </div>
          <div className="panel">
            {done ? (
              <Success title="Координатор подтвердит время в течение рабочего дня" reference={done}>
                <p className="body">Ссылку на {PLATFORMS.find((p) => p.v === v.platform)?.l} пришлём в WhatsApp или на e-mail перед встречей.</p>
              </Success>
            ) : (
              <form
                ref={form.formRef}
                className="form"
                noValidate
                onSubmit={form.submit(async () => {
                  await wait(1000);
                  setDone(reference('OC'));
                })}
              >
                <fieldset className="field">
                  <legend>Платформа</legend>
                  <div className="chips" style={{ marginTop: 6 }}>
                    {PLATFORMS.map((p) => (
                      <label className="chip" key={p.v}>
                        <input type="radio" name="platform" value={p.v} checked={v.platform === p.v} onChange={() => set('platform', p.v)} />
                        <span>{p.l}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="form__row">
                  <Field label="Желаемая дата" required error={visible('date')}>
                    {({ id, describedBy, invalid }) => (
                      <input id={id} name="date" type="date" min={today} className="input" value={v.date} onChange={(e) => set('date', e.target.value)} onBlur={() => blur('date')} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
                    )}
                  </Field>
                  <SelectField label="Часовой пояс" name="tz" value={v.tz} onValue={(x) => set('tz', x)} options={TZ.map((t) => ({ value: t, label: t }))} />
                </div>
                <TextField label="Имя" name="name" required autoComplete="name" value={v.name} onValue={(x) => set('name', x)} onBlurField={() => blur('name')} error={visible('name')} />
                <div className="form__row">
                  <TextField label="E-mail" name="email" type="email" required autoComplete="email" value={v.email} onValue={(x) => set('email', x)} onBlurField={() => blur('email')} error={visible('email')} />
                  <TextField label="WhatsApp" name="phone" type="tel" autoComplete="tel" value={v.phone} onValue={(x) => set('phone', x)} hint="Необязательно" />
                </div>
                <SelectField label="Врач" name="doctor" value={v.doctor} onValue={(x) => set('doctor', x)} options={[{ value: '', label: 'Подберёт координатор' }, ...doctors.filter((d) => d.acceptsOnline).map((d) => ({ value: d.slug, label: `${d.name} — ${d.role}` }))]} />
                <TextArea label="Вопрос к врачу" name="comment" value={v.comment} onValue={(x) => set('comment', x)} />
                <Consent checked={v.consent} onChange={(x) => set('consent', x)} error={visible('consent')} />
                <SubmitButton pending={form.pending}>Записаться</SubmitButton>
                <p className="note" style={{ margin: 0 }}>
                  Демо-форма концепта: данные никуда не отправляются.
                </p>
              </form>
            )}
          </div>
        </div>
      </Chapter>
    </Page>
  );
}
