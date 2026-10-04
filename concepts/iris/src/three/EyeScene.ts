import * as THREE from 'three';
import {
  causticFrag,
  corneaFrag,
  corneaVert,
  glowFrag,
  irisFrag,
  irisVert,
  lensFrag,
  pointsFrag,
  pointsVert,
  quadVert,
  retinaFrag,
  scleraFrag,
  scleraVert,
  tunnelFrag,
  tunnelVert,
} from './shaders';
import {
  DISC,
  P_CAUSTIC,
  P_FOCUS,
  P_FOV,
  P_GLOW,
  P_LEN,
  P_LIGHT,
  P_LOOK,
  P_MICRO,
  P_POS,
  P_PUPIL,
  P_TUNNEL,
} from '../lib/stations';

export interface SceneOptions {
  mobile: boolean;
  reduced: boolean;
}

/** Tileable value-noise texture, 4 independent channels. */
function makeNoise(size = 256, cells = 32): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const lat = new Float32Array(cells * cells * 4);
  let s = 1234567;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < lat.length; i++) lat[i] = rnd();
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells;
      const fy = (y / size) * cells;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fade(fx - x0);
      const ty = fade(fy - y0);
      const x1 = (x0 + 1) % cells;
      const y1 = (y0 + 1) % cells;
      for (let c = 0; c < 4; c++) {
        const v00 = lat[(y0 * cells + x0) * 4 + c];
        const v10 = lat[(y0 * cells + x1) * 4 + c];
        const v01 = lat[(y1 * cells + x0) * 4 + c];
        const v11 = lat[(y1 * cells + x1) * 4 + c];
        const v = (v00 + (v10 - v00) * tx) * (1 - ty) + (v01 + (v11 - v01) * tx) * ty;
        data[(y * size + x) * 4 + c] = Math.round(v * 255);
      }
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export class EyeScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private overlayScene = new THREE.Scene();
  private overlayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private uniforms: Record<string, THREE.IUniform>;
  private cur = new Float32Array(P_LEN);
  private look = new THREE.Vector3();
  private pointsMat: THREE.ShaderMaterial;
  private corneaMat: THREE.ShaderMaterial;
  private lensMat: THREE.ShaderMaterial;
  private causticMat: THREE.ShaderMaterial;
  private glowMat: THREE.ShaderMaterial;
  private tunnelMat: THREE.ShaderMaterial;
  private retinaMat: THREE.ShaderMaterial;
  private pr = 1;
  private maxPr = 1;
  private frameTimes: number[] = [];
  private pointer = new THREE.Vector2();
  private pointerCur = new THREE.Vector2();
  private initialised = false;
  private lastVersion = -1;
  private settled = 0;
  private odd = false;
  private size = new THREE.Vector2(1, 1);
  private off = new THREE.Vector2(0, 0);

  constructor(private canvas: HTMLCanvasElement, private opts: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !opts.mobile,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.maxPr = Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 1.75);
    this.pr = this.maxPr;
    this.renderer.setPixelRatio(this.pr);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.004, 60);

    const noise = makeNoise();
    const light = new THREE.Vector3(-0.55, 0.62, 0.9);
    this.uniforms = {
      uNoise: { value: noise },
      uLight: { value: light },
      uTime: { value: 0 },
      uPupil: { value: 0.16 },
    };
    const U = this.uniforms;

    // Sclera (outside)
    const sclera = new THREE.Mesh(
      new THREE.SphereGeometry(1, opts.mobile ? 64 : 96, opts.mobile ? 48 : 72),
      new THREE.ShaderMaterial({ vertexShader: scleraVert, fragmentShader: scleraFrag, uniforms: { uNoise: U.uNoise, uLight: U.uLight } }),
    );
    this.scene.add(sclera);

    // Retina (inside)
    this.retinaMat = new THREE.ShaderMaterial({
      vertexShader: scleraVert,
      fragmentShader: retinaFrag,
      side: THREE.BackSide,
      uniforms: {
        uNoise: U.uNoise,
        uTime: U.uTime,
        uDisc: { value: new THREE.Vector3(...DISC) },
        uMicro: { value: 0 },
        uGlow: { value: 0 },
        uLightAmt: { value: 0.7 },
        uCup: { value: 0 },
      },
    });
    const retina = new THREE.Mesh(new THREE.SphereGeometry(0.985, opts.mobile ? 72 : 128, opts.mobile ? 48 : 96), this.retinaMat);
    this.scene.add(retina);

    // Iris
    const iris = new THREE.Mesh(
      new THREE.RingGeometry(0.02, 0.6, opts.mobile ? 96 : 160, 12),
      new THREE.ShaderMaterial({ vertexShader: irisVert, fragmentShader: irisFrag, side: THREE.DoubleSide, uniforms: { uNoise: U.uNoise, uLight: U.uLight, uPupil: U.uPupil } }),
    );
    this.scene.add(iris);

    // Lens
    this.lensMat = new THREE.ShaderMaterial({
      vertexShader: corneaVert,
      fragmentShader: lensFrag,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uNoise: U.uNoise, uTime: U.uTime, uAlpha: { value: 0.6 } },
    });
    const lens = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), this.lensMat);
    lens.scale.set(0.42, 0.42, 0.17);
    lens.position.z = 0.6;
    this.scene.add(lens);

    // Cornea (cap of a sphere centred at z=0.45, visible part z > 0.8)
    this.corneaMat = new THREE.ShaderMaterial({
      vertexShader: corneaVert,
      fragmentShader: corneaFrag,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uLight: U.uLight, uAlpha: { value: 1 } },
    });
    const cornea = new THREE.Mesh(new THREE.SphereGeometry(0.6946, 96, 48, 0, Math.PI * 2, 0, Math.PI * 0.34), this.corneaMat);
    cornea.rotation.x = Math.PI / 2;
    cornea.position.z = 0.45;
    this.scene.add(cornea);

    // Optic nerve tunnel
    const len = 9;
    this.tunnelMat = new THREE.ShaderMaterial({
      vertexShader: tunnelVert,
      fragmentShader: tunnelFrag,
      side: THREE.DoubleSide,
      uniforms: { uNoise: U.uNoise, uTime: U.uTime, uTunnel: { value: 0 }, uLen: { value: len } },
    });
    const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, len, opts.mobile ? 48 : 72, 1, true), this.tunnelMat);
    const dir = new THREE.Vector3(...DISC);
    tunnel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    tunnel.position.copy(dir.clone().multiplyScalar(0.96 + len / 2));
    this.scene.add(tunnel);

    // Light at the end of the nerve
    this.glowMat = new THREE.ShaderMaterial({
      vertexShader: tunnelVert,
      fragmentShader: glowFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uAlpha: { value: 1 } },
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), this.glowMat);
    glow.position.copy(dir.clone().multiplyScalar(0.96 + len - 0.2));
    glow.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(glow);

    // Bokeh particles: vitreous floaters inside, gold dust outside
    const count = opts.mobile ? 520 : 1500;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const nerveCount = Math.floor(count * 0.12);
    for (let i = 0; i < count; i++) {
      let x: number;
      let y: number;
      let z: number;
      if (i < count * 0.5) {
        // inside the vitreous
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
        } while (x * x + y * y + z * z > 0.8);
        size[i] = 0.9 + Math.random() * 2.2;
      } else if (i < count - nerveCount) {
        // dust in front of the eye
        const r = 1.35 + Math.random() * 3.2;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(Math.random() * 1.6 - 0.6);
        x = r * Math.sin(ph) * Math.cos(th) * 1.4;
        y = r * Math.sin(ph) * Math.sin(th) * 0.8;
        z = Math.abs(r * Math.cos(ph)) + 0.4;
        size[i] = 0.8 + Math.random() * 2.6;
      } else {
        // sparks along the optic nerve
        const k = 1.2 + Math.random() * 8;
        const a = Math.random() * Math.PI * 2;
        const rr = Math.random() * 0.07;
        const t1 = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        const t2 = new THREE.Vector3().crossVectors(t1, dir);
        const p = dir.clone().multiplyScalar(k).addScaledVector(t1, Math.cos(a) * rr).addScaledVector(t2, Math.sin(a) * rr);
        x = p.x;
        y = p.y;
        z = p.z;
        size[i] = 0.25 + Math.random() * 0.5;
      }
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      seed[i] = Math.random();
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    pg.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    this.pointsMat = new THREE.ShaderMaterial({
      vertexShader: pointsVert,
      fragmentShader: pointsFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: U.uTime,
        uPR: { value: this.pr },
        uFocus: { value: 3.5 },
        uScale: { value: 6 },
        uColor: { value: new THREE.Color(0.86, 0.72, 0.5) },
      },
    });
    const points = new THREE.Points(pg, this.pointsMat);
    points.frustumCulled = false;
    this.scene.add(points);

    // Fullscreen caustics while passing the lens
    this.causticMat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: causticFrag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uNoise: U.uNoise, uTime: U.uTime, uAmt: { value: 0 }, uAspect: { value: new THREE.Vector2(1, 1) } },
    });
    this.overlayScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.causticMat));

    if (!opts.mobile && !opts.reduced) {
      window.addEventListener('pointermove', (e) => {
        this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      });
    }
  }

  setSize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.size.set(w, h);
    this.camera.aspect = w / h;
    this.off.set(99999, 0); // force view-offset refresh
    this.camera.updateProjectionMatrix();
    (this.causticMat.uniforms.uAspect.value as THREE.Vector2).set(w / Math.max(w, h), h / Math.max(w, h));
  }

  /** Advances the camera toward the journey target and renders. */
  frame(time: number, dt: number, target: Float32Array, version: number): boolean {
    const c = this.cur;
    if (!this.initialised) {
      c.set(target);
      this.initialised = true;
    }
    const snap = this.opts.reduced;
    const k = snap ? 1 : 1 - Math.exp(-dt * (this.opts.mobile ? 4.2 : 3.4));
    let delta = 0;
    for (let i = 0; i < P_LEN; i++) {
      const d = target[i] - c[i];
      delta += Math.abs(d);
      c[i] += d * k;
    }
    // In reduced motion only render when something actually changed.
    if (snap) {
      if (version === this.lastVersion && this.settled > 2) return false;
      if (version !== this.lastVersion) this.settled = 0;
      this.lastVersion = version;
      this.settled++;
    } else if (this.opts.mobile && delta < 2e-4) {
      // Camera settled on a phone: ambient motion at 30 fps is plenty.
      this.odd = !this.odd;
      if (this.odd) return false;
    }

    this.pointerCur.lerp(this.pointer, 1 - Math.exp(-dt * 2.5));
    const px = this.pointerCur.x;
    const py = this.pointerCur.y;
    // pointer parallax shrinks as the camera goes deeper (stays gentle inside)
    const outside = Math.min(1, Math.max(0, (c[P_POS + 2] - 1.3) / 1.6));
    const par = 0.04 + 0.18 * outside;
    this.camera.position.set(c[P_POS] + px * par, c[P_POS + 1] - py * par, c[P_POS + 2]);
    this.look.set(c[P_LOOK] + px * par * 0.3, c[P_LOOK + 1] - py * par * 0.3, c[P_LOOK + 2]);
    this.camera.lookAt(this.look);
    // Frame the eye: on wide screens it sits right of the text column, on
    // phones slightly above centre. Inside the eye the framing recentres.
    const w = this.size.x;
    const h = this.size.y;
    const aspect = w / Math.max(1, h);
    const ox = aspect > 1.15 ? -0.2 * w * outside : 0;
    const oy = aspect < 0.8 ? 0.2 * h * outside : 0;
    // Portrait screens: widen the lens outside the eye so the whole globe fits.
    const fov = c[P_FOV] * (aspect < 0.8 ? 1 + (0.8 - aspect) * 0.9 * outside : 1);
    if (Math.abs(ox - this.off.x) > 0.5 || Math.abs(oy - this.off.y) > 0.5 || Math.abs(this.camera.fov - fov) > 0.01) {
      this.off.set(ox, oy);
      this.camera.fov = fov;
      this.camera.setViewOffset(w, h, ox, oy, w, h);
      this.camera.updateProjectionMatrix();
    }

    const t = snap ? 12.0 : time;
    this.uniforms.uTime.value = t;
    // pupil: 0..1 dilation → radius; a slow hippus keeps it alive
    const hippus = snap ? 0 : Math.sin(time * 0.9) * 0.008 + Math.sin(time * 2.3) * 0.004;
    this.uniforms.uPupil.value = 0.11 + c[P_PUPIL] * 0.36 + hippus;
    this.retinaMat.uniforms.uMicro.value = c[P_MICRO];
    this.retinaMat.uniforms.uGlow.value = c[P_GLOW];
    this.retinaMat.uniforms.uLightAmt.value = c[P_LIGHT];
    this.tunnelMat.uniforms.uTunnel.value = c[P_TUNNEL];
    this.retinaMat.uniforms.uCup.value = Math.min(1, c[P_TUNNEL] * 5);
    this.causticMat.uniforms.uAmt.value = c[P_CAUSTIC];
    this.pointsMat.uniforms.uFocus.value = c[P_FOCUS];
    // Fade the cornea's catchlight as the camera passes through it
    const cz = this.camera.position.z;
    this.corneaMat.uniforms.uAlpha.value = Math.min(1, Math.max(0, (cz - 1.16) / 0.5));
    this.lensMat.uniforms.uAlpha.value = 0.25 + 0.6 * Math.min(1, Math.max(0, 1 - Math.abs(cz - 0.6) * 2));

    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    if (c[P_CAUSTIC] > 0.01) {
      this.renderer.autoClear = false;
      this.renderer.render(this.overlayScene, this.overlayCam);
    }
    this.adapt(dt);
    return true;
  }

  /** Drops the pixel ratio when frames run long (and never raises it back mid-session above the cap). */
  private adapt(dt: number) {
    if (this.opts.reduced) return;
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 50) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes.length = 0;
    let next = this.pr;
    if (avg > 1 / 45 && this.pr > 0.75) next = Math.max(0.75, this.pr - 0.25);
    else if (avg < 1 / 58 && this.pr < this.maxPr) next = Math.min(this.maxPr, this.pr + 0.125);
    if (next !== this.pr) {
      this.pr = next;
      this.renderer.setPixelRatio(next);
      this.pointsMat.uniforms.uPR.value = next;
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.renderer.setSize(w, h, false);
    }
  }

  dispose() {
    this.renderer.dispose();
  }
}
