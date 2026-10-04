import { clinic, site } from '../lib/data';
import { R } from '../routes';
import { NAV_GROUPS } from './nav';
import { TLink } from './Transition';

export function Footer() {
  return (
    <footer className="ftr sec--ink">
      <div className="wrap">
        <div className="ftr__top">
          <div className="ftr__mission">
            <p className="eyebrow">Наша миссия</p>
            <p className="h2 ftr__statement">Предотвращение слепоты и сохранение зрения для будущих поколений.</p>
          </div>
          <div className="ftr__cta">
            <TLink to={R.booking} className="btn btn--gold">
              Записаться на консультацию
            </TLink>
            <TLink to={R.second} className="btn btn--ghost ftr__ghost">
              Получить второе мнение
            </TLink>
          </div>
        </div>
        <div className="ftr__cols">
          {NAV_GROUPS.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <h2 className="anno ftr__h">{g.label}</h2>
              <ul role="list">
                {g.items.map((it) => (
                  <li key={it.to}>
                    <TLink to={it.to}>{it.label}</TLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="anno ftr__h">Контакты</h2>
            <address className="ftr__addr">
              <p>{clinic.address}</p>
              <p>{clinic.schedule}</p>
              <p>
                <a href={`tel:${site.organization.phoneHref}`}>{site.organization.phone}</a>
              </p>
              <p>
                <a href={`mailto:${site.organization.email}`}>{site.organization.email}</a>
              </p>
              <p>
                <a href={`https://wa.me/${site.organization.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="ftr__bottom">
          <img src="/brand/logo-light.png" alt="Ophthalmic Centre of Dr Kulmaganbetov" width={460} height={80} loading="lazy" />
          <p className="small">
            Центр доктора Кулмаганбетова — офтальмологический центр полного цикла: диагностика, микрохирургия и
            наблюдение по международным стандартам.
          </p>
          <p className="small ftr__legal">
            Имеются противопоказания. Необходима консультация специалиста. · Концепт дизайна «LUMEN — Свет и оптика».
            Демонстрационные данные помечены на страницах.
          </p>
        </div>
      </div>
    </footer>
  );
}
