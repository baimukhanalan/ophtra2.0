/**
 * Schematic cross-section of the eye (side view). The active anatomical layer
 * glows; light rays travel from the left through the optics to the retina.
 */
export type EyePart = 'optical' | 'laser' | 'pediatric' | 'cataract' | 'treatment' | 'diagnostics' | 'nerve' | 'macula';

export function EyeSection({ active, label }: { active: EyePart; label: string }) {
  const on = (p: EyePart | EyePart[]) => ((Array.isArray(p) ? p : [p]).includes(active) || active === 'diagnostics' ? 'is-on' : '');
  return (
    <figure className="xsec" role="img" aria-label={label}>
      <svg viewBox="0 0 420 300">
        <defs>
          <radialGradient id="xs-v" cx="55%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#1b2e28" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#07100d" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {/* rays */}
        <g className={`xsec__rays ${active === 'optical' ? 'is-on' : ''}`}>
          <path d="M0 110 L60 110 L112 132 L330 150" />
          <path d="M0 190 L60 190 L112 168 L330 150" />
          <path d="M0 150 L330 150" />
        </g>
        {/* spectacle lens */}
        <path className={`xsec__part ${on('optical')}`} d="M52 92 Q66 150 52 208 M68 92 Q54 150 68 208" />
        {/* globe / sclera */}
        <circle className="xsec__globe" cx="228" cy="150" r="112" fill="url(#xs-v)" />
        {/* retina */}
        <path className={`xsec__part xsec__retina ${on(['treatment', 'macula'])}`} d="M228 40 A110 110 0 0 1 228 260" />
        <circle className={`xsec__dot ${on('macula')}`} cx="336" cy="150" r="5" />
        {/* optic nerve */}
        <path className={`xsec__part ${on('nerve')}`} d="M330 172 L410 186 M326 196 L410 210" />
        {/* vitreous */}
        <circle className={`xsec__part xsec__vit ${on('treatment')}`} cx="236" cy="150" r="84" />
        {/* cornea */}
        <path className={`xsec__part ${on('laser')}`} d="M126 88 Q88 150 126 212" />
        {/* iris */}
        <path className={`xsec__part ${on('pediatric')}`} d="M134 96 L134 132 M134 168 L134 204" />
        {/* lens */}
        <ellipse className={`xsec__part ${on('cataract')}`} cx="150" cy="150" rx="14" ry="34" />
        <text x="228" y="292" textAnchor="middle" className="xsec__cap">
          {label}
        </text>
      </svg>
    </figure>
  );
}
