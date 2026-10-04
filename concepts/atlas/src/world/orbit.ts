import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Camera,
} from 'three';
import { CITY_LIGHTS, DEG, PLACES, isLand, llToVec } from './geo';
import { C, POINT_FRAG_SOFT, glsl } from './palette';
import type { Quality, WorldLabel } from './types';
import knowledge from '../data/knowledge-index.json';

/** Sub-solar point over the Atlantic: Astana sits on the night side. */
export const SUN = llToVec(14, -40).normalize();

/** Arc definitions: id → [from, to]. The fx key with the same id draws it. */
const JOURNEY: Array<[string, string, string]> = [
  ['aCardiff', 'astana', 'cardiff'],
  ['aHK', 'cardiff', 'hongkong'],
  ['aCanada', 'hongkong', 'canada'],
  ['aReturn', 'canada', 'astana'],
];
const NETWORK = ['cardiff', 'hongkong', 'beijing', 'tokyo', 'usa', 'canada'];
const INBOUND = ['tashkent', 'bishkek', 'baku', 'tbilisi', 'istanbul', 'dubai', 'frankfurt'];

export const CONSTELLATION_ORDER = ['children', 'after40', 'surgery', 'retina', 'glaucoma', 'library', 'research', 'prevention'];
export const CONSTELLATION_LABELS: Record<string, string> = {
  children: 'Зрение детей',
  after40: 'Здоровье глаз после 40',
  surgery: 'Катаракта и рефракционная хирургия',
  retina: 'Сетчатка и макула',
  glaucoma: 'Глаукома',
  library: 'Библиотека заболеваний',
  research: 'Исследования простым языком',
  prevention: 'Профилактика',
};

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface OrbitWorld {
  scene: Scene;
  labels: WorldLabel[];
  /** Constellation centres and article stars (world space) for camera shots. */
  sky: { centres: Record<string, Vector3>; stars: Record<string, Vector3> };
  update(fx: Record<string, number>, time: number, camera: Camera, proj: number): void;
}

export function createOrbit(q: Quality): OrbitWorld {
  const scene = new Scene();
  const root = new Group();
  scene.add(root);
  const rnd = rand(7);
  const labels: WorldLabel[] = [];

  /* ---------------- occluder / planet body ---------------- */
  const bodyMat = new ShaderMaterial({
    uniforms: { uSun: { value: SUN }, uDeep: { value: C.deep }, uForest: { value: C.forest } },
    vertexShader: glsl`
      varying vec3 vN;
      void main(){ vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: glsl`
      uniform vec3 uSun; uniform vec3 uDeep; uniform vec3 uForest; varying vec3 vN;
      void main(){ float d = smoothstep(-0.2, 0.9, dot(vN, uSun)); gl_FragColor = vec4(mix(uDeep*0.8, uForest*0.9, d), 1.0); }`,
  });
  root.add(new Mesh(new SphereGeometry(0.994, 72, 48), bodyMat));

  /* ---------------- land / ocean point cloud ---------------- */
  {
    const N = q.high ? 120000 : 52000;
    const pos: number[] = [];
    const land: number[] = [];
    const rr: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const v = new Vector3();
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      v.set(Math.cos(th) * r, y, Math.sin(th) * r);
      const lat = Math.asin(v.y) / DEG;
      let lng = Math.atan2(v.z, -v.x) / DEG - 180;
      if (lng < -180) lng += 360;
      const isL = isLand(lat, lng);
      if (!isL && i % 7 !== 0) continue;
      pos.push(v.x, v.y, v.z);
      land.push(isL ? 1 : 0);
      rr.push(rnd());
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aLand', new BufferAttribute(new Float32Array(land), 1));
    g.setAttribute('aRand', new BufferAttribute(new Float32Array(rr), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProj: { value: 800 },
        uPR: { value: 1 },
        uSun: { value: SUN },
        uTime: { value: 0 },
        uSize: { value: q.high ? 0.0072 : 0.0095 },
        uDay: { value: C.sage },
        uNight: { value: C.moss.clone().lerp(C.sage, 0.45) },
        uSea: { value: C.forest },
        uGold: { value: C.gold },
        uFocus: { value: llToVec(PLACES.astana.lat, PLACES.astana.lng) },
      },
      vertexShader: glsl`
        attribute float aLand; attribute float aRand;
        uniform float uProj; uniform float uSize; uniform vec3 uSun; uniform float uTime; uniform vec3 uFocus; uniform float uPR;
        uniform vec3 uDay; uniform vec3 uNight; uniform vec3 uSea; uniform vec3 uGold;
        varying vec3 vCol; varying float vA;
        void main(){
          vec3 n = normalize(position);
          float day = smoothstep(-0.12, 0.45, dot(n, uSun));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float s = uSize * (aLand > 0.5 ? 1.0 : 0.7) * (0.8 + aRand * 0.45);
          gl_PointSize = clamp(s * uProj / -mv.z, 1.1, 4.2 * uPR);
          vec3 landCol = mix(uNight, uDay, day);
          // warm halo around Astana
          float f = smoothstep(0.06, 0.0, distance(n, uFocus));
          landCol = mix(landCol, uGold, f * 0.7);
          vCol = aLand > 0.5 ? landCol * 1.15 : uSea * (1.3 + day * 0.9);
          float shimmer = 0.85 + 0.15 * sin(uTime * 0.8 + aRand * 40.0);
          vA = (aLand > 0.5 ? 1.0 : 0.6) * shimmer;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: glsl`
        varying vec3 vCol; varying float vA;
        void main(){ ${POINT_FRAG_SOFT} if (disc < 0.02) discard; gl_FragColor = vec4(vCol, disc * vA); }`,
    });
    const pts = new Points(g, m);
    pts.userData.mat = m;
    root.add(pts);
    root.userData.land = m;
  }

  /* ---------------- city lights ---------------- */
  {
    const pos: number[] = [];
    const amp: number[] = [];
    const K = q.high ? 46 : 20;
    const v = new Vector3();
    const gauss = () => {
      let u = 0;
      for (let i = 0; i < 4; i++) u += rnd();
      return (u - 2) / 0.58;
    };
    for (const [lat, lng, w] of CITY_LIGHTS) {
      const n = Math.round(K * w);
      const sig = 0.28 * Math.sqrt(w);
      for (let i = 0; i < n; i++) {
        const la = lat + gauss() * sig;
        const ln = lng + (gauss() * sig) / Math.max(0.3, Math.cos(lat * DEG));
        if (!isLand(la, ln) && rnd() > 0.25) continue;
        llToVec(la, ln, 1.002, v);
        pos.push(v.x, v.y, v.z);
        amp.push(0.3 + rnd() * 0.55 * Math.min(1, w / 1.5));
      }
    }
    // rural scatter
    const rural = q.high ? 5200 : 2000;
    let placed = 0;
    for (let tries = 0; placed < rural && tries < rural * 30; tries++) {
      const la = -45 + rnd() * 110;
      const ln = -180 + rnd() * 360;
      if (!isLand(la, ln)) continue;
      llToVec(la, ln, 1.002, v);
      pos.push(v.x, v.y, v.z);
      amp.push(0.08 + rnd() * 0.18);
      placed++;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aAmp', new BufferAttribute(new Float32Array(amp), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uProj: { value: 800 }, uSun: { value: SUN }, uTime: { value: 0 }, uGold: { value: C.ember }, uCream: { value: C.cream }, uBoost: { value: 1 } },
      vertexShader: glsl`
        attribute float aAmp; uniform float uProj; uniform vec3 uSun; uniform float uTime; uniform float uBoost;
        varying float vA; varying float vHot;
        void main(){
          vec3 n = normalize(position);
          float night = smoothstep(0.25, -0.2, dot(n, uSun));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float tw = 0.8 + 0.2 * sin(uTime * 2.0 + position.x * 400.0 + position.z * 300.0);
          vA = aAmp * (0.18 + 0.82 * night) * tw * uBoost;
          vHot = aAmp;
          gl_PointSize = clamp((0.0032 + aAmp * 0.0042) * uProj / -mv.z, 1.2, 9.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: glsl`
        uniform vec3 uGold; uniform vec3 uCream; varying float vA; varying float vHot;
        void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(mix(uGold, uCream, vHot * 0.5) * disc * vA, 1.0); }`,
    });
    root.add(new Points(g, m));
    root.userData.lights = m;
  }

  /* ---------------- graticule ---------------- */
  {
    const seg: number[] = [];
    const a = new Vector3();
    const b = new Vector3();
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lng = -180; lng < 180; lng += 3) {
        llToVec(lat, lng, 1.004, a);
        llToVec(lat, lng + 3, 1.004, b);
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    for (let lng = -180; lng < 180; lng += 15) {
      for (let lat = -84; lat < 84; lat += 3) {
        llToVec(lat, lng, 1.004, a);
        llToVec(lat + 3, lng, 1.004, b);
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    const m = new LineBasicMaterial({ color: C.gold, transparent: true, opacity: 0.07, depthWrite: false });
    root.add(new LineSegments(g, m));
    root.userData.grat = m;
  }

  /* ---------------- atmosphere ---------------- */
  {
    const m = new ShaderMaterial({
      side: BackSide,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uCenter: { value: new Vector3() }, uSunV: { value: new Vector3() }, uTeal: { value: C.sage }, uGold: { value: C.gold } },
      vertexShader: glsl`
        varying vec3 vP; varying vec3 vWN;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vP = mv.xyz; vWN = normalize(position); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: glsl`
        uniform vec3 uCenter; uniform vec3 uSunV; uniform vec3 uTeal; uniform vec3 uGold; varying vec3 vP; varying vec3 vWN;
        void main(){
          vec3 I = normalize(vP);
          float t = dot(uCenter, I);
          float d = length(uCenter - I * t);
          float R = 1.0; float Ra = 1.16;
          float g = 1.0 - smoothstep(R * 0.985, Ra, d);
          g = pow(g, 2.4);
          float sunny = smoothstep(-0.4, 0.8, dot(vWN, uSunV));
          vec3 col = mix(uTeal * 0.55, uGold * 1.1, sunny);
          gl_FragColor = vec4(col * g * (0.35 + 0.9 * sunny), 1.0);
        }`,
    });
    root.add(new Mesh(new SphereGeometry(1.16, 64, 48), m));
    root.userData.atmo = m;
  }

  /* ---------------- arcs (gold light trails) ---------------- */
  const arcMats: Record<string, ShaderMaterial> = {};
  const arcMat = () =>
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uProj: { value: 800 },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uDir: { value: 1 },
        uGold: { value: C.ember },
        uCream: { value: C.cream },
      },
      vertexShader: glsl`
        attribute float aU; attribute float aSeed;
        uniform float uProj; uniform float uProgress; uniform float uTime; uniform float uPulse; uniform float uDir;
        varying float vA; varying float vHead;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float drawn = step(aU, uProgress) * step(0.0005, uProgress);
          float head = exp(-max(0.0, uProgress - aU) * 18.0) * drawn * step(uProgress, 0.999);
          float u2 = uDir > 0.0 ? aU : 1.0 - aU;
          float pulse = pow(max(0.0, sin((u2 * 3.0 - uTime * 0.45 + aSeed) * 6.2831)), 18.0) * uPulse;
          vA = drawn * (0.22 + head * 1.2 + pulse * 0.75);
          vHead = min(1.0, head + pulse);
          gl_PointSize = clamp((0.0045 + vHead * 0.0055) * uProj / -mv.z, 1.2, 10.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: glsl`
        uniform vec3 uGold; uniform vec3 uCream; varying float vA; varying float vHead;
        void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(mix(uGold, uCream, clamp(vHead,0.0,1.0)) * disc * vA, 1.0); }`,
    });

  function arcGeometry(pairs: Array<[string, string]>, per: number) {
    const pos: number[] = [];
    const us: number[] = [];
    const seeds: number[] = [];
    const a = new Vector3();
    const b = new Vector3();
    const p = new Vector3();
    pairs.forEach(([from, to], k) => {
      llToVec(PLACES[from].lat, PLACES[from].lng, 1, a);
      llToVec(PLACES[to].lat, PLACES[to].lng, 1, b);
      const ang = a.angleTo(b);
      const h = 0.04 + ang * 0.2;
      for (let i = 0; i <= per; i++) {
        const u = i / per;
        // slerp
        const s = Math.sin(ang);
        const w1 = Math.sin((1 - u) * ang) / s;
        const w2 = Math.sin(u * ang) / s;
        p.set(a.x * w1 + b.x * w2, a.y * w1 + b.y * w2, a.z * w1 + b.z * w2).normalize();
        p.multiplyScalar(1.004 + Math.sin(Math.PI * u) * h);
        pos.push(p.x, p.y, p.z);
        us.push(u);
        seeds.push(k * 0.37);
      }
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aU', new BufferAttribute(new Float32Array(us), 1));
    g.setAttribute('aSeed', new BufferAttribute(new Float32Array(seeds), 1));
    return g;
  }
  const per = q.high ? 260 : 140;
  for (const [id, from, to] of JOURNEY) {
    const m = arcMat();
    arcMats[id] = m;
    root.add(new Points(arcGeometry([[from, to]], per), m));
  }
  {
    const m = arcMat();
    arcMats.net = m;
    root.add(new Points(arcGeometry(NETWORK.map((c) => [c, 'astana'] as [string, string]), per), m));
    const m2 = arcMat();
    arcMats.intl = m2;
    root.add(new Points(arcGeometry(INBOUND.map((c) => [c, 'astana'] as [string, string]), Math.round(per * 0.6)), m2));
  }

  /* ---------------- markers ---------------- */
  const markerIds = ['astana', 'cardiff', 'hongkong', 'canada', 'beijing', 'tokyo', 'usa', ...INBOUND];
  const markerFx: Record<string, string> = {
    astana: 'pins',
    cardiff: 'pinJourney',
    hongkong: 'pinJourney',
    canada: 'pinJourney',
    beijing: 'net',
    tokyo: 'net',
    usa: 'net',
  };
  INBOUND.forEach((id) => (markerFx[id] = 'intl'));
  const markerMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uVis: { value: new Float32Array(16) }, uPR: { value: 1 }, uGold: { value: C.ember } },
    vertexShader: glsl`
      attribute float aIdx; uniform float uVis[16]; uniform float uPR; uniform float uTime;
      varying float vV; varying float vBig;
      void main(){
        int i = int(aIdx + 0.5);
        vV = uVis[i];
        vBig = aIdx < 0.5 ? 1.0 : 0.0;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (aIdx < 0.5 ? 46.0 : 30.0) * uPR * (0.9 + 0.1 * sin(uTime * 2.0 + aIdx));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: glsl`
      uniform vec3 uGold; uniform float uTime; varying float vV; varying float vBig;
      void main(){
        vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0;
        float ph = fract(uTime * 0.5);
        float ring = smoothstep(0.06, 0.0, abs(d - (0.35 + ph * 0.6))) * (1.0 - ph);
        float ring2 = smoothstep(0.035, 0.0, abs(d - 0.42)) * 0.8;
        float dot_ = smoothstep(0.16, 0.05, d);
        float a = (ring * 0.9 + ring2 + dot_) * vV;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uGold * a, 1.0);
      }`,
  });
  {
    const pos: number[] = [];
    const idx: number[] = [];
    const v = new Vector3();
    markerIds.forEach((id, i) => {
      llToVec(PLACES[id].lat, PLACES[id].lng, 1.006, v);
      pos.push(v.x, v.y, v.z);
      idx.push(i);
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aIdx', new BufferAttribute(new Float32Array(idx), 1));
    root.add(new Points(g, markerMat));
  }
  const fmt = (n: number, pos: string, neg: string) => `${Math.abs(n).toFixed(2)}°${n >= 0 ? pos : neg}`;
  for (const id of markerIds) {
    const p = PLACES[id];
    labels.push({
      id: `pin-${id}`,
      text: p.name,
      sub: `${fmt(p.lat, 'N', 'S')} ${fmt(p.lng, 'E', 'W')}`,
      pos: llToVec(p.lat, p.lng, 1.02),
      fx: markerFx[id],
      kind: id === 'astana' ? 'hub' : 'city',
      occlude: true,
    });
  }

  /* ---------------- Astana beacon ---------------- */
  {
    const pos: number[] = [];
    const t: number[] = [];
    const base = llToVec(PLACES.astana.lat, PLACES.astana.lng, 1);
    const n = 120;
    for (let i = 0; i < n; i++) {
      const u = i / n;
      const p = base.clone().multiplyScalar(1 + u * 0.22);
      pos.push(p.x, p.y, p.z);
      t.push(u);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aU', new BufferAttribute(new Float32Array(t), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uProj: { value: 800 }, uTime: { value: 0 }, uVis: { value: 0 }, uGold: { value: C.ember } },
      vertexShader: glsl`
        attribute float aU; uniform float uProj; uniform float uTime; uniform float uVis; varying float vA;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          float flow = 0.5 + 0.5 * sin(aU * 30.0 - uTime * 4.0);
          vA = (1.0 - aU) * uVis * (0.4 + 0.6 * flow);
          gl_PointSize = clamp(0.012 * uProj / -mv.z, 1.0, 9.0);
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: glsl`
        uniform vec3 uGold; varying float vA; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(uGold * disc * vA, 1.0); }`,
    });
    root.add(new Points(g, m));
    root.userData.beacon = m;
  }

  /* ---------------- stars + constellations ---------------- */
  const sky = { centres: {} as Record<string, Vector3>, stars: {} as Record<string, Vector3> };
  {
    const n = q.high ? 5200 : 2400;
    const pos: number[] = [];
    const sz: number[] = [];
    const v = new Vector3();
    for (let i = 0; i < n; i++) {
      v.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      if (v.lengthSq() > 1 || v.lengthSq() < 0.01) {
        i--;
        continue;
      }
      v.normalize().multiplyScalar(90 + rnd() * 40);
      pos.push(v.x, v.y, v.z);
      sz.push(Math.pow(rnd(), 3));
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aSize', new BufferAttribute(new Float32Array(sz), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uCream: { value: C.cream } },
      vertexShader: glsl`
        attribute float aSize; uniform float uTime; uniform float uPR; varying float vA;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          vA = (0.25 + aSize * 0.75) * (0.7 + 0.3 * sin(uTime * (0.6 + aSize * 2.0) + position.x));
          gl_PointSize = (1.0 + aSize * 2.6) * uPR;
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: glsl`
        uniform vec3 uCream; varying float vA; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(uCream * disc * vA * 0.8, 1.0); }`,
    });
    root.add(new Points(g, m));
    root.userData.stars = m;
  }
  {
    // Constellations of knowledge topics. Centre directions lie on an arc of sky
    // "above" Astana so the planet can stay in the lower part of the frame.
    const up = llToVec(PLACES.astana.lat, PLACES.astana.lng, 1).normalize();
    const side = new Vector3().crossVectors(up, new Vector3(0, 1, 0)).normalize();
    const fwd = new Vector3().crossVectors(side, up).normalize();
    const cr = rand(42);
    const pos: number[] = [];
    const seg: number[] = [];
    const cat: number[] = [];
    const segCat: number[] = [];
    CONSTELLATION_ORDER.forEach((id, k) => {
      const ang = (k / (CONSTELLATION_ORDER.length - 1) - 0.5) * 1.9; // spread
      const elev = 0.55 + (k % 2) * 0.28;
      const dir = up.clone().multiplyScalar(Math.cos(ang) * elev + 0.25)
        .add(side.clone().multiplyScalar(Math.sin(ang)))
        .add(fwd.clone().multiplyScalar(0.35 * Math.cos(ang)))
        .normalize();
      const centre = dir.clone().multiplyScalar(40);
      sky.centres[id] = centre;
      labels.push({ id: `const-${id}`, text: CONSTELLATION_LABELS[id], pos: centre.clone().add(up.clone().multiplyScalar(-3.2)), fx: 'stars', kind: 'star' });
      const arts = (knowledge as Array<{ slug: string; category: string }>).filter((a) => a.category === id);
      const pts: Vector3[] = [];
      const count = Math.max(3, arts.length + 2);
      for (let i = 0; i < count; i++) {
        const off = new Vector3((cr() - 0.5) * 7, (cr() - 0.5) * 5, (cr() - 0.5) * 7);
        const p = centre.clone().add(off);
        pts.push(p);
        pos.push(p.x, p.y, p.z);
        cat.push(k + (i < arts.length ? 0.5 : 0));
        if (i < arts.length) {
          sky.stars[arts[i].slug] = p;
          const t = (arts[i] as unknown as { title: string }).title;
          labels.push({ id: `star-${arts[i].slug}`, text: t.length > 44 ? `${t.slice(0, 42).trim()}…` : t, pos: p, fx: 'stars', kind: 'field', group: k });
        }
      }
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
        segCat.push(k, k);
      }
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aCat', new BufferAttribute(new Float32Array(cat), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uVis: { value: 0 }, uSel: { value: -1 }, uGold: { value: C.ember } },
      vertexShader: glsl`
        attribute float aCat; uniform float uTime; uniform float uPR; uniform float uVis; uniform float uSel; varying float vA;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          float art = fract(aCat) > 0.25 ? 1.0 : 0.0;
          float sel = abs(floor(aCat) - uSel) < 0.5 ? 1.0 : 0.0;
          vA = uVis * (0.55 + art * 0.45) * (0.8 + 0.2 * sin(uTime * 1.7 + aCat * 9.0));
          gl_PointSize = (art > 0.5 ? 26.0 : 11.0) * uPR * (1.0 + sel * 0.5);
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: glsl`
        uniform vec3 uGold; varying float vA;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c);
          float core = smoothstep(0.5, 0.0, d);
          float glow = pow(core, 1.6) * 0.55 + pow(core, 10.0) * 2.2;
          float spike = max(smoothstep(0.02, 0.0, abs(c.x)), smoothstep(0.02, 0.0, abs(c.y))) * smoothstep(0.5, 0.05, d) * 0.7;
          gl_FragColor = vec4(uGold * (glow + spike) * vA, 1.0); }`,
    });
    root.add(new Points(g, m));
    const lg = new BufferGeometry();
    lg.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    lg.setAttribute('aCat', new BufferAttribute(new Float32Array(segCat), 1));
    const lm = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uVis: { value: 0 }, uSel: { value: -1 }, uGold: { value: C.gold } },
      vertexShader: glsl`attribute float aCat; uniform float uSel; varying float vS; void main(){ vS = abs(aCat - uSel) < 0.5 ? 1.0 : 0.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: glsl`uniform vec3 uGold; uniform float uVis; varying float vS; void main(){ gl_FragColor = vec4(uGold * uVis * (0.28 + vS * 0.5), 1.0); }`,
    });
    root.add(new LineSegments(lg, lm));
    root.userData.const = m;
    root.userData.constLines = lm;
  }

  const centerV = new Vector3();
  const sunV = new Vector3();

  return {
    scene,
    labels,
    sky,
    update(fx, time, camera, proj) {
      const u = root.userData;
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      (u.land as ShaderMaterial).uniforms.uProj.value = proj;
      (u.land as ShaderMaterial).uniforms.uTime.value = time;
      (u.land as ShaderMaterial).uniforms.uPR.value = pr;
      (u.lights as ShaderMaterial).uniforms.uProj.value = proj;
      (u.lights as ShaderMaterial).uniforms.uTime.value = time;
      (u.grat as LineBasicMaterial).opacity = 0.05 + (fx.grid ?? 0) * 0.12;
      const beacon = u.beacon as ShaderMaterial;
      beacon.uniforms.uProj.value = proj;
      beacon.uniforms.uTime.value = time;
      beacon.uniforms.uVis.value = fx.pins ?? 0;
      centerV.set(0, 0, 0).applyMatrix4(camera.matrixWorldInverse);
      sunV.copy(SUN);
      const atmo = u.atmo as ShaderMaterial;
      atmo.uniforms.uCenter.value.copy(centerV);
      atmo.uniforms.uSunV.value.copy(sunV);
      for (const [id, m] of Object.entries(arcMats)) {
        m.uniforms.uProj.value = proj;
        m.uniforms.uTime.value = time;
        m.uniforms.uProgress.value = Math.min(1.0001, fx[id] ?? 0);
        m.uniforms.uPulse.value = id === 'intl' ? (fx.pulse ?? 0.5) : id === 'net' ? 0.7 : 0.9;
        m.uniforms.uDir.value = id === 'intl' ? (fx.dir ?? 1) : 1;
      }
      const vis = markerMat.uniforms.uVis.value as Float32Array;
      markerIds.forEach((id, i) => (vis[i] = Math.min(1, fx[markerFx[id]] ?? 0)));
      markerMat.uniforms.uTime.value = time;
      markerMat.uniforms.uPR.value = pr;
      const st = u.stars as ShaderMaterial;
      st.uniforms.uTime.value = time;
      st.uniforms.uPR.value = pr;
      const cm = u.const as ShaderMaterial;
      cm.uniforms.uTime.value = time;
      cm.uniforms.uPR.value = pr;
      cm.uniforms.uVis.value = fx.stars ?? 0;
      cm.uniforms.uSel.value = fx.sel ?? -1;
      const cl = u.constLines as ShaderMaterial;
      cl.uniforms.uVis.value = fx.stars ?? 0;
      cl.uniforms.uSel.value = fx.sel ?? -1;
    },
  };
}
