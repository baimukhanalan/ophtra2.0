/**
 * GLSL for the procedural eye. All noise comes from one small tileable noise
 * texture (value noise, 4 independent channels) — a handful of texture reads
 * per pixel instead of analytic simplex noise keeps phones cool.
 */

export const NOISE = /* glsl */ `
uniform sampler2D uNoise;
float n2(vec2 p){ return texture2D(uNoise, p).r; }
float n2g(vec2 p){ return texture2D(uNoise, p).g; }

float caus(vec2 p, float t){
  vec2 q = p;
  float acc = 0.0;
  for (int i = 0; i < 4; i++){
    float fi = float(i);
    q = p + vec2(sin(q.y * 1.7 + t * 0.35 + fi * 1.3), cos(q.x * 1.5 - t * 0.3 + fi * 2.1)) * 0.85;
    acc += 0.02 / (abs(sin(q.x * 1.3 + fi) * cos(q.y * 1.2 - fi)) + 0.03);
  }
  return pow(acc * 0.22, 2.2);
}
float fbm2(vec2 p){
  float s = 0.0;
  s += 0.5    * texture2D(uNoise, p).r;
  s += 0.25   * texture2D(uNoise, p * 2.0 + 0.37).g;
  s += 0.125  * texture2D(uNoise, p * 4.0 + 0.71).b;
  s += 0.0625 * texture2D(uNoise, p * 8.0 + 0.13).a;
  return s / 0.9375;
}
`;

/* ------------------------------------------------------------ sclera */
export const scleraVert = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main(){
  vL = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const scleraFrag = /* glsl */ `
${NOISE}
uniform vec3 uLight;
varying vec3 vN; varying vec3 vW; varying vec3 vL;
void main(){
  vec3 n = normalize(vL);
  if (n.z > 0.8) discard;
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uLight);
  float wrap = max((dot(N, L) + 0.4) / 1.4, 0.0);
  vec2 q = n.xy / (1.0 + n.z);                     // stereographic from the back
  float warp = fbm2(q * 0.35 + 0.2);
  float vein = 1.0 - abs(fbm2(q * 0.9 + warp * 0.5) * 2.0 - 1.0);
  vein = pow(vein, 60.0) * smoothstep(0.35, 0.78, n.z) * smoothstep(0.45, 0.6, n2g(q * 0.2));
  vec3 base = vec3(0.88, 0.85, 0.79);
  base = mix(base, vec3(0.6, 0.24, 0.18), vein * 0.4);
  base *= mix(1.0, 0.5, smoothstep(0.55, 0.8, n.z));  // limbal shadow
  vec3 col = base * (0.03 + 0.8 * wrap * wrap * wrap);
  col *= smoothstep(-0.45, 0.6, n.z);                 // falls into velvet dark
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  col += vec3(0.79, 0.69, 0.54) * fres * 0.4 * smoothstep(-0.3, 0.5, n.z);
  vec3 H = normalize(L + V);
  col += vec3(1.0, 0.95, 0.85) * pow(max(dot(N, H), 0.0), 90.0) * 0.28;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ------------------------------------------------------------ iris */
export const irisVert = /* glsl */ `
uniform float uPupil;
varying vec2 vXY;
void main(){
  vXY = position.xy;
  float r = length(position.xy);
  vec3 p = position;
  // gentle cone: the pupil margin rides forward on the lens
  p.z = 0.782 + 0.03 * (1.0 - smoothstep(uPupil, 0.6, r));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

export const irisFrag = /* glsl */ `
${NOISE}
#define TAU 6.2831853
uniform float uPupil;
uniform vec3 uLight;
varying vec2 vXY;
void main(){
  float r = length(vXY);
  if (r < uPupil) discard;
  float a = atan(vXY.y, vXY.x) / TAU;               // -0.5..0.5, periodic via integer scales
  float rn = clamp((r - uPupil) / (0.6 - uPupil), 0.0, 1.0);
  // radial fibres: high frequency around, low frequency outward
  float f1 = n2(vec2(a * 16.0, rn * 0.35));
  float f2 = n2g(vec2(a * 48.0, rn * 0.55 + 0.3));
  float f3 = texture2D(uNoise, vec2(a * 96.0, rn * 0.8 + 0.6)).b;
  float fib = clamp(0.1 + 0.45 * f1 + 0.35 * f2 + 0.3 * f3, 0.0, 1.0);
  float wob = texture2D(uNoise, vec2(a * 5.0, 0.21)).a;
  float collR = 0.3 + 0.08 * wob;
  float coll = exp(-pow((rn - collR) / 0.05, 2.0));
  vec3 gold = vec3(0.86, 0.70, 0.44);
  vec3 amber = vec3(0.52, 0.34, 0.16);
  vec3 forest = vec3(0.10, 0.21, 0.17);
  vec3 sage = vec3(0.30, 0.42, 0.32);
  vec3 inner = mix(amber, gold, fib);
  vec3 outer = mix(forest, sage, fib * fib);
  vec3 col = mix(inner, outer, smoothstep(collR - 0.04, collR + 0.3, rn));
  col += gold * coll * 0.5 * fib;
  // crypts
  float cr = smoothstep(0.62, 0.8, n2(vec2(a * 12.0, rn * 0.6 + 0.5)));
  cr *= smoothstep(0.2, 0.36, rn) * (1.0 - smoothstep(0.7, 0.86, rn));
  col *= 1.0 - cr * 0.6;
  col *= 0.45 + 0.9 * pow(fib, 1.4);
  // contraction furrows
  float fur = smoothstep(0.93, 1.0, sin(rn * 44.0 + wob * 6.0) * 0.5 + 0.5) * smoothstep(0.55, 0.7, rn);
  col *= 1.0 - fur * 0.35;
  col *= mix(1.0, 0.08, smoothstep(0.82, 1.0, rn));   // limbal ring
  float ruff = 1.0 - smoothstep(0.0, 0.045, rn);
  col = mix(col, vec3(0.22, 0.12, 0.05), ruff * 0.85);
  float lit = 0.5 + 0.7 * clamp(dot(normalize(vec3(vXY * 1.3, 1.0)), normalize(uLight)), 0.0, 1.0);
  gl_FragColor = vec4(col * lit, 1.0);
}`;

/* ------------------------------------------------------------ cornea */
export const corneaVert = /* glsl */ `
varying vec3 vN; varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const corneaFrag = /* glsl */ `
uniform vec3 uLight;
uniform float uAlpha;
varying vec3 vN; varying vec3 vW;
void main(){
  if (vW.z < 0.8) discard;
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1.0 - abs(dot(N, V)), 2.4);
  vec3 R = reflect(-V, N);
  vec3 L = normalize(uLight);
  float d = dot(R, L);
  vec3 lx = normalize(cross(vec3(0.0, 1.0, 0.0), L));
  vec3 ly = cross(L, lx);
  vec2 q = vec2(dot(R, lx), dot(R, ly)) / max(d, 0.02);
  float win = step(0.0, d) * (1.0 - smoothstep(0.15, 0.2, abs(q.x))) * (1.0 - smoothstep(0.2, 0.26, abs(q.y)));
  win *= smoothstep(0.004, 0.014, abs(q.x)) * smoothstep(0.004, 0.014, abs(q.y + 0.03));
  float soft = pow(max(d, 0.0), 40.0) * 0.5;
  // second, warm rim light from behind-left
  float rim = pow(max(dot(R, normalize(vec3(0.9, -0.3, 0.2))), 0.0), 18.0) * 0.25;
  vec3 col = vec3(1.0, 0.96, 0.88) * (win * 0.95 + soft) + vec3(0.79, 0.66, 0.46) * (fres * 0.45 + rim);
  gl_FragColor = vec4(col * uAlpha, 1.0);
}`;

/* ------------------------------------------------------------ lens */
export const lensFrag = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uAlpha;
varying vec3 vN; varying vec3 vW;
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1.0 - abs(dot(N, V)), 2.0);
  float c = caus(vW.xy * 9.0, uTime);
  vec3 col = vec3(0.85, 0.72, 0.5) * (fres * 0.55 + c * 0.25) + vec3(0.3, 0.22, 0.1) * 0.08;
  gl_FragColor = vec4(col * uAlpha, 1.0);
}`;

/* ------------------------------------------------------------ retina (inside) */
export const retinaFrag = /* glsl */ `
${NOISE}
uniform vec3 uDisc;
uniform float uMicro;
uniform float uGlow;
uniform float uLightAmt;
uniform float uTime;
uniform float uCup;
varying vec3 vN; varying vec3 vW; varying vec3 vL;
vec2 hash2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
vec2 cells(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float d = 8.0;
  float id = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 g = vec2(float(x), float(y));
    vec2 h = hash2(i + g);
    vec2 o = 0.5 + 0.38 * sin(6.2831 * h);
    float l = length(g + o - f);
    if (l < d) { d = l; id = h.x; }
  }
  return vec2(d, id);
}
void main(){
  vec3 d = normalize(vL);
  float back = smoothstep(0.45, -0.5, d.z);
  float gd = 2.0 * asin(clamp(length(d - uDisc) * 0.5, 0.0, 1.0));
  float discR = 0.085;
  if (gd < discR * 0.32 * uCup) discard;                    // the cup opens into the nerve
  vec3 t1 = normalize(cross(uDisc, vec3(0.0, 1.0, 0.0)));
  vec3 t2 = cross(t1, uDisc);
  float ang = atan(dot(d, t2), dot(d, t1));
  float gm = 2.0 * asin(clamp(length(d - vec3(0.0, 0.0, -1.0)) * 0.5, 0.0, 1.0));
  vec2 q = d.xy / (1.0 - d.z);                         // stereographic from the front pole
  float mott = fbm2(q * 1.6 + 0.3);
  vec3 fundus = mix(vec3(0.30, 0.12, 0.05), vec3(0.66, 0.36, 0.13), mott);
  fundus = mix(fundus, vec3(0.18, 0.16, 0.08), smoothstep(0.45, 0.8, fbm2(q * 0.5 + 0.7)) * 0.5);
  // vessels radiate from the disc and arc around the macula
  float warp = (fbm2(q * 0.9 + 0.11) - 0.5) * 1.6;
  float bend = gd * 0.9 * cos(ang);
  float s1 = abs(sin(ang * 2.5 + warp + bend));
  float w1 = mix(0.12, 0.025, clamp(gd / 1.3, 0.0, 1.0));
  float v1 = 1.0 - smoothstep(w1 * 0.45, w1, s1);
  float s2 = abs(sin(ang * 8.0 + warp * 2.2 + gd * 3.0));
  float w2 = mix(0.06, 0.018, clamp(gd / 1.3, 0.0, 1.0));
  float v2 = (1.0 - smoothstep(w2 * 0.45, w2, s2)) * smoothstep(0.12, 0.4, gd);
  float s3 = abs(sin(ang * 21.0 + warp * 4.0 + gd * 7.0));
  float v3 = (1.0 - smoothstep(0.004, 0.012, s3)) * smoothstep(0.3, 0.7, gd);
  float vessels = max(max(v1, v2 * 0.85), v3 * 0.6);
  vessels *= 1.0 - smoothstep(0.24, 0.07, gm);         // avascular fovea
  vessels *= 1.0 - smoothstep(1.2, 1.9, gd);
  vec3 col = mix(fundus, vec3(0.32, 0.05, 0.03), vessels * 0.85);
  col += vec3(0.95, 0.66, 0.36) * v1 * pow(1.0 - s1 / max(w1, 0.001), 3.0) * 0.18;
  // macula & fovea
  float mac = exp(-pow(gm / 0.17, 2.0));
  col = mix(col, col * 0.42, mac * 0.8);
  float fov = exp(-pow(gm / 0.03, 2.0));
  float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
  col += vec3(0.98, 0.8, 0.46) * (fov * 0.25 + mac * 0.1 * uGlow * pulse + fov * uGlow * 0.55);
  // optic disc
  float disc = 1.0 - smoothstep(discR * 0.8, discR * 1.05, gd);
  vec3 discCol = mix(vec3(0.93, 0.74, 0.5), vec3(1.0, 0.93, 0.8), 1.0 - smoothstep(discR * 0.45, discR * 0.85, gd));
  col = mix(col, discCol, disc);
  // photoreceptor mosaic (microscopy scale)
  if (uMicro > 0.001) {
    vec2 m = q * 1500.0;
    vec2 cc = cells(m);
    float cone = smoothstep(0.42, 0.08, cc.x);
    float seed = cc.y;
    vec3 coneCol = mix(vec3(0.95, 0.76, 0.42), vec3(0.42, 0.6, 0.44), step(0.72, seed));
    vec3 mos = mix(vec3(0.05, 0.025, 0.015), coneCol * 0.55, cone) * (0.6 + 0.6 * fov);
    col = mix(col, mos, uMicro * (1.0 - smoothstep(0.15, 0.4, gm)));
  }
  float light = 0.22 + 0.7 * exp(-pow(gm / 0.85, 2.0));
  col *= light * back * uLightAmt;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ------------------------------------------------------------ optic nerve */
export const tunnelVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

export const tunnelFrag = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uTunnel;
uniform float uLen;
varying vec2 vUv;
void main(){
  float y = vUv.y * uLen;
  float a = vUv.x;
  float bundles = texture2D(uNoise, vec2(a * 6.0, y * 0.05)).r;
  float fibre = texture2D(uNoise, vec2(a * 40.0, y * 0.02)).g;
  float lanes = 64.0;
  float lane = floor(a * lanes);
  float h = fract(sin(lane * 91.7) * 43758.5);
  float ph = fract(y * 0.22 - uTime * (0.18 + 0.3 * h) * (0.4 + uTunnel) + h * 7.0);
  float pulse = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.22, ph));
  float laneMask = 1.0 - smoothstep(0.06, 0.2, abs(fract(a * lanes) - 0.5));
  vec3 base = mix(vec3(0.03, 0.07, 0.055), vec3(0.14, 0.24, 0.18), bundles) * (0.45 + 0.7 * fibre);
  vec3 col = base + vec3(1.0, 0.8, 0.5) * pulse * laneMask * (0.25 + 0.9 * uTunnel);
  col += vec3(1.0, 0.9, 0.72) * pow(smoothstep(0.55, 1.0, vUv.y), 2.0) * 1.3;
  col += vec3(0.9, 0.7, 0.42) * (1.0 - smoothstep(0.0, 0.05, vUv.y)) * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`;

export const glowFrag = /* glsl */ `
uniform float uAlpha;
varying vec2 vUv;
void main(){
  float r = length(vUv - 0.5) * 2.0;
  float g = exp(-r * r * 3.0);
  gl_FragColor = vec4(vec3(1.0, 0.9, 0.72) * g * uAlpha, 1.0);
}`;

/* ------------------------------------------------------------ bokeh particles */
export const pointsVert = /* glsl */ `
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform float uPR;
uniform float uFocus;
uniform float uScale;
varying float vA;
varying float vCoc;
void main(){
  vec3 p = position;
  p += 0.03 * vec3(sin(uTime * 0.21 + aSeed * 6.0), cos(uTime * 0.17 + aSeed * 9.0), sin(uTime * 0.13 + aSeed * 3.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = -mv.z;
  float coc = clamp(abs(dist - uFocus) / max(uFocus, 0.08), 0.0, 1.6);
  vCoc = coc;
  float size = aSize * uScale * (1.0 + coc * 5.0) / max(dist, 0.04);
  gl_PointSize = min(size, 70.0) * uPR;
  vA = (1.0 / (1.0 + coc * coc * 9.0)) * smoothstep(0.02, 0.18, dist);
  gl_Position = projectionMatrix * mv;
}`;

export const pointsFrag = /* glsl */ `
uniform vec3 uColor;
varying float vA;
varying float vCoc;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c) * 2.0;
  if (r > 1.0) discard;
  float core = 1.0 - r;
  float ring = smoothstep(0.72, 0.93, r) * (1.0 - smoothstep(0.93, 1.0, r));
  float k = clamp(vCoc, 0.0, 1.0);
  float a = mix(pow(core, 2.5), core * 0.25 + ring * 0.45, k);
  gl_FragColor = vec4(uColor * a * vA, 1.0);
}`;

/* ------------------------------------------------------------ fullscreen caustics */
export const quadVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export const causticFrag = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uAmt;
uniform vec2 uAspect;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * uAspect * 7.0;
  float cs = caus(p, uTime) + 0.6 * caus(p * 1.7 + 3.1, uTime * 0.8);
  float vig = 1.0 - smoothstep(0.2, 0.95, length(vUv - 0.5) * 1.4);
  vec3 col = vec3(0.95, 0.8, 0.55) * cs * uAmt * 0.32 * (0.3 + vig);
  gl_FragColor = vec4(col, 1.0);
}`;
