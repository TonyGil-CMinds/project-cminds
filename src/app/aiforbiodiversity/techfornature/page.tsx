"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const BASE = "/platforms/aiforbiodiversity/initiative-tech4nature";

export default function Tech4NaturePage() {
  const pageRef      = useRef<HTMLDivElement>(null);
  const heroRef      = useRef<HTMLDivElement>(null);
  const heroBgRef    = useRef<HTMLImageElement>(null);
  const playCenterRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const router       = useRouter();
  const [cardVisible, setCardVisible] = useState(true);

  // Hide global MobileMenu on mobile
  useEffect(() => {
    document.body.classList.add("t4n-active");
    return () => document.body.classList.remove("t4n-active");
  }, []);

  // Play center follows cursor inside the hero
  useEffect(() => {
    const hero = heroRef.current;
    const el   = playCenterRef.current;
    if (!hero || !el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      xTo(e.clientX - r.left - r.width  / 2);
      yTo(e.clientY - r.top  - r.height / 2);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    hero.addEventListener("mousemove",  onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove",  onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useGSAP(() => {
    // Hero container: slides up from below
    gsap.fromTo(heroRef.current,
      { y: "100%" },
      { y: 0, duration: 1.3, ease: "power3.out" },
    );

    // Hero bg: starts oversized and settles to natural scale as the container rises
    gsap.fromTo(heroBgRef.current,
      { scale: 1.28 },
      { scale: 1, duration: 1.3, ease: "power3.out" },
    );

    // Overlay + CTAs fade in slightly after the image arrives
    gsap.fromTo(
      [heroRef.current?.querySelector(".t4n-hero-overlay"),
       heroRef.current?.querySelector(".t4n-play-center"),
       heroRef.current?.querySelector(".t4n-hero-ctas")],
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.55, stagger: 0.1 },
    );

    // Report card: slides up from below after 100ms
    gsap.fromTo(cardRef.current,
      { y: "110%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.68, ease: "power3.out", delay: 0.1 },
    );
  }, { scope: pageRef });

  // Exit: reverse of entrance — hero slides down, bg scales back up
  const goBack = () => {
    gsap.to(cardRef.current, { y: "110%", duration: 0.28, ease: "power2.in" });
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, {
      y: "100%", duration: 1.0, ease: "power3.in",
      onComplete: () => router.back(),
    });
  };

  // For non-back CTAs (video, results) that navigate elsewhere
  const exitTo = (href: string) => {
    gsap.to(cardRef.current, { y: "110%", duration: 0.28, ease: "power2.in" });
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, {
      y: "100%", duration: 1.0, ease: "power3.in",
      onComplete: () => router.push(href),
    });
  };

  const dismissCard = () => {
    gsap.to(cardRef.current, {
      y: "110%", duration: 0.42, ease: "power3.in",
      onComplete: () => setCardVisible(false),
    });
  };

  return (
    <div ref={pageRef} className="afb-page t4n-page">

      {/* Hero container */}
      <div ref={heroRef} className="t4n-hero">

        {/* Background photo */}
        <img
          ref={heroBgRef}
          src={`${BASE}/tech4nature-hero.png`}
          alt="Tech4Nature México"
          className="t4n-hero-bg"
        />

        {/* Gradient overlays */}
        <div className="t4n-hero-overlay" aria-hidden="true" />

        {/* Close — top right */}
        <button className="t4n-close" onClick={goBack} aria-label="Back to Initiatives">
          ×
        </button>

        {/* Center play indicator — follows cursor */}
        <div ref={playCenterRef} className="t4n-play-center">
          <img src={`${BASE}/playvideo.svg`} alt="" className="t4n-play-center-icon" />
        </div>

        {/* CTA buttons — bottom left */}
        <div className="t4n-hero-ctas">
          <button className="t4n-cta-btn t4n-cta-btn--filled" onClick={() => exitTo("#video")}>
            <img src={`${BASE}/playvideo.svg`} alt="" className="t4n-cta-icon" />
            See Video
          </button>
          <button className="t4n-cta-btn t4n-cta-btn--outline" onClick={() => exitTo("#results")}>
            See Results
            <img src={`${BASE}/arrowDown.svg`} alt="" className="t4n-cta-icon" />
          </button>
        </div>

      </div>

      {/* Report card — fixed bottom-right */}
      {cardVisible && (
        <div ref={cardRef} className="t4n-report-card">
          <button className="t4n-report-close" onClick={dismissCard} aria-label="Close">×</button>
          <img src={`${BASE}/report1.png`} alt="" className="t4n-report-image" />
          <div className="t4n-report-body">
            <span className="t4n-report-chip">PHASE I</span>
            <p className="t4n-report-title">Ethical Use of AI Systems for Biodiversity...</p>
            <button className="t4n-report-cta">Download Report</button>
          </div>
        </div>
      )}

    </div>
  );
}
