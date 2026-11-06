"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { Locale } from "@/i18n/config";
import { useLocale } from "./i18n";
import {
  IconClose,
  IconExternal,
  IconForward10,
  IconFullscreen,
  IconFullscreenExit,
  IconPauseFill,
  IconPlayFill,
  IconReplay10,
  IconVolume,
  IconVolumeOff,
} from "./icons";

/** Video que abre el reproductor: un archivo propio (MP4) o un video de YouTube. */
export type VideoSource =
  | { kind: "file"; src: string; poster?: string; title: string; meta?: string }
  | { kind: "youtube"; id: string; start?: number; title: string; meta?: string };

const L = {
  es: {
    close: "Cerrar video",
    play: "Reproducir",
    pause: "Pausar",
    back: "Retroceder 10 segundos",
    fwd: "Adelantar 10 segundos",
    mute: "Silenciar",
    unmute: "Activar sonido",
    volume: "Volumen",
    speed: "Velocidad de reproducción",
    normal: "Normal",
    full: "Pantalla completa",
    exitFull: "Salir de pantalla completa",
    seek: "Posición del video",
    of: "de",
    youtube: "Ver en YouTube",
    loading: "Cargando video",
    failed: "No se pudo cargar el reproductor.",
    controls: "Controles del video",
  },
  en: {
    close: "Close video",
    play: "Play",
    pause: "Pause",
    back: "Back 10 seconds",
    fwd: "Forward 10 seconds",
    mute: "Mute",
    unmute: "Unmute",
    volume: "Volume",
    speed: "Playback speed",
    normal: "Normal",
    full: "Full screen",
    exitFull: "Exit full screen",
    seek: "Video position",
    of: "of",
    youtube: "Watch on YouTube",
    loading: "Loading video",
    failed: "The player could not be loaded.",
    controls: "Video controls",
  },
} satisfies Record<Locale, Record<string, string>>;
type Strings = (typeof L)[Locale];

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const fmtTime = (s: number) => {
  const t = Number.isFinite(s) && s > 0 ? Math.floor(s) : 0;
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

type State = {
  playing: boolean;
  current: number;
  duration: number;
  buffered: number;
  muted: boolean;
  volume: number;
  rate: number;
  waiting: boolean;
};
const INITIAL: State = { playing: false, current: 0, duration: 0, buffered: 0, muted: false, volume: 1, rate: 1, waiting: true };

/** Lo que los controles pueden pedirle a cada motor (archivo o YouTube). */
type Api = {
  toggle(): void;
  seek(t: number): void;
  setMuted(m: boolean): void;
  setVolume(v: number): void;
  setRate(r: number): void;
  /** iOS no permite pantalla completa en un div: se usa la del propio video. */
  nativeFullscreen?(): void;
};
type EngineProps = { setState: (s: State) => void; apiRef: RefObject<Api | null> };

// ---------------------------------------------------------------------------
// Motor: archivo de video propio

function FileEngine({ src, poster, setState, apiRef }: EngineProps & { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const sync = () =>
      setState({
        playing: !v.paused && !v.ended,
        current: v.currentTime,
        duration: Number.isFinite(v.duration) ? v.duration : 0,
        buffered: v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0,
        muted: v.muted,
        volume: v.volume,
        rate: v.playbackRate,
        waiting: !v.paused && v.readyState < 3,
      });
    const events = ["play", "pause", "timeupdate", "durationchange", "progress", "volumechange", "ratechange", "waiting", "playing", "canplay", "ended", "loadedmetadata", "seeked"];
    for (const e of events) v.addEventListener(e, sync);
    apiRef.current = {
      toggle: () => (v.paused || v.ended ? void v.play().catch(sync) : v.pause()),
      seek: (t) => {
        v.currentTime = Math.max(0, Math.min(t, Number.isFinite(v.duration) ? v.duration : t));
      },
      setMuted: (m) => {
        v.muted = m;
        if (!m && v.volume === 0) v.volume = 0.6;
      },
      setVolume: (x) => {
        v.volume = x;
        v.muted = x === 0;
      },
      setRate: (r) => {
        v.playbackRate = r;
      },
      nativeFullscreen: () => (v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.(),
    };
    v.play().catch(sync);
    sync();
    return () => {
      for (const e of events) v.removeEventListener(e, sync);
      v.pause();
      apiRef.current = null;
    };
  }, [src, setState, apiRef]);

  return <video ref={ref} className="tk-vp-media" src={src} poster={poster} playsInline preload="auto" onClick={() => apiRef.current?.toggle()} />;
}

// ---------------------------------------------------------------------------
// Motor: YouTube (API de iframe, sin los controles de YouTube)

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(v: number): void;
  getVolume(): number;
  setPlaybackRate(r: number): void;
  getPlaybackRate(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  getPlayerState(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
};
type YTEvent = { target: YTPlayer };
type YTNamespace = { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer };
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };

let ytReady: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (!ytReady) {
    ytReady = new Promise((resolve, reject) => {
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        prev?.();
        if (w.YT) resolve(w.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.onerror = () => {
        ytReady = null;
        reject(new Error("YouTube API"));
      };
      document.head.appendChild(s);
    });
  }
  return ytReady;
}

function YouTubeEngine({ id, start, title, setState, apiRef, onError }: EngineProps & { id: string; start?: number; title: string; onError: () => void }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let ready = false;
    let timer = 0;
    let cancelled = false;
    const host = holder.current;
    const sync = () => {
      if (!player || !ready) return;
      const st = player.getPlayerState();
      const duration = player.getDuration() || 0;
      setState({
        // 1 = reproduciendo, 3 = cargando mientras reproduce.
        playing: st === 1 || st === 3,
        current: player.getCurrentTime() || 0,
        duration,
        buffered: duration * (player.getVideoLoadedFraction() || 0),
        muted: player.isMuted(),
        volume: player.getVolume() / 100,
        rate: player.getPlaybackRate() || 1,
        waiting: st === 3 || st === -1,
      });
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host) return;
        const el = document.createElement("div");
        host.appendChild(el);
        player = new YT.Player(el, {
          host: "https://www.youtube-nocookie.com",
          videoId: id,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            start: start ?? 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (e: YTEvent) => {
              ready = true;
              e.target.getIframe().title = title;
              e.target.playVideo();
              sync();
            },
            onStateChange: sync,
            onPlaybackRateChange: sync,
            onError,
          },
        });
        const p = player;
        apiRef.current = {
          toggle: () => {
            const st = p.getPlayerState();
            if (st === 1 || st === 3) p.pauseVideo();
            else p.playVideo();
          },
          seek: (t) => {
            p.seekTo(Math.max(0, t), true);
            sync();
          },
          setMuted: (m) => {
            if (m) p.mute();
            else {
              p.unMute();
              if (p.getVolume() === 0) p.setVolume(60);
            }
            window.setTimeout(sync, 60);
          },
          setVolume: (x) => {
            p.setVolume(Math.round(x * 100));
            if (x === 0) p.mute();
            else p.unMute();
            window.setTimeout(sync, 60);
          },
          setRate: (r) => p.setPlaybackRate(r),
        };
        timer = window.setInterval(sync, 250);
      })
      .catch(onError);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      player?.destroy();
      apiRef.current = null;
      host?.replaceChildren();
    };
  }, [id, start, title, setState, apiRef, onError]);

  return <div ref={holder} className="tk-vp-media tk-vp-yt" />;
}

// ---------------------------------------------------------------------------
// Controles (píldoras, al estilo de los reproductores de Google)

function Controls({
  state,
  api,
  l,
  full,
  onFullscreen,
  menu,
  setMenu,
  onSeek,
}: {
  state: State;
  api: RefObject<Api | null>;
  l: Strings;
  full: boolean;
  onFullscreen: () => void;
  menu: boolean;
  setMenu: (v: boolean) => void;
  onSeek: (t: number) => void;
}) {
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null);
  const rateBtn = useRef<HTMLButtonElement>(null);
  const d = state.duration;
  const pct = d ? Math.min(100, (state.current / d) * 100) : 0;
  const buf = d ? Math.min(100, (state.buffered / d) * 100) : 0;
  const vol = state.muted ? 0 : state.volume;

  return (
    <div className="tk-vp-controls" role="group" aria-label={l.controls}>
      <div
        className="tk-vp-progress"
        onPointerMove={(e) => {
          if (!d) return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(e.clientX - r.left, r.width));
          setHover({ x, t: (x / r.width) * d });
        }}
        onPointerLeave={() => setHover(null)}
      >
        <input
          type="range"
          className="tk-vp-seek"
          min={0}
          max={d || 0}
          step={0.1}
          value={Math.min(state.current, d || 0)}
          style={{ "--p": `${pct}%`, "--b": `${buf}%` } as CSSProperties}
          aria-label={l.seek}
          aria-valuetext={`${fmtTime(state.current)} ${l.of} ${fmtTime(d)}`}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        {hover ? (
          <span className="tk-vp-hovertime" style={{ left: hover.x }} aria-hidden="true">
            {fmtTime(hover.t)}
          </span>
        ) : null}
      </div>

      <div className="tk-vp-bar">
        <div className="tk-vp-group tk-vp-group--play">
          <button type="button" className="tk-vp-btn tk-vp-btn--play" aria-label={state.playing ? l.pause : l.play} onClick={() => api.current?.toggle()}>
            {state.playing ? <IconPauseFill /> : <IconPlayFill />}
          </button>
        </div>

        <div className="tk-vp-group">
          <button type="button" className="tk-vp-btn tk-vp-btn--skip" aria-label={l.back} onClick={() => onSeek(state.current - 10)}>
            <IconReplay10 />
          </button>
          <button type="button" className="tk-vp-btn tk-vp-btn--skip" aria-label={l.fwd} onClick={() => onSeek(state.current + 10)}>
            <IconForward10 />
          </button>
          <span className="tk-vp-time" aria-hidden="true">
            {fmtTime(state.current)}
            <span className="tk-vp-dur"> / {fmtTime(d)}</span>
          </span>
        </div>

        <span className="tk-vp-spacer" />

        <div className="tk-vp-group">
          <div className="tk-vp-vol">
            <button type="button" className="tk-vp-btn" aria-label={state.muted || vol === 0 ? l.unmute : l.mute} onClick={() => api.current?.setMuted(!(state.muted || vol === 0))}>
              {state.muted || vol === 0 ? <IconVolumeOff /> : <IconVolume />}
            </button>
            <input
              type="range"
              className="tk-vp-volume"
              min={0}
              max={1}
              step={0.05}
              value={vol}
              style={{ "--p": `${vol * 100}%` } as CSSProperties}
              aria-label={l.volume}
              aria-valuetext={`${Math.round(vol * 100)} %`}
              onChange={(e) => api.current?.setVolume(Number(e.target.value))}
            />
          </div>
          <div className="tk-vp-rate">
            <button ref={rateBtn} type="button" className="tk-vp-btn tk-vp-btn--text" aria-label={`${l.speed}: ${state.rate}x`} aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              {state.rate}x
            </button>
            {menu ? (
              <div className="tk-vp-menu" role="menu" aria-label={l.speed}>
                {RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="menuitemradio"
                    aria-checked={state.rate === r}
                    className="tk-vp-menu-item"
                    onClick={() => {
                      api.current?.setRate(r);
                      setMenu(false);
                      rateBtn.current?.focus();
                    }}
                  >
                    {r === 1 ? l.normal : `${r}x`}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button type="button" className="tk-vp-btn" aria-label={full ? l.exitFull : l.full} onClick={onFullscreen}>
            {full ? <IconFullscreenExit /> : <IconFullscreen />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reproductor completo (cabecera, escenario y controles)

function Player({ source, onClose }: { source: VideoSource; onClose: () => void }) {
  const l = L[useLocale()];
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const [state, setStateRaw] = useState<State>(INITIAL);
  const [menu, setMenu] = useState(false);
  const [full, setFull] = useState(false);
  const [idle, setIdle] = useState(false);
  const [failed, setFailed] = useState(false);
  const idleTimer = useRef(0);
  const yt = source.kind === "youtube";

  const setState = useCallback((s: State) => setStateRaw(s), []);
  const onError = useCallback(() => setFailed(true), []);

  // Los controles se ocultan tras unos segundos sin mover el cursor (solo encima del video propio).
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  }, []);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  // Cierra el menú de velocidad al tocar fuera de él.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest(".tk-vp-rate")) setMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  const seek = (t: number) => {
    const target = Math.max(0, state.duration ? Math.min(t, state.duration) : t);
    apiRef.current?.seek(target);
    setStateRaw((s) => ({ ...s, current: target }));
  };

  const toggleFullscreen = () => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (root.requestFullscreen) void root.requestFullscreen().catch(() => apiRef.current?.nativeFullscreen?.());
    else apiRef.current?.nativeFullscreen?.();
  };

  // Atajos de teclado en todo el documento mientras el video está abierto: el foco puede
  // quedar en el cuerpo de la página (por ejemplo, tras elegir una velocidad).
  const onKeyDown = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (e.key === "Escape" && menu) {
      // Primero cierra el menú; el siguiente Escape cierra el video.
      e.preventDefault();
      e.stopPropagation();
      setMenu(false);
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const onButton = t.tagName === "BUTTON" || t.tagName === "A";
    const onRange = t instanceof HTMLInputElement && t.type === "range";
    const k = e.key.toLowerCase();
    if ((k === " " && !onButton) || k === "k") {
      e.preventDefault();
      apiRef.current?.toggle();
    } else if ((k === "arrowleft" && !onRange) || k === "j") {
      e.preventDefault();
      seek(state.current - 10);
    } else if ((k === "arrowright" && !onRange) || k === "l") {
      e.preventDefault();
      seek(state.current + 10);
    } else if (k === "m") {
      apiRef.current?.setMuted(!state.muted);
    } else if (k === "f") {
      toggleFullscreen();
    } else return;
    wake();
  };
  const keyRef = useRef(onKeyDown);
  useEffect(() => {
    keyRef.current = onKeyDown;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyRef.current(e);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const youtubeUrl = source.kind === "youtube" ? `https://www.youtube.com/watch?v=${source.id}${source.start ? `&t=${source.start}s` : ""}` : null;
  const hideControls = !yt && idle && state.playing && !menu;

  return (
    <div className="tk-vp-wrap">
      <header className="tk-vp-head">
        <div className="tk-vp-head-text">
          <h2 id={titleId} className="tk-vp-title">
            {source.title}
          </h2>
          {source.meta || youtubeUrl ? (
            <p className="tk-vp-meta">
              {source.meta}
              {source.meta && youtubeUrl ? " · " : null}
              {youtubeUrl ? (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  {l.youtube}
                  <IconExternal />
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
        <button type="button" className="tk-vp-close" aria-label={l.close} onClick={onClose}>
          <IconClose />
        </button>
      </header>

      <div
        ref={rootRef}
        className={`tk-vp${yt ? " tk-vp--yt" : " tk-vp--file"}`}
        data-idle={hideControls || undefined}
        data-full={full || undefined}
        onPointerMove={yt ? undefined : wake}
        onFocusCapture={yt ? undefined : wake}
        aria-labelledby={titleId}
        role="region"
      >
        <div className="tk-vp-stage">
          {source.kind === "file" ? (
            <FileEngine src={source.src} poster={source.poster} setState={setState} apiRef={apiRef} />
          ) : failed ? (
            <p className="tk-vp-failed">
              {l.failed}{" "}
              <a href={youtubeUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                {l.youtube}
              </a>
            </p>
          ) : (
            <YouTubeEngine id={source.id} start={source.start} title={source.title} setState={setState} apiRef={apiRef} onError={onError} />
          )}
          {state.waiting && !failed ? <span className="tk-vp-spinner" role="status" aria-label={l.loading} /> : null}
        </div>
        {failed ? null : <Controls state={state} api={apiRef} l={l} full={full} onFullscreen={toggleFullscreen} menu={menu} setMenu={setMenu} onSeek={seek} />}
      </div>
    </div>
  );
}

/**
 * Ventana con el reproductor. En videos propios los controles van sobre la imagen y se
 * ocultan solos; en YouTube van justo debajo, porque sus reglas no permiten tapar el reproductor.
 */
export function VideoDialog({ source, onClose }: { source: VideoSource | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (source && !d.open) d.showModal();
    if (!source && d.open) d.close();
  }, [source]);

  const key = source ? (source.kind === "file" ? source.src : `${source.id}:${source.start ?? 0}`) : "";
  return (
    <dialog ref={ref} className="tk-vdialog" aria-label={source?.title} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {source ? <Player key={key} source={source} onClose={onClose} /> : null}
    </dialog>
  );
}
