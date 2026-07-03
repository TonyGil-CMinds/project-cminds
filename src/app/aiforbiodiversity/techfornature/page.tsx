"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const BASE = "/platforms/aiforbiodiversity/initiative-tech4nature";

export default function Tech4NaturePage() {
  const pageRef       = useRef<HTMLDivElement>(null);
  const heroRef       = useRef<HTMLDivElement>(null);
  const heroBgRef     = useRef<HTMLImageElement>(null);
  const playCenterRef = useRef<HTMLDivElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const infoRef       = useRef<HTMLElement>(null);
  const bodyRef       = useRef<HTMLHeadingElement>(null);
  const router        = useRouter();
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

  // Body paragraph: split into word spans, animate per line on scroll
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    // Preserve strong tags by working with the raw innerHTML
    const originalHTML = el.innerHTML;

    // Flatten to plain text, wrapping each word
    const text = el.innerText;
    el.innerHTML = text
      .split(/\s+/)
      .filter(Boolean)
      .map(w => `<span class="t4n-body-word">${w}</span>`)
      .join(" ");

    // Group word spans by their vertical position (= line)
    const words = Array.from(el.querySelectorAll<HTMLElement>(".t4n-body-word"));
    const lineMap = new Map<number, HTMLElement[]>();
    words.forEach(w => {
      const top = Math.round(w.offsetTop);
      if (!lineMap.has(top)) lineMap.set(top, []);
      lineMap.get(top)!.push(w);
    });

    const lines = Array.from(lineMap.values());

    // Set initial state immediately so there's no flash
    gsap.set(words, { opacity: 0, y: 28 });

    lines.forEach((line, i) => {
      gsap.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        delay: i * 0.09,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    return () => {
      el.innerHTML = originalHTML;
    };
  }, []);

  useGSAP(() => {
    // ── Hero entrance ──
    gsap.fromTo(heroRef.current,
      { y: "100%" },
      { y: 0, duration: 1.3, ease: "power3.out" },
    );

    gsap.fromTo(heroBgRef.current,
      { scale: 1.28 },
      { scale: 1, duration: 1.3, ease: "power3.out" },
    );

    gsap.fromTo(
      [heroRef.current?.querySelector(".t4n-hero-overlay"),
       heroRef.current?.querySelector(".t4n-play-center"),
       heroRef.current?.querySelector(".t4n-hero-ctas")],
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.55, stagger: 0.1 },
    );

    gsap.fromTo(cardRef.current,
      { y: "110%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.68, ease: "power3.out", delay: 0.1 },
    );

    // ── Info section: scroll-triggered slide-up + fade ──
    const st = { trigger: infoRef.current, start: "top 82%" };

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-meta"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", scrollTrigger: st },
    );

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-logo"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.08, scrollTrigger: st },
    );

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-location"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.16, scrollTrigger: st },
    );

    const rightChildren = infoRef.current?.querySelectorAll(".t4n-info-right > *");
    if (rightChildren?.length) {
      gsap.fromTo(rightChildren,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: 0.1, scrollTrigger: st },
      );
    }
  }, { scope: pageRef });

  // Exit: reverse of entrance
  const goBack = () => {
    gsap.to(cardRef.current, { y: "110%", duration: 0.28, ease: "power2.in" });
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, {
      y: "100%", duration: 1.0, ease: "power3.in",
      onComplete: () => router.back(),
    });
  };

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

        <img
          ref={heroBgRef}
          src={`${BASE}/tech4nature-hero.png`}
          alt="Tech4Nature México"
          className="t4n-hero-bg"
        />

        <div className="t4n-hero-overlay" aria-hidden="true" />

        <button className="t4n-close" onClick={goBack} aria-label="Back to Initiatives">
          ×
        </button>

        <div ref={playCenterRef} className="t4n-play-center">
          <img src={`${BASE}/playvideo.svg`} alt="" className="t4n-play-center-icon" />
        </div>

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

      {/* ── Info section ── */}
      <section ref={infoRef} className="t4n-info">
        <div className="t4n-info-top">

          <div className="t4n-info-left">
            <div className="t4n-info-meta">
              <span className="t4n-info-chip">PHASE 1</span>
              <span className="t4n-info-date">2022 - 2024</span>
            </div>

            <img
              src={`${BASE}/logo-tech4nature.svg`}
              alt="Tech4Nature México"
              className="t4n-info-logo"
            />

            <div className="t4n-info-location">
              <img src={`${BASE}/location.svg`} alt="" className="t4n-info-loc-icon" />
              <span>Dzilam State Reserve</span>
            </div>
          </div>

          <div className="t4n-info-right">
            <h5 className="t4n-info-desc">
              A multisectoral collaboration for jaguar conservation in the Yucatán Peninsula.
            </h5>
            <button className="t4n-info-download">
              Download report
              <img src={`${BASE}/arrowDown.svg`} alt="" className="t4n-info-dl-icon" />
            </button>
          </div>

        </div>

        <h3 ref={bodyRef} className="t4n-info-body">
          <strong>Tech4Nature Mexico</strong> works to accelerate the effective conservation and
          regeneration of biodiversity and ecosystem health, strengthening monitoring, conservation,
          and understanding of the impacts of climate change on ecosystems and priority species
          in the mangrove area of the Yucatán Peninsula.
        </h3>
      </section>

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
