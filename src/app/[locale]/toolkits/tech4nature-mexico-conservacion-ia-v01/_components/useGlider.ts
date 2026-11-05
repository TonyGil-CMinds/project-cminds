"use client";

import { useEffect, useRef } from "react";

/**
 * Indicador deslizante para listas de navegación (submenús de la barra lateral e
 * índice de la página). Coloca en la lista las variables CSS --g-y, --g-h y --g-on
 * a partir del enlace activo ([aria-current]); el CSS dibuja con ellas la línea
 * luminosa y el reflejo, y anima el desplazamiento.
 *
 * Sigue al puntero y al foco del teclado, y vuelve al elemento activo al salir.
 * `activeKey` debe cambiar cuando cambia el elemento activo (slug, id de sección…).
 */
export function useGlider<T extends HTMLElement>(activeKey: unknown) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    // Distancia del elemento al borde superior de la lista (los <li> también están posicionados).
    const topIn = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== list; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    const place = (el: HTMLElement | null) => {
      if (!el || !el.offsetHeight) {
        list.style.setProperty("--g-on", "0");
        return;
      }
      list.style.setProperty("--g-y", `${topIn(el)}px`);
      list.style.setProperty("--g-h", `${el.offsetHeight}px`);
      list.style.setProperty("--g-on", "1");
    };
    const linkOf = (target: EventTarget | null) => {
      const link = target instanceof Element ? target.closest<HTMLElement>("a") : null;
      return link && list.contains(link) ? link : null;
    };
    const home = () => place(list.querySelector<HTMLElement>("a[aria-current]"));

    // La primera colocación va sin animación (el indicador aparece ya en su sitio);
    // las siguientes, al navegar, se deslizan desde el elemento anterior.
    const first = list.dataset.gliderReady !== "true";
    if (first) list.dataset.gliderReady = "";
    home();
    const raf = first
      ? requestAnimationFrame(() => {
          list.dataset.gliderReady = "true";
        })
      : 0;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "mouse") place(linkOf(e.target));
    };
    const onFocus = (e: FocusEvent) => {
      const link = linkOf(e.target);
      if (link?.matches(":focus-visible")) place(link);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!linkOf(e.relatedTarget)) home();
    };

    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", home);
    list.addEventListener("focusin", onFocus);
    list.addEventListener("focusout", onFocusOut);
    // Al abrir/cerrar el grupo, cambiar el tamaño de letra o el ancho, recalcula.
    const ro = new ResizeObserver(home);
    ro.observe(list);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", home);
      list.removeEventListener("focusin", onFocus);
      list.removeEventListener("focusout", onFocusOut);
    };
  }, [activeKey]);

  return ref;
}
