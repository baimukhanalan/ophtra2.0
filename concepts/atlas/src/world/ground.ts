import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  EdgesGeometry,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
} from 'three';
import { C, POINT_FRAG_SOFT, glsl } from './palette';
import type { Quality, WorldLabel } from './types';

export const CLINIC = { W: 64, D: 28, H: 4.4, floors: 6 };
export const FLOOR_NAMES = [
  'Отделение диагностики',
  'Лечение заболеваний глаз',
  'Лазерная коррекция',
  'Хирургия катаракты',
  'Детская офтальмология',
  'Оптический салон',
];
const PITCH = 110;
const ROAD = 30;

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const FOG = glsl`
  uniform vec3 uFogColor; uniform float uFogDensity;
  vec3 applyFog(vec3 col, float dist){ float f = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist); return mix(col, uFogColor, clamp(f, 0.0, 1.0)); }
`;

export function riverZ(x: number) {
  return 520 + Math.sin(x * 0.0024 + 0.6) * 170;
}

export interface GroundWorld {
  scene: Scene;
  labels: WorldLabel[];
  update(fx: Record<string, number>, time: number, camPos: Vector3, proj: number): void;
}

export function createGround(q: Quality): GroundWorld {
  const scene = new Scene();
  const rnd = rand(11);
  const labels: WorldLabel[] = [];
  const fogU = { uFogColor: { value: C.deep.clone() }, uFogDensity: { value: 0.00085 } };

  /* ---------------- terrain ---------------- */
  const terrainMat = new ShaderMaterial({
    defines: q.high ? {} : { LOW: 1 },
    uniforms: {
      ...fogU,
      uTime: { value: 0 },
      uForest: { value: C.forest },
      uDeep: { value: C.deep },
      uGold: { value: C.gold },
      uEmber: { value: C.ember },
      uExtent: { value: q.high ? 1400 : 950 },
    },
    vertexShader: glsl`
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: glsl`
      ${FOG}
      uniform float uTime; uniform vec3 uForest; uniform vec3 uDeep; uniform vec3 uGold; uniform vec3 uEmber; uniform float uExtent;
      varying vec3 vW;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*n2(p); p*=2.03; a*=0.5; } return s; }
      void main(){
        vec2 p = vW.xz;
        float city = 1.0 - smoothstep(uExtent - 100.0, uExtent + 250.0, max(abs(p.x), abs(p.y)));
        vec3 col = mix(uDeep * 0.9, uForest * 0.85, fbm(p * 0.004) * 0.8);
        // road grid
        vec2 t = mod(p - ${PITCH / 2}.0, ${PITCH}.0);
        vec2 d = min(t, ${PITCH}.0 - t);
        float road = max(1.0 - smoothstep(${ROAD / 2 - 2}.0, ${ROAD / 2}.0, d.x), 1.0 - smoothstep(${ROAD / 2 - 2}.0, ${ROAD / 2}.0, d.y)) * city;
        col = mix(col, uDeep * 0.55, road);
        // lamps along roads
        vec2 along = mod(p, 24.0) - 12.0;
        float lampX = smoothstep(1.6, 0.0, length(vec2(d.x - 13.0, along.y))) * city;
        float lampY = smoothstep(1.6, 0.0, length(vec2(d.y - 13.0, along.x))) * city;
        col += uEmber * (lampX + lampY) * 0.9;
        // centre line glow
        float cl = max(smoothstep(0.35, 0.0, d.x) * (1.0 - step(d.y, 15.0)), smoothstep(0.35, 0.0, d.y) * (1.0 - step(d.x, 15.0))) * city;
        col += uGold * cl * 0.18;
        // river Esil
        float rz = ${520}.0 + sin(p.x * 0.0024 + 0.6) * 170.0;
        float rd = abs(p.y - rz);
        float river = 1.0 - smoothstep(38.0, 46.0, rd);
        float shimmer = pow(n2(vec2(p.x * 0.05 - uTime * 0.4, p.y * 0.2)), 6.0);
        col = mix(col, uDeep * 0.35 + uGold * shimmer * 0.5, river);
        col += uGold * smoothstep(3.0, 0.0, abs(rd - 44.0)) * 0.25;
        // steppe texture beyond the city
        #ifndef LOW
        col += uForest * (1.0 - city) * fbm(p * 0.02) * 0.25;
        #endif
        float dist = length(vW - cameraPosition);
        gl_FragColor = vec4(applyFog(col, dist), 1.0);
      }`,
  });
  const terrain = new Mesh(new PlaneGeometry(9000, 9000, 1, 1), terrainMat);
  terrain.rotation.x = -Math.PI / 2;
  scene.add(terrain);

  /* ---------------- city blocks ---------------- */
  const extent = q.high ? 1400 : 950;
  const mats: Matrix4[] = [];
  const seeds: number[] = [];
  const m4 = new Matrix4();
  const n = Math.floor(extent / PITCH);
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const cx = i * PITCH;
      const cz = j * PITCH;
      if (Math.abs(i) <= 0 && Math.abs(j) <= 0) continue; // clinic plaza
      if (Math.abs(cz - riverZ(cx)) < 95) continue;
      if (i === -2 && j === -3) continue; // monument plaza
      const r = Math.hypot(cx, cz);
      const k = 1 + Math.floor(rnd() * 3);
      const blk = PITCH - ROAD - 6;
      for (let b = 0; b < k; b++) {
        const w = 14 + rnd() * (blk / k - 12);
        const d = 16 + rnd() * (blk - 30);
        const tall = rnd() < 0.18 + Math.max(0, 0.35 - r / 3000);
        let h = tall ? 45 + rnd() * 95 : 9 + rnd() * 22;
        if (Math.abs(i) <= 2 && Math.abs(j) <= 2) h = j < 0 && tall ? 60 + rnd() * 40 : 9 + rnd() * 16; // residential towers behind the clinic, low blocks in front
        const ox = cx - blk / 2 + (blk / k) * (b + 0.5);
        const oz = cz + (rnd() - 0.5) * (blk - d);
        m4.makeScale(w, h, d);
        m4.setPosition(ox, 0, oz);
        mats.push(m4.clone());
        seeds.push(rnd());
      }
    }
  }
  const boxGeo = new BoxGeometry(1, 1, 1);
  boxGeo.translate(0, 0.5, 0);
  const buildingMat = new ShaderMaterial({
    uniforms: {
      ...fogU,
      uBody: { value: C.deep.clone().multiplyScalar(1.15) },
      uEdge: { value: C.goldDeep },
      uWin: { value: C.ember },
      uLit: { value: 0.35 },
      uTime: { value: 0 },
    },
    vertexShader: glsl`
      attribute float aSeed;
      varying vec3 vLocal; varying vec3 vScale; varying vec3 vN; varying float vSeed; varying vec3 vW;
      void main(){
        vLocal = position; vN = normal; vSeed = aSeed;
        vScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: glsl`
      ${FOG}
      uniform vec3 uBody; uniform vec3 uEdge; uniform vec3 uWin; uniform float uLit; uniform float uTime;
      varying vec3 vLocal; varying vec3 vScale; varying vec3 vN; varying float vSeed; varying vec3 vW;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      void main(){
        vec3 m = vec3((0.5 - abs(vLocal.x)) * vScale.x, min(vLocal.y, 1.0 - vLocal.y) * vScale.y, (0.5 - abs(vLocal.z)) * vScale.z);
        float mn = min(m.x, min(m.y, m.z)); float mx = max(m.x, max(m.y, m.z)); float mid = m.x + m.y + m.z - mn - mx;
        float w = max(0.22, fwidth(mid) * 1.3);
        float edge = 1.0 - smoothstep(w * 0.5, w * 1.5, mid);
        vec3 col = uBody * (0.75 + 0.25 * vLocal.y);
        float dist = length(vW - cameraPosition);
        if (abs(vN.y) < 0.5) {
          float u = abs(vN.x) > 0.5 ? (vLocal.z + 0.5) * vScale.z : (vLocal.x + 0.5) * vScale.x;
          float v = vLocal.y * vScale.y;
          vec2 g = vec2(u / 3.4, v / 3.3);
          vec2 cell = floor(g); vec2 f = fract(g);
          float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.82);
          float hv = hash(cell + vSeed * 97.0 + (abs(vN.x) > 0.5 ? 13.0 : 0.0));
          float lit = step(hv, uLit) * step(1.0, cell.y);
          float warm = hash(cell * 1.7 + vSeed);
          float fade = 1.0 - smoothstep(600.0, 1400.0, dist);
          col += mix(uWin, vec3(0.95, 0.93, 0.88), warm * 0.4) * win * lit * (0.55 + 0.45 * warm) * (0.35 + fade * 0.65);
          col += uEdge * win * 0.035;
        }
        col = mix(col, uEdge * 1.1, edge * 0.85);
        gl_FragColor = vec4(applyFog(col, dist), 1.0);
      }`,
  });
  const city = new InstancedMesh(boxGeo, buildingMat, mats.length);
  mats.forEach((m, i) => city.setMatrixAt(i, m));
  boxGeo.setAttribute('aSeed', new InstancedBufferAttribute(new Float32Array(seeds), 1));
  city.frustumCulled = false;
  scene.add(city);

  /* ---------------- traffic (moving lights) ---------------- */
  const traffic = (() => {
    const N = q.high ? 2600 : 1000;
    const pos = new Float32Array(N * 3);
    const road: number[] = [];
    const axis: number[] = [];
    const speed: number[] = [];
    const phase: number[] = [];
    const side: number[] = [];
    for (let i = 0; i < N; i++) {
      road.push(Math.floor((rnd() * 2 - 1) * n) * PITCH + PITCH / 2);
      axis.push(rnd() < 0.5 ? 0 : 1);
      speed.push(8 + rnd() * 14);
      phase.push(rnd());
      side.push(rnd() < 0.5 ? -1 : 1);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aRoad', new BufferAttribute(new Float32Array(road), 1));
    g.setAttribute('aAxis', new BufferAttribute(new Float32Array(axis), 1));
    g.setAttribute('aSpeed', new BufferAttribute(new Float32Array(speed), 1));
    g.setAttribute('aPhase', new BufferAttribute(new Float32Array(phase), 1));
    g.setAttribute('aSide', new BufferAttribute(new Float32Array(side), 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { ...fogU, uTime: { value: 0 }, uProj: { value: 800 }, uL: { value: extent * 2 }, uCream: { value: C.cream }, uEmber: { value: C.ember } },
      vertexShader: glsl`
        attribute float aRoad; attribute float aAxis; attribute float aSpeed; attribute float aPhase; attribute float aSide;
        uniform float uTime; uniform float uProj; uniform float uL; varying float vA; varying float vS; varying float vD;
        void main(){
          float along = mod(aPhase * uL + uTime * aSpeed * aSide, uL) - uL * 0.5;
          float cross_ = aRoad + aSide * 5.0;
          vec3 p = aAxis < 0.5 ? vec3(along, 1.0, cross_) : vec3(cross_, 1.0, along);
          vec4 mv = viewMatrix * vec4(p, 1.0);
          vD = -mv.z;
          gl_PointSize = clamp(2.6 * uProj / -mv.z, 1.0, 14.0);
          vA = 1.0 - smoothstep(uL * 0.42, uL * 0.5, abs(along));
          vS = aSide;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: glsl`
        uniform vec3 uCream; uniform vec3 uEmber; uniform float uFogDensity; varying float vA; varying float vS; varying float vD;
        void main(){ ${POINT_FRAG_SOFT} float f = exp(-uFogDensity * uFogDensity * vD * vD);
          gl_FragColor = vec4((vS > 0.0 ? uCream : uEmber) * disc * vA * f, 1.0); }`,
    });
    const p = new Points(g, m);
    p.frustumCulled = false;
    scene.add(p);
    return m;
  })();

  /* ---------------- monuments (stylised) ---------------- */
  const lineMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { ...fogU, uCol: { value: C.gold }, uA: { value: 0.75 } },
    vertexShader: glsl`varying float vD; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: glsl`uniform vec3 uCol; uniform float uA; uniform float uFogDensity; varying float vD;
      void main(){ float f = exp(-uFogDensity * uFogDensity * vD * vD * 0.6); gl_FragColor = vec4(uCol * uA * f, 1.0); }`,
  });
  {
    // Bayterek-like tower: lattice trunk + golden sphere
    const seg: number[] = [];
    const bx = -2 * PITCH;
    const bz = -3 * PITCH;
    const H = 86;
    const ribs = 14;
    for (let r = 0; r < ribs; r++) {
      const a = (r / ribs) * Math.PI * 2;
      let px = bx + Math.cos(a) * 3;
      let py = 0;
      let pz = bz + Math.sin(a) * 3;
      for (let s = 1; s <= 20; s++) {
        const t = s / 20;
        const rad = 3 + Math.pow(t, 3) * 12;
        const tw = a + t * 0.9;
        const nx = bx + Math.cos(tw) * rad;
        const ny = t * H;
        const nz = bz + Math.sin(tw) * rad;
        seg.push(px, py, pz, nx, ny, nz);
        px = nx;
        py = ny;
        pz = nz;
      }
    }
    // sphere
    const R = 11;
    for (let la = -80; la <= 80; la += 20) {
      for (let lo = 0; lo < 360; lo += 15) {
        const f = (d: number) => (d * Math.PI) / 180;
        const p1 = [bx + R * Math.cos(f(la)) * Math.cos(f(lo)), H + 6 + R * Math.sin(f(la)), bz + R * Math.cos(f(la)) * Math.sin(f(lo))];
        const p2 = [bx + R * Math.cos(f(la)) * Math.cos(f(lo + 15)), H + 6 + R * Math.sin(f(la)), bz + R * Math.cos(f(la)) * Math.sin(f(lo + 15))];
        seg.push(...p1, ...p2);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    scene.add(new LineSegments(g, lineMat));
  }
  if (q.high) {
    // Tent-like landmark on the horizon
    const seg: number[] = [];
    const tx = -8 * PITCH;
    const tz = -6 * PITCH;
    const apex = [tx + 20, 150, tz];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const b = ((i + 1) / 36) * Math.PI * 2;
      const p = [tx + Math.cos(a) * 95, 0, tz + Math.sin(a) * 70];
      const p2 = [tx + Math.cos(b) * 95, 0, tz + Math.sin(b) * 70];
      seg.push(...p, ...apex, ...p, ...p2);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    scene.add(new LineSegments(g, lineMat));
  }

  /* ---------------- the clinic ---------------- */
  const clinic = new Group();
  scene.add(clinic);
  const { W, D, H, floors } = CLINIC;
  const floorMats: ShaderMaterial[] = [];
  const edgeMats: ShaderMaterial[] = [];
  const edgeMat = (base: number) =>
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uCol: { value: C.cream.clone() }, uA: { value: base }, uGold: { value: C.ember } , uHi: { value: 0 } },
      vertexShader: glsl`void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: glsl`uniform vec3 uCol; uniform vec3 uGold; uniform float uA; uniform float uHi; void main(){ gl_FragColor = vec4(mix(uCol, uGold, uHi) * (uA + uHi * 0.6), 1.0); }`,
    });
  for (let f = 0; f < floors; f++) {
    const y0 = f * H;
    const fl = new Group();
    fl.position.y = y0;
    clinic.add(fl);
    // floor surface with tile grid
    const fm = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: { uHi: { value: 0 }, uTime: { value: 0 }, uGold: { value: C.ember }, uForest: { value: C.forest } },
      vertexShader: glsl`varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: glsl`
        uniform float uHi; uniform float uTime; uniform vec3 uGold; uniform vec3 uForest; varying vec2 vP;
        void main(){
          vec2 g = abs(fract(vP / 2.0) - 0.5);
          float grid = smoothstep(0.47, 0.5, max(g.x, g.y));
          float sweep = smoothstep(4.0, 0.0, abs(vP.x - mod(uTime * 18.0, 90.0) + 45.0));
          vec3 col = uForest * 0.55 + uGold * (grid * (0.12 + uHi * 0.5) + sweep * uHi * 0.25);
          gl_FragColor = vec4(col, 0.55 + uHi * 0.3);
        }`,
    });
    floorMats.push(fm);
    const plate = new Mesh(new PlaneGeometry(W, D), fm);
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = 0.05;
    fl.add(plate);
    // slab + outline edges
    const em = edgeMat(0.5);
    edgeMats.push(em);
    const slab = new EdgesGeometry(new BoxGeometry(W + 1.2, 0.4, D + 1.2));
    const slabL = new LineSegments(slab, em);
    fl.add(slabL);
    // mullions & partitions
    const seg: number[] = [];
    for (let x = -W / 2; x <= W / 2 + 0.01; x += 3.2) {
      seg.push(x, 0.2, D / 2, x, H - 0.2, D / 2, x, 0.2, -D / 2, x, H - 0.2, -D / 2);
    }
    for (let z = -D / 2; z <= D / 2 + 0.01; z += 3.5) {
      seg.push(-W / 2, 0.2, z, -W / 2, H - 0.2, z, W / 2, 0.2, z, W / 2, H - 0.2, z);
    }
    seg.push(-W / 2, H * 0.5, D / 2, W / 2, H * 0.5, D / 2, -W / 2, H * 0.5, -D / 2, W / 2, H * 0.5, -D / 2);
    const mg = new BufferGeometry();
    mg.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    const mm = edgeMat(0.16);
    edgeMats.push(mm);
    fl.add(new LineSegments(mg, mm));
    // interior rooms
    const rs: number[] = [];
    const rr = rand(100 + f);
    for (let x = -W / 2 + 6 + rr() * 4; x < W / 2 - 4; x += 7 + rr() * 6) {
      rs.push(x, 0.1, 3, x, 3.2, 3, x, 3.2, 3, x, 3.2, D / 2 - 0.6, x, 0.1, -3, x, 3.2, -3, x, 3.2, -3, x, 3.2, -D / 2 + 0.6);
    }
    rs.push(-W / 2 + 1, 0.1, 3, W / 2 - 1, 0.1, 3, -W / 2 + 1, 0.1, -3, W / 2 - 1, 0.1, -3);
    const rg = new BufferGeometry();
    rg.setAttribute('position', new BufferAttribute(new Float32Array(rs), 3));
    const rm = edgeMat(0.1);
    edgeMats.push(rm);
    fl.add(new LineSegments(rg, rm));
    fl.userData = { fm, em, mm, rm };
    labels.push({
      id: `floor-${f}`,
      text: FLOOR_NAMES[f],
      sub: `ЭТАЖ 0${f + 1}`,
      pos: new Vector3(W / 2 + 2, y0 + H * 0.55, D / 2 + 1),
      fx: 'floors',
      kind: 'floor',
      floor: f,
    });
  }
  // roof slab
  {
    const em = edgeMat(0.5);
    edgeMats.push(em);
    const roof = new LineSegments(new EdgesGeometry(new BoxGeometry(W + 1.2, 0.6, D + 1.2)), em);
    roof.position.y = floors * H;
    clinic.add(roof);
  }
  // glass envelope
  const glassMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: { uA: { value: 1 }, uSage: { value: C.sage }, uGold: { value: C.gold } },
    vertexShader: glsl`varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: glsl`uniform float uA; uniform vec3 uSage; uniform vec3 uGold; varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){ float fr = pow(1.0 - abs(dot(vN, vV)), 2.0); vec3 col = mix(uSage * 0.25, uGold * 0.5, fr);
        float a = (0.12 + fr * 0.35) * uA; gl_FragColor = vec4(col, a); }`,
  });
  {
    const glass = new Mesh(new BoxGeometry(W, floors * H, D), glassMat);
    glass.position.y = (floors * H) / 2;
    clinic.add(glass);
  }
  // logo sign — ring with radial rays (the centre's eye mark), front facade top floor
  {
    const seg: number[] = [];
    const cx = -W / 2 + 7;
    const cy = floors * H - 3.2;
    const z = D / 2 + 0.35;
    const R = 2.6;
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const b = ((i + 1) / 48) * Math.PI * 2;
      seg.push(cx + Math.cos(a) * R, cy + Math.sin(a) * R, z, cx + Math.cos(b) * R, cy + Math.sin(b) * R, z);
      seg.push(cx + Math.cos(a) * 1.35, cy + Math.sin(a) * 1.35, z, cx + Math.cos(a) * 2.35, cy + Math.sin(a) * 2.35, z);
    }
    for (let i = 0; i <= 20; i++) {
      const t = -1 + (i / 20) * 2;
      const t2 = -1 + ((i + 1) / 20) * 2;
      if (i < 20) {
        seg.push(cx + t * 1.1, cy + (1 - t * t) * 0.55, z, cx + t2 * 1.1, cy + (1 - t2 * t2) * 0.55, z);
        seg.push(cx + t * 1.1, cy - (1 - t * t) * 0.55, z, cx + t2 * 1.1, cy - (1 - t2 * t2) * 0.55, z);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(seg), 3));
    const m = edgeMat(1.0);
    clinic.add(new LineSegments(g, m));
  }
  // plaza trees
  {
    const pos: number[] = [];
    for (let i = 0; i < 260; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 44 + rnd() * 18;
      const x = Math.cos(a) * r * 1.1;
      const z = Math.sin(a) * r * 0.9;
      const h = rnd();
      pos.push(x, 1 + h * 5, z);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uProj: { value: 800 }, uSage: { value: C.sage } },
      vertexShader: glsl`uniform float uProj; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = clamp(3.2 * uProj / -mv.z, 1.0, 40.0); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: glsl`uniform vec3 uSage; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(uSage * disc * 0.35, 1.0); }`,
    });
    const p = new Points(g, m);
    p.userData.m = m;
    scene.add(p);
    scene.userData.trees = m;
  }

  /* ---------------- arrival path (international portal) ---------------- */
  const pathMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uProgress: { value: 0 }, uTime: { value: 0 }, uProj: { value: 800 }, uGold: { value: C.ember } },
    vertexShader: glsl`attribute float aU; uniform float uProgress; uniform float uTime; uniform float uProj; varying float vA;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
        float drawn = step(aU, uProgress) * step(0.0005, uProgress);
        float head = exp(-max(0.0, uProgress - aU) * 60.0) * drawn;
        float flow = pow(max(0.0, sin((aU * 40.0 - uTime * 1.5) * 3.1415)), 8.0);
        vA = drawn * (0.35 + head * 1.5 + flow * 0.6);
        gl_PointSize = clamp((2.6 + head * 5.0) * uProj / -mv.z, 1.5, 30.0);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: glsl`uniform vec3 uGold; varying float vA; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(uGold * disc * vA, 1.0); }`,
  });
  {
    const route: Array<[number, number]> = [
      [9 * PITCH + 55, 12 * PITCH + 55],
      [9 * PITCH + 55, 2 * PITCH + 55],
      [2 * PITCH + 55, 2 * PITCH + 55],
      [2 * PITCH + 55, 55],
      [55, 55],
      [0, 26],
    ];
    const pts: number[] = [];
    const us: number[] = [];
    let total = 0;
    const lens: number[] = [];
    for (let i = 1; i < route.length; i++) {
      const l = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]);
      lens.push(l);
      total += l;
    }
    let acc = 0;
    for (let i = 1; i < route.length; i++) {
      const [ax, az] = route[i - 1];
      const [bx, bz] = route[i];
      const steps = Math.ceil(lens[i - 1] / 4);
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        pts.push(ax + (bx - ax) * t, 1.6, az + (bz - az) * t);
        us.push((acc + lens[i - 1] * t) / total);
      }
      acc += lens[i - 1];
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
    g.setAttribute('aU', new BufferAttribute(new Float32Array(us), 1));
    const p = new Points(g, pathMat);
    p.frustumCulled = false;
    scene.add(p);
    labels.push({ id: 'arrive-air', text: 'Аэропорт', sub: 'трансфер', pos: new Vector3(route[0][0], 12, route[0][1]), fx: 'path', kind: 'city' });
    labels.push({ id: 'arrive-stay', text: 'Проживание', sub: 'рядом с клиникой', pos: new Vector3(2 * PITCH + 55, 12, 2 * PITCH + 55), fx: 'path', kind: 'city' });
    labels.push({ id: 'arrive-clinic', text: 'Центр', sub: 'пр. Мәңгілік Ел, 72', pos: new Vector3(0, CLINIC.floors * CLINIC.H + 8, 0), fx: 'pins', kind: 'hub' });
  }

  /* ---------------- clouds (billboards) ---------------- */
  const cloudMat = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const ctx = cv.getContext('2d')!;
    for (let i = 0; i < 26; i++) {
      const x = 30 + rnd() * 68;
      const y = 34 + rnd() * 60;
      const r = 14 + rnd() * 26;
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.22)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new CanvasTexture(cv);
    const N = q.high ? 240 : 110;
    const geo = new PlaneGeometry(1, 1);
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: tex }, uCol: { value: C.sage.clone().lerp(C.cream, 0.35) }, uA: { value: 1 }, uTime: { value: 0 } },
      vertexShader: glsl`
        attribute vec4 aCloud; varying vec2 vUv; varying float vF;
        uniform float uTime;
        void main(){
          vUv = uv;
          vec3 c = aCloud.xyz; c.x += sin(uTime * 0.02 + aCloud.w) * 40.0;
          vec4 mv = viewMatrix * vec4(c, 1.0);
          mv.xy += position.xy * aCloud.w;
          float d = -mv.z;
          vF = smoothstep(10.0, 140.0, d) * (1.0 - smoothstep(1800.0, 2600.0, d));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: glsl`uniform sampler2D uTex; uniform vec3 uCol; uniform float uA; varying vec2 vUv; varying float vF;
        void main(){ float a = texture2D(uTex, vUv).a * vF * uA; if (a < 0.003) discard; gl_FragColor = vec4(uCol * 0.55, a * 0.9); }`,
    });
    const cloudAttr = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      cloudAttr[i * 4] = (rnd() * 2 - 1) * 1700;
      cloudAttr[i * 4 + 1] = 330 + rnd() * 160;
      cloudAttr[i * 4 + 2] = (rnd() * 2 - 1) * 1700;
      cloudAttr[i * 4 + 3] = 220 + rnd() * 260;
    }
    const inst = new InstancedMesh(geo, m, N);
    geo.setAttribute('aCloud', new InstancedBufferAttribute(cloudAttr, 4));
    inst.frustumCulled = false;
    inst.renderOrder = 10;
    scene.add(inst);
    return m;
  })();

  return {
    scene,
    labels,
    update(fx, time, camPos, proj) {
      terrainMat.uniforms.uTime.value = time;
      buildingMat.uniforms.uLit.value = 0.3 + (fx.windows ?? 0) * 0.35;
      traffic.uniforms.uTime.value = time;
      traffic.uniforms.uProj.value = proj;
      (scene.userData.trees as ShaderMaterial).uniforms.uProj.value = proj;
      pathMat.uniforms.uProgress.value = fx.path ?? 0;
      pathMat.uniforms.uTime.value = time;
      pathMat.uniforms.uProj.value = proj;
      cloudMat.uniforms.uTime.value = time;
      // fog thickens slightly near the ground for depth
      const dens = 0.00055 + 0.0005 * (1 - Math.min(1, camPos.y / 900));
      fogU.uFogDensity.value = dens;
      const floorOn = fx.floorOn ?? 0;
      const fsel = fx.floor ?? -1;
      const xray = fx.xray ?? 0;
      glassMat.uniforms.uA.value = 1 - xray * 0.85;
      clinic.children.forEach((c) => {
        const d = c.userData as { fm?: ShaderMaterial; em?: ShaderMaterial; mm?: ShaderMaterial; rm?: ShaderMaterial };
        if (!d.fm) return;
        const idx = Math.round(c.position.y / H);
        const hi = Math.max(0, 1 - Math.abs(fsel - idx)) * floorOn;
        d.fm.uniforms.uHi.value = hi;
        d.fm.uniforms.uTime.value = time;
        d.em!.uniforms.uHi.value = hi;
        d.mm!.uniforms.uA.value = 0.16 * (1 - xray * 0.6) + hi * 0.1;
        d.rm!.uniforms.uA.value = 0.06 + xray * 0.2 + hi * 0.25;
        d.rm!.uniforms.uHi.value = hi;
      });
    },
  };
}
