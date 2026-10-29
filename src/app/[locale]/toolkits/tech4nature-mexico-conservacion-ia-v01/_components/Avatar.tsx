"use client";

import { useEffect, useRef, useState } from "react";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** Foto de una persona del equipo; si no hay foto o no carga, muestra sus iniciales. */
export default function Avatar({ name, photo, size = 72 }: { name: string; photo?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // La imagen pudo fallar antes de que React conectara onError.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <span className="tk-avatar" style={{ width: size, height: size }} aria-hidden="true">
      {photo && !failed ? (
        <img ref={ref} src={encodeURI(photo)} alt="" width={size} height={size} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className="tk-avatar-initials">{initials(name)}</span>
      )}
    </span>
  );
}
