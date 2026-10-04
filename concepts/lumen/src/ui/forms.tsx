import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type Rules = Record<string, (v: string, all: Record<string, string>) => string | null>;

export const req = (msg = 'Заполните поле') => (v: string) => (v.trim() ? null : msg);
export const phoneRule = (v: string) =>
  v.replace(/\D/g, '').length >= 10 ? null : 'Укажите номер полностью, например +7 700 000 00 00';
export const emailRule = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Проверьте адрес e-mail');
export const optionalEmail = (v: string) => (!v.trim() ? null : emailRule(v));
export const checked = (msg = 'Нужно согласие') => (v: string) => (v === 'on' ? null : msg);

/**
 * Minimal form state: inline validation after first blur / submit, a pending
 * state that blocks double submits, and a demo "server" delay. Nothing leaves
 * the browser — this is a design concept.
 */
export function useForm(initial: Record<string, string>, rules: Rules) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
  const lock = useRef(false);

  const validate = (name: string, all = values) => rules[name]?.(all[name] ?? '', all) ?? null;

  const bind = (name: string) => ({
    name,
    value: values[name] ?? '',
    error: touched[name] ? errors[name] : null,
    onChange: (v: string) => {
      const next = { ...values, [name]: v };
      setValues(next);
      if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(name, next) }));
    },
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((e) => ({ ...e, [name]: validate(name) }));
    },
  });

  const submit = (onDone?: (v: Record<string, string>) => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lock.current) return;
    const errs: Record<string, string | null> = {};
    Object.keys(rules).forEach((k) => (errs[k] = validate(k)));
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])));
    const firstBad = Object.keys(rules).find((k) => errs[k]);
    if (firstBad) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    lock.current = true;
    setStatus('pending');
    window.setTimeout(() => {
      setStatus('done');
      lock.current = false;
      onDone?.(values);
    }, 1100);
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  return { values, setValues, bind, submit, status, reset };
}

type Bound = ReturnType<ReturnType<typeof useForm>['bind']>;

function Shell({ id, label, hint, error, children, optional, className }: { id: string; label: string; hint?: string; error?: string | null; children: ReactNode; optional?: boolean; className?: string }) {
  return (
    <div className={'field' + (error ? ' has-error' : '') + (className ? ' ' + className : '')}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__opt"> · необязательно</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="field__hint" id={id + '-h'}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__err" id={id + '-e'} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ f, label, hint, optional, className, ...rest }: { f: Bound; label: string; hint?: string; optional?: boolean; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'name'>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={f.error} optional={optional} className={className}>
      <input
        id={id}
        className="field__input"
        name={f.name}
        value={f.value}
        onChange={(e) => f.onChange(e.target.value)}
        onBlur={f.onBlur}
        aria-invalid={!!f.error}
        aria-describedby={f.error ? id + '-e' : hint ? id + '-h' : undefined}
        {...rest}
      />
    </Shell>
  );
}

export function AreaField({ f, label, hint, optional, className, ...rest }: { f: Bound; label: string; hint?: string; optional?: boolean; className?: string } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onBlur' | 'name'>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={f.error} optional={optional} className={className}>
      <textarea
        id={id}
        className="field__input field__area"
        name={f.name}
        value={f.value}
        rows={4}
        onChange={(e) => f.onChange(e.target.value)}
        onBlur={f.onBlur}
        aria-invalid={!!f.error}
        aria-describedby={f.error ? id + '-e' : hint ? id + '-h' : undefined}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({ f, label, options, hint, optional, className, placeholder = 'Выберите', ...rest }: { f: Bound; label: string; options: Array<{ value: string; label: string }>; hint?: string; optional?: boolean; className?: string; placeholder?: string } & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'onBlur' | 'name'>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={f.error} optional={optional} className={className}>
      <div className="field__select">
        <select
          id={id}
          className="field__input"
          name={f.name}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          onBlur={f.onBlur}
          aria-invalid={!!f.error}
          aria-describedby={f.error ? id + '-e' : hint ? id + '-h' : undefined}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Shell>
  );
}

export function CheckField({ f, children }: { f: Bound; children: ReactNode }) {
  const id = useId();
  return (
    <div className={'check' + (f.error ? ' has-error' : '')}>
      <input
        id={id}
        type="checkbox"
        name={f.name}
        checked={f.value === 'on'}
        onChange={(e) => f.onChange(e.target.checked ? 'on' : '')}
        onBlur={f.onBlur}
        aria-invalid={!!f.error}
        aria-describedby={f.error ? id + '-e' : undefined}
      />
      <label htmlFor={id}>{children}</label>
      {f.error && (
        <p className="field__err" id={id + '-e'} role="alert">
          {f.error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ pending, children, pendingLabel = 'Отправляем…' }: { pending: boolean; children: ReactNode; pendingLabel?: string }) {
  return (
    <button type="submit" className="btn" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="spin" aria-hidden="true" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export const requestNo = (prefix = 'OPH') =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X')}`;

export function FormSuccess({ title, text, number, onReset }: { title: string; text: string; number?: string; onReset?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="form-ok" role="status" ref={ref} tabIndex={-1}>
      <span className="form-ok__lens" aria-hidden="true" />
      <p className="h3">{title}</p>
      <p className="body">{text}</p>
      {number && (
        <p className="form-ok__no">
          <span className="anno">Номер заявки</span>
          <strong>{number}</strong>
        </p>
      )}
      <p className="small muted">Концепт: данные не отправляются и не сохраняются.</p>
      {onReset && (
        <button type="button" className="link" onClick={onReset}>
          Заполнить заново
        </button>
      )}
    </div>
  );
}
