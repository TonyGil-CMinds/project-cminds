"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CycleSlider from "./CycleSlider";
import { useLocale } from "@/i18n/useLocale";
import { copy } from "@/app/[locale]/core/copy";

gsap.registerPlugin(ScrollTrigger);

export default function ConstanzaSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const locale = useLocale();
  const c = copy[locale].constanza;
  const QUOTE = c.quote.split(" ");
  const SLIDES = c.slides;

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

      {/* ── Top: name + bio (50vh on mobile, 100vh on desktop) ── */}
      <div className="cz-top">
        <div className="cz-left">
          <div className="cz-left-head">
            <h2 className="cz-name" style={{ opacity: 0 }}>{c.name[0]}<br />{c.name[1]}</h2>
            <p className="cz-founder-title" style={{ opacity: 0 }}>{c.title}</p>
          </div>
          <p className="cz-bio" style={{ opacity: 0 }}>
            {c.bio}
          </p>
        </div>
      </div>

      {/* ── Photo ── */}
      <img
        src="/core/constanzaGM.png"
        alt="Constanza Gómez Mont"
        className="cz-photo"
        draggable={false}
      />

      {/* ── Quote (50vh) ── */}
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

      {/* ── Slider (desktop: abs top-right; mobile: below quote) ── */}
      <div className="cz-slider" style={{ opacity: 0 }}>
        <CycleSlider
          slides={SLIDES}
          autoplayDelay={4000}
          articleLinkText={copy[locale].cycleSlider.articleLink}
          slideLabel={copy[locale].cycleSlider.slide}
        />
      </div>
    </section>
  );
}
