"use client";

import { AUDIENCES, targetOf } from "../data";
import { SECTION_LABELS, useToolkit } from "./ToolkitState";
import { PageLink } from "./RefLink";
import { IconArrowRight, IconCheck } from "./icons";

const isStage = (key: string) => /^E\d$/.test(key);

/** Tarjetas de ruta por público: al elegir una, la barra lateral marca su recorrido. */
export default function RouteSelector() {
  const { route, setRoute, isDone } = useToolkit();
  const firstOpen = route?.path.find((key) => !(isStage(key) && isDone(key.toLowerCase())));

  return (
    <div data-hero>
      <div className="tk-routes" role="group" aria-label="Elige por dónde empezar según tu rol">
        {AUDIENCES.map((a) => {
          const selected = route?.id === a.id;
          return (
            <button key={a.id} type="button" className="tk-route" aria-pressed={selected} onClick={() => setRoute(selected ? null : a.id)}>
              <span className="tk-route-head">
                <span className="tk-route-title">{a.title}</span>
                {selected ? <span className="tk-route-badge">Tu ruta</span> : null}
              </span>
              <span className="tk-route-text">
                <strong>Empieza por:</strong> {a.short}
              </span>
              <IconArrowRight className="tk-route-arrow" />
            </button>
          );
        })}
      </div>

      {route ? (
        <div className="tk-route-panel" aria-live="polite">
          <ol className="tk-route-steps" aria-label={`Recorrido sugerido para ${route.title}`}>
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
                    {SECTION_LABELS[key] ?? key}
                  </PageLink>
                </li>
              );
            })}
          </ol>
          <div className="tk-route-actions">
            {firstOpen ? (
              <PageLink slug={targetOf(firstOpen).slug} className="tk-cta">
                Comenzar la ruta
                <IconArrowRight />
              </PageLink>
            ) : null}
            <button type="button" className="tk-link-btn" onClick={() => setRoute(null)}>
              Quitar ruta
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
