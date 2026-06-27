"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/* ─── Constants ───────────────────────────────────────────── */
const CW               = 1.65;
const CH               = CW * (4 / 3);
const N                = 6;
const CAROUSEL_SPACING = 2.55;
const INIT_CAROUSEL_OFF = ((6 - 1) / 2) * CAROUSEL_SPACING; // based on DUMMY length

/* ─── Types ───────────────────────────────────────────────── */
interface LangData {
  title:       string;
  description: string;
  coverImage:  string;
  downloadUrl: string;
  date:        string;
}

interface ArchiveItem {
  id:          number;
  title:       string;
  date:        string;
  description: string;
  languages:   string[];
  downloadUrl: string;
  coverImage:  string;
  bg:          [string, string];
  label:       string;
  langData:    Record<string, LangData>;
}

/* ─── BG palette ──────────────────────────────────────────── */
const BG_PALETTE: [string, string][] = [
  ["#c026d3", "#6366f1"], ["#1e3a5f", "#0f172a"], ["#0f1e3d", "#172554"],
  ["#111827", "#1f2937"], ["#0c1a2e", "#1a3a5c"], ["#1a1a2e", "#0f0f1e"],
  ["#0d2137", "#061525"], ["#1b0a2e", "#0d0621"],
];

/* ─── API helpers ─────────────────────────────────────────── */
function fmtApiDate(raw: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return raw; }
}

function str(v: unknown): string { return v ? String(v) : ""; }

function mapReport(raw: Record<string, unknown>, idx: number): ArchiveItem {
  /* ── Per-language data extraction ──────────────────────── */
  const langData: Record<string, LangData> = {};

  // Handle translations as object: { EN: {...}, ES: {...} }
  const translationsObj = raw.translations ?? raw.localizations ?? raw.language_versions ?? null;
  if (translationsObj && typeof translationsObj === "object" && !Array.isArray(translationsObj)) {
    for (const [lang, data] of Object.entries(translationsObj as Record<string, Record<string, unknown>>)) {
      langData[lang.toUpperCase()] = {
        title:       str(data.title ?? raw.title),
        description: str(data.description ?? data.summary ?? raw.description),
        coverImage:  str(data.cover_image ?? data.image ?? raw.cover_image),
        downloadUrl: str(data.download_url ?? data.file_url ?? raw.download_url) || "#",
        date:        fmtApiDate(str(data.published_date ?? data.date ?? raw.published_date)),
      };
    }
  }

  // Handle translations as array: [{ language: "EN", title: "...", ... }]
  if (Array.isArray(raw.translations ?? raw.localizations ?? raw.other_languages)) {
    const arr = (raw.translations ?? raw.localizations ?? raw.other_languages) as Record<string, unknown>[];
    for (const data of arr) {
      const lang = str(data.language ?? data.lang ?? data.locale).toUpperCase();
      if (!lang) continue;
      langData[lang] = {
        title:       str(data.title ?? raw.title),
        description: str(data.description ?? data.summary ?? raw.description),
        coverImage:  str(data.cover_image ?? data.image ?? raw.cover_image),
        downloadUrl: str(data.download_url ?? data.file_url ?? raw.download_url) || "#",
        date:        fmtApiDate(str(data.published_date ?? data.date ?? raw.published_date)),
      };
    }
  }

  /* ── Determine available languages ─────────────────────── */
  let langs: string[] = Array.isArray(raw.languages)
    ? (raw.languages as string[]).map((l) => String(l).toUpperCase())
    : Object.keys(langData).length > 0
      ? Object.keys(langData)
      : [str(raw.language).toUpperCase() || "ES"];

  // Ensure primary language is in langData
  const primaryLang = langs[0] ?? "ES";
  if (!langData[primaryLang]) {
    langData[primaryLang] = {
      title:       str(raw.title ?? raw.name),
      description: str(raw.description ?? raw.summary ?? raw.abstract),
      coverImage:  str(raw.cover_image ?? raw.image ?? raw.thumbnail),
      downloadUrl: str(raw.download_url ?? raw.file_url ?? raw.url) || "#",
      date:        fmtApiDate(str(raw.published_date ?? raw.date ?? raw.created_at)),
    };
  }

  const primary    = langData[primaryLang];
  const title      = primary.title || "Untitled";
  const words      = title.split(/\s+/).filter(Boolean);
  const label      = [words.slice(0, 2).join(" "), words.slice(2, 4).join(" ")].filter(Boolean).join("\n") || title.slice(0, 12);

  return {
    id:          idx,
    title,
    date:        primary.date,
    description: primary.description,
    languages:   langs,
    downloadUrl: primary.downloadUrl,
    coverImage:  primary.coverImage,
    bg:          BG_PALETTE[idx % BG_PALETTE.length],
    label,
    langData,
  };
}

/* ─── Fallback dummy data ─────────────────────────────────── */
const DUMMY: ArchiveItem[] = [
  { id: 0, title: "Reporte de Aprendizajes y Recomendaciones de Política Pública", date: "May 31, 2026", description: "Las recomendaciones de política pública se centran en tres áreas clave.", languages: ["ES", "EN", "PT"], downloadUrl: "#", coverImage: "", bg: ["#c026d3", "#6366f1"], label: "fAIr LAC\nJalisco", langData: {} },
  { id: 1, title: "Tokens Digitales para la Acción Climática", date: "Mar 15, 2026", description: "Exploración de oportunidades para el uso de tokens digitales en América Latina.", languages: ["ES", "EN"], downloadUrl: "#", coverImage: "", bg: ["#1e3a5f", "#0f172a"], label: "Tokens\nDigitales", langData: {} },
  { id: 2, title: "Gobernanza de Datos y las Nuevas Tecnologías de Mejora de la Privacidad", date: "Jan 10, 2026", description: "Panorama global y retos para Latinoamérica y el Caribe.", languages: ["ES"], downloadUrl: "#", coverImage: "", bg: ["#0f1e3d", "#172554"], label: "Gobernanza\nde Datos", langData: {} },
  { id: 3, title: "A Ética en IA para América Latina", date: "Oct 22, 2025", description: "Marcos éticos para la IA en el contexto latinoamericano.", languages: ["ES", "PT"], downloadUrl: "#", coverImage: "", bg: ["#111827", "#1f2937"], label: "A Ética\nen IA", langData: {} },
  { id: 4, title: "León Innovando para el Futuro del Trabajo — LIFT", date: "Sep 5, 2025", description: "Inserción laboral de las juventudes en León, México.", languages: ["ES"], downloadUrl: "#", coverImage: "", bg: ["#0c1a2e", "#1a3a5c"], label: "LIFT\nLeón", langData: {} },
  { id: 5, title: "impactIA para la Recuperación Económica Sostenible", date: "Jul 18, 2025", description: "IA para la recuperación económica sostenible e inclusiva de México.", languages: ["ES", "EN"], downloadUrl: "#", coverImage: "", bg: ["#1a1a2e", "#0f0f1e"], label: "impactIA\nMéxico", langData: {} },
];

/* ─── Scatter layout ──────────────────────────────────────── */
const SCAT_POS: [number, number, number][] = [
  [-3.8,  0.9, -1.2], [-2.1, -0.8,  0.6], [-0.5,  1.6, -2.1],
  [ 0.9, -0.4, -0.7], [ 2.8,  0.7,  0.3], [ 3.6, -1.2, -1.8],
  [-3.2, -1.4,  0.9], [-1.6,  1.2, -1.5], [ 1.5,  1.4,  0.7],
  [ 3.0, -0.8,  1.2], [-2.8,  0.3, -0.6], [ 0.3, -1.5,  1.0],
  [-1.0,  0.8,  1.4], [ 2.1, -1.3, -0.9], [ 3.8,  0.5, -0.4],
  [-0.2, -0.9, -1.8],
];
const SCAT_ROT: [number, number, number][] = [
  [ 0.08,  0.28, -0.04], [-0.06, -0.22,  0.07], [ 0.18,  0.12, -0.09],
  [-0.09,  0.24,  0.06], [ 0.04, -0.28, -0.07], [ 0.13,  0.18,  0.09],
  [-0.14,  0.10,  0.08], [ 0.07, -0.18,  0.12], [-0.05,  0.22, -0.10],
  [ 0.11, -0.08,  0.15], [-0.17,  0.14, -0.06], [ 0.09,  0.20,  0.05],
  [-0.08, -0.12,  0.18], [ 0.16,  0.06, -0.11], [-0.12,  0.24,  0.07],
  [ 0.05, -0.20, -0.13],
];

/* ─── Grayscale shader ────────────────────────────────────── */
const VERT_SH = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG_SH = `
uniform sampler2D uMap;
uniform float     uGray;
uniform float     uDim;
varying vec2 vUv;
void main() {
  vec4  c   = texture2D(uMap, vUv);
  float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  vec3  col = mix(c.rgb, vec3(lum * 0.60), uGray);
  gl_FragColor = vec4(col * uDim, c.a);
}`;

/* ─── Canvas gradient texture (fallback) ─────────────────── */
function makeGradientTexture(item: ArchiveItem): THREE.CanvasTexture {
  const W = 300, H = 400;
  const cv  = document.createElement("canvas");
  cv.width  = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  const g   = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, item.bg[0]);
  g.addColorStop(1, item.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 0, W, 1);
  ctx.fillStyle    = "rgba(255,255,255,0.90)";
  ctx.font         = "bold 24px sans-serif";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  const lines = item.label.split("\n");
  const sy = H / 2 - ((lines.length - 1) * 34) / 2;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, sy + i * 34));
  ctx.fillStyle    = "rgba(255,255,255,0.22)";
  ctx.font         = "11px sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("C MINDS", W / 2, H - 16);
  return new THREE.CanvasTexture(cv);
}

/* ─── Odometer title ─────────────────────────────────────── */
function OdometerTitle({ text, className }: { text: string; className?: string }) {
  const [current, setCurrent] = useState(text);
  const charsRef   = useRef<(HTMLSpanElement | null)[]>([]);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    gsap.killTweensOf(chars);
    gsap.to(chars, { y: 28, opacity: 0, duration: 0.2, stagger: { each: 0.011, from: "start" }, ease: "power3.in", onComplete: () => setCurrent(text) });
  }, [text]);
  useEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    gsap.killTweensOf(chars);
    gsap.fromTo(chars, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26, stagger: { each: 0.013, from: "start" }, ease: "power2.out" });
  }, [current]);
  return (
    <span className={className}>
      {current.split("").map((char, i) => (
        <span key={i} ref={(el) => { charsRef.current[i] = el; }} style={{ display: "inline-block" }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

/* ─── Blur-fade date ──────────────────────────────────────── */
function BlurDate({ text, className }: { text: string; className?: string }) {
  const [current, setCurrent] = useState(text);
  const ref        = useRef<HTMLSpanElement>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    gsap.killTweensOf(ref.current);
    gsap.to(ref.current, { opacity: 0, filter: "blur(8px)", duration: 0.18, ease: "power2.in", onComplete: () => setCurrent(text) });
  }, [text]);
  useEffect(() => {
    gsap.killTweensOf(ref.current);
    gsap.fromTo(ref.current, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.26, ease: "power2.out" });
  }, [current]);
  return <span ref={ref} className={className}>{current}</span>;
}

/* ─── Card mesh ───────────────────────────────────────────── */
interface CardProps {
  item:        ArchiveItem;
  index:       number;
  total:       number;
  progress:    number;
  carouselOff: number;
  activeIdx:   number | null;
  hoverIdx:    number | null;
  onHover:     (i: number | null) => void;
  onClick:     (i: number) => void;
}

function ArchCard({ item, index, total, progress, carouselOff, activeIdx, hoverIdx, onHover, onClick }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);

  // Start with gradient, swap to cover image when loaded
  const texture = useMemo(() => {
    const fallback = makeGradientTexture(item);
    if (item.coverImage) {
      new THREE.TextureLoader().load(item.coverImage, (loaded) => {
        loaded.flipY = false;
        if (matRef.current) matRef.current.uniforms.uMap.value = loaded;
      });
    }
    return fallback;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.coverImage]);

  const uniforms = useMemo(() => ({
    uMap:  { value: texture },
    uGray: { value: 0.0 },
    uDim:  { value: 0.0 },   // start invisible, animate in
  }), [texture]);

  const cx = (index - (total - 1) / 2) * CAROUSEL_SPACING + carouselOff;

  useFrame((state) => {
    const m   = meshRef.current;
    const mat = matRef.current;
    if (!m || !mat) return;

    const t          = state.clock.elapsedTime;
    const isHovered  = hoverIdx  === index;
    const isActive   = activeIdx === index;
    const hasActive  = activeIdx !== null;
    const inCarousel = progress > 0.85;

    let tx: number, ty: number, tz: number;
    let tRX: number, tRY: number, tRZ: number;
    let tScale: number, tGray: number, tDim: number;

    if (!hasActive) {
      const floatY = Math.sin(t * 0.7 + index * 1.1) * 0.08 * (1 - progress);
      tx  = SCAT_POS[index][0] + (cx - SCAT_POS[index][0]) * progress;
      ty  = SCAT_POS[index][1] * (1 - progress) + floatY;
      tz  = SCAT_POS[index][2] * (1 - progress);
      tRX = SCAT_ROT[index][0] * (1 - progress);
      tRY = SCAT_ROT[index][1] * (1 - progress);
      tRZ = SCAT_ROT[index][2] * (1 - progress);
      tScale = isHovered && inCarousel ? 1.06 : 1.0;
      tGray  = inCarousel && !isHovered ? 0.88 : 0.0;
      tDim   = 1.0;
    } else if (isActive) {
      const mob = window.innerWidth < 768;
      tx = mob ? 0 : -1.8; ty = mob ? 1.0 : 0; tz = 1.2;
      tRX = 0; tRY = 0; tRZ = 0;
      tScale = mob ? 1.1 : 1.68;
      tGray  = 0.0;
      tDim   = 1.0;
    } else {
      const ai          = activeIdx as number;
      const isPeekLeft  = ai - 1 === index;
      const isPeekRight = ai + 1 === index;
      if (isPeekLeft)        tx = -4.1;
      else if (isPeekRight)  tx =  4.1;
      else if (index < ai)   tx = -14;
      else                   tx =  14;
      ty = 0; tz = -0.4;
      tRX = 0; tRY = 0; tRZ = 0;
      tScale = (isPeekLeft || isPeekRight) ? 0.80 : 0.4;
      tGray  = 0.92;
      tDim   = (isPeekLeft || isPeekRight) ? 0.36 : 0.0;
    }

    m.position.x += (tx  - m.position.x) * 0.09;
    m.position.y += (ty  - m.position.y) * 0.09;
    m.position.z += (tz  - m.position.z) * 0.09;
    m.rotation.x += (tRX - m.rotation.x) * 0.09;
    m.rotation.y += (tRY - m.rotation.y) * 0.09;
    m.rotation.z += (tRZ - m.rotation.z) * 0.09;
    m.scale.x    += (tScale - m.scale.x)  * 0.08;
    m.scale.y    += (tScale - m.scale.y)  * 0.08;
    mat.uniforms.uGray.value += (tGray - mat.uniforms.uGray.value) * 0.08;
    mat.uniforms.uDim.value  += (tDim  - mat.uniforms.uDim.value)  * 0.06;
  });

  return (
    <mesh
      ref={meshRef}
      position={[SCAT_POS[index][0], SCAT_POS[index][1], SCAT_POS[index][2]]}
      rotation={[SCAT_ROT[index][0], SCAT_ROT[index][1], SCAT_ROT[index][2]]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onClick(index); }}
    >
      <planeGeometry args={[CW, CH]} />
      <shaderMaterial ref={matRef} vertexShader={VERT_SH} fragmentShader={FRAG_SH} uniforms={uniforms} />
    </mesh>
  );
}

/* ─── Scene wrapper ───────────────────────────────────────── */
interface SceneProps {
  items:       ArchiveItem[];
  progress:    number;
  carouselOff: number;
  hoverIdx:    number | null;
  activeIdx:   number | null;
  mouseNY:     number;
  setHoverIdx: (i: number | null) => void;
  onCardClick: (i: number) => void;
}

function Scene({ items, progress, carouselOff, hoverIdx, activeIdx, mouseNY, setHoverIdx, onCardClick }: SceneProps) {
  const { camera } = useThree();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.rotation.x += (mouseNY * -0.2 - cam.rotation.x) * 0.04;
  });
  return (
    <>
      {items.map((item, i) => (
        <ArchCard
          key={item.id}
          item={item}
          index={i}
          total={items.length}
          progress={progress}
          carouselOff={carouselOff}
          activeIdx={activeIdx}
          hoverIdx={hoverIdx}
          onHover={setHoverIdx}
          onClick={onCardClick}
        />
      ))}
    </>
  );
}

/* ─── Main component ──────────────────────────────────────── */
interface TheArchiveProps {
  visible:   boolean;
  onExpand?: (active: boolean) => void;
}

export default function TheArchive({ visible, onExpand }: TheArchiveProps) {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const panelRef      = useRef<HTMLDivElement>(null);
  const progressRef   = useRef(0);
  const panelVisRef   = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchRawRef   = useRef(0);

  const [items,       setItems]       = useState<ArchiveItem[]>(DUMMY);
  const [loading,     setLoading]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [carouselOff, setCarouselOff] = useState(INIT_CAROUSEL_OFF);
  const [hoverIdx,    setHoverIdx]    = useState<number | null>(null);
  const [activeIdx,   setActiveIdx]   = useState<number | null>(null);
  const [mouseNY,     setMouseNY]     = useState(0);
  const [activeLang,  setActiveLang]  = useState(0);
  const [panelItem,   setPanelItem]   = useState<ArchiveItem | null>(null);

  const carouselHalf = useMemo(
    () => ((items.length - 1) / 2) * CAROUSEL_SPACING,
    [items.length]
  );

  /* fetch reports */
  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        // Log first item structure for debugging
        const rawArr: Record<string, unknown>[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.reports)
            ? data.reports
            : Array.isArray(data?.data)
              ? data.data
              : [];
        if (rawArr.length > 0) {
          console.log("[archive] first report keys:", Object.keys(rawArr[0]));
          const mapped = rawArr.slice(0, SCAT_POS.length).map(mapReport);
          setItems(mapped);
          setCarouselOff(((mapped.length - 1) / 2) * CAROUSEL_SPACING);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* mouse → camera tilt */
  useEffect(() => {
    const h = (e: MouseEvent) => setMouseNY((e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* wheel → scroll progress */
  useEffect(() => {
    if (!visible) return;
    const h = (e: WheelEvent) => {
      if (activeIdx !== null) return;
      e.preventDefault();
      progressRef.current = Math.max(0, Math.min(2, progressRef.current + e.deltaY * 0.0014));
      const raw = progressRef.current;
      setProgress(Math.min(1, raw));
      const t = Math.max(0, Math.min(1, raw - 1));
      setCarouselOff(carouselHalf * (1 - 2 * t));
    };
    window.addEventListener("wheel", h, { passive: false });
    return () => window.removeEventListener("wheel", h);
  }, [visible, activeIdx, carouselHalf]);

  /* touch drag (mobile) */
  useEffect(() => {
    if (!visible) return;
    const onStart = (e: TouchEvent) => {
      if (activeIdx !== null) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchRawRef.current   = progressRef.current;
    };
    const onMove = (e: TouchEvent) => {
      if (!touchStartRef.current || activeIdx !== null) return;
      e.preventDefault();
      const dx  = e.touches[0].clientX - touchStartRef.current.x;
      const dy  = e.touches[0].clientY - touchStartRef.current.y;
      const raw = touchRawRef.current;
      const newRaw = raw < 1.0
        ? Math.max(0, Math.min(2, raw - dy / (window.innerHeight * 0.45)))
        : Math.max(0, Math.min(2, raw - dx / (window.innerWidth * 0.55)));
      progressRef.current = newRaw;
      setProgress(Math.min(1, newRaw));
      const t = Math.max(0, Math.min(1, newRaw - 1));
      setCarouselOff(carouselHalf * (1 - 2 * t));
    };
    const onEnd = () => { touchStartRef.current = null; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove",  onMove,  { passive: false });
    window.addEventListener("touchend",   onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove",  onMove);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [visible, activeIdx, carouselHalf]);

  /* entry / exit */
  useEffect(() => {
    if (!wrapRef.current) return;
    if (visible) {
      gsap.fromTo(wrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    } else {
      progressRef.current = 0;
      setProgress(0);
      setCarouselOff(INIT_CAROUSEL_OFF);
      setActiveIdx(null);
      setHoverIdx(null);
      panelVisRef.current = false;
      setPanelItem(null);
    }
  }, [visible]);

  /* Escape to close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeIdx !== null) {
        setActiveIdx(null); setActiveLang(0); onExpand?.(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeIdx, onExpand]);

  /* Panel show / switch / hide */
  useEffect(() => {
    const mob = window.innerWidth < 768;
    const outTween = mob ? { y: "100%" } : { x: "55%", opacity: 0 };
    if (activeIdx !== null) {
      if (!panelVisRef.current) {
        panelVisRef.current = true;
        setPanelItem(items[activeIdx]);
      } else {
        gsap.to(panelRef.current, {
          ...outTween, duration: 0.2, ease: "power2.in",
          onComplete: () => { setPanelItem(items[activeIdx]); },
        });
      }
    } else {
      panelVisRef.current = false;
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          ...outTween, duration: 0.3, ease: "power3.in",
          onComplete: () => setPanelItem(null),
        });
      } else {
        setPanelItem(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  /* Animate panel in */
  useEffect(() => {
    if (!panelItem || !panelRef.current) return;
    const mob = window.innerWidth < 768;
    gsap.fromTo(panelRef.current,
      mob ? { y: "100%", opacity: 1 } : { x: "55%", opacity: 0 },
      mob ? { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }
          : { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }
    );
  }, [panelItem]);

  const handleCardClick = useCallback((i: number) => {
    if (activeIdx === null) {
      if (progress < 0.85) return;
      setActiveIdx(i); setActiveLang(0); onExpand?.(true);
    } else if (activeIdx === i) {
      setActiveIdx(null); setActiveLang(0); onExpand?.(false);
    } else {
      setActiveIdx(i); setActiveLang(0);
    }
  }, [progress, activeIdx, onExpand]);

  const hoverItem = hoverIdx !== null ? items[hoverIdx] : null;
  const infoItem  = panelItem ?? (progress > 0.85 ? hoverItem : null);

  /* ── Derived panel content based on selected language ── */
  const activeLangStr  = panelItem?.languages[activeLang] ?? "";
  const activeLangData = panelItem?.langData[activeLangStr] ?? null;
  const panelTitle       = activeLangData?.title       ?? panelItem?.title       ?? "";
  const panelDate        = activeLangData?.date        ?? panelItem?.date        ?? "";
  const panelDescription = activeLangData?.description ?? panelItem?.description ?? "";
  const panelDownload    = activeLangData?.downloadUrl ?? panelItem?.downloadUrl ?? "#";
  const panelCover       = activeLangData?.coverImage  ?? panelItem?.coverImage  ?? "";

  if (!visible) return null;

  return (
    <div ref={wrapRef} className="archive-wrap">

      <Canvas
        camera={{ fov: 55, position: [0, 0, 8], near: 0.1, far: 50 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        className="archive-canvas"
      >
        <Scene
          items={items}
          progress={progress}
          carouselOff={carouselOff}
          hoverIdx={hoverIdx}
          activeIdx={activeIdx}
          mouseNY={mouseNY}
          setHoverIdx={setHoverIdx}
          onCardClick={handleCardClick}
        />
      </Canvas>

      {/* Skeleton overlay while loading */}
      {loading && (
        <div className="archive-skeleton-overlay">
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} className="archive-skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* Title */}
      <div className={`archive-title-wrap${progress > 0.12 ? " archive-title-wrap--up" : ""}${activeIdx !== null ? " archive-title-wrap--hidden" : ""}`}>
        <h2 className="archive-heading">
          <span className="archive-heading-the">The </span>
          <span className="archive-heading-arc">Archive</span>
        </h2>
      </div>

      {/* Scroll hint */}
      <div className={`archive-scroll-hint${progress > 0.07 ? " archive-scroll-hint--gone" : ""}`}>
        <span>Scroll to arrange</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="4" x2="12" y2="20" /><polyline points="18 14 12 20 6 14" />
        </svg>
      </div>

      {/* Info bar (hover, no active) */}
      <div className={`archive-info-bar${infoItem && activeIdx === null ? " archive-info-bar--visible" : ""}`}>
        {infoItem && activeIdx === null && <>
          <BlurDate text={infoItem.date} className="archive-info-date" />
          <OdometerTitle text={infoItem.title} className="archive-info-title" />
        </>}
      </div>

      {/* Side panel */}
      {panelItem && (
        <div ref={panelRef} className="archive-panel">
          <button
            className="archive-panel-close"
            onClick={() => { setActiveIdx(null); setActiveLang(0); onExpand?.(false); }}
            aria-label="Close"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Cover image (language-aware) */}
          {panelCover && (
            <div className="archive-panel-cover">
              <img src={panelCover} alt={panelTitle} />
            </div>
          )}

          {/* Language tabs */}
          <div className="archive-lang-tabs">
            {panelItem.languages.map((lang, li) => (
              <button
                key={lang}
                className={`archive-lang-btn${activeLang === li ? " archive-lang-btn--active" : ""}`}
                onClick={() => setActiveLang(li)}
              >
                {lang}
              </button>
            ))}
          </div>

          <p className="archive-detail-date">{panelDate}</p>
          <h3 className="archive-detail-title">{panelTitle}</h3>
          <p className="archive-detail-desc">{panelDescription}</p>

          <a className="archive-download-btn" href={panelDownload} target="_blank" rel="noopener noreferrer">
            Download
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
