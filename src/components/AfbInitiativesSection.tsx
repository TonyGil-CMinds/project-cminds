"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HexPattern from "./HexPattern";

gsap.registerPlugin(ScrollTrigger);

/* ── Constants ─────────────────────────────────────────── */
const N      = 6;
const RADIUS = 420;
const CARD_W = 300;
const CARD_H = 210;

/* ── Cylinder position helper ──────────────────────────────
   GSAP transform order: translate3d(x,y,z) rotateY(ry)
   → translate is always in PARENT space.
   So we must compute x, z from the angle explicitly, not use
   gsap z alone (which would keep all cards at same parent-z).
   ─────────────────────────────────────────────────────── */
function cyl(i: number) {
  const angle = (i / N) * 360;
  const rad   = (i / N) * Math.PI * 2;
  return {
    x:       Math.round(RADIUS * Math.sin(rad)),
    y:       0,
    z:       Math.round(RADIUS * Math.cos(rad)),
    rotateY: angle,
  };
}

/* ── Data ──────────────────────────────────────────────── */
const ITEMS = [
  {
    id: 0,
    name: "NaturaTech LAC",
    tag:  "Technology for nature conservation",
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png",
    tint: "rgba(10, 28, 6, 0.45)",
  },
  {
    id: 1,
    name: "BioMap Initiative",
    tag:  "Real-time biodiversity mapping",
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png",
    tint: "rgba(5, 22, 16, 0.48)",
  },
  {
    id: 2,
    name: "Climate AI Lab",
    tag:  "AI models for climate prediction",
    image: "/platforms/aiforbiodiversity/hero-bg-image.png",
    tint: "rgba(8, 20, 5, 0.50)",
  },
  {
    id: 3,
    name: "Species Monitor",
    tag:  "Endangered species tracking",
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png",
    tint: "rgba(14, 26, 4, 0.42)",
  },
  {
    id: 4,
    name: "EcoData Platform",
    tag:  "Open environmental data",
    image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png",
    tint: "rgba(4, 18, 12, 0.46)",
  },
  {
    id: 5,
    name: "Conservation Network",
    tag:  "Global network of conservationists",
    image: "/platforms/aiforbiodiversity/hero-bg-image.png",
    tint: "rgba(10, 22, 4, 0.50)",
  },
];

type View = "spiral" | "list";

/* ── Component ─────────────────────────────────────────── */
export default function AfbInitiativesSection() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const stRef     = useRef<ScrollTrigger | null>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const viewRef   = useRef<View>("spiral");

  const [hovered, setHovered] = useState<number | null>(null);
  const [view,    setView]    = useState<View>("spiral");

  useGSAP(() => {
    /* Place each card at its correct cylinder surface position */
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, { ...cyl(i), opacity: 0 });
    });

    /* Scroll-pinned cylinder rotation — stage rotates around Y */
    stRef.current = ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   "top top",
      end:     "+=300%",
      pin:     true,
      scrub:   1.5,
      onUpdate: (self) => {
        if (viewRef.current === "spiral") {
          gsap.set(stageRef.current, { rotateY: self.progress * -360 });
        }
      },
    });

    /* Entrance — fires once on scroll approach */
    ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   "top 68%",
      once:    true,
      onEnter: () => {
        gsap.fromTo(".afb-init-eyebrow",
          { opacity: 0, x: -18 },
          { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" }
        );
        gsap.fromTo(".afb-init-title",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.08 }
        );
        gsap.fromTo(".afb-init-nav-btn",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.09, ease: "power2.out", delay: 0.12 }
        );
        /* Cards pop onto the cylinder */
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, scale: 0.72 },
            {
              opacity: 1, scale: 1,
              duration: 0.75,
              delay: 0.22 + i * 0.10,
              ease: "back.out(1.5)",
            }
          );
        });
      },
    });
  }, { scope: wrapRef });

  /* ── View switch ─────────────────────────────────────── */
  const switchView = useCallback((next: View) => {
    if (next === viewRef.current) return;

    if (next === "list") {
      viewRef.current = "list";
      setView("list");

      /* Freeze stage rotation */
      gsap.to(stageRef.current, { rotateY: 0, duration: 0.55, ease: "power2.out" });

      /* 3 × 2 grid, centred at stage origin */
      const gapX = CARD_W + 28;
      const gapY = CARD_H + 26;
      const totalW = 3 * gapX - 28;
      const totalH = 2 * gapY - 26;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const col = i % 3;
        const row = Math.floor(i / 3);
        gsap.to(card, {
          x:       col * gapX - totalW / 2 + CARD_W / 2,
          y:       row * gapY - totalH / 2 + CARD_H / 2,
          z:       0,
          rotateY: 0,
          duration: 0.7,
          delay:    i * 0.06,
          ease:    "power3.out",
        });
      });
    } else {
      /* Restore: snap stage to current scroll angle first so it doesn't jump */
      const progress = stRef.current?.progress ?? 0;
      gsap.set(stageRef.current, { rotateY: progress * -360 });
      viewRef.current = "spiral";
      setView("spiral");

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          ...cyl(i),
          duration: 0.7,
          delay:    i * 0.06,
          ease:    "power3.out",
        });
      });
    }
  }, []);

  const hovItem = hovered !== null ? ITEMS[hovered] : null;

  return (
    <section
      ref={wrapRef}
      id="initiatives"
      className="afb-section afb-section-init"
    >
      <HexPattern className="afb-section-hex" />
      <div className="afb-init-glow" aria-hidden="true" />

      {/* ── Header row ── */}
      <div className="afb-init-header">
        <div className="afb-init-header-left">
          <span className="afb-init-eyebrow" style={{ opacity: 0 }}>INITIATIVES</span>
          <h2 className="afb-init-title" style={{ opacity: 0 }}>
            Featured<br />
            <span className="afb-init-title-green">Initiatives</span>
          </h2>
        </div>

        <div className="afb-init-toggle">
          <button
            className={`afb-init-nav-btn${view === "spiral" ? " active" : ""}`}
            onClick={() => switchView("spiral")}
            style={{ opacity: 0 }}
          >
            Spiral
          </button>
          <button
            className={`afb-init-nav-btn${view === "list" ? " active" : ""}`}
            onClick={() => switchView("list")}
            style={{ opacity: 0 }}
          >
            List
          </button>
        </div>
      </div>

      {/* ── 3-D cylinder viewport ── */}
      <div className="afb-init-viewport">
        <div ref={stageRef} className="afb-init-stage">
          {ITEMS.map((itm, i) => (
            <div
              key={itm.id}
              ref={el => { cardRefs.current[i] = el; }}
              className="afb-init-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="afb-init-card-tint" style={{ background: itm.tint }} />
              <img
                src={itm.image}
                alt={itm.name}
                className="afb-init-card-img"
              />
              <div className="afb-init-card-glass" />
              <div className="afb-init-card-foot">
                <span className="afb-init-card-foot-name">{itm.name}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hover chip ── */}
      <div className={`afb-init-chip${hovItem ? " visible" : ""}`}>
        <div className="afb-init-chip-icon">
          <img src="/platforms/aiforbiodiversity/logo.svg" alt="" />
        </div>
        <div className="afb-init-chip-text">
          <span className="afb-init-chip-name">{hovItem?.name ?? " "}</span>
          <span className="afb-init-chip-tag">{hovItem?.tag  ?? " "}</span>
        </div>
      </div>
    </section>
  );
}
