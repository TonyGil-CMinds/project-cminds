"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SideRays from "../../../components/reactbits/SideRays";
const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}


export default function CareersPage() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const navItemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const navLightRef   = useRef<HTMLDivElement>(null);
  const [hoverNav, setHoverNav]             = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [primaryColor, setPrimaryColor]     = useState('#5EC1F3');
  const router        = useRouter();

  useLayoutEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
    if (match) {
      const hex = decodeURIComponent(match[1]);
      if (VALID_COLORS.includes(hex)) {
        document.documentElement.style.setProperty("--color-primary", hex);
        document.documentElement.style.setProperty("--color-primary-rgb", hexToRgb(hex));
        setPrimaryColor(hex);
      }
    }
  }, []);

  useEffect(() => {
    const activeIdx = 3; // "Careers" is index 3
    const targetIdx = hoverNav !== null ? hoverNav : activeIdx;
    const el = navItemRefs.current[targetIdx];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [hoverNav]);

  const navigateWithTransition = (path: string) => {
    sessionStorage.setItem("vt_from", "careers");
    const doNavigate = () => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => { router.push(path); });
        });
      } else {
        router.push(path);
      }
    };
    gsap.to([".careers-pill", ".careers-word", ".careers-sub", ".careers-ctas"], {
      opacity: 0, y: -16, filter: "blur(8px)",
      duration: 0.25, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  useGSAP(() => {
    gsap.fromTo(".careers-pill",
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", delay: 0.3 }
    );
    gsap.fromTo(".careers-word",
      { opacity: 0, y: 36, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.1, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(".careers-sub",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 0.85 }
    );
    gsap.fromTo(".careers-ctas",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 1.05 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="careers-page">
      <div className="careers-glow" />

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigateWithTransition("/")}>
          <img src="/logo.svg" alt="C Minds" />
        </div>
        <div className="nav-menu" onMouseLeave={() => setHoverNav(null)}>
          <div className="nav-menu-light" ref={navLightRef} style={indicatorStyle} />
          {NAV_ITEMS.map((item, idx) => (
            <div
              key={item}
              ref={(el) => { navItemRefs.current[idx] = el; }}
              className={`nav-item${item === "Careers" ? " active" : ""}`}
              onMouseEnter={() => setHoverNav(idx)}
              onClick={() => {
                if (item === "Home") navigateWithTransition("/");
                if (item === "Core") navigateWithTransition("/core");
                if (item === "Mindscope ®") navigateWithTransition("/mindscope");
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <button className="hero-button nav-contact">Contact us</button>
      </nav>

      {/* Hero */}
      <section className="careers-hero">
        {/* SideRays ambient light */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <SideRays
            speed={2.5}
            rayColor1={primaryColor}
            rayColor2="#96c8ff"
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1.0}
          />
        </div>
        <div className="careers-hero-inner">


          <h1 className="careers-h1">
            <span className="careers-word">Shape the frontiers</span>
            <span className="careers-word careers-word-accent">of collective intelligence</span>
          </h1>

          <p className="careers-sub">
            We build at the intersection of technology, governance, and human potential.
            Join a team that turns ambition into systemic change.
          </p>

          <div className="careers-ctas">
            <button
              className="hero-button careers-btn-primary"
              onClick={() => navigateWithTransition("/")}
            >
              See open roles
            </button>
            <button className="careers-btn-ghost">
              Contact us
            </button>
          </div>
        </div>

        {/* Ambient stats row */}
        <div className="careers-stats careers-ctas">
          <div className="careers-stat">
            <span className="careers-stat-n">12+</span>
            <span className="careers-stat-l">Countries</span>
          </div>
          <div className="careers-stat-divider" />
          <div className="careers-stat">
            <span className="careers-stat-n">40+</span>
            <span className="careers-stat-l">Team members</span>
          </div>
          <div className="careers-stat-divider" />
          <div className="careers-stat">
            <span className="careers-stat-n">100%</span>
            <span className="careers-stat-l">Mission-driven</span>
          </div>
        </div>
      </section>
    </div>
  );
}
