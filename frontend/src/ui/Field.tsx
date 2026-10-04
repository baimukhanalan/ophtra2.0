import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/**
 * Field shell owns the label/hint/error wiring so every control on the site
 * announces itself identically to assistive technology.
 */
export const Field = ({ label, hint, error, required, icon, children }: FieldShellProps) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="oph-field">
      {label ? (
        <label className="oph-field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="oph-field__required" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div className="oph-field__control">
        {icon}
        {children({ id, describedBy, invalid: Boolean(error) })}
      </div>
      {hint && !error ? (
        <p className="oph-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="oph-field__error" id={errorId} role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
};

type BaseProps = { label?: string; hint?: string; error?: string; icon?: ReactNode };

export const Input = ({
  label,
  hint,
  error,
  icon,
  required,
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) => (
  <Field label={label} hint={hint} error={error} icon={icon} required={required}>
    {({ id, describedBy, invalid }) => (
      <input
        id={id}
        className="oph-input"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        required={required}
        {...rest}
      />
    )}
  </Field>
);

export const Textarea = ({
  label,
  hint,
  error,
  required,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <Field label={label} hint={hint} error={error} required={required}>
    {({ id, describedBy, invalid }) => (
      <textarea
        id={id}
        className="oph-textarea"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        required={required}
        {...rest}
      />
    )}
  </Field>
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const Select = ({
  label,
  hint,
  error,
  icon,
  required,
  options,
  placeholder,
  ...rest
}: BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[]; placeholder?: string }) => (
  <Field label={label} hint={hint} error={error} icon={icon} required={required}>
    {({ id, describedBy, invalid }) => (
      <select
        id={id}
        className="oph-select"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        required={required}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </Field>
);

export const Checkbox = ({
  label,
  ...rest
}: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="oph-check">
    <input type="checkbox" {...rest} />
    <span>{label}</span>
  </label>
);

export const Radio = ({
  label,
  ...rest
}: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="oph-check">
    <input type="radio" {...rest} />
    <span>{label}</span>
  </label>
);

/** Pill switcher used for filters and tab-like choices. */
export const Segmented = <T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  label: string;
}) => (
  <div className="oph-segmented" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
