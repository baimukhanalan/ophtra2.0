/**
 * Camera "stations" along the journey into the eye.
 *
 * World space: the eyeball is a unit sphere at the origin, the cornea looks
 * down +Z, the macula sits at the back pole (0, 0, -1) and the optic disc is
 * slightly nasal to it. Every page places DOM markers (data-station="…") in
 * its scroll story; the scene blends between the stations of the two markers
 * that frame the viewport centre.
 */

export type StationId =
  | 'void'
  | 'gaze'
  | 'approach'
  | 'iris'
  | 'irisSide'
  | 'cornea'
  | 'aqueous'
  | 'lens'
  | 'vitreous'
  | 'retina'
  | 'macula'
  | 'micro'
  | 'disc'
  | 'nerve'
  | 'nerveFar'
  | 'blind';

/** Packed parameter vector, see P_* indices. */
export type StationVec = Float32Array;

export const P_POS = 0; // 3
export const P_LOOK = 3; // 3
export const P_FOV = 6;
export const P_PUPIL = 7; // 0..1 dilation
export const P_MICRO = 8; // photoreceptor mosaic
export const P_CAUSTIC = 9; // lens caustics overlay
export const P_TUNNEL = 10; // optic-nerve light pulses
export const P_GLOW = 11; // macula glow
export const P_FOCUS = 12; // focal distance for bokeh particles
export const P_LIGHT = 13; // interior light level
export const P_LEN = 14;

const n = Math.hypot(-0.28, 0.05, -0.96);
export const DISC: [number, number, number] = [-0.28 / n, 0.05 / n, -0.96 / n];
const at = (k: number): [number, number, number] => [DISC[0] * k, DISC[1] * k, DISC[2] * k];

interface StationDef {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  pupil?: number;
  micro?: number;
  caustic?: number;
  tunnel?: number;
  glow?: number;
  focus?: number;
  light?: number;
}

const DEFS: Record<StationId, StationDef> = {
  void: { pos: [0.6, 0.3, 7.5], look: [0, 0, 0.2], fov: 26, pupil: 0.05, focus: 7, light: 0.3 },
  gaze: { pos: [0.5, 0.22, 4.6], look: [0.05, 0.0, 0.3], fov: 31, pupil: 0.2, focus: 4.0, light: 0.3 },
  approach: { pos: [0.08, 0.04, 2.7], look: [0, 0, 0.7], fov: 32, pupil: 0.45, focus: 1.9, light: 0.45 },
  iris: { pos: [0.0, 0.0, 1.9], look: [0, 0, 0.78], fov: 33, pupil: 0.28, focus: 1.1, light: 0.35 },
  irisSide: { pos: [1.35, 0.42, 1.9], look: [0.0, 0.0, 0.72], fov: 33, pupil: 0.3, focus: 1.9, light: 0.35 },
  cornea: { pos: [0.0, 0.0, 1.28], look: [0, 0, 0], fov: 50, pupil: 0.72, caustic: 0.12, focus: 0.6 },
  aqueous: { pos: [0.0, 0.0, 0.97], look: [0, 0, -1], fov: 60, pupil: 0.95, caustic: 0.35, focus: 0.4, light: 0.8 },
  lens: { pos: [0.0, 0.0, 0.62], look: [0, 0, -1], fov: 66, pupil: 1, caustic: 1, focus: 0.35, light: 0.9 },
  vitreous: { pos: [0.02, 0.0, 0.12], look: [0, 0, -1], fov: 62, pupil: 1, caustic: 0.1, focus: 0.55, light: 1 },
  retina: { pos: [0.06, 0.03, -0.42], look: [0, 0, -1], fov: 58, pupil: 1, focus: 0.45, light: 1 },
  macula: { pos: [0.0, 0.0, -0.72], look: [0, 0, -1], fov: 40, pupil: 1, glow: 1, focus: 0.2, light: 1.05 },
  micro: { pos: [0.0, 0.0, -0.9], look: [0, 0, -1], fov: 18, pupil: 1, micro: 1, glow: 0.5, focus: 0.09, light: 1.1 },
  disc: { pos: at(0.42), look: at(1.2), fov: 52, pupil: 1, focus: 0.5, light: 1, tunnel: 0.2 },
  nerve: { pos: at(1.7), look: at(4.5), fov: 72, pupil: 1, tunnel: 1, focus: 0.8, light: 1 },
  nerveFar: { pos: at(6.4), look: at(10), fov: 78, pupil: 1, tunnel: 1.3, focus: 1, light: 1 },
  blind: { pos: at(0.6), look: at(1.1), fov: 44, pupil: 1, focus: 0.3, light: 0.75, tunnel: 0.4 },
};

export const STATIONS: Record<StationId, StationVec> = Object.fromEntries(
  (Object.keys(DEFS) as StationId[]).map((id) => {
    const d = DEFS[id];
    const v = new Float32Array(P_LEN);
    v.set(d.pos, P_POS);
    v.set(d.look, P_LOOK);
    v[P_FOV] = d.fov;
    v[P_PUPIL] = d.pupil ?? 0.3;
    v[P_MICRO] = d.micro ?? 0;
    v[P_CAUSTIC] = d.caustic ?? 0;
    v[P_TUNNEL] = d.tunnel ?? 0;
    v[P_GLOW] = d.glow ?? 0;
    v[P_FOCUS] = d.focus ?? 1;
    v[P_LIGHT] = d.light ?? 0.7;
    return [id, v];
  }),
) as Record<StationId, StationVec>;

/** Anatomical label shown in the depth HUD for each station. */
export const LAYER: Record<StationId, { name: string; depth: number }> = {
  void: { name: 'Взгляд', depth: 0 },
  gaze: { name: 'Взгляд', depth: 0 },
  approach: { name: 'Радужка', depth: 0.06 },
  iris: { name: 'Радужка', depth: 0.1 },
  irisSide: { name: 'Роговица · отражение', depth: 0.08 },
  cornea: { name: 'Роговица', depth: 0.16 },
  aqueous: { name: 'Водянистая влага', depth: 0.24 },
  lens: { name: 'Хрусталик', depth: 0.34 },
  vitreous: { name: 'Стекловидное тело', depth: 0.5 },
  retina: { name: 'Сетчатка', depth: 0.66 },
  macula: { name: 'Макула', depth: 0.74 },
  micro: { name: 'Фоторецепторы', depth: 0.78 },
  disc: { name: 'Диск зрительного нерва', depth: 0.84 },
  blind: { name: 'Слепое пятно', depth: 0.84 },
  nerve: { name: 'Зрительный нерв', depth: 0.92 },
  nerveFar: { name: 'Зрительный нерв → мир', depth: 1 },
};
