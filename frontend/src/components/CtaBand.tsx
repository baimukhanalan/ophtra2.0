import { useEffect } from 'react';
import { CalendarPlus, MessageCircle, Phone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { ButtonLink, Container } from '@/ui';
import { Reveal, SplitText, useProgressVars } from '@/motion';
import { ROUTES } from '@/app/navigation';
import { site } from '@/content';
import { resolveTrackedPhone, track, trackCall } from '@/services/analytics';
import { Photo } from '@/components/Photo';

/**
 * Closing call to action shared by every page (Figma: clinic at night under a
 * forest scrim, centred serif headline, light booking button, phone and
 * WhatsApp chips).
 *
 * Figma fix: the headline ran two words together («консультациюофтальмолога»)
 * and was clipped at the baseline; it is now real text that wraps normally.
 * The photograph opens from an inset window and settles its zoom on scroll.
 */
export const CtaBand = ({ title, text }: { title?: string; text?: string }) => {
  const { t } = useI18n();
  const ref = useProgressVars<HTMLElement>();
  const phone = resolveTrackedPhone(site.organization.phone);

  // Floating launchers step aside while the booking band is on screen, so they
  // never sit on top of its buttons (same contract as the footer).
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) root.dataset.overCta = 'true';
      else delete root.dataset.overCta;
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      delete root.dataset.overCta;
    };
  }, [ref]);

  return (
    <section ref={ref} className="oph-ctaband oph-on-dark">
      <div className="oph-ctaband__media" aria-hidden="true">
        <Photo src="/media/clinic-night.jpg" alt="" width={1440} height={1079} />
      </div>
      <Container>
        <div className="oph-ctaband__inner">
          <SplitText text={title ?? t.home.ctaTitle} as="h2" className="oph-ctaband__title" step={50} />

          <Reveal variant="up" delay={140}>
            <p className="oph-ctaband__text">{text ?? t.home.ctaText}</p>
          </Reveal>

          <Reveal variant="up" delay={220}>
            <div className="oph-ctaband__actions">
              <ButtonLink to={ROUTES.appointment} variant="onDark" magnetic>
                <CalendarPlus size={17} aria-hidden="true" />
                {t.common.bookNow}
              </ButtonLink>

              <a
                className="oph-channel"
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                onClick={() => trackCall(phone)}
              >
                <Phone size={15} aria-hidden="true" />
                {phone}
              </a>

              <a
                className="oph-channel"
                href={`https://wa.me/${site.organization.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click')}
              >
                <MessageCircle size={15} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
