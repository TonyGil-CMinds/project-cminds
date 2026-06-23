"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUOTE = "Bridging worlds. The future needs translators who can connect science with policy, Indigenous wisdom with innovation, and finance with regeneration. Real impact happens in between.".split(" ");

const SLIDES = [
  {
    icon: "/core/forbes.svg",
    iconH: 22,
    text: "Recognized by Forbes México and NTT DATA as a leader in AI 2024, highlighting her role in advancing AI in Mexico.",
  },
  {
    icon: "/core/wef.svg",
    iconH: 30,
    text: "Recognized by the WEF as a Global Shaper",
  },
  {
    icon: "/core/govuk.svg",
    iconH: 14,
    text: "Recognized by the UK Government as an International Leader",
  },
  {
    icon: "/core/parispeace.svg",
    iconH: 26,
    text: "Have won the Paris Peace Forum Award for one of the 10 most promising initiatives.",
  },
];

export default function ConstanzaSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef   = useRef(0);
  const [activeDot, setActiveDot] = useState(0);

  // Set initial opacity of all slides
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 16 });
    });
  }, []);

  const goToSlide = (next: number) => {
    const cur   = activeRef.current;
    const curEl = slideRefs.current[cur];
    const nxtEl = slideRefs.current[next];
    if (!curEl || !nxtEl || cur === next) return;

    // Kill any running tweens and immediately hide bystander slides
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      if (i !== cur && i !== next) gsap.set(el, { opacity: 0, y: 16 });
    });

    gsap.to(curEl, { opacity: 0, y: -14, duration: 0.35, ease: "power2.in" });
    gsap.fromTo(nxtEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.25 });
    activeRef.current = next;
    setActiveDot(next);
  };

  // Auto-play
  useEffect(() => {
    const id = setInterval(() => {
      goToSlide((activeRef.current + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-triggered entrance animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
    });

    tl.fromTo(".cz-name",          { opacity: 0, y: 28, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0)
      .fromTo(".cz-founder-title", { opacity: 0, y: 16 },                        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.18)
      .fromTo(".cz-bio",           { opacity: 0, y: 16 },                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },  0.32)
      .fromTo(".cz-slider",        { opacity: 0, x: 28, filter: "blur(8px)" },   { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0.2);

    const qtl = gsap.timeline({
      scrollTrigger: { trigger: ".cz-bottom", start: "top 82%", toggleActions: "play none none none" },
    });

    qtl.fromTo(".cz-quote-mark", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
       .fromTo(".cz-quote-word",
         { opacity: 0, x: -38 },
         { opacity: 1, x: 0, duration: 0.45, stagger: 0.035, ease: "power3.out" },
         0.1
       );

    return () => { tl.kill(); qtl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="cz-section">
      <div className="cz-bg" />

      {/* ── Top 100vh: text + slider ── */}
      <div className="cz-top">
        <div className="cz-left">
          <div className="cz-left-head">
            <h2 className="cz-name" style={{ opacity: 0 }}>Constanza<br />Gómez Mont</h2>
            <p className="cz-founder-title" style={{ opacity: 0 }}>Founder</p>
          </div>
          <p className="cz-bio" style={{ opacity: 0 }}>
            Founder & CEO of C Minds, AI ethics strategist, and social entrepreneur advancing responsible technology and AI for good in emerging economies.
          </p>
        </div>

        {/* Slider */}
        <div className="cz-slider" style={{ opacity: 0 }}>
          <div className="cz-slides-track">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                ref={(el) => { slideRefs.current[i] = el; }}
                className="cz-slide"
              >
                <div className="cz-logo-badge">
                  <img src={slide.icon} alt="" style={{ height: slide.iconH, width: "auto", display: "block" }} />
                </div>
                <p className="cz-slide-text">{slide.text}</p>
              </div>
            ))}
          </div>

          <div className="cz-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`cz-dot${activeDot === i ? " cz-dot--active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Reconocimiento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Photo ── */}
      <img
        src="/core/constanzaGM.png"
        alt="Constanza Gómez Mont"
        className="cz-photo"
        draggable={false}
      />

      {/* ── Bottom 50vh: quote ── */}
      <div className="cz-bottom">
        <div className="cz-divider" />
        <div className="cz-quote-wrap">
          <p className="cz-quote-text">
            {QUOTE.map((word, i) => (
              <span key={i} className="cz-quote-word">{word}&nbsp;</span>
            ))}
          </p>
          <span className="cz-quote-mark" style={{ opacity: 0 }}>&rdquo;</span>
        </div>
      </div>
    </section>
  );
}
