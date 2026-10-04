import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';

export type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Minimal form state: values, per-field errors shown after blur or submit,
 * pending flag that blocks double submits, and focus on the first invalid field.
 */
export function useForm<T extends Record<string, unknown>>(initial: T, validate: (v: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = validate(values);
  const visible = (k: keyof T) => ((submitted || touched[k]) && errors[k]) || undefined;
  const set = useCallback(<K extends keyof T>(k: K, v: T[K]) => setValues((s) => ({ ...s, [k]: v })), []);
  const blur = (k: keyof T) => setTouched((t) => ({ ...t, [k]: true }));
  const submit = (onValid: (v: T) => Promise<void> | void) => async (e: FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    setSubmitted(true);
    const errs = validate(values);
    const first = Object.keys(errs).find((k) => errs[k as keyof T]);
    if (first) {
      requestAnimationFrame(() => {
        const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
        el?.focus();
      });
      return;
    }
    lock.current = true;
    setPending(true);
    try {
      await onValid(values);
    } finally {
      lock.current = false;
      setPending(false);
    }
  };
  const reset = () => {
    setValues(initial);
    setTouched({});
    setSubmitted(false);
  };
  return { values, set, blur, errors, visible, submit, pending, formRef, reset, submitted };
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}
export function Field({ label, error, hint, required, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-h` : undefined;
  const errId = error ? `${id}-e` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && (
        <span className="field__hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field__err" id={errId} role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </span>
      )}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  label: string;
  name: string;
  value: string;
  onValue: (v: string) => void;
  onBlurField?: () => void;
  error?: string;
  hint?: string;
};
export function TextField({ label, name, value, onValue, onBlurField, error, hint, required, ...rest }: InputProps) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          name={name}
          className="input"
          value={value}
          onChange={(e) => onValue(e.target.value)}
          onBlur={onBlurField}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          {...rest}
        />
      )}
    </Field>
  );
}

export function TextArea({ label, name, value, onValue, error, hint, onBlurField, required }: { label: string; name: string; value: string; onValue: (v: string) => void; error?: string; hint?: string; onBlurField?: () => void; required?: boolean }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} name={name} className="textarea" value={value} onChange={(e) => onValue(e.target.value)} onBlur={onBlurField} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
      )}
    </Field>
  );
}

export function SelectField({ label, name, value, onValue, options, error, hint, required, onBlurField }: { label: string; name: string; value: string; onValue: (v: string) => void; options: Array<{ value: string; label: string }>; error?: string; hint?: string; required?: boolean; onBlurField?: () => void }) {
  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {({ id, describedBy, invalid }) => (
        <select id={id} name={name} className="select" value={value} onChange={(e) => onValue(e.target.value)} onBlur={onBlurField} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const id = useId();
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label className="check" htmlFor={id}>
        <input id={id} name="consent" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-e` : undefined} />
        <span>Согласен(на) на обработку персональных и медицинских данных для ответа на заявку.</span>
      </label>
      {error && (
        <span className="field__err" id={`${id}-e`} role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </span>
      )}
    </div>
  );
}

export function SubmitButton({ pending, children, pendingLabel = 'Отправляем…' }: { pending: boolean; children: ReactNode; pendingLabel?: string }) {
  return (
    <button className="btn" type="submit" disabled={pending} aria-disabled={pending || undefined}>
      {pending ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Success({ title, reference, children }: { title: string; reference?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="success" role="status" tabIndex={-1} ref={ref}>
      <p className="eyebrow" style={{ marginBottom: 10 }}>Заявка принята</p>
      <h3 className="h3">{title}</h3>
      {reference && (
        <p>
          Номер: <span className="success__ref">{reference}</span>
        </p>
      )}
      {children}
    </div>
  );
}
