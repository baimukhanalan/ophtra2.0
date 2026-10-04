import { useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { LANGUAGES, LANGUAGE_LABELS, useI18n, type Language } from '@/i18n';
import { Dropdown } from '@/ui';

export const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const choose = (next: Language) => {
    setLanguage(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        className="oph-nav__link"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.a11y.languageSwitcher}
        onClick={() => setOpen((current) => !current)}
      >
        <Globe size={16} aria-hidden="true" />
        {compact ? null : LANGUAGE_LABELS[language].short}
      </button>

      <Dropdown open={open} onClose={() => setOpen(false)}>
        {LANGUAGES.map((code) => (
          <button
            key={code}
            type="button"
            role="menuitemradio"
            aria-checked={code === language}
            aria-current={code === language ? 'true' : undefined}
            lang={code}
            onClick={() => choose(code)}
          >
            {LANGUAGE_LABELS[code].full}
            {code === language ? <Check size={15} aria-hidden="true" /> : null}
          </button>
        ))}
      </Dropdown>
    </div>
  );
};
