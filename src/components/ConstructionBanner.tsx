"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import BorderGlow from "../../components/reactbits/BorderGlow";

const COOKIE_NAME = "cminds_banner_ok";
const COOKIE_DAYS = 3;

function hasDismissedCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(COOKIE_NAME + "="));
}

function setDismissedCookie() {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=1; expires=${expires}; path=/; SameSite=Lax`;
}

export default function ConstructionBanner() {
  const [visible, setVisible] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasDismissedCookie()) return;
    setVisible(true);
    const el = shellRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 1.8 }
    );
  }, []);

  const dismiss = () => {
    setDismissedCookie();
    const el = shellRef.current;
    if (!el) return;
    gsap.to(el, {
      y: 60, opacity: 0, duration: 0.4, ease: "power2.in",
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return (
    <div ref={shellRef} className="cb-shell" style={{ opacity: 0 }}>
      <BorderGlow
        className="cb-border-glow"
        backgroundColor="#040314"
        borderRadius={18}
        glowRadius={34}
        edgeSensitivity={22}
        glowColor="342 85 48"
        glowIntensity={1.05}
        coneSpread={22}
        fillOpacity={0.16}
        animated
        colors={["#E31352", "#FF749F", "#FF759F"]}
      >
        <div className="cb-panel">
          <button className="cb-close" onClick={dismiss} aria-label="Close notice">
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <img src="/assets/glass/Danger.svg" alt="" className="cb-icon" draggable={false} aria-hidden="true" />
          <p className="cb-text">
            <strong>Site under construction.</strong><br />
            Some links may not work and some pages may appear incomplete.
            We&rsquo;re still working on the best experience for the new era of C&nbsp;Minds.
          </p>
        </div>
      </BorderGlow>
    </div>
  );
}
