"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavSearch from "../../components/NavSearch";
import AfbLoader from "../../components/AfbLoader";
import AfbInitiatives from "../../components/AfbInitiatives";
import AfbOurComponents from "../../components/AfbOurComponents";
import AfbWhereWeFrom from "../../components/AfbWhereWeFrom";
import SiteFooter from "../../components/SiteFooter";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = ["HOME", "WHO WE ARE", "WHERE WE COME FROM", "INITIATIVES"];

/* Rock center is intentionally excluded — it stays visible when the loader fades,
   creating a seamless handoff from the frame sequence to the hero. */
const HERO_SELECTORS = [
  ".afb-nav-logo",
  ".afb-nav-item",
  ".afb-nav-search-wrap",
  ".afb-scan-video",
  ".afb-rock-left",
  ".afb-rock-right",
  ".afb-hero-title .afb-word",
  ".afb-hero-subtitle",
  ".afb-featured-card",
  ".afb-hero-plants",
];

const WHO_WORDS = [
  "A","global","initiative","that","explores","the","use","of",
  "today's","most","advanced","technologies","to","mitigate","the",
  "risk","of","environmental","crises","in","the","world","and","to",
  "activate","the","economy","in","the","poverty-stricken","communities",
  "around","nature","reserves.",
];

export default function AIForBiodiversityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rockLeftRef  = useRef<HTMLImageElement>(null);
  const rockRightRef = useRef<HTMLImageElement>(null);
  const plantsRef    = useRef<HTMLImageElement>(null);

  const [showLoader, setShowLoader] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  useLayoutEffect(() => {
    const seen = sessionStorage.getItem("afb-intro-done");
    if (seen) {
      setLoaderDone(true);
    } else {
      gsap.set(HERO_SELECTORS, { opacity: 0 });
      setShowLoader(true);
    }
  }, []);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem("afb-intro-done", "1");
    setShowLoader(false);
    setLoaderDone(true);
  }, []);

  /* Subtle parallax on rocks + plants */
  useEffect(() => {
    if (!loaderDone) return;
    const hero = document.querySelector(".afb-hero") as HTMLElement | null;
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const dx = ((e.clientX - left) / width  - 0.5) * 2;
      const dy = ((e.clientY - top)  / height - 0.5) * 2;

      gsap.to(rockLeftRef.current,  { x: dx * -18, y: dy * -9,  duration: 1.1, ease: "power2.out", overwrite: "auto" });
      gsap.to(rockRightRef.current, { x: dx *  18, y: dy * -8,  duration: 1.1, ease: "power2.out", overwrite: "auto" });
      gsap.to(plantsRef.current,    { x: dx * -12, y: dy * -5,  duration: 0.9, ease: "power2.out", overwrite: "auto" });
    };

    const onLeave = () => {
      gsap.to([rockLeftRef.current, rockRightRef.current, plantsRef.current], {
        x: 0, y: 0, duration: 1.6, ease: "power3.out", overwrite: "auto",
      });
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [loaderDone]);

  /* Entrance + continuous float + who-we-are scroll reveal */
  useGSAP(() => {
    if (!loaderDone) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* ── Navbar ── */
    tl.fromTo(".afb-nav-logo",
      { opacity: 0, x: -18, filter: "blur(6px)" },
      { opacity: 1, x: 0,   filter: "blur(0px)", duration: 0.6 },
      0
    );
    tl.fromTo(".afb-nav-item",
      { opacity: 0, y: -10, filter: "blur(6px)" },
      { opacity: 1, y: 0,   filter: "blur(0px)", duration: 0.5, stagger: 0.07 },
      0.1
    );
    tl.fromTo(".afb-nav-search-wrap",
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0,  duration: 0.5 },
      0.3
    );

    /* ── Scan video (rock center is already visible — no entrance animation) ── */
    tl.fromTo(".afb-scan-video",
      { opacity: 0 },
      { opacity: 1, duration: 0.9 },
      0.7
    );

    /* ── Side rocks emerge from behind center ── */
    tl.fromTo(".afb-rock-left",
      { opacity: 0, x: "22vw",  y: "10vh", scale: 0.45 },
      { opacity: 1, x: 0,       y: 0,      scale: 1, duration: 1.3, ease: "power2.out" },
      0.65
    );
    tl.fromTo(".afb-rock-right",
      { opacity: 0, x: "-22vw", y: "10vh", scale: 0.45 },
      { opacity: 1, x: 0,       y: 0,      scale: 1, duration: 1.3, ease: "power2.out" },
      0.8
    );

    /* ── Hero title ── */
    tl.fromTo(".afb-hero-title .afb-word",
      { opacity: 0, y: 44, filter: "blur(12px)" },
      { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.8, stagger: 0.08 },
      0.5
    );

    /* ── Subtitle ── */
    tl.fromTo(".afb-hero-subtitle",
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.7 },
      1.2
    );

    /* ── Featured card ── */
    tl.fromTo(".afb-featured-card",
      { opacity: 0, y: 56 },
      { opacity: 1, y: 0,  duration: 0.85, ease: "back.out(1.2)" },
      1.3
    );

    /* ── Plants ── */
    tl.fromTo(".afb-hero-plants",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0,  duration: 1.0 },
      1.5
    );

    /* ── Float loops start once rocks have landed ── */
    tl.call(() => {
      gsap.to(rockLeftRef.current, {
        y: "+=14", rotation: -1.5, scale: 1.018,
        duration: 3.2, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });
      gsap.to(rockRightRef.current, {
        y: "+=11", rotation: 1.5, scale: 1.014,
        duration: 3.8, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });
    }, [], 2.1);

    /* ── Who We Are — word-by-word scroll reveal ── */
    const words = gsap.utils.toArray<HTMLElement>(".afb-who-word");
    gsap.timeline({
      scrollTrigger: {
        trigger: ".afb-who",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.8,
      },
    }).to(words, {
      opacity: 1,
      stagger: { each: 0.06 },
      ease: "none",
    });

  }, { scope: containerRef, dependencies: [loaderDone] });

  return (
    <>
      {showLoader && <AfbLoader onComplete={handleLoaderComplete} />}

      <div ref={containerRef} className="afb-page">

        {/* ── Hero ── */}
        <section className="afb-hero">

          {/* Navbar lives inside hero so it stays in the first viewport */}
          <nav className="afb-nav">
            <img
              src="/platforms/aiforbiodiversity/logo-aiforclimate.svg"
              alt="AI for Climate"
              className="afb-nav-logo"
            />
            <div className="afb-nav-center">
              {NAV_ITEMS.map((item) => (
                <span key={item} className="afb-nav-item">{item}</span>
              ))}
            </div>
            <div className="afb-nav-search-wrap">
              <NavSearch />
            </div>
          </nav>

          <div className="afb-hero-vignette" aria-hidden="true" />

          {/* Left rock */}
          <img
            ref={rockLeftRef}
            src="/platforms/aiforbiodiversity/hero-rock-left.avif"
            alt=""
            className="afb-rock-left"
          />

          {/* Right rock */}
          <img
            ref={rockRightRef}
            src="/platforms/aiforbiodiversity/hero-rock-right.avif"
            alt=""
            className="afb-rock-right"
          />

          {/* Center island — stays at opacity 1 so it persists from loader */}
          <div className="afb-rock-center-wrap">
            <img
              src="/platforms/aiforbiodiversity/frames-loading-rock/floating-island_00063.webp"
              alt=""
              className="afb-rock-center"
            />
          </div>

          {/* Scan overlay — sibling of wrap so blend mode hits the full hero backdrop */}
          <video
            className="afb-scan-video"
            src="/platforms/aiforbiodiversity/scan.webm"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Hero title */}
          <div className="afb-hero-content">
            <h1 className="afb-hero-title">
              <span className="afb-word">Harnessing</span>{" "}
              <span className="afb-word">the</span>
              <br />
              <span className="afb-word">power</span>{" "}
              <span className="afb-word">of</span>{" "}
              <span className="afb-word">AI</span>{" "}
              <span className="afb-word">against</span>
              <br />
              <span className="afb-word afb-climate-gradient">Climate</span>{" "}
              <span className="afb-word afb-climate-gradient">Change</span>
            </h1>
          </div>

          {/* Subtitle */}
          <h5 className="afb-hero-subtitle">
            We explore the use of AI to strengthen the protection, restoration, and management
            of public and private nature reserves around the globe.
          </h5>

          {/* Featured report card */}
          <div className="afb-featured-card">
            <img
              src="/platforms/aiforbiodiversity/hero-featured-report-image.avif"
              alt="Tech4Nature México anual report 2024"
              className="afb-featured-card__image"
            />
            <div className="afb-featured-card__body">
              <p className="afb-featured-card__title">Tech4Nature México anual report 2024</p>
              <button className="afb-featured-card__cta">See last report →</button>
            </div>
          </div>

          {/* Foreground plants */}
          <img
            ref={plantsRef}
            src="/platforms/aiforbiodiversity/hero-plants.png"
            alt=""
            className="afb-hero-plants"
          />

        </section>

        {/* ── Who We Are — pinned scroll-reveal ── */}
        <section className="afb-who">
          <div className="afb-who-sticky">
            <div className="afb-who-glow" aria-hidden="true" />
            <p className="afb-who-label">WHO ARE WE</p>
            <p className="afb-who-text" aria-label="Who we are">
              {WHO_WORDS.map((word, i) => (
                <span key={i} className="afb-who-word">{word}{" "}</span>
              ))}
            </p>
          </div>
        </section>

        {/* ── Where We Come From — scroll-driven image carousel ── */}
        <AfbWhereWeFrom />

        {/* ── Our Components — scroll-driven slides ── */}
        <AfbOurComponents />

        {/* ── Initiatives — spiral / list ── */}
        <AfbInitiatives />

        {/* ── Footer ── */}
        <SiteFooter />

      </div>
    </>
  );
}
