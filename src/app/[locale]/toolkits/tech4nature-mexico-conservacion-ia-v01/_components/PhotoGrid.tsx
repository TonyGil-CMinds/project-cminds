"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "../t4n";

/** Mosaico de fotos con visor a pantalla completa. */
export default function PhotoGrid({ photos, label, variant = "mosaic" }: { photos: GalleryPhoto[]; label: string; variant?: "mosaic" | "pair" | "trio" }) {
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
            <button type="button" onClick={() => setOpen(i)} aria-label={`Ampliar foto: ${ph.caption ?? ph.alt}`}>
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
            <button type="button" className="tk-lightbox-close" aria-label="Cerrar" onClick={() => setOpen(null)}>
              ×
            </button>
            {photos.length > 1 ? (
              <>
                <button type="button" className="tk-viewer-nav tk-viewer-nav--prev" aria-label="Foto anterior" onClick={() => setOpen(((open ?? 0) - 1 + photos.length) % photos.length)}>
                  ‹
                </button>
                <button type="button" className="tk-viewer-nav tk-viewer-nav--next" aria-label="Foto siguiente" onClick={() => setOpen(((open ?? 0) + 1) % photos.length)}>
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
