import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { FileText, Lock, Paperclip, Send, X } from 'lucide-react';
import { useI18n, type Localized } from '@/i18n';
import { Button, Checkbox, Input, Select, SuccessState, Textarea, type SelectOption } from '@/ui';
import { api } from '@/services/api';
import { flushOutbox, queueLead } from '@/services/outbox';
import { getAttribution, track, trackLead } from '@/services/analytics';
import { site } from '@/content';

/**
 * One enquiry form for every portal on the site: contacts, international
 * patients, second opinion, online consultation, partnerships, academy.
 *
 * - Every submission becomes a CRM lead tagged with its `source` (form id),
 *   country, service of interest, diagnosis and stage (spec §6.10, §13).
 * - Spam protection: honeypot field + minimum fill time (spec §17).
 * - Automatic confirmation: the visitor gets a reference number immediately
 *   (spec §9); WhatsApp / e-mail confirmation is sent server-side.
 * - Optional secure file attachment limited to PDF, JPG and PNG (spec §9).
 * - If the API is unreachable the lead is queued locally and retried — the
 *   visitor is told the truth and offered WhatsApp and the phone.
 */

export interface LeadExtraField {
  name: string;
  label: Localized;
  type?: 'text' | 'select' | 'textarea' | 'email' | 'date';
  options?: Array<{ value: string; label: Localized }>;
  required?: boolean;
  placeholder?: Localized;
  /** Half-width field on desktop. */
  half?: boolean;
  /** Bounds for date inputs (ISO yyyy-mm-dd). */
  min?: string;
  max?: string;
}

const COPY = {
  name: { ru: 'Фамилия, имя, отчество', kk: 'Тегі, аты, әкесінің аты', en: 'Full name' },
  phone: { ru: 'Телефон / WhatsApp', kk: 'Телефон / WhatsApp', en: 'Phone / WhatsApp' },
  email: { ru: 'E-mail', kk: 'E-mail', en: 'E-mail' },
  comment: { ru: 'Комментарий', kk: 'Түсініктеме', en: 'Comment' },
  files: { ru: 'Медицинские документы', kk: 'Медициналық құжаттар', en: 'Medical records' },
  filesHint: {
    ru: 'PDF, JPG или PNG, до 10 МБ каждый, не более 10 файлов. Список документов попадёт в заявку; координатор пришлёт защищённую ссылку для их передачи.',
    kk: 'PDF, JPG немесе PNG, әрқайсысы 10 МБ-қа дейін, 10 файлдан аспайды. Құжаттар тізімі өтінімге қосылады; үйлестіруші оларды жіберу үшін қорғалған сілтеме жолдайды.',
    en: 'PDF, JPG or PNG, up to 10 MB each, at most 10 files. The list is added to your request; the coordinator will send a secure link for the documents themselves.',
  },
  addFiles: { ru: 'Прикрепить файлы', kk: 'Файл тіркеу', en: 'Attach files' },
  badType: { ru: 'Поддерживаются только PDF, JPG и PNG', kk: 'Тек PDF, JPG және PNG қолдау көрсетіледі', en: 'Only PDF, JPG and PNG are supported' },
  tooBig: { ru: 'Файл больше 10 МБ', kk: 'Файл 10 МБ-тан үлкен', en: 'File is larger than 10 MB' },
  sentTitle: { ru: 'Заявка принята', kk: 'Өтінім қабылданды', en: 'Request received' },
  sentText: {
    ru: 'Номер заявки: {ref}. Сохраните его — координатор свяжется с вами по указанному телефону или e-mail.',
    kk: 'Өтінім нөмірі: {ref}. Оны сақтаңыз — үйлестіруші көрсетілген телефон немесе e-mail арқылы хабарласады.',
    en: 'Reference: {ref}. Keep it — a coordinator will contact you by the phone or e-mail you gave.',
  },
  queuedTitle: { ru: 'Заявка сохранена', kk: 'Өтінім сақталды', en: 'Request saved' },
  queuedText: {
    ru: 'Сервер сейчас недоступен — заявка ({ref}) сохранена и будет отправлена автоматически. Для срочной связи напишите в WhatsApp.',
    kk: 'Сервер қазір қолжетімсіз — өтінім ({ref}) сақталды және автоматты түрде жіберіледі. Шұғыл байланыс үшін WhatsApp-қа жазыңыз.',
    en: 'The server is unreachable right now — your request ({ref}) is saved and will be sent automatically. For anything urgent, message us on WhatsApp.',
  },
  secure: {
    ru: 'Данные передаются по HTTPS и используются только для ответа на ваш запрос.',
    kk: 'Деректер HTTPS арқылы жіберіледі және тек сұрауыңызға жауап беру үшін пайдаланылады.',
    en: 'Your data travels over HTTPS and is used only to answer your request.',
  },
  another: { ru: 'Отправить ещё одну заявку', kk: 'Тағы өтінім жіберу', en: 'Send another request' },
  disabled: {
    ru: 'Онлайн-заявки через эту форму временно не принимаются. Свяжитесь с нами по телефону или в WhatsApp.',
    kk: 'Бұл форма арқылы онлайн-өтінімдер уақытша қабылданбайды. Бізбен телефон немесе WhatsApp арқылы байланысыңыз.',
    en: 'Online requests through this form are paused. Please reach us by phone or WhatsApp.',
  },
} satisfies Record<string, Localized>;

const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_BYTES = 10 * 1024 * 1024;

/** Forms can be switched off from the admin panel (spec §14 «управлять формами»). */
const formDisabled = (source: string): boolean => {
  try {
    const raw = window.localStorage.getItem('ophtra.admin.forms');
    if (!raw) return false;
    const forms = JSON.parse(raw) as Record<string, { enabled?: boolean }>;
    return forms[source]?.enabled === false;
  } catch {
    return false;
  }
};

const reference = () => `OPH-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export const LeadForm = ({
  source,
  submitLabel,
  extraFields = [],
  withFiles = false,
  emailRequired = false,
  commentLabel,
  serviceId = '',
  footer,
  initialValues,
  filesLabel,
  filesHint,
}: {
  /** CRM source tag, e.g. 'international', 'second-opinion'. */
  source: string;
  submitLabel?: string;
  extraFields?: LeadExtraField[];
  withFiles?: boolean;
  emailRequired?: boolean;
  commentLabel?: Localized;
  serviceId?: string;
  footer?: ReactNode;
  /** Pre-filled values keyed by field name (e.g. a calculator result or a chosen event). */
  initialValues?: Record<string, string>;
  filesLabel?: Localized;
  filesHint?: Localized;
}) => {
  const { t, L } = useI18n();
  const fileInputId = useId();
  const startedAt = useRef(Date.now());
  const [values, setValues] = useState<Record<string, string>>(() => ({
    fullName: '',
    phone: '',
    email: '',
    comment: '',
    ...initialValues,
  }));
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ref: string; queued: boolean } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const initialKey = JSON.stringify(initialValues ?? {});

  useEffect(() => {
    if (initialValues) setValues((current) => ({ ...current, ...initialValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  const set = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFileError('');
    const next = [...files];
    Array.from(list).forEach((file) => {
      if (!ACCEPT.includes(file.type)) return setFileError(L(COPY.badType));
      if (file.size > MAX_BYTES) return setFileError(`${file.name}: ${L(COPY.tooBig)}`);
      if (next.length < 10) next.push(file);
    });
    setFiles(next);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.fullName.trim()) next.fullName = t.common.required;
    if (!PHONE_PATTERN.test(values.phone.trim())) next.phone = t.common.invalidPhone;
    if ((emailRequired || values.email.trim()) && !EMAIL_PATTERN.test(values.email.trim()))
      next.email = t.common.invalidEmail;
    extraFields.forEach((field) => {
      if (field.required && !values[field.name]?.trim()) next[field.name] = t.common.required;
    });
    if (!consent) next.consent = t.common.consentRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    // Bots fill hidden fields and submit instantly; drop both silently.
    if (honeypot.current?.value || Date.now() - startedAt.current < 2500) {
      setResult({ ref: reference(), queued: false });
      return;
    }
    if (!validate()) return;

    setSending(true);
    const attribution = getAttribution();
    const ref = reference();
    const extras = extraFields
      .map((field) => {
        const raw = values[field.name];
        if (!raw) return '';
        const option = field.options?.find((o) => o.value === raw);
        return `${L(field.label)}: ${option ? L(option.label) : raw}`;
      })
      .filter(Boolean);
    const attachments = files.map((file) => `${file.name} (${Math.round(file.size / 1024)} KB)`);

    const lead = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      serviceId,
      source: `${source}|${attribution.source}`,
      date: new Date().toISOString(),
      utm: attribution.utm,
      comment: [
        `[${ref}]`,
        ...extras,
        values.comment.trim(),
        attachments.length ? `Files: ${attachments.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    };

    try {
      await flushOutbox(api.createLead);
      await api.createLead(lead);
      trackLead({ form: source, country: values.country, service: serviceId || values.service, diagnosis: values.diagnosis });
      setResult({ ref, queued: false });
    } catch {
      queueLead(lead);
      track('lead_queued', { form: source });
      setResult({ ref, queued: true });
    } finally {
      setSending(false);
    }
  };

  if (formDisabled(source)) {
    return (
      <div className="oph-panel" role="status">
        <p className="oph-lead">{L(COPY.disabled)}</p>
        <div className="oph-row" style={{ marginTop: 'var(--oph-space-4)' }}>
          <a className="oph-btn oph-btn--primary" href={`tel:${site.organization.phoneHref}`}>
            {site.organization.phone}
          </a>
          <a className="oph-btn oph-btn--outline" href={`https://wa.me/${site.organization.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <SuccessState
        tone={result.queued ? 'warning' : 'success'}
        title={L(result.queued ? COPY.queuedTitle : COPY.sentTitle)}
        text={L(result.queued ? COPY.queuedText : COPY.sentText).replace('{ref}', result.ref)}
        action={
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setFiles([]);
              setValues({ fullName: '', phone: '', email: '', comment: '', ...initialValues });
              setConsent(false);
              startedAt.current = Date.now();
            }}
          >
            {L(COPY.another)}
          </Button>
        }
      />
    );
  }

  return (
    <form className="oph-leadform" onSubmit={submit} noValidate>
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="oph-visually-hidden"
      />

      <div className="oph-leadform__grid">
        <div className="oph-leadform__full">
          <Input
            label={L(COPY.name)}
            required
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => set('fullName', event.target.value)}
            error={errors.fullName}
          />
        </div>
        <Input
          label={L(COPY.phone)}
          required
          type="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___ __ __"
          value={values.phone}
          onChange={(event) => set('phone', event.target.value)}
          error={errors.phone}
        />
        <Input
          label={L(COPY.email)}
          required={emailRequired}
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => set('email', event.target.value)}
          error={errors.email}
        />

        {extraFields.map((field) => {
          const common = {
            label: L(field.label),
            required: field.required,
            error: errors[field.name],
            value: values[field.name] ?? '',
          };
          const wrap = (node: ReactNode) => (
            <div key={field.name} className={field.half ? undefined : 'oph-leadform__full'}>
              {node}
            </div>
          );
          if (field.type === 'select') {
            const options: SelectOption[] = (field.options ?? []).map((o) => ({ value: o.value, label: L(o.label) }));
            return wrap(
              <Select
                {...common}
                options={options}
                placeholder="—"
                onChange={(event) => set(field.name, event.target.value)}
              />,
            );
          }
          if (field.type === 'textarea') {
            return wrap(
              <Textarea
                {...common}
                placeholder={field.placeholder ? L(field.placeholder) : undefined}
                onChange={(event) => set(field.name, event.target.value)}
              />,
            );
          }
          return wrap(
            <Input
              {...common}
              type={field.type ?? 'text'}
              min={field.min}
              max={field.max}
              placeholder={field.placeholder ? L(field.placeholder) : undefined}
              onChange={(event) => set(field.name, event.target.value)}
            />,
          );
        })}

        <div className="oph-leadform__full">
          <Textarea
            label={L(commentLabel ?? COPY.comment)}
            value={values.comment}
            onChange={(event) => set('comment', event.target.value)}
          />
        </div>

        {withFiles ? (
          <div className="oph-leadform__full oph-field">
            <span className="oph-field__label">{L(filesLabel ?? COPY.files)}</span>
            <label htmlFor={fileInputId} className="oph-dropzone">
              <Paperclip size={18} aria-hidden="true" />
              <span>{L(COPY.addFiles)}</span>
              <small>{L(filesHint ?? COPY.filesHint)}</small>
            </label>
            <input
              id={fileInputId}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="oph-visually-hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = '';
              }}
            />
            {fileError ? (
              <p className="oph-field__error" role="alert">
                {fileError}
              </p>
            ) : null}
            {files.length ? (
              <ul className="oph-filelist">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    <FileText size={15} aria-hidden="true" />
                    <span>{file.name}</span>
                    <small>{Math.round(file.size / 1024)} KB</small>
                    <button
                      type="button"
                      aria-label={`${t.common.delete}: ${file.name}`}
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="oph-leadform__footer">
        <div>
          <Checkbox
            label={t.booking.consent}
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          {errors.consent ? (
            <p className="oph-field__error" role="alert">
              {errors.consent}
            </p>
          ) : null}
          <p className="oph-leadform__secure">
            <Lock size={13} aria-hidden="true" />
            {L(COPY.secure)}
          </p>
        </div>
        <Button type="submit" loading={sending} magnetic>
          <Send size={16} aria-hidden="true" />
          {submitLabel ?? t.common.submit}
        </Button>
      </div>
      {footer}
    </form>
  );
};
