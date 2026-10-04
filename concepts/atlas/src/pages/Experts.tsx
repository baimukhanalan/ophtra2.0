import { useState } from 'react';
import { Chapter } from '../components/Chapter';
import { Consent, SelectField, SubmitButton, Success, TextArea, TextField, useForm, wait } from '../components/form';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { emailOk, reference } from '../lib/format';

const FORMATS = [
  { t: 'Научно-консультативный совет', p: 'Международные специалисты рецензируют клинические протоколы центра, оценивают исследовательские проекты и помогают выбирать новые технологии.', l: ['Ежегодный пересмотр протоколов', 'Рецензия исследований', 'Независимый взгляд на качество'] },
  { t: 'Приглашённые хирурги', p: 'Хирурги зарубежных центров оперируют вместе с командой центра в сложных случаях, проводят мастер-классы и разбирают результаты.', l: ['Совместные операции', 'Мастер-классы для врачей', 'Разбор отдалённых результатов'] },
  { t: 'Панель телеконсультаций', p: 'Субспециалисты подключаются дистанционно: изучают ОКТ, поля зрения и историю болезни и дают письменное заключение.', l: ['Второе мнение по документам', 'Онлайн-консилиум', 'Ответ на языке пациента'] },
  { t: 'Исследовательские партнёры', p: 'Университеты и лаборатории, с которыми центр ведёт совместные исследования, публикации и обучение врачей.', l: ['Совместные проекты', 'Публикации и данные', 'Стажировки'] },
];
const SUBSPEC = [
  ['Сетчатка и макула', 'Возрастная макулярная дегенерация, ОКТ-ангиография'],
  ['Роговица и рефракция', 'Кератоконус, пересадка роговицы'],
  ['ИИ и визуальные науки', 'Автоматический скрининг диабетической ретинопатии'],
  ['Глаукома', 'Ранняя диагностика глаукомы, периметрия'],
  ['Окулопластика', 'Реконструктивная хирургия век и орбиты'],
  ['Детская офтальмология', 'Контроль прогрессирования миопии у детей'],
  ['Нейроофтальмология', 'Заболевания зрительного нерва'],
  ['Хирургия катаракты', 'Сложная хирургия катаракты, премиальные ИОЛ'],
];
const FLOW = [
  { t: 'Вопрос врача', p: 'Лечащий врач формулирует клинический вопрос и цель консультации.' },
  { t: 'Подготовка данных', p: 'Координатор собирает снимки, анализы и историю и обезличивает их.' },
  { t: 'Подбор эксперта', p: 'Эксперт выбирается по субспециализации, без конфликта интересов.' },
  { t: 'Разбор случая', p: 'Онлайн-консилиум с лечащим врачом или письменный разбор документов.' },
  { t: 'Заключение', p: 'Письменное заключение на языке пациента и обсуждение плана с врачом.' },
];
const STANDARDS = [
  { t: 'Проверка квалификации', p: 'Лицензия, место работы и субспециализация проверяются до первого случая.' },
  { t: 'Раскрытие интересов', p: 'Эксперт сообщает о связях с производителями и не продвигает конкретные изделия.' },
  { t: 'Защита данных', p: 'Эксперт видит только обезличенные данные, необходимые для ответа.' },
  { t: 'Понятный ответ', p: 'Заключение переводится и объясняется пациенту простым языком.' },
];

type F = { name: string; email: string; country: string; sub: string; format: string; profile: string; comment: string; consent: boolean };

export default function Experts() {
  const [done, setDone] = useState<string | null>(null);
  const form = useForm<F>({ name: '', email: '', country: '', sub: '', format: '', profile: '', comment: '', consent: false }, (v) => ({
    name: v.name.trim().length < 2 ? 'Укажите имя' : undefined,
    email: !emailOk(v.email) ? 'Проверьте e-mail' : undefined,
    country: !v.country.trim() ? 'Укажите страну практики' : undefined,
    sub: !v.sub ? 'Выберите субспециализацию' : undefined,
    profile: v.profile && !/^https?:\/\/\S+\.\S+/.test(v.profile) ? 'Ссылка должна начинаться с http:// или https://' : undefined,
    consent: !v.consent ? 'Нужно согласие на обработку данных' : undefined,
  }));
  const { values: v, set, blur, visible } = form;
  return (
    <Page title="Сеть экспертов">
      <Chapter shot="net-hero" size="hero" label="Сеть">
        <div className="col col--wide">
          <Eyebrow>Центр международного уровня</Eyebrow>
          <SplitTitle as="h1" className="display" text="Сложный случай заслуживает *нескольких взглядов*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Центр формирует сеть субспециалистов из разных стран, которые смогут подключаться к работе — от разбора снимков до совместных операций.
            </p>
            <div className="actions">
              <BtnLink to="/second-opinion">Запросить второе мнение</BtnLink>
              <a className="btn btn--ghost" href="#join">
                Присоединиться к сети
              </a>
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="net-west" label="Запад">
        <div className="col">
          <Eyebrow>География · Великобритания · США · Канада</Eyebrow>
          <SplitTitle text="Где центр *ищет экспертов*" />
          <R d={120}>
            <p className="lead">Страны, с которыми уже связана работа основателя: учёба в Великобритании, испытания его устройства в клиниках Гонконга и Канады и интерес специалистов из США, Европы, Китая, Канады и Японии (по данным 24.kz).</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="net-east" label="Восток">
        <div className="col col--right">
          <Eyebrow>Восточная Азия · Гонконг · Китай · Япония</Eyebrow>
          <SplitTitle text="Восемь *субспециализаций*" />
          <R d={120}>
            <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {SUBSPEC.map(([l, f]) => (
                <li key={l} className="row" style={{ gridTemplateColumns: '1fr 1.3fr', padding: '10px 0' }}>
                  <strong style={{ fontWeight: 500 }}>{l}</strong>
                  <span className="muted" style={{ fontSize: 14 }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <p className="note">Профили экспертов публикуются после подписания соглашений и с их согласия.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="net-flow" pin={false} size="auto" label="Форматы">
        <div className="section__head">
          <div>
            <Eyebrow>Модель сети</Eyebrow>
            <SplitTitle text="Четыре формата *участия*" />
          </div>
          <R>
            <p className="lead">Каждый отвечает на свою задачу: качество протоколов, сложная хирургия, быстрый доступ к субспециалисту и новые знания.</p>
          </R>
        </div>
        <div className="grid grid--4">
          {FORMATS.map((f, i) => (
            <R key={f.t} d={i * 70}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">0{i + 1}</span>
                <h3 className="card__t" style={{ fontSize: 21 }}>
                  {f.t}
                </h3>
                <p className="card__p">{f.p}</p>
                <ul className="ticks" style={{ fontSize: 14, marginTop: 'auto' }}>
                  {f.l.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </R>
          ))}
        </div>
      </Chapter>

      <Chapter shot="home-final" label="Консилиум">
        <div className="col col--wide">
          <Eyebrow>Как эксперт подключается к случаю</Eyebrow>
          <SplitTitle text="Второе мнение *и телеконсилиум*" />
          <ol className="steps">
            {FLOW.map((s, i) => (
              <R as="li" key={s.t} d={i * 60}>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </R>
            ))}
          </ol>
          <R d={300}>
            <p className="lead" style={{ marginTop: 24, fontFamily: 'var(--f-display)', fontStyle: 'italic' }}>
              Международный эксперт не заменяет лечащего врача. Он добавляет ещё один взгляд — а решение принимают пациент и врач, который его ведёт.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="net-flow" pin={false} size="auto" label="Стандарты" id="join">
        <Eyebrow>Стандарты</Eyebrow>
        <SplitTitle text="Правила, общие *для всех экспертов*" />
        <div className="grid grid--4" style={{ marginTop: 24 }}>
          {STANDARDS.map((s, i) => (
            <R key={s.t} d={i * 60}>
              <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{s.t}</h3>
              <p className="body" style={{ fontSize: 15 }}>
                {s.p}
              </p>
            </R>
          ))}
        </div>

        <div className="grid grid--2" style={{ marginTop: 96, alignItems: 'start', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Присоединиться</Eyebrow>
            <SplitTitle text="Станьте *экспертом сети*" />
            <R>
              <p className="lead">Для офтальмологов-субспециалистов, хирургов и исследователей. Расскажите о своей практике — медицинский директор свяжется с вами, чтобы обсудить формат.</p>
            </R>
          </div>
          <div className="panel">
            {done ? (
              <Success title="Спасибо — заявка у медицинского директора" reference={done} />
            ) : (
              <form
                ref={form.formRef}
                className="form"
                noValidate
                onSubmit={form.submit(async () => {
                  await wait(1000);
                  setDone(reference('NET'));
                })}
              >
                <div className="form__row">
                  <TextField label="Имя" name="name" required autoComplete="name" value={v.name} onValue={(x) => set('name', x)} onBlurField={() => blur('name')} error={visible('name')} />
                  <TextField label="E-mail" name="email" type="email" required autoComplete="email" value={v.email} onValue={(x) => set('email', x)} onBlurField={() => blur('email')} error={visible('email')} />
                </div>
                <div className="form__row">
                  <TextField label="Страна практики" name="country" required value={v.country} onValue={(x) => set('country', x)} onBlurField={() => blur('country')} error={visible('country')} />
                  <SelectField label="Субспециализация" name="sub" required value={v.sub} onValue={(x) => set('sub', x)} onBlurField={() => blur('sub')} error={visible('sub')} options={[{ value: '', label: 'Выберите…' }, ...SUBSPEC.map(([l]) => ({ value: l, label: l }))]} />
                </div>
                <SelectField label="Предпочтительный формат" name="format" value={v.format} onValue={(x) => set('format', x)} options={[{ value: '', label: 'Пока не знаю' }, ...FORMATS.map((f) => ({ value: f.t, label: f.t }))]} />
                <TextField label="Ссылка на профиль" name="profile" type="url" hint="ORCID, PubMed или страница клиники" value={v.profile} onValue={(x) => set('profile', x)} onBlurField={() => blur('profile')} error={visible('profile')} />
                <TextArea label="О вашей практике" name="comment" value={v.comment} onValue={(x) => set('comment', x)} />
                <Consent checked={v.consent} onChange={(x) => set('consent', x)} error={visible('consent')} />
                <SubmitButton pending={form.pending}>Отправить заявку</SubmitButton>
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
