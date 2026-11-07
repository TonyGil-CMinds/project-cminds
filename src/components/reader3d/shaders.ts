/* Shaders del lector 3D: copiados sin cambios del reader original de Vital Oceans. */

export const PAGE_VS = /* glsl */ `
uniform float uAngle; uniform float uBend; uniform float uTwist; uniform float uZ; uniform float uDip; uniform vec2 uSize;
varying vec2 vUv; varying vec3 vPosW; varying vec3 vNrmW; varying vec3 vLocal; varying float vSig;
vec3 deformP(vec2 p){
  float sig = p.x / uSize.x;
  float yn = p.y / (uSize.y * 0.5);
  float k = uBend * (1.0 + uTwist * yn);
  float th = uAngle; float x; float z;
  if (abs(k) < 0.0005) { x = uSize.x * sig * cos(th); z = uSize.x * sig * sin(th); }
  else { x = uSize.x / k * (sin(th + k * sig) - sin(th)); z = uSize.x / k * (cos(th) - cos(th + k * sig)); }
  float g = 1.0 - clamp(sig / 0.3, 0.0, 1.0);
  z -= uDip * g * g * (1.0 - sin(th));
  return vec3(x, p.y, z + uZ);
}
void main(){
  vUv = uv; vSig = position.x / uSize.x;
  vec3 P = deformP(position.xy);
  vec3 Px = deformP(position.xy + vec2(0.003, 0.0));
  vec3 Py = deformP(position.xy + vec2(0.0, 0.003));
  vec3 N = normalize(cross(Px - P, Py - P));
  vLocal = P;
  vec4 wp = modelMatrix * vec4(P, 1.0);
  vPosW = wp.xyz; vNrmW = normalize(mat3(modelMatrix) * N);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

export const PAGE_FS = /* glsl */ `
uniform sampler2D uMapF; uniform sampler2D uMapB; uniform sampler2D uFxF; uniform sampler2D uFxB;
uniform float uTime; uniform float uAmbT; uniform vec3 uKeyDir; uniform vec3 uKeyCol; uniform vec3 uFillDir; uniform vec3 uFillCol;
uniform vec3 uAmbTop; uniform vec3 uAmbBot; uniform vec3 uPtrPos; uniform vec3 uPtrCol; uniform float uPtrI;
uniform float uEnvI; uniform float uExposure; uniform float uAspect;
uniform vec4 uRectF; uniform vec4 uRectB; uniform float uTypeF; uniform float uTypeB; uniform float uPageF; uniform float uPageB;
uniform vec3 uCurF; uniform vec3 uCurB; uniform vec4 uRip[8]; uniform float uSweepF; uniform float uSweepB;
uniform vec4 uShade; uniform float uRecv;
varying vec2 vUv; varying vec3 vPosW; varying vec3 vNrmW; varying vec3 vLocal; varying float vSig;
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float sbox(vec3 R, vec3 C, vec3 U, vec2 sz, float s){
  float f = dot(R, C); if (f <= 0.0) return 0.0;
  vec3 Uo = normalize(U - C * dot(U, C)); vec3 Ro = cross(C, Uo); vec3 P = R / f;
  float a = abs(dot(P, Ro)); float b = abs(dot(P, Uo));
  return (1.0 - smoothstep(sz.x - s, sz.x + s, a)) * (1.0 - smoothstep(sz.y - s, sz.y + s, b));
}
vec3 envLight(vec3 R, float rough){
  float s = mix(0.015, 0.42, rough);
  vec3 c = vec3(1.0, 0.96, 0.9) * 2.4 * sbox(R, normalize(vec3(-0.32, 0.5, 0.8)), vec3(0.0, 1.0, 0.0), vec2(0.5, 0.15), s);
  c += vec3(0.8, 0.9, 1.0) * 1.7 * sbox(R, normalize(vec3(0.55, 0.12, 0.83)), vec3(0.0, 1.0, 0.0), vec2(0.05, 0.62), s);
  c += vec3(1.0, 0.8, 0.62) * 0.7 * sbox(R, normalize(vec3(-0.75, -0.2, 0.63)), vec3(0.0, 1.0, 0.0), vec2(0.15, 0.35), s);
  c += mix(vec3(0.04, 0.045, 0.06), vec3(0.17, 0.18, 0.21), smoothstep(-0.5, 0.9, R.y));
  return c;
}
float dGGX(float NoH, float a){ float a2 = a * a; float d = NoH * NoH * (a2 - 1.0) + 1.0; return a2 / (3.14159 * d * d); }
float vSmith(float NoV, float NoL, float a){ float k = a * 0.5; return 0.25 / max((NoV * (1.0 - k) + k) * (NoL * (1.0 - k) + k), 1e-4); }
vec3 tone(vec3 c){ vec3 t = max(c - 0.82, 0.0); return min(c, vec3(0.82)) + t / (1.0 + t / 0.18); }
void main(){
  float fr = gl_FrontFacing ? 1.0 : 0.0;
  vec2 uv = mix(vec2(1.0 - vUv.x, vUv.y), vUv, fr);
  float page = mix(uPageB, uPageF, fr); vec4 rect = mix(uRectB, uRectF, fr); float type = mix(uTypeB, uTypeF, fr);
  vec3 cur = mix(uCurB, uCurF, fr); float sweep = mix(uSweepB, uSweepF, fr);
  vec2 asp = vec2(1.0, uAspect);
  float inR = step(rect.x, uv.x) * step(uv.x, rect.z) * step(rect.y, uv.y) * step(uv.y, rect.w);
  vec2 duv = vec2(0.0); float crest = 0.0;
  if (type > 0.5 && type < 1.5) {
    for (int i = 0; i < 8; i++) {
      vec4 r = uRip[i]; float age = uTime - r.z; float rel = r.w - page;
      if (rel > -0.01 && rel < 0.45 && age > 0.0 && age < 3.5) {
        float amp = clamp(rel / 0.4, 0.0, 1.0);
        vec2 d = (uv - r.xy) * asp; float dist = length(d) + 1e-4; float rad = age * 0.17;
        float band = exp(-pow((dist - rad) * 22.0, 2.0));
        float w = sin((dist - rad) * 140.0) * band * exp(-age * 1.15) * amp;
        duv += (d / dist) / asp * w * 0.0055; crest += max(w, 0.0) * band;
      }
    }
    float k = inR * smoothstep(0.0, 0.025, uv.y - rect.y) * smoothstep(0.0, 0.025, rect.w - uv.y) * smoothstep(0.0, 0.025, uv.x - rect.x) * smoothstep(0.0, 0.025, rect.z - uv.x);
    duv *= k; crest *= k;
  }
  vec2 suv = uv + duv;
  vec3 base = mix(texture2D(uMapB, suv).rgb, texture2D(uMapF, suv).rgb, fr);
  vec3 fx = mix(texture2D(uFxB, uv).rgb, texture2D(uFxF, uv).rgb, fr);
  float varnish = fx.r; float foil = fx.g; float glowM = fx.b;
  vec3 alb = pow(base, vec3(2.2));
  vec3 N = normalize(vNrmW) * (fr * 2.0 - 1.0);
  vec3 V = normalize(cameraPosition - vPosW);
  float NoV = max(dot(N, V), 1e-3);
  float rough = mix(0.6, 0.15, varnish); float a = rough * rough; float F0 = mix(0.03, 0.06, varnish);
  vec3 L = normalize(uKeyDir); float NoL = max(dot(N, L), 0.0); vec3 Hk = normalize(L + V);
  float Fk = F0 + (1.0 - F0) * pow(1.0 - max(dot(V, Hk), 0.0), 5.0);
  vec3 spec = uKeyCol * dGGX(max(dot(N, Hk), 0.0), a) * vSmith(NoV, NoL, a) * Fk * NoL;
  vec3 diff = uKeyCol * NoL + uFillCol * max(dot(N, normalize(uFillDir)), 0.0) + mix(uAmbBot, uAmbTop, N.y * 0.5 + 0.5);
  vec3 Lp = uPtrPos - vPosW; float dl = max(length(Lp), 1e-3); Lp /= dl;
  float att = uPtrI / (1.0 + dl * dl * 3.0); float NoLp = max(dot(N, Lp), 0.0); vec3 Hp = normalize(Lp + V);
  float Fp = F0 + (1.0 - F0) * pow(1.0 - max(dot(V, Hp), 0.0), 5.0);
  spec += uPtrCol * att * dGGX(max(dot(N, Hp), 0.0), a) * vSmith(NoV, NoLp, a) * Fp * NoLp;
  diff += uPtrCol * att * NoLp * 0.22;
  vec3 Rv = reflect(-V, N);
  float Fe = F0 + (1.0 - F0) * pow(1.0 - NoV, 5.0);
  vec3 env = envLight(Rv, rough) * Fe * uEnvI * mix(0.6, 2.4, varnish);
  float ao = mix(0.66, 1.0, smoothstep(0.0, 0.18, vSig));
  float sh = 1.0;
  if (uRecv > 0.5 && uShade.y > 0.001) {
    float x = vLocal.x; float ex = uShade.x; float sf = uShade.w; float s = 0.0;
    if (uShade.z > 0.0 && x > 0.0) { s = 1.0 - smoothstep(ex - 0.02, ex + sf, x); s *= mix(0.45, 1.0, smoothstep(ex - 0.55, ex, x)); }
    else if (uShade.z < 0.0 && x < 0.0) { s = smoothstep(ex - sf, ex + 0.02, x); s *= mix(0.45, 1.0, 1.0 - smoothstep(ex, ex + 0.55, x)); }
    sh = 1.0 - s * uShade.y;
  }
  vec3 col = (alb * diff + spec + env) * ao * sh;
  if (foil > 0.04) {
    float lum = dot(base, vec3(0.299, 0.587, 0.114));
    float holo = smoothstep(0.6, 0.9, foil);
    float hue = dot(Rv, vec3(1.4, 1.0, 0.6)) + uv.x * 1.3 - uv.y * 0.9 + uAmbT * 0.03;
    vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (hue + vec3(0.0, 0.33, 0.67)));
    float shine = dot(envLight(Rv, 0.3), vec3(0.333));
    vec3 tint = mix(alb * 1.25, mix(vec3(0.62), rainbow, 0.62), holo);
    float glint = pow(max(dot(N, Hp), 0.0), 70.0) * att * 3.0;
    vec3 metal = tint * (0.3 + 1.6 * shine + glint) + spec * 3.0;
    col = mix(col, metal * (0.45 + lum) * sh, smoothstep(0.04, 0.3, foil) * smoothstep(0.25, 0.6, lum));
  }
  col += vec3(0.9, 0.95, 1.0) * crest * 0.18;
  if (type > 1.5 && type < 2.5) {
    float dist = length((uv - cur.xy) * asp);
    float lit = (1.0 - smoothstep(0.05, 0.27, dist)) * cur.z;
    col *= mix(1.0, mix(0.12, 1.15, lit), inR);
    float pulse = 0.7 + 0.3 * sin(uAmbT * 1.6 + uv.y * 14.0 + uv.x * 5.0);
    col += glowM * inR * vec3(0.3, 0.95, 1.0) * (0.35 * pulse + 0.9 * lit);
    col += vec3(0.5, 0.9, 1.0) * exp(-pow((dist - 0.25) * 70.0, 2.0)) * cur.z * 0.08 * inR;
  }
  if (type > 2.5) {
    vec2 d = (uv - cur.xy) * asp;
    float near = exp(-dot(d, d) * 30.0) * cur.z;
    col += glowM * inR * vec3(0.35, 0.62, 1.0) * 1.3 * near;
    col += glowM * inR * vec3(0.9, 0.95, 1.0) * 0.25 * near * (0.6 + 0.4 * sin(uAmbT * 3.0));
  }
  if (sweep >= 0.0) {
    float q = uv.x * 0.7 + (1.0 - uv.y) * 0.5; float c = mix(-0.25, 1.45, sweep);
    float band = exp(-pow((q - c) * 9.0, 2.0)) + 0.35 * exp(-pow((q - c + 0.09) * 26.0, 2.0));
    col += band * vec3(1.0, 0.96, 0.88) * (0.1 + 0.5 * varnish + 0.6 * foil) * (1.0 - smoothstep(0.85, 1.0, sweep));
  }
  col = tone(col * uExposure);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

export const BG_VS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.999, 1.0); }`;

export const BG_FS = /* glsl */ `
uniform vec3 uTop; uniform vec3 uBot; uniform vec3 uSpot; uniform vec3 uBeam; uniform float uAspect; uniform float uTime; uniform float uGrain; uniform float uVig;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec3 c = mix(uBot, uTop, smoothstep(0.0, 1.0, vUv.y));
  vec2 p = (vUv - vec2(0.5, 0.55)) * vec2(uAspect, 1.0); c += uSpot * exp(-dot(p, p) * 2.6);
  vec2 q = (vUv - vec2(0.12, 1.08)) * vec2(uAspect, 1.0); float ang = atan(q.x, -q.y);
  float beam = exp(-pow((ang - 0.5) * 5.0, 2.0)) * (1.0 - smoothstep(0.2, 1.6, length(q))) * (0.75 + 0.25 * sin(uTime * 0.25 + ang * 8.0));
  c += uBeam * beam;
  vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0); c *= 1.0 - uVig * smoothstep(0.35, 1.25, length(v));
  c += (hash(vUv * 1000.0 + fract(uTime) * 7.0) - 0.5) * uGrain;
  gl_FragColor = vec4(c, 1.0);
}`;

export const DUST_VS = /* glsl */ `
attribute vec3 aRand; uniform float uTime; uniform float uPx; uniform vec3 uPtr; uniform float uSize; varying float vA;
void main(){
  vec3 p = position; float t = uTime * (0.04 + aRand.x * 0.05);
  p.x += sin(t * 2.0 + aRand.y * 6.28) * 0.18;
  p.y = 1.6 - mod(1.6 - position.y + t * 0.6, 3.2);
  p.z += cos(t * 1.7 + aRand.z * 6.28) * 0.12;
  vec3 dp = p - uPtr; p += normalize(dp + 1e-4) * 0.22 * exp(-dot(dp, dp) * 8.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPx * (0.5 + aRand.y) / -mv.z;
  vA = (0.25 + 0.75 * aRand.z) * (1.0 - smoothstep(1.2, 1.6, abs(p.y)));
}`;

export const DUST_FS = /* glsl */ `uniform vec3 uCol; uniform float uOpacity; varying float vA;
void main(){ float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.0, 0.5, d); gl_FragColor = vec4(uCol, a * a * vA * uOpacity); }`;
