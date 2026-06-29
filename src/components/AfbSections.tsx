"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HexPattern from "./HexPattern";
import AfbComponentsSection from "./AfbComponentsSection";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────────── */

const SECTIONS_DATA = [
  { id: "who-are-we",        label: "WHO ARE WE",        number: "01" },
  { id: "where-we-come-from", label: "WHERE WE COME FROM", number: "02" },
  { id: "our-components",    label: "OUR COMPONENTS",    number: "03" },
];

const WHO_TEXT =
  "A global initiative that explores the use of today's most advanced technologies to mitigate the risk of environmental crises in the world and to activate the economy in the poverty-stricken communities around nature reserves.";

/* ── Component ─────────────────────────────────────────── */

export default function AfbSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef      = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [labelKey,  setLabelKey]    = useState(0);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".afb-section");

    /* ── Indicator fade-in / fade-out ── */
    ScrollTrigger.create({
      trigger: sections[0],
      start: "top 85%",
      onEnter:     () => gsap.to(indicatorRef.current, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(indicatorRef.current, { opacity: 0, x: 20, duration: 0.35 }),
    });

    /* ── Overall progress fill ── */
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const pct = self.progress * 100;
        if (fillRef.current) fillRef.current.style.height = `${pct}%`;
        if (dotRef.current)  dotRef.current.style.top     = `calc(${pct}% - 4px)`;
      },
    });

    /* ── Section tracking ── */
    sections.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        onEnter:     () => { setActiveIdx(i); setLabelKey(k => k + 1); },
        onEnterBack: () => { setActiveIdx(i); setLabelKey(k => k + 1); },
      });
    });

    /* ═══════════════════════════════════════════
       SECTION 01 — WHO ARE WE: word scrub
    ═══════════════════════════════════════════ */
    const whoSection = document.querySelector("#who-are-we")!;
    const words      = whoSection.querySelectorAll<HTMLElement>(".afb-reveal-word");

    if (words.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: whoSection,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
      tl.fromTo(words,
        { opacity: 0.1, filter: "blur(2px)" },
        { opacity: 1, filter: "blur(0px)", stagger: { each: 0.08 }, ease: "none", duration: words.length * 0.08 }
      );
    }

    /* Ambient glow entrance — Section 01 */
    gsap.fromTo("#who-are-we .afb-section-glow",
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: "#who-are-we", start: "top 70%" } }
    );

    /* ═══════════════════════════════════════════
       SECTION 02 — WHERE WE COME FROM
    ═══════════════════════════════════════════ */
    const originSection = document.querySelector("#where-we-come-from")!;

    /* Ambient glow */
    gsap.fromTo("#where-we-come-from .afb-section-glow",
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: originSection, start: "top 70%" } }
    );

    /* Header label slide in */
    gsap.fromTo(".afb-origin-header",
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: originSection, start: "top 72%" } }
    );

    /* Title lines — clip reveal (slide up from overflow:hidden parent) */
    gsap.fromTo(".afb-otl-inner",
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0, opacity: 1,
        stagger: 0.14,
        duration: 0.88,
        ease: "power3.out",
        scrollTrigger: { trigger: originSection, start: "top 65%" },
      }
    );

    /* Main image — clip-path wipe from left */
    gsap.fromTo(".afb-origin-card--main",
      { clipPath: "inset(0 100% 0 0 round 10px)" },
      {
        clipPath: "inset(0 0% 0 0 round 10px)",
        duration: 1.25,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".afb-origin-gallery", start: "top 78%" },
      }
    );

    /* Secondary image — clip-path wipe from bottom */
    gsap.fromTo(".afb-origin-card--secondary .afb-origin-card-frame",
      { clipPath: "inset(100% 0 0 0 round 10px)", opacity: 0 },
      {
        clipPath: "inset(0% 0 0 0 round 10px)", opacity: 1,
        duration: 1.1,
        ease: "power3.inOut",
        delay: 0.28,
        scrollTrigger: { trigger: ".afb-origin-gallery", start: "top 74%" },
      }
    );

    /* Accent lines — scaleX draw */
    gsap.fromTo(".afb-origin-accent-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: 0.12,
        scrollTrigger: { trigger: ".afb-origin-gallery", start: "center 85%" },
      }
    );

    /* Parallax depth on images as section scrolls */
    gsap.to(".afb-origin-card--main img", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: originSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".afb-origin-card--secondary img", {
      yPercent: -22,
      ease: "none",
      scrollTrigger: {
        trigger: originSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    /* Counter number — count up from 0 on enter */
    const numEl = document.querySelector<HTMLElement>(".afb-origin-stat-number");
    if (numEl) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 47,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => { numEl.textContent = Math.round(obj.val) + "+"; },
        scrollTrigger: { trigger: originSection, start: "center 75%", once: true },
      });
    }

  }, { scope: containerRef });

  const active = SECTIONS_DATA[activeIdx] ?? SECTIONS_DATA[0];

  return (
    <div ref={containerRef} className="afb-sections-root">

      {/* ── Fixed scroll indicator ── */}
      <div ref={indicatorRef} className="afb-si" style={{ opacity: 0, transform: "translateX(20px)" }}>
        <div className="afb-si-header">
          <span key={`l-${labelKey}`} className="afb-si-label">{active.label}</span>
          <span key={`c-${labelKey}`} className="afb-si-chip">{active.number}</span>
        </div>
        <div className="afb-si-track">
          <div ref={fillRef} className="afb-si-fill" />
          <div ref={dotRef}  className="afb-si-dot"  />
        </div>
      </div>

      {/* ═══════════════════════════════════
          SECTION 01 — WHO ARE WE
      ═══════════════════════════════════ */}
      <section id="who-are-we" className="afb-section">
        <HexPattern className="afb-section-hex" />
        <div className="afb-section-glow" aria-hidden="true" />
        <div className="afb-section-inner">
          <p className="afb-reveal-text">
            {WHO_TEXT.split(" ").map((word, i, arr) => (
              <span key={i} className="afb-reveal-word">
                {word}{i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SECTION 02 — WHERE WE COME FROM
      ═══════════════════════════════════ */}
      <section id="where-we-come-from" className="afb-section afb-section-origin">
        <HexPattern className="afb-section-hex" />
        <div className="afb-section-glow" aria-hidden="true" />

        <div className="afb-origin-content">

          {/* Section label */}
          <div className="afb-origin-header">
            <span className="afb-origin-header-eyebrow">WHERE WE COME FROM</span>
          </div>

          {/* Title */}
          <h2 className="afb-origin-title">
            <div className="afb-origin-title-line">
              <span className="afb-otl-inner">
                AI for <span className="afb-otl-green">Climate</span> is
              </span>
            </div>
            <div className="afb-origin-title-line">
              <span className="afb-otl-inner afb-otl-dim">
                an <em>initiative</em>
              </span>
            </div>
            <div className="afb-origin-title-line">
              <span className="afb-otl-inner">
                founded by C <span className="afb-otl-green">Minds</span>
              </span>
            </div>
          </h2>

          {/* Image gallery */}
          <div className="afb-origin-gallery">

            {/* Left — main image */}
            <div className="afb-origin-card afb-origin-card--main">
              <div className="afb-origin-card-frame">
                <img
                  src="/platforms/aiforbiodiversity/wherewecomefrom-img1.png"
                  alt="AI for Climate team"
                />
              </div>
              <div className="afb-origin-accents">
                <span className="afb-origin-accent-line" />
                <span className="afb-origin-accent-line afb-origin-accent-line--short" />
              </div>
            </div>

            {/* Right — secondary + stat */}
            <div className="afb-origin-card afb-origin-card--secondary">
              <div className="afb-origin-secondary-top">
                <span className="afb-origin-accent-line" />
              </div>
              <div className="afb-origin-card-frame">
                <img
                  src="/platforms/aiforbiodiversity/wherewecomefrom-img2.png"
                  alt="Biodiversity in action"
                />
              </div>
              {/* Floating stat chip */}
              <div className="afb-origin-stat">
                <span className="afb-origin-stat-number">0+</span>
                <span className="afb-origin-stat-label">Projects<br />worldwide</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SECTION 03 — OUR COMPONENTS
      ═══════════════════════════════════ */}
      <AfbComponentsSection />

    </div>
  );
}
