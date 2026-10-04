/* GLSL for the optical bench. Colours are authored in display (sRGB) space
   because the canvas runs with tone mapping and colour management off for
   these materials — the cream of the floor must match the CSS cream exactly. */

export const MAX_EL = 8;

/** Shared: the beam's centre line and radius as a function of z. */
const beamPath = /* glsl */ `
uniform vec4 uEl[${MAX_EL}];   // x, z, size, kind
uniform int uCount;
uniform float uR0;

// Beam centre x and focus factor (1 = full width, ~0.1 = focal point).
vec2 beamAt(float z) {
  if (uCount == 0) return vec2(0.0, 1.0);
  if (z >= uEl[0].y) return vec2(uEl[0].x, 1.0);
  for (int k = 0; k < ${MAX_EL}; k++) {
    if (k >= uCount) break;
    float z0 = uEl[k].y;
    float x0 = uEl[k].x;
    bool last = (k == uCount - 1);
    float z1 = last ? z0 - 9.0 : uEl[k + 1].y;
    float x1 = last ? x0 * 0.4 : uEl[k + 1].x;
    if (z <= z0 && (z > z1 || last)) {
      float s = clamp((z0 - z) / max(z0 - z1, 0.001), 0.0, 1.0);
      float f = 0.1 + 0.9 * abs(1.0 - 2.0 * s);
      if (last && s >= 1.0) f = 1.0;
      return vec2(mix(x0, x1, smoothstep(0.0, 1.0, s)), f);
    }
  }
  return vec2(0.0, 1.0);
}
`;

export const beamVert = /* glsl */ `
${beamPath}
uniform float uY;
varying float vFacing;
varying float vZ;
varying float vFocus;
varying float vDepth;
void main() {
  vec3 p = position;
  vec2 b = beamAt(p.z);
  float r = uR0 * b.y;
  vec3 n = normalize(vec3(p.x, p.y, 0.0));
  p.xy = n.xy * r;
  p.x += b.x;
  p.y += uY;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec3 viewDir = normalize(cameraPosition - world.xyz);
  vFacing = abs(dot(normalize(mat3(modelMatrix) * n), viewDir));
  vZ = p.z;
  vFocus = b.y;
  vec4 mv = viewMatrix * world;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const beamFrag = /* glsl */ `
uniform float uTime;
uniform float uFogNear;
uniform float uFogFar;
varying float vFacing;
varying float vZ;
varying float vFocus;
varying float vDepth;
void main() {
  float core = pow(vFacing, 2.4);
  float shimmer = 0.75 + 0.25 * sin(vZ * 2.2 + uTime * 1.6) * sin(vZ * 0.7 - uTime * 0.9);
  float focusBoost = mix(2.2, 1.0, smoothstep(0.1, 0.6, vFocus));
  float a = core * 0.34 * shimmer * focusBoost;
  a *= 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
  vec3 col = mix(vec3(0.86, 0.72, 0.47), vec3(1.0, 0.985, 0.95), core);
  gl_FragColor = vec4(col, clamp(a, 0.0, 0.85));
}
`;

export const floorVert = /* glsl */ `
varying vec2 vXZ;
varying float vDepth;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vXZ = world.xz;
  vec4 mv = viewMatrix * world;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const floorFrag = /* glsl */ `
${beamPath}
uniform float uTime;
uniform float uQuality;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uCream;
uniform vec3 uSand;
varying vec2 vXZ;
varying float vDepth;

float caus(vec2 p, float t) {
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}

void main() {
  vec3 col = mix(uSand, uCream, 0.35 * (1.0 - smoothstep(0.0, 6.0, abs(vXZ.x))));
  float t = uTime * 0.32;

  // Light of the beam falling on the floor (a soft, moving caustic ribbon).
  vec2 b = beamAt(vXZ.y);
  float dx = vXZ.x - b.x;
  float ribbon = exp(-dx * dx / (0.5 * b.y + 0.05));
  vec2 cp = vec2(vXZ.x * 4.2, vXZ.y * 2.4);
  float cr = caus(cp + 20.0, t);
  vec3 spec = vec3(cr);
  if (uQuality > 0.5) {
    spec = vec3(cr, caus(cp * 1.018 + 20.0, t), caus(cp * 1.036 + 20.0, t));
  }
  vec3 light = min(spec, vec3(1.6)) * ribbon * mix(1.6, 0.55, b.y);

  float shadow = 0.0;
  float pools = 0.0;
  for (int k = 0; k < ${MAX_EL}; k++) {
    if (k >= uCount) break;
    vec4 e = uEl[k];
    // shadow sits slightly towards the camera, the focal pool further on
    vec2 sd = vXZ - vec2(e.x - 0.15, e.y + 0.55);
    shadow += exp(-dot(sd, sd) / (e.z * e.z * 0.55)) * 0.075;
    vec2 fd = vXZ - vec2(e.x + 0.1, e.y - 1.1 * e.z);
    fd.y *= 0.55;
    pools += exp(-dot(fd, fd) / (e.z * e.z * 0.05));
  }

  col *= 1.0 - shadow;
  col = mix(col, col * vec3(0.95, 0.9, 0.8), ribbon * 0.25);
  col += light * vec3(0.55, 0.45, 0.28) * 0.5;
  col += pools * vec3(1.0, 0.93, 0.8) * 0.16;

  float fogF = smoothstep(uFogNear, uFogFar, vDepth);
  col = mix(col, uCream, fogF);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const spectrumVert = /* glsl */ `
varying vec2 vUv;
varying float vDepth;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const spectrumFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uFogFar;
varying vec2 vUv;
varying float vDepth;
void main() {
  float across = 1.0 - abs(vUv.x * 2.0 - 1.0);
  float along = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.35, 1.0, vUv.y));
  float a = pow(across, 1.6) * along * (0.5 + 0.08 * sin(uTime * 2.0 + vUv.y * 12.0));
  a *= 1.0 - smoothstep(uFogFar * 0.6, uFogFar, vDepth);
  gl_FragColor = vec4(uColor, a);
}
`;

export const moteVert = /* glsl */ `
uniform float uTime;
uniform float uCamZ;
uniform float uPx;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.25 + aSeed * 6.28) * 0.25;
  p.x += cos(uTime * 0.2 + aSeed * 12.0) * 0.18;
  // wrap along z so motes always surround the camera
  p.z = uCamZ + 2.0 - mod(uCamZ + 2.0 - p.z, 16.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  gl_PointSize = uPx * (1.4 + aSeed * 2.4) * (6.0 / max(d, 0.5));
  vAlpha = (0.35 + 0.65 * fract(aSeed * 7.13)) * smoothstep(0.4, 2.0, d) * (1.0 - smoothstep(9.0, 15.0, d));
  vAlpha *= 0.55 + 0.45 * sin(uTime * 0.9 + aSeed * 40.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const moteFrag = /* glsl */ `
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(0.72, 0.58, 0.34, a * 0.7);
}
`;
