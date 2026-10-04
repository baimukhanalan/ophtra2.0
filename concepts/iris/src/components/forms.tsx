import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'files' | 'checkbox';
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  autoComplete?: string;
  wide?: boolean;
  initial?: string;
}

type Values = Record<string, string | boolean | File[]>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MAX_FILES = 10;
export const MAX_MB = 10;

export function validate(f: FieldDef, v: Values[string]): string | null {
  if (f.type === 'checkbox') return f.required && !v ? 'Нужно ваше согласие' : null;
  if (f.type === 'files') {
    const files = (v as File[]) ?? [];
    if (f.required && !files.length) return 'Добавьте хотя бы один файл';
    if (files.length > MAX_FILES) return `Не больше ${MAX_FILES} файлов`;
    const big = files.find((x) => x.size > MAX_MB * 1024 * 1024);
    if (big) return `Файл «${big.name}» больше ${MAX_MB} МБ`;
    const bad = files.find((x) => !/\.(pdf|jpe?g|png)$/i.test(x.name));
    if (bad) return `Формат «${bad.name}» не подходит: PDF, JPG или PNG`;
    return null;
  }
  const s = String(v ?? '').trim();
  if (f.required && !s) return 'Заполните это поле';
  if (s && f.type === 'email' && !EMAIL.test(s)) return 'Проверьте e-mail: например, name@mail.kz';
  if (s && f.type === 'tel' && s.replace(/\D/g, '').length < 10) return 'Укажите номер полностью, с кодом страны';
  if (s && f.type === 'text' && f.name === 'name' && s.length < 2) return 'Имя слишком короткое';
  return null;
}

export function Field({
  f,
  value,
  error,
  onChange,
  onBlur,
}: {
  f: FieldDef;
  value: Values[string];
  error?: string | null;
  onChange: (v: Values[string]) => void;
  onBlur?: () => void;
}) {
  const id = useId();
  const hintId = `${id}-h`;
  const errId = `${id}-e`;
  const describedBy = [f.hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    name: f.name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': f.required || undefined,
    onBlur,
  };
  if (f.type === 'checkbox') {
    return (
      <div className={`fld fld--check ${f.wide ? 'fld--wide' : ''} ${error ? 'has-err' : ''}`}>
        <input type="checkbox" {...common} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <label htmlFor={id}>{f.label}</label>
        {error && (
          <p className="fld__err" id={errId}>
            {error}
          </p>
        )}
      </div>
    );
  }
  let control: ReactNode;
  if (f.type === 'textarea') {
    control = <textarea {...common} rows={4} value={String(value ?? '')} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
  } else if (f.type === 'select') {
    control = (
      <select {...common} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
        <option value="">Выберите…</option>
        {f.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (f.type === 'files') {
    const files = (value as File[]) ?? [];
    control = (
      <div className="files">
        <input
          {...common}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={(e) => onChange([...files, ...Array.from(e.target.files ?? [])].slice(0, MAX_FILES + 1))}
        />
        {files.length > 0 && (
          <ul className="files__list" aria-label="Выбранные файлы">
            {files.map((file, i) => (
              <li key={file.name + i}>
                <span>{file.name}</span>
                <span className="small">{(file.size / 1024 / 1024).toFixed(1)} МБ</span>
                <button type="button" className="files__rm" onClick={() => onChange(files.filter((_, j) => j !== i))} aria-label={`Убрать ${file.name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } else {
    control = (
      <input
        {...common}
        type={f.type ?? 'text'}
        inputMode={f.type === 'tel' ? 'tel' : undefined}
        autoComplete={f.autoComplete}
        value={String(value ?? '')}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <div className={`fld ${f.wide || f.type === 'textarea' || f.type === 'files' ? 'fld--wide' : ''} ${error ? 'has-err' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {f.hint && (
        <p className="fld__hint" id={hintId}>
          {f.hint}
        </p>
      )}
      {error && (
        <p className="fld__err" id={errId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const refNumber = (prefix: string) =>
  `${prefix}-${new Date().getFullYear().toString().slice(2)}${Math.floor(100000 + Math.random() * 899999)}`;

/**
 * A complete request form: inline validation, focus on the first error,
 * pending state and a guard against double submission. In the concept the
 * request is not transmitted — the success state says so.
 */
export function RequestForm({
  fields,
  submit,
  prefix,
  successTitle = 'Заявка принята',
  next,
  aside,
}: {
  fields: FieldDef[];
  submit: string;
  prefix: string;
  successTitle?: string;
  next?: string[];
  aside?: ReactNode;
}) {
  const consent: FieldDef = {
    name: 'consent',
    type: 'checkbox',
    required: true,
    wide: true,
    label: 'Согласен(на) на обработку персональных данных для ответа на запрос',
  };
  const all = [...fields, consent];
  const [values, setValues] = useState<Values>(() => Object.fromEntries(all.map((f) => [f.name, f.type === 'checkbox' ? false : f.type === 'files' ? [] : f.initial ?? ''])));
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<'idle' | 'pending' | 'done'>('idle');
  const [ref, setRef] = useState('');
  const pending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = (name: string, v: Values[string]) => {
    setValues((s) => ({ ...s, [name]: v }));
    const f = all.find((x) => x.name === name)!;
    if (touched[name] || f.type === 'files' || f.type === 'checkbox') setErrors((e) => ({ ...e, [name]: validate(f, v) }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending.current) return;
    const errs: Record<string, string | null> = {};
    for (const f of all) errs[f.name] = validate(f, values[f.name]);
    setErrors(errs);
    setTouched(Object.fromEntries(all.map((f) => [f.name, true])));
    const firstBad = all.find((f) => errs[f.name]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad.name}"]`)?.focus();
      return;
    }
    pending.current = true;
    setState('pending');
    await new Promise((r) => setTimeout(r, 1100));
    setRef(refNumber(prefix));
    setState('done');
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  if (state === 'done') {
    return (
      <div className="form-done" role="status">
        <p className="eyebrow">Номер заявки</p>
        <h3 className="h2" ref={doneRef} tabIndex={-1}>
          {ref}
        </h3>
        <p className="h4">{successTitle}</p>
        {next && (
          <ol className="form-done__next">
            {next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        )}
        <p className="small">Это дизайн-концепт: заявка не отправлена и хранится только на этом экране.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-busy={state === 'pending'}>
      <div className="form__grid">
        {all.map((f) => (
          <Field
            key={f.name}
            f={f}
            value={values[f.name]}
            error={touched[f.name] ? errors[f.name] : null}
            onChange={(v) => set(f.name, v)}
            onBlur={() => {
              setTouched((t) => ({ ...t, [f.name]: true }));
              setErrors((er) => ({ ...er, [f.name]: validate(f, values[f.name]) }));
            }}
          />
        ))}
      </div>
      {aside}
      <div className="form__foot">
        <button className="btn" type="submit" disabled={state === 'pending'} aria-disabled={state === 'pending'}>
          {state === 'pending' ? (
            <>
              <span className="spin" aria-hidden="true" /> Отправляем…
            </>
          ) : (
            submit
          )}
        </button>
        <p className="small">Поля со звёздочкой обязательны.</p>
      </div>
    </form>
  );
}

export const contactFields = (opts: { email?: boolean; emailRequired?: boolean } = {}): FieldDef[] => [
  { name: 'name', label: 'Имя и фамилия', required: true, autoComplete: 'name' },
  { name: 'phone', label: 'Телефон или WhatsApp', type: 'tel', required: true, autoComplete: 'tel', placeholder: '+7 ___ ___ __ __' },
  ...(opts.email ? [{ name: 'email', label: 'E-mail', type: 'email' as const, required: !!opts.emailRequired, autoComplete: 'email' }] : []),
];
