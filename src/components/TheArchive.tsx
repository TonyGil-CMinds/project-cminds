"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/* ─── Constants ───────────────────────────────────────────── */
const CW = 1.65;            // card width  (Three.js units)
const CH = CW * (4 / 3);   // card height (portrait 3:4)
const N  = 6;

/* ─── Types ───────────────────────────────────────────────── */
interface ArchiveItem {
  id:          number;
  title:       string;
  date:        string;
  description: string;
  languages:   string[];
  downloadUrl: string;
  bg:          [string, string];
  label:       string;
}

/* ─── Dummy data ──────────────────────────────────────────── */
const ITEMS: ArchiveItem[] = [
  { id: 0, title: "Reporte de Aprendizajes y Recomendaciones de Política Pública", date: "May 31, 2026", description: "Las recomendaciones de política pública se centran en tres áreas clave. Se sugiere fortalecer la seguridad y privacidad de los datos de las mujeres víctimas, implementando un esquema de portabilidad de datos.", languages: ["ES", "EN", "PT"], downloadUrl: "#", bg: ["#c026d3", "#6366f1"], label: "fAIr LAC\nJalisco" },
  { id: 1, title: "Tokens Digitales para la Acción Climática y Soluciones Basadas en la Naturaleza", date: "Mar 15, 2026", description: "Exploración de oportunidades y consideraciones para el uso de tokens digitales en iniciativas de acción climática y soluciones basadas en la naturaleza en América Latina.", languages: ["ES", "EN"], downloadUrl: "#", bg: ["#1e3a5f", "#0f172a"], label: "Tokens\nDigitales" },
  { id: 2, title: "Gobernanza de Datos y las Nuevas Tecnologías de Mejora de la Privacidad", date: "Jan 10, 2026", description: "Panorama global y retos para Latinoamérica y el Caribe sobre gobernanza de datos y las nuevas tecnologías de mejora de la privacidad.", languages: ["ES"], downloadUrl: "#", bg: ["#0f1e3d", "#172554"], label: "Gobernanza\nde Datos" },
  { id: 3, title: "A Ética en IA para América Latina", date: "Oct 22, 2025", description: "Análisis de los marcos éticos para la inteligencia artificial en el contexto latinoamericano y sus implicaciones para el desarrollo sostenible e inclusivo.", languages: ["ES", "PT"], downloadUrl: "#", bg: ["#111827", "#1f2937"], label: "A Ética\nen IA" },
  { id: 4, title: "León Innovando para el Futuro del Trabajo — LIFT", date: "Sep 5, 2025", description: "Impulso y fortalecimiento a la inserción laboral de las juventudes en León, México mediante innovación tecnológica y programas de formación.", languages: ["ES"], downloadUrl: "#", bg: ["#0c1a2e", "#1a3a5c"], label: "LIFT\nLeón" },
  { id: 5, title: "impactIA para la Recuperación Económica Sostenible e Inclusiva de México", date: "Jul 18, 2025", description: "IA para la recuperación económica sostenible e inclusiva de México, con enfoque en tecnologías de inteligencia artificial para el desarrollo social.", languages: ["ES", "EN"], downloadUrl: "#", bg: ["#1a1a2e", "#0f0f1e"], label: "impactIA\nMéxico" },
];

/* ─── Scatter layout (orbit phase) ───────────────────────── */
const SCAT_POS: [number, number, number][] = [
  [-3.8,  0.9, -1.2],
  [-2.1, -0.8,  0.6],
  [-0.5,  1.6, -2.1],
  [ 0.9, -0.4, -0.7],
  [ 2.8,  0.7,  0.3],
  [ 3.6, -1.2, -1.8],
];

const SCAT_ROT: [number, number, number][] = [
  [ 0.08,  0.28, -0.04],
  [-0.06, -0.22,  0.07],
  [ 0.18,  0.12, -0.09],
  [-0.09,  0.24,  0.06],
  [ 0.04, -0.28, -0.07],
  [ 0.13,  0.18,  0.09],
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

/* ─── Canvas texture factory ──────────────────────────────── */
function makeTexture(item: ArchiveItem): THREE.CanvasTexture {
  const W = 300, H = 400;
  const cv  = document.createElement("canvas");
  cv.width  = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, item.bg[0]);
  g.addColorStop(1, item.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // thin top border
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 0, W, 1);

  // label lines
  ctx.fillStyle  = "rgba(255,255,255,0.90)";
  ctx.font       = "bold 24px sans-serif";
  ctx.textAlign  = "center";
  ctx.textBaseline = "middle";
  const lines = item.label.split("\n");
  const lh = 34;
  const sy = H / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, sy + i * lh));

  // footer
  ctx.fillStyle   = "rgba(255,255,255,0.22)";
  ctx.font        = "11px sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("C MINDS", W / 2, H - 16);

  return new THREE.CanvasTexture(cv);
}

/* ─── Card mesh ───────────────────────────────────────────── */
interface CardProps {
  item:      ArchiveItem;
  index:     number;
  progress:  number;
  activeIdx: number | null;
  hoverIdx:  number | null;
  onHover:   (i: number | null) => void;
  onClick:   (i: number) => void;
}

function ArchCard({ item, index, progress, activeIdx, hoverIdx, onHover, onClick }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);

  const texture  = useMemo(() => makeTexture(item), [item]);
  const uniforms = useMemo(() => ({
    uMap:  { value: texture },
    uGray: { value: 0.0 },
    uDim:  { value: 1.0 },
  }), [texture]);

  // carousel x position
  const cx = (index - (N - 1) / 2) * 2.55;

  useFrame((state) => {
    const m   = meshRef.current;
    const mat = matRef.current;
    if (!m || !mat) return;

    const t = state.clock.elapsedTime;
    const isHovered = hoverIdx  === index;
    const inCarousel = progress > 0.85;

    // ── position lerp ──
    const floatY = Math.sin(t * 0.7 + index * 1.1) * 0.08 * (1 - progress);
    const tx = SCAT_POS[index][0] + (cx - SCAT_POS[index][0]) * progress;
    const ty = SCAT_POS[index][1] * (1 - progress) + floatY;
    const tz = SCAT_POS[index][2] * (1 - progress);
    m.position.x += (tx - m.position.x) * 0.1;
    m.position.y += (ty - m.position.y) * 0.1;
    m.position.z += (tz - m.position.z) * 0.1;

    // ── rotation lerp ──
    m.rotation.x += (SCAT_ROT[index][0] * (1 - progress) - m.rotation.x) * 0.1;
    m.rotation.y += (SCAT_ROT[index][1] * (1 - progress) - m.rotation.y) * 0.1;
    m.rotation.z += (SCAT_ROT[index][2] * (1 - progress) - m.rotation.z) * 0.1;

    // ── scale ──
    const tScale = (!inCarousel || isHovered) ? 1.0 : 1.0;
    const hoverScale = (isHovered && inCarousel) ? 1.06 : tScale;
    m.scale.x += (hoverScale - m.scale.x) * 0.1;
    m.scale.y += (hoverScale - m.scale.y) * 0.1;

    // ── grayscale: all gray in carousel, color on hover ──
    const tGray = (inCarousel && !isHovered) ? 0.88 : 0.0;
    mat.uniforms.uGray.value += (tGray - mat.uniforms.uGray.value) * 0.08;

    // ── dim when another card is expanded (handled by detail overlay for now) ──
    const tDim = 1.0;
    mat.uniforms.uDim.value += (tDim - mat.uniforms.uDim.value) * 0.08;
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
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT_SH}
        fragmentShader={FRAG_SH}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/* ─── Scene wrapper (camera tilt) ────────────────────────── */
interface SceneProps {
  progress:    number;
  hoverIdx:    number | null;
  activeIdx:   number | null;
  mouseNY:     number;
  setHoverIdx: (i: number | null) => void;
  onCardClick: (i: number) => void;
}

function Scene({ progress, hoverIdx, activeIdx, mouseNY, setHoverIdx, onCardClick }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const targetX = mouseNY * -0.2;
    cam.rotation.x += (targetX - cam.rotation.x) * 0.04;
  });

  return (
    <>
      {ITEMS.map((item, i) => (
        <ArchCard
          key={item.id}
          item={item}
          index={i}
          progress={progress}
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
  visible: boolean;
}

export default function TheArchive({ visible }: TheArchiveProps) {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const progressRef  = useRef(0);

  const [progress,   setProgress]   = useState(0);
  const [hoverIdx,   setHoverIdx]   = useState<number | null>(null);
  const [activeIdx,  setActiveIdx]  = useState<number | null>(null);
  const [mouseNY,    setMouseNY]    = useState(0);
  const [activeLang, setActiveLang] = useState(0);

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
      progressRef.current = Math.max(0, Math.min(1, progressRef.current + e.deltaY * 0.0014));
      setProgress(progressRef.current);
    };
    window.addEventListener("wheel", h, { passive: false });
    return () => window.removeEventListener("wheel", h);
  }, [visible, activeIdx]);

  /* entry / exit */
  useEffect(() => {
    if (!wrapRef.current) return;
    if (visible) {
      gsap.fromTo(wrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    } else {
      progressRef.current = 0;
      setProgress(0);
      setActiveIdx(null);
      setHoverIdx(null);
    }
  }, [visible]);

  const handleCardClick = useCallback((i: number) => {
    if (progress < 0.85) return;
    setActiveIdx(prev => {
      if (prev === i) return null;
      setActiveLang(0);
      return i;
    });
  }, [progress]);

  const activeItem = activeIdx !== null ? ITEMS[activeIdx] : null;
  const hoverItem  = hoverIdx  !== null ? ITEMS[hoverIdx]  : null;
  const infoItem   = activeItem ?? (progress > 0.85 ? hoverItem : null);

  if (!visible) return null;

  return (
    <div ref={wrapRef} className="archive-wrap">

      {/* Three.js canvas */}
      <Canvas
        camera={{ fov: 55, position: [0, 0, 8], near: 0.1, far: 50 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        className="archive-canvas"
      >
        <Scene
          progress={progress}
          hoverIdx={hoverIdx}
          activeIdx={activeIdx}
          mouseNY={mouseNY}
          setHoverIdx={setHoverIdx}
          onCardClick={handleCardClick}
        />
      </Canvas>

      {/* ── Title ── */}
      <div className={`archive-title-wrap${progress > 0.12 ? " archive-title-wrap--up" : ""}`}>
        <h2 className="archive-heading">
          <span className="archive-heading-the">The </span>
          <span className="archive-heading-arc">Archive</span>
        </h2>
      </div>

      {/* ── Scroll hint ── */}
      <div className={`archive-scroll-hint${progress > 0.07 ? " archive-scroll-hint--gone" : ""}`}>
        <span>Scroll to arrange</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="4" x2="12" y2="20" />
          <polyline points="18 14 12 20 6 14" />
        </svg>
      </div>

      {/* ── Card info bar (date + title above dock) ── */}
      <div className={`archive-info-bar${infoItem ? " archive-info-bar--visible" : ""}`}>
        {infoItem && <>
          <span className="archive-info-date">{infoItem.date}</span>
          <span className="archive-info-title">{infoItem.title}</span>
        </>}
      </div>

      {/* ── Expanded detail view ── */}
      {activeItem && (
        <div className="archive-detail" onClick={() => setActiveIdx(null)}>
          <div className="archive-detail-inner" onClick={(e) => e.stopPropagation()}>

            {/* close */}
            <button className="archive-detail-close" onClick={() => setActiveIdx(null)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* card cover */}
            <div
              className="archive-detail-cover"
              style={{ background: `linear-gradient(145deg, ${activeItem.bg[0]}, ${activeItem.bg[1]})` }}
            >
              <div className="archive-detail-cover-inner">
                {activeItem.label.split("\n").map((l, i) => (
                  <span key={i} className="archive-cover-line">{l}</span>
                ))}
              </div>
              <span className="archive-cover-footer">C MINDS</span>
            </div>

            {/* info */}
            <div className="archive-detail-info">
              <div className="archive-lang-tabs">
                {activeItem.languages.map((lang, li) => (
                  <button
                    key={lang}
                    className={`archive-lang-btn${activeLang === li ? " archive-lang-btn--active" : ""}`}
                    onClick={() => setActiveLang(li)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <p className="archive-detail-date">{activeItem.date}</p>
              <h3 className="archive-detail-title">{activeItem.title}</h3>
              <p className="archive-detail-desc">{activeItem.description}</p>
              <a
                className="archive-download-btn"
                href={activeItem.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
