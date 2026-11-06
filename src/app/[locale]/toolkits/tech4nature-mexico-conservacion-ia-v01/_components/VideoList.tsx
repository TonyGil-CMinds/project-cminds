"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Video } from "../t4n";
import { useLocale } from "./i18n";
import { IconPlayFill } from "./icons";
import { VideoDialog, type VideoSource } from "./VideoPlayer";

const L = {
  es: { play: "Reproducir" },
  en: { play: "Play" },
} satisfies Record<Locale, Record<string, string>>;

/** Miniatura de YouTube; en grande intenta la de alta resolución y, si no existe, usa la estándar. */
function YtThumb({ id, big }: { id: string; big?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const hq = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const [src, setSrc] = useState(big ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : hq);
  // YouTube responde con una imagen de 120 px cuando no hay versión de alta resolución.
  const check = (img: HTMLImageElement) => {
    if (img.src !== hq && (img.naturalWidth > 0 && img.naturalWidth < 200)) setSrc(hq);
  };
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) check(img);
  });
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      width={big ? 1280 : 480}
      height={big ? 720 : 360}
      onLoad={(e) => check(e.currentTarget)}
      onError={() => src !== hq && setSrc(hq)}
    />
  );
}

/** Botón circular de reproducir que va sobre las miniaturas. */
export function PlayBadge({ big }: { big?: boolean }) {
  return (
    <span className={`tk-vplay${big ? " tk-vplay--big" : ""}`} aria-hidden="true">
      <IconPlayFill />
    </span>
  );
}

/** Videos de YouTube: uno destacado y el resto en cuadrícula; se ven en el reproductor propio. */
export default function VideoList({ videos }: { videos: Video[] }) {
  const l = L[useLocale()];
  const [source, setSource] = useState<VideoSource | null>(null);
  const open = (v: Video) => setSource({ kind: "youtube", id: v.id, start: v.start, title: v.title, meta: v.channel });
  const [first, ...rest] = videos;
  if (!first) return null;

  return (
    <>
      <div className="tk-vlist">
        <button type="button" className="tk-vfeature" data-reveal onClick={() => open(first)} aria-label={`${l.play}: ${first.title}`}>
          <YtThumb id={first.id} big />
          <PlayBadge big />
          <span className="tk-vfeature-body">
            <span className="tk-vfeature-meta">{first.channel}</span>
            <span className="tk-vfeature-title">{first.title}</span>
          </span>
        </button>
        {rest.length ? (
          <ul className="tk-vgrid">
            {rest.map((v) => (
              <li key={v.id} data-reveal>
                <button type="button" className="tk-vcard" onClick={() => open(v)} aria-label={`${l.play}: ${v.title}`}>
                  <span className="tk-vthumb">
                    <YtThumb id={v.id} />
                    <PlayBadge />
                  </span>
                  <span className="tk-vcard-text">
                    <span className="tk-vcard-title">{v.title}</span>
                    <span className="tk-vcard-meta">{v.channel}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <VideoDialog source={source} onClose={() => setSource(null)} />
    </>
  );
}

/** Videos propios (archivos): tarjeta con póster que abre el reproductor. */
export function LocalVideos({ videos }: { videos: { src: string; poster: string; title: string; caption: string }[] }) {
  const l = L[useLocale()];
  const [source, setSource] = useState<VideoSource | null>(null);
  return (
    <>
      <ul className="tk-vgrid tk-vgrid--2">
        {videos.map((v) => (
          <li key={v.src} data-reveal>
            <button
              type="button"
              className="tk-vcard"
              aria-label={`${l.play}: ${v.title}`}
              onClick={() => setSource({ kind: "file", src: v.src, poster: v.poster, title: v.title, meta: v.caption })}
            >
              <span className="tk-vthumb">
                <img src={v.poster} alt="" loading="lazy" decoding="async" width={1280} height={720} />
                <PlayBadge />
              </span>
              <span className="tk-vcard-text">
                <span className="tk-vcard-title">{v.title}</span>
                <span className="tk-vcard-meta">{v.caption}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <VideoDialog source={source} onClose={() => setSource(null)} />
    </>
  );
}
