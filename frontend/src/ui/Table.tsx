import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

/**
 * Responsive data table. The wrapper scrolls horizontally instead of letting
 * the page overflow, which keeps narrow viewports usable.
 */
export const DataTable = <T,>({
  columns,
  rows,
  caption,
  rowKey,
  empty,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  caption?: string;
  rowKey: (row: T, index: number) => string;
  empty?: ReactNode;
}) => {
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    // The wrapper scrolls sideways on phones: it is focusable so keyboard
    // users can scroll it too, and named after the caption for screen readers.
    <div className="oph-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="oph-table">
        {caption ? <caption className="oph-visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ textAlign: column.align ?? 'left', width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key} style={{ textAlign: column.align ?? 'left' }}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
