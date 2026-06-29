"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HexPattern from "./HexPattern";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: "who-are-we",
    label: "WHO ARE WE",
    number: "01",
    text: "A global initiative that explores the use of today's most advanced technologies to mitigate the risk of environmental crises in the world and to activate the economy in the poverty-stricken communities around nature reserves.",
  },
];

export default function AfbSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef      = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [labelKey, setLabelKey]   = useState(0); // forces re-render for chip flip animation

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".afb-section");

    /* ── Scroll indicator fade-in when first section enters ── */
    ScrollTrigger.create({
      trigger: sections[0],
      start: "top 85%",
      onEnter:     () => gsap.to(indicatorRef.current, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(indicatorRef.current, { opacity: 0, x: 20, duration: 0.35, ease: "power2.in" }),
    });

    /* ── Overall progress bar ── */
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

    /* ── Section tracking for label chip ── */
    sections.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        onEnter:     () => { setActiveIdx(i); setLabelKey(k => k + 1); },
        onEnterBack: () => { setActiveIdx(i); setLabelKey(k => k + 1); },
      });
    });

    /* ── Word-by-word scrub reveal per section ── */
    sections.forEach((section) => {
      const words = section.querySelectorAll<HTMLElement>(".afb-reveal-word");
      if (!words.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      tl.fromTo(
        words,
        { opacity: 0.1, filter: "blur(2px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: { each: 0.08, from: "start" },
          ease: "none",
          duration: words.length * 0.08,
        }
      );
    });

    /* ── Section ambient glow entrance ── */
    sections.forEach((section) => {
      const glow = section.querySelector<HTMLElement>(".afb-section-glow");
      if (!glow) return;
      gsap.fromTo(glow,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );
    });

  }, { scope: containerRef });

  const active = SECTIONS[activeIdx] ?? SECTIONS[0];

  return (
    <div ref={containerRef} className="afb-sections-root">

      {/* ── Fixed scroll indicator ── */}
      <div ref={indicatorRef} className="afb-si" style={{ opacity: 0, transform: "translateX(20px)" }}>
        <div className="afb-si-header">
          <span key={`label-${labelKey}`} className="afb-si-label">{active.label}</span>
          <span key={`chip-${labelKey}`}  className="afb-si-chip">{active.number}</span>
        </div>
        <div className="afb-si-track">
          <div ref={fillRef} className="afb-si-fill" />
          <div ref={dotRef}  className="afb-si-dot"  />
        </div>
      </div>

      {/* ── Sections ── */}
      {SECTIONS.map((sec) => (
        <section key={sec.id} id={sec.id} className="afb-section">
          {/* WebGL hex overlay */}
          <HexPattern className="afb-section-hex" />

          {/* Ambient radial glow */}
          <div className="afb-section-glow" aria-hidden="true" />

          {/* Content */}
          <div className="afb-section-inner">
            <p className="afb-reveal-text">
              {sec.text.split(" ").map((word, i, arr) => (
                <span key={i} className="afb-reveal-word">
                  {word}{i < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </section>
      ))}

    </div>
  );
}
