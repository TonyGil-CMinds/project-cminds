"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface Slide {
  icon?: string;
  iconH?: number;
  badge?: string;
  text: string;
  href?: string;
}

interface CycleSliderProps {
  slides: Slide[];
  autoplayDelay?: number;
}

export default function CycleSlider({ slides, autoplayDelay = 4000 }: CycleSliderProps) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const [activeDot, setActiveDot] = useState(0);

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

  useEffect(() => {
    const id = setInterval(() => {
      goToSlide((activeRef.current + 1) % slides.length);
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [slides.length, autoplayDelay]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="cz-slides-track">
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            className="cz-slide"
          >
            <div className="cz-logo-badge">
              {slide.icon ? (
                <img src={slide.icon} alt="" style={{ height: slide.iconH, width: "auto", display: "block" }} />
              ) : (
                <span className="cz-slide-badge">{slide.badge}</span>
              )}
            </div>
            <p className="cz-slide-text">{slide.text}</p>
            {slide.href && (
              <a className="cz-article-link" href={slide.href} target="_blank" rel="noopener noreferrer">
                Ir al articulo →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="cz-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`cz-dot${activeDot === i ? " cz-dot--active" : ""}`}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
