"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { GalleryPhoto } from "../t4n";
import { useLocale } from "./i18n";

const L = {
  es: { enlarge: "Ampliar foto", close: "Cerrar", prev: "Foto anterior", next: "Foto siguiente" },
  en: { enlarge: "Enlarge photo", close: "Close", prev: "Previous photo", next: "Next photo" },
} satisfies Record<Locale, Record<string, string>>;

/** Mosaico de fotos con visor a pantalla completa. */
export default function PhotoGrid({ photos, label, variant = "mosaic" }: { photos: GalleryPhoto[]; label: string; variant?: "mosaic" | "pair" | "trio" }) {
  const l = L[useLocale()];
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  const p = open !== null ? photos[open] : null;
  return (
    <>
      <ul className={`tk-photos tk-photos--${variant}`} aria-label={label}>
        {photos.map((ph, i) => (
          <li key={ph.src} data-reveal>
            <button type="button" onClick={() => setOpen(i)} aria-label={`${l.enlarge}: ${ph.caption ?? ph.alt}`}>
              <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" width={1500} height={1000} />
              {ph.caption ? <span className="tk-photos-cap">{ph.caption}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={ref} className="tk-lightbox" aria-label={label} onClose={() => setOpen(null)} onClick={(e) => e.target === ref.current && setOpen(null)}>
        {p ? (
          <figure>
            <img src={p.src} alt={p.alt} />
            <figcaption>
              {p.caption ?? p.alt}
              <span>
                {(open ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
            <button type="button" className="tk-lightbox-close" aria-label={l.close} onClick={() => setOpen(null)}>
              ×
            </button>
            {photos.length > 1 ? (
              <>
                <button type="button" className="tk-viewer-nav tk-viewer-nav--prev" aria-label={l.prev} onClick={() => setOpen(((open ?? 0) - 1 + photos.length) % photos.length)}>
                  ‹
                </button>
                <button type="button" className="tk-viewer-nav tk-viewer-nav--next" aria-label={l.next} onClick={() => setOpen(((open ?? 0) + 1) % photos.length)}>
                  ›
                </button>
              </>
            ) : null}
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
