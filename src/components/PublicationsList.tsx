"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type PublicationPost = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  published_date: string;
  reading_time_minutes: number;
};

export type PublicationsStrings = {
  heading: string;
  count: (n: number) => string;
  soundOn: string;
  soundOff: string;
  read: string;
  minutes: (n: number) => string;
};

type Props = {
  posts: PublicationPost[];
  /** Fondo de la sección para cada artículo (se recorre en ciclo). */
  palette: string[];
  formatDate: (d: string) => string;
  href: (slug: string) => string;
  onOpen: (slug: string) => void;
  t: PublicationsStrings;
};

/** «Tic» corto con Web Audio (sin archivos). Apagado por defecto: solo suena si la persona lo activa. */
function useTick() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctxRef.current = new AC();
    return ctxRef.current;
  }, []);
  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1900, t);
    osc.frequency.exponentialRampToValueAtTime(1150, t + 0.03);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.07, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }, []);
  useEffect(() => () => { ctxRef.current?.close().catch(() => {}); }, []);
  return { ensure, tick };
}

/**
 * Lista de publicaciones: títulos grandes en columna; el que cruza el centro de la pantalla
 * queda resaltado, el fondo toma su color y a un lado se ve su portada (en móvil, dentro de la fila).
 */
export default function PublicationsList({ posts, palette, formatDate, href, onOpen, t }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [sound, setSound] = useState(false);
  const { ensure, tick } = useTick();
  const soundRef = useRef(false);
  useEffect(() => { soundRef.current = sound; }, [sound]);

  const activeRef = useRef(0);
  const select = useCallback((i: number) => {
    const cur = activeRef.current;
    if (cur === i) return;
    activeRef.current = i;
    setPrev(cur);
    setActive(i);
    if (soundRef.current) tick();
  }, [tick]);

  // El artículo activo es el que cruza el 55 % de la altura de la pantalla.
  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>(".pl-row", rootRef.current);
    rows.forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => { if (self.isActive) select(i); },
      });
    });
    ScrollTrigger.refresh();
  }, { scope: rootRef, dependencies: [posts.length, select] });

  const toggleSound = () => {
    const next = !sound;
    if (next) {
      const ctx = ensure();
      ctx?.resume().catch(() => {});
    }
    setSound(next);
  };

  if (!posts.length) return null;
  const current = posts[active] ?? posts[0];
  const previous = prev !== null ? posts[prev] : null;
  const bg = palette[active % palette.length];

  return (
    <section ref={rootRef} className="pl-section" style={{ backgroundColor: bg }} aria-labelledby="pl-heading">
      <header className="pl-head">
        <h2 id="pl-heading" className="pl-heading">
          {t.heading} <span className="pl-count">{t.count(posts.length)}</span>
        </h2>
        <button
          type="button"
          className="pl-sound"
          aria-pressed={sound}
          onClick={toggleSound}
          title={sound ? t.soundOff : t.soundOn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9h3l5-4v14l-5-4H4z" />
            {sound ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9l5 6M21 9l-5 6" />}
          </svg>
          <span>{sound ? t.soundOff : t.soundOn}</span>
        </button>
      </header>

      <div className="pl-body">
        <ol className="pl-list">
          {posts.map((post, i) => {
            const isActive = i === active;
            return (
              <li key={post.id} className={`pl-row${isActive ? " is-active" : ""}`}>
                <a
                  href={href(post.slug)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    onOpen(post.slug);
                  }}
                  onFocus={() => select(i)}
                  onMouseEnter={() => select(i)}
                >
                  <span className="pl-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pl-title">{post.title}</span>
                  <span className="pl-meta">
                    {post.reading_time_minutes ? <span className="pl-badge">{t.minutes(post.reading_time_minutes)}</span> : null}
                    <span className="pl-date">[{formatDate(post.published_date)}]</span>
                  </span>
                  {/* En móvil la portada aparece dentro de la fila activa. */}
                  {isActive && post.cover_image ? (
                    <span className="pl-thumb" aria-hidden="true">
                      <img src={post.cover_image} alt="" loading="lazy" decoding="async" />
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ol>

        {/* Vista previa (escritorio): la portada del artículo activo, con fundido entre artículos. */}
        <aside className="pl-preview" aria-hidden="true">
          <div className="pl-preview-card">
            {previous?.cover_image && previous.id !== current.id ? (
              <img key={`p-${previous.id}`} className="pl-preview-img" src={previous.cover_image} alt="" decoding="async" />
            ) : null}
            {current.cover_image ? (
              <img key={`c-${current.id}`} className="pl-preview-img pl-preview-img--in" src={current.cover_image} alt="" decoding="async" />
            ) : (
              <div className="pl-preview-empty" />
            )}
          </div>
          <div className="pl-preview-foot">
            <span>{formatDate(current.published_date)}</span>
            <a
              className="pl-preview-read"
              href={href(current.slug)}
              tabIndex={-1}
              onClick={(e) => { e.preventDefault(); onOpen(current.slug); }}
            >
              {t.read}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
