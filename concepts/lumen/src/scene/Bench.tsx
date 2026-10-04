import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, useFBO } from '@react-three/drei';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { scene, subscribePreset, type OpticElement, type Preset } from '../lib/scene-store';
import { reducedMotion, tier } from '../lib/env';
import { apertureGeometry, bladeGeometry, lensGeometry } from './geometry';
import {
  MAX_EL,
  beamFrag,
  beamVert,
  floorFrag,
  floorVert,
  moteFrag,
  moteVert,
  spectrumFrag,
  spectrumVert,
} from './shaders';

const HIGH = tier === 'high';
const CAM_START = 6.5;
const FLOOR_Y = -1.75;
const FOG_NEAR = 7.5;
const FOG_FAR = 25;
const CREAM = new THREE.Color('#f4f2ed');
/** Raw sRGB triplets for the custom shaders (they write display values). */
const hex3 = (h: string) => new THREE.Vector3(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const CREAM3 = hex3('#f4f2ed');
const SAND3 = hex3('#e6e0d2');

/** Horizontal spread of the elements: wide screens push glass to the sides of the copy. */
const spreadFor = (w: number, h: number) => (w / h < 0.9 ? 0.55 : w / h > 1.5 ? 1.75 : 1.3);

const usePreset = () =>
  useSyncExternalStore(
    subscribePreset,
    () => scene.preset,
    () => scene.preset,
  );

/** Elements uniform shared by beam + floor (x, z, size, kind). */
const useElementUniform = (preset: Preset, spread: number) =>
  useMemo(() => {
    const arr = Array.from({ length: MAX_EL }, () => new THREE.Vector4());
    preset.elements.slice(0, MAX_EL).forEach((e, i) => arr[i].set((e.x ?? 0) * spread, e.z, e.size ?? 1, 0));
    return { value: arr, count: Math.min(preset.elements.length, MAX_EL) };
  }, [preset, spread]);

/* -------------------------------------------------------------- camera */

const damp = (a: number, b: number, l: number, dt: number) => THREE.MathUtils.damp(a, b, l, dt);

function Rig() {
  const { camera, size } = useThree();
  const s = useRef({ p: CAM_START, warp: 0, px: 0, py: 0 });
  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const st = s.current;
    const d = Math.min(dt, 0.05);
    const travel = scene.preset.travel;
    const target = reducedMotion
      ? CAM_START
      : scene.camZ ?? CAM_START - scene.progress * travel;
    // After a preset swap (during the warp) snap instead of travelling back.
    st.p = Math.abs(target - st.p) > 12 ? target : damp(st.p, target, 5, d);
    st.warp = reducedMotion ? 0 : scene.warp;
    st.px = damp(st.px, scene.pointer.x, 2.5, d);
    st.py = damp(st.py, scene.pointer.y, 2.5, d);
    const portrait = size.width / size.height < 0.9;
    const z = st.p - st.warp * 7.5 + (portrait ? 2.2 : 0);
    const sway = Math.sin(st.p * 0.35) * 0.35;
    // Portrait screens: the copy sits low, so the glass is framed in the upper third.
    const camY = portrait ? 0.15 : 0.45;
    const lookY = portrait ? -2.1 : -0.15;
    cam.position.set(sway + st.px * 0.35, camY + st.py * 0.18 + st.warp * -0.2, z);
    cam.lookAt(sway * 0.4 + st.px * 0.1, lookY, z - 8);
    cam.rotateZ(st.warp * 0.08);
    const fov = (portrait ? 52 : 36) + st.warp * 38;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/* -------------------------------------------------------------- glass */

function GlassMaterial({ buffer }: { buffer: THREE.Texture }) {
  return (
    <MeshTransmissionMaterial
      buffer={buffer}
      resolution={32}
      samples={HIGH ? 6 : 3}
      thickness={0.9}
      chromaticAberration={HIGH ? 0.09 : 0.05}
      anisotropicBlur={0.08}
      distortion={0.06}
      distortionScale={0.35}
      temporalDistortion={0.04}
      ior={1.46}
      roughness={0.02}
      color="#fffdf8"
      attenuationColor="#f1e4c8"
      attenuationDistance={4}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={1.15}
    />
  );
}

const gold = new THREE.MeshStandardMaterial({ color: '#c9b08a', metalness: 1, roughness: 0.22, envMapIntensity: 1.3 });
const forest = new THREE.MeshStandardMaterial({ color: '#1b2e28', metalness: 0.65, roughness: 0.34, envMapIntensity: 1 });

function Optic({ el, index, buffer, spread }: { el: OpticElement; index: number; buffer: THREE.Texture; spread: number }) {
  const g = useRef<THREE.Group>(null);
  const blades = useRef<THREE.Group>(null);
  const size = el.size ?? 1;
  const geo = useMemo(() => {
    switch (el.kind) {
      case 'lens':
        return lensGeometry(size, el.curve ?? 0.4);
      case 'meniscus':
        return lensGeometry(size, el.curve ?? 0.4, true);
      case 'aperture':
        return apertureGeometry(size, size * 0.72);
      default:
        return null;
    }
  }, [el.kind, el.curve, size]);
  const bladeGeo = useMemo(() => (el.kind === 'aperture' ? bladeGeometry(size * 0.78) : null), [el.kind, size]);

  useFrame((state) => {
    if (!g.current) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.current.position.y = (el.y ?? 0) + Math.sin(t * 0.6 + index * 1.7) * 0.07;
    const base = el.turn ?? 0;
    if (el.kind === 'prism') g.current.rotation.y = base + t * 0.12;
    else if (el.kind === 'sphere') g.current.rotation.y = t * 0.1;
    else g.current.rotation.y = base + Math.sin(t * 0.35 + index) * 0.12 - 0.25 * (el.x ?? 0) * 0.3;
    if (blades.current) {
      // The iris opens as the camera approaches it.
      const dz = state.camera.position.z - el.z;
      const open = THREE.MathUtils.clamp((dz - 1.5) / 6, 0, 1);
      const theta = THREE.MathUtils.lerp(1.25, 0.5, open) * scene.iris + (1 - scene.iris) * 0.35;
      blades.current.children.forEach((b, i) => {
        const a = (i / 8) * Math.PI * 2;
        b.rotation.z = a + Math.PI - theta;
      });
    }
  });

  const pos: [number, number, number] = [(el.x ?? 0) * spread, el.y ?? 0, el.z];
  return (
    <group ref={g} position={pos}>
      {(el.kind === 'lens' || el.kind === 'meniscus') && geo && (
        <>
          <mesh geometry={geo}>
            <GlassMaterial buffer={buffer} />
          </mesh>
          <mesh material={gold}>
            <torusGeometry args={[size * 1.005, 0.028 * size, 12, 96]} />
          </mesh>
        </>
      )}
      {el.kind === 'sphere' && (
        <mesh>
          <sphereGeometry args={[size, HIGH ? 64 : 40, HIGH ? 48 : 28]} />
          <GlassMaterial buffer={buffer} />
        </mesh>
      )}
      {el.kind === 'prism' && (
        <group>
          <mesh rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[size, size, size * 1.9, 3, 1]} />
            <GlassMaterial buffer={buffer} />
          </mesh>
          <mesh material={gold} position={[0, -size * 0.98, 0]} rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[size * 1.04, size * 1.04, 0.04, 3, 1]} />
          </mesh>
        </group>
      )}
      {el.kind === 'cylinder' && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[size * 0.42, size * 0.42, size * 2.6, HIGH ? 64 : 36, 1]} />
          <GlassMaterial buffer={buffer} />
        </mesh>
      )}
      {el.kind === 'pane' && (
        <group>
          <RoundedBox args={[size * 1.5, size * 2, 0.09]} radius={0.04} smoothness={3}>
            <GlassMaterial buffer={buffer} />
          </RoundedBox>
          <mesh material={gold} position={[0, -size * 1.02, 0]}>
            <boxGeometry args={[size * 1.5, 0.025, 0.12]} />
          </mesh>
        </group>
      )}
      {el.kind === 'aperture' && geo && bladeGeo && (
        <group>
          <mesh geometry={geo} material={forest} />
          <mesh material={gold}>
            <torusGeometry args={[size * 0.72, 0.022, 10, 96]} />
          </mesh>
          <group ref={blades} position={[0, 0, 0.02]}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const r = size * 0.72;
              return (
                <mesh
                  key={i}
                  geometry={bladeGeo}
                  material={forest}
                  position={[Math.cos(a) * r, Math.sin(a) * r, i * 0.004]}
                />
              );
            })}
          </group>
        </group>
      )}
    </group>
  );
}

/* -------------------------------------------------------------- beam, floor, spectrum, motes */

function Beam({ preset, spread }: { preset: Preset; spread: number }) {
  const els = useElementUniform(preset, spread);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVert,
        fragmentShader: beamFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uEl: { value: els.value },
          uCount: { value: els.count },
          uR0: { value: 0.38 },
          uY: { value: 0 },
          uTime: { value: 0 },
          uFogNear: { value: FOG_NEAR },
          uFogFar: { value: FOG_FAR },
        },
      }),
    [els],
  );
  const geo = useMemo(() => {
    const len = 90;
    const g = new THREE.CylinderGeometry(1, 1, len, 28, 360, true);
    g.rotateX(Math.PI / 2);
    g.translate(0, 0, 12 - len / 2);
    return g;
  }, []);
  useFrame((st) => {
    mat.uniforms.uTime.value = reducedMotion ? 0 : st.clock.elapsedTime;
  });
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={2} />;
}

function Floor({ preset, spread }: { preset: Preset; spread: number }) {
  const els = useElementUniform(preset, spread);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: floorVert,
        fragmentShader: floorFrag,
        uniforms: {
          uEl: { value: els.value },
          uCount: { value: els.count },
          uR0: { value: 0.38 },
          uTime: { value: 0 },
          uQuality: { value: HIGH ? 1 : 0 },
          uFogNear: { value: FOG_NEAR },
          uFogFar: { value: FOG_FAR },
          uCream: { value: CREAM3 },
          uSand: { value: SAND3 },
        },
      }),
    [els],
  );
  const ref = useRef<THREE.Mesh>(null);
  useFrame((st) => {
    mat.uniforms.uTime.value = reducedMotion ? 3 : st.clock.elapsedTime;
    // the floor follows the camera so it never ends
    if (ref.current) ref.current.position.z = Math.round(st.camera.position.z / 4) * 4 - 20;
  });
  return (
    <mesh ref={ref} material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -20]}>
      <planeGeometry args={[70, 80, 1, 1]} />
    </mesh>
  );
}

const SPECTRUM = ['#c8574a', '#d98b3e', '#d6b54a', '#6f9b5c', '#3f8a8c', '#3f5f9e', '#6a4f93'];

function Spectrum({ at, x }: { at: number; x: number }) {
  const mats = useMemo(
    () =>
      SPECTRUM.map(
        (c) =>
          new THREE.ShaderMaterial({
            vertexShader: spectrumVert,
            fragmentShader: spectrumFrag,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            uniforms: { uColor: { value: new THREE.Color(c) }, uTime: { value: 0 }, uFogFar: { value: FOG_FAR } },
          }),
      ),
    [],
  );
  useFrame((st) => mats.forEach((m) => (m.uniforms.uTime.value = st.clock.elapsedTime)));
  const len = 14;
  return (
    <group position={[x, -0.02, at - 0.4]}>
      {mats.map((m, i) => (
        <group key={i} rotation={[0, (i - 3) * 0.05 + 0.06, 0]}>
          <mesh material={m} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002 * i, -len / 2]} renderOrder={3}>
            <planeGeometry args={[0.22, len, 1, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Motes() {
  const count = HIGH ? 260 : 80;
  const { geo, mat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = -1.2 + Math.random() * 2.6;
      pos[i * 3 + 2] = -Math.random() * 16;
      seed[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: moteVert,
      fragmentShader: moteFrag,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 }, uPx: { value: Math.min(window.devicePixelRatio, 2) } },
    });
    return { geo: g, mat: m };
  }, [count]);
  useFrame((st) => {
    mat.uniforms.uTime.value = st.clock.elapsedTime;
    mat.uniforms.uCamZ.value = st.camera.position.z;
  });
  return <points geometry={geo} material={mat} frustumCulled={false} renderOrder={4} />;
}

/* -------------------------------------------------------------- composition */

function Bench() {
  const preset = usePreset();
  const glass = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const scale = HIGH ? 0.75 : 0.5;
  const fbo = useFBO(Math.round(size.width * viewport.dpr * scale), Math.round(size.height * viewport.dpr * scale), {
    samples: 0,
  });

  // Render everything except the glass once into a shared buffer; every
  // glass element refracts that same texture (one extra pass in total).
  useFrame((state) => {
    if (!glass.current) return;
    glass.current.visible = false;
    state.gl.setRenderTarget(fbo);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    glass.current.visible = true;
  });

  const spread = spreadFor(size.width, size.height);
  const spectrumEl = preset.spectrumAt !== undefined ? preset.elements.find((e) => e.z === preset.spectrumAt) : undefined;

  return (
    <>
      <Rig />
      <Floor preset={preset} spread={spread} />
      <Beam preset={preset} spread={spread} />
      {spectrumEl && <Spectrum at={spectrumEl.z} x={(spectrumEl.x ?? 0) * spread} />}
      <Motes />
      <group ref={glass}>
        {preset.elements.map((el, i) => (
          <Optic key={preset.id + i} el={el} index={i} buffer={fbo.texture} spread={spread} />
        ))}
      </group>
    </>
  );
}

/** Pause the GPU when no transparent stage section is on screen. */
function Governor() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (reducedMotion) {
      setFrameloop('demand');
      const un = subscribePreset(() => setTimeout(() => invalidate(), 50));
      const id = window.setInterval(() => invalidate(), 1000);
      return () => {
        un();
        clearInterval(id);
      };
    }
    let last = '';
    const id = window.setInterval(() => {
      const mode = scene.stageVisible || scene.warp > 0.01 ? 'always' : 'never';
      if (mode !== last) {
        last = mode;
        setFrameloop(mode);
      }
    }, 150);
    return () => clearInterval(id);
  }, [setFrameloop, invalidate]);
  return null;
}

export default function BenchCanvas({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={HIGH ? [1, 1.75] : [1, 1.5]}
      flat
      gl={{ antialias: HIGH, powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 36, near: 0.1, far: 80, position: [0, 0.45, CAM_START] }}
      onCreated={({ gl }) => {
        gl.setClearColor(CREAM);
        onReady?.();
      }}
    >
      <color attach="background" args={['#f4f2ed']} />
      <fog attach="fog" args={['#f4f2ed', FOG_NEAR, FOG_FAR]} />
      <Environment resolution={HIGH ? 256 : 128} frames={1}>
        <color attach="background" args={['#2a3b34']} />
        <Lightformer form="rect" intensity={2.4} color="#fff8ec" position={[0, 6, -2]} rotation-x={Math.PI / 2} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 0.5, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-6, -0.6, 0]} rotation-y={Math.PI / 2} scale={[10, 0.25, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#fff3dc" position={[6, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[10, 0.8, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#d9bd8c" position={[5, 3, 4]} scale={1.6} />
        <Lightformer form="rect" intensity={1.4} color="#e9dcc4" position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} />
      </Environment>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} color="#fff4e2" />
      <Bench />
      <Governor />
    </Canvas>
  );
}
