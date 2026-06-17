"use client";

import { useRef, useLayoutEffect, startTransition } from "react";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function CorePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreItemRef = useRef<HTMLDivElement>(null);
  const navLightRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Apply color from cookie + position nav indicator — both before first paint
  useLayoutEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
    if (match) {
      const hex = decodeURIComponent(match[1]);
      if (VALID_COLORS.includes(hex)) {
        document.documentElement.style.setProperty("--color-primary", hex);
        document.documentElement.style.setProperty("--color-primary-rgb", hexToRgb(hex));
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (!coreItemRef.current || !navLightRef.current) return;
    const item = coreItemRef.current;
    const parent = item.parentElement!;
    const itemRect = item.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    navLightRef.current.style.left = `${itemRect.left - parentRect.left}px`;
    navLightRef.current.style.width = `${itemRect.width}px`;
  }, []);

  const navigateWithTransition = (path: string) => {
    sessionStorage.setItem("vt_from", "core");
    const doNavigate = () => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => { router.push(path); });
        });
      } else {
        router.push(path);
      }
    };
    gsap.to([".core-pill", ".core-word", ".core-para-text", ".core-scroll-btn"], {
      opacity: 0, y: -22, filter: "blur(8px)",
      duration: 0.28, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  useGSAP(() => {
    // Orbit: fromTo with xPercent/yPercent so GSAP owns the centering math correctly.
    // The CSS sets the same initial position as the home orbit (top:50% left:50% 100vw×100vh),
    // and GSAP immediately applies the "from" state (immediateRender:true by default) so the
    // view transition captures the orbit at viewport center before the first paint.
    gsap.fromTo(".core-orbit-wrap",
      { xPercent: -50, yPercent: -50, scale: 1 },
      { xPercent: -50, yPercent: -50, scale: 0.68, y: "74vh",
        duration: 1.55, ease: "power3.inOut", delay: 0.05 }
    );

    // Content stagger — always runs
    gsap.fromTo(".core-pill",
      { opacity: 0, y: 20, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", delay: 0.35 }
    );
    gsap.fromTo(".core-word",
      { opacity: 0, y: 36, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.11, ease: "power3.out", delay: 0.55 }
    );
    gsap.fromTo(".core-para-text",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 0.95 }
    );
    gsap.fromTo(".core-scroll-btn",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 1.2 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="core-page">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigateWithTransition("/")}>
          <img src="/logo.svg" alt="C Minds" />
        </div>
        <div className="nav-menu">
          <div className="nav-menu-light" ref={navLightRef} />
          {NAV_ITEMS.map((item) => (
            <div
              key={item}
              ref={item === "Core" ? coreItemRef : undefined}
              className={`nav-item${item === "Core" ? " active" : ""}`}
              onClick={() => {
                if (item === "Home") navigateWithTransition("/");
                if (item === "Mindscope ®") navigateWithTransition("/mindscope");
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <button className="hero-button nav-contact">Contact us</button>
      </nav>

      {/* Hero content */}
      <div className="core-hero-content">
        <div className="core-pill">
          <span style={{ color: "var(--color-primary)" }}>•</span> Core
        </div>

        <h1 className="core-h1">
          <span className="core-word">We are.</span>
          {" "}
          <span className="core-word core-still">Still</span>
        </h1>

        <p className="core-para-text">
          C Minds is a systemic innovation action tank that integrates technological,
          financial, business, and governance frontiers to drive new logics and strategies
          aimed at equitable prosperity and biodiversity conservation.
        </p>

        <button
          className="hero-button core-scroll-btn"
          style={{ padding: "0.9rem 2rem", opacity: 0 }}
        >
          Scroll down ↓
        </button>
      </div>

      {/* Orbital SVG */}
      <div className="core-orbit-wrap">
        <svg viewBox="0 0 1213 616" fill="none" xmlns="http://www.w3.org/2000/svg" className="orbit-svg">
          <defs>
            <linearGradient id="cp0" x1="521.78" y1="0.250021" x2="521.78" y2="615.354" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp1" x1="365.142" y1="0.250004" x2="365.142" y2="615.354" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp2" x1="307.552" y1="0.249998" x2="307.552" y2="615.354" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp3" x1="365.142" y1="0.250004" x2="365.142" y2="615.354" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp4" x1="521.78" y1="0.250021" x2="521.78" y2="615.354" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp5" x1="614.853" y1="349.214" x2="702.05" y2="341.281" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp6" x1="1225.65" y1="391.256" x2="614.793" y2="257.092" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="0.583254" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cp7" x1="1212.11" y1="303.113" x2="597.504" y2="312.476" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="0.529596" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
            <path id="co1" d="M521.78 0.250021C470.377 0.250015 428.706 137.946 428.706 307.802C428.706 477.658 470.376 615.354 521.78 615.354C573.183 615.354 614.853 477.658 614.853 307.802C614.853 137.946 573.183 0.250026 521.78 0.250021Z" />
            <path id="co2" d="M365.142 0.250004C227.238 0.249989 115.445 137.946 115.445 307.802C115.445 477.658 227.238 615.354 365.142 615.354C503.046 615.354 614.839 477.658 614.839 307.802C614.839 137.946 503.046 0.250019 365.142 0.250004Z" />
            <path id="co3" d="M307.552 0.249998C137.834 0.24998 0.250097 137.946 0.250084 307.802C0.250071 477.658 137.834 615.354 307.552 615.354C477.27 615.354 614.853 477.658 614.853 307.802C614.853 137.946 477.27 0.250016 307.552 0.249998Z" />
            <path id="co4" d="M777.421 0.250074C687.637 0.250065 614.853 137.946 614.853 307.802C614.853 477.658 687.637 615.354 777.421 615.354C867.205 615.354 939.989 477.658 939.989 307.802C939.989 137.946 867.205 0.250084 777.421 0.250074Z" />
            <path id="co5" d="M857.047 0.250066C723.279 0.250052 614.839 137.946 614.839 307.802C614.839 477.658 723.279 615.354 857.047 615.354C990.816 615.354 1099.26 477.658 1099.26 307.802C1099.26 137.946 990.816 0.25008 857.047 0.250066Z" />
            <path id="co6" d="M904.806 0.250065C735.088 0.25005 597.504 137.946 597.504 307.802C597.504 477.658 735.088 615.354 904.806 615.354C1074.52 615.354 1212.11 477.658 1212.11 307.802C1212.11 137.946 1074.52 0.25008 904.806 0.250065Z" />
          </defs>
          <g opacity="0.8">
            <use href="#co1" stroke="url(#cp0)" strokeWidth="0.5" strokeMiterlimit="10" />
            <use href="#co2" stroke="url(#cp1)" strokeWidth="0.5" strokeMiterlimit="10" />
            <use href="#co3" stroke="url(#cp2)" strokeWidth="0.5" strokeMiterlimit="10" />
            <use href="#co2" fill="url(#cp3)" opacity="0.05" />
            <use href="#co1" fill="url(#cp4)" opacity="0.05" />
            <use href="#co4" stroke="url(#cp5)" strokeWidth="0.5" strokeMiterlimit="10" />
            <use href="#co5" stroke="url(#cp6)" strokeWidth="0.5" strokeMiterlimit="10" />
            <use href="#co6" stroke="url(#cp7)" strokeWidth="0.5" strokeMiterlimit="10" />
          </g>
          <circle r="4.5" fill="var(--color-primary)" opacity="0.9">
            <animateMotion dur="20s" repeatCount="indefinite" begin="0s"><mpath href="#co2" /></animateMotion>
          </circle>
          <circle r="3.5" fill="white" opacity="0.7">
            <animateMotion dur="35s" repeatCount="indefinite" begin="-5s"><mpath href="#co6" /></animateMotion>
          </circle>
          <circle r="2.5" fill="var(--color-primary)" opacity="0.5">
            <animateMotion dur="25s" repeatCount="indefinite" begin="-10s"><mpath href="#co4" /></animateMotion>
          </circle>
          <circle r="5.5" fill="white" opacity="0.6">
            <animateMotion dur="40s" repeatCount="indefinite" begin="-20s"><mpath href="#co1" /></animateMotion>
          </circle>
        </svg>
      </div>
    </div>
  );
}
