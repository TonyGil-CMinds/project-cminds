"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const BASE = "/platforms/aiforbiodiversity/initiatives-naturatechlac";

export default function NaturaTechLACPage() {
  const pageRef        = useRef<HTMLDivElement>(null);
  const heroRef        = useRef<HTMLDivElement>(null);
  const heroBgRef      = useRef<HTMLImageElement>(null);
  const playCenterRef  = useRef<HTMLDivElement>(null);
  const infoRef        = useRef<HTMLElement>(null);
  const bodyRef        = useRef<HTMLParagraphElement>(null);
  const photoWrapRef   = useRef<HTMLDivElement>(null);
  const photoImgRef    = useRef<HTMLImageElement>(null);
  const cardsRef       = useRef<HTMLAnchorElement>(null);
  const feat1WrapRef   = useRef<HTMLDivElement>(null);
  const feat1ImgRef    = useRef<HTMLImageElement>(null);
  const feat2WrapRef   = useRef<HTMLDivElement>(null);
  const feat2ImgRef    = useRef<HTMLImageElement>(null);
  const partnersRef    = useRef<HTMLElement>(null);
  const logosWrapRef   = useRef<HTMLDivElement>(null);
  const transitionRef  = useRef<HTMLDivElement>(null);
  const barFillRef     = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const router         = useRouter();

  const [activePartnerTab, setActivePartnerTab] = useState("ledby");

  const PARTNER_TABS = [
    {
      id: "ledby", label: "LED BY",
      logos: [
        { src: `${BASE}/ledby-bidlab-1.svg`, alt: "BID LAB" },
        { src: `${BASE}/ledby-cminds-2.svg`, alt: "C Minds" },
      ],
    },
    {
      id: "funding", label: "FUNDING PARTNERS",
      logos: [
        { src: `${BASE}/fundingpartners-suecia-1.svg`,           alt: "Suecia" },
        { src: `${BASE}/fundingpartners-france-2.svg`,            alt: "France" },
        { src: `${BASE}/fundingpartners-amazonia-3.svg`,          alt: "Amazonia" },
        { src: `${BASE}/fundingpartners-climatecollective-4.svg`, alt: "Climate Collective" },
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

  // Play center follows cursor inside hero
  useEffect(() => {
    const hero = heroRef.current;
    const el   = playCenterRef.current;
    if (!hero || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power2.out" });
    const onMove  = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      xTo(e.clientX - r.left - r.width / 2);
      yTo(e.clientY - r.top  - r.height / 2);
    };
    const onLeave = () => { xTo(0); yTo(0); };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Body paragraph: word-by-word line animation
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
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
    return () => { el.innerHTML = originalHTML; };
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
      [heroRef.current?.querySelector(".ntl-hero-overlay"), playCenterRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.55, stagger: 0.1 },
    );

    // ── Info section ──
    const ist = { trigger: infoRef.current, start: "top 82%" };
    gsap.fromTo(infoRef.current?.querySelector(".ntl-info-top"),
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", scrollTrigger: ist });

    // ── Photo: zoom-reveal (same as bioscanner) ──
    const pst = { trigger: photoWrapRef.current, start: "top 80%" };
    gsap.fromTo(photoWrapRef.current,
      { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: pst });
    gsap.fromTo(photoImgRef.current,
      { scale: 1.32 }, { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: pst });

    // ── Feature images: zoom-reveal (same as photo section) ──
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

  const openVideo = () => {
    const overlay = videoOverlayRef.current;
    const video   = videoRef.current;
    if (!overlay || !video) return;
    video.currentTime = 0;
    video.volume = 1;
    gsap.killTweensOf([overlay, video]);
    gsap.set(overlay, { display: "flex", pointerEvents: "auto" });
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(video,   { scale: 0.88 }, { scale: 1, duration: 0.45, ease: "power3.out" });
    const p = video.play();
    if (p) p.catch(() => {});
  };

  const closeVideo = () => {
    const overlay = videoOverlayRef.current;
    if (!overlay) return;
    gsap.killTweensOf([overlay, videoRef.current]);
    gsap.to(videoRef.current, { scale: 0.88, duration: 0.3, ease: "power2.in" });
    gsap.to(overlay, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        gsap.set(overlay, { display: "none", pointerEvents: "none" });
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      },
    });
  };

  const goBack = () => {
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, { y: "100%", duration: 1.0, ease: "power3.in", onComplete: () => router.back() });
  };

  return (
    <div ref={pageRef} className="afb-page ntl-page">

      {/* Fullscreen video overlay */}
      <div
        ref={videoOverlayRef}
        className="t4n-video-overlay"
        style={{ display: "none", pointerEvents: "none" }}
        onClick={closeVideo}
      >
        <button className="t4n-video-close" onClick={closeVideo} aria-label="Close video">×</button>
        <video
          ref={videoRef}
          src={process.env.NEXT_PUBLIC_NTL_HERO_VIDEO_URL || undefined}
          className="t4n-video-player"
          playsInline
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* ── Hero (same structure as t4n) ── */}
      <div ref={heroRef} className="t4n-hero ntl-hero" onClick={openVideo} style={{ cursor: "pointer" }}>
        <img ref={heroBgRef} src={`${BASE}/hero.png`} alt="NaturaTech LAC" className="t4n-hero-bg" />
        <div className="ntl-hero-overlay" aria-hidden="true" />
        <button className="t4n-close" onClick={e => { e.stopPropagation(); goBack(); }} aria-label="Back">×</button>
        <div ref={playCenterRef} className="t4n-play-center">
          <img src="/platforms/aiforbiodiversity/initiative-tech4nature/playvideo.svg" alt="" className="t4n-play-center-icon" />
        </div>
      </div>

      {/* ── Info section ── */}
      <section ref={infoRef} className="ntl-info">
        <div className="ntl-info-top">
          <div className="ntl-info-left">
            <img src={`${BASE}/logo-naturatechlac.svg`} alt="NaturaTech LAC" className="ntl-info-logo" />
            <span className="ntl-info-location">
              <svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden="true">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
              </svg>
              Latin America and Caribbean
            </span>
          </div>
          <div className="ntl-info-right">
            <p className="ntl-info-tagline">
              It drives conservation through technology, innovation and biocultural knowledge.
            </p>
            <a href="https://naturatech.org" target="_blank" rel="noopener noreferrer" className="ntl-info-cta">
              See Initiative
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <p ref={bodyRef} className="ntl-info-body">
          At NaturaTech LAC, we are driven by the commitment to discover and explore the roots that emerge from territories: their stories and, above all, their innovation.
        </p>
      </section>

      {/* ── Photo (bioscanner-style zoom reveal) ── */}
      <section className="ntl-photo-section">
        <div ref={photoWrapRef} className="ntl-photo-wrap">
          <img ref={photoImgRef} src={`${BASE}/info-image.png`} alt="NaturaTech LAC fieldwork" className="ntl-photo-img" />
        </div>
      </section>

      {/* ── Feature sections: Natura500 (image left) + Studio (image right) ── */}
      <a ref={cardsRef} href="https://500.naturatech.org" target="_blank" rel="noopener noreferrer" className="ntl-feature ntl-feature--natura500">
        <div className="ntl-feature-inner">
          <div ref={feat1WrapRef} className="ntl-feature-img-wrap">
            <img ref={feat1ImgRef} src={`${BASE}/natura500.png`} alt="Natura500" className="ntl-feature-img" />
          </div>
          <span className="ntl-feature-label">Natura500</span>
        </div>
      </a>
      <a href="https://naturatech.org/studio" target="_blank" rel="noopener noreferrer" className="ntl-feature ntl-feature--studio">
        <div className="ntl-feature-inner">
          <div ref={feat2WrapRef} className="ntl-feature-img-wrap">
            <img ref={feat2ImgRef} src={`${BASE}/studio.png`} alt="ScaleUp Studio" className="ntl-feature-img" />
          </div>
          <span className="ntl-feature-label">ScaleUp Studio</span>
        </div>
      </a>

      {/* ── Reveal shell ── */}
      <div className="t4n-reveal-shell">

        <div ref={transitionRef} className="t4n-transition">
          <div className="t4n-transition-card">
            <img src={`${BASE}/next-vitaloceans.png`} alt="Vital Oceans" className="t4n-transition-card-img" />
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
