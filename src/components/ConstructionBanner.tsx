"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export default function ConstructionBanner() {
  const [visible, setVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    // Slide in from below after a short delay so it doesn't compete with page animations
    gsap.fromTo(
      el,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 1.8 }
    );
  }, []);

  const dismiss = () => {
    const el = bannerRef.current;
    if (!el) return;
    gsap.to(el, {
      y: 60, opacity: 0, duration: 0.4, ease: "power2.in",
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return (
    <div ref={bannerRef} className="cb-wrap" style={{ opacity: 0 }}>
      <svg className="cb-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2a1 1 0 0 1 .894.553L13.618 8H17a1 1 0 0 1 0 2h-.382l-1 6H4.382l-1-6H3a1 1 0 0 1 0-2h3.382l2.724-5.447A1 1 0 0 1 10 2Z" fill="currentColor" opacity=".25"/>
        <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" opacity=".6"/>
        <path d="M2 15.5A1.5 1.5 0 0 1 3.5 14h13a1.5 1.5 0 0 1 0 3h-13A1.5 1.5 0 0 1 2 15.5Z" fill="currentColor"/>
        <path d="M7 9V5.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <p className="cb-text">
        <strong>Site under construction.</strong><br />
        Some links may not work and some pages may appear incomplete.
        We&rsquo;re still working on the best experience for the new era of C&nbsp;Minds.
      </p>
      <button className="cb-close" onClick={dismiss} aria-label="Cerrar aviso">
        <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
