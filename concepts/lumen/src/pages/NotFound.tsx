import overlaysJson from '../content/overlays.json';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { Arrow, usePageTitle } from '../ui/parts';
import './pages.css';
import './misc.css';

const N = (overlaysJson as unknown as { notFoundCopy: Record<string, string> }).notFoundCopy;

export default function NotFound() {
  useScenePreset(PRESETS.notFound);
  usePageTitle(N.title);
  const links = [
    { to: R.services, t: N.services, x: N.servicesText },
    { to: R.doctors, t: N.doctors, x: N.doctorsText },
    { to: R.knowledge, t: N.knowledge, x: N.knowledgeText },
    { to: R.contacts, t: N.contacts, x: N.contactsText },
  ];
  return (
    <div className="nf">
      <section className="stage nf-stage" data-stage data-el={0} aria-labelledby="nf-h">
        <div className="wrap nf-in">
          <p className="eyebrow">{N.eyebrow}</p>
          <p className="nf-code" aria-hidden="true">
            404
          </p>
          <h1 id="nf-h" className="h2">
            {N.title}
          </h1>
          <p className="lead">{N.lead}</p>
          <p className="anno">Изображение не в фокусе — наведите на цифры</p>
          <TLink to={R.home} className="btn">
            {N.home} <Arrow />
          </TLink>
          <h2 className="anno mt-l">{N.where}</h2>
          <ul className="tiles nf-links" role="list">
            {links.map((l) => (
              <li key={l.to}>
                <TLink to={l.to} className="tile">
                  <span className="h3">{l.t}</span>
                  <p>{l.x}</p>
                  <span className="tile__foot">
                    {N.open} <Arrow />
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
