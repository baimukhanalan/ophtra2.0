import * as THREE from 'three';

/** Biconvex (or meniscus) lens as a lathe around the optical axis (Z). */
export const lensGeometry = (radius: number, curve: number, meniscus = false, segs = 72) => {
  const pts: THREE.Vector2[] = [];
  const edge = 0.035 * radius;
  const h = radius * (0.08 + curve * 0.55);
  const steps = 28;
  // front surface, centre → rim
  for (let i = 0; i <= steps; i++) {
    const r = (i / steps) * radius;
    const k = 1 - (r / radius) ** 2;
    pts.push(new THREE.Vector2(r, edge + h * k));
  }
  // back surface, rim → centre
  for (let i = steps; i >= 0; i--) {
    const r = (i / steps) * radius;
    const k = 1 - (r / radius) ** 2;
    const back = meniscus ? edge * 0.2 + h * 0.62 * k : -(edge + h * 0.85 * k);
    pts.push(new THREE.Vector2(Math.max(r, 0.0001), back - (meniscus ? edge : 0)));
  }
  const g = new THREE.LatheGeometry(pts, segs);
  g.rotateX(Math.PI / 2);
  g.computeVertexNormals();
  return g;
};

/** Machined aperture ring (annulus with a bevel). */
export const apertureGeometry = (outer: number, inner: number) => {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 3,
    curveSegments: 72,
  });
  g.translate(0, 0, -0.06);
  return g;
};

/** One iris blade: a curved sliver pivoting on the ring. */
export const bladeGeometry = (r: number) => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(r * 0.55, r * 0.16, r * 1.02, r * 0.02);
  s.quadraticCurveTo(r * 0.62, r * 0.46, 0.02, r * 0.5);
  s.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false, curveSegments: 16 });
  return g;
};
