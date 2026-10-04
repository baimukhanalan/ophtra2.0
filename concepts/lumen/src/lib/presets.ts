import type { OpticElement, Preset } from './scene-store';

/**
 * Each page is its own optical bench. The beam always runs along −Z; the
 * camera travels `travel` units forward over one full page scroll.
 */
const p = (id: string, travel: number, elements: OpticElement[], extra: Partial<Preset> = {}): Preset => ({
  id,
  travel,
  elements,
  ...extra,
});

export const PRESETS = {
  home: p(
    'home',
    34,
    [
      { kind: 'lens', z: -1, x: 0.9, size: 1.35, curve: 0.5 },
      { kind: 'aperture', z: -8, x: -0.6, size: 1.25 },
      { kind: 'prism', z: -15, x: 0.7, size: 1.1 },
      { kind: 'meniscus', z: -23, x: -0.8, size: 1.2, curve: 0.45 },
      { kind: 'sphere', z: -31, x: 0.4, size: 1.1 },
    ],
    { spectrumAt: -15 },
  ),
  about: p('about', 22, [
    { kind: 'pane', z: -1, x: 1.1, size: 1.3, turn: -0.5 },
    { kind: 'lens', z: -7, x: 0.95, size: 1.2, curve: 0.35 },
    { kind: 'cylinder', z: -13, x: 0.8, size: 1 },
    { kind: 'lens', z: -19, x: -0.4, size: 1.4, curve: 0.6 },
  ]),
  founder: p(
    'founder',
    24,
    [
      { kind: 'sphere', z: -1, x: 1.0, size: 1.1 },
      { kind: 'prism', z: -9, x: -0.8, size: 1.1 },
      { kind: 'lens', z: -17, x: 0.8, size: 1.3, curve: 0.7 },
    ],
    { spectrumAt: -9 },
  ),
  doctors: p('doctors', 20, [
    { kind: 'pane', z: -1, x: 1.4, size: 1.1, turn: -0.35 },
    { kind: 'pane', z: -3.5, x: -1.3, size: 1.1, turn: 0.4 },
    { kind: 'pane', z: -6, x: 1.2, size: 1.1, turn: -0.3 },
    { kind: 'lens', z: -12, x: -0.3, size: 1.3, curve: 0.45 },
  ]),
  doctor: p('doctor', 14, [
    { kind: 'pane', z: -1, x: 1.1, size: 1.4, turn: -0.4 },
    { kind: 'lens', z: -8, x: -0.7, size: 1.1, curve: 0.4 },
  ]),
  services: p('services', 30, [
    { kind: 'lens', z: -1, x: 1.1, size: 1.0, curve: 0.15 },
    { kind: 'lens', z: -5.5, x: -1.0, size: 1.05, curve: 0.3 },
    { kind: 'lens', z: -10, x: 1.0, size: 1.1, curve: 0.45 },
    { kind: 'meniscus', z: -14.5, x: -0.9, size: 1.1, curve: 0.5 },
    { kind: 'lens', z: -19, x: 0.9, size: 1.15, curve: 0.7 },
    { kind: 'sphere', z: -24, x: -0.6, size: 0.9 },
  ]),
  international: p('international', 26, [
    { kind: 'lens', z: -1, x: 1.2, size: 1.2, curve: 0.4 },
    { kind: 'sphere', z: -8, x: -0.9, size: 0.8 },
    { kind: 'lens', z: -15, x: 0.9, size: 1.1, curve: 0.55 },
    { kind: 'aperture', z: -21, x: -0.5, size: 1.1 },
  ]),
  second: p('second', 20, [
    { kind: 'lens', z: -1, x: 1.5, size: 0.95, curve: 0.35 },
    { kind: 'lens', z: -1.8, x: 0.2, size: 0.95, curve: 0.55 },
    { kind: 'pane', z: -9, x: -1.0, size: 1.2, turn: 0.4 },
    { kind: 'lens', z: -15, x: 0.6, size: 1.2, curve: 0.45 },
  ]),
  consult: p('consult', 18, [
    { kind: 'aperture', z: -1, x: 1.1, size: 1.2 },
    { kind: 'lens', z: -7, x: -0.8, size: 1.2, curve: 0.5 },
    { kind: 'pane', z: -13, x: 0.8, size: 1.0, turn: -0.4 },
  ]),
  booking: p('booking', 10, [
    { kind: 'lens', z: -1, x: 1.7, size: 0.75, curve: 0.5 },
    { kind: 'aperture', z: -9, x: 1.2, size: 1.3 },
  ]),
  knowledge: p('knowledge', 20, [
    { kind: 'cylinder', z: -1, x: 1.2, size: 1.1 },
    { kind: 'lens', z: -8, x: -0.9, size: 1.1, curve: 0.3 },
    { kind: 'pane', z: -14, x: 0.8, size: 1.0, turn: -0.5 },
  ]),
  article: p('article', 16, [
    { kind: 'meniscus', z: -1, x: 1.2, size: 1.1, curve: 0.45 },
    { kind: 'lens', z: -10, x: -0.8, size: 1.0, curve: 0.35 },
  ]),
  science: p(
    'science',
    26,
    [
      { kind: 'prism', z: -1, x: 1.1, size: 1.2 },
      { kind: 'sphere', z: -9, x: -0.9, size: 0.9 },
      { kind: 'lens', z: -16, x: 0.7, size: 1.3, curve: 0.8 },
      { kind: 'aperture', z: -22, x: -0.4, size: 1.1 },
    ],
    { spectrumAt: -1 },
  ),
  experts: p('experts', 22, [
    { kind: 'sphere', z: -1, x: 1.4, size: 0.7 },
    { kind: 'sphere', z: -3, x: -1.2, size: 0.55 },
    { kind: 'sphere', z: -6, x: 0.8, size: 0.6 },
    { kind: 'lens', z: -12, x: -0.6, size: 1.3, curve: 0.5 },
    { kind: 'sphere', z: -18, x: 0.9, size: 0.8 },
  ]),
  reviews: p('reviews', 16, [
    { kind: 'lens', z: -1, x: 1.2, size: 1.2, curve: 0.35 },
    { kind: 'meniscus', z: -9, x: -0.8, size: 1.1, curve: 0.5 },
  ]),
  faq: p('faq', 18, [
    { kind: 'aperture', z: -1, x: 1.2, size: 1.0 },
    { kind: 'aperture', z: -5, x: 1.0, size: 0.8 },
    { kind: 'lens', z: -11, x: -0.6, size: 1.1, curve: 0.45 },
  ]),
  contacts: p(
    'contacts',
    14,
    [
      { kind: 'lens', z: -1, x: 1.2, size: 1.2, curve: 0.5 },
      { kind: 'prism', z: -8, x: -0.8, size: 1.0 },
    ],
    { spectrumAt: -8 },
  ),
  account: p('account', 14, [
    { kind: 'pane', z: -1, x: 1.3, size: 1.2, turn: -0.5 },
    { kind: 'lens', z: -8, x: -0.7, size: 1.0, curve: 0.4 },
  ]),
  notFound: p(
    'notFound',
    8,
    [
      { kind: 'prism', z: -1, x: 0.4, size: 1.3, turn: 0.9 },
      { kind: 'meniscus', z: -5, x: -1.2, size: 0.9, curve: 0.6 },
    ],
    { spectrumAt: -1 },
  ),
} satisfies Record<string, Preset>;

/** A service = a lens with its own curvature. Deterministic from its index. */
export const serviceCurve = (index: number) => 0.14 + ((index * 37) % 20) / 20 * 0.72;

export const servicePreset = (slug: string, index: number): Preset =>
  p('service:' + slug, 16, [
    { kind: 'lens', z: -1, x: 1.1, size: 1.35, curve: serviceCurve(index) },
    { kind: 'aperture', z: -8, x: -0.8, size: 1.0 },
    { kind: 'lens', z: -13, x: 0.6, size: 1.0, curve: Math.max(0.15, 0.9 - serviceCurve(index)) },
  ]);
