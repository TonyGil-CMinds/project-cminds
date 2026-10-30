"use client";

import { useEffect, useId, useState } from "react";
import { AwardBadge } from "@/components/ui/award-badge";
import type { Locale } from "@/i18n/config";
import { stageSlug, toolkitHref } from "../data";
import { useContent, useLocale } from "./i18n";
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

const L = {
  es: {
    eyebrow: "TECH4NATURE MÉXICO · TOOLKIT",
    lockedTitle: "Insignia bloqueada",
    doneTitle: "Toolkit completado",
    lockedLabel: "Insignia del toolkit, bloqueada",
    doneLabel: "Insignia: Toolkit Tech4Nature México completado",
    post: "Completé las cinco etapas del toolkit de replicabilidad de Tech4Nature México y C Minds: alineación de objetivos, co-diseño y despliegue, análisis con IA, observación del territorio, y decidir y sostener. #Tech4Nature #ConservaciónConIA #Biodiversidad",
    error: "No se pudo generar la imagen. Inténtalo de nuevo.",
    file: "insignia-tech4nature",
    shareTitle: "Insignia Tech4Nature México",
    nameLabel: "Tu nombre en la insignia (opcional)",
    namePh: "Ej. Ana López",
    generating: "Generando…",
    dlWide: "Descargar 1200×630",
    dlSquare: "Cuadrada 1080×1080",
    preparing: "Preparando…",
    share: "Compartir",
    hint: "Publica en redes: descarga la imagen y adjúntala a tu publicación. La horizontal funciona en LinkedIn, X y Facebook; la cuadrada en Instagram.",
    shareOn: (n: string) => `Compartir en ${n} (se abre en una pestaña nueva)`,
    copy: "Copiar texto",
    of: "de",
    pending: "etapas revisadas. Marca cada etapa como revisada para desbloquear tu insignia.",
    meter: "Etapas revisadas",
    stage: "Etapa",
    done: "¡Lo lograste!",
    doneText: (n: number) => ` Revisaste las ${n} etapas del toolkit. Descarga tu insignia y compártela.`,
  },
  en: {
    eyebrow: "TECH4NATURE MEXICO · TOOLKIT",
    lockedTitle: "Badge locked",
    doneTitle: "Toolkit completed",
    lockedLabel: "Toolkit badge, locked",
    doneLabel: "Badge: Tech4Nature Mexico toolkit completed",
    post: "I completed the five stages of the Tech4Nature Mexico replication toolkit by C Minds: goal alignment, co-design and deployment, AI analysis, observing the territory, and deciding and sustaining. #Tech4Nature #AIforConservation #Biodiversity",
    error: "We couldn't generate the image. Please try again.",
    file: "tech4nature-badge",
    shareTitle: "Tech4Nature Mexico badge",
    nameLabel: "Your name on the badge (optional)",
    namePh: "E.g. Ana López",
    generating: "Generating…",
    dlWide: "Download 1200×630",
    dlSquare: "Square 1080×1080",
    preparing: "Preparing…",
    share: "Share",
    hint: "Post it on social media: download the image and attach it to your post. The landscape version works on LinkedIn, X and Facebook; the square one on Instagram.",
    shareOn: (n: string) => `Share on ${n} (opens in a new tab)`,
    copy: "Copy text",
    of: "of",
    pending: "stages reviewed. Mark each stage as reviewed to unlock your badge.",
    meter: "Stages reviewed",
    stage: "Stage",
    done: "You did it!",
    doneText: (n: number) => ` You reviewed all ${n} stages of the toolkit. Download your badge and share it.`,
  },
} satisfies Record<Locale, Record<string, string | ((v: never) => string)>>;

/** La insignia holográfica con el logotipo de Tech4Nature. */
export function T4NBadge({ width, locked = false }: { width?: number; locked?: boolean }) {
  const l = L[useLocale()];
  const { IMAGES } = useContent();
  return (
    <div className={locked ? "tk-badge tk-badge--locked" : "tk-badge"}>
      <AwardBadge
        width={width}
        eyebrow={l.eyebrow}
        title={locked ? l.lockedTitle : l.doneTitle}
        label={locked ? l.lockedLabel : l.doneLabel}
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

/** Descarga y publicación de la insignia. */
export function BadgeShare() {
  const locale = useLocale();
  const l = L[locale];
  const POST = l.post;
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
  const url = `${origin}${toolkitHref(locale, "")}`;
  const text = `${POST} ${url}`;

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    try {
      await task();
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(l.error);
    } finally {
      setBusy(null);
    }
  };

  const download = (format: BadgeFormat) =>
    run(format, async () => {
      const blob = await renderBadge(format, name, locale);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${l.file}-${format === "wide" ? "1200x630" : "1080x1080"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    });

  const share = () =>
    run("share", async () => {
      const blob = await renderBadge("square", name, locale);
      const file = new File([blob], `${l.file}.png`, { type: "image/png" });
      await navigator.share({ files: [file], title: l.shareTitle, text });
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
        <span>{l.nameLabel}</span>
        <input
          id={nameId}
          className="tk-input"
          type="text"
          maxLength={48}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={l.namePh}
        />
      </label>

      <div className="tk-share-row">
        <button type="button" className="tk-cta" onClick={() => download("wide")} disabled={!!busy}>
          <IconDownload />
          {busy === "wide" ? l.generating : l.dlWide}
        </button>
        <button type="button" className="tk-ghost" onClick={() => download("square")} disabled={!!busy}>
          <IconDownload />
          {busy === "square" ? l.generating : l.dlSquare}
        </button>
        {canShareFiles ? (
          <button type="button" className="tk-ghost" onClick={share} disabled={!!busy}>
            <IconShare />
            {busy === "share" ? l.preparing : l.share}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="tk-share-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="tk-share-hint">{l.hint}</p>
      <div className="tk-share-networks">
        {networks.map(({ label, Icon, href }) => (
          <a key={label} className="tk-social" href={href} target="_blank" rel="noopener noreferrer" aria-label={l.shareOn(label)}>
            <Icon />
            {label}
          </a>
        ))}
      </div>

      <div className="tk-share-post">
        <p>{text}</p>
        <CopyButton text={text} label={l.copy} />
      </div>
    </div>
  );
}

/** Contenido de la página de insignia: bloqueada con el avance, o desbloqueada para descargar. */
export function BadgePanel() {
  const l = L[useLocale()];
  const { STAGES } = useContent();
  const { complete, done, markCelebrated } = useToolkit();
  const pending = STAGES.filter((s) => !done.includes(s.id));

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
            {done.length} {l.of} {STAGES.length}
          </strong>{" "}
          {l.pending}
        </p>
        <div className="tk-meter" role="progressbar" aria-valuemin={0} aria-valuemax={STAGES.length} aria-valuenow={done.length} aria-label={l.meter}>
          <span style={{ width: `${(done.length / STAGES.length) * 100}%` }} />
        </div>
        <ul className="tk-pending">
          {pending.map((a) => (
            <li key={a.id}>
              <PageLink slug={stageSlug(a)} data-ref={a.code}>
                <span className="tk-side-code">{a.code}</span>
                {l.stage} {a.n} · {a.short}
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
        <strong>{l.done}</strong>
        {l.doneText(STAGES.length)}
      </p>
      <BadgeShare />
    </div>
  );
}

