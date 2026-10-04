import { useId, type ReactNode } from 'react';
import type { Column } from '@/ui';

/** Sends one change to the API; resolves false when it was kept locally only. */
export type Sync = (
  collection: string,
  id: string,
  body: Record<string, unknown>,
  options?: { create?: boolean; remove?: boolean; quiet?: boolean },
) => Promise<boolean>;

/** Figma paper panel with a serif heading, used for every admin block. */
export const AdminPanel = ({
  title,
  lead,
  actions,
  children,
  id,
}: {
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  id?: string;
}) => {
  const fallback = useId();
  const headingId = id ?? fallback;
  return (
    <section className="oph-apanel" aria-labelledby={headingId}>
      <header className="oph-apanel__head">
        <div>
          <h2 id={headingId} className="oph-apanel__title">
            {title}
          </h2>
          {lead ? <p className="oph-apanel__lead">{lead}</p> : null}
        </div>
        {actions ? <div className="oph-apanel__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
};

/**
 * Accessible on/off switch (button + role="switch"). The visible state label
 * travels with the control so meaning never rests on colour alone.
 */
export const Toggle = ({
  checked,
  onChange,
  label,
  onLabel,
  offLabel,
  disabled = false,
  hideLabel = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={hideLabel ? label : undefined}
    disabled={disabled}
    className="oph-switch"
    onClick={() => onChange(!checked)}
  >
    <span className="oph-switch__track" aria-hidden="true">
      <span className="oph-switch__thumb" />
    </span>
    {hideLabel ? null : <span className="oph-switch__label">{label}</span>}
    {onLabel && offLabel ? (
      <span className="oph-switch__state" aria-hidden={hideLabel ? undefined : true}>
        {checked ? onLabel : offLabel}
      </span>
    ) : null}
  </button>
);

/** Status pill: dot + text (never colour alone). */
export const StatusPill = ({ tone, children }: { tone: 'ok' | 'muted' | 'warn' | 'bad'; children: ReactNode }) => (
  <span className={`oph-pill oph-pill--${tone}`}>
    <span className="oph-pill__dot" aria-hidden="true" />
    {children}
  </span>
);

/**
 * «Configuration pending» notice for screens whose back-end connection does
 * not exist yet. Titles the screen honestly instead of implying a live link.
 */
export const PendingNotice = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="oph-pending" role="note">
    <span className="oph-pending__badge">
      <span className="oph-pill__dot" aria-hidden="true" />
      {title}
    </span>
    <p className="oph-pending__text">{children}</p>
  </div>
);

/**
 * Table on wide screens, stacked cards on phones (<=767px): every cell carries
 * its column name in `data-label`, which the phone layout prints before the
 * value, so status and actions never scroll out of reach. Shared by the admin
 * workspace and the patient account.
 */
export const ResponsiveTable = <T,>({
  columns,
  rows,
  rowKey,
  caption,
  className,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  className?: string;
}) => (
  <div className="oph-rtable-wrap">
    <table className={`oph-table oph-rtable${className ? ` ${className}` : ''}`}>
      <caption className="oph-visually-hidden">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" style={{ textAlign: column.align ?? 'left', width: column.width }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)}>
            {columns.map((column) => (
              <td
                key={column.key}
                data-label={typeof column.header === 'string' && column.header ? column.header : undefined}
                data-cell={column.key}
                style={{ textAlign: column.align ?? 'left' }}
              >
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
