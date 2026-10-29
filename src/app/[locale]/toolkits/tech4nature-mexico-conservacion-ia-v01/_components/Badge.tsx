"use client";

import { useEffect, useId, useState } from "react";
import { AwardBadge } from "@/components/ui/award-badge";
import { ACTIONS, IMAGES, actionSlug, toolkitHref } from "../data";
import { useToolkit } from "./ToolkitState";
import { PageLink } from "./RefLink";
import { renderBadge, type BadgeFormat } from "./badge-image";
import { CopyButton } from "./SmallIslands";
import { useClientValue } from "./useLocalStore";
import {
  IconArrowRight,
  IconDownload,
  IconFacebook,
  IconLinkedIn,
  IconLock,
  IconShare,
  IconWhatsApp,
  IconXSocial,
} from "./icons";

/** La insignia holográfica con el logotipo de Tech4Nature. */
export function T4NBadge({ width, locked = false }: { width?: number; locked?: boolean }) {
  return (
    <div className={locked ? "tk-badge tk-badge--locked" : "tk-badge"}>
      <AwardBadge
        width={width}
        eyebrow="TECH4NATURE MÉXICO · TOOLKIT"
        title={locked ? "Insignia bloqueada" : "Toolkit completado"}
        label={locked ? "Insignia del toolkit, bloqueada" : "Insignia: Toolkit Tech4Nature México completado"}
        background={["#eeff66", "#b9d65a"]}
        ink="#1b2114"
        stroke="rgba(27,33,20,0.35)"
        iconWidth={56}
        icon={<image href={IMAGES.logo.src} x={8} y={8} width={56} height={38} preserveAspectRatio="xMidYMid meet" />}
      />
      {locked ? (
        <span className="tk-badge-lock" aria-hidden="true">
          <IconLock />
        </span>
      ) : null}
    </div>
  );
}

const POST =
  "Completé las 12 acciones del Toolkit para iniciativas de conservación con inteligencia artificial en México, de Tech4Nature México y C Minds: monitoreo de biodiversidad, soberanía de datos y decisiones territoriales. #Tech4Nature #ConservaciónConIA #Biodiversidad";

/** Descarga y publicación de la insignia. */
export function BadgeShare() {
  const nameId = useId();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const origin = useClientValue(() => window.location.origin, "https://www.cminds.co");
  const canShareFiles = useClientValue(() => {
    try {
      return !!navigator.canShare?.({ files: [new File([""], "x.png", { type: "image/png" })] });
    } catch {
      return false;
    }
  }, false);
  const url = `${origin}${toolkitHref("es", "")}`;
  const text = `${POST} ${url}`;

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    try {
      await task();
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("No se pudo generar la imagen. Inténtalo de nuevo.");
    } finally {
      setBusy(null);
    }
  };

  const download = (format: BadgeFormat) =>
    run(format, async () => {
      const blob = await renderBadge(format, name);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `insignia-tech4nature-${format === "wide" ? "1200x630" : "1080x1080"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    });

  const share = () =>
    run("share", async () => {
      const blob = await renderBadge("square", name);
      const file = new File([blob], "insignia-tech4nature.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "Insignia Tech4Nature México", text });
    });

  const enc = encodeURIComponent;
  const networks = [
    { label: "LinkedIn", Icon: IconLinkedIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "X", Icon: IconXSocial, href: `https://twitter.com/intent/tweet?text=${enc(POST)}&url=${enc(url)}` },
    { label: "Facebook", Icon: IconFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "WhatsApp", Icon: IconWhatsApp, href: `https://wa.me/?text=${enc(text)}` },
  ];

  return (
    <div className="tk-share">
      <label className="tk-a11y-field" htmlFor={nameId}>
        <span>Tu nombre en la insignia (opcional)</span>
        <input
          id={nameId}
          className="tk-input"
          type="text"
          maxLength={48}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Ana López"
        />
      </label>

      <div className="tk-share-row">
        <button type="button" className="tk-cta" onClick={() => download("wide")} disabled={!!busy}>
          <IconDownload />
          {busy === "wide" ? "Generando…" : "Descargar 1200×630"}
        </button>
        <button type="button" className="tk-ghost" onClick={() => download("square")} disabled={!!busy}>
          <IconDownload />
          {busy === "square" ? "Generando…" : "Cuadrada 1080×1080"}
        </button>
        {canShareFiles ? (
          <button type="button" className="tk-ghost" onClick={share} disabled={!!busy}>
            <IconShare />
            {busy === "share" ? "Preparando…" : "Compartir"}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="tk-share-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="tk-share-hint">
        Publica en redes: descarga la imagen y adjúntala a tu publicación. La horizontal funciona en LinkedIn, X y
        Facebook; la cuadrada en Instagram.
      </p>
      <div className="tk-share-networks">
        {networks.map(({ label, Icon, href }) => (
          <a key={label} className="tk-social" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Compartir en ${label} (se abre en una pestaña nueva)`}>
            <Icon />
            {label}
          </a>
        ))}
      </div>

      <div className="tk-share-post">
        <p>{text}</p>
        <CopyButton text={text} label="Copiar texto" />
      </div>
    </div>
  );
}

/** Contenido de la página de insignia: bloqueada con el avance, o desbloqueada para descargar. */
export function BadgePanel() {
  const { complete, done, markCelebrated } = useToolkit();
  const pending = ACTIONS.filter((a) => !done.includes(a.id));

  useEffect(() => {
    if (complete) markCelebrated();
  }, [complete, markCelebrated]);

  if (!complete) {
    return (
      <div className="tk-badge-panel">
        <div className="tk-badge-stage">
          <T4NBadge locked />
        </div>
        <p className="tk-badge-status">
          <strong>
            {done.length} de {ACTIONS.length}
          </strong>{" "}
          acciones revisadas. Marca cada acción como revisada para desbloquear tu insignia.
        </p>
        <div className="tk-meter" role="progressbar" aria-valuemin={0} aria-valuemax={ACTIONS.length} aria-valuenow={done.length} aria-label="Acciones revisadas">
          <span style={{ width: `${(done.length / ACTIONS.length) * 100}%` }} />
        </div>
        <ul className="tk-pending">
          {pending.map((a) => (
            <li key={a.id}>
              <PageLink slug={actionSlug(a)} data-ref={a.code}>
                <span className="tk-side-code">{a.code}</span>
                {a.short}
                <IconArrowRight />
              </PageLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="tk-badge-panel">
      <div className="tk-badge-stage tk-badge-stage--unlocked">
        <T4NBadge />
      </div>
      <p className="tk-badge-status">
        <strong>¡Lo lograste!</strong> Revisaste las {ACTIONS.length} acciones del toolkit. Descarga tu insignia y compártela.
      </p>
      <BadgeShare />
    </div>
  );
}

