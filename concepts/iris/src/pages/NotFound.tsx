import type { CSSProperties } from 'react';
import { C } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Arrow, Split, Station } from '../components/ui';

const N = C.overlays.notFoundCopy;

export default function NotFound() {
  usePage(N.title, 'blind');
  const links = [
    { to: '/services', t: N.services, x: N.servicesText },
    { to: '/doctors', t: N.doctors, x: N.doctorsText },
    { to: '/knowledge-base', t: N.knowledge, x: N.knowledgeText },
    { to: '/contacts', t: N.contacts, x: N.contactsText },
  ];
  return (
    <section className="nf">
      <Station id="blind" />
      <div className="wrap nf__in">
        <p className="hero__layer" data-reveal>
          <span>Слой</span> Слепое пятно
        </p>
        <p className="eyebrow" data-reveal>
          {N.eyebrow}
        </p>
        <Split as="h1" className="display d-xxl" text="404" />
        <p className="h2 nf__t" data-reveal>
          {N.title}
        </p>
        <p className="lead" data-reveal>
          В месте, где зрительный нерв выходит из глаза, нет фоторецепторов — это слепое пятно. Мозг достраивает картинку, и мы его не замечаем. Эта страница — такое же пятно. {N.lead}
        </p>
        <IrisLink to="/" className="btn" data-reveal>
          {N.home} <Arrow />
        </IrisLink>
        <h2 className="eyebrow nf__where">{N.where}</h2>
        <ul className="grid-4">
          {links.map((l, i) => (
            <li key={l.to} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
              <IrisLink to={l.to} className="card">
                <span className="h3">{l.t}</span>
                <span className="body">{l.x}</span>
                <span className="link">
                  {N.open} <Arrow />
                </span>
              </IrisLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
