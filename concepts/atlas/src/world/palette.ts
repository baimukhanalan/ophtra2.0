import { Color } from 'three';

/** Brand palette pushed toward a nocturnal, cinematic mood. */
export const C = {
  deep: new Color('#0a1411'),
  night: new Color('#0d1a16'),
  forest: new Color('#1b2e28'),
  moss: new Color('#2f5145'),
  sage: new Color('#7fa08f'),
  cream: new Color('#f4f2ed'),
  sand: new Color('#e9e7e1'),
  gold: new Color('#c9b08a'),
  goldDeep: new Color('#a88b5e'),
  ember: new Color('#e8c27c'),
};

export const glsl = String.raw;

/** Soft round sprite used by every point cloud. */
export const POINT_FRAG_SOFT = glsl`
  float pd = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.08, pd);
`;
