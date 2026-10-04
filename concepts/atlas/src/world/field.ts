import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, Scene, ShaderMaterial, Vector3 } from 'three';
import { C, POINT_FRAG_SOFT, glsl } from './palette';
import type { Quality, WorldLabel } from './types';

/**
 * Science stage: a layered particle field shaped like an OCT cross-section of
 * the retina (with the foveal pit), a double helix of light entering it
 * (polarised + unpolarised light in superposition), and drifting data dust.
 */
export interface FieldWorld {
  scene: Scene;
  labels: WorldLabel[];
  update(fx: Record<string, number>, time: number, proj: number): void;
}

export function createField(q: Quality): FieldWorld {
  const scene = new Scene();
  const labels: WorldLabel[] = [];
  const NX = q.high ? 240 : 130;
  const NZ = q.high ? 90 : 50;
  const L = q.high ? 7 : 6;
  const pos = new Float32Array(NX * NZ * L * 3);
  const layer = new Float32Array(NX * NZ * L);
  let k = 0;
  for (let l = 0; l < L; l++) {
    for (let i = 0; i < NX; i++) {
      for (let j = 0; j < NZ; j++) {
        pos[k * 3] = (i / (NX - 1) - 0.5) * 16;
        pos[k * 3 + 1] = 0;
        pos[k * 3 + 2] = (j / (NZ - 1) - 0.5) * 6;
        layer[k] = l / (L - 1);
        k++;
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('aLayer', new BufferAttribute(layer, 1));
  const m = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uProj: { value: 800 },
      uWave: { value: 1 },
      uSplit: { value: 0 },
      uScan: { value: 0 },
      uMoss: { value: C.moss },
      uSage: { value: C.sage },
      uGold: { value: C.ember },
      uCream: { value: C.cream },
    },
    vertexShader: glsl`
      attribute float aLayer; uniform float uTime; uniform float uProj; uniform float uWave; uniform float uSplit; uniform float uScan;
      uniform vec3 uMoss; uniform vec3 uSage; uniform vec3 uGold; uniform vec3 uCream;
      varying vec3 vCol; varying float vA;
      void main(){
        vec3 p = position;
        float r = length(p.xz * vec2(1.0, 1.4));
        float pit = -1.3 * exp(-r * r * 0.35) * (1.0 - aLayer * 0.55);
        float w = sin(p.x * 0.7 + uTime * 0.5 + aLayer * 2.0) * 0.12 + sin(p.z * 1.3 - uTime * 0.35) * 0.08;
        p.y = aLayer * (1.6 + uSplit * 2.4) + pit + w * uWave;
        float scan = smoothstep(0.35, 0.0, abs(p.x - (mod(uTime * 2.0, 20.0) - 10.0))) * uScan;
        vec3 c = mix(uMoss, uSage, smoothstep(0.0, 0.5, aLayer));
        c = mix(c, uGold, smoothstep(0.55, 1.0, aLayer));
        c = mix(c, uCream, scan * 0.8);
        vCol = c;
        vA = (0.35 + aLayer * 0.4 + scan) * (1.0 - smoothstep(5.5, 8.0, abs(p.x)));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(0.035 * uProj / -mv.z, 1.0, 10.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: glsl`varying vec3 vCol; varying float vA; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(vCol * disc * vA, 1.0); }`,
  });
  const layers = new Points(g, m);
  layers.frustumCulled = false;
  scene.add(layers);

  // helix beam
  const H = q.high ? 900 : 500;
  const hp = new Float32Array(H * 2 * 3);
  const hu = new Float32Array(H * 2);
  const hs = new Float32Array(H * 2);
  for (let s = 0; s < 2; s++) {
    for (let i = 0; i < H; i++) {
      const idx = s * H + i;
      hu[idx] = i / H;
      hs[idx] = s;
    }
  }
  const hg = new BufferGeometry();
  hg.setAttribute('position', new BufferAttribute(hp, 3));
  hg.setAttribute('aU', new BufferAttribute(hu, 1));
  hg.setAttribute('aS', new BufferAttribute(hs, 1));
  const hm = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uProj: { value: 800 }, uVis: { value: 0 }, uGold: { value: C.ember }, uCream: { value: C.cream } },
    vertexShader: glsl`
      attribute float aU; attribute float aS; uniform float uTime; uniform float uProj; uniform float uVis; varying float vA; varying float vS;
      void main(){
        float y = 9.0 - aU * 9.5;
        float a = aU * 40.0 - uTime * 2.2 + aS * 3.14159;
        float rad = 0.55 * (0.4 + aU * 0.6);
        vec3 p = aS < 0.5 ? vec3(cos(a) * rad, y, sin(a) * rad) : vec3(cos(a * 1.0) * rad, y, 0.0) + vec3(0.0, 0.0, sin(a * 0.5) * 0.15);
        vA = uVis * (0.4 + 0.6 * pow(0.5 + 0.5 * sin(aU * 60.0 - uTime * 6.0), 4.0)) * smoothstep(0.0, 0.1, aU) * (1.0 - smoothstep(0.92, 1.0, aU));
        vS = aS;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(0.06 * uProj / -mv.z, 1.0, 14.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: glsl`uniform vec3 uGold; uniform vec3 uCream; varying float vA; varying float vS; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(mix(uGold, uCream, vS) * disc * vA, 1.0); }`,
  });
  const helix = new Points(hg, hm);
  helix.frustumCulled = false;
  scene.add(helix);

  // dust
  const DN = q.high ? 4000 : 1600;
  const dp = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 40;
    dp[i * 3 + 1] = (Math.random() - 0.3) * 24;
    dp[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new BufferAttribute(dp, 3));
  const dm = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uProj: { value: 800 }, uGold: { value: C.gold } },
    vertexShader: glsl`uniform float uTime; uniform float uProj; varying float vA;
      void main(){ vec3 p = position; p.y += mod(uTime * 0.15 + position.x, 24.0) - 12.0; vec4 mv = modelViewMatrix * vec4(p,1.0);
        vA = 0.25 + 0.25 * sin(uTime + position.z); gl_PointSize = clamp(0.05 * uProj / -mv.z, 1.0, 6.0); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: glsl`uniform vec3 uGold; varying float vA; void main(){ ${POINT_FRAG_SOFT} gl_FragColor = vec4(uGold * disc * vA * 0.6, 1.0); }`,
  });
  const dust = new Points(dg, dm);
  dust.frustumCulled = false;
  scene.add(dust);

  labels.push({ id: 'f-fovea', text: 'Макула', sub: 'центр сетчатки', pos: new Vector3(0, -1.6, 0), fx: 'flabels', kind: 'field' });
  labels.push({ id: 'f-layers', text: 'Слои сетчатки', sub: 'как на снимке ОКТ', pos: new Vector3(6.2, 1.4, 2.4), fx: 'flabels', kind: 'field' });
  labels.push({ id: 'f-light', text: 'Свет в суперпозиции', sub: 'квантовая оптика', pos: new Vector3(0.9, 6.5, 0), fx: 'beam', kind: 'field' });

  return {
    scene,
    labels,
    update(fx, time, proj) {
      m.uniforms.uTime.value = time;
      m.uniforms.uProj.value = proj;
      m.uniforms.uWave.value = fx.wave ?? 1;
      m.uniforms.uSplit.value = fx.split ?? 0;
      m.uniforms.uScan.value = fx.scan ?? 0;
      hm.uniforms.uTime.value = time;
      hm.uniforms.uProj.value = proj;
      hm.uniforms.uVis.value = fx.beam ?? 0;
      dm.uniforms.uTime.value = time;
      dm.uniforms.uProj.value = proj;
    },
  };
}
