import { useState, type ReactNode } from 'react';
import patientsJson from '../content/patients.json';
import { services } from '../lib/data';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { AreaField, CheckField, FormSuccess, SelectField, SubmitButton, TextField, checked, emailRule, optionalEmail, phoneRule, req, requestNo, useForm } from './forms';
import { Accordion, Arrow, SectionHead } from './parts';

export const PT = patientsJson as unknown as {
  ptCountries: Array<{ value: string; label: string }>;
  ptLanguages: Array<{ value: string; label: string }>;
  ptFieldLabels: Record<string, string>;
  ptPortals: Array<{ key: string; eyebrow: string; title: string; text: string }>;
  ptShared: Record<string, string>;
};

const PORTAL_TO: Record<string, string> = {
  international: R.international,
  secondOpinion: R.second,
  consultation: R.consult,
  doctors: R.doctors,
  appointment: R.booking,
  contacts: R.contacts,
};

/** "Other ways to start" — the other portals, excluding the current one. */
export function OtherPortals({ current }: { current: string }) {
  return (
    <section className="sec sec--paper" aria-labelledby="portals-h">
      <div className="wrap">
        <SectionHead eyebrow={PT.ptShared.portalsEyebrow} title={PT.ptShared.portalsTitle} id="portals-h" />
        <div className="tiles mt-l">
          {PT.ptPortals
            .filter((p) => p.key !== current)
            .map((p, i) => (
              <TLink key={p.key} to={PORTAL_TO[p.key]} className="tile rv" style={{ ['--d' as string]: `${i * 0.05}s` }}>
                <span className="anno">{p.eyebrow}</span>
                <span className="h3">{p.title}</span>
                <p>{p.text}</p>
                <span className="tile__foot">
                  {PT.ptShared.open} <Arrow />
                </span>
              </TLink>
            ))}
        </div>
      </div>
    </section>
  );
}

export function PortalFaq({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <section className="sec sec--solid" aria-labelledby="pfaq-h">
      <div className="wrap split">
        <SectionHead eyebrow={PT.ptShared.faqEyebrow} title={PT.ptShared.faqTitle} id="pfaq-h" />
        <div>
          <Accordion items={items} />
          <p className="small muted mt-m">{PT.ptShared.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

const serviceOptions = [
  ...services.map((s) => ({ value: s.id, label: s.name })),
  { value: 'unknown', label: '' },
];

type Variant = 'international' | 'second' | 'consult';

/**
 * Application form for the three remote portals. Fields follow the production
 * copy (ptFieldLabels); validation is inline; submit is locked while pending.
 */
export function PortalForm({ variant, submit, prefill, aside }: { variant: Variant; submit: string; prefill?: string; aside?: ReactNode }) {
  const L = PT.ptFieldLabels;
  const [no, setNo] = useState('');
  const rules: Record<string, (v: string, all: Record<string, string>) => string | null> = {
    name: req('Как к вам обращаться?'),
    phone: phoneRule,
    consent: checked('Без согласия мы не можем обработать заявку'),
  };
  if (variant === 'second') {
    rules.email = emailRule;
    rules.question = req('Сформулируйте вопрос — так врач ответит точнее');
  } else rules.email = optionalEmail;
  if (variant === 'international') rules.country = req('Выберите страну');
  if (variant === 'consult') {
    rules.platform = req('Выберите платформу');
    rules.date = req('Укажите желаемую дату');
  }
  const f = useForm(
    { name: '', phone: '', email: '', country: '', service: '', diagnosis: '', dates: '', language: 'ru', question: '', platform: '', date: '', timezone: '', files: '', comment: prefill ?? '', consent: '' },
    rules,
  );

  if (f.status === 'done')
    return (
      <div className="glass">
        <FormSuccess
          title="Заявка отправлена"
          text="Координатор свяжется с вами в течение рабочего дня. Номер заявки пригодится при переписке."
          number={no}
          onReset={() => {
            f.reset();
            setNo('');
          }}
        />
      </div>
    );

  const svcOpts = serviceOptions.map((o) => (o.value === 'unknown' ? { value: 'unknown', label: L.otherService } : o));

  return (
    <form className="form glass form-card" noValidate onSubmit={f.submit(() => setNo(requestNo(variant === 'second' ? 'SO' : variant === 'consult' ? 'TC' : 'INT')))}>
      <div className="form__row">
        <TextField f={f.bind('name')} label="Имя и фамилия" autoComplete="name" />
        <TextField f={f.bind('phone')} label="Телефон или WhatsApp" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7" />
      </div>
      <div className="form__row">
        <TextField f={f.bind('email')} label="E-mail" type="email" autoComplete="email" optional={variant !== 'second'} />
        {variant === 'international' ? (
          <SelectField f={f.bind('country')} label={L.country} options={PT.ptCountries} />
        ) : (
          <SelectField f={f.bind('language')} label={L.language} options={PT.ptLanguages} placeholder="Язык" />
        )}
      </div>
      {variant !== 'second' && <SelectField f={f.bind('service')} label={L.service} options={svcOpts} optional />}
      {variant === 'international' && (
        <div className="form__row">
          <TextField f={f.bind('diagnosis')} label={L.diagnosis} hint={L.diagnosisHint} optional />
          <TextField f={f.bind('dates')} label={L.dates} hint={L.datesHint} optional />
        </div>
      )}
      {variant === 'second' && <AreaField f={f.bind('question')} label={L.question} hint={L.questionHint} />}
      {variant === 'consult' && (
        <div className="form__row">
          <SelectField
            f={f.bind('platform')}
            label={L.platform}
            options={[
              { value: 'zoom', label: 'Zoom' },
              { value: 'meet', label: 'Google Meet' },
              { value: 'teams', label: 'Microsoft Teams' },
            ]}
          />
          <TextField f={f.bind('date')} label={L.date} type="date" min={new Date().toISOString().slice(0, 10)} />
        </div>
      )}
      {variant === 'consult' && <TextField f={f.bind('timezone')} label={L.timezone} optional />}
      {variant !== 'consult' && (
        <AreaField
          f={f.bind('files')}
          label={variant === 'second' ? 'Выписки и снимки' : 'Какие документы у вас есть'}
          hint="Перечислите файлы (PDF, JPG, PNG) — сами документы координатор запросит по защищённой ссылке"
          optional
          rows={3}
        />
      )}
      <AreaField f={f.bind('comment')} label="Комментарий" optional rows={3} />
      <CheckField f={f.bind('consent')}>Я согласен на обработку персональных и медицинских данных</CheckField>
      <div className="row">
        <SubmitButton pending={f.status === 'pending'}>{submit}</SubmitButton>
      </div>
      {aside}
    </form>
  );
}
