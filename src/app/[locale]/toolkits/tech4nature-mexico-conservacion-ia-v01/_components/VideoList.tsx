"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Video } from "../t4n";
import { useLocale } from "./i18n";

const L = {
  es: { play: "Reproducir", watch: "Ver en YouTube" },
  en: { play: "Play", watch: "Watch on YouTube" },
} satisfies Record<Locale, Record<string, string>>;

/** Videos de YouTube: miniatura primero; el reproductor se carga al hacer clic. */
export default function VideoList({ videos }: { videos: Video[] }) {
  const l = L[useLocale()];
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <ul className="tk-videos">
      {videos.map((v) => (
        <li key={v.id} className="tk-video" data-reveal>
          <div className="tk-video-frame">
            {playing === v.id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0${v.start ? `&start=${v.start}` : ""}`}
                title={v.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(v.id)} aria-label={`${l.play}: ${v.title}`}>
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} />
                <span className="tk-video-play" aria-hidden="true">▶</span>
              </button>
            )}
          </div>
          <p className="tk-video-title">{v.title}</p>
          <p className="tk-video-meta">
            {v.channel} ·{" "}
            <a href={`https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ""}`} target="_blank" rel="noopener noreferrer">
              {l.watch}
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}
