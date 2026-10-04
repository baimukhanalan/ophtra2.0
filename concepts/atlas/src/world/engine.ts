import {
  CustomBlending,
  Mesh,
  OneFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { bridge } from './bridge';
import { createField, type FieldWorld } from './field';
import { EARTH_KM, PLACES, vecToLl } from './geo';
import { createGround, type GroundWorld } from './ground';
import { CONSTELLATION_ORDER, createOrbit, type OrbitWorld } from './orbit';
import { C, glsl } from './palette';
import { DEPT_FLOOR, SHOTS, floorShot } from './shots';
import type { Quality, ShotDef, Stage, WorldLabel } from './types';

interface State {
  stage: Stage;
  pos: Vector3;
  target: Vector3;
  fov: number;
  fx: Record<string, number>;
  cloud: number;
}

const HOLD_KEYS = new Set(['floor', 'sel', 'dir', 'wave']);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));

function mkState(): State {
  return { stage: 'orbit', pos: new Vector3(), target: new Vector3(), fov: 40, fx: {}, cloud: 0 };
}
function copyState(o: State, s: State) {
  o.stage = s.stage;
  o.pos.copy(s.pos);
  o.target.copy(s.target);
  o.fov = s.fov;
  o.fx = { ...s.fx };
  o.cloud = s.cloud;
  return o;
}

export interface WorldHandles {
  canvas: HTMLCanvasElement;
  labelLayer: HTMLElement;
  hudCoords: HTMLElement | null;
  hudAlt: HTMLElement | null;
  hudStage: HTMLElement | null;
}

export function startWorld(h: WorldHandles): () => void {
  const touch = bridge.touch;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const q: Quality = { high: !touch && !small && (navigator.hardwareConcurrency ?? 4) >= 4, touch };

  const renderer = new WebGLRenderer({
    canvas: h.canvas,
    antialias: !touch,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setClearColor(C.deep, 1);
  let dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);

  const camera = new PerspectiveCamera(40, 1, 0.01, 400);

  // lvh probe: size the canvas to the *largest* viewport so mobile bars never resize it
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:100lvh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  let vw = 0;
  let vh = 0;
  const resize = () => {
    const w = window.innerWidth;
    const hh = Math.max(probe.offsetHeight || window.innerHeight, window.innerHeight);
    if (w === vw && Math.abs(hh - vh) < 2) return;
    vw = w;
    vh = hh;
    renderer.setSize(w, hh, false);
    camera.aspect = w / hh;
    camera.updateProjectionMatrix();
    refreshTops();
  };

  const orbit: OrbitWorld = createOrbit(q);
  let ground: GroundWorld | null = null;
  let field: FieldWorld | null = null;
  const ensureGround = (): GroundWorld => {
    if (!ground) {
      ground = createGround(q);
      addLabels(ground.labels, 'ground');
    }
    return ground;
  };
  const ensureField = (): FieldWorld => {
    if (!field) {
      field = createField(q);
      addLabels(field.labels, 'field');
    }
    return field;
  };

  /* ---------- overlay: cloud mask + zoom streaks ---------- */
  const overlayMat = new ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
    uniforms: {
      uCloud: { value: 0 },
      uStreak: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMist: { value: C.sage.clone().lerp(C.cream, 0.25).multiplyScalar(0.62) },
      uDeep: { value: C.forest.clone() },
      uGold: { value: C.ember.clone() },
    },
    vertexShader: glsl`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }`,
    fragmentShader: glsl`
      uniform float uCloud; uniform float uStreak; uniform float uTime; uniform float uAspect;
      uniform vec3 uMist; uniform vec3 uDeep; uniform vec3 uGold; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n2(p); p*=2.02; a*=0.5; } return s; }
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float r = length(p);
        vec3 col = vec3(0.0); float alpha = 0.0;
        if (uCloud > 0.001) {
          float z = 1.0 + uCloud * 2.5;
          vec2 q = p / z * 3.0;
          float n = fbm(q + vec2(uTime * 0.05, -uTime * 0.03)) ;
          float n2_ = fbm(q * 2.3 - uTime * 0.04);
          float a = smoothstep(0.0, 0.35, uCloud * 1.4 + n * 0.55 - 0.55);
          vec3 c = mix(uDeep * 0.9, uMist, smoothstep(0.3, 0.9, n * 0.7 + n2_ * 0.5));
          col = c * a; alpha = a;
        }
        if (uStreak > 0.001) {
          float ang = atan(p.y, p.x);
          float s = pow(n2(vec2(ang * 38.0, 0.0) + uTime * 0.2), 10.0) * smoothstep(0.15, 0.9, r);
          vec3 sc = uGold * s * uStreak * 0.9;
          col += sc; alpha = max(alpha, 0.0);
          // subtle vignette darkening while pushing through
          float v = smoothstep(0.35, 1.0, r) * uStreak * 0.55;
          col = col * (1.0 - v); alpha = max(alpha, v);
        }
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  const overlayScene = new Scene();
  const ovMesh = new Mesh(new PlaneGeometry(1, 1), overlayMat);
  ovMesh.frustumCulled = false;
  overlayScene.add(ovMesh);
  const overlayCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* ---------- shots ---------- */
  const cache = new Map<string, ShotDef>();
  function resolve(id: string): ShotDef {
    const hit = cache.get(id);
    if (hit) return hit;
    let def: ShotDef | undefined = SHOTS[id];
    if (!def) {
      if (id.startsWith('floor-')) def = floorShot(+id.slice(6) || 0);
      else if (id.startsWith('dept-')) def = floorShot(DEPT_FLOOR[id.slice(5)] ?? 0);
      else if (id === 'sky-all') {
        const centres = Object.values(orbit.sky.centres);
        const mean = centres.reduce((a, c) => a.add(c), new Vector3()).divideScalar(centres.length);
        const up = mean.clone().normalize();
        const pos = up.clone().multiplyScalar(-2.2).add(new Vector3(0, 0.3, 0));
        def = { stage: 'orbit', pos: [pos.x, pos.y, pos.z], target: [mean.x, mean.y, mean.z], fov: 62, fx: { stars: 1, sel: -1, pins: 0.4 } };
      } else if (id.startsWith('const-')) {
        const cat = id.slice(6);
        const c = orbit.sky.centres[cat] ?? new Vector3(0, 40, 0);
        const pos = c.clone().multiplyScalar(0.62);
        def = { stage: 'orbit', pos: [pos.x, pos.y, pos.z], target: [c.x, c.y, c.z], fov: 44, fx: { stars: 1, sel: CONSTELLATION_ORDER.indexOf(cat) } };
      } else if (id.startsWith('star-')) {
        const [slug, cat] = id.slice(5).split('|');
        const s = orbit.sky.stars[slug] ?? new Vector3(0, 40, 0);
        const pos = s.clone().multiplyScalar(0.8);
        def = { stage: 'orbit', pos: [pos.x, pos.y, pos.z], target: [s.x, s.y, s.z], fov: 38, fx: { stars: 1, sel: CONSTELLATION_ORDER.indexOf(cat) } };
      }
    }
    if (!def) {
      if (import.meta.env.DEV) console.warn('[atlas] unknown shot', id);
      def = SHOTS['home-hero'];
    }
    cache.set(id, def);
    return def;
  }
  function shotState(id: string, out: State): State {
    const d = resolve(id);
    out.stage = d.stage;
    const portrait = vw / Math.max(1, vh) < 0.85 && d.portrait;
    out.pos.set(...(portrait ? d.portrait!.pos : d.pos));
    out.target.set(...(portrait ? d.portrait!.target : d.target));
    // keep roughly the same horizontal coverage on narrow screens
    const aspect = vw / Math.max(1, vh);
    out.fov = aspect < 1 ? Math.min(78, (2 * Math.atan(Math.tan((d.fov * Math.PI) / 360) * Math.pow(1.2 / aspect, 0.55)) * 180) / Math.PI) : d.fov;
    out.fx = { ...d.fx };
    out.cloud = 0;
    if (bridge.override?.fx) Object.assign(out.fx, bridge.override.fx);
    return out;
  }

  const tmpA = new Vector3();
  const tmpB = new Vector3();
  function mixFx(a: Record<string, number>, b: Record<string, number>, t: number) {
    const o: Record<string, number> = {};
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach((k) => {
      const hold = HOLD_KEYS.has(k);
      const av = a[k] ?? (hold ? b[k] : 0);
      const bv = b[k] ?? (hold ? a[k] : 0);
      o[k] = av + (bv - av) * t;
    });
    return o;
  }
  function mix(a: State, b: State, t: number, out: State): State {
    if (a.stage === b.stage) {
      out.stage = a.stage;
      if (a.stage === 'orbit') {
        const ra = a.pos.length();
        const rb = b.pos.length();
        tmpA.copy(a.pos).normalize();
        tmpB.copy(b.pos).normalize();
        const ang = tmpA.angleTo(tmpB);
        if (ang > 1e-4) {
          const s = Math.sin(ang);
          const w1 = Math.sin((1 - t) * ang) / s;
          const w2 = Math.sin(t * ang) / s;
          out.pos.copy(tmpA).multiplyScalar(w1).addScaledVector(tmpB, w2);
        } else out.pos.copy(tmpA).lerp(tmpB, t);
        // altitude change: climb on long flights
        const bump = Math.sin(Math.PI * t) * ang * 0.75 * Math.max(ra, rb) * 0.45;
        out.pos.normalize().multiplyScalar(ra + (rb - ra) * t + bump);
      } else out.pos.copy(a.pos).lerp(b.pos, t);
      out.target.copy(a.target).lerp(b.target, t);
      out.fov = a.fov + (b.fov - a.fov) * t;
      out.fx = mixFx(a.fx, b.fx, t);
      out.cloud = a.cloud + (b.cloud - a.cloud) * t;
      return out;
    }
    // Different stages: dive/rise through a cloud mask, swap at the midpoint.
    if (t < 0.5) {
      const u = ease(t / 0.5);
      out.stage = a.stage;
      out.target.copy(a.target);
      out.pos.copy(a.pos).lerp(a.target, 0.55 * u);
      out.fov = a.fov + 12 * u;
      out.fx = { ...a.fx };
      out.cloud = smooth(0.12, 0.48, t);
    } else {
      const u = 1 - ease((t - 0.5) / 0.5);
      out.stage = b.stage;
      out.target.copy(b.target);
      tmpA.copy(b.pos).sub(b.target);
      out.pos.copy(b.pos).addScaledVector(tmpA, 0.9 * u);
      if (b.stage === 'ground') out.pos.y += 260 * u;
      out.fov = b.fov + 12 * u;
      out.fx = { ...b.fx };
      out.cloud = 1 - smooth(0.52, 0.9, t);
    }
    return out;
  }

  /* ---------- chapter track ---------- */
  function refreshTops() {
    const sy = window.scrollY;
    for (const c of bridge.chapters) c.top = c.el.getBoundingClientRect().top + sy;
  }
  const sa = mkState();
  const sb = mkState();
  const desired = mkState();
  function evaluate(y: number, out: State): State {
    const ch = bridge.chapters;
    if (bridge.override?.shot) return shotState(bridge.override.shot, out);
    if (!ch.length) return shotState('home-hero', out);
    const anchors = ch.map((c, i) => (i === 0 ? 0 : Math.max(0, c.top - vh * 0.62)));
    let i = 0;
    while (i < ch.length - 1 && y >= anchors[i + 1]) i++;
    if (i >= ch.length - 1) return shotState(ch[ch.length - 1].shot, out);
    const a0 = anchors[i];
    const a1 = anchors[i + 1];
    const travel = Math.max(1, Math.min(vh * 0.95, (a1 - a0) * 0.9));
    const t = clamp01((y - (a1 - travel)) / travel);
    shotState(ch[i].shot, sa);
    if (t <= 0) return copyState(out, sa);
    shotState(ch[i + 1].shot, sb);
    return mix(sa, sb, ease(t), out);
  }

  /* ---------- labels ---------- */
  const allLabels: Array<{ l: WorldLabel; el: HTMLElement; stage: Stage; shown: boolean }> = [];
  function addLabels(list: WorldLabel[], stage: Stage) {
    for (const l of list) {
      const el = document.createElement('div');
      el.className = `wl wl--${l.kind ?? 'city'}`;
      el.innerHTML = `<span class="wl__dot"></span><span class="wl__t">${l.text}</span>${l.sub ? `<span class="wl__s">${l.sub}</span>` : ''}`;
      el.style.opacity = '0';
      h.labelLayer.appendChild(el);
      allLabels.push({ l, el, stage, shown: false });
    }
  }
  addLabels(orbit.labels, 'orbit');
  const v = new Vector3();
  const camDir = new Vector3();
  function updateLabels(s: State) {
    camDir.copy(camera.position);
    for (const it of allLabels) {
      let vis = 0;
      if (it.stage === s.stage && s.cloud < 0.6) {
        vis = clamp01(s.fx[it.l.fx] ?? 0);
        if (it.l.kind === 'floor') {
          const on = s.fx.floorOn ?? 0;
          const hi = Math.max(0, 1 - Math.abs((s.fx.floor ?? -9) - (it.l.floor ?? 0))) * on;
          vis *= 1 - on + on * hi;
        }
        if (it.l.group !== undefined) vis *= Math.abs((s.fx.sel ?? -9) - it.l.group) < 0.5 ? 1 : 0;
        if (vis > 0.01 && it.l.occlude) {
          v.copy(it.l.pos).normalize();
          tmpA.copy(camDir).sub(it.l.pos).normalize();
          const facing = v.dot(tmpA);
          vis *= smooth(0.02, 0.25, facing);
        }
      }
      if (vis > 0.01) {
        v.copy(it.l.pos).project(camera);
        if (v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1) vis = 0;
        const x = (v.x * 0.5 + 0.5) * vw;
        const y = (-v.y * 0.5 + 0.5) * vh;
        it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
      vis *= 1 - s.cloud;
      if (vis > 0.01 || it.shown) {
        it.el.style.opacity = vis.toFixed(3);
        it.shown = vis > 0.01;
      }
    }
  }

  /* ---------- HUD ---------- */
  let hudT = 0;
  const fmtCoord = (lat: number, lng: number) =>
    `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  function updateHud(s: State) {
    if (!h.hudCoords || !h.hudAlt) return;
    const p = camera.position;
    if (s.stage === 'orbit') {
      const ll = vecToLl(p);
      h.hudCoords.textContent = fmtCoord(ll.lat, ll.lng);
      const km = (p.length() - 1) * EARTH_KM;
      h.hudAlt.textContent = `ALT ${Math.round(km).toLocaleString('ru-RU')} км`;
    } else if (s.stage === 'ground') {
      const lat = PLACES.astana.lat - p.z / 111320;
      const lng = PLACES.astana.lng + p.x / (111320 * Math.cos((PLACES.astana.lat * Math.PI) / 180));
      h.hudCoords.textContent = fmtCoord(lat, lng);
      h.hudAlt.textContent = `ALT ${Math.max(0, Math.round(p.y)).toLocaleString('ru-RU')} м`;
    } else {
      h.hudCoords.textContent = `ПОЛЕ ДАННЫХ · X ${p.x.toFixed(2)} · Z ${p.z.toFixed(2)}`;
      h.hudAlt.textContent = `ГЛУБИНА ${p.y.toFixed(2)}`;
    }
    if (h.hudStage) h.hudStage.textContent = s.stage === 'orbit' ? 'ОРБИТА' : s.stage === 'ground' ? 'АСТАНА' : 'МИКРОМИР';
  }

  /* ---------- loop ---------- */
  const current = mkState();
  const from = mkState();
  // opening move: arrive from deep space into whatever page was opened
  shotState('lost', current);
  copyState(from, current);
  let flight = bridge.reduced ? -1 : 0; // progress 0..1, -1 = none
  let flightDur = 3.2;
  let lastNav = bridge.navToken;
  let sScroll = window.scrollY;
  let lastChapV = -1;
  let lastOverrideV = bridge.overrideVersion;
  let topsT = 0;
  let time = 0;
  let raf = 0;
  let last = performance.now();
  let ema = 1 / 60;
  let slowFor = 0;
  let firstFrame = true;
  let lastRenderKey = '';
  const pointer = new Vector2();
  const pointerS = new Vector2();
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  let activeStage: Stage | null = null;
  const lookTmp = new Vector3();
  const side = new Vector3();
  const upv = new Vector3();

  function setStageCamera(stage: Stage) {
    if (stage === activeStage) return;
    activeStage = stage;
    if (stage === 'orbit') {
      camera.near = 0.005;
      camera.far = 400;
    } else if (stage === 'ground') {
      camera.near = 0.3;
      camera.far = 7000;
      ensureGround();
    } else {
      camera.near = 0.02;
      camera.far = 200;
      ensureField();
    }
    camera.updateProjectionMatrix();
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const reduced = bridge.reduced;
    if (!reduced) time += dt;

    // adaptive resolution
    ema = ema * 0.95 + dt * 0.05;
    if (ema > 1 / 42 && dpr > 0.8) {
      slowFor += dt;
      if (slowFor > 2.2) {
        dpr = Math.max(0.75, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(vw, vh, false);
        slowFor = 0;
      }
    } else slowFor = 0;

    if (bridge.chaptersVersion !== lastChapV || now - topsT > 700) {
      lastChapV = bridge.chaptersVersion;
      topsT = now;
      refreshTops();
    }

    const y = window.scrollY;
    sScroll = reduced ? y : damp(sScroll, y, touch ? 9 : 12, dt);
    if (Math.abs(sScroll - y) < 0.3) sScroll = y;

    if (bridge.navToken !== lastNav) {
      lastNav = bridge.navToken;
      copyState(from, current);
      sScroll = y;
      flight = reduced ? -1 : 0;
      evaluate(sScroll, desired);
      flightDur = from.stage === desired.stage ? 1.55 : 2.1;
      if (reduced) {
        h.canvas.animate?.([{ opacity: 0.2 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
      }
    }
    if (bridge.overrideVersion !== lastOverrideV) {
      lastOverrideV = bridge.overrideVersion;
      if (!reduced && flight < 0) {
        copyState(from, current);
        flight = 0;
        flightDur = 1.2;
      }
    }

    evaluate(sScroll, desired);
    let streak = 0;
    let fovKick = 0;
    if (flight >= 0) {
      flight = Math.min(1, flight + dt / flightDur);
      const e = ease(flight);
      mix(from, desired, e, current);
      if (from.stage === desired.stage && flightDur > 1.3) {
        const k = Math.sin(Math.PI * flight);
        streak = k * (touch ? 0.6 : 1);
        fovKick = k * 14;
      }
      if (flight >= 1) flight = -1;
    } else copyState(current, desired);

    setStageCamera(current.stage);

    // camera placement + idle drift + pointer parallax
    pointerS.x = damp(pointerS.x, pointer.x, 3, dt);
    pointerS.y = damp(pointerS.y, pointer.y, 3, dt);
    const dist = current.pos.distanceTo(current.target);
    lookTmp.copy(current.target).sub(current.pos).normalize();
    side.crossVectors(lookTmp, camera.up).normalize();
    upv.crossVectors(side, lookTmp).normalize();
    const drift = reduced ? 0 : 1;
    const amp = current.stage === 'orbit' ? Math.min(dist, 4) * 0.018 : current.stage === 'ground' ? Math.min(dist, 400) * 0.012 : dist * 0.02;
    camera.position
      .copy(current.pos)
      .addScaledVector(side, (Math.sin(time * 0.11) * 0.6 + pointerS.x) * amp * drift)
      .addScaledVector(upv, (Math.cos(time * 0.09) * 0.4 - pointerS.y * 0.6) * amp * drift);
    if (current.stage === 'orbit' && camera.position.length() < 1.012) camera.position.setLength(1.012);
    if (current.stage === 'ground' && camera.position.y < 1.2) camera.position.y = 1.2;
    camera.lookAt(current.target);
    const fov = current.fov + fovKick;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const proj = (vh * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));

    // reduced motion: only draw when something changed
    if (reduced) {
      const key = `${camera.position.x.toFixed(4)}${camera.position.y.toFixed(4)}${camera.position.z.toFixed(4)}${current.stage}${vw}${vh}${current.cloud.toFixed(2)}`;
      if (key === lastRenderKey && !firstFrame) return;
      lastRenderKey = key;
    }

    camera.updateMatrixWorld();
    let scene: Scene;
    if (current.stage === 'orbit') {
      orbit.update(current.fx, time, camera, proj);
      scene = orbit.scene;
    } else if (current.stage === 'ground') {
      const g = ensureGround();
      g.update(current.fx, time, camera.position, proj);
      scene = g.scene;
    } else {
      const f = ensureField();
      f.update(current.fx, time, proj);
      scene = f.scene;
    }
    renderer.render(scene, camera);
    const cloud = current.cloud;
    if (cloud > 0.001 || streak > 0.001) {
      overlayMat.uniforms.uCloud.value = cloud;
      overlayMat.uniforms.uStreak.value = streak;
      overlayMat.uniforms.uTime.value = time;
      overlayMat.uniforms.uAspect.value = vw / vh;
      renderer.autoClear = false;
      renderer.render(overlayScene, overlayCam);
      renderer.autoClear = true;
    }
    // CSS motion blur while pushing through (desktop only; cheap on GPU compositor)
    if (!touch) {
      const blur = streak > 0.05 ? (streak * 3.2).toFixed(2) : '0';
      if (h.canvas.dataset.blur !== blur) {
        h.canvas.dataset.blur = blur;
        h.canvas.style.filter = blur === '0' ? '' : `blur(${blur}px)`;
      }
    }

    updateLabels(current);
    if (now - hudT > 110) {
      hudT = now;
      updateHud(current);
    }
    if (firstFrame) {
      firstFrame = false;
      bridge.ready();
      // warm the other stages while the user reads the hero
      const idle = (cb: () => void) => ('requestIdleCallback' in window ? (window as unknown as { requestIdleCallback: (f: () => void, o?: object) => void }).requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200));
      idle(() => {
        const g = ensureGround();
        renderer.compile(g.scene, camera);
        idle(() => {
          ensureField();
        });
      });
    }
  }

  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    bridge.fail();
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', onVis);
  h.canvas.addEventListener('webglcontextlost', onLost);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVis);
    probe.remove();
    renderer.dispose();
  };
}
