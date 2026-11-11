/* ================= Lector 3D · motor =================
   Port a TypeScript del reader de Vital Oceans. La lógica (hojas, cámara, gestos, efectos, LOD y
   accesibilidad) es la misma; cambia la estructura:
   - lee sus elementos dentro de `root` (atributos data-r) en lugar de ids globales;
   - todos los listeners, temporizadores, audio y WebGL se liberan en destroy();
   - arranca con las páginas pequeñas (`low`) y carga las grandes (`src`) solo cerca de la doble página abierta;
   - los colores se pasan al shader sin conversión (three ≥ r152 gestiona el color; el reader usaba r128). */
import * as THREE from "three";
import { createReaderAudio } from "./audio";
import { BG_FS, BG_VS, DUST_FS, DUST_VS, PAGE_FS, PAGE_VS } from "./shaders";
import type { ReaderStrings } from "./strings";
import type { ReaderHotspot, ReaderManifest, ReaderMood } from "./types";

export type ReaderEngine = { destroy(): void };
export type ReaderEngineOptions = { root: HTMLElement; manifest: ReaderManifest; strings: ReaderStrings };

type U<T> = { value: T };
type SharedUniforms = {
  uTime: U<number>;
  uAmbT: U<number>;
  uKeyDir: U<THREE.Vector3>;
  uKeyCol: U<THREE.Color>;
  uFillDir: U<THREE.Vector3>;
  uFillCol: U<THREE.Color>;
  uAmbTop: U<THREE.Color>;
  uAmbBot: U<THREE.Color>;
  uPtrPos: U<THREE.Vector3>;
  uPtrCol: U<THREE.Color>;
  uPtrI: U<number>;
  uEnvI: U<number>;
  uExposure: U<number>;
  uAspect: U<number>;
  uRip: U<THREE.Vector4[]>;
  uShade: U<THREE.Vector4>;
  uSize: U<THREE.Vector2>;
  uDip: U<number>;
};
type LeafUniforms = SharedUniforms & {
  uAngle: U<number>;
  uBend: U<number>;
  uTwist: U<number>;
  uZ: U<number>;
  uMapF: U<THREE.Texture>;
  uMapB: U<THREE.Texture>;
  uFxF: U<THREE.Texture>;
  uFxB: U<THREE.Texture>;
  uRectF: U<THREE.Vector4>;
  uRectB: U<THREE.Vector4>;
  uTypeF: U<number>;
  uTypeB: U<number>;
  uPageF: U<number>;
  uPageB: U<number>;
  uCurF: U<THREE.Vector3>;
  uCurB: U<THREE.Vector3>;
  uSweepF: U<number>;
  uSweepB: U<number>;
  uRecv: U<number>;
};
type LeafMode = "rest" | "tween" | "drag" | "spring";
type Leaf = {
  i: number;
  mesh: THREE.Mesh;
  u: LeafUniforms;
  angle: number;
  vel: number;
  mode: LeafMode;
  bend: number;
  twist: number;
  peek: number;
  peekT: number;
  from: number;
  to: number;
  t: number;
  dur: number;
  dragA: number;
  stiff: number;
  target: number;
  grabYn: number;
  dragDir: number;
  quiet: boolean;
  twistB: number;
};
type CamKey = "bx" | "px" | "py" | "zoom" | "yaw" | "tilt" | "ox" | "oy";
type CamState = Record<CamKey, number>;
type Pt = { x: number; y: number };
type Hit = { wx: number; wy: number; x: number; y: number; page: number | null; u: number; v: number };
type PressKind = null | "flip" | "pan" | "none" | "swipe";
type Press = { id: number; x0: number; y0: number; hit: Hit | null; kind: PressKind; type: string; st?: CamState; p0?: Pt | null };
type Drag = { L: Leaf; gEff: number; xPress: number; x0v: number; bookX: number };
type Pinch = { d0: number; z0: number; p0: Pt | null };
type Flight = { a: CamState; b: CamState; t: number; dur: number; bump: number };
type HsEl = { el: HTMLButtonElement; p: number; k: number; h: ReaderHotspot };
type Detail = { list: HsEl[]; idx: number; from: HTMLButtonElement };
type Hover = { page: number; u: number; v: number; t: number; type: string };
type Side = "L" | "R";

const PI = Math.PI;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (x: number) => {
  x = clamp(x, 0, 1);
  return x * x * (3 - 2 * x);
};
const esc = (t: string) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
const TINT: Record<ReaderMood, [number, number, number]> = { deep: [0.6, 0.85, 1], surface: [0.85, 0.95, 1], calm: [0.78, 0.84, 1] };
/** Enlaces (internos o externos): se dibujan como rectángulo sobre el texto, no como punto. */
const isRect = (h: ReaderHotspot) => h.kind === "link" || h.kind === "url";
/** Pasa un color CSS al shader tal cual (sin la conversión a lineal de three). */
const setRaw = (c: THREE.Color, v: string, fallback: string) => c.setStyle(v || fallback, THREE.LinearSRGBColorSpace);

export function createReaderEngine({ root, manifest: M, strings: s }: ReaderEngineOptions): ReaderEngine {
  const q = <T extends HTMLElement = HTMLElement>(k: string) => root.querySelector<T>(`[data-r="${k}"]`);
  // Cada instancia usa su propio canvas (copia del de React): al destruirse libera el contexto
  // WebGL, y un canvas con el contexto liberado no se puede volver a usar (React en desarrollo
  // monta, desmonta y vuelve a montar; también pasa al volver a la página).
  const placeholder = q<HTMLCanvasElement>("stage");
  const canvas = placeholder ? (placeholder.cloneNode(false) as HTMLCanvasElement) : null;
  const intro = q("intro"), progBar = q("progBar"), statusEl = q("status");
  const bOpen = q<HTMLButtonElement>("bOpen"), bOpenMute = q<HTMLButtonElement>("bOpenMute");
  const chip = q("chip"), counter = q("counter"), liveEl = q("live"), hint = q("hint"), thumbs = q("thumbs"), zoomLabel = q("zoomLabel");
  const bFirst = q("bFirst"), bPrev = q("bPrev"), bNext = q("bNext"), bLast = q("bLast");
  const bText = q("bText"), bSound = q("bSound"), bFull = q("bFull"), bHelp = q("bHelp");
  const card = q("card"), cardTitle = q("cardTitle"), cardText = q("cardText"), cardCount = q("cardCount"), cardNote = q("cardNote");
  const cardPrev = q("cardPrev"), cardNext = q("cardNext"), cardClose = q("cardClose");
  const textPanel = q("textPanel"), tpBody = q("tpBody"), tpTitle = q("tpTitle"), tpClose = q("tpClose"), tpSmaller = q("tpSmaller"), tpBigger = q("tpBigger");
  const help = q("help"), helpTitle = q("helpTitle"), helpClose = q("helpClose"), hsWrap = q("hotspots");
  const bZoomIn = q("bZoomIn"), bZoomOut = q("bZoomOut"), bZoomReset = q("bZoomReset");
  if (
    !canvas || !intro || !progBar || !statusEl || !bOpen || !bOpenMute || !chip || !counter || !liveEl || !hint || !thumbs || !zoomLabel ||
    !bFirst || !bPrev || !bNext || !bLast || !bText || !bSound || !bFull || !bHelp || !card || !cardTitle || !cardText || !cardCount ||
    !cardNote || !cardPrev || !cardNext || !cardClose || !textPanel || !tpBody || !tpTitle || !tpClose || !tpSmaller || !tpBigger ||
    !help || !helpTitle || !helpClose || !hsWrap || !bZoomIn || !bZoomOut || !bZoomReset
  ) {
    return { destroy() {} };
  }

  // ---------- ciclo de vida: todo lo que se registra se libera en destroy() ----------
  const ac = new AbortController();
  const signal = ac.signal;
  let alive = true;
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (alive) fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const cancel = (id: number | null) => {
    if (id == null) return;
    window.clearTimeout(id);
    timers.delete(id);
  };
  const extraNodes: HTMLElement[] = [];
  canvas.removeAttribute("data-r");
  placeholder?.after(canvas);
  if (placeholder) placeholder.hidden = true;
  extraNodes.push(canvas);

  const PAGES = M.pages;
  const W = 1, H = M.aspect, NP = PAGES.length, N = NP / 2, RW = M.ref[0], RH = M.ref[1];
  // Separación entre hojas apiladas. El grosor total de la pila se limita: si no, en las primeras
  // dobles páginas la pila derecha queda más alta que la izquierda y, con la cámara inclinada, se
  // nota un escalón entre los bordes superiores. 0.006 sigue evitando que las hojas se encimen.
  const GAP = Math.min(0.0024, 0.006 / Math.max(1, N));
  const NUM: (number | null)[] = [];
  {
    let n = 0;
    for (const P of PAGES) NUM.push(P.blank ? null : ++n);
  }
  const TOTAL = NUM.filter((n) => n != null).length;
  const MOODS = M.moods ?? [];
  const moodOf = (k: number): ReaderMood => MOODS[k] ?? "calm";
  const mq = (qs: string) => window.matchMedia(qs);
  const mqReduce = mq("(prefers-reduced-motion: reduce)");
  let reduce = mqReduce.matches;
  mqReduce.addEventListener("change", (e) => (reduce = e.matches), { signal });
  const isTouch = mq("(pointer: coarse)").matches;

  /* ---------------- escena ---------------- */
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    renderer = null;
  }
  const S: SharedUniforms = {
    uTime: { value: 0 },
    uAmbT: { value: 0 },
    uKeyDir: { value: new THREE.Vector3(-0.35, 0.55, 0.78) },
    uKeyCol: { value: new THREE.Color(0.86, 0.84, 0.8) },
    uFillDir: { value: new THREE.Vector3(0.6, -0.15, 0.8) },
    uFillCol: { value: new THREE.Color(0.16, 0.18, 0.24) },
    uAmbTop: { value: new THREE.Color(0.26, 0.27, 0.3) },
    uAmbBot: { value: new THREE.Color(0.14, 0.13, 0.13) },
    uPtrPos: { value: new THREE.Vector3(-0.6, 0.7, 0.6) },
    uPtrCol: { value: new THREE.Color(1.0, 0.95, 0.86) },
    uPtrI: { value: 0.0 },
    uEnvI: { value: 1.0 },
    uExposure: { value: 1.0 },
    uAspect: { value: H / W },
    uRip: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -99, -9)) },
    uShade: { value: new THREE.Vector4(0, 0, 1, 0.2) },
    uSize: { value: new THREE.Vector2(W, H) },
    uDip: { value: 0.026 },
  };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 60);
  const bgU = {
    uTop: { value: new THREE.Color() },
    uBot: { value: new THREE.Color() },
    uSpot: { value: new THREE.Color() },
    uBeam: { value: new THREE.Color() },
    uAspect: { value: 1 },
    uTime: S.uAmbT,
    uGrain: { value: 0.02 },
    uVig: { value: 0.55 },
  };
  const bg = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({ uniforms: bgU, vertexShader: BG_VS, fragmentShader: BG_FS, depthTest: false, depthWrite: false }),
  );
  bg.frustumCulled = false;
  bg.renderOrder = -10;
  scene.add(bg);
  const book = new THREE.Group();
  scene.add(book);

  const disposables: { dispose(): void }[] = [];
  function px(r: number, g: number, b: number, a = 255) {
    const t = new THREE.DataTexture(new Uint8Array([r, g, b, a, r, g, b, a, r, g, b, a, r, g, b, a]), 2, 2, THREE.RGBAFormat);
    t.needsUpdate = true;
    disposables.push(t);
    return t;
  }
  const blankMap = px(242, 242, 239), blankFx = px(0, 0, 0);
  const shadowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const img = g.createImageData(128, 128);
      const f = (t: number) => {
        const e = 0.14, sm = (x: number) => {
          x = clamp(x, 0, 1);
          return x * x * (3 - 2 * x);
        };
        return sm(t / e) * sm((1 - t) / e);
      };
      for (let y = 0; y < 128; y++)
        for (let x = 0; x < 128; x++) {
          const i = (y * 128 + x) * 4;
          img.data[i + 3] = Math.round(255 * f(x / 127) * f(y / 127));
        }
      g.putImageData(img, 0, 0);
    }
    const t = new THREE.CanvasTexture(c);
    disposables.push(t);
    return t;
  })();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: shadowTex, color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }),
  );
  shadow.renderOrder = -5;
  book.add(shadow);

  const leafGeo = new THREE.PlaneGeometry(W, H, 64, 30);
  leafGeo.translate(W / 2, 0, 0);
  const leaves: Leaf[] = [];
  for (let i = 0; i < N; i++) {
    const pf = 2 * i, pb = 2 * i + 1, fxf = PAGES[pf].fx, fxb = PAGES[pb].fx;
    const rect = (fx: typeof fxf) => {
      if (!fx) return new THREE.Vector4(2, 2, -1, -1);
      const [x0, y0, x1, y1] = fx.rect;
      return new THREE.Vector4(x0 / RW, 1 - y1 / RH, x1 / RW, 1 - y0 / RH);
    };
    const u: LeafUniforms = Object.assign({}, S, {
      uAngle: { value: 0 },
      uBend: { value: 0 },
      uTwist: { value: 0 },
      uZ: { value: 0 },
      uMapF: { value: blankMap as THREE.Texture },
      uMapB: { value: blankMap as THREE.Texture },
      uFxF: { value: blankFx as THREE.Texture },
      uFxB: { value: blankFx as THREE.Texture },
      uRectF: { value: rect(fxf) },
      uRectB: { value: rect(fxb) },
      uTypeF: { value: fxf ? fxf.type : 0 },
      uTypeB: { value: fxb ? fxb.type : 0 },
      uPageF: { value: pf },
      uPageB: { value: pb },
      uCurF: { value: new THREE.Vector3(0.5, 0.5, 0) },
      uCurB: { value: new THREE.Vector3(0.5, 0.5, 0) },
      uSweepF: { value: -1 },
      uSweepB: { value: -1 },
      uRecv: { value: 1 },
    });
    const mesh = new THREE.Mesh(leafGeo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: PAGE_VS, fragmentShader: PAGE_FS, side: THREE.DoubleSide }));
    mesh.frustumCulled = false;
    book.add(mesh);
    leaves.push({
      i, mesh, u, angle: 0, vel: 0, mode: "rest", bend: 0, twist: 0, peek: 0, peekT: 0, from: 0, to: 0, t: 0, dur: 1, dragA: 0,
      stiff: i === 0 || i === N - 1 ? 0.6 : 1, target: 0, grabYn: -0.6, dragDir: 1, quiet: false, twistB: -0.3,
    });
  }
  const DUSTN = isTouch ? 160 : 360;
  const dg = new THREE.BufferGeometry(), dpos = new Float32Array(DUSTN * 3), drnd = new Float32Array(DUSTN * 3);
  for (let i = 0; i < DUSTN; i++) {
    dpos[i * 3] = (Math.random() - 0.5) * 4.6;
    dpos[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
    dpos[i * 3 + 2] = -0.9 + Math.random() * 2.2;
    drnd[i * 3] = Math.random();
    drnd[i * 3 + 1] = Math.random();
    drnd[i * 3 + 2] = Math.random();
  }
  dg.setAttribute("position", new THREE.Float32BufferAttribute(dpos, 3));
  dg.setAttribute("aRand", new THREE.Float32BufferAttribute(drnd, 3));
  const dustU = {
    uTime: S.uAmbT,
    uPx: { value: 1 },
    uPtr: { value: new THREE.Vector3(9, 9, 9) },
    uSize: { value: 26 },
    uCol: { value: new THREE.Color(1, 1, 1) },
    uOpacity: { value: 0.6 },
  };
  const dust = new THREE.Points(
    dg,
    new THREE.ShaderMaterial({ uniforms: dustU, vertexShader: DUST_VS, fragmentShader: DUST_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  dust.frustumCulled = false;
  scene.add(dust);

  let dark = true;
  function readTheme() {
    const cs = getComputedStyle(root), v = (n: string) => cs.getPropertyValue(n).trim();
    dark = v("--scene-mode") !== "light";
    setRaw(bgU.uTop.value, v("--scene-top"), "#0e1430");
    setRaw(bgU.uBot.value, v("--scene-bottom"), "#020309");
    setRaw(bgU.uSpot.value, v("--scene-spot"), "#16204a");
    setRaw(bgU.uBeam.value, v("--scene-beam"), "#22305a");
    if (!dark) {
      bgU.uSpot.value.multiplyScalar(0.0);
      bgU.uBeam.value.setRGB(0.05, 0.05, 0.04);
    }
    bgU.uVig.value = dark ? 0.6 : 0.28;
    bgU.uGrain.value = dark ? 0.022 : 0.015;
    setRaw(dustU.uCol.value, v("--dust"), "#b9cfff");
    dustU.uOpacity.value = dark ? 0.55 : 0.22;
    dust.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    dust.material.needsUpdate = true;
    shadow.material.opacity = dark ? 0.75 : 0.32;
    S.uAmbTop.value.setRGB(dark ? 0.26 : 0.32, dark ? 0.27 : 0.33, dark ? 0.31 : 0.34);
    S.uEnvI.value = dark ? 0.82 : 0.72;
  }
  readTheme();

  /* ================= estado y cámara ================= */
  const Z_TOP = 0.012, ZMAX = 4.2, ZDET = 5.2, TILT = 0.28;
  const zR = (i: number) => (N - i) * GAP + 0.0015, zL = (i: number) => (i + 1) * GAP + 0.0015;
  let single = false, side: Side = "R", opened = false, ready = false, time = 0, ambT = 0, pendingSettle = false;
  let detail: Detail | null = null, drag: Drag | null = null, press: Press | null = null, pinch: Pinch | null = null, flight: Flight | null = null, hover: Hover | null = null;
  let lastTap = { t: 0, x: 0, y: 0 };
  const sweeps: { p: number; t: number; dur: number }[] = [];
  const pointers = new Map<number, Pt>();
  const ptr: { world: Pt | null; t: number; nx: number; ny: number; type: string } = { world: null, t: 0, nx: 0, ny: 0, type: "mouse" };
  const TINTS = Array.from({ length: N + 1 }, (_, k) => TINT[moodOf(k)]);
  const dustTint = new THREE.Color(0.6, 0.85, 1);
  book.position.x = -W / 2;

  const spreadNow = () => leaves.reduce((n, L) => n + (L.target === PI ? 1 : 0), 0);
  const pagesOf = (sp: number) => {
    const a: number[] = [];
    if (sp > 0) a.push(2 * sp - 1);
    if (sp < N) a.push(2 * sp);
    return a;
  };
  function fixSide() {
    const sp = spreadNow();
    if (sp === 0) side = "R";
    else if (sp === N) side = "L";
  }
  function viewPages() {
    const sp = spreadNow();
    if (!single) return pagesOf(sp);
    fixSide();
    return [side === "L" ? 2 * sp - 1 : 2 * sp];
  }
  const allRest = () => leaves.every((L) => L.mode === "rest");
  const spreadLabel = (sp: number) => [...new Set(pagesOf(sp).map((p) => PAGES[p].label).filter((l): l is string => !!l))].join(s.and);

  /* ---------- cámara: {bx base, px/py desplazamiento, zoom, yaw, tilt, ox/oy en px} ---------- */
  const KEYS: CamKey[] = ["bx", "px", "py", "zoom", "yaw", "tilt", "ox", "oy"];
  const cam: CamState = { bx: 0, px: 0, py: 0, zoom: 0.5, yaw: 0.4, tilt: 0.62, ox: 0, oy: 0 };
  const camT: CamState = { ...cam };
  const tmpCam = new THREE.PerspectiveCamera(26, 1, 0.05, 60);
  let parX = 0, parY = 0, uiTop = 70, uiBot = 90, lastZl = -1;
  const baseX = () => (single ? (side === "L" ? -W / 2 : W / 2) : 0);
  function measureUI() {
    const tb = root.querySelector(".r3d-topbar"), db = root.querySelector(".r3d-dock");
    uiTop = tb ? tb.getBoundingClientRect().bottom + 4 : 70;
    uiBot = db ? innerHeight - db.getBoundingClientRect().top + 8 : 90;
  }
  const uiOffset = () => (uiBot - uiTop) / 2;
  const fitState = (): CamState => ({ bx: baseX(), px: 0, py: 0, zoom: 1, yaw: 0, tilt: TILT, ox: 0, oy: uiOffset() });
  function fitD() {
    const vw = innerWidth, vh = innerHeight, t = Math.tan((camera.fov * PI) / 360), bw = single ? W : 2 * W;
    const availH = Math.max(160, vh - uiTop - uiBot), availW = Math.max(160, vw - (single ? 28 : 56));
    return Math.max(((H * 1.05) / 2 / t) * (vh / availH), ((bw * 1.03) / 2 / (t * camera.aspect)) * (vw / availW));
  }
  function place(c: THREE.PerspectiveCamera, st: CamState, par: boolean) {
    const t = Math.tan((camera.fov * PI) / 360), D = fitD() / st.zoom, wpp = (2 * D * t) / Math.max(1, innerHeight);
    const zf = clamp((st.zoom - 1) / 1.6, 0, 1);
    const tilt = st.tilt * (1 - 0.72 * zf) + (par ? parY : 0), yaw = st.yaw + (par ? parX : 0), ct = Math.cos(tilt);
    const cx = st.bx + st.px + st.ox * wpp, cy = st.py - st.oy * wpp;
    c.position.set(cx + Math.sin(yaw) * ct * D, cy - Math.sin(tilt) * D, Z_TOP + Math.cos(yaw) * ct * D);
    c.lookAt(cx, cy, Z_TOP);
  }
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -Z_TOP), hitV = new THREE.Vector3();
  function planePoint(x: number, y: number, c: THREE.Camera): Pt | null {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, c);
    const r = ray.ray.intersectPlane(plane, hitV);
    return r ? { x: r.x, y: r.y } : null;
  }
  function planePointFor(st: CamState, x: number, y: number) {
    tmpCam.fov = camera.fov;
    tmpCam.aspect = camera.aspect;
    tmpCam.updateProjectionMatrix();
    place(tmpCam, st, false);
    tmpCam.updateMatrixWorld(true);
    return planePoint(x, y, tmpCam);
  }
  function hitBook(x: number, y: number): Hit | null {
    const P = planePoint(x, y, camera);
    if (!P) return null;
    const lx = P.x - book.position.x, ly = P.y - book.position.y, sp = spreadNow();
    let page: number | null = null, u = 0;
    if (Math.abs(ly) <= H / 2) {
      if (lx >= 0 && lx <= W && sp < N) {
        page = 2 * sp;
        u = lx / W;
      } else if (lx < 0 && lx >= -W && sp > 0) {
        page = 2 * sp - 1;
        u = 1 + lx / W;
      }
    }
    return { wx: P.x, wy: P.y, x: lx, y: ly, page, u, v: (ly + H / 2) / H };
  }
  function clampPan(st: CamState) {
    const k = Math.max(0, 1 - 1 / st.zoom), sp = spreadNow(), span = single || sp === 0 || sp === N ? W / 2 : W;
    const hx = (span + 0.03) * k, hy = (H / 2 + 0.04) * k;
    st.px = clamp(st.px, -hx, hx);
    st.py = clamp(st.py, -hy, hy);
  }
  function zoomAt(st: CamState, z: number, x: number, y: number) {
    z = clamp(z, 1, ZMAX);
    if (z <= 1.0001) {
      Object.assign(st, fitState());
      return st;
    }
    const P0 = planePointFor(st, x, y);
    st.zoom = z;
    const P1 = planePointFor(st, x, y);
    if (P0 && P1) {
      st.px += P0.x - P1.x;
      st.py += P0.y - P1.y;
    }
    clampPan(st);
    return st;
  }
  function cancelFlight() {
    if (flight) {
      flight = null;
      Object.assign(camT, cam);
    }
  }
  function flyTo(tgt: CamState, dur: number, bump: number) {
    Object.assign(camT, tgt);
    if (reduce || !(dur > 0.02)) {
      Object.assign(cam, camT);
      flight = null;
      return;
    }
    flight = { a: { ...cam }, b: { ...camT }, t: 0, dur, bump: bump || 0 };
  }
  function zoomStep(f: number) {
    cancelFlight();
    const st = { ...camT };
    zoomAt(st, st.zoom * f, innerWidth / 2, (uiTop + innerHeight - uiBot) / 2);
    flyTo(st, 0.45, 0);
    AUD.whoosh(f > 1, 0.55);
  }
  function toggleZoomAt(x: number, y: number) {
    cancelFlight();
    if (camT.zoom > 1.25) {
      flyTo(fitState(), 0.7, 0);
      AUD.whoosh(false, 0.75);
      return;
    }
    flyTo(zoomAt({ ...camT }, 2.6, x, y), 0.75, 0);
    AUD.whoosh(true, 0.75);
  }
  function updateCam(dt: number) {
    if (!opened && !flight) camT.yaw = reduce ? 0.3 : 0.42 * Math.sin(time * 0.17);
    if (!detail && !flight) camT.bx = baseX();
    if (flight) {
      flight.t += dt;
      const k = clamp(flight.t / flight.dur, 0, 1), e = easeIO(k);
      for (const key of KEYS) cam[key] = lerp(flight.a[key], flight.b[key], e);
      cam.zoom = Math.exp(lerp(Math.log(flight.a.zoom), Math.log(flight.b.zoom), e) - flight.bump * Math.sin(PI * e));
      if (k >= 1) flight = null;
    } else {
      for (const key of KEYS) if (key !== "zoom") cam[key] = damp(cam[key], camT[key], 9, dt);
      cam.zoom = Math.exp(damp(Math.log(cam.zoom), Math.log(camT.zoom), 11, dt));
    }
    const parOK = opened && !reduce && !isTouch && !drag && !pinch && !press && !detail;
    parX = damp(parX, parOK ? ptr.nx * 0.045 : 0, 2.2, dt);
    parY = damp(parY, parOK ? ptr.ny * 0.03 : 0, 2.2, dt);
    place(camera, cam, true);
    const zl = Math.round(cam.zoom * 100);
    if (opened && zl !== lastZl && zoomLabel) {
      lastZl = zl;
      zoomLabel.textContent = `${zl}%`;
    }
  }

  /* ================= hojas y navegación ================= */
  function startTween(L: Leaf, to: number, delay: number, dur: number, quiet: boolean) {
    L.angle += L.peek;
    L.peek = 0;
    L.peekT = 0;
    L.mode = "tween";
    L.from = L.angle;
    L.to = to;
    L.target = to;
    L.t = -delay;
    L.quiet = !!quiet;
    L.dur = dur * Math.max(0.4, Math.abs(to - L.from) / PI);
    L.twistB = -0.16 - Math.random() * 0.22;
  }
  function finish(L: Leaf) {
    L.mode = "rest";
    L.angle = L.target;
    L.vel = 0;
    if (!L.quiet) AUD.land(0.85 + Math.random() * 0.25);
    L.quiet = false;
  }
  function updateLeaves(dt: number) {
    let active: Leaf | null = null, act = 0.004;
    for (const L of leaves) {
      const prevA = L.angle;
      if (L.mode === "tween") {
        L.t += dt;
        const k = L.t / L.dur;
        if (k > 0) L.angle = lerp(L.from, L.to, easeIO(Math.min(1, k)));
        L.vel = (L.angle - prevA) / dt;
        if (k >= 1) finish(L);
      } else if (L.mode === "drag") {
        L.angle = damp(L.angle, L.dragA, 20, dt);
        L.vel = lerp(L.vel, (L.angle - prevA) / dt, 0.5);
      } else if (L.mode === "spring") {
        const K = 64, C = 2 * Math.sqrt(K) * 0.8, n = 4, h = dt / n;
        let a = L.angle, v = L.vel;
        for (let j = 0; j < n; j++) {
          v += (K * (L.target - a) - C * v) * h;
          a += v * h;
          if (a < 0) {
            a = 0;
            v = -v * 0.12;
          } else if (a > PI) {
            a = PI;
            v = -v * 0.12;
          }
        }
        L.angle = a;
        L.vel = v;
        if (Math.abs(L.target - a) < 0.002 && Math.abs(v) < 0.05) finish(L);
      } else L.vel = 0;
      const sA = Math.sin(L.angle);
      let bT = 0, tT = 0;
      if (L.mode === "drag") {
        bT = L.dragDir * 0.48 * sA + clamp(L.vel * 0.05, -0.4, 0.4) * sA;
        tT = L.grabYn * 0.6 * sA;
      } else if (L.mode !== "rest") {
        bT = clamp(L.vel * 0.13, -1, 1) * (0.35 + 0.65 * sA);
        tT = L.twistB * sA;
      } else {
        L.peek = damp(L.peek, L.peekT, 12, dt);
        bT = L.peek * 2.6;
        tT = L.grabYn * 0.8 * Math.min(1, Math.abs(L.peek) * 8);
      }
      L.bend = damp(L.bend, bT * L.stiff, 11, dt);
      L.twist = damp(L.twist, tT, 9, dt);
      const a = L.angle + L.peek, lift = Math.sin(clamp(a, 0, PI));
      if (lift > act) {
        act = lift;
        active = L;
      }
      const u = L.u;
      u.uAngle.value = a;
      u.uBend.value = L.bend;
      u.uTwist.value = L.twist;
      u.uZ.value = lerp(zR(L.i), zL(L.i), clamp(L.angle / PI, 0, 1));
    }
    const A = active as Leaf | null;
    if (A) {
      const a = A.angle + A.peek, k = A.bend;
      const ex = Math.abs(k) < 1e-3 ? W * Math.cos(a) : (W / k) * (Math.sin(a + k) - Math.sin(a));
      S.uShade.value.set(ex, 0.5 * act, ex >= 0 ? 1 : -1, 0.08 + 0.32 * act);
    } else S.uShade.value.y = 0;
    for (const L of leaves) L.u.uRecv.value = L === A ? 0 : 1;
    if (pendingSettle && allRest()) {
      pendingSettle = false;
      onSettle();
    }
  }
  function updateBook(dt: number) {
    const f0 = clamp(leaves[0].angle / PI, 0, 1), fN = clamp(leaves[N - 1].angle / PI, 0, 1);
    if (!drag) book.position.x = damp(book.position.x, single ? 0 : (-W / 2) * (1 - f0) + (W / 2) * fN, 10, dt);
    const left = -W * f0, right = W * (1 - fN), w = Math.max(0.3, right - left);
    shadow.scale.set(w + 0.26, H + 0.26, 1);
    shadow.position.set((left + right) / 2 + 0.03, -0.04, -0.03);
  }
  function sweep(p: number, delay: number) {
    for (let i = sweeps.length - 1; i >= 0; i--) if (sweeps[i].p === p) sweeps.splice(i, 1);
    sweeps.push({ p, t: -(delay || 0), dur: 1.5 });
  }
  function updateSweeps(dt: number) {
    for (let i = sweeps.length - 1; i >= 0; i--) {
      const sw = sweeps[i], L = leaves[sw.p >> 1], u = sw.p % 2 ? L.u.uSweepB : L.u.uSweepF;
      sw.t += dt;
      if (sw.t >= sw.dur) {
        u.value = -1;
        sweeps.splice(i, 1);
      } else u.value = sw.t < 0 ? -1 : sw.t / sw.dur;
    }
  }
  function onSettle() {
    void updateLOD();
    if (!reduce && opened) pagesOf(spreadNow()).forEach((p, k) => sweep(p, k * 0.14));
  }

  /* ---------- navegación ---------- */
  function goSpread(t: number, sideAfter?: Side) {
    t = clamp(t, 0, N);
    const sp = spreadNow();
    if (drag || !opened) return;
    if (t === sp) {
      if (single && sideAfter && sideAfter !== side) setSide(sideAfter);
      return;
    }
    if (detail) closeDetail("nav");
    const dir = t > sp ? 1 : -1, list: number[] = [];
    if (dir > 0) for (let i = sp; i < t; i++) list.push(i);
    else for (let i = sp - 1; i >= t; i--) list.push(i);
    const many = list.length > 1, stg = reduce ? 0.03 : 0.085, dur = reduce ? 0.42 : many ? 0.7 : 1.05;
    list.forEach((i, k) => startTween(leaves[i], dir > 0 ? PI : 0, k * stg, dur, k < list.length - 1));
    if (many) AUD.riffle(list.length, dir, stg);
    else AUD.flip(dir, 1, dur * 0.75);
    if (single) side = sideAfter || (dir > 0 ? "L" : "R");
    fixSide();
    if (camT.zoom > 1.02 || camT.ox || flight) flyTo(fitState(), 0.8, 0);
    pendingSettle = true;
    onSpreadChange();
  }
  function setSide(sd: Side) {
    if (!single || sd === side) return;
    side = sd;
    fixSide();
    if (detail) closeDetail("nav");
    flyTo(fitState(), 0.75, 0);
    AUD.slide(sd === "R" ? 1 : -1);
    onSpreadChange();
  }
  const blankLeft = (sp: number) => sp > 0 && !!PAGES[2 * sp - 1].blank;
  function next() {
    if (!opened || drag) return;
    const sp = spreadNow();
    if (single && side === "L" && sp < N) return setSide("R");
    if (sp < N) goSpread(sp + 1, single && blankLeft(sp + 1) && sp + 1 < N ? "R" : "L");
  }
  function prev() {
    if (!opened || drag) return;
    const sp = spreadNow();
    if (single && side === "R" && sp > 0 && !blankLeft(sp)) return setSide("L");
    if (sp > 0) goSpread(sp - 1, "R");
  }
  function goPage(p: number) {
    p = clamp(p, 0, NP - 1);
    goSpread(p % 2 === 0 ? p / 2 : (p + 1) / 2, p % 2 === 0 ? "R" : "L");
  }

  /* ---------- arrastrar hojas ---------- */
  function startFlip(L: Leaf, dir: number, h: Hit) {
    if (detail) closeDetail("nav");
    L.angle += L.peek;
    L.peek = 0;
    L.peekT = 0;
    const gEff = clamp(Math.abs(h.x) / W, 0.5, 1);
    drag = { L, gEff, xPress: h.x, x0v: W * gEff * Math.cos(L.angle), bookX: book.position.x };
    L.mode = "drag";
    L.dragA = L.angle;
    L.dragDir = dir;
    L.grabYn = clamp(h.y / (H / 2), -1, 1);
    AUD.rustleStart();
    hideHint();
  }
  function moveFlip(x: number, y: number) {
    if (!drag) return;
    const P = planePoint(x, y, camera);
    if (!P) return;
    const virt = drag.x0v + (P.x - drag.bookX - drag.xPress);
    drag.L.dragA = Math.acos(clamp(virt / (W * drag.gEff), -1, 1));
    drag.L.grabYn = clamp(P.y / (H / 2), -1, 1);
    AUD.rustle(drag.L.vel);
  }
  function releaseFlip(cancelIt: boolean) {
    if (!drag) return;
    const L = drag.L;
    drag = null;
    AUD.rustleStop();
    const before = spreadNow(), v = L.vel;
    const toPI = cancelIt ? L.target === PI : Math.abs(v) > 2.2 ? v > 0 : L.angle > PI / 2;
    L.target = toPI ? PI : 0;
    L.mode = "spring";
    L.quiet = false;
    if (Math.abs(L.target - L.angle) > 0.5) AUD.flip(L.target > L.angle ? 1 : -1, 0.45, 0.45);
    const after = spreadNow();
    if (after !== before) {
      if (single) side = after > before && !(blankLeft(after) && after < N) ? "L" : "R";
      fixSide();
      pendingSettle = true;
      onSpreadChange();
    }
  }
  function hoverPeek(h: Hit | null) {
    const sp = spreadNow();
    let rT = 0, lT = 0, gy = 0;
    if (h && h.page != null && opened && camT.zoom < 1.04 && allRest() && !detail && !drag) {
      gy = clamp(h.y / (H / 2), -1, 1);
      if (h.x > 0 && h.u > 0.8 && sp < N) rT = 0.06 + 0.16 * smooth((h.u - 0.8) / 0.2);
      if (h.x < 0 && h.u < 0.2 && sp > 0) lT = -(0.06 + 0.16 * smooth((0.2 - h.u) / 0.2));
    }
    leaves.forEach((L, i) => {
      if (L.mode !== "rest") return;
      const t = i === sp ? rT : i === sp - 1 ? lT : 0;
      if (t !== 0 && L.peekT === 0) AUD.lift(0.6);
      L.peekT = t;
      if (t !== 0) L.grabYn = gy;
    });
  }
  function invitePeek() {
    const L = leaves[0];
    if (spreadNow() !== 0 || L.mode !== "rest" || L.peekT) return;
    L.grabYn = -0.75;
    L.peekT = 0.34;
    AUD.lift(0.8);
    later(() => {
      if (L.peekT === 0.34) L.peekT = 0;
    }, 650);
  }

  /* ================= punteros y efectos ================= */
  const rips = S.uRip.value;
  let ripN = 0, lastRip = { t: 0, u: 0, v: 0 };
  function ripple(p: number, u: number, v: number, amp: number) {
    rips[ripN++ % rips.length].set(u, v, time, p + 0.4 * clamp(amp, 0.05, 1));
  }
  function fxRect(p: number) {
    const L = leaves[p >> 1];
    return p % 2 ? L.u.uRectB.value : L.u.uRectF.value;
  }
  function inFx(p: number, u: number, v: number, type: number) {
    const P = PAGES[p];
    if (!P || !P.fx || P.fx.type !== type) return false;
    const r = fxRect(p);
    return u >= r.x && u <= r.z && v >= r.y && v <= r.w;
  }
  function setHover(h: Hit, type: string) {
    if (h.page == null) return;
    hover = { page: h.page, u: h.u, v: h.v, t: performance.now(), type };
  }
  const curS: Record<number, { u: number; v: number; i: number }> = {};
  function updateFx(dt: number) {
    const nowMs = performance.now();
    for (let p = 0; p < NP; p++) {
      const P = PAGES[p];
      if (!P.fx || P.fx.type !== 3) continue;
      const st = curS[p] || (curS[p] = { u: 0.5, v: 0.5, i: 0 });
      const h = hover && hover.page === p && nowMs - hover.t < (hover.type === "mouse" ? 2500 : 3500) ? hover : null;
      if (h) {
        st.u = damp(st.u, h.u, 12, dt);
        st.v = damp(st.v, h.v, 12, dt);
      }
      st.i = damp(st.i, h ? 1 : 0, h ? 6 : 2, dt);
      const L = leaves[p >> 1];
      (p % 2 ? L.u.uCurB : L.u.uCurF).value.set(st.u, st.v, st.i);
    }
  }
  const ptrTarget = new THREE.Vector3();
  function updateLight(dt: number) {
    const nowMs = performance.now(), on = !!ptr.world && ptr.type === "mouse" && nowMs - ptr.t < 2500;
    if (on && ptr.world) ptrTarget.set(ptr.world.x, ptr.world.y, Z_TOP + 0.5);
    else {
      const w = ambT * 0.11, cx = cam.bx + cam.px;
      ptrTarget.set(cx + Math.sin(w) * 0.95, 0.42 + Math.cos(w * 0.8) * 0.36, Z_TOP + 0.75);
    }
    S.uPtrPos.value.lerp(ptrTarget, 1 - Math.exp(-(on ? 8 : 2) * dt));
    S.uPtrI.value = damp(S.uPtrI.value, on ? 1.0 : 0.55, 3, dt);
    if (on && ptr.world) dustU.uPtr.value.set(ptr.world.x, ptr.world.y, 0.35);
    else dustU.uPtr.value.set(9, 9, 9);
  }

  /* ---------- punteros ---------- */
  function setCursor(h: Hit | null) {
    let c = "default";
    if (drag || pinch || (press && press.kind === "pan")) c = "grabbing";
    else if (opened && (camT.zoom > 1.04 || (h && h.page != null))) c = "grab";
    if (canvas && canvas.style.cursor !== c) canvas.style.cursor = c;
  }
  function onDown(e: PointerEvent) {
    if (!opened || (e.pointerType === "mouse" && e.button !== 0)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      canvas?.setPointerCapture(e.pointerId);
    } catch {
      // el puntero ya no existe
    }
    hideHint();
    if (pointers.size === 2) {
      startPinch();
      return;
    }
    if (pointers.size > 2 || pinch) return;
    const h = hitBook(e.clientX, e.clientY);
    press = { id: e.pointerId, x0: e.clientX, y0: e.clientY, hit: h, kind: null, type: e.pointerType };
    if (h && h.page != null) {
      ptr.type = e.pointerType;
      setHover(h, e.pointerType);
    }
  }
  function onMove(e: PointerEvent) {
    ptr.nx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ny = (e.clientY / innerHeight) * 2 - 1;
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!opened) return;
    if (pinch) {
      updatePinch();
      return;
    }
    const h = hitBook(e.clientX, e.clientY);
    if (h) {
      ptr.world = { x: h.wx, y: h.wy };
      ptr.t = performance.now();
      ptr.type = e.pointerType;
    }
    if (h && h.page != null) {
      setHover(h, e.pointerType);
      if (!drag && inFx(h.page, h.u, h.v, 1) && time - lastRip.t > 0.09 && Math.hypot(h.u - lastRip.u, (h.v - lastRip.v) * 1.3) > 0.03) {
        ripple(h.page, h.u, h.v, 0.38);
        lastRip = { t: time, u: h.u, v: h.v };
      }
    }
    if (press && press.id === e.pointerId) {
      const dx = e.clientX - press.x0, dy = e.clientY - press.y0;
      if (!press.kind && Math.hypot(dx, dy) > (press.type === "mouse" ? 4 : 9)) decide(press, dx, dy);
      if (press.kind === "flip") moveFlip(e.clientX, e.clientY);
      else if (press.kind === "pan") movePan(e.clientX, e.clientY);
      setCursor(h);
      return;
    }
    if (e.pointerType === "mouse") hoverPeek(h);
    setCursor(h);
  }
  function decide(pr: Press, dx: number, dy: number) {
    if (camT.zoom > 1.04 || (flight && flight.b.zoom > 1.04)) {
      cancelFlight();
      pr.kind = "pan";
      pr.st = { ...camT };
      pr.p0 = planePointFor(pr.st, pr.x0, pr.y0);
      return;
    }
    const h = pr.hit, sp = spreadNow();
    if (!h || h.page == null || Math.abs(dy) > Math.abs(dx) * 1.3) {
      pr.kind = "none";
      return;
    }
    if (h.x >= 0 && dx < 0 && sp < N) {
      startFlip(leaves[sp], 1, h);
      pr.kind = "flip";
    } else if (h.x < 0 && dx > 0 && sp > 0) {
      startFlip(leaves[sp - 1], -1, h);
      pr.kind = "flip";
    } else pr.kind = "swipe";
  }
  function movePan(x: number, y: number) {
    const pr = press;
    if (!pr || !pr.st) return;
    const P = planePointFor(pr.st, x, y);
    if (!P || !pr.p0) return;
    camT.px = pr.st.px + pr.p0.x - P.x;
    camT.py = pr.st.py + pr.p0.y - P.y;
    clampPan(camT);
  }
  function onUp(e: PointerEvent, cancelIt: boolean) {
    pointers.delete(e.pointerId);
    if (pinch) {
      if (pointers.size < 2) {
        pinch = null;
        press = null;
      }
      return;
    }
    if (!press || press.id !== e.pointerId) return;
    const pr = press;
    press = null;
    if (pr.kind === "flip") releaseFlip(cancelIt);
    else if (pr.kind === "swipe") {
      const dx = e.clientX - pr.x0;
      if (!cancelIt && Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    } else if (pr.kind === null && !cancelIt) tap(pr, e);
    setCursor(hitBook(e.clientX, e.clientY));
  }
  function tap(pr: Press, e: PointerEvent) {
    const h = pr.hit, now = performance.now();
    if (pr.type !== "mouse") {
      const dbl = now - lastTap.t < 330 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 40;
      lastTap = { t: dbl ? 0 : now, x: e.clientX, y: e.clientY };
      if (dbl) {
        toggleZoomAt(e.clientX, e.clientY);
        return;
      }
    }
    if (!h || h.page == null) return;
    if (inFx(h.page, h.u, h.v, 1)) {
      ripple(h.page, h.u, h.v, 1);
      AUD.plip(1, ((e.clientX / innerWidth) * 2 - 1) * 0.6);
    }
    if (camT.zoom < 1.04) {
      const edge = single ? 0.2 : 0.14;
      if (h.u > 1 - edge && (h.x >= 0 || single)) {
        next();
        return;
      }
      if (h.u < edge && (h.x < 0 || single)) prev();
    }
  }
  function onDbl(e: MouseEvent) {
    if (!opened) return;
    const h = hitBook(e.clientX, e.clientY);
    if (!h || h.page == null) return;
    const edge = single ? 0.2 : 0.14;
    if (camT.zoom < 1.04 && (h.u > 1 - edge || h.u < edge)) return;
    toggleZoomAt(e.clientX, e.clientY);
  }
  function startPinch() {
    if (drag) releaseFlip(true);
    press = null;
    cancelFlight();
    hoverPeek(null);
    const [a, b] = [...pointers.values()], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    pinch = { d0: Math.max(12, Math.hypot(a.x - b.x, a.y - b.y)), z0: camT.zoom, p0: planePointFor(camT, mx, my) };
  }
  function updatePinch() {
    const vals = [...pointers.values()];
    if (vals.length < 2 || !pinch) return;
    const [a, b] = vals;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(a.x - b.x, a.y - b.y);
    camT.zoom = clamp((pinch.z0 * d) / pinch.d0, 1, ZMAX);
    if (camT.zoom <= 1.0001) {
      Object.assign(camT, fitState());
      return;
    }
    const P = planePointFor(camT, mx, my);
    if (P && pinch.p0) {
      camT.px += pinch.p0.x - P.x;
      camT.py += pinch.p0.y - P.y;
    }
    clampPan(camT);
  }
  let wheelAcc = 0, wheelLock = 0, lastWhoosh = 0;
  function onWheel(e: WheelEvent) {
    if (!opened) return;
    e.preventDefault();
    hideHint();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1, dx = e.deltaX * unit, dy = e.deltaY * unit, now = performance.now();
    if (!e.ctrlKey && Math.abs(dx) > Math.abs(dy) * 1.3 && camT.zoom < 1.04) {
      if (now < wheelLock) return;
      wheelAcc += dx;
      if (Math.abs(wheelAcc) > 80) {
        (wheelAcc > 0 ? next : prev)();
        wheelAcc = 0;
        wheelLock = now + 700;
      }
      return;
    }
    wheelAcc = 0;
    cancelFlight();
    const z0 = camT.zoom;
    zoomAt(camT, z0 * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0017)), e.clientX, e.clientY);
    if (now - lastWhoosh > 650 && Math.abs(camT.zoom - z0) > 0.015) {
      AUD.whoosh(camT.zoom > z0, 0.45);
      lastWhoosh = now;
    }
  }

  /* ---------- detalles con zoom ---------- */
  function pageLocal(p: number, x: number, y: number) {
    const L = leaves[p >> 1], front = p % 2 === 0, u = x / RW;
    return { x: front ? u * W : -W * (1 - u), y: H / 2 - (y / RH) * H, z: (front ? zR(L.i) : zL(L.i)) + 0.004 };
  }
  function detailList() {
    const vis = viewPages();
    return hsEls.filter((o) => !isRect(o.h) && vis.includes(o.p));
  }
  function openDetail(o: HsEl) {
    if (textPanel && !textPanel.hidden) closeText(false);
    const list = detailList(), idx = list.indexOf(o);
    if (idx < 0) return;
    detail = { list, idx, from: o.el };
    showDetail(true);
  }
  function showDetail(first: boolean) {
    if (!detail || !card || !cardTitle || !cardText || !cardNote || !cardCount || !cardPrev || !cardNext) return;
    const o = detail.list[detail.idx], h = o.h, many = detail.list.length > 1;
    if (h.kind === "link" || h.kind === "url") return;
    cardTitle.textContent = h.title;
    cardText.textContent = h.text;
    cardNote.hidden = h.kind !== "photo" || !!h.caption;
    cardNote.textContent = h.ai ? s.photoNoteAi : s.photoNote;
    cardCount.textContent = s.detail(detail.idx + 1, detail.list.length);
    cardPrev.hidden = cardNext.hidden = !many;
    card.hidden = false;
    cardText.scrollTop = 0;
    const narrow = innerWidth <= 760, cr = card.getBoundingClientRect();
    const ax0 = 12, ax1 = narrow ? innerWidth - 12 : cr.left - 16, ay0 = uiTop + 4, ay1 = narrow ? cr.top - 10 : innerHeight - uiBot - 4;
    const aw = Math.max(60, ax1 - ax0), ah = Math.max(60, ay1 - ay0);
    const z = h.zone, a = pageLocal(o.p, z[0], z[1]), b = pageLocal(o.p, z[2], z[3]);
    const wpp1 = (2 * fitD() * Math.tan((camera.fov * PI) / 360)) / Math.max(1, innerHeight);
    const zoom = clamp(Math.min((aw * 0.94) / (Math.abs(b.x - a.x) / wpp1), (ah * 0.94) / (Math.abs(b.y - a.y) / wpp1)), 1.05, ZDET);
    const wx = (a.x + b.x) / 2 + book.position.x, wy = (a.y + b.y) / 2 + book.position.y;
    flyTo(
      { bx: camT.bx, px: wx - camT.bx, py: wy, zoom, yaw: 0, tilt: TILT * 0.4, ox: innerWidth / 2 - (ax0 + ax1) / 2, oy: innerHeight / 2 - (ay0 + ay1) / 2 },
      first ? 1.3 : 1.0,
      first ? 0.22 : 0.3,
    );
    hsEls.forEach((e) => e.el.classList.toggle("active", e === o));
    AUD.whoosh(true, 0.7);
    later(() => AUD.chime(true), reduce ? 0 : 900);
    if (first) cardTitle.focus({ preventScroll: true });
  }
  function stepDetail(d: number) {
    if (!detail) return;
    const n = detail.list.length;
    detail.idx = (detail.idx + d + n) % n;
    showDetail(false);
  }
  function closeDetail(mode: "nav" | "auto" | "user") {
    if (!detail) return;
    const from = detail.from;
    detail = null;
    if (card) card.hidden = true;
    hsEls.forEach((e) => e.el.classList.remove("active"));
    if (mode === "nav") return;
    flyTo(fitState(), 1.0, 0);
    if (mode === "user") {
      AUD.whoosh(false, 0.6);
      if (from && !from.hidden) from.focus({ preventScroll: true });
    }
  }

  /* ================= sonido ================= */
  const AUD = createReaderAudio(moodOf, signal);

  /* ================= interfaz, imágenes de página y arranque ================= */
  const HINT = isTouch ? s.hintTouch : s.hintMouse;
  let soundOn = false, hintT: number | null = null, lastFocus: Element | null = null, tpSize = 18, fbDirty = true;
  let fb: { c: HTMLCanvasElement; g: CanvasRenderingContext2D | null } | null = null;
  const thumbEls: HTMLButtonElement[] = [];
  const fbHi: Record<number, HTMLImageElement> = {};
  const ASPECT = H / W, LOW_W = 420;
  const low: (HTMLCanvasElement | undefined)[] = [], texLow: (THREE.Texture | undefined)[] = [], texMask: (THREE.Texture | undefined)[] = [];
  const hiRes = new Map<number, THREE.Texture>();
  let hiW = 1600, aniso = 1, lodRun = false, lodAgain = false;
  const mkCanvas = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const numsOf = (ps: number[]) => ps.map((p) => NUM[p]).filter((n): n is number => n != null);

  /* ---------- zonas interactivas: puntos de zoom y enlaces del índice ---------- */
  const hsEls: HsEl[] = [];
  PAGES.forEach((P, p) =>
    P.hs.forEach((h, k) => {
      // Los enlaces externos solo se aceptan con http(s).
      if (h.kind === "url" && !/^https?:\/\//i.test(h.href)) return;
      const b = document.createElement("button");
      b.type = "button";
      b.hidden = true;
      b.className = "hs" + (isRect(h) ? " link" : "");
      b.setAttribute(
        "aria-label",
        h.kind === "link" ? h.title : h.kind === "url" ? `${h.title}${s.newTab}` : h.kind === "photo" ? s.zoomPhoto : s.zoomInto(h.title),
      );
      const tip = document.createElement("span");
      tip.className = "tip";
      tip.setAttribute("aria-hidden", "true");
      tip.textContent = isRect(h) ? h.title : h.kind === "photo" ? s.zoomPhoto : s.zoomPassage;
      b.appendChild(tip);
      const o: HsEl = { el: b, p, k, h };
      b.addEventListener("click", () => {
        if (h.kind === "url") {
          AUD.tick();
          window.open(h.href, "_blank", "noopener,noreferrer");
          return;
        }
        if (h.kind !== "link") {
          openDetail(o);
          return;
        }
        AUD.tick();
        if (viewPages().includes(h.goto)) {
          sweep(h.goto, 0);
          AUD.chime(true);
          if (liveEl) liveEl.textContent = s.onFacing(PAGES[h.goto]?.label ?? "");
        } else goPage(h.goto);
      });
      b.addEventListener("pointerenter", () => AUD.blip());
      hsWrap.appendChild(b);
      hsEls.push(o);
    }),
  );
  const hv = new THREE.Vector3();
  function proj(p: number, x: number, y: number) {
    const l = pageLocal(p, x, y);
    hv.set(l.x + book.position.x, l.y + book.position.y, l.z).project(camera);
    return { x: (hv.x * 0.5 + 0.5) * innerWidth, y: (-hv.y * 0.5 + 0.5) * innerHeight, z: hv.z };
  }
  function updateHotspots() {
    if (!hsWrap) return;
    const show = opened && allRest() && !drag && !pinch;
    hsWrap.classList.toggle("off", !show);
    const vis = show ? viewPages() : [];
    for (const o of hsEls) {
      const on = vis.includes(o.p);
      if (o.el.hidden === on) o.el.hidden = !on;
      if (!on) continue;
      const st = o.el.style;
      if (o.h.kind === "link" || o.h.kind === "url") {
        const z = o.h.zone, a = proj(o.p, z[0], z[1]), b = proj(o.p, z[2], z[3]);
        const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y), w = Math.abs(b.x - a.x), hh = Math.abs(b.y - a.y);
        st.visibility = a.z > 1 || y0 < uiTop - 10 || y0 + hh > innerHeight - uiBot + 10 ? "hidden" : "";
        st.width = `${w.toFixed(1)}px`;
        st.height = `${hh.toFixed(1)}px`;
        st.transform = `translate3d(${x0.toFixed(1)}px,${y0.toFixed(1)}px,0)`;
      } else {
        const d = o.h.dot || [(o.h.zone[0] + o.h.zone[2]) / 2, (o.h.zone[1] + o.h.zone[3]) / 2], sp = proj(o.p, d[0], d[1]);
        st.visibility = sp.z > 1 || sp.x < 8 || sp.x > innerWidth - 8 || sp.y < uiTop - 10 || sp.y > innerHeight - uiBot + 10 ? "hidden" : "";
        st.transform = `translate3d(${sp.x.toFixed(1)}px,${sp.y.toFixed(1)}px,0)`;
      }
    }
  }

  /* ---------- estado visible ---------- */
  function viewLabel() {
    const ps = viewPages();
    return single ? PAGES[ps[0]]?.label || spreadLabel(spreadNow()) : spreadLabel(spreadNow());
  }
  function updateUI() {
    if (!counter || !chip || !bFirst || !bPrev || !bNext || !bLast || !thumbs) return;
    const sp = spreadNow(), ns = numsOf(viewPages());
    counter.innerHTML = ns.length ? `<strong>${ns.join("–")}</strong> / ${TOTAL}` : `<strong>${sp === N ? esc(s.end) : "–"}</strong>`;
    chip.innerHTML = `<strong>${esc(viewLabel())}</strong>`;
    const dis = (b: HTMLElement, v: boolean) => b.setAttribute("aria-disabled", v ? "true" : "false");
    dis(bFirst, sp === 0);
    dis(bPrev, sp === 0 && (!single || side === "R"));
    dis(bNext, sp === N);
    dis(bLast, sp === N);
    thumbEls.forEach((b, k) => b.setAttribute("aria-current", k === sp ? "true" : "false"));
    const tb = thumbEls[sp];
    if (tb && thumbs.scrollWidth > thumbs.clientWidth) {
      const l = tb.offsetLeft - thumbs.offsetLeft - (thumbs.clientWidth - tb.offsetWidth) / 2;
      thumbs.scrollTo({ left: clamp(l, 0, thumbs.scrollWidth - thumbs.clientWidth), behavior: reduce ? "auto" : "smooth" });
    }
    if (textPanel && !textPanel.hidden) renderText();
  }
  function announce() {
    if (!liveEl) return;
    const ns = numsOf(viewPages());
    liveEl.textContent = ns.length ? `${ns.length > 1 ? s.pages : s.page} ${ns.join(s.and)} ${s.of} ${TOTAL}. ${viewLabel()}.` : `${viewLabel()}.`;
  }
  function onSpreadChange() {
    const sp = spreadNow();
    updateUI();
    announce();
    AUD.scene(sp);
    const c = TINTS[sp] || TINTS[0];
    dustTint.setRGB(c[0], c[1], c[2]);
    fbDirty = true;
    if (fb) void fbLoad();
  }
  function showHint(text: string, ms?: number) {
    if (!hint) return;
    hint.textContent = text;
    hint.classList.add("show");
    cancel(hintT);
    hintT = later(hideHint, ms || 5000);
  }
  function hideHint() {
    hint?.classList.remove("show");
  }

  /* ---------- paneles ---------- */
  function renderText() {
    if (!tpBody) return;
    const ps = pagesOf(spreadNow()).filter((p) => !PAGES[p].blank);
    tpBody.innerHTML = ps.length
      ? ps
          .map((p) => {
            const P = PAGES[p];
            return (
              `<p class="pg">${esc(s.pageOf(NUM[p] ?? 0, TOTAL))}</p>${P.head ? `<h3>${esc(P.head)}</h3>` : ""}${P.paras.map((t) => `<p>${esc(t)}</p>`).join("")}` +
              (P.alt ? `<p class="alt"><span>${esc(s.altLabel)}</span> ${esc(P.alt)}</p>` : "")
            );
          })
          .join("")
      : `<p>${esc(s.noText)}</p>`;
    tpBody.scrollTop = 0;
  }
  function openText() {
    closeDetail("auto");
    renderText();
    if (textPanel) textPanel.hidden = false;
    bText?.setAttribute("aria-pressed", "true");
    tpTitle?.focus({ preventScroll: true });
  }
  function closeText(restore: boolean) {
    if (textPanel) textPanel.hidden = true;
    bText?.setAttribute("aria-pressed", "false");
    if (restore) bText?.focus({ preventScroll: true });
  }
  function openHelp() {
    lastFocus = document.activeElement;
    if (help) help.hidden = false;
    helpTitle?.focus({ preventScroll: true });
  }
  function closeHelp() {
    if (help) help.hidden = true;
    if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
  }
  function setTp(d: number) {
    tpSize = clamp(tpSize + d, 14, 26);
    root.style.setProperty("--tp-size", `${tpSize}px`);
  }
  function setSoundUI() {
    bSound?.setAttribute("aria-pressed", soundOn ? "true" : "false");
    const w = bSound?.querySelector<SVGElement>(".w");
    if (w) w.style.display = soundOn ? "" : "none";
  }
  function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) {
      AUD.init();
      AUD.scene(spreadNow());
      AUD.tick();
    } else AUD.setOn(false);
    setSoundUI();
  }
  type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void; webkitFullscreenEnabled?: boolean };
  type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
  const fsDoc = document as FsDoc;
  const fsEl = () => document.fullscreenElement || fsDoc.webkitFullscreenElement;
  function toggleFull() {
    const d = document.documentElement as FsEl, fail = () => showHint(s.noFullscreen, 3500);
    try {
      if (fsEl()) {
        if (document.exitFullscreen) void document.exitFullscreen();
        else fsDoc.webkitExitFullscreen?.();
      } else {
        const r = d.requestFullscreen ? d.requestFullscreen() : d.webkitRequestFullscreen?.();
        if (r && typeof r.catch === "function") r.catch(fail);
      }
    } catch {
      fail();
    }
  }
  const act = (b: HTMLElement, f: () => void) =>
    b.addEventListener(
      "click",
      () => {
        if (b.getAttribute("aria-disabled") === "true") return;
        f();
      },
      { signal },
    );
  const on = (el: EventTarget, type: string, f: (e: Event) => void, opts?: AddEventListenerOptions) => el.addEventListener(type, f, { ...opts, signal });
  act(bFirst, () => goSpread(0, "R"));
  act(bPrev, prev);
  act(bNext, next);
  act(bLast, () => goSpread(N, "L"));
  on(bZoomIn, "click", () => opened && zoomStep(1.35));
  on(bZoomOut, "click", () => opened && zoomStep(1 / 1.35));
  on(bZoomReset, "click", () => {
    if (opened) {
      flyTo(fitState(), 0.6, 0);
      AUD.whoosh(false, 0.6);
    }
  });
  on(bText, "click", () => {
    AUD.tick();
    if (textPanel?.hidden) openText();
    else closeText(false);
  });
  on(tpClose, "click", () => {
    AUD.tick();
    closeText(true);
  });
  on(tpSmaller, "click", () => {
    AUD.tick(0.7);
    setTp(-2);
  });
  on(tpBigger, "click", () => {
    AUD.tick(0.7);
    setTp(2);
  });
  on(bSound, "click", toggleSound);
  if (!(document.fullscreenEnabled || fsDoc.webkitFullscreenEnabled)) bFull.hidden = true;
  on(bFull, "click", () => {
    AUD.tick();
    toggleFull();
  });
  on(bHelp, "click", () => {
    AUD.tick();
    if (help?.hidden) openHelp();
    else closeHelp();
  });
  on(helpClose, "click", () => {
    AUD.tick();
    closeHelp();
  });
  on(cardPrev, "click", () => stepDetail(-1));
  on(cardNext, "click", () => stepDetail(1));
  on(cardClose, "click", () => closeDetail("user"));

  on(window, "keydown", (ev) => {
    const e = ev as KeyboardEvent;
    if (!opened || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key, onBtn = e.target instanceof Element && !!e.target.closest("button, a");
    if (k === "Escape") {
      if (help && !help.hidden) closeHelp();
      else if (detail) closeDetail("user");
      else if (textPanel && !textPanel.hidden) closeText(true);
      else if (camT.zoom > 1.02) {
        flyTo(fitState(), 0.6, 0);
        AUD.whoosh(false, 0.6);
      }
      return;
    }
    if (help && !help.hidden) return;
    let used = true;
    switch (k) {
      case "ArrowRight":
      case "PageDown":
        next();
        break;
      case "ArrowLeft":
      case "PageUp":
        prev();
        break;
      case "Home":
        goSpread(0, "R");
        break;
      case "End":
        goSpread(N, "L");
        break;
      case " ":
        if (onBtn) used = false;
        else (e.shiftKey ? prev : next)();
        break;
      case "+":
      case "=":
        zoomStep(1.35);
        break;
      case "-":
      case "_":
        zoomStep(1 / 1.35);
        break;
      case "0":
        flyTo(fitState(), 0.6, 0);
        break;
      case "t":
      case "T":
        if (textPanel?.hidden) openText();
        else closeText(true);
        break;
      case "m":
      case "M":
        toggleSound();
        break;
      case "f":
      case "F":
        toggleFull();
        break;
      case "?":
        openHelp();
        break;
      default:
        used = false;
    }
    if (used) e.preventDefault();
  });
  if (renderer) {
    on(canvas, "pointerdown", (e) => onDown(e as PointerEvent));
    on(canvas, "pointermove", (e) => onMove(e as PointerEvent));
    on(canvas, "pointerup", (e) => onUp(e as PointerEvent, false));
    on(canvas, "pointercancel", (e) => onUp(e as PointerEvent, true));
    on(canvas, "pointerleave", (e) => {
      if ((e as PointerEvent).pointerType === "mouse" && !press) {
        hoverPeek(null);
        ptr.t = 0;
      }
    });
    on(canvas, "dblclick", (e) => onDbl(e as MouseEvent));
    on(canvas, "wheel", (e) => onWheel(e as WheelEvent), { passive: false });
    on(canvas, "contextmenu", (e) => e.preventDefault());
    on(canvas, "webglcontextrestored", () => {
      for (const p of [...hiRes.keys()]) dropHi(p);
      void updateLOD();
    });
  }
  on(document, "gesturestart", (e) => e.preventDefault());
  on(window, "blur", () => {
    if (drag) releaseFlip(true);
    press = null;
    pinch = null;
    pointers.clear();
  });

  /* ---------- vista 2D cuando no hay WebGL ---------- */
  function initFallback() {
    root.classList.add("no3d");
    const c = document.createElement("canvas");
    c.setAttribute("aria-hidden", "true");
    c.className = "r3d-fallback-canvas";
    if (canvas) canvas.hidden = true;
    root.appendChild(c);
    extraNodes.push(c);
    fb = { c, g: c.getContext("2d") };
    const m = document.createElement("div");
    m.className = "r3d-fallback";
    m.setAttribute("role", "status");
    m.textContent = s.fallback;
    root.appendChild(m);
    extraNodes.push(m);
    later(() => m.remove(), 10000);
  }
  async function fbLoad() {
    for (const p of viewPages()) {
      const src = PAGES[p].src;
      if (fbHi[p] || PAGES[p].blank || !src) continue;
      try {
        fbHi[p] = await decodeImg(src);
        fbDirty = true;
      } catch {
        // queda la página en baja resolución
      }
    }
  }
  function draw2D() {
    fbDirty = false;
    if (!fb || !fb.g) return;
    const dpr = Math.min(2, devicePixelRatio || 1), w = innerWidth, h = innerHeight, c = fb.c, g = fb.g;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    if (!ready) return;
    const ps = viewPages(), n = single ? 1 : 2, availH = h - uiTop - uiBot - 16, ph = Math.min(availH, ((w - 40) / n) * ASPECT), pw = ph / ASPECT;
    const x0 = (w - pw * n) / 2, y0 = uiTop + (availH - ph) / 2 + 8;
    for (const p of ps) {
      const src = fbHi[p] || low[p];
      if (src) g.drawImage(src, single ? x0 : p % 2 ? x0 : x0 + pw, y0, pw, ph);
    }
  }

  /* ---------- tamaño y bucle ---------- */
  let pr = Math.min(devicePixelRatio || 1, 2), perfAcc = 0, perfN = 0, perfAdj = 0;
  function resize() {
    const w = innerWidth, h = innerHeight;
    if (renderer) {
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      dustU.uPx.value = (pr * h) / 900;
    }
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bgU.uAspect.value = camera.aspect;
    const was = single;
    single = w / h < 0.82;
    if (was !== single) {
      if (detail) closeDetail("nav");
      side = spreadNow() === N ? "L" : "R";
      fixSide();
    }
    measureUI();
    if (opened && !detail && !flight) {
      const f = fitState();
      camT.bx = f.bx;
      camT.oy = f.oy;
      clampPan(camT);
    }
    if (opened) updateUI();
    fbDirty = true;
  }
  on(window, "resize", resize);
  let last = performance.now(), raf = 0;
  function loop(now: number) {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
    last = now;
    time += dt;
    if (!reduce) ambT += dt;
    S.uTime.value = time;
    S.uAmbT.value = ambT;
    updateLeaves(dt);
    updateBook(dt);
    updateSweeps(dt);
    if (fb) {
      if (fbDirty) draw2D();
      return;
    }
    if (!renderer) return;
    updateCam(dt);
    updateLight(dt);
    updateFx(dt);
    if (dark) dustU.uCol.value.lerp(dustTint, 1 - Math.exp(-2 * dt));
    renderer.render(scene, camera);
    updateHotspots();
    perfAcc += dt;
    perfN++;
    if (perfN >= 90) {
      if (perfAcc / perfN > 0.026 && pr > 1 && now - perfAdj > 3000) {
        pr = Math.max(1, pr - 0.25);
        perfAdj = now;
        resize();
      }
      perfAcc = 0;
      perfN = 0;
    }
  }

  /* ---------- imágenes: copia pequeña de cada página; nítidas solo cerca de la doble página abierta ---------- */
  async function decodeImg(src: string) {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.decoding = "async";
    im.src = src;
    if (im.decode) await im.decode();
    else
      await new Promise((r, j) => {
        im.onload = r;
        im.onerror = j;
      });
    return im;
  }
  function setMap(p: number, t: THREE.Texture) {
    const L = leaves[p >> 1];
    (p % 2 ? L.u.uMapB : L.u.uMapF).value = t;
  }
  function setMaskTex(p: number, t: THREE.Texture) {
    const L = leaves[p >> 1];
    (p % 2 ? L.u.uFxB : L.u.uFxF).value = t;
  }
  function buildLow(p: number, im: HTMLImageElement | null) {
    const P = PAGES[p], c = mkCanvas(LOW_W, Math.round(LOW_W * ASPECT)), g = c.getContext("2d");
    if (g) {
      g.fillStyle = P.color || "#f2f2ef";
      g.fillRect(0, 0, c.width, c.height);
      if (im) g.drawImage(im, 0, 0, c.width, c.height);
    }
    low[p] = c;
    if (renderer) {
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = aniso;
      texLow[p] = t;
      setMap(p, t);
    }
  }
  function buildMask(p: number) {
    const P = PAGES[p], mw = 256, mh = Math.round(256 * ASPECT), c = mkCanvas(mw, mh), g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return;
    const sx = mw / RW, sy = mh / RH;
    g.fillStyle = "#000";
    g.fillRect(0, 0, mw, mh);
    g.globalCompositeOperation = "lighter";
    for (const [x0, y0, x1, y1, v] of P.varnish || []) {
      g.fillStyle = `rgb(${v},0,0)`;
      g.fillRect(x0 * sx, y0 * sy, (x1 - x0) * sx, (y1 - y0) * sy);
    }
    g.globalCompositeOperation = "source-over";
    const fx = P.fx, lc = low[p];
    if (fx && fx.key && lc) {
      try {
        const [x0, y0, x1, y1] = fx.rect, X0 = Math.floor(x0 * sx), Y0 = Math.floor(y0 * sy), w = Math.ceil((x1 - x0) * sx), h = Math.ceil((y1 - y0) * sy);
        const tmp = mkCanvas(w, h), tg = tmp.getContext("2d", { willReadFrequently: true });
        if (tg) {
          tg.drawImage(lc, (x0 / RW) * lc.width, (y0 / RH) * lc.height, ((x1 - x0) / RW) * lc.width, ((y1 - y0) / RH) * lc.height, 0, 0, w, h);
          const src = tg.getImageData(0, 0, w, h).data, dst = g.getImageData(X0, Y0, w, h), d = dst.data, [kr, kg, kb] = fx.key, tol = fx.tol || 80;
          for (let i = 0; i < src.length; i += 4) {
            const dd = Math.hypot(src[i] - kr, src[i + 1] - kg, src[i + 2] - kb);
            d[i + 2] = dd < tol ? 255 : dd < tol * 1.5 ? Math.round(510 * (1.5 - dd / tol)) : 0;
          }
          g.putImageData(dst, X0, Y0);
        }
      } catch {
        // la máscara de brillo es opcional
      }
    }
    if (renderer) {
      const t = new THREE.CanvasTexture(c);
      texMask[p] = t;
      setMaskTex(p, t);
    }
  }
  function nearPages() {
    const sp = spreadNow(), out: number[] = [];
    for (const k of [sp, sp + 1, sp - 1]) if (k >= 0 && k <= N) for (const p of pagesOf(k)) if (!PAGES[p].blank && !out.includes(p)) out.push(p);
    return out;
  }
  async function makeHi(p: number) {
    const src = PAGES[p].src;
    if (!src || !renderer) throw new Error("sin imagen");
    const im = await decodeImg(src), w = Math.min(hiW, im.naturalWidth || hiW), c = mkCanvas(w, Math.round(w * ASPECT));
    c.getContext("2d")?.drawImage(im, 0, 0, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = aniso;
    try {
      renderer.initTexture(t);
      c.width = c.height = 1;
    } catch {
      // si no se pudo subir ahora, se conserva el canvas
    }
    return t;
  }
  function dropHi(p: number) {
    const t = hiRes.get(p);
    if (!t) return;
    hiRes.delete(p);
    const lt = texLow[p];
    if (lt) setMap(p, lt);
    t.dispose();
  }
  async function updateLOD() {
    if (!renderer || !ready || !alive) return;
    if (lodRun) {
      lodAgain = true;
      return;
    }
    lodRun = true;
    try {
      do {
        lodAgain = false;
        const want = nearPages();
        for (const p of [...hiRes.keys()]) if (!want.includes(p)) dropHi(p);
        for (const p of want) {
          if (lodAgain || !alive) break;
          if (hiRes.has(p) || !PAGES[p].src) continue;
          const t = await makeHi(p);
          if (!alive || !nearPages().includes(p)) {
            t.dispose();
            continue;
          }
          hiRes.set(p, t);
          setMap(p, t);
          await new Promise((r) => requestAnimationFrame(r));
        }
      } while (lodAgain && alive);
    } catch (e) {
      console.warn("Lector 3D: no se pudo cargar una página nítida", e);
    }
    lodRun = false;
  }
  function makeThumbs() {
    if (!thumbs) return;
    thumbs.textContent = "";
    thumbEls.length = 0;
    for (let k = 0; k <= N; k++) {
      const b = document.createElement("button"), ps = pagesOf(k), ns = numsOf(ps);
      b.type = "button";
      b.className = "thumb";
      b.setAttribute("aria-label", `${ns.length ? `${ns.length > 1 ? s.pages : s.page} ${ns.join(s.and)}, ` : ""}${spreadLabel(k)}`);
      const c = mkCanvas(112, 80), g = c.getContext("2d");
      ps.forEach((p) => {
        const l = low[p];
        if (l && g) g.drawImage(l, p % 2 ? 0 : 56, 0, 56, 80);
      });
      b.appendChild(c);
      b.addEventListener("click", () => goSpread(k, k === 0 || blankLeft(k) ? "R" : "L"));
      thumbs.appendChild(b);
      thumbEls.push(b);
    }
  }

  /* ---------- arranque ---------- */
  function openBook(withSound: boolean) {
    if (opened || !ready) return;
    soundOn = withSound;
    if (withSound) AUD.init();
    setSoundUI();
    opened = true;
    root.classList.add("is-open");
    if (intro) {
      intro.classList.add("gone");
      intro.setAttribute("aria-hidden", "true");
      intro.inert = true;
    }
    measureUI();
    flyTo(fitState(), reduce ? 0 : 2.6, 0);
    onSpreadChange();
    if (!reduce) {
      later(() => {
        sweep(0, 0);
        AUD.shimmer();
      }, 1500);
      later(invitePeek, 2700);
    }
    later(() => showHint(HINT, 5200), reduce ? 300 : 2900);
    bNext?.focus({ preventScroll: true });
  }
  on(bOpen, "click", () => openBook(true));
  on(bOpenMute, "click", () => openBook(false));
  async function boot() {
    if (!renderer) initFallback();
    setSoundUI();
    resize();
    raf = requestAnimationFrame(loop);
    aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
    const maxT = renderer ? renderer.capabilities.maxTextureSize : 4096;
    hiW = Math.min(isTouch ? 1100 : 1600, Math.floor(maxT / ASPECT));
    // Las páginas pequeñas se piden todas a la vez (son ≈20 KB cada una) y se arman en orden.
    const lows = PAGES.map((P, p) => {
      const src = P.low || P.src;
      if (P.blank || !src) return Promise.resolve(null);
      return decodeImg(src).catch((e) => {
        console.error("Lector 3D: no se pudo cargar la página", NUM[p], e);
        return null;
      });
    });
    for (let p = 0; p < NP; p++) {
      if (!alive) return;
      const P = PAGES[p];
      if (statusEl) statusEl.textContent = P.blank ? s.paper : s.loadingPage(NUM[p] ?? 0, TOTAL);
      const im = await lows[p];
      if (!alive) return;
      buildLow(p, im);
      buildMask(p);
      if (progBar) progBar.style.width = `${Math.round(((p + 1) / NP) * 100)}%`;
      await new Promise((r) => setTimeout(r, 0));
    }
    if (!alive) return;
    makeThumbs();
    ready = true;
    updateUI();
    fbDirty = true;
    if (renderer) {
      if (statusEl) statusEl.textContent = s.sharpening;
      await updateLOD();
    }
    if (!alive) return;
    if (statusEl) statusEl.textContent = s.ready;
    if (bOpen) bOpen.disabled = false;
    if (bOpenMute) bOpenMute.disabled = false;
    bOpen?.focus({ preventScroll: true });
  }
  void boot();

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ac.abort();
      for (const id of timers) window.clearTimeout(id);
      timers.clear();
      AUD.destroy();
      for (const n of extraNodes) n.remove();
      for (const o of hsEls) o.el.remove();
      if (thumbs) thumbs.textContent = "";
      for (const t of [...texLow, ...texMask]) t?.dispose();
      for (const t of hiRes.values()) t.dispose();
      hiRes.clear();
      for (const d of disposables) d.dispose();
      leafGeo.dispose();
      for (const L of leaves) (L.mesh.material as THREE.Material).dispose();
      bg.geometry.dispose();
      (bg.material as THREE.Material).dispose();
      shadow.geometry.dispose();
      shadow.material.dispose();
      dg.dispose();
      dust.material.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      root.classList.remove("is-open", "no3d");
      if (placeholder) placeholder.hidden = false;
    },
  };
}
