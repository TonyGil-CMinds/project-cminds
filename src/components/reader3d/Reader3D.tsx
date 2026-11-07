"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import { createReaderEngine } from "./engine";
import { READER_STRINGS } from "./strings";
import type { ReaderManifest } from "./types";
import "./reader3d.css";

export type Reader3DProps = {
  manifest: ReaderManifest;
  locale: Locale;
  /** A dónde lleva el botón de volver (p. ej. el Archive). */
  backHref: string;
  /** Descarga del PDF original (ruta de /api/download o URL directa). Sin ella no se muestra el botón. */
  downloadHref?: string;
  /** Nombre sugerido para el archivo descargado. */
  downloadName?: string;
};

/**
 * Lector 3D de publicaciones: libro con páginas que se pasan a mano, zoom a pasajes y fotos,
 * texto accesible y sonido. El marcado es estático; el motor (engine.ts) lo controla.
 */
export default function Reader3D({ manifest, locale, backHref, downloadHref, downloadName }: Reader3DProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const s = READER_STRINGS[locale];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    html.classList.add("r3d-lock");
    const engine = createReaderEngine({ root, manifest, strings: READER_STRINGS[locale] });
    return () => {
      engine.destroy();
      html.classList.remove("r3d-lock");
    };
  }, [manifest, locale]);

  return (
    <div ref={rootRef} className="r3d" lang={manifest.lang}>
      <canvas data-r="stage" className="r3d-stage" tabIndex={-1} role="img" aria-label={`${manifest.title}. ${s.canvas}`} />

      <header className="r3d-topbar">
        <div className="r3d-brand">
          <Link className="r3d-back" href={backHref} aria-label={s.back} title={s.back}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <span className="r3d-brand-text">
            <b>{manifest.title}</b>
            {manifest.kicker ? <span>{manifest.kicker}</span> : null}
          </span>
        </div>
        <div className="r3d-chip">
          <p data-r="chip" />
        </div>
        <div className="r3d-tools" role="toolbar" aria-label={s.tools}>
          <button className="r3d-ib" data-r="bText" type="button" aria-pressed="false" aria-label={s.text} title={s.textTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 11h16M4 16h10" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="bSound" type="button" aria-pressed="false" aria-label={s.sound} title={s.soundTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9h3l5-4v14l-5-4H4z" />
              <path className="w" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="bFull" type="button" aria-label={s.full} title={s.fullTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="bHelp" type="button" aria-label={s.help} title={s.helpTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 17h.01" />
            </svg>
          </button>
          {downloadHref ? (
            <a className="r3d-download" href={downloadHref} download={downloadName} aria-label={s.downloadAria} title={s.downloadAria}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
              </svg>
              <span className="r3d-download-label">{s.download}</span>
            </a>
          ) : null}
        </div>
      </header>

      <div data-r="hotspots" className="r3d-hotspots off" aria-label={s.hotspots} />

      <aside className="r3d-panel r3d-card" data-r="card" hidden aria-labelledby="r3d-card-title">
        <p className="count" data-r="cardCount" />
        <h2 id="r3d-card-title" data-r="cardTitle" tabIndex={-1} />
        <p className="cnote" data-r="cardNote" hidden>
          {s.photoNote}
        </p>
        <p className="body" data-r="cardText" />
        <div className="r3d-row">
          <button className="r3d-btn" data-r="cardPrev" type="button" aria-label={s.detailPrev}>
            {s.prevShort}
          </button>
          <button className="r3d-btn" data-r="cardNext" type="button" aria-label={s.detailNext}>
            {s.nextShort}
          </button>
          <span className="r3d-spacer" />
          <button className="r3d-btn primary" data-r="cardClose" type="button">
            {s.backShort}
          </button>
        </div>
      </aside>

      <aside className="r3d-panel r3d-text" data-r="textPanel" hidden aria-labelledby="r3d-tp-title">
        <div className="r3d-tp-head">
          <h2 id="r3d-tp-title" data-r="tpTitle" tabIndex={-1}>
            {s.pageText}
          </h2>
          <button className="r3d-ib" data-r="tpSmaller" type="button" aria-label={s.smaller}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 12h12" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="tpBigger" type="button" aria-label={s.bigger}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 12h12M12 6v12" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="tpClose" type="button" aria-label={s.closeText}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="r3d-tp-body" data-r="tpBody" lang={manifest.lang} />
      </aside>

      <aside className="r3d-panel r3d-help" data-r="help" hidden aria-labelledby="r3d-help-title">
        <h2 id="r3d-help-title" data-r="helpTitle" tabIndex={-1}>
          {s.howTo}
        </h2>
        <dl>
          <dt>{s.helpDrag}</dt>
          <dd>{s.helpDragText}</dd>
          <dt>
            <kbd>←</kbd> <kbd>→</kbd>
          </dt>
          <dd>{s.helpArrows}</dd>
          <dt>
            <kbd>Home</kbd> <kbd>End</kbd>
          </dt>
          <dd>{s.helpHomeEnd}</dd>
          <dt>
            <kbd>+</kbd> <kbd>−</kbd> <kbd>0</kbd>
          </dt>
          <dd>{s.helpZoom}</dd>
          <dt>{s.helpDots}</dt>
          <dd>{s.helpDotsText}</dd>
          <dt>
            <kbd>T</kbd> <kbd>M</kbd> <kbd>Esc</kbd>
          </dt>
          <dd>{s.helpKeys}</dd>
        </dl>
        <div className="r3d-row">
          <span className="r3d-spacer" />
          <button className="r3d-btn primary" data-r="helpClose" type="button">
            {s.gotIt}
          </button>
        </div>
      </aside>

      <nav className="r3d-dock" aria-label={s.nav}>
        <button className="r3d-ib" data-r="bFirst" type="button" aria-label={s.first} title={s.firstTitle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5v14M18 6l-7 6 7 6" />
          </svg>
        </button>
        <button className="r3d-ib" data-r="bPrev" type="button" aria-label={s.prev} title={s.prevTitle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="r3d-thumbs" data-r="thumbs" role="group" aria-label={s.spreads} />
        {/* El motor escribe el contador y el zoom; React no los toca después de montar. */}
        <span className="r3d-counter" data-r="counter" aria-hidden="true" />
        <button className="r3d-ib" data-r="bNext" type="button" aria-label={s.next} title={s.nextTitle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="r3d-ib" data-r="bLast" type="button" aria-label={s.last} title={s.lastTitle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 5v14M6 6l7 6-7 6" />
          </svg>
        </button>
        <span className="r3d-sep z" />
        <span className="r3d-zoomgrp">
          <button className="r3d-ib" data-r="bZoomOut" type="button" aria-label={s.zoomOut} title={s.zoomOutTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M8 11h6M16 16l4 4" />
            </svg>
          </button>
          <span className="r3d-zoom-label" data-r="zoomLabel" aria-live="off" />
          <button className="r3d-ib" data-r="bZoomIn" type="button" aria-label={s.zoomIn} title={s.zoomInTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M8 11h6M11 8v6M16 16l4 4" />
            </svg>
          </button>
          <button className="r3d-ib" data-r="bZoomReset" type="button" aria-label={s.zoomReset} title={s.zoomResetTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
            </svg>
          </button>
        </span>
      </nav>

      <div className="r3d-hint" data-r="hint" role="status" />
      <div className="sr-only" data-r="live" aria-live="polite" />

      <div className="r3d-intro" data-r="intro">
        <div>
          {manifest.kicker ? <p className="kick">{manifest.kicker}</p> : null}
          <h1 lang={manifest.lang}>{manifest.title}</h1>
          {manifest.subtitle ? (
            <p className="sub" lang={manifest.lang}>
              {manifest.subtitle}
            </p>
          ) : null}
          <div className="r3d-prog" aria-hidden="true">
            <i data-r="progBar" />
          </div>
          <p className="r3d-status" data-r="status" role="status">
            {s.preparing}
          </p>
          <div className="r3d-row" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            <button className="r3d-btn primary" data-r="bOpen" type="button" disabled>
              {s.open}
            </button>
            <button className="r3d-btn" data-r="bOpenMute" type="button" disabled>
              {s.openMute}
            </button>
          </div>
          <p className="note">{s.introNote}</p>
        </div>
      </div>
    </div>
  );
}
