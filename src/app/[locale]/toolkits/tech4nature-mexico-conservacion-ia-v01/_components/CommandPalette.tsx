"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { toolkitHref } from "../data";
import type { Content } from "../content";
import { useContent, useLocale } from "./i18n";
import { IconSearch } from "./icons";

type GroupKey = "pages" | "stages" | "templates" | "resources";
type Entry = { key: string; slug: string; hash?: string; group: GroupKey; code?: string; title: string; hint: string; haystack: string };

const L = {
  es: {
    pages: "Páginas",
    stages: "Etapas",
    templates: "Plantillas",
    resources: "Recursos",
    home: "Inicio del toolkit",
    dialog: "Buscar en el toolkit",
    placeholder: "Busca una etapa, plantilla o herramienta…",
    search: "Buscar",
    results: "Resultados",
    empty: (q: string) => `Sin resultados para «${q}».`,
    move: "↑ ↓ para moverte",
    open: "↵ para abrir",
    close: "Esc para cerrar",
  },
  en: {
    pages: "Pages",
    stages: "Stages",
    templates: "Templates",
    resources: "Resources",
    home: "Toolkit home",
    dialog: "Search the toolkit",
    placeholder: "Search for a stage, template or tool…",
    search: "Search",
    results: "Results",
    empty: (q: string) => `No results for “${q}”.`,
    move: "↑ ↓ to move",
    open: "↵ to open",
    close: "Esc to close",
  },
} satisfies Record<Locale, Record<string, string | ((q: string) => string)>>;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function buildIndex(locale: Locale, { CATEGORIES, GROUPS, PAGES, RESOURCES }: Content): Entry[] {
  const GROUP_LABEL = new Map(GROUPS.map((g) => [g.id, g.label]));
  const CATEGORY_LABEL = new Map<string, string>(CATEGORIES.map((c) => [c.id, c.label]));
  const entries: Omit<Entry, "haystack">[] = [
    ...PAGES.map((p) => ({
      key: `p-${p.slug}`,
      slug: p.slug,
      group: (p.kind === "etapa" ? "stages" : p.kind === "plantilla" ? "templates" : "pages") as GroupKey,
      code: p.code,
      title: p.kind === "inicio" ? L[locale].home : p.title,
      hint: GROUP_LABEL.get(p.group) ?? "",
    })),
    ...RESOURCES.map((r) => ({
      key: r.id,
      slug: "caja-de-herramientas",
      hash: r.id,
      group: "resources" as GroupKey,
      code: r.code,
      title: r.title,
      hint: `${r.use} · ${CATEGORY_LABEL.get(r.category) ?? ""}`,
    })),
  ];
  return entries.map((e) => ({ ...e, haystack: normalize(`${e.code ?? ""} ${e.title} ${e.hint}`) }));
}

const GROUP_ORDER: GroupKey[] = ["pages", "stages", "templates", "resources"];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const locale = useLocale();
  const content = useContent();
  const l = L[locale];
  const index = useMemo(() => buildIndex(locale, content), [locale, content]);

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const matched = tokens.length
      ? index.filter((e) => tokens.every((t) => e.haystack.includes(t)))
      : index.filter((e) => e.group === "pages" || e.group === "stages");
    return matched
      .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group))
      .slice(0, 40)
      .map((e, i, all) => ({ ...e, header: i === 0 || all[i - 1].group !== e.group }));
  }, [query, index]);

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
      aria-label={l.dialog}
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
          placeholder={l.placeholder}
          aria-label={l.search}
          role="combobox"
          aria-expanded="true"
          aria-controls="tk-palette-list"
          aria-activedescendant={results[cursor] ? `tk-pal-${cursor}` : undefined}
          autoComplete="off"
        />
        <kbd className="tk-kbd">Esc</kbd>
      </div>
      {results.length ? (
        <ul ref={listRef} id="tk-palette-list" className="tk-palette-list" role="listbox" aria-label={l.results}>
          {results.map((entry, i) => {
            return (
              <li key={entry.key} role="presentation">
                {entry.header ? (
                  <div className="tk-palette-group" aria-hidden="true">
                    {l[entry.group]}
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
        <p className="tk-palette-empty">{l.empty(query)}</p>
      )}
      <div className="tk-palette-foot" aria-hidden="true">
        <span>{l.move}</span>
        <span>{l.open}</span>
        <span>{l.close}</span>
      </div>
    </dialog>
  );
}
