import { useEffect } from 'react';

/**
 * The optical bench is one persistent WebGL scene behind every page.
 * Pages never re-render it through React state: they write to this mutable
 * store and the scene reads it every frame. Only a preset swap (a new set of
 * glass elements) notifies subscribers.
 */

export type OpticKind = 'lens' | 'prism' | 'aperture' | 'pane' | 'sphere' | 'meniscus' | 'cylinder';

export interface OpticElement {
  kind: OpticKind;
  /** Position along the beam (negative = further away). */
  z: number;
  x?: number;
  y?: number;
  /** Radius-ish size. */
  size?: number;
  /** Lens curvature 0.1 (flat) … 1 (ball). */
  curve?: number;
  /** Rotation around Y in radians — lets a pane or prism face the camera. */
  turn?: number;
}

export interface Preset {
  id: string;
  elements: OpticElement[];
  /** How far the camera travels over a full page scroll. */
  travel: number;
  /** z of a prism that splits the beam into a spectrum (optional). */
  spectrumAt?: number;
  /** Camera side offset so that DOM copy can sit on the other side. */
  side?: number;
}

interface SceneState {
  preset: Preset;
  /** 0…1 scroll progress of the current page. */
  progress: number;
  /** 0…1 page-transition warp: camera flies through the nearest lens. */
  warp: number;
  /** Is any transparent "stage" section on screen? If not, rendering pauses. */
  stageVisible: boolean;
  pointer: { x: number; y: number };
  /** Aperture/iris openness requested by the page (0 closed … 1 open). */
  iris: number;
  /** Camera z target from stage anchors (null = use page progress). */
  camZ: number | null;
  /** Stage sections that frame a given element: page y (centre) → element index. */
  anchors: Array<{ y: number; el: number }>;
  anchorsDirty: boolean;
}

const listeners = new Set<() => void>();

export const scene: SceneState = {
  preset: { id: 'boot', elements: [], travel: 10 },
  progress: 0,
  warp: 0,
  stageVisible: true,
  pointer: { x: 0, y: 0 },
  iris: 1,
  camZ: null,
  anchors: [],
  anchorsDirty: true,
};

/** Distance the camera keeps in front of the element a stage frames. */
export const FRAME_DIST = 6.5;

export const setPreset = (p: Preset) => {
  if (scene.preset.id === p.id) return;
  scene.preset = p;
  listeners.forEach((l) => l());
};

export const subscribePreset = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Page hook: declare which optical elements this page is built from. */
export const useScenePreset = (p: Preset) => {
  useEffect(() => {
    setPreset(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);
};
