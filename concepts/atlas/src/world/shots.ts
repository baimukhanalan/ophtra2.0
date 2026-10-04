import { Vector3 } from 'three';
import { llToVec } from './geo';
import { CLINIC } from './ground';
import type { ShotDef } from './types';

const UP = new Vector3(0, 1, 0);
const v3 = (v: Vector3): [number, number, number] => [v.x, v.y, v.z];

/** Orbit camera at lat/lng/distance, globe centre shifted on screen by (dx, dy) globe units. */
function off(lat: number, lng: number, dist: number, dx: number, dy: number, fov = 38, fx: Record<string, number> = {}): ShotDef {
  const pos = llToVec(lat, lng, dist);
  const fwd = pos.clone().negate().normalize();
  const right = new Vector3().crossVectors(fwd, UP).normalize();
  const up = new Vector3().crossVectors(right, fwd).normalize();
  const target = right.clone().multiplyScalar(dx).add(up.clone().multiplyScalar(dy));
  // portrait screens: stack the planet above the copy instead of beside it
  const pPos = llToVec(lat, lng, dist * (Math.abs(dx) > 0.2 ? 1.28 : 1.15));
  const pTarget = up.clone().multiplyScalar(Math.abs(dx) > 0.2 ? -0.55 : dy - 0.1);
  return { stage: 'orbit', pos: v3(pos), target: v3(target), fov, fx, portrait: { pos: v3(pPos), target: v3(pTarget) } };
}

/** Orbit camera looking at a surface point. */
function surf(lat: number, lng: number, dist: number, tLat: number, tLng: number, fov = 40, fx: Record<string, number> = {}): ShotDef {
  return { stage: 'orbit', pos: v3(llToVec(lat, lng, dist)), target: v3(llToVec(tLat, tLng, 1)), fov, fx };
}

function gr(pos: [number, number, number], target: [number, number, number], fov = 45, fx: Record<string, number> = {}): ShotDef {
  return { stage: 'ground', pos, target, fov, fx };
}

function fld(pos: [number, number, number], target: [number, number, number], fov = 45, fx: Record<string, number> = {}): ShotDef {
  return { stage: 'field', pos, target, fov, fx: { wave: 1, flabels: 0, ...fx } };
}

const J = { aCardiff: 1, aHK: 1, aCanada: 1, aReturn: 1, pinJourney: 1 };
const H = CLINIC.H;

export function floorShot(i: number, extra: Record<string, number> = {}): ShotDef {
  const y = i * H;
  return gr([-25, y + 2.4, 11.2], [20, y + 1.2, -6], 58, { floor: i, floorOn: 1, xray: 1, floors: 0, ...extra });
}

export const SHOTS: Record<string, ShotDef> = {
  /* home */
  'home-hero': off(30, 62, 3.25, -0.62, -0.02, 38, { pins: 1, grid: 0.3 }),
  'home-astana': surf(36, 72, 1.72, 50.6, 71.4, 40, { pins: 1, grid: 0.7 }),
  'home-cardiff': surf(38, -2, 1.95, 50.5, -3, 40, { aCardiff: 1, pinJourney: 1, pins: 0.6 }),
  'home-hk': surf(8, 116, 2.0, 21, 114, 40, { aCardiff: 1, aHK: 1, pinJourney: 1, pins: 0.6 }),
  'home-canada': surf(30, -80, 2.0, 42.6, -79, 40, { aCardiff: 1, aHK: 1, aCanada: 1, pinJourney: 1, pins: 0.6 }),
  'home-return': off(38, 30, 3.05, 0.05, 0.02, 38, { ...J, pins: 1, grid: 0.4 }),
  'home-descent': surf(48.9, 71.43, 1.05, 51.13, 71.43, 52, { pins: 1, grid: 0.2 }),
  'ground-high': gr([0, 1150, 820], [0, 0, 0], 50, { pins: 1 }),
  'ground-city': gr([-240, 150, 300], [0, 18, 0], 45, { pins: 1, floors: 0 }),
  'ground-front': gr([22, 11, 72], [0, 12.5, 0], 46, { floors: 1, windows: 0.4 }),
  'clinic-section': gr([0, 15, 118], [0, 13, 0], 42, { floors: 1, xray: 0.7 }),
  'home-ascent': off(28, 52, 2.45, -0.35, 0.05, 40, { intl: 1, pins: 1, pulse: 1 }),
  'home-final': off(22, 71, 4.3, 0, -0.35, 36, { ...J, net: 1, pins: 1 }),

  /* about */
  'about-hero': gr([150, 55, 175], [0, 10, 0], 44, { floors: 0, windows: 0.5, pins: 1 }),
  'about-coords': surf(44, 71.4, 1.3, 51.1, 71.43, 44, { pins: 1, grid: 1 }),
  'about-city': gr([380, 260, -120], [0, 0, 60], 46, { pins: 1, windows: 0.8 }),

  /* founder — the route */
  'founder-hero': off(42, 38, 3.4, -0.62, 0, 38, { pinJourney: 1, pins: 1, grid: 0.3 }),
  'founder-cardiff': surf(40, -4, 1.7, 51.4, -3.2, 40, { aCardiff: 1, pinJourney: 1, pins: 0.5 }),
  'founder-kz': surf(38, 70, 1.8, 49.5, 71, 40, { aCardiff: 1, pinJourney: 1, pins: 1 }),
  'founder-trials': off(38, 175, 2.9, 0, 0, 40, { aCardiff: 1, aHK: 1, aCanada: 1, pinJourney: 1, pins: 0.6 }),
  'founder-myopia': surf(20, 100, 2.2, 35, 90, 44, { aCardiff: 1, aHK: 1, aCanada: 1, pinJourney: 1, grid: 1 }),
  'founder-papers': off(60, 40, 3.6, 0, 0.3, 36, { ...J, grid: 1 }),
  'founder-astana': surf(42, 71.4, 1.45, 51.1, 71.43, 42, { ...J, pins: 1 }),

  /* services & doctors */
  'doctors-hero': gr([70, 20, 90], [0, 12, 0], 44, { floors: 1, xray: 0.5, windows: 0.5 }),

  /* international */
  'intl-hero': off(36, 52, 2.7, -0.5, 0.05, 38, { pins: 1, intl: 0.05, grid: 0.3 }),
  'intl-arcs': off(38, 52, 2.2, 0, -0.1, 40, { pins: 1, intl: 1, pulse: 1, pinsIntl: 1 }),
  'arrive-1': gr([1310, 120, 1560], [1045, 0, 1375], 48, { path: 0.05, pins: 1 }),
  'arrive-2': gr([1250, 260, 900], [1045, 0, 300], 48, { path: 0.4, pins: 1 }),
  'arrive-3': gr([500, 210, 520], [275, 0, 275], 48, { path: 0.66, pins: 1 }),
  'arrive-4': gr([160, 90, 180], [40, 8, 40], 48, { path: 0.95, pins: 1, floors: 0 }),
  'arrive-5': gr([22, 11, 72], [0, 12.5, 0], 46, { path: 1, floors: 1 }),

  /* second opinion / consultation */
  'so-hero': off(40, 48, 2.5, -0.45, 0, 40, { intl: 1, pulse: 1.4, pins: 1 }),
  'so-steps': surf(44, 70, 1.5, 50.5, 71.4, 44, { intl: 1, pulse: 1, pins: 1 }),
  'oc-hero': off(30, 40, 2.8, -0.5, 0, 38, { intl: 1, pulse: 1, dir: -1, pins: 1 }),
  'oc-steps': off(35, 80, 2.3, 0.3, 0, 40, { net: 1, intl: 1, dir: -1, pins: 1 }),

  /* booking */
  'book-1': gr([-240, 150, 300], [0, 18, 0], 45, { pins: 1 }),
  'book-2': gr([-120, 70, 170], [0, 12, 0], 45, { floors: 0.4 }),
  'book-3': gr([-40, 26, 100], [0, 12, 0], 45, { floors: 1, xray: 0.3 }),
  'book-4': gr([22, 11, 72], [0, 12.5, 0], 46, { floors: 1, xray: 0.5 }),
  'book-5': gr([8, 4.5, 34], [0, 3.5, 0], 52, { floors: 1, xray: 0.8, floor: 0, floorOn: 0.6 }),
  'book-6': gr([-4, 2.3, 10], [12, 2.0, -4], 58, { floors: 1, xray: 1, floor: 0, floorOn: 1 }),

  /* knowledge (dynamic ids const-* / star-* resolved in the engine) */

  /* science */
  'field-wide': fld([7.5, 5.2, 10.5], [-2.6, 0.6, 0], 44, { flabels: 1, beam: 0.6 }),
  'field-fovea': fld([2.5, 3.2, 5.5], [0, -0.5, 0], 48, { flabels: 1, beam: 1 }),
  'field-beam': fld([4, 6.5, 7], [0, 4, 0], 44, { beam: 1 }),
  'field-layers': fld([9, 1.5, 6], [0, 1.5, 0], 44, { split: 0.6, flabels: 1, scan: 1 }),
  'field-scan': fld([0, 14, 6], [0, 0, 0], 42, { scan: 1, wave: 0.4 }),
  'field-deep': fld([-6, 1, 9], [2, 2, -2], 50, { split: 1, wave: 1.6, beam: 0.6 }),

  /* experts */
  'net-hero': off(40, 60, 3.3, -0.55, 0, 38, { net: 1, pins: 1, pinsNet: 1 }),
  'net-west': surf(35, -30, 2.6, 45, -40, 42, { net: 1, pins: 1, pinJourney: 1 }),
  'net-east': surf(28, 125, 2.4, 33, 125, 42, { net: 1, pins: 1, pinJourney: 1 }),
  'net-flow': off(45, 71, 2.0, 0, -0.2, 42, { net: 1, pins: 1, grid: 0.6 }),

  /* reviews, faq, contacts, account */
  'reviews-city': gr([-320, 230, -240], [0, 25, 0], 46, { windows: 1, pins: 1 }),
  'reviews-near': gr([-110, 60, 120], [0, 20, 0], 46, { windows: 1, floors: 1 }),
  faq: gr([46, 6, 58], [0, 9, 0], 48, { floors: 1, windows: 0.6 }),
  'faq-2': gr([-50, 30, 70], [0, 12, 0], 48, { floors: 1, xray: 0.4, windows: 0.6 }),
  'contacts-orbit': surf(46, 71.4, 1.32, 51.13, 71.43, 42, { pins: 1, grid: 1 }),
  'contacts-ground': gr([0, 520, 330], [0, 0, 0], 46, { pins: 1 }),
  'contacts-front': gr([22, 11, 72], [0, 12.5, 0], 46, { floors: 1, pins: 1 }),
  account: gr([95, 70, 115], [0, 12, 0], 44, { floors: 1, floorOn: 1, floor: 1, xray: 0.4 }),
  lost: off(-10, 200, 9, 0, 0, 30, { grid: 0.2 }),
};

export { DEPT_FLOOR } from './floors';
