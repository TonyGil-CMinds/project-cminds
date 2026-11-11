"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useLocale } from "@/i18n/useLocale";
import { copy } from "@/app/[locale]/mindscope/copy";
import Link from "next/link";
import { readerHref, type ReaderRef } from "@/components/reader3d/links";

/* ─── Constants ───────────────────────────────────────────── */
const CW               = 1.65;
const CH               = CW * (4 / 3);
const N                = 6;
const CAROUSEL_SPACING = 2.55;
const CAROUSEL_LIFT    = 0.55;
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
  apiId:       string;
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
function fmtApiDate(raw: string, locale: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return raw; }
}

function str(v: unknown): string { return v ? String(v) : ""; }

function saveAs(reportId: string, lang: string, title: string, url?: string) {
  if (!reportId) return;
  const ext      = (url ? url.split("?")[0].split(".").pop()?.toLowerCase() : "") || "pdf";
  const proxy    = `/api/download?reportId=${encodeURIComponent(reportId)}&lang=${encodeURIComponent(lang)}`;
  const filename = title.replace(/[^a-zA-ZÀ-ÿ0-9 _-]/g, "").trim().slice(0, 80) || "report";
  const a        = document.createElement("a");
  a.href         = proxy;
  a.download     = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function findFileUrl(obj: Record<string, unknown>): string {
  // Nested: files.url or files[0].url
  const filesField = obj.files;
  if (filesField && typeof filesField === "object" && !Array.isArray(filesField)) {
    const f = filesField as Record<string, unknown>;
    const u = f.url ?? f.download_url ?? f.file_url ?? f.href;
    if (typeof u === "string" && u.startsWith("http")) return u;
  }
  if (Array.isArray(filesField) && filesField.length > 0) {
    const f = filesField[0] as Record<string, unknown>;
    const u = f.url ?? f.download_url ?? f.file_url ?? f.href;
    if (typeof u === "string" && u.startsWith("http")) return u;
  }

  // Explicit top-level fields
  const explicit = obj.download_url ?? obj.downloadUrl ?? obj.file_url ?? obj.fileUrl
    ?? obj.download ?? obj.file ?? obj.link ?? obj.href ?? obj.pdf_url ?? obj.pdf
    ?? obj.document_url ?? obj.document ?? obj.media_url ?? obj.attachment ?? obj.report_url
    ?? obj.resource_url ?? obj.asset_url ?? obj.source_url;
  if (typeof explicit === "string" && explicit.startsWith("http")) return explicit;

  // Last resort: scan every string value for a downloadable URL
  for (const v of Object.values(obj)) {
    if (typeof v === "string" && v.startsWith("http") &&
        (v.includes("media.base44") || v.endsWith(".pdf") || v.endsWith(".docx") ||
         v.includes("/files/") || v.includes("/documents/") || v.includes("/download"))) {
      return v;
    }
  }
  return "#";
}

function mapReport(raw: Record<string, unknown>, idx: number, locale: string): ArchiveItem {
  // Shared fields (same for all languages)
  const sharedTitle = str(raw.title ?? raw.name);
  const sharedDesc  = str(raw.description ?? raw.summary);
  const sharedCover = str(raw.cover_image ?? raw.image ?? raw.thumbnail);
  const sharedDate  = fmtApiDate(str(raw.published_date ?? raw.date ?? raw.created_at), locale);

  // Build langData from files[] → { language, url, file_name }
  const langData: Record<string, LangData> = {};
  const files = Array.isArray(raw.files)
    ? (raw.files as Array<Record<string, unknown>>)
    : [];

  for (const file of files) {
    const lang = str(file.language ?? file.lang).toUpperCase() || "ES";
    langData[lang] = {
      title:       str(file.title)       || sharedTitle,
      description: str(file.description) || sharedDesc,
      coverImage:  str(file.cover_image) || sharedCover,
      downloadUrl: str(file.url ?? file.download_url) || "#",
      date:        sharedDate,
    };
  }

  // Fallback when no files array
  if (Object.keys(langData).length === 0) {
    const fallbackLang = str(raw.language ?? raw.lang).toUpperCase() || "ES";
    langData[fallbackLang] = {
      title:       sharedTitle,
      description: sharedDesc,
      coverImage:  sharedCover,
      downloadUrl: findFileUrl(raw),
      date:        sharedDate,
    };
  }

  const langs       = Object.keys(langData);
  const primary     = langData[langs[0]];
  const title       = primary.title || "Untitled";
  const words       = title.split(/\s+/).filter(Boolean);
  const label       = [words.slice(0, 2).join(" "), words.slice(2, 4).join(" ")].filter(Boolean).join("\n") || title.slice(0, 12);

  return {
    id:          idx,
    apiId:       str(raw.id),
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

/* ─── Publicaciones solo como lector 3D (no están en Base44) ── */
const READER_ONLY = "reader:";

interface StandaloneReader {
  slug:        string;
  langs:       string[];
  title:       string;
  description: string;
  date:        string;
  cover:       string;
}

interface ReadersPayload {
  reports?:    Record<string, ReaderRef>;
  standalone?: StandaloneReader[];
}

function standaloneItem(s: StandaloneReader, idx: number): ArchiveItem {
  const langs = s.langs.map((l) => l.toUpperCase());
  const words = s.title.split(/\s+/).filter(Boolean);
  const data: LangData = { title: s.title, description: s.description, coverImage: s.cover, downloadUrl: "#", date: s.date || "—" };
  return {
    id:          idx,
    apiId:       `${READER_ONLY}${s.slug}`,
    title:       s.title,
    date:        data.date,
    description: s.description,
    languages:   langs,
    downloadUrl: "#",
    coverImage:  s.cover,
    bg:          BG_PALETTE[idx % BG_PALETTE.length],
    label:       [words.slice(0, 2).join(" "), words.slice(2, 4).join(" ")].filter(Boolean).join("\n") || s.title,
    langData:    Object.fromEntries(langs.map((l) => [l, data])),
  };
}

/* ─── Fallback dummy data ─────────────────────────────────── */
const DUMMY: ArchiveItem[] = [
  { id: 0, apiId: "", title: "Reporte de Aprendizajes y Recomendaciones de Política Pública", date: "May 31, 2026", description: "Las recomendaciones de política pública se centran en tres áreas clave.", languages: ["ES", "EN", "PT"], downloadUrl: "#", coverImage: "", bg: ["#c026d3", "#6366f1"], label: "fAIr LAC\nJalisco", langData: {} },
  { id: 1, apiId: "", title: "Tokens Digitales para la Acción Climática", date: "Mar 15, 2026", description: "Exploración de oportunidades para el uso de tokens digitales en América Latina.", languages: ["ES", "EN"], downloadUrl: "#", coverImage: "", bg: ["#1e3a5f", "#0f172a"], label: "Tokens\nDigitales", langData: {} },
  { id: 2, apiId: "", title: "Gobernanza de Datos y las Nuevas Tecnologías de Mejora de la Privacidad", date: "Jan 10, 2026", description: "Panorama global y retos para Latinoamérica y el Caribe.", languages: ["ES"], downloadUrl: "#", coverImage: "", bg: ["#0f1e3d", "#172554"], label: "Gobernanza\nde Datos", langData: {} },
  { id: 3, apiId: "", title: "A Ética en IA para América Latina", date: "Oct 22, 2025", description: "Marcos éticos para la IA en el contexto latinoamericano.", languages: ["ES", "PT"], downloadUrl: "#", coverImage: "", bg: ["#111827", "#1f2937"], label: "A Ética\nen IA", langData: {} },
  { id: 4, apiId: "", title: "León Innovando para el Futuro del Trabajo — LIFT", date: "Sep 5, 2025", description: "Inserción laboral de las juventudes en León, México.", languages: ["ES"], downloadUrl: "#", coverImage: "", bg: ["#0c1a2e", "#1a3a5c"], label: "LIFT\nLeón", langData: {} },
  { id: 5, apiId: "", title: "impactIA para la Recuperación Económica Sostenible", date: "Jul 18, 2025", description: "IA para la recuperación económica sostenible e inclusiva de México.", languages: ["ES", "EN"], downloadUrl: "#", coverImage: "", bg: ["#1a1a2e", "#0f0f1e"], label: "impactIA\nMéxico", langData: {} },
];

/* ─── Scatter layout ──────────────────────────────────────── */
const SCAT_POS: [number, number, number][] = [
  [-3.8,  0.9, -1.2], [-2.1, -0.8,  0.6], [-0.5,  1.6, -2.1],
  [ 0.9, -0.4, -0.7], [ 2.8,  0.7,  0.3], [ 3.6, -1.2, -1.8],
  [-3.2, -1.4,  0.9], [-1.6,  1.2, -1.5], [ 1.5,  1.4,  0.7],
  [ 3.0, -0.8,  1.2], [-2.8,  0.3, -0.6], [ 0.3, -1.5,  1.0],
  [-1.0,  0.8,  1.4], [ 2.1, -1.3, -0.9], [ 3.8,  0.5, -0.4],
  [-0.2, -0.9, -1.8], [ 1.2,  1.5, -1.3], [-3.5,  0.1,  1.1],
  [ 2.4, -1.6,  0.5], [-1.8,  1.7, -0.8], [ 0.6, -1.1,  1.6],
  [ 3.2,  1.0, -1.0], [-2.4, -0.5,  0.2], [ 1.8,  0.3, -2.0],
  [-0.7,  1.3,  0.9], [ 2.6, -0.2, -1.5], [-3.0,  1.1,  0.4],
  [ 0.1,  1.8, -0.6], [-1.3, -1.7,  1.3], [ 3.4, -0.6,  0.8],
];
const SCAT_ROT: [number, number, number][] = [
  [ 0.08,  0.28, -0.04], [-0.06, -0.22,  0.07], [ 0.18,  0.12, -0.09],
  [-0.09,  0.24,  0.06], [ 0.04, -0.28, -0.07], [ 0.13,  0.18,  0.09],
  [-0.14,  0.10,  0.08], [ 0.07, -0.18,  0.12], [-0.05,  0.22, -0.10],
  [ 0.11, -0.08,  0.15], [-0.17,  0.14, -0.06], [ 0.09,  0.20,  0.05],
  [-0.08, -0.12,  0.18], [ 0.16,  0.06, -0.11], [-0.12,  0.24,  0.07],
  [ 0.05, -0.20, -0.13], [-0.10,  0.16,  0.14], [ 0.19, -0.08, -0.05],
  [-0.06,  0.26,  0.10], [ 0.12, -0.14,  0.08], [-0.15,  0.09, -0.12],
  [ 0.07,  0.22, -0.08], [-0.11, -0.18,  0.16], [ 0.14,  0.04, -0.19],
  [-0.08,  0.20,  0.06], [ 0.10, -0.24,  0.09], [-0.16,  0.12, -0.07],
  [ 0.06,  0.18,  0.13], [-0.09, -0.10,  0.20], [ 0.17, -0.06, -0.14],
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
  item:          ArchiveItem;
  index:         number;
  total:         number;
  progress:      number;
  carouselOff:   number;
  activeIdx:     number | null;
  hoverIdx:      number | null;
  focusIdx:      number | null;
  activeLangStr: string;
  onHover:       (i: number | null) => void;
  onClick:       (i: number) => void;
}

function ArchCard({ item, index, total, progress, carouselOff, activeIdx, hoverIdx, focusIdx, activeLangStr, onHover, onClick }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);

  // Initial texture: gradient fallback → primary cover image
  const texture = useMemo(() => {
    const fallback = makeGradientTexture(item);
    if (item.coverImage) {
      new THREE.TextureLoader().load(item.coverImage, (loaded) => {
        if (matRef.current) matRef.current.uniforms.uMap.value = loaded;
      });
    }
    return fallback;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.coverImage]);

  // Swap texture when language changes on the active card
  useEffect(() => {
    if (activeIdx !== index || !activeLangStr) return;
    const langCover = item.langData[activeLangStr]?.coverImage || item.coverImage;
    if (!langCover) return;
    new THREE.TextureLoader().load(langCover, (loaded) => {
      if (matRef.current) matRef.current.uniforms.uMap.value = loaded;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLangStr, activeIdx, index]);

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
      // En el carrusel, el reporte del centro va a color, adelante y un poco más grande;
      // sus vecinos se atenúan menos que el resto. Al entrar, las portadas quedan oscurecidas
      // para que el título se lea, y se aclaran al acomodarse.
      const isFocus = inCarousel && focusIdx === index;
      const dist    = focusIdx === null ? 99 : Math.abs(focusIdx - index);
      const floatY = Math.sin(t * 0.7 + index * 1.1) * 0.08 * (1 - progress);
      tx  = SCAT_POS[index][0] + (cx - SCAT_POS[index][0]) * progress;
      // En el carrusel las portadas suben un poco: así nunca tapan los datos de abajo.
      ty  = SCAT_POS[index][1] * (1 - progress) + floatY + CAROUSEL_LIFT * progress;
      tz  = SCAT_POS[index][2] * (1 - progress) + (isFocus ? 0.45 : 0);
      tRX = SCAT_ROT[index][0] * (1 - progress);
      tRY = SCAT_ROT[index][1] * (1 - progress);
      tRZ = SCAT_ROT[index][2] * (1 - progress);
      tScale = isFocus ? 1.12 : isHovered && inCarousel ? 1.05 : 1.0;
      tGray  = !inCarousel || isFocus || isHovered ? 0.0 : dist === 1 ? 0.55 : 0.85;
      tDim   = !inCarousel ? 0.42 + 0.5 * progress : isFocus || isHovered ? 1.0 : dist === 1 ? 0.78 : 0.55;
    } else if (isActive) {
      const mob = window.innerWidth < 768;
      tx = mob ? 0 : -0.8; ty = mob ? 1.0 : 0; tz = 1.2;
      tRX = 0; tRY = 0; tRZ = 0;
      tScale = mob ? 1.1 : 1.68;
      tGray  = 0.0;
      tDim   = 1.0;
    } else {
      const ai          = activeIdx as number;
      const isPeekLeft  = ai - 1 === index;
      // En escritorio el panel ocupa la derecha: la portada siguiente sale de la vista en lugar
      // de quedar (oscura) detrás del texto.
      const isPeekRight = ai + 1 === index && window.innerWidth < 768;
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
  items:         ArchiveItem[];
  progress:      number;
  carouselOff:   number;
  hoverIdx:      number | null;
  activeIdx:     number | null;
  focusIdx:      number | null;
  activeLangStr: string;
  mouseNY:       number;
  setHoverIdx:   (i: number | null) => void;
  onCardClick:   (i: number) => void;
}

function Scene({ items, progress, carouselOff, hoverIdx, activeIdx, focusIdx, activeLangStr, mouseNY, setHoverIdx, onCardClick }: SceneProps) {
  const { camera } = useThree();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // Inclinación leve con el cursor: más fuerte desplazaba el carrusel sobre los textos.
    cam.rotation.x += (mouseNY * -0.05 - cam.rotation.x) * 0.04;
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
          focusIdx={focusIdx}
          activeLangStr={activeLangStr}
          onHover={setHoverIdx}
          onClick={onCardClick}
        />
      ))}
    </>
  );
}

/* ─── Main component ──────────────────────────────────────── */
interface TheArchiveProps {
  visible:        boolean;
  onExpand?:      (active: boolean) => void;
  openReportId?:  string;
}

export default function TheArchive({ visible, onExpand, openReportId }: TheArchiveProps) {
  const locale = useLocale();
  const t = copy[locale].archive;
  const wrapRef        = useRef<HTMLDivElement>(null);
  const panelRef       = useRef<HTMLDivElement>(null);
  const progressRef    = useRef(0);
  const panelVisRef    = useRef(false);
  const touchStartRef  = useRef<{ x: number; y: number } | null>(null);
  const touchRawRef    = useRef(0);
  const activeIdxRef   = useRef<number | null>(null);  // always-current, no stale closure

  const [items,       setItems]       = useState<ArchiveItem[]>(DUMMY);
  const [loading,     setLoading]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [carouselOff, setCarouselOff] = useState(INIT_CAROUSEL_OFF);
  const [hoverIdx,    setHoverIdx]    = useState<number | null>(null);
  const [activeIdx,   setActiveIdx]   = useState<number | null>(null);
  const [mouseNY,     setMouseNY]     = useState(0);
  const [activeLang,  setActiveLang]  = useState(0);
  const [panelItem,   setPanelItem]   = useState<ArchiveItem | null>(null);
  const [readers,     setReaders]     = useState<Record<string, ReaderRef>>({});

  // Keep ref always current so event handlers see fresh value without re-registering
  activeIdxRef.current = activeIdx;

  const carouselHalf = useMemo(
    () => ((items.length - 1) / 2) * CAROUSEL_SPACING,
    [items.length]
  );

  /* Reporte al centro del carrusel (el que se abre con Enter y se describe abajo). */
  const total    = items.length;
  const focusIdx = progress > 0.85
    ? Math.max(0, Math.min(total - 1, Math.round((total - 1) / 2 - carouselOff / CAROUSEL_SPACING)))
    : null;
  const focusRef = useRef<number | null>(null);
  useEffect(() => { focusRef.current = focusIdx; }, [focusIdx]);

  /* Lleva el carrusel a un reporte con una transición suave y deja el scroll en sintonía. */
  const offTween = useRef<{ off: number }>({ off: INIT_CAROUSEL_OFF });
  const snapTimer = useRef<number | null>(null);
  const goTo = useCallback((i: number, instant = false) => {
    const n = items.length;
    if (!n) return;
    const idx    = Math.max(0, Math.min(n - 1, i));
    const half   = ((n - 1) / 2) * CAROUSEL_SPACING;
    const target = ((n - 1) / 2 - idx) * CAROUSEL_SPACING;
    progressRef.current = 1 + (half > 0 ? (1 - target / half) / 2 : 0);
    setProgress(1);
    gsap.killTweensOf(offTween.current);
    if (instant) { offTween.current.off = target; setCarouselOff(target); return; }
    setCarouselOff((cur) => { offTween.current.off = cur; return cur; });
    gsap.to(offTween.current, {
      off: target, duration: 0.55, ease: "power3.out",
      onUpdate: () => setCarouselOff(offTween.current.off),
    });
  }, [items.length]);

  /* Al dejar de desplazar, el carrusel se acomoda en el reporte más cercano. */
  const scheduleSnap = useCallback(() => {
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      if (progressRef.current >= 0.95 && activeIdxRef.current === null && focusRef.current !== null) goTo(focusRef.current);
    }, 160);
  }, [goTo]);
  useEffect(() => () => { if (snapTimer.current) window.clearTimeout(snapTimer.current); }, []);

  /* fetch reports + lectores 3D (registro en R2) */
  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    const readersReq: Promise<ReadersPayload> = fetch("/api/readers")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
    const reportsReq = fetch("/api/reports")
      .then((r) => r.json())
      .catch(() => null);
    Promise.all([reportsReq, readersReq])
      .then(([data, rd]) => {
        const rawArr: Record<string, unknown>[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.reports)
            ? data.reports
            : Array.isArray(data?.data)
              ? data.data
              : [];
        // Publicaciones que solo existen como lector: van primero y no se pueden descargar.
        const standalone = Array.isArray(rd?.standalone) ? rd.standalone : [];
        const extras = standalone.map((s, i) => standaloneItem(s, i));
        const map: Record<string, ReaderRef> = { ...(rd?.reports && typeof rd.reports === "object" ? rd.reports : {}) };
        for (const s of standalone) map[`${READER_ONLY}${s.slug}`] = { slug: s.slug, langs: s.langs };
        setReaders(map);
        if (rawArr.length > 0 || extras.length > 0) {
          const mapped = [...extras, ...rawArr.map((raw) => mapReport(raw, 0, locale))]
            .slice(0, SCAT_POS.length)
            .map((it, idx) => ({ ...it, id: idx, bg: BG_PALETTE[idx % BG_PALETTE.length] }));
          setItems(mapped);
          setCarouselOff(((mapped.length - 1) / 2) * CAROUSEL_SPACING);
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, locale]);

  /* auto-open card when arriving from /reportes/[id] */
  useEffect(() => {
    if (!openReportId || items === DUMMY) return;
    const idx = items.findIndex((it) => it.apiId === openReportId);
    if (idx === -1) return;
    // Snap carousel into position then open the card
    const targetOff = (idx - (items.length - 1) / 2) * CAROUSEL_SPACING * -1;
    progressRef.current = 1;
    setProgress(1);
    setCarouselOff(targetOff);
    setTimeout(() => { setActiveIdx(idx); setActiveLang(0); onExpand?.(true); }, 380);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openReportId, items]);

  /* mouse → camera tilt */
  useEffect(() => {
    // Solo con ratón: en pantallas táctiles los toques no deben inclinar la cámara.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const h = (e: MouseEvent) => setMouseNY((e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* wheel → scroll progress */
  useEffect(() => {
    if (!visible) return;
    const h = (e: WheelEvent) => {
      if (activeIdxRef.current !== null) return;
      e.preventDefault();
      gsap.killTweensOf(offTween.current);
      // Rueda vertical u horizontal (trackpad) avanzan igual.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      progressRef.current = Math.max(0, Math.min(2, progressRef.current + delta * 0.0014));
      const raw = progressRef.current;
      setProgress(Math.min(1, raw));
      const t = Math.max(0, Math.min(1, raw - 1));
      setCarouselOff(carouselHalf * (1 - 2 * t));
      scheduleSnap();
    };
    window.addEventListener("wheel", h, { passive: false });
    return () => window.removeEventListener("wheel", h);
  }, [visible, carouselHalf, scheduleSnap]);

  /* touch drag (mobile) */
  useEffect(() => {
    if (!visible) return;
    const onStart = (e: TouchEvent) => {
      if (activeIdxRef.current !== null) return;
      gsap.killTweensOf(offTween.current);
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchRawRef.current   = progressRef.current;
    };
    const onMove = (e: TouchEvent) => {
      if (!touchStartRef.current || activeIdxRef.current !== null) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      // Only hijack the event once movement is intentional (avoids blocking tap click synthesis)
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      e.preventDefault();
      const raw = touchRawRef.current;
      const newRaw = raw < 1.0
        ? Math.max(0, Math.min(2, raw - dy / (window.innerHeight * 0.45)))
        : Math.max(0, Math.min(2, raw - dx / (window.innerWidth * 0.55)));
      progressRef.current = newRaw;
      setProgress(Math.min(1, newRaw));
      const t = Math.max(0, Math.min(1, newRaw - 1));
      setCarouselOff(carouselHalf * (1 - 2 * t));
    };
    const onEnd = () => {
      if (touchStartRef.current) scheduleSnap();
      touchStartRef.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove",  onMove,  { passive: false });
    window.addEventListener("touchend",   onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove",  onMove);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [visible, carouselHalf, scheduleSnap]);

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

  /* Abrir / cerrar / cambiar de reporte en el panel */
  const openAt = useCallback((i: number) => {
    setActiveIdx(i); setActiveLang(0); onExpand?.(true);
  }, [onExpand]);
  const closePanel = useCallback(() => {
    const last = activeIdxRef.current;
    setActiveIdx(null); setActiveLang(0); onExpand?.(false);
    // Al cerrar, el carrusel queda en el reporte que se estaba viendo.
    if (last !== null) goTo(last, true);
  }, [onExpand, goTo]);
  const stepPanel = useCallback((d: number) => {
    const cur = activeIdxRef.current;
    if (cur === null) return;
    const next = cur + d;
    if (next < 0 || next >= items.length) return;
    setActiveIdx(next); setActiveLang(0);
  }, [items.length]);

  /* Teclado: ← → recorren, Enter abre, Esc cierra */
  useEffect(() => {
    if (!visible) return;
    const h = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const k = e.key;
      if (activeIdxRef.current !== null) {
        if (k === "Escape") closePanel();
        else if (k === "ArrowRight") stepPanel(1);
        else if (k === "ArrowLeft") stepPanel(-1);
        else return;
        e.preventDefault();
        return;
      }
      const f = focusRef.current;
      if (k === "ArrowRight" || k === "ArrowDown") goTo(f === null ? 0 : f + 1);
      else if (k === "ArrowLeft" || k === "ArrowUp") { if (f !== null) goTo(f - 1); else return; }
      else if (k === "Home") goTo(0);
      else if (k === "End") goTo(items.length - 1);
      else if (k === "Enter" && f !== null && !(el && el.closest("button, a"))) openAt(f);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible, goTo, openAt, closePanel, stepPanel, items.length]);

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
      // Durante la entrada, un clic acomoda el carrusel en esa portada.
      if (progress < 0.85) { goTo(i); return; }
      openAt(i);
    } else if (activeIdx === i) {
      closePanel();
    } else {
      setActiveIdx(i); setActiveLang(0);
    }
  }, [progress, activeIdx, goTo, openAt, closePanel]);

  // Abajo se describe el reporte bajo el cursor o, si no hay, el del centro.
  const infoIdx  = progress > 0.85 ? (hoverIdx ?? focusIdx) : null;
  const infoItem = infoIdx !== null ? items[infoIdx] : null;

  /* ── Derived panel content based on selected language ── */
  const activeLangStr  = panelItem?.languages[activeLang] ?? "";
  const activeLangData = panelItem?.langData[activeLangStr] ?? null;
  const panelTitle       = activeLangData?.title       ?? panelItem?.title       ?? "";
  const panelDate        = activeLangData?.date        ?? panelItem?.date        ?? "";
  const panelDescription = activeLangData?.description ?? panelItem?.description ?? "";
  const panelDownload    = activeLangData?.downloadUrl ?? panelItem?.downloadUrl ?? "#";
  const panelCover       = activeLangData?.coverImage  ?? panelItem?.coverImage  ?? "";
  const panelReader      = panelItem ? readers[panelItem.apiId] : undefined;

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
          focusIdx={focusIdx}
          activeLangStr={activeLangStr}
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
          <span className="archive-heading-the">{t.headingThe}</span>
          <span className="archive-heading-arc">{t.headingArchive}</span>
        </h2>
      </div>

      {/* Scroll hint */}
      <div className={`archive-scroll-hint${progress > 0.07 ? " archive-scroll-hint--gone" : ""}`}>
        <span>{t.scrollHint}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="4" x2="12" y2="20" /><polyline points="18 14 12 20 6 14" />
        </svg>
      </div>

      {/* Carrusel: flechas laterales */}
      {focusIdx !== null && activeIdx === null && (
        <>
          <button
            type="button"
            className="archive-arrow archive-arrow--prev"
            onClick={() => goTo(focusIdx - 1)}
            disabled={focusIdx === 0}
            aria-label={t.prev}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button
            type="button"
            className="archive-arrow archive-arrow--next"
            onClick={() => goTo(focusIdx + 1)}
            disabled={focusIdx === total - 1}
            aria-label={t.next}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      {/* Reporte del centro (o bajo el cursor): datos y acceso al detalle */}
      <div className={`archive-info-bar${infoItem && activeIdx === null ? " archive-info-bar--visible" : ""}`}>
        {infoItem && activeIdx === null && <>
          <div className="archive-info-meta">
            <span className="archive-info-count">
              {String((infoIdx ?? 0) + 1).padStart(2, "0")}<span> / {String(total).padStart(2, "0")}</span>
            </span>
            <span className="archive-info-dot" aria-hidden="true" />
            <BlurDate text={infoItem.date} className="archive-info-date" />
            {infoItem.languages.length ? (
              <span className="archive-info-langs">{infoItem.languages.join(" · ")}</span>
            ) : null}
            {readers[infoItem.apiId] ? <span className="archive-chip-3d">{t.badge3d}</span> : null}
          </div>
          {/* Cambio rápido (no letra por letra): al recorrer el carrusel el título siempre se lee. */}
          <BlurDate text={infoItem.title.length > 90 ? infoItem.title.slice(0, 87) + "…" : infoItem.title} className="archive-info-title" />
          <button type="button" className="archive-info-open" onClick={() => openAt(infoIdx ?? 0)} title={t.navHint}>
            {t.open}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </>}
      </div>
      <p className="sr-only" aria-live="polite">
        {focusIdx !== null && activeIdx === null ? t.focused(focusIdx + 1, total, items[focusIdx]?.title ?? "") : ""}
      </p>

      {/* Side panel */}
      {panelItem && (
        <div ref={panelRef} className="archive-panel" role="dialog" aria-label={panelTitle}>
          {total > 1 ? (
          <div className="archive-panel-bar">
            <button type="button" className="archive-panel-step" onClick={() => stepPanel(-1)} disabled={!activeIdx} aria-label={t.prev}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <span className="archive-panel-count">
              {String((activeIdx ?? 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button type="button" className="archive-panel-step" onClick={() => stepPanel(1)} disabled={activeIdx === total - 1} aria-label={t.next}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          ) : null}
          <button
            type="button"
            className="archive-panel-close"
            onClick={closePanel}
            aria-label={t.close}
            title={`${t.close} (Esc)`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Jerarquía: metadatos discretos (fecha + idiomas) → título → descripción → acciones. */}
          <div className="archive-detail-meta">
            <span className="archive-detail-date">{panelDate}</span>
            {panelItem.languages.length === 1 ? (
              <span className="archive-lang-static">{panelItem.languages[0]}</span>
            ) : panelItem.languages.length > 1 ? (
              <div className="archive-lang-tabs" role="group">
                {panelItem.languages.map((lang, li) => (
                  <button
                    key={lang}
                    type="button"
                    className={`archive-lang-btn${activeLang === li ? " archive-lang-btn--active" : ""}`}
                    aria-pressed={activeLang === li}
                    onClick={() => setActiveLang(li)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            ) : null}
            {panelReader ? <span className="archive-chip-3d">{t.badge3d}</span> : null}
          </div>
          <h3 className="archive-detail-title">{panelTitle}</h3>
          <p className="archive-detail-desc">{panelDescription}</p>

          <div className="archive-actions">
            {panelReader ? (
              <Link className="archive-read3d-btn" href={readerHref(locale, panelReader, activeLangStr)}>
                {t.read3d}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 6.5C10.3 5.2 7.9 4.5 4 4.5v13c3.9 0 6.3.7 8 2 1.7-1.3 4.1-2 8-2v-13c-3.9 0-6.3.7-8 2z" />
                <path d="M12 6.5v13" />
              </svg>
              </Link>
            ) : null}
            {panelItem.apiId.startsWith(READER_ONLY) ? null : (
            <button
              className="archive-download-btn"
              onClick={() => saveAs(panelItem.apiId, activeLangStr, panelTitle, panelDownload)}
              disabled={!panelDownload || panelDownload === "#"}
            >
              {t.saveAsPdf}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
