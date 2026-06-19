"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUOTES = [
  "We refuse to accept futures built on exclusion, extraction, or inequality.",
  "We are not just thinkers, we are bold minds that put the future into action.",
  "We believe in the power of intersecting ethics, emerging technology, and life dignity, to spark bold and meaningful change.",
  "We collaborate across sectors, geographies, and disciplines to rewrite the systems shaping our world.",
] as const;

// Called by the parent (core/page) to wire up the shared progress indicator
export type ProgressRef = {
  fill: HTMLDivElement | null;
  dot:  HTMLDivElement | null;
};

interface Props {
  onScrollProgress?: (p: number, section: "core-scroll" | "manifesto") => void;
}

export default function ManifestoSection({ onScrollProgress }: Props) {
  const pinRef       = useRef<HTMLDivElement>(null);
  const quoteRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const unitsRef     = useRef<HTMLSpanElement>(null);
  const lastPhaseRef = useRef(0);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    // Hide non-first quote parents so they don't flash before gsap.set runs
    quoteRefs.current.forEach((el, i) => {
      if (!el || i === 0) return;
      gsap.set(el, { autoAlpha: 0 });
    });

    function transitionTo(from: number, to: number) {
      const fwd = to > from;

      // Kill running tweens on all quotes; reset bystanders to hidden
      quoteRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el.querySelectorAll(".mf-word"));
        if (i !== from && i !== to) gsap.set(el, { autoAlpha: 0 });
      });

      // Exit old quote
      const oldEl = quoteRefs.current[from];
      if (oldEl) {
        const words = oldEl.querySelectorAll<HTMLSpanElement>(".mf-word");
        gsap.to(words, {
          opacity: 0, y: fwd ? -22 : 22, filter: "blur(10px)",
          duration: 0.3,
          stagger: { each: 0.03, from: fwd ? "end" : "start" },
          ease: "power2.in",
          onComplete: () => gsap.set(oldEl, { autoAlpha: 0 }),
        });
      }

      // Enter new quote
      const newEl = quoteRefs.current[to];
      if (newEl) {
        gsap.set(newEl, { autoAlpha: 1 });
        const words = newEl.querySelectorAll<HTMLSpanElement>(".mf-word");
        gsap.set(words, { opacity: 0, y: fwd ? 28 : -28, filter: "blur(12px)" });
        gsap.to(words, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.7, delay: 0.18,
          stagger: { each: 0.045, from: "start" },
          ease: "power3.out",
        });
      }

      // Odometer: units digit
      const unitsEl = unitsRef.current;
      if (unitsEl) {
        const newDigit = String(to + 1);
        gsap.to(unitsEl, {
          y: fwd ? "-115%" : "115%", opacity: 0,
          duration: 0.28, ease: "back.in(2)",
          onComplete() {
            unitsEl.textContent = newDigit;
            gsap.fromTo(unitsEl,
              { y: fwd ? "115%" : "-115%", opacity: 0 },
              { y: "0%", opacity: 1, duration: 0.38, ease: "back.out(1.8)" }
            );
          },
        });
      }
    }

    function onScrollUpdate(p: number) {
      onScrollProgress?.(p, "manifesto");

      const phase = Math.min(3, Math.floor(p * 4));
      if (phase !== lastPhaseRef.current) {
        transitionTo(lastPhaseRef.current, phase);
        lastPhaseRef.current = phase;
      }
    }

    const st = ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      scrub: 1.2,
      onUpdate: (self) => onScrollUpdate(self.progress),
    });

    onScrollUpdate(0);
    ScrollTrigger.refresh();

    return () => { st.kill(); };
  }, [onScrollProgress]);

  return (
    <section className="mf-section">
      <div ref={pinRef} className="mf-pin">

        <div className="mf-spotlight" aria-hidden="true" />

        <p className="mf-label">
          <span style={{ color: "var(--color-primary)" }}>•</span> Our Manifesto
        </p>

        {/* All quotes stacked; visibility controlled by gsap autoAlpha */}
        <div className="mf-quotes-wrap">
          {QUOTES.map((quote, i) => (
            <div
              key={i}
              ref={el => { quoteRefs.current[i] = el; }}
              className="mf-quote"
            >
              {quote.split(" ").map((word, j) => (
                <span key={j} className="mf-word">{word}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="mf-counter" aria-live="polite">
          <div className="mf-digit-wrap"><span className="mf-digit-tens">0</span></div>
          <div className="mf-digit-wrap"><span ref={unitsRef} className="mf-digit-units">1</span></div>
        </div>

      </div>
    </section>
  );
}
