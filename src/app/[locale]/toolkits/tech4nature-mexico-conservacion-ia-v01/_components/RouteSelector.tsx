"use client";

import { AUDIENCES, targetOf } from "../data";
import { SECTION_LABELS, useToolkit } from "./ToolkitState";
import { PageLink } from "./RefLink";
import { IconArrowRight, IconCheck } from "./icons";

const isAction = (key: string) => /^A\d{2}$/.test(key);

/** Tarjetas de ruta por público: al elegir una, la barra lateral marca su recorrido. */
export default function RouteSelector() {
  const { route, setRoute, isDone } = useToolkit();
  const firstOpen = route?.path.find((key) => !(isAction(key) && isDone(key.toLowerCase())));

  return (
    <div data-hero>
      <div className="tk-routes" role="group" aria-label="Elige tu ruta por responsabilidad">
        {AUDIENCES.map((a) => {
          const selected = route?.id === a.id;
          return (
            <button key={a.id} type="button" className="tk-route" aria-pressed={selected} onClick={() => setRoute(selected ? null : a.id)}>
              <span className="tk-route-head">
                <span className="tk-route-title">{a.title}</span>
                {selected ? <span className="tk-route-badge">Tu ruta</span> : null}
              </span>
              <span className="tk-route-text">{a.short}</span>
              <span className="tk-route-path">{a.path.map((p) => SECTION_LABELS[p] ?? p).join(" · ")}</span>
              <IconArrowRight className="tk-route-arrow" />
            </button>
          );
        })}
      </div>

      {route ? (
        <div className="tk-route-panel" aria-live="polite">
          <p>
            <strong>Por qué esta ruta: </strong>
            {route.reason}
          </p>
          <ol className="tk-route-steps" aria-label={`Recorrido sugerido para ${route.title}`}>
            {route.path.map((key) => {
              const done = isAction(key) && isDone(key.toLowerCase());
              const { slug, hash } = targetOf(key);
              return (
                <li key={key}>
                  <PageLink
                    slug={slug}
                    hash={hash}
                    className="tk-route-node"
                    data-done={done || undefined}
                    data-ref={/^[AT]\d{2}$/.test(key) ? key : undefined}
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
