"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../components/Loader";

gsap.registerPlugin(ScrollTrigger);

const LaserFlow = dynamic(() => import("../../components/reactbits/LaserFlow"), {
  ssr: false,
  loading: () => null,
});

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];
const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "The Archive", "Careers"];
const CYCLING_WORDS = ["Biodiversity", "Communities", "Oceans", "Cities"];
const COOKIE_KEY = "cminds_color";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const LOADER_SESSION_KEY = "cminds_loader_seen";

const getColorCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const setColorCookie = (hex: string) => {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(hex)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
};

export default function Hero() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [step, setStep] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [currentWord, setCurrentWord] = useState(CYCLING_WORDS[0]);
  const wordIndexRef = useRef(0);
  const cyclingRef = useRef<HTMLSpanElement>(null);
  const wordInitialized = useRef(false);

  // Skip onboarding if user already chose a color
  useEffect(() => {
    if (window.sessionStorage.getItem(LOADER_SESSION_KEY) === "1") {
      setLoaderDone(true);
    }

    const saved = getColorCookie();
    if (saved && COLORS.includes(saved)) {
      setColor(saved);
      setStep(3);
    }
  }, []);
  const container = useRef<HTMLDivElement>(null);

  // Nav state
  const [activeNav, setActiveNav] = useState(0);
  const [hoverNav, setHoverNav] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync globally CSS vars when color state changes
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(color));
  }, [color]);

  // Enable window scroll only after loader exits to avoid scrollbar reflow flash
  useEffect(() => {
    if (step === 3 && loaderDone) {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    } else {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';
    }
    return () => {
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
    };
  }, [step, loaderDone]);

  // Animate in each new word char-by-char (skip initial mount)
  useGSAP(() => {
    if (!wordInitialized.current) {
      wordInitialized.current = true;
      return;
    }
    if (!cyclingRef.current) return;
    const chars = cyclingRef.current.querySelectorAll<HTMLSpanElement>('.hero-char');
    gsap.fromTo(chars,
      { opacity: 0, y: 18, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.05, ease: 'power2.out' }
    );
  }, [currentWord]);

  // Cycle words while on hero — wait for loader first
  useEffect(() => {
    if (step !== 3 || !loaderDone) return;
    const id = setInterval(() => {
      if (!cyclingRef.current) return;
      const chars = cyclingRef.current.querySelectorAll<HTMLSpanElement>('.hero-char');
      gsap.to(chars, {
        opacity: 0, y: -15, filter: 'blur(10px)',
        duration: 0.35, stagger: 0.04, ease: 'power2.in',
        onComplete: () => {
          wordIndexRef.current = (wordIndexRef.current + 1) % CYCLING_WORDS.length;
          setCurrentWord(CYCLING_WORDS[wordIndexRef.current]);
        }
      });
    }, 2800);
    return () => clearInterval(id);
  }, [step, loaderDone]);

  // Sync Nav Indicator
  useEffect(() => {
    const targetIdx = hoverNav !== null ? hoverNav : activeNav;
    const targetEl = navRefs.current[targetIdx];
    if (targetEl) {
      setIndicatorStyle({
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
        opacity: 1
      });
    }
  }, [hoverNav, activeNav, step]);

  useGSAP(() => {
    if (step === 1) {
      gsap.fromTo(".step-1 .word",
        { opacity: 0, y: 20, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.12, ease: "power3.out" }
      );
      gsap.fromTo(".step-1 .hero-button",
        { opacity: 0, y: 15, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 1.3, ease: "power2.out" }
      );
    } else if (step === 2) {
      gsap.fromTo(".step-2 .word",
        { opacity: 0, filter: "blur(8px)", y: 10 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, ease: "power2.out" }
      );
      gsap.fromTo(".color-btn",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "back.out(1.5)" }
      );
      gsap.fromTo([".step-2 .hero-button", ".ommit-btn"],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 1, ease: "power2.out" }
      );
    } else if (step === 3) {
      // Hide immediately so nothing flashes before the loader exits
      gsap.set([".main-nav", ".hero-line-anim", ".hero-scroll-btn", ".laser-container", ".orbit-bg"], { opacity: 0 });
      if (!loaderDone) return;
      // Hero entrance
      gsap.fromTo(".main-nav", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      gsap.fromTo(".hero-line-anim", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".hero-scroll-btn", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1 });
      gsap.fromTo(".laser-container", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.5 });
      gsap.fromTo(".orbit-bg", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out", delay: 0.3 });

      // Core section — ScrollTrigger (window scroller)
      gsap.fromTo(".core-title",
        { opacity: 0, y: 80, filter: "blur(18px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: ".core-section", start: "top 82%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".core-divider",
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.1, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ".core-columns", start: "top 78%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".core-col",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.1, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ".core-columns", start: "top 78%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".core-btn",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".core-columns", start: "top 50%", toggleActions: "play none none reverse" }
        }
      );

      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
    }
  }, [step, loaderDone]);

  const goNextStep2 = () => {
    gsap.to(".step-1", {
      opacity: 0, y: -30, duration: 0.6, ease: "power2.in", onComplete: () => setStep(2)
    });
  };

  const goNextStep3 = () => {
    setColorCookie(color);
    gsap.to(".step-2", {
      opacity: 0, y: -30, duration: 0.6, ease: "power2.in", onComplete: () => setStep(3)
    });
  };

  const handleLoaderDone = () => {
    window.sessionStorage.setItem(LOADER_SESSION_KEY, "1");
    setLoaderDone(true);
  };

  return (
    <>
    {!loaderDone && <Loader onDone={handleLoaderDone} />}
    <main ref={container} className={`page-container${step === 3 ? " is-scrollable" : ""}`}>
      {/* Background elements visible overall */}
      <div className="bg-glow"></div>

      {/* STEP 1: WELCOME */}
      {step === 1 && (
        <div className="step-container step-1">
          <h1 className="hero-title">
            <div className="line">
              <span className="word white bold">Welcome</span>{" "}
              <span className="word dim">to</span>
            </div>
            <div className="line" style={{ marginTop: "0.1em" }}>
              <span className="word dim">a</span>{" "}
              <span className="word dim">new</span>{" "}
              <span className="word dim">era</span>{" "}
              <span className="word white bold">for</span>{" "}
              <span className="word white bold">C</span>{" "}
              <span className="word white bold">Minds</span>
            </div>
          </h1>
          <button className="hero-button" onClick={goNextStep2}>
            Press to continue
          </button>
        </div>
      )}

      {/* STEP 2: COLOR SCHEMA */}
      {step === 2 && (
        <div className="step-container step-2">
          <h2 className="hero-title" style={{ marginBottom: "3rem" }}>
            <span className="word dim">Select a</span>{" "}
            <span className="word white bold">color schema</span>
          </h2>

          <div className="color-options">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`color-btn ${color === c ? "active" : ""}`}
                style={{ "--btn-color-rgb": hexToRgb(c) } as React.CSSProperties}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>

          <button className="hero-button" onClick={goNextStep3}>
            Press to continue
          </button>
          <button className="ommit-btn" onClick={goNextStep3}>
            Ommit
          </button>
        </div>
      )}

      {/* STEP 3: MAIN HERO PAGE */}
      {step === 3 && (
        <div className="step-3">

          {/* ── Hero viewport ── */}
          <div className="hero-section">

            {/* Navigation */}
            <nav className="main-nav">
              <div className="nav-brand">
                <img src="/logo.svg" alt="C Minds Logo" />
              </div>

              <div className="nav-menu" onMouseLeave={() => setHoverNav(null)}>
                <div className="nav-menu-light" style={indicatorStyle}></div>
                {NAV_ITEMS.map((item, idx) => (
                  <div
                    key={item}
                    ref={(el) => { navRefs.current[idx] = el }}
                    className={`nav-item ${activeNav === idx ? 'active' : ''}`}
                    onMouseEnter={() => setHoverNav(idx)}
                    onClick={() => setActiveNav(idx)}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <button className="hero-button nav-contact">Contact us</button>
            </nav>

            {/* Orbit background */}
            <div className="orbit-bg">
              <svg viewBox="0 0 1213 616" fill="none" xmlns="http://www.w3.org/2000/svg" className="orbit-svg">
                <defs>
                  <linearGradient id="paint0_linear" x1="521.78" y1="0.250021" x2="521.78" y2="615.354" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="365.142" y1="0.250004" x2="365.142" y2="615.354" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="307.552" y1="0.249998" x2="307.552" y2="615.354" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint3_linear" x1="365.142" y1="0.250004" x2="365.142" y2="615.354" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint4_linear" x1="521.78" y1="0.250021" x2="521.78" y2="615.354" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint5_linear" x1="614.853" y1="349.214" x2="702.05" y2="341.281" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint6_linear" x1="1225.65" y1="391.256" x2="614.793" y2="257.092" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="0.583254" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint7_linear" x1="1212.11" y1="303.113" x2="597.504" y2="312.476" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="0.529596" stopColor="#999999" stopOpacity="0" />
                  </linearGradient>
                  <path id="orbit1" d="M521.78 0.250021C470.377 0.250015 428.706 137.946 428.706 307.802C428.706 477.658 470.376 615.354 521.78 615.354C573.183 615.354 614.853 477.658 614.853 307.802C614.853 137.946 573.183 0.250026 521.78 0.250021Z" />
                  <path id="orbit2" d="M365.142 0.250004C227.238 0.249989 115.445 137.946 115.445 307.802C115.445 477.658 227.238 615.354 365.142 615.354C503.046 615.354 614.839 477.658 614.839 307.802C614.839 137.946 503.046 0.250019 365.142 0.250004Z" />
                  <path id="orbit3" d="M307.552 0.249998C137.834 0.24998 0.250097 137.946 0.250084 307.802C0.250071 477.658 137.834 615.354 307.552 615.354C477.27 615.354 614.853 477.658 614.853 307.802C614.853 137.946 477.27 0.250016 307.552 0.249998Z" />
                  <path id="orbit4" d="M777.421 0.250074C687.637 0.250065 614.853 137.946 614.853 307.802C614.853 477.658 687.637 615.354 777.421 615.354C867.205 615.354 939.989 477.658 939.989 307.802C939.989 137.946 867.205 0.250084 777.421 0.250074Z" />
                  <path id="orbit5" d="M857.047 0.250066C723.279 0.250052 614.839 137.946 614.839 307.802C614.839 477.658 723.279 615.354 857.047 615.354C990.816 615.354 1099.26 477.658 1099.26 307.802C1099.26 137.946 990.816 0.25008 857.047 0.250066Z" />
                  <path id="orbit6" d="M904.806 0.250065C735.088 0.25005 597.504 137.946 597.504 307.802C597.504 477.658 735.088 615.354 904.806 615.354C1074.52 615.354 1212.11 477.658 1212.11 307.802C1212.11 137.946 1074.52 0.25008 904.806 0.250065Z" />
                </defs>
                <g opacity="0.8">
                  <use href="#orbit1" stroke="url(#paint0_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                  <use href="#orbit2" stroke="url(#paint1_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                  <use href="#orbit3" stroke="url(#paint2_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                  <use href="#orbit2" fill="url(#paint3_linear)" opacity="0.05" />
                  <use href="#orbit1" fill="url(#paint4_linear)" opacity="0.05" />
                  <use href="#orbit4" stroke="url(#paint5_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                  <use href="#orbit5" stroke="url(#paint6_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                  <use href="#orbit6" stroke="url(#paint7_linear)" strokeWidth="0.5" strokeMiterlimit="10" />
                </g>
                <circle r="4.5" fill="var(--color-primary)" opacity="0.9">
                  <animateMotion dur="20s" repeatCount="indefinite" begin="0s"><mpath href="#orbit2" /></animateMotion>
                </circle>
                <circle r="3.5" fill="white" opacity="0.7">
                  <animateMotion dur="35s" repeatCount="indefinite" begin="-5s"><mpath href="#orbit6" /></animateMotion>
                </circle>
                <circle r="2.5" fill="var(--color-primary)" opacity="0.5">
                  <animateMotion dur="25s" repeatCount="indefinite" begin="-10s"><mpath href="#orbit4" /></animateMotion>
                </circle>
                <circle r="5.5" fill="white" opacity="0.6">
                  <animateMotion dur="40s" repeatCount="indefinite" begin="-20s"><mpath href="#orbit1" /></animateMotion>
                </circle>
              </svg>
            </div>

            {/* Laser */}
            <div className="laser-container">
              <LaserFlow
                className="" style={{}} dpr={1} color={color}
                horizontalBeamOffset={0.0} verticalBeamOffset={0.0}
                horizontalSizing={2} verticalSizing={3.8}
                wispDensity={2} wispSpeed={15} wispIntensity={12.5}
                flowSpeed={0.35} flowStrength={0.25}
                fogIntensity={0.79} fogScale={0.3} fogFallSpeed={0.6}
                decay={1.1} falloffStart={3}
              />
            </div>

            {/* Hero copy */}
            <div className="hero-content">
              <h1 className="hero-heading">
                <div className="hero-line-anim">Scaling</div>
                <div className="hero-line-anim">Purposeful</div>
                <div className="hero-line-anim">Innovation for</div>
                <div className="hero-line-anim">
                  <span className="hero-highlight" ref={cyclingRef}>
                    {currentWord.split('').map((char, i) => (
                      <span key={`${currentWord}-${i}`} className="hero-char">{char}</span>
                    ))}
                  </span>
                </div>
              </h1>
              <button className="hero-button hero-scroll-btn" style={{ padding: "0.9rem 2rem", marginTop: "1rem" }}>
                Scroll down ↓
              </button>
            </div>

          </div>{/* /hero-section */}

          {/* ── Core Section ── */}
          <section className="core-section">
            <h2 className="core-title">Core</h2>

            <div className="core-columns">
              <div className="core-col">
                <p>C Minds catalyzes technological, financial, and entrepreneurship innovation for both people and the planet in Latin America. We play at the edge of possibility, where strategy meets action.</p>
              </div>
              <div className="core-divider" />
              <div className="core-col">
                <p>We develop AI policies and ethical frameworks. We lead multi-sector and systems-based strategies. We incubate and scale local, national and regional initiatives.</p>
              </div>
              <div className="core-divider" />
              <div className="core-col">
                <p>For over two decades we have been a partner of choice of our financial and impact partners. We contribute to shaping futures where innovation is routed in justice, access to opportunities and regeneration.</p>
              </div>
            </div>

            <button className="hero-button core-btn">Learn more</button>
          </section>

        </div>
      )}
    </main>
    </>
  );
}
