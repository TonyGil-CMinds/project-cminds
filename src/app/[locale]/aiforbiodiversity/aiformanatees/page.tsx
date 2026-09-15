"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const BASE = "/platforms/aiforbiodiversity/initiative-aiformanatees";

// Flip to true once the report is ready — renders the hero report card
// and the "Download report" CTA in the info section.
const REPORT_ENABLED = false;

export default function AiForManateesPage() {
  const pageRef        = useRef<HTMLDivElement>(null);
  const heroRef        = useRef<HTMLDivElement>(null);
  const heroBgRef      = useRef<HTMLImageElement>(null);
  const infoRef        = useRef<HTMLElement>(null);
  const bodyRef1       = useRef<HTMLParagraphElement>(null);
  const bodyRef2       = useRef<HTMLParagraphElement>(null);
  const photoWrapRef   = useRef<HTMLDivElement>(null);
  const photoImgRef    = useRef<HTMLImageElement>(null);
  const feat1WrapRef   = useRef<HTMLDivElement>(null);
  const feat1ImgRef    = useRef<HTMLImageElement>(null);
  const feat2WrapRef   = useRef<HTMLDivElement>(null);
  const feat2ImgRef    = useRef<HTMLImageElement>(null);
  const partnersRef    = useRef<HTMLElement>(null);
  const logosWrapRef   = useRef<HTMLDivElement>(null);
  const transitionRef  = useRef<HTMLDivElement>(null);
  const barFillRef     = useRef<HTMLDivElement>(null);
  const router         = useRouter();

  const [activePartnerTab, setActivePartnerTab] = useState("partners");

  const PARTNER_TABS = [
    {
      id: "partners", label: "PARTNERS AND OBSERVERS",
      logos: [
        { src: `${BASE}/partner-uchule-1.svg`,  alt: "UCHULE" },
        { src: `${BASE}/partner-ecosur-2.svg`,  alt: "ECOSUR" },
        { src: `${BASE}/partner-dolphin-3.svg`, alt: "Dolphin" },
        { src: `${BASE}/partner-cesco-4.svg`,   alt: "CESCO" },
        { src: `${BASE}/partner-google-5.svg`,  alt: "Google" },
      ],
    },
  ];

  const handleTabChange = (id: string) => {
    if (id === activePartnerTab) return;
    const wrap = logosWrapRef.current;
    if (!wrap) { setActivePartnerTab(id); return; }
    gsap.to(wrap, {
      opacity: 0, y: -10, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActivePartnerTab(id);
        gsap.fromTo(wrap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
      },
    });
  };

  // Scroll-gate: wheel on desktop, tap on touch
  useEffect(() => {
    const el   = transitionRef.current;
    const fill = barFillRef.current;
    if (!el || !fill) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      let navigating = false;
      const onTap = () => {
        if (navigating) return;
        const partnersBottom = partnersRef.current?.getBoundingClientRect().bottom ?? 1;
        if (partnersBottom > 0) return;
        navigating = true;
        gsap.to(el, { opacity: 0, duration: 0.35, onComplete: () => router.push("/aiforbiodiversity/vitaloceans") });
      };
      el.addEventListener("click", onTap);
      return () => el.removeEventListener("click", onTap);
    }

    let locked = false, lockScrollY = 0, progress = 0, navigating = false;
    let drainId: ReturnType<typeof setTimeout> | null = null;

    const lock   = () => { locked = true; lockScrollY = window.scrollY; };
    const unlock = () => {
      locked = false; progress = 0;
      if (drainId) clearTimeout(drainId);
      gsap.to(fill, { scaleY: 0, duration: 0.15, ease: "power2.out" });
    };

    const onScroll = () => {
      if (navigating) return;
      if (locked) { window.scrollTo({ top: lockScrollY, behavior: "instant" }); return; }
      if ((partnersRef.current?.getBoundingClientRect().bottom ?? 1) <= 0) lock();
    };

    const onWheel = (e: WheelEvent) => {
      if (navigating) { e.preventDefault(); return; }
      if (!locked) {
        if (e.deltaY > 0 && (partnersRef.current?.getBoundingClientRect().bottom ?? 1) <= 0) {
          e.preventDefault(); lock();
        }
        return;
      }
      e.preventDefault();
      if (e.deltaY < 0) { unlock(); return; }
      progress = Math.min(1, progress + e.deltaY / 600);
      gsap.killTweensOf(fill);
      gsap.to(fill, { scaleY: progress, duration: 0.22, ease: "power2.out" });
      if (drainId) clearTimeout(drainId);
      drainId = setTimeout(() => {
        if (navigating) return;
        progress = 0;
        gsap.to(fill, { scaleY: 0, duration: 0.18, ease: "power2.out" });
      }, 700);
      if (progress >= 1) {
        navigating = true;
        if (drainId) clearTimeout(drainId);
        gsap.to(el, { opacity: 0, duration: 0.45, onComplete: () => router.push("/aiforbiodiversity/vitaloceans") });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      if (drainId) clearTimeout(drainId);
    };
  }, [router]);

  // Info body paragraphs: word-by-word line animation, run independently on each <p>
  useEffect(() => {
    const paragraphs = [bodyRef1.current, bodyRef2.current].filter(
      (el): el is HTMLParagraphElement => Boolean(el),
    );
    if (!paragraphs.length) return;

    const cleanups: Array<() => void> = [];

    paragraphs.forEach(el => {
      const originalHTML = el.innerHTML;
      el.innerHTML = el.innerText.split(/\s+/).filter(Boolean)
        .map(w => `<span class="ntl-body-word">${w}</span>`).join(" ");
      const words = Array.from(el.querySelectorAll<HTMLElement>(".ntl-body-word"));
      const lineMap = new Map<number, HTMLElement[]>();
      words.forEach(w => {
        const top = Math.round(w.offsetTop);
        if (!lineMap.has(top)) lineMap.set(top, []);
        lineMap.get(top)!.push(w);
      });
      gsap.set(words, { opacity: 0, y: 28 });
      Array.from(lineMap.values()).forEach((line, i) => {
        gsap.to(line, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", delay: i * 0.09,
          scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      cleanups.push(() => { el.innerHTML = originalHTML; });
    });

    return () => { cleanups.forEach(fn => fn()); };
  }, []);

  useEffect(() => {
    document.body.classList.add("t4n-active");
    return () => document.body.classList.remove("t4n-active");
  }, []);

  useGSAP(() => {
    // ── Hero entrance ──
    gsap.fromTo(heroRef.current, { y: "100%" }, { y: 0, duration: 1.3, ease: "power3.out" });
    gsap.fromTo(heroBgRef.current, { scale: 1.28 }, { scale: 1, duration: 1.3, ease: "power3.out" });
    gsap.fromTo(
      heroRef.current?.querySelector(".vo-hero-overlay"),
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.55 },
    );

    // ── Info section ──
    const ist = { trigger: infoRef.current, start: "top 82%" };
    gsap.fromTo(infoRef.current?.querySelector(".ntl-info-top"),
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", scrollTrigger: ist });

    // ── Photo: zoom-reveal ──
    const pst = { trigger: photoWrapRef.current, start: "top 80%" };
    gsap.fromTo(photoWrapRef.current,
      { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: pst });
    gsap.fromTo(photoImgRef.current,
      { scale: 1.32 }, { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: pst });

    // ── Feature images: zoom-reveal ──
    const f1st = { trigger: feat1WrapRef.current, start: "top 80%" };
    gsap.fromTo(feat1WrapRef.current,
      { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: f1st });
    gsap.fromTo(feat1ImgRef.current,
      { scale: 1.32 }, { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: f1st });

    const f2st = { trigger: feat2WrapRef.current, start: "top 80%" };
    gsap.fromTo(feat2WrapRef.current,
      { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: f2st });
    gsap.fromTo(feat2ImgRef.current,
      { scale: 1.32 }, { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: f2st });

    // ── Partners ──
    const partst = { trigger: partnersRef.current, start: "top 85%" };
    gsap.fromTo(partnersRef.current?.querySelector(".t4n-partners-tabs"),
      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", scrollTrigger: partst });
    gsap.fromTo(logosWrapRef.current,
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.15, scrollTrigger: partst });

    // ── Transition card grows with scroll as partners slides away ──
    const tShell = transitionRef.current?.parentElement;
    const tCard  = transitionRef.current?.querySelector<HTMLElement>(".t4n-transition-card");
    if (tShell && tCard) {
      gsap.fromTo(tCard, { scale: 0.6 }, {
        scale: 1.0, ease: "none",
        scrollTrigger: { trigger: tShell, start: "top top", end: () => "+=" + window.innerHeight, scrub: 1.2 },
      });
    }
  }, { scope: pageRef });

  const goBack = () => {
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, { y: "100%", duration: 1.0, ease: "power3.in", onComplete: () => router.back() });
  };

  return (
    <div ref={pageRef} className="afb-page ntl-page">

      {/* ── Hero (static image, not clickable) ── */}
      <div ref={heroRef} className="t4n-hero ntl-hero">
        <img ref={heroBgRef} src={`${BASE}/hero-manatees.png`} alt="AI For Manatees" className="t4n-hero-bg" />
        <div className="vo-hero-overlay" aria-hidden="true" />
        <button className="t4n-close" onClick={goBack} aria-label="Back">×</button>

        {REPORT_ENABLED && (
          <div className="afm-report-card">
            <img
              src="/platforms/aiforbiodiversity/hero-featured-report-image.avif"
              alt="AI4Manatees report cover"
              className="afm-report-image"
            />
            <div className="afm-report-body">
              <p className="afm-report-title">AI4Manatees: A Machine Learning Approach...</p>
              <span className="afm-report-cta">
                Download report
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 2v8m0 0L3.5 6.5M7 10l3.5-3.5M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Info section ── */}
      <section ref={infoRef} className="ntl-info">
        <div className="ntl-info-top">
          <div className="ntl-info-left">
            <img src={`${BASE}/logo-aiformanatees.svg`} alt="AI For Manatees" className="ntl-info-logo afm-info-logo" />
            <span className="ntl-info-location">
              <img src="/platforms/aiforbiodiversity/initiative-tech4nature/location.svg" alt="" width="16" height="16" />
              Latin America and Caribbean
            </span>
          </div>
          <div className="ntl-info-right">
            <p className="ntl-info-tagline">
              A Machine Learning Approach to better understand and protect manatees in Latin America and the Caribbean
            </p>
            {REPORT_ENABLED && (
              <button className="ntl-info-cta">
                Download report
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 2v8m0 0L3.5 6.5M7 10l3.5-3.5M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        <p ref={bodyRef1} className="ntl-info-body">
          AI 4 Manatees is a multi-sectoral alliance that aims to accelerate the conservation of manatee populations in the Caribbean, and regions in Central and South America.
        </p>
        <p ref={bodyRef2} className="ntl-info-body">
          By building a mechanism for analyzing manatee vocalizations from submarine audio recordings harnessing the power of AI systems, we will produce tools that allow researchers and conservation practitioners to better understand manatees&apos; behavior and communication patterns.
        </p>
      </section>

      {/* ── Photo ── */}
      <section className="ntl-photo-section">
        <div ref={photoWrapRef} className="ntl-photo-wrap">
          <img ref={photoImgRef} src={`${BASE}/image-info.png`} alt="AI For Manatees" className="ntl-photo-img" />
        </div>
      </section>

      {/* ── Feature sections (no chips, no links) ── */}
      <div className="ntl-feature ntl-feature--natura500">
        <div className="ntl-feature-inner">
          <div ref={feat1WrapRef} className="ntl-feature-img-wrap">
            <img ref={feat1ImgRef} src={`${BASE}/image-section-1.png`} alt="AI For Manatees" className="ntl-feature-img" />
          </div>
        </div>
      </div>
      <div className="ntl-feature ntl-feature--studio">
        <div className="ntl-feature-inner">
          <div ref={feat2WrapRef} className="ntl-feature-img-wrap">
            <img ref={feat2ImgRef} src={`${BASE}/image-section-2.png`} alt="AI For Manatees" className="ntl-feature-img" />
          </div>
        </div>
      </div>

      {/* ── Reveal shell ── */}
      <div className="t4n-reveal-shell">

        <div ref={transitionRef} className="t4n-transition">
          <div className="t4n-transition-card">
            <img src="/platforms/aiforbiodiversity/initiatives-naturatechlac/next-vitaloceans.png" alt="Vital Oceans" className="t4n-transition-card-img" />
            <div className="t4n-transition-card-overlay" />
            <div className="t4n-transition-card-content">
              <span className="t4n-transition-next-label">Next up...</span>
              <h2 className="t4n-transition-next-title">Vital Oceans</h2>
            </div>
          </div>
          <div className="t4n-transition-bar-track">
            <div ref={barFillRef} className="t4n-transition-bar-fill" />
          </div>
          <div className="t4n-transition-hint">
            <span>Keep scrolling!</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <section ref={partnersRef} className="t4n-partners">
          <div className="t4n-partners-tabs">
            {PARTNER_TABS.map(tab => (
              <button
                key={tab.id}
                className={`t4n-partners-tab${activePartnerTab === tab.id ? " active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div ref={logosWrapRef} className="t4n-partners-logos">
            {PARTNER_TABS.find(t => t.id === activePartnerTab)?.logos.map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="t4n-partners-logo" />
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
