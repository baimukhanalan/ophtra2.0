import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

/**
 * Accessible accordion. The panel animates with `grid-template-rows: 0fr → 1fr`
 * so it never needs a measured pixel height and never causes layout jank.
 */
export const Accordion = ({
  items,
  /** Allow several panels open at once. */
  multiple = false,
  defaultOpenId,
}: {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpenId?: string;
}) => {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      return multiple ? [...current, id] : [id];
    });
  };

  return (
    <div className="oph-accordion">
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="oph-accordion__item" data-open={isOpen}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={triggerId}
                className="oph-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.question}</span>
                <span className="oph-accordion__icon" aria-hidden="true">
                  <ChevronDown size={17} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="oph-accordion__panel"
              hidden={!isOpen && false}
            >
              <div>
                <div className="oph-accordion__body">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
