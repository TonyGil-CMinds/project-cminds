"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HexPattern from "./HexPattern";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────────── */

const COMPONENTS = [
  {
    id: "platform",
    title: ["GLOBAL", "LEARNING", "PLATFORM"],
    detect: { label: "HUMAN", confidence: 80 },
    desc: [
      "Bridging silos between tech innovation, the climate, and conservation fields by creating spaces to share best practices, technologies, and resources.",
      "This includes annual high-level global forums, and much more.",
    ],
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png",
  },
  {
    id: "technology",
    title: ["TECHNOLOGY", "DEVELOPMENT"],
    detect: { label: "SPECIES", confidence: 94 },
    desc: [
      "Building AI-powered tools that enable field researchers to identify, track, and protect endangered species with unprecedented accuracy.",
      "From computer vision models to acoustic monitoring and satellite data fusion.",
    ],
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png",
  },
  {
    id: "network",
    title: ["CONSERVATION", "NETWORK"],
    detect: { label: "HABITAT", confidence: 91 },
    desc: [
      "A connected global network of conservation organizations, researchers, and local communities working together.",
      "Sharing data, open-source tools, and knowledge to protect the world's biodiversity.",
    ],
    image: "/platforms/aiforbiodiversity/hero-bg-image.png",
  },
];

/* ── Component ─────────────────────────────────────────── */

export default function AfbComponentsSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const confRef       = useRef<HTMLSpanElement>(null);
  const rightBarRef   = useRef<HTMLDivElement>(null);
  const [active, setActive]   = useState(0);
  const [busy,   setBusy]     = useState(false);
  const [ready,  setReady]    = useState(false); /* true after scroll entrance */
  const isFirst = useRef(true);

  /* ── Cross-fade on tab switch ── */
  const switchTo = (idx: number) => {
    if (idx === active || busy || !ready) return;
    setBusy(true);

    const el = containerRef.current!;
    gsap.to(
      [el.querySelector(".afb-comp-title"),
       el.querySelector(".afb-comp-description"),
       el.querySelector(".afb-comp-image-wrap")],
      {
        opacity: 0, y: -14, duration: 0.26, ease: "power2.in",
        onComplete: () => { setActive(idx); setBusy(false); },
      }
    );
  };

  /* ── Re-animate content after activeIdx changes ── */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const el = containerRef.current!;

    gsap.fromTo(
      [el.querySelector(".afb-comp-title"),
       el.querySelector(".afb-comp-description"),
       el.querySelector(".afb-comp-image-wrap")],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.46, ease: "power2.out", stagger: 0.06 }
    );

    el.querySelectorAll<HTMLElement>(".afb-corner").forEach((c, i) => {
      gsap.fromTo(c, { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.32, delay: 0.28 + i * 0.055, ease: "back.out(1.7)" });
    });

    el.querySelectorAll<HTMLElement>(".afb-detect-char").forEach((ch, i) => {
      gsap.fromTo(ch, { opacity: 0 },
        { opacity: 1, duration: 0.06, delay: 0.46 + i * 0.055, ease: "none" });
    });

    const comp = COMPONENTS[active];
    const obj  = { val: 0 };
    gsap.to(obj, {
      val: comp.detect.confidence, duration: 1.1, ease: "power2.out", delay: 0.5,
      onUpdate: () => { if (confRef.current) confRef.current.textContent = Math.round(obj.val) + "%"; },
    });
  }, [active]);

  /* ── Scroll entrance ── */
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 72%",
      once: true,
      onEnter: () => {
        setReady(true);

        const tl = gsap.timeline();

        tl.fromTo(".afb-comp-eyebrow-el",
          { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" })

          .fromTo(".afb-comp-tab",
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.35, stagger: 0.09, ease: "power2.out" },
            "-=0.25")

          .fromTo(".afb-comp-title-inner",
            { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.13, ease: "power3.out" },
            "-=0.2")

          .fromTo(".afb-comp-desc-p",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" },
            "-=0.5")

          /* Image wipe from left */
          .fromTo(".afb-comp-right",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power3.inOut" },
            0)

          /* Detection box corners pop in */
          .fromTo(".afb-corner",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.36, stagger: 0.07, ease: "back.out(1.7)" },
            "-=0.35")

          /* Typewriter label */
          .fromTo(".afb-detect-char",
            { opacity: 0 },
            { opacity: 1, stagger: 0.055, duration: 0.08, ease: "none" },
            "-=0.1");

        /* Right bar grows down */
        gsap.fromTo(rightBarRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 1.0, ease: "power2.out", delay: 0.4 });

        /* Confidence count-up */
        const obj = { val: 0 };
        gsap.to(obj, {
          val: COMPONENTS[0].detect.confidence,
          duration: 1.4, ease: "power2.out", delay: 1.5,
          onUpdate: () => { if (confRef.current) confRef.current.textContent = Math.round(obj.val) + "%"; },
        });
      },
    });

    /* Parallax — image drifts up as section scrolls */
    gsap.to(".afb-comp-image", {
      yPercent: -12, ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

  }, { scope: containerRef });

  const comp = COMPONENTS[active];

  return (
    <section ref={containerRef} id="our-components" className="afb-section afb-section-components">
      <HexPattern className="afb-section-hex" />

      <div className="afb-comp-layout">

        {/* ── Left text column ── */}
        <div className="afb-comp-left">

          <span className="afb-comp-eyebrow-el afb-comp-eyebrow" style={{ opacity: 0 }}>
            OUR COMPONENTS
          </span>

          {/* Tab selector */}
          <div className="afb-comp-tabs" role="tablist">
            {COMPONENTS.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={i === active}
                className={`afb-comp-tab${i === active ? " active" : ""}`}
                onClick={() => switchTo(i)}
                title={c.title.join(" ")}
              />
            ))}
          </div>

          {/* Animated title */}
          <h2 className="afb-comp-title">
            {comp.title.map((word, i) => (
              <div key={`${active}-${i}`} className="afb-comp-title-line">
                <span className="afb-comp-title-inner">{word}</span>
              </div>
            ))}
          </h2>

          {/* Description */}
          <div className="afb-comp-description">
            {comp.desc.map((p, i) => (
              <p key={`${active}-${i}`} className="afb-comp-desc-p">{p}</p>
            ))}
          </div>

        </div>

        {/* ── Right visual ── */}
        <div className="afb-comp-right">

          {/* Left-to-right fade for text legibility */}
          <div className="afb-comp-overlay" aria-hidden="true" />

          {/* Photo */}
          <div className="afb-comp-image-wrap">
            <img
              key={active}
              src={comp.image}
              alt={comp.title.join(" ")}
              className="afb-comp-image"
            />
          </div>

          {/* AI detection bounding box */}
          <div className="afb-comp-detect" aria-hidden="true">
            <span className="afb-detect-label-text">
              {comp.detect.label.split("").map((ch, i) => (
                <span key={`${active}-${i}`} className="afb-detect-char">{ch}</span>
              ))}
            </span>

            {/* Corner brackets */}
            <div className="afb-corner afb-corner-tl" />
            <div className="afb-corner afb-corner-tr" />
            <div className="afb-corner afb-corner-bl" />
            <div className="afb-corner afb-corner-br" />

            {/* Scan line */}
            <div className="afb-detect-scan" />

            <span className="afb-detect-conf-wrap">
              <span ref={confRef} className="afb-detect-confidence">0%</span>
            </span>
          </div>

        </div>
      </div>

      {/* Vertical accent bar — far right */}
      <div ref={rightBarRef} className="afb-comp-right-bar" />
    </section>
  );
}
