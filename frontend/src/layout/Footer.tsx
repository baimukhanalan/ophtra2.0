import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container } from '@/ui';
import { Reveal, Stagger, useParallax } from '@/motion';
import { LEGAL_LINKS, NAV_GROUPS } from '@/app/navigation';
import { clinics, site } from '@/content';
import { resolveTrackedPhone, track, trackCall } from '@/services/analytics';
import { Logo } from './Logo';
import { SwirlMark } from './SwirlMark';

/**
 * Site footer (Figma: deep forest, brand + channel chips on the left, four
 * gold-captioned link columns, clinics, licence line and disclaimer).
 *
 * Figma fix: the knowledge pages used a stripped three-link footer; every page
 * now shares this one, so navigation never shrinks mid-journey.
 */
export const Footer = () => {
  const { t, L } = useI18n();
  const phone = resolveTrackedPhone(site.organization.phone);
  const year = new Date().getFullYear();
  const markRef = useParallax<HTMLDivElement>(0.12);
  const footerRef = useRef<HTMLElement>(null);
  // Link columns collapse into accordions on phones (the footer was five screens tall).
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Floating launchers also step aside while a form (booking wizard, lead
  // form, search) is on screen, so they never cover a field or its submit
  // button. Forms mount with the route, so the scan re-runs on navigation and
  // whenever the page's DOM grows (lazy sections, wizard steps).
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const main = document.querySelector('main') ?? document.body;
    const visible = new Set<Element>();
    const sync = () => {
      if (visible.size) root.dataset.overForm = 'true';
      else delete root.dataset.overForm;
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      sync();
    });
    const watched = new Set<Element>();
    const scan = () => {
      main.querySelectorAll('form, .bk, .oph-leadform').forEach((node) => {
        if (watched.has(node)) return;
        watched.add(node);
        observer.observe(node);
      });
      watched.forEach((node) => {
        if (node.isConnected) return;
        watched.delete(node);
        visible.delete(node);
        observer.unobserve(node);
      });
      sync();
    };
    scan();
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mutations.observe(main, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      delete root.dataset.overForm;
    };
  }, [pathname]);

  // Floating launchers step aside while the footer is on screen.
  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) root.dataset.overFooter = 'true';
      else delete root.dataset.overFooter;
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      delete root.dataset.overFooter;
    };
  }, []);

  return (
    <footer ref={footerRef} className="oph-footer">
      <div ref={markRef} className="oph-footer__mark" aria-hidden="true">
        <SwirlMark />
      </div>

      <Container className="oph-footer__inner">
        <div className="oph-footer__top">
          <Reveal variant="up">
            <div className="oph-footer__brand">
              <Logo name={t.brand.name} tone="light" />
              <p>{t.footer.about}</p>
              <div className="oph-footer__channels">
                {site.channels.map((channel) => (
                  <a
                    key={channel.id}
                    className="oph-channel"
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={() =>
                      channel.id === 'phone' ? trackCall(channel.label) : track(`${channel.id}_click`)
                    }
                  >
                    {channel.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Stagger className="oph-footer__columns" step={70}>
            {NAV_GROUPS.map((group) => (
              <Reveal key={group.id} variant="up">
                <details className="oph-footer__group" open={wide}>
                  <summary className="oph-footer__heading">{t.nav[group.labelKey]}</summary>
                  <ul className="oph-footer__list">
                    {group.links.map((link) => (
                      <li key={link.path}>
                        <Link to={link.path}>{t.nav[link.labelKey]}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            ))}
          </Stagger>
        </div>

        <Stagger className="oph-footer__clinics" step={90}>
          {clinics.map((clinic) => (
            <Reveal key={clinic.id} variant="up">
              <div className="oph-footer__clinic">
                <p className="oph-footer__heading">{L(clinic.name)}</p>
                <p>
                  <MapPin size={14} aria-hidden="true" />
                  {L(clinic.address)}
                </p>
                <p>
                  <Clock size={14} aria-hidden="true" />
                  {L(clinic.schedule)}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal variant="up">
            <div className="oph-footer__clinic">
              <p className="oph-footer__heading">{t.nav.contacts}</p>
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} onClick={() => trackCall(phone)}>
                <Phone size={14} aria-hidden="true" />
                {phone}
              </a>
              <a href={`mailto:${site.organization.email}`}>
                <Mail size={14} aria-hidden="true" />
                {site.organization.email}
              </a>
            </div>
          </Reveal>
        </Stagger>

        <div className="oph-footer__bottom">
          <p>
            © {year} {L(site.organization.legalName)}. {t.footer.rights}
          </p>
          <nav aria-label={t.nav.info}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.path} to={link.path}>
                {t.nav[link.labelKey]}
              </Link>
            ))}
          </nav>
          <p>{t.footer.license.replace('00-0000000', site.organization.license)}</p>
        </div>

        <p className="oph-footer__disclaimer">{t.footer.disclaimer}</p>
      </Container>
    </footer>
  );
};
