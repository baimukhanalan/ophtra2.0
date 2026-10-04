import { Fragment } from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
}

/**
 * Progress indicator for the booking wizard.
 * Rendered as an ordered list so screen readers announce position in sequence.
 */
export const Stepper = ({
  steps,
  current,
  onSelect,
  label,
}: {
  steps: Step[];
  /** Index of the step currently being edited. */
  current: number;
  /** Allows jumping back to a completed step. */
  onSelect?: (index: number) => void;
  label: string;
}) => (
  <nav aria-label={label}>
    <ol className="oph-stepper">
      {steps.map((step, index) => {
        const state = index === current ? 'active' : index < current ? 'done' : 'todo';
        const clickable = Boolean(onSelect) && index < current;

        return (
          <Fragment key={step.id}>
            {index > 0 ? <li className="oph-step__line" aria-hidden="true" /> : null}
            <li>
              <button
                type="button"
                className="oph-step"
                data-state={state}
                aria-current={state === 'active' ? 'step' : undefined}
                disabled={!clickable}
                style={clickable ? undefined : { cursor: 'default' }}
                onClick={clickable ? () => onSelect?.(index) : undefined}
              >
                <span className="oph-step__index" aria-hidden="true">
                  {state === 'done' ? <Check size={13} strokeWidth={3} /> : index + 1}
                </span>
                {step.label}
              </button>
            </li>
          </Fragment>
        );
      })}
    </ol>
  </nav>
);

export const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div
    className="oph-progress"
    role="progressbar"
    aria-valuenow={Math.round(value * 100)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
  >
    <div className="oph-progress__value" style={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }} />
  </div>
);
