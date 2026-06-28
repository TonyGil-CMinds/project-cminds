"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const NAV_LEFT  = ["Home", "Who are we"];
const NAV_RIGHT = ["Where we come from", "Initiatives"];

export default function AIForBiodiversityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef      = useRef<HTMLElement>(null);
  const bgRef        = useRef<HTMLImageElement>(null);
  const birdRef      = useRef<HTMLImageElement>(null);
  const plantsRef    = useRef<HTMLImageElement>(null);

  useEffect(() => {
    document.body.classList.add("afb-page-active");
    return () => document.body.classList.remove("afb-page-active");
  }, []);

  /* ── Parallax on mouse-move ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const dx = ((e.clientX - left) / width  - 0.5) * 2; // -1 → +1
      const dy = ((e.clientY - top)  / height - 0.5) * 2;

      // Bird: follows cursor + perspective tilt on X axis (rotateY needs perspective on hero)
      gsap.to(birdRef.current, {
        x: dx * 32,
        y: dy * 10,
        rotateY: dx * 10,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Plants: moves in the opposite direction (counter-parallax)
      gsap.to(plantsRef.current, {
        x: -dx * 22,
        y: -dy * 5,
        duration: 0.75,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Background: very subtle opposite drift
      gsap.to(bgRef.current, {
        x: -dx * 12,
        y: -dy * 4,
        duration: 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      gsap.to([birdRef.current, plantsRef.current, bgRef.current], {
        x: 0, y: 0, rotateY: 0,
        duration: 1.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Entrance animation ── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".afb-hero-bg",
      { scale: 1.06 },
      { scale: 1, duration: 2.2, ease: "power2.out" },
      0
    );

    tl.fromTo(".afb-nav-logo-wrap",
      { opacity: 0, scale: 0.78 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
      0.15
    );

    tl.fromTo(".afb-nav-item",
      { opacity: 0, y: -10, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.07 },
      0.25
    );

    tl.fromTo(".afb-hero-bird",
      { opacity: 0, y: 40, scale: 1.03 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power2.out" },
      0.3
    );

    tl.fromTo(".afb-word",
      { opacity: 0, y: 52, filter: "blur(14px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, stagger: 0.11 },
      0.55
    );

    tl.fromTo(".afb-hero-plants",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
      0.65
    );

    tl.fromTo(".afb-description",
      { opacity: 0, x: 16, filter: "blur(8px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.7 },
      1.1
    );
    tl.fromTo(".afb-scroll-btn",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55 },
      1.1
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="afb-page">

      {/* ── Navbar ── */}
      <nav className="afb-nav">
        <img src="/logo.svg" alt="C Minds" className="afb-nav-cminds afb-nav-item" />

        <div className="afb-nav-center">
          {NAV_LEFT.map((item) => (
            <span key={item} className="afb-nav-item">{item.toUpperCase()}</span>
          ))}

          <div className="afb-nav-logo-wrap">
            <img
              src="/platforms/aiforbiodiversity/logo.svg"
              alt="AI for Biodiversity"
              className="afb-nav-logo"
            />
          </div>

          {NAV_RIGHT.map((item) => (
            <span key={item} className="afb-nav-item">{item.toUpperCase()}</span>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="afb-hero">

        {/* Layer 0 — background */}
        <img
          ref={bgRef}
          src="/platforms/aiforbiodiversity/hero-bg-image.png"
          alt=""
          className="afb-hero-bg"
          aria-hidden="true"
        />

        {/* Layer 1 — bottom gradient for readability */}
        <div className="afb-hero-vignette" aria-hidden="true" />

        {/* Layer 2 — bird (wrapper handles centering; image is animated by GSAP) */}
        <div className="afb-bird-wrap" aria-hidden="true">
          <img
            ref={birdRef}
            src="/platforms/aiforbiodiversity/hero-bird.png"
            alt=""
            className="afb-hero-bird"
          />
        </div>

        {/* Layer 3 — heading (behind plants for depth) */}
        <div className="afb-hero-content">
          <h1 className="afb-heading">
            <span className="afb-line">
              <span className="afb-word">AI For</span>{" "}
              <span className="afb-word afb-green">Climate</span>{" "}
              <span className="afb-word">&amp;</span>
            </span>
            <span className="afb-line">
              <span className="afb-word afb-green">Biodiversity</span>
            </span>
          </h1>
        </div>

        {/* Layer 4 — foreground plants */}
        <img
          ref={plantsRef}
          src="/platforms/aiforbiodiversity/hero-plants.png"
          alt=""
          className="afb-hero-plants"
          aria-hidden="true"
        />

        {/* Layer 5 — scroll + description */}
        <div className="afb-hero-bottom">
          <button
            className="afb-scroll-btn"
            onClick={() => document.querySelector(".afb-description")?.scrollIntoView({ behavior: "smooth" })}
          >
            Scroll down
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </button>

          <p className="afb-description">
            AI for Climate is a global initiative that explores the use of today's most
            advanced technologies to mitigate the risk of environmental crises in the world
            and to activate the economy in the poverty-stricken communities around nature
            reserves.
          </p>
        </div>

      </section>
    </div>
  );
}
