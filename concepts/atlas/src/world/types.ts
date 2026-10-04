import type { Vector3 } from 'three';

export interface Quality {
  high: boolean;
  /** Touch device: lighter everything. */
  touch: boolean;
}

export interface WorldLabel {
  id: string;
  text: string;
  sub?: string;
  pos: Vector3;
  /** fx key controlling visibility (0..1). */
  fx: string;
  kind?: 'city' | 'hub' | 'floor' | 'star' | 'field';
  /** Hide when on the far side of the globe. */
  occlude?: boolean;
  /** For floor labels: the floor index to match fx.floor. */
  floor?: number;
  /** For article stars: constellation index matched against fx.sel. */
  group?: number;
}

export type Stage = 'orbit' | 'ground' | 'field';

export interface ShotDef {
  stage: Stage;
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  fx: Record<string, number>;
  /** Optional framing for portrait (phone) screens. */
  portrait?: { pos: [number, number, number]; target: [number, number, number] };
}
