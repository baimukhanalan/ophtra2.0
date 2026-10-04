import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button } from '@/ui';
import { ROUTES } from '@/app/navigation';
import { CONSENT_RESET_EVENT, loadVendorTags, setAnalyticsConsent } from '@/services/analytics';
import { consentCopy as C } from '@/content/pages/overlays';

const KEY = 'ophtra.consent.analytics';

const readChoice = () => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return 'denied';
  }
};

/**
 * Analytics consent gate (GDPR). No vendor tag loads until the visitor
 * accepts, so a first visit makes zero third-party requests.
 *
 * Figma fix: the banner covered the hero. It is a compact, non-modal paper
 * card — bottom-right on tablets and desktops (the hero CTAs sit on the left)
 * and a bottom sheet on phones — with two equally clear choices («Только
 * необходимые» and a forest «Принять») and a link to the policy. While it is
 * visible it publishes its height as `--oph-consent-offset` on <html>; the
 * assistant launcher rises above it with a transform (no layout shift) and
 * phones pad the page so the last content can scroll clear of the sheet.
 */
export const ConsentBanner = () => {
  const { L } = useI18n();
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const stored = readChoice();
    if (stored === 'granted') loadVendorTags();
    let timer: number | undefined;
    if (!stored) {
      // Let the page's own entrance animation play first.
      timer = window.setTimeout(() => setVisible(true), 1400);
    }
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_RESET_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const node = cardRef.current;
    if (!visible || !node) {
      root.removeAttribute('data-consent-open');
      root.style.removeProperty('--oph-consent-offset');
      return undefined;
    }
    let published = -1;
    const publish = () => {
      // Only a card that actually scrolls may contain the drag (shell.css).
      node.toggleAttribute('data-overflowing', node.scrollHeight > node.clientHeight + 1);
      // The offset pads <body>: ignore sub-8px wobbles so the page bottom
      // stays put while the card settles.
      const offset = Math.ceil(node.offsetHeight) + 12;
      if (published >= 0 && Math.abs(offset - published) < 8) return;
      published = offset;
      root.style.setProperty('--oph-consent-offset', `${offset}px`);
    };
    publish();
    root.setAttribute('data-consent-open', 'true');
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(publish) : null;
    observer?.observe(node);
    return () => {
      observer?.disconnect();
      root.removeAttribute('data-consent-open');
      root.style.removeProperty('--oph-consent-offset');
    };
  }, [visible]);

  if (!visible) return null;

  const decide = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <div ref={cardRef} className="oph-consent" role="region" aria-labelledby={titleId}>
      <div className="oph-consent__head">
        <span className="oph-consent__icon" aria-hidden="true">
          <Cookie size={16} />
        </span>
        <p id={titleId} className="oph-consent__title">
          {L(C.title)}
        </p>
      </div>
      <p className="oph-consent__text">{L(C.text)}</p>
      <div className="oph-consent__actions">
        <Button variant="outline" onClick={() => decide(false)}>
          {L(C.decline)}
        </Button>
        <Button onClick={() => decide(true)}>
          {L(C.accept)}
        </Button>
      </div>
      <Link className="oph-consent__link" to={`${ROUTES.privacy}#cookies`}>
        {L(C.settings)}
      </Link>
    </div>
  );
};
