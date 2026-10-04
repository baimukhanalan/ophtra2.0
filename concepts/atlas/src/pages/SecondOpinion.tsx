import { useId, useState } from 'react';
import { Chapter } from '../components/Chapter';
import { Consent, SelectField, SubmitButton, Success, TextArea, TextField, useForm, wait } from '../components/form';
import { Page } from '../components/Shell';
import { Eyebrow, R, SplitTitle } from '../components/ui';
import { emailOk, reference } from '../lib/format';

const STEPS = [
  { t: 'Вы отправляете документы', p: 'Заполните форму, опишите вопрос и перечислите выписки, снимки и результаты исследований.' },
  { t: 'Специалисты изучают', p: 'Профильный врач, а в сложных случаях — консилиум, анализирует данные и при необходимости запрашивает дополнительные исследования.' },
  { t: 'Заключение готово', p: 'Письменное заключение с рекомендациями приходит на e-mail, указанный в заявке.' },
  { t: 'Приглашение при необходимости', p: 'Если нужно очное лечение, мы составим план и поможем организовать поездку в Казахстан.' },
];
const STATUS = [
  { t: 'Получено', p: 'Заявке присвоен номер. Координатор связывается с вами, получает документы по защищённой ссылке и проверяет, всё ли читается.', m: 'номер — сразу' },
  { t: 'На рассмотрении', p: 'Специалист изучает снимки и выписки. Если чего-то не хватает, мы напишем, какие исследования дослать.', m: 'срок называет координатор' },
  { t: 'Заключение готово', p: 'Письменное заключение с подписью врача приходит на e-mail. Можно задать уточняющий вопрос или записаться на онлайн-разбор.', m: 'на e-mail' },
];
const ATTACH = [
  'Последнюю выписку или заключение офтальмолога',
  'Снимки ОКТ сетчатки и диска зрительного нерва',
  'Результаты периметрии (поля зрения)',
  'Кератотопографию и биометрию, если обсуждается операция',
  'Данные о внутриглазном давлении и остроте зрения',
  'Список лекарств и капель, которые вы используете',
  'Сведения о сопутствующих заболеваниях (диабет, гипертония)',
];
const FAQ = [
  ['Заменяет ли второе мнение очный осмотр?', 'Нет. Заключение основано на присланных документах и помогает принять решение, но окончательный диагноз и план лечения возможны только после осмотра.'],
  ['На каком языке будет заключение?', 'На русском, казахском или английском — выберите в заявке. Документы на других языках лучше прислать с переводом.'],
  ['Что если документов недостаточно?', 'Мы напишем, каких исследований не хватает, и подскажем, где их можно сделать. Если это невозможно дома, предложим пройти диагностику у нас.'],
];
const OK_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX = 10 * 1024 * 1024;

type F = { name: string; email: string; lang: string; question: string; consent: boolean };

function FilePicker({ files, setFiles }: { files: File[]; setFiles: (f: File[]) => void }) {
  const id = useId();
  const [err, setErr] = useState<string | null>(null);
  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    const problems: string[] = [];
    Array.from(list).forEach((f) => {
      if (!OK_TYPES.includes(f.type)) problems.push(`«${f.name}» — нужен PDF, JPG или PNG`);
      else if (f.size > MAX) problems.push(`«${f.name}» больше 10 МБ`);
      else if (next.length >= 10) problems.push('Не больше 10 файлов в одной заявке');
      else next.push(f);
    });
    setFiles(next);
    setErr(problems.length ? problems.join('. ') : null);
  };
  return (
    <div className="field">
      <label htmlFor={id}>Выписки и снимки</label>
      <label htmlFor={id} className="panel" style={{ borderStyle: 'dashed', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 28, cursor: 'pointer' }}>
        <span className="coord">PDF · JPG · PNG · до 10 МБ · до 10 файлов</span>
        <span style={{ marginTop: 8 }}>Нажмите, чтобы выбрать файлы</span>
      </label>
      <input id={id} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = ''; }} aria-describedby={`${id}-h`} />
      <span className="field__hint" id={`${id}-h`}>
        Файлы не загружаются на сервер: в заявку попадает только их список, сами документы координатор запросит по защищённой ссылке.
      </span>
      {err && (
        <span className="field__err" role="alert">
          {err}
        </span>
      )}
      {files.length > 0 && (
        <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }} aria-label="Выбранные файлы">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="row" style={{ gridTemplateColumns: '1fr auto auto' }}>
              <span style={{ overflowWrap: 'anywhere' }}>{f.name}</span>
              <span className="coord">{(f.size / 1024 / 1024).toFixed(1)} МБ</span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label={`Убрать ${f.name}`}>
                Убрать
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SecondOpinion() {
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState<string | null>(null);
  const form = useForm<F>({ name: '', email: '', lang: 'ru', question: '', consent: false }, (v) => ({
    name: v.name.trim().length < 2 ? 'Укажите имя' : undefined,
    email: !emailOk(v.email) ? 'E-mail обязателен — на него придёт заключение' : undefined,
    question: v.question.trim().length < 10 ? 'Опишите вопрос хотя бы в одном-двух предложениях' : undefined,
    consent: !v.consent ? 'Нужно согласие на обработку данных' : undefined,
  }));
  const { values: v, set, blur, visible } = form;
  return (
    <Page title="Второе мнение">
      <Chapter shot="so-hero" size="hero" label="Документы">
        <div className="col col--wide">
          <Eyebrow>Второе мнение · дистанционно</Eyebrow>
          <SplitTitle as="h1" className="display" text="Второе мнение *по вашим документам*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Сомневаетесь в диагнозе или предложенной операции? Загрузите выписки и снимки — наши специалисты изучат их и дадут письменное заключение. Без поездки и без очереди.
            </p>
            <div className="actions">
              <a className="btn" href="#so-form">
                Загрузить документы
              </a>
              <a className="btn btn--ghost" href="#so-steps">
                Как это работает
              </a>
            </div>
            <div className="chips" style={{ marginTop: 28 }} aria-label="Какие документы подходят">
              {['Выписка', 'Снимок ОКТ', 'Поля зрения', 'PDF · JPG · PNG'].map((c) => (
                <span key={c} className="tag">
                  {c}
                </span>
              ))}
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="so-steps" size="md" label="Преимущество" align="center">
        <div className="col col--wide">
          <Eyebrow>Главное преимущество</Eyebrow>
          <SplitTitle className="statement" text="Контакт с врачом начинается раньше, чем *география начинает иметь значение*." />
          <R d={200}>
            <p className="lead" style={{ marginTop: 22 }}>
              Вам не нужно ехать, чтобы понять, нужна ли поездка. Экспертное мнение по документам помогает принять взвешенное решение — лечиться дома, приехать к нам или сначала дообследоваться.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="contacts-orbit" id="so-steps" label="Процесс">
        <div className="col col--right">
          <Eyebrow>Процесс</Eyebrow>
          <SplitTitle text="Четыре шага *к заключению*" />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <R as="li" key={s.t} d={i * 80}>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </R>
            ))}
          </ol>
        </div>
      </Chapter>

      <Chapter shot="ground-front" pin={false} size="auto" label="Статус">
        <div className="section__head">
          <div>
            <Eyebrow>Статус заявки</Eyebrow>
            <SplitTitle text="Вы всегда знаете, *где ваша заявка*" />
          </div>
        </div>
        <ol className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STATUS.map((s, i) => (
            <R as="li" key={s.t} d={i * 90}>
              <div className="card" style={{ height: '100%', borderColor: i === 1 ? 'var(--gold)' : undefined }}>
                <span className="card__k">
                  {String(i + 1).padStart(2, '0')} · {s.m}
                  {i === 1 && ' · текущий этап (пример)'}
                </span>
                <h3 className="card__t">{s.t}</h3>
                <p className="card__p">{s.p}</p>
              </div>
            </R>
          ))}
        </ol>
      </Chapter>

      <Chapter shot="so-hero" pin={false} size="auto" label="Заявка" id="so-form">
        <div className="grid grid--2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Что приложить</Eyebrow>
            <SplitTitle text="Чем полнее документы, *тем точнее ответ*" />
            <R>
              <ul className="ticks">
                {ATTACH.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="note">Фото документов подойдут, если текст хорошо читается. Снимки ОКТ лучше выгружать в PDF прямо из прибора.</p>
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
              <Success title="Заявка на второе мнение отправлена" reference={done}>
                <p className="body">
                  Файлов в списке: {files.length}. Координатор запросит документы по защищённой ссылке и назовёт срок, когда увидит всё, что вы прислали.
                </p>
              </Success>
            ) : (
              <form
                ref={form.formRef}
                className="form"
                noValidate
                onSubmit={form.submit(async () => {
                  await wait(1100);
                  setDone(reference('SO'));
                })}
              >
                <h2 className="h3">Запросить второе мнение</h2>
                <TextField label="Имя" name="name" required autoComplete="name" value={v.name} onValue={(x) => set('name', x)} onBlurField={() => blur('name')} error={visible('name')} />
                <div className="form__row">
                  <TextField label="E-mail" name="email" type="email" required autoComplete="email" value={v.email} onValue={(x) => set('email', x)} onBlurField={() => blur('email')} error={visible('email')} />
                  <SelectField label="Язык заключения" name="lang" value={v.lang} onValue={(x) => set('lang', x)} options={[{ value: 'ru', label: 'Русский' }, { value: 'kk', label: 'Казахский' }, { value: 'en', label: 'Английский' }]} />
                </div>
                <TextArea label="Ваш вопрос" name="question" required value={v.question} onValue={(x) => set('question', x)} onBlurField={() => blur('question')} error={visible('question')} hint="Например: предложили операцию на катаракте — нужна ли она сейчас?" />
                <FilePicker files={files} setFiles={setFiles} />
                <Consent checked={v.consent} onChange={(x) => set('consent', x)} error={visible('consent')} />
                <SubmitButton pending={form.pending}>Отправить на рассмотрение</SubmitButton>
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
