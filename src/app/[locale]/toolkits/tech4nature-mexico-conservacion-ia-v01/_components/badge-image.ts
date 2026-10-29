"use client";

import { ACTIONS, IMAGES, TOOLKIT_VERSION } from "../data";

export type BadgeFormat = "wide" | "square";

const SIZES: Record<BadgeFormat, [number, number]> = { wide: [1200, 630], square: [1080, 1080] };

/** El logotipo de Tech4Nature es de un solo color; se tiñe antes de dibujarlo en el lienzo. */
async function loadLogo(color: string): Promise<HTMLImageElement> {
  const svg = await (await fetch(IMAGES.logo.src)).text();
  const url = URL.createObjectURL(new Blob([svg.replace(/#101511/gi, color)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function hexPattern(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  const r = 14;
  for (let y = 0; y < h + 24; y += 24) {
    for (let x = 0; x < w + 42; x += 42) {
      for (const [cx, cy] of [
        [x + 21, y + 12],
        [x, y],
      ]) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function medallion(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, font: string) {
  // Anillo holográfico
  const ring =
    "createConicGradient" in ctx
      ? ctx.createConicGradient(-Math.PI / 2, cx, cy)
      : (ctx as CanvasRenderingContext2D).createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  ["#e5ff0d", "#5ec1f3", "#b9a6ff", "#f2c46b", "#e5ff0d"].forEach((c, i, all) => ring.addColorStop(i / (all.length - 1), c));
  ctx.save();
  ctx.shadowColor = "rgba(203,232,107,0.55)";
  ctx.shadowBlur = 60;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();
  ctx.restore();

  const disc = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r);
  disc.addColorStop(0, "#f2ff8a");
  disc.addColorStop(0.55, "#cbe86b");
  disc.addColorStop(1, "#7f9431");
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
  ctx.fillStyle = disc;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(35,42,32,0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#1b2114";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 ${Math.round(r * 0.5)}px ${font}`;
  ctx.fillText(`${ACTIONS.length}/${ACTIONS.length}`, cx, cy + r * 0.12);
  ctx.font = `700 ${Math.round(r * 0.13)}px ${font}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
  ctx.fillText("ACCIONES", cx, cy + r * 0.36);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
}

/** Genera la imagen de la insignia para descargar o compartir. */
export async function renderBadge(format: BadgeFormat, name: string): Promise<Blob> {
  const [W, H] = SIZES[format];
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  const root = document.querySelector(".tk-root");
  const font = root ? getComputedStyle(root).fontFamily : "system-ui, sans-serif";
  await document.fonts?.ready;
  const logo = await loadLogo("#ffffff");

  // Fondo
  ctx.fillStyle = "#040314";
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, W * 0.7);
  glow.addColorStop(0, "rgba(203,232,107,0.22)");
  glow.addColorStop(1, "rgba(203,232,107,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W, H, 0, W, H, W * 0.6);
  glow2.addColorStop(0, "rgba(94,193,243,0.16)");
  glow2.addColorStop(1, "rgba(94,193,243,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);
  hexPattern(ctx, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(24, 24, W - 48, H - 48, 28);
  ctx.stroke();

  const date = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const recipient = name.trim() ? `Otorgada a ${name.trim()}` : `${ACTIONS.length} de ${ACTIONS.length} acciones revisadas`;
  const title = "Toolkit de conservación con inteligencia artificial en México";
  const eyebrow = "INSIGNIA DE FINALIZACIÓN";
  const meta = `Tech4Nature México · C Minds · ${date}`;

  if (format === "wide") {
    const lw = 200;
    ctx.drawImage(logo, 72, 62, lw, (lw * logo.naturalHeight) / logo.naturalWidth || lw * 0.67);
    ctx.fillStyle = "#cbe86b";
    ctx.font = `700 22px ${font}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
    ctx.fillText(eyebrow, 72, 262);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 50px ${font}`;
    wrap(ctx, title, 660)
      .slice(0, 3)
      .forEach((line, i) => ctx.fillText(line, 72, 322 + i * 58));
    ctx.font = `500 30px ${font}`;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(recipient, 72, 515);
    ctx.font = `500 21px ${font}`;
    ctx.fillStyle = "#8b929b";
    ctx.fillText(`${meta} · v${TOOLKIT_VERSION}`, 72, 562);
    medallion(ctx, 960, 315, 170, font);
  } else {
    const lw = 250;
    const lh = (lw * logo.naturalHeight) / logo.naturalWidth || lw * 0.67;
    ctx.drawImage(logo, (W - lw) / 2, 80, lw, lh);
    medallion(ctx, W / 2, 470, 190, font);
    ctx.textAlign = "center";
    ctx.fillStyle = "#cbe86b";
    ctx.font = `700 24px ${font}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "5px";
    ctx.fillText(eyebrow, W / 2, 745);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 46px ${font}`;
    wrap(ctx, title, 860)
      .slice(0, 2)
      .forEach((line, i) => ctx.fillText(line, W / 2, 808 + i * 56));
    ctx.font = `500 30px ${font}`;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(recipient, W / 2, 950);
    ctx.font = `500 21px ${font}`;
    ctx.fillStyle = "#8b929b";
    ctx.fillText(meta, W / 2, 1000);
    ctx.textAlign = "left";
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen"))), "image/png"),
  );
}
