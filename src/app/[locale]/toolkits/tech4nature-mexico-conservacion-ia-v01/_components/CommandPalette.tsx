"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/useLocale";
import { CATEGORIES, GROUPS, PAGES, RESOURCES, toolkitHref } from "../data";
import { IconSearch } from "./icons";

type Entry = { key: string; slug: string; hash?: string; group: string; code?: string; title: string; hint: string; haystack: string };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const GROUP_LABEL = new Map(GROUPS.map((g) => [g.id, g.label]));
const CATEGORY_LABEL = new Map<string, string>(CATEGORIES.map((c) => [c.id, c.label]));

function buildIndex(): Entry[] {
  const entries: Omit<Entry, "haystack">[] = [
    ...PAGES.map((p) => ({
      key: `p-${p.slug}`,
      slug: p.slug,
      group: p.kind === "etapa" ? "Etapas" : p.kind === "plantilla" ? "Plantillas" : "Páginas",
      code: p.code,
      title: p.kind === "inicio" ? "Inicio del toolkit" : p.title,
      hint: GROUP_LABEL.get(p.group) ?? "",
    })),
    ...RESOURCES.map((r) => ({
      key: r.id,
      slug: "caja-de-herramientas",
      hash: r.id,
      group: "Recursos",
      code: r.code,
      title: r.title,
      hint: `${r.use} · ${CATEGORY_LABEL.get(r.category) ?? ""}`,
    })),
  ];
  return entries.map((e) => ({ ...e, haystack: normalize(`${e.code ?? ""} ${e.title} ${e.hint}`) }));
}

const GROUP_ORDER = ["Páginas", "Etapas", "Plantillas", "Recursos"];
const INDEX = buildIndex();

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const locale = useLocale();

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const matched = tokens.length
      ? INDEX.filter((e) => tokens.every((t) => e.haystack.includes(t)))
      : INDEX.filter((e) => e.group === "Páginas" || e.group === "Etapas");
    return matched
      .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group))
      .slice(0, 40)
      .map((e, i, all) => ({ ...e, header: i === 0 || all[i - 1].group !== e.group }));
  }, [query]);

  // La búsqueda empieza vacía cada vez que se abre.
  const close = () => {
    setQuery("");
    setCursor(0);
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const choose = (entry: Entry | undefined) => {
    if (!entry) return;
    close();
    router.push(toolkitHref(locale, entry.slug, entry.hash));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[cursor]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="tk-palette"
      aria-label="Buscar en el toolkit"
      onClose={close}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="tk-palette-input">
        <IconSearch />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Busca una etapa, plantilla o herramienta…"
          aria-label="Buscar"
          role="combobox"
          aria-expanded="true"
          aria-controls="tk-palette-list"
          aria-activedescendant={results[cursor] ? `tk-pal-${cursor}` : undefined}
          autoComplete="off"
        />
        <kbd className="tk-kbd">Esc</kbd>
      </div>
      {results.length ? (
        <ul ref={listRef} id="tk-palette-list" className="tk-palette-list" role="listbox" aria-label="Resultados">
          {results.map((entry, i) => {
            return (
              <li key={entry.key} role="presentation">
                {entry.header ? (
                  <div className="tk-palette-group" aria-hidden="true">
                    {entry.group}
                  </div>
                ) : null}
                <div
                  id={`tk-pal-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={i === cursor}
                  className="tk-palette-item"
                  onMouseMove={() => setCursor(i)}
                  onClick={() => choose(entry)}
                >
                  <span className="tk-side-code">{entry.code ?? "§"}</span>
                  <span className="tk-palette-text">
                    <strong>{entry.title}</strong>
                    <small>{entry.hint}</small>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="tk-palette-empty">Sin resultados para «{query}».</p>
      )}
      <div className="tk-palette-foot" aria-hidden="true">
        <span>↑ ↓ para moverte</span>
        <span>↵ para abrir</span>
        <span>Esc para cerrar</span>
      </div>
    </dialog>
  );
}
