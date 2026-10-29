"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, RESOURCES, STAGES, TEMPLATES } from "../data";

type Preview = { code: string; title: string; meta: string; text: string };

const CATEGORY_LABEL = new Map<string, string>(CATEGORIES.map((c) => [c.id, c.label]));

const PREVIEWS = new Map<string, Preview>([
  ...RESOURCES.map((r): [string, Preview] => [
    r.code,
    {
      code: r.code,
      title: r.title,
      meta: [CATEGORY_LABEL.get(r.category), r.lang, r.level].filter(Boolean).join(" · "),
      text: r.use,
    },
  ]),
  ...TEMPLATES.map((t): [string, Preview] => [
    t.code,
    {
      code: t.code,
      title: `Plantilla ${t.n}. ${t.title}`,
      meta: "Plantilla descargable",
      text: t.fields.map((f) => f.label).join(" · "),
    },
  ]),
  ...STAGES.map((s): [string, Preview] => [
    s.code,
    { code: s.code, title: `Etapa ${s.n}. ${s.title}`, meta: s.question, text: `Al terminar tendrás: ${s.result}.` },
  ]),
]);

/** Tarjeta flotante con el contenido de una referencia (E1, P1, R01) al pasar el cursor o enfocarla. */
export default function RefPreview() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean }>({ top: 0, left: 0, above: false });
  const timer = useRef(0);

  useEffect(() => {
    const show = (el: HTMLElement) => {
      const data = PREVIEWS.get(el.dataset.ref ?? "");
      if (!data) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        const width = Math.min(340, window.innerWidth - 24);
        const above = r.bottom + 190 > window.innerHeight;
        setPos({
          top: above ? r.top - 8 : r.bottom + 8,
          left: Math.max(12, Math.min(r.left, window.innerWidth - width - 12)),
          above,
        });
        setPreview(data);
      }, 140);
    };
    const hide = () => {
      window.clearTimeout(timer.current);
      setPreview(null);
    };
    const target = (e: Event) => (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-ref]") ?? null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = target(e);
      if (el) show(el);
    };
    const onOut = (e: PointerEvent) => {
      if (target(e)) hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = target(e);
      if (el) show(el);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        zIndex: 80,
        top: pos.top,
        left: pos.left,
        transform: pos.above ? "translateY(-100%)" : undefined,
        pointerEvents: "none",
      }}
    >
      <div className="tk-preview" data-open={preview ? "" : undefined} style={{ position: "static" }}>
        {preview ? (
          <>
            <span className="tk-preview-code">{preview.code}</span>
            <p className="tk-preview-title">{preview.title}</p>
            <p className="tk-preview-meta">{preview.meta}</p>
            <p className="tk-preview-text">{preview.text}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
