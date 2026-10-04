import { useMemo, useState } from 'react';
import { Chapter } from '../components/Chapter';
import { Consent, SelectField, SubmitButton, Success, TextArea, TextField, useForm, wait } from '../components/form';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { departments, services } from '../lib/data';
import { emailOk, reference, tenge } from '../lib/format';

const STEPS = [
  { shot: 'intl-arcs', t: 'Онлайн-заявка', p: 'Вы заполняете форму и перечисляете документы. Номер заявки появляется сразу после отправки.', m: '10 минут' },
  { shot: 'so-steps', t: 'Медицинское рассмотрение', p: 'Профильный специалист изучает документы и при необходимости назначает онлайн-консультацию.', m: 'срок называет координатор' },
  { shot: 'ground-high', t: 'План лечения', p: 'Вы получаете письменный план: обследования, вмешательство, сроки и смету в тенге и долларах.', m: 'письменно' },
  { shot: 'arrive-1', t: 'Организация поездки', p: 'Приглашение для визы, бронирование жилья, трансфер из аэропорта и переводчик — по вашему выбору.', m: 'по запросу' },
  { shot: 'arrive-4', t: 'Лечение', p: 'Очная диагностика подтверждает план, затем — лечение или операция и контрольный осмотр перед отъездом.', m: '1–5 дней' },
  { shot: 'arrive-5', t: 'Наблюдение после лечения', p: 'Выписка на вашем языке, график контроля и онлайн-связь с врачом, который вас лечил.', m: 'дистанционно' },
];
const WHY = [
  { t: 'Короткая дорога', p: 'Центр находится в Астане — городе с прямыми рейсами из Центральной Азии, с Кавказа, из Турции, с Ближнего Востока и из Европы.' },
  { t: 'Простой въезд', p: 'Для граждан многих стран действует безвизовый режим. Если виза нужна, мы подготовим приглашение на лечение.' },
  { t: 'Прозрачная стоимость', p: 'Услуги оплачиваются по опубликованному прейскуранту центра, а письменную смету вы получаете ещё до поездки.' },
];
const TRAVEL = [
  { t: 'Визовая поддержка', p: 'Проверим, нужна ли вам виза, и при необходимости подготовим официальное приглашение на лечение для консульства — для пациента и сопровождающего.' },
  { t: 'Проживание', p: 'Подберём гостиницу или апартаменты в нескольких минутах от клиники — с учётом бюджета, сопровождающих и восстановления после операции.' },
  { t: 'Транспорт', p: 'Встретим в аэропорту с табличкой, отвезём в отель и на приёмы. После операции за руль садиться нельзя — водитель решает этот вопрос.' },
  { t: 'Услуги перевода', p: 'Приём ведётся на русском, казахском или английском. Для других языков пригласим медицинского переводчика на приёмы и переведём документы.' },
];
const STAY = [
  { v: 'own', l: 'Сам(а) организую', min: 0, max: 0 },
  { v: 'comfort', l: 'Комфорт', min: 20000, max: 32000 },
  { v: 'business', l: 'Бизнес', min: 40000, max: 60000 },
  { v: 'premium', l: 'Премиум', min: 80000, max: 120000 },
];
const FAQ = [
  ['Можно ли приехать без предварительного рассмотрения документов?', 'Можно, но мы не советуем. Предварительное рассмотрение помогает избежать поездки, которая может оказаться ненужной или слишком короткой. Условия рассмотрения координатор сообщит при первом контакте.'],
  ['Насколько точен расчёт на сайте?', 'Калькулятор использует действующие цены прейскуранта и типовые расходы на поездку, но это только ориентир. Точная сумма указывается в письменном плане лечения после медицинского рассмотрения.'],
  ['Можно ли приехать с сопровождающим?', 'Да, а после операции мы даже рекомендуем это. Приглашение для визы и бронирование жилья оформим и на сопровождающего.'],
  ['Когда можно лететь домой после операции?', 'Зависит от вмешательства. После лазерной коррекции и хирургии катаракты перелёт обычно возможен после контрольного осмотра на следующий день или через несколько дней — точный срок назовёт хирург.'],
  ['Что если после возвращения появятся вопросы?', 'Пишите координатору или записывайтесь на онлайн-консультацию к врачу, который вас лечил. Документы и рекомендации доступны в личном кабинете.'],
];

function Estimator({ onUse }: { onUse: (text: string) => void }) {
  const [picked, setPicked] = useState<string[]>(['svc-complex']);
  const [nights, setNights] = useState(3);
  const [stay, setStay] = useState('comfort');
  const tier = STAY.find((s) => s.v === stay)!;
  const medical = useMemo(() => services.filter((s) => picked.includes(s.id)).reduce((a, s) => a + s.price, 0), [picked]);
  const travelMin = tier.min * nights;
  const travelMax = tier.max * nights;
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const summary = `Расчёт с сайта: ${services
    .filter((s) => picked.includes(s.id))
    .map((s) => s.name)
    .join(', ')}; ночей в Астане: ${nights}; проживание: ${tier.l}. Ориентировочно: лечение ${tenge(medical)}${travelMax ? `, проживание ${tenge(travelMin)}–${tenge(travelMax)}` : ''}.`;
  return (
    <div className="grid grid--2" style={{ alignItems: 'start', gap: 'clamp(20px,4vw,56px)' }}>
      <fieldset className="panel" style={{ display: 'grid', gap: 20 }}>
        <legend className="sr-only">Параметры расчёта</legend>
        <div>
          <p className="coord" style={{ margin: '0 0 10px' }}>
            Медицинские услуги
          </p>
          <div style={{ display: 'grid', gap: 14, maxHeight: 360, overflow: 'auto', paddingRight: 6 }}>
            {departments.map((d) => (
              <div key={d.id}>
                <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--gold)' }}>{d.name}</p>
                <div className="chips">
                  {services
                    .filter((s) => s.departmentId === d.id)
                    .map((s) => (
                      <label className="chip" key={s.id}>
                        <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} />
                        <span>
                          {s.name} · <span className="mono">{tenge(s.price)}</span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="est-n">
            Ночей в Астане: <strong className="gold">{nights}</strong>
          </label>
          <input id="est-n" type="range" min={1} max={14} value={nights} onChange={(e) => setNights(+e.target.value)} style={{ accentColor: 'var(--gold)', width: '100%', minHeight: 32 }} />
        </div>
        <fieldset>
          <legend className="coord" style={{ marginBottom: 10 }}>
            Проживание · за ночь
          </legend>
          <div className="chips">
            {STAY.map((s) => (
              <label className="chip" key={s.v}>
                <input type="radio" name="stay" value={s.v} checked={stay === s.v} onChange={() => setStay(s.v)} />
                <span>
                  {s.l}
                  {s.max > 0 && (
                    <span className="mono" style={{ fontSize: 12 }}>
                      {' '}
                      {tenge(s.min)}–{tenge(s.max)}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>
      <div className="panel" aria-live="polite" style={{ position: 'sticky', top: 100 }}>
        <p className="coord" style={{ margin: 0 }}>
          Ориентировочно
        </p>
        {picked.length === 0 ? (
          <p className="lead" style={{ marginTop: 16 }}>
            Отметьте хотя бы одну услугу, чтобы увидеть расчёт.
          </p>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(36px,4vw,56px)', lineHeight: 1.05, margin: '12px 0 6px' }}>
              {tenge(medical + travelMin)}
              {travelMax > travelMin && <span className="muted"> – {tenge(medical + travelMax)}</span>}
            </p>
            <dl className="rows" style={{ margin: '20px 0' }}>
              <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                <dt className="muted">Лечение и диагностика · {picked.length} выбрано</dt>
                <dd className="price" style={{ margin: 0 }}>
                  {tenge(medical)}
                </dd>
              </div>
              <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                <dt className="muted">Проживание · {nights} ноч.</dt>
                <dd className="price" style={{ margin: 0 }}>
                  {travelMax ? `${tenge(travelMin)}–${tenge(travelMax)}` : '—'}
                </dd>
              </div>
              <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                <dt className="muted">Трансфер и переводчик</dt>
                <dd style={{ margin: 0 }} className="coord">
                  по запросу
                </dd>
              </div>
            </dl>
            <button type="button" className="btn btn--ghost" onClick={() => onUse(summary)}>
              Перенести расчёт в заявку
            </button>
          </>
        )}
        <p className="note">Это ориентир, а не счёт. Итоговую стоимость врач определит после медицинского рассмотрения и очного обследования — она будет зафиксирована в письменном плане лечения.</p>
      </div>
    </div>
  );
}

type F = { name: string; country: string; email: string; phone: string; direction: string; comment: string; consent: boolean };

export default function International() {
  const [done, setDone] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const form = useForm<F>({ name: '', country: '', email: '', phone: '', direction: '', comment: '', consent: false }, (v) => ({
    name: v.name.trim().length < 2 ? 'Укажите имя и фамилию' : undefined,
    country: !v.country.trim() ? 'Укажите страну проживания' : undefined,
    email: !emailOk(v.email) ? 'Проверьте e-mail — на него придёт ответ' : undefined,
    direction: !v.direction ? 'Выберите направление' : undefined,
    consent: !v.consent ? 'Нужно согласие на обработку данных' : undefined,
  }));
  const { values: v, set, blur, visible } = form;
  return (
    <Page title="Международным пациентам">
      <Chapter shot="intl-hero" size="hero" label="Прилёт">
        <div className="col col--wide">
          <Eyebrow>Международным пациентам</Eyebrow>
          <SplitTitle as="h1" className="display" text="Лечение в Казахстане *без лишних барьеров*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Мы изучаем документы до вашей поездки, составляем план и смету, помогаем с визой, жильём, трансфером и переводом. Один координатор ведёт вас от первой заявки до наблюдения после возвращения домой.
            </p>
            <div className="actions">
              <a className="btn" href="#intl-form">
                Отправить заявку
              </a>
              <a className="btn btn--ghost" href="#intl-estimate">
                Рассчитать стоимость
              </a>
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="intl-arcs" label="Почему Казахстан">
        <div className="col col--wide">
          <Eyebrow>Почему Казахстан</Eyebrow>
          <SplitTitle text="Близко, понятно *и прозрачно*" />
          <div className="grid grid--3" style={{ marginTop: 12 }}>
            {WHY.map((w, i) => (
              <R key={w.t} d={i * 80}>
                <h3 className="h3" style={{ fontSize: 22 }}>
                  {w.t}
                </h3>
                <p className="body">{w.p}</p>
              </R>
            ))}
          </div>
        </div>
      </Chapter>

      {STEPS.map((s, i) => (
        <Chapter key={s.t} shot={s.shot} size="md" label={`Шаг ${i + 1}`}>
          <div className={`col ${i % 2 ? 'col--right' : ''}`}>
            <p className="coord" data-reveal>
              Путь лечения · шаг {i + 1} из 6 · {s.m}
            </p>
            <SplitTitle text={s.t} />
            <R d={120}>
              <p className="lead">{s.p}</p>
            </R>
          </div>
        </Chapter>
      ))}

      <Chapter shot="arrive-3" pin={false} size="auto" label="Поездка">
        <div className="section__head">
          <div>
            <Eyebrow>Организация поездки</Eyebrow>
            <SplitTitle text="Берём на себя всё, что *не касается медицины*" />
          </div>
          <R>
            <p className="lead">Координатор отвечает на вопросы, согласует даты с врачами, бронирует жильё и трансфер, напоминает о приёмах. Пишите в любое время — отвечаем в рабочие часы по времени Астаны (UTC+5).</p>
          </R>
        </div>
        <div className="grid grid--4">
          {TRAVEL.map((t, i) => (
            <R key={t.t} d={i * 70}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">0{i + 1}</span>
                <h3 className="card__t">{t.t}</h3>
                <p className="card__p">{t.p}</p>
              </div>
            </R>
          ))}
        </div>
      </Chapter>

      <Chapter shot="clinic-section" pin={false} size="auto" label="Расчёт" id="intl-estimate">
        <div className="section__head">
          <div>
            <Eyebrow>Расчёт стоимости</Eyebrow>
            <SplitTitle text="Прикиньте *бюджет поездки*" />
          </div>
          <R>
            <p className="lead">Отметьте услуги и условия поездки — калькулятор покажет ориентировочный диапазон. Цены на услуги взяты из прейскуранта центра; расходы на поездку — типовые диапазоны для Астаны, а не цены клиники.</p>
          </R>
        </div>
        <Estimator
          onUse={(text) => {
            set('comment', text);
            setPrefilled(true);
            document.getElementById('intl-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </Chapter>

      <Chapter shot="home-ascent" pin={false} size="auto" label="Заявка" id="intl-form">
        <div className="grid grid--2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Заявка</Eyebrow>
            <SplitTitle text="Заявка на лечение *в Казахстане*" />
            <R>
              <p className="lead">Расскажите о себе и приложите документы — координатор свяжется с вами в течение рабочего дня, а врач начнёт рассмотрение.</p>
              <ul className="ticks">
                <li>Сразу — номер заявки на экране</li>
                <li>В течение дня — звонок или сообщение координатора</li>
                <li>После рассмотрения — мнение врача и предварительный план</li>
              </ul>
            </R>
            <div className="acc" style={{ marginTop: 48 }}>
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
              <Success title="Координатор свяжется с вами в течение рабочего дня" reference={done}>
                <p className="body">Назовите номер заявки при любом вопросе. Документы координатор запросит по защищённой ссылке.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { form.reset(); setDone(null); }}>
                  Новая заявка
                </button>
              </Success>
            ) : (
              <form
                ref={form.formRef}
                className="form"
                noValidate
                onSubmit={form.submit(async () => {
                  await wait(1100);
                  setDone(reference('INT'));
                })}
              >
                <TextField label="Имя и фамилия" name="name" required autoComplete="name" value={v.name} onValue={(x) => set('name', x)} onBlurField={() => blur('name')} error={visible('name')} />
                <div className="form__row">
                  <TextField label="Страна" name="country" required autoComplete="country-name" value={v.country} onValue={(x) => set('country', x)} onBlurField={() => blur('country')} error={visible('country')} />
                  <TextField label="E-mail" name="email" type="email" required autoComplete="email" value={v.email} onValue={(x) => set('email', x)} onBlurField={() => blur('email')} error={visible('email')} />
                </div>
                <TextField label="Телефон или WhatsApp" name="phone" type="tel" autoComplete="tel" hint="Необязательно — для быстрой связи" value={v.phone} onValue={(x) => set('phone', x)} />
                <SelectField
                  label="Направление"
                  name="direction"
                  required
                  value={v.direction}
                  onValue={(x) => set('direction', x)}
                  onBlurField={() => blur('direction')}
                  error={visible('direction')}
                  options={[{ value: '', label: 'Выберите…' }, ...departments.map((d) => ({ value: d.id, label: d.name })), { value: 'unknown', label: 'Не знаю — нужна консультация' }]}
                />
                <TextArea label="Вопрос и список документов" name="comment" value={v.comment} onValue={(x) => set('comment', x)} hint={prefilled ? 'Расчёт добавлен в комментарий к заявке — проверьте и дополните его.' : 'Выписки, снимки ОКТ, результаты исследований за 6–12 месяцев.'} />
                <Consent checked={v.consent} onChange={(x) => set('consent', x)} error={visible('consent')} />
                <SubmitButton pending={form.pending}>Отправить заявку</SubmitButton>
                <p className="note" style={{ margin: 0 }}>
                  Демо-форма концепта: данные никуда не отправляются.
                </p>
              </form>
            )}
          </div>
        </div>
        <div className="actions" style={{ marginTop: 56 }}>
          <BtnLink to="/consultation" ghost>
            Сначала онлайн-консультация
          </BtnLink>
          <BtnLink to="/second-opinion" ghost>
            Второе мнение по документам
          </BtnLink>
        </div>
      </Chapter>
    </Page>
  );
}
