"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ACTIONS } from "../data";
import { T4NBadge } from "./Badge";
import { usePrefs } from "./Preferences";
import { PageLink } from "./RefLink";
import { useToolkit } from "./ToolkitState";
import { IconArrowRight, IconLock } from "./icons";

gsap.registerPlugin(SplitText);

const BURST_COLORS = ["#e5ff0d", "#cbe86b", "#5ec1f3", "#b9a6ff", "#f2c46b", "#ffffff"];
const BURST = 34;
// Destellos alrededor de la insignia (porcentajes del escenario).
const SPARKLES = [
  { x: 14, y: 22, s: 14 },
  { x: 84, y: 18, s: 18 },
  { x: 92, y: 62, s: 11 },
  { x: 8, y: 70, s: 12 },
  { x: 30, y: 88, s: 9 },
  { x: 70, y: 90, s: 13 },
];

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <svg className="tk-sparkle" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0z" />
    </svg>
  );
}

/**
 * Aviso que aparece una sola vez, al revisar la última acción.
 * Coreografía: el modal emerge del desenfoque, la insignia entra girando en gris
 * con un candado, el candado tiembla y estalla, la insignia toma color con un
 * destello, ondas, partículas y halo, y el texto entra letra a letra.
 * Con "reducir animaciones" se muestra directamente el estado final.
 */
export function CompletionDialog() {
  const { complete, celebrated, markCelebrated } = useToolkit();
  const { reducedMotion } = usePrefs();
  const ref = useRef<HTMLDialogElement>(null);
  const open = complete && !celebrated;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!open) {
      if (d.open) d.close();
      return;
    }
    if (!d.open) d.showModal();
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(d);
      const flip = q(".tk-cel-flip");
      const title = q(".tk-cel-title")[0];
      const split = title ? SplitText.create(title, { type: "words,chars" }) : null;

      // Estado inicial: todo lo que va a aparecer, oculto.
      gsap.set(q(".tk-cel-copy > *, .tk-cel-actions > *"), { autoAlpha: 0, y: 16 });
      gsap.set(q(".tk-burst i"), { x: 0, y: 0, scale: 0, autoAlpha: 0 });
      gsap.set(q(".tk-sparkle"), { scale: 0, autoAlpha: 0 });
      gsap.set(q(".tk-wave"), { scale: 0.4, autoAlpha: 0 });
      gsap.set(q(".tk-halo, .tk-rays"), { scale: 0.3, autoAlpha: 0 });
      gsap.set(q(".tk-cel-shine span"), { x: 0, xPercent: -180, skewX: -18 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        d,
        { y: 40, scale: 0.93, autoAlpha: 0, filter: "blur(14px)" },
        { y: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 0.8, clearProps: "filter" },
      )
        .fromTo(
          flip,
          { rotateX: 75, y: 50, scale: 0.7, autoAlpha: 0, transformPerspective: 900, filter: "grayscale(1) brightness(0.5)" },
          { rotateX: 0, y: 0, scale: 1, autoAlpha: 1, filter: "grayscale(1) brightness(0.8)", duration: 1.1 },
          0.15,
        )
        .fromTo(q(".tk-unlock"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)" }, 0.5)
        .to(q(".tk-unlock"), { keyframes: { rotation: [0, -16, 14, -10, 7, -3, 0] }, duration: 0.5, ease: "none" }, 1.05)
        .addLabel("unlock", 1.6)
        .to(q(".tk-unlock"), { scale: 2.1, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "unlock")
        .to(flip, { filter: "grayscale(0) brightness(1.7)", scale: 1.08, duration: 0.22, ease: "power2.out" }, "unlock")
        .to(flip, { filter: "grayscale(0) brightness(1)", scale: 1, duration: 1.1, ease: "elastic.out(1, 0.45)" }, "unlock+=0.22")
        .to(q(".tk-halo"), { scale: 1, autoAlpha: 1, duration: 1.4 }, "unlock")
        .to(q(".tk-rays"), { scale: 1, autoAlpha: 1, duration: 1.8 }, "unlock+=0.05")
        .fromTo(
          q(".tk-wave"),
          { scale: 0.5, autoAlpha: 0.95 },
          { scale: 3, autoAlpha: 0, duration: 1.5, stagger: 0.16, ease: "power2.out" },
          "unlock",
        )
        .to(q(".tk-cel-shine span"), { xPercent: 320, duration: 1, ease: "power2.inOut" }, "unlock+=0.12");

      // Estallido radial de partículas desde el centro de la insignia.
      q(".tk-burst i").forEach((dot, i) => {
        const angle = (i / BURST) * Math.PI * 2 + gsap.utils.random(-0.2, 0.2);
        const dist = gsap.utils.random(120, 250);
        tl.fromTo(
          dot,
          { x: 0, y: 0, scale: 0, autoAlpha: 1, rotation: (angle * 180) / Math.PI + 90 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist * 0.6,
            scale: gsap.utils.random(0.5, 1.3),
            keyframes: { autoAlpha: [1, 1, 0] },
            duration: gsap.utils.random(1, 1.7),
            ease: "expo.out",
          },
          `unlock+=${gsap.utils.random(0, 0.12).toFixed(3)}`,
        );
      });

      tl.to(q(".tk-sparkle"), { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: "back.out(3)" }, "unlock+=0.25")
        .to(q(".tk-cel-copy > *"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, "unlock+=0.2")
        .from(split?.chars ?? [], { yPercent: 70, autoAlpha: 0, filter: "blur(8px)", duration: 0.8, stagger: 0.02 }, "unlock+=0.28")
        .to(q(".tk-cel-actions > *"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, "unlock+=0.55");

      // En reposo: la insignia flota y los destellos titilan.
      tl.add(() => {
        gsap.to(q(".tk-cel-float"), { y: -7, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(q(".tk-sparkle"), {
          scale: 0.35,
          autoAlpha: 0.3,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: { each: 0.3, from: "random" },
        });
      });
    }, d);

    return () => ctx.revert();
  }, [open, reducedMotion]);

  // "Ahora no": el modal se disuelve antes de cerrarse.
  const dismiss = () => {
    const d = ref.current;
    if (!d || reducedMotion) {
      markCelebrated();
      return;
    }
    gsap.to(d, {
      autoAlpha: 0,
      y: 18,
      scale: 0.96,
      filter: "blur(8px)",
      duration: 0.35,
      ease: "power2.in",
      onComplete: markCelebrated,
    });
  };

  return (
    <dialog ref={ref} className="tk-dialog tk-celebrate" aria-labelledby="tk-celebrate-title" onClose={markCelebrated}>
      <div className="tk-cel-stage" aria-hidden="true">
        <span className="tk-rays" />
        <span className="tk-halo" />
        <span className="tk-wave" />
        <span className="tk-wave" />
        <span className="tk-wave" />
        <span className="tk-burst">
          {Array.from({ length: BURST }, (_, i) => (
            <i
              key={i}
              className={i % 3 === 0 ? "tk-burst-streak" : undefined}
              style={{ "--c": BURST_COLORS[i % BURST_COLORS.length] } as CSSProperties}
            />
          ))}
        </span>
        {SPARKLES.map((s, i) => (
          <Sparkle key={i} {...s} />
        ))}
        <div className="tk-cel-float">
          <div className="tk-cel-flip">
            <T4NBadge />
            <span className="tk-cel-shine">
              <span />
            </span>
          </div>
        </div>
        <span className="tk-unlock">
          <IconLock />
        </span>
      </div>

      <div className="tk-cel-copy">
        <span className="tk-cel-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0z" />
          </svg>
          Insignia desbloqueada
        </span>
        <h2 id="tk-celebrate-title" className="tk-cel-title">
          Completaste el toolkit
        </h2>
        <p>
          Revisaste las {ACTIONS.length} acciones. Tu insignia de Tech4Nature México está lista para descargar y compartir.
        </p>
      </div>

      <div className="tk-cel-actions">
        <PageLink slug="insignia" className="tk-cta tk-cta--shine" onClick={markCelebrated}>
          Descargar y compartir
          <IconArrowRight />
        </PageLink>
        <button type="button" className="tk-ghost" onClick={dismiss}>
          Ahora no
        </button>
      </div>
    </dialog>
  );
}
