"use client";

import type { Locale } from "@/i18n/config";
import { targetOf } from "../data";
import { useContent, useLocale } from "./i18n";
import { sectionLabels, useToolkit } from "./ToolkitState";
import { PageLink } from "./RefLink";
import { IconArrowRight, IconCheck } from "./icons";

const isStage = (key: string) => /^E\d$/.test(key);

const L = {
  es: {
    group: "Elige por dónde empezar según tu rol",
    yours: "Tu ruta",
    start: "Empieza por:",
    steps: (title: string) => `Recorrido sugerido para ${title}`,
    begin: "Comenzar la ruta",
    remove: "Quitar ruta",
  },
  en: {
    group: "Choose where to start based on your role",
    yours: "Your route",
    start: "Start with:",
    steps: (title: string) => `Suggested route for ${title}`,
    begin: "Start the route",
    remove: "Clear route",
  },
} satisfies Record<Locale, Record<string, string | ((title: string) => string)>>;

/** Tarjetas de ruta por público: al elegir una, la barra lateral marca su recorrido. */
export default function RouteSelector() {
  const { route, setRoute, isDone } = useToolkit();
  const firstOpen = route?.path.find((key) => !(isStage(key) && isDone(key.toLowerCase())));
  const locale = useLocale();
  const { AUDIENCES } = useContent();
  const labels = sectionLabels(locale);
  const l = L[locale];

  return (
    <div data-hero>
      <div className="tk-routes" role="group" aria-label={l.group}>
        {AUDIENCES.map((a) => {
          const selected = route?.id === a.id;
          return (
            <button key={a.id} type="button" className="tk-route" aria-pressed={selected} onClick={() => setRoute(selected ? null : a.id)}>
              <span className="tk-route-head">
                <span className="tk-route-title">{a.title}</span>
                {selected ? <span className="tk-route-badge">{l.yours}</span> : null}
              </span>
              <span className="tk-route-text">
                <strong>{l.start}</strong> {a.short}
              </span>
              <IconArrowRight className="tk-route-arrow" />
            </button>
          );
        })}
      </div>

      {route ? (
        <div className="tk-route-panel" aria-live="polite">
          <ol className="tk-route-steps" aria-label={l.steps(route.title)}>
            {route.path.map((key) => {
              const done = isStage(key) && isDone(key.toLowerCase());
              const { slug, hash } = targetOf(key);
              return (
                <li key={key}>
                  <PageLink
                    slug={slug}
                    hash={hash}
                    className="tk-route-node"
                    data-done={done || undefined}
                    data-ref={/^[EP]\d$/.test(key) ? key : undefined}
                  >
                    {done ? <IconCheck /> : null}
                    {labels[key] ?? key}
                  </PageLink>
                </li>
              );
            })}
          </ol>
          <div className="tk-route-actions">
            {firstOpen ? (
              <PageLink slug={targetOf(firstOpen).slug} className="tk-cta">
                {l.begin}
                <IconArrowRight />
              </PageLink>
            ) : null}
            <button type="button" className="tk-link-btn" onClick={() => setRoute(null)}>
              {l.remove}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
