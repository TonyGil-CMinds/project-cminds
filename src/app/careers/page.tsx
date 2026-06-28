"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SideRays from "../../../components/reactbits/SideRays";
import BorderGlow from "../../../components/reactbits/BorderGlow";
import SiteFooter from "../../components/SiteFooter";
import ContactButton from "../../components/ContactButton";
gsap.registerPlugin(ScrollTrigger);
const NAV_ITEMS    = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

const PEOPLE = [
  {
    name: "Alex Muñoz",
    role: "Director, Vital Oceans",
    img:  "/team/AlexMunos.png",
    quote: "The ocean covers more than 70% of our planet, yet we understand so little of it. Every decision we make at Vital Oceans is a step toward closing that gap — before it's too late.",
  },
  {
    name: "Ángel Escalante",
    role: "Lead, Digital Product",
    img:  "/team/Angel Escalante.png",
    quote: "A great digital product doesn't just work — it earns trust. The best interfaces are the ones people forget they're using because everything just flows.",
  },
  {
    name: "Antonio Gil",
    role: "Lead, Interactive Design",
    img:  "/team/Tony Gil.png",
    quote: "Every great project starts with understanding people. Design isn't decoration — it's how we communicate what matters most and why it's worth building.",
  },
  {
    name: "Bryan Ruiz",
    role: "Head, Exploration Studio",
    img:  "/team/Bryan Ruiz.png",
    quote: "Exploration means being comfortable with not knowing the answer yet. The Exploration Studio exists to ask questions the rest of the world hasn't thought to ask — and to build what comes after.",
  },
  {
    name: "Camila Valdez",
    role: "Editorial Design",
    img:  "/team/Camila Valdes.png",
    quote: "Visual storytelling is how complex ideas become accessible. Good editorial design doesn't just present information — it makes people feel something before they've read a single word.",
  },
  {
    name: "Carlo Angeles",
    role: "Head of Impact",
    img:  "/team/Carlo Angeles.png",
    quote: "Impact without measurement is just intention. Our job is to make sure that what we do in rooms and boardrooms actually reaches the people and ecosystems we're working for.",
  },
  {
    name: "Eduardo Gómez Restrepo",
    role: "Head, ScaleUp Studio",
    img:  "/team/Eduardo Gómez.png",
    quote: "Scaling an idea isn't just about growth — it's about making sure the right things grow in the right way. The ScaleUp Studio exists to make that distinction matter.",
  },
  {
    name: "Enrique Portillo",
    role: "Administration Lead",
    img:  "/team/Enrique Portillo.png",
    quote: "Every great initiative runs on trust and structure. Behind every launch, every partnership, every milestone — there's a foundation that makes it all possible.",
  },
  {
    name: "Fernanda Reséndiz",
    role: "Communication",
    img:  "/team/Fernanda Resendiz.png",
    quote: "Telling the right story to the right audience at the right moment is a craft. Communication is how we turn our work into something the world can understand and believe in.",
  },
  {
    name: "Regina Cervera",
    role: "Head, Nature Innovation Programs",
    img:  "/team/Regina Cervera.png",
    quote: "Innovation for nature isn't a metaphor — it's a necessity. Every program we design has to meet the urgency of what's at stake and the ambition of what's possible.",
  },
  {
    name: "Xiomy Vázquez",
    role: "Lead, Branding",
    img:  "/team/Xiomy Vazquez.png",
    quote: "A brand is a promise. My job is to make sure C Minds keeps that promise consistently — in every color, every word, and every experience we put into the world.",
  },
];

const BENEFITS = [
  {
    icon:  "/assets/glass/Home.svg",
    title: "Working your way",
    desc:  "We're fully remote by design, not by default. That means no commute, more autonomy, and the freedom to do your best work — wherever that happens to be.",
    wide:  false,
  },
  {
    icon:  "/assets/glass/Learn.svg",
    title: "Love to learn.",
    desc:  "Curious minds thrive here. Use your $500 annual learning stipend on whatever helps you grow — design conferences, dev workshops, or something unexpected.",
    wide:  false,
  },
  {
    icon:  "/assets/glass/getTogether.svg",
    title: "Get Together.",
    desc:  "Every month, we bring the whole team together — face-to-face, human-to-human. Expect good food, shared ideas, and the kind of conversations that don't happen on Zoom.",
    wide:  true,
  },
];

const POSITIONS = [
  { title: "Project Manager", type: "Full time", location: "LATAM", mode: "Remote", status: "Closed" as const },
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function hexToHsl(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  let r = ((n >> 16) & 255) / 255;
  let g = ((n >> 8) & 255) / 255;
  let b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
}


export default function CareersPage() {
  const containerRef         = useRef<HTMLDivElement>(null);
  const culturePinRef        = useRef<HTMLElement>(null);
  const cultureProgressFill  = useRef<HTMLDivElement>(null);
  const cultureProgressDot   = useRef<HTMLDivElement>(null);
  const peopleImgRef         = useRef<HTMLImageElement>(null);
  const peopleContentRef     = useRef<HTMLDivElement>(null);
  const peopleTextRef        = useRef<HTMLDivElement>(null);
  const activePersonRef      = useRef(0);
  const peopleTouchStartX    = useRef(0);
  const navItemRefs          = useRef<(HTMLDivElement | null)[]>([]);
  const navLightRef          = useRef<HTMLDivElement>(null);
  const [activePerson, setActivePerson]     = useState(0);
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

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    gsap.fromTo(e.currentTarget,
      { color: primaryColor, scale: 1.06 },
      { color: 'rgba(255,255,255,0.5)', scale: 1, duration: 0.55, ease: 'power2.out' }
    );
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
    gsap.to([".careers-word", ".careers-scroll-btn", ".careers-anchor-links"], {
      opacity: 0, y: -16, filter: "blur(8px)",
      duration: 0.25, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  const goToPerson = (idx: number) => {
    const next = ((idx % PEOPLE.length) + PEOPLE.length) % PEOPLE.length;
    if (next === activePersonRef.current) return;
    // Photo: simple opacity cross-fade
    gsap.to(peopleImgRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });
    // Text (quote + byline): Core's exact pattern — y:8 out, y:14 in
    gsap.to(peopleTextRef.current, {
      opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        activePersonRef.current = next;
        setActivePerson(next);
        requestAnimationFrame(() => {
          gsap.to(peopleImgRef.current, { opacity: 1, duration: 0.5, ease: "power3.out" });
          gsap.fromTo(peopleTextRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
          );
        });
      },
    });
  };

  useGSAP(() => {
    gsap.fromTo(".careers-word",
      { opacity: 0, y: 36, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
    gsap.fromTo(".careers-scroll-btn",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.75 }
    );
    gsap.fromTo(".careers-anchor-links",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.95 }
    );

    // Positions section entrance
    gsap.fromTo(".careers-positions-section",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".careers-positions-section", start: "top 82%", toggleActions: "play none none none" },
      }
    );

    // Team photo: start narrow, grow to full width on scroll
    gsap.set(".careers-team-img", { width: "52%", marginLeft: "auto", marginRight: "auto" });
    gsap.to(".careers-team-img", {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".careers-team-section",
        start: "top 88%",
        end: "center 52%",
        scrub: 1.5,
      },
    });

    // Culture section: pinned word-by-word scroll fill
    const culturePin = culturePinRef.current;
    if (culturePin) {
      const words     = Array.from(culturePin.querySelectorAll<HTMLSpanElement>(".careers-culture-word"));
      const fill      = cultureProgressFill.current;
      const dot       = cultureProgressDot.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: culturePin,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          // onLeave: section has already faded out via the timeline tween below.
          // We just hide it so it doesn't re-appear at its natural DOM position.
          onLeave:      () => { gsap.set(culturePin, { visibility: "hidden" }); },
          onEnterBack:  () => { gsap.set(culturePin, { autoAlpha: 1 }); },
          onUpdate: (self) => {
            if (fill) fill.style.height = `${self.progress * 100}%`;
            if (dot)  dot.style.top     = `calc(${self.progress * 100}% - 10px)`;
          },
        },
      });

      // Phase 1: words fill in
      tl.fromTo(
        words,
        { opacity: 0.12, filter: "blur(2.5px)" },
        { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power1.out", stagger: 0.055 },
        0
      );
      // Phase 2: whole section fades out smoothly before the pin releases
      tl.to(culturePin, { opacity: 0, duration: 0.3, ease: "power2.in" }, ">");
    }

    // Benefits — layer 1: cards slide up
    gsap.fromTo(".careers-benefit-card",
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: "#benefits", start: "top 82%", toggleActions: "play none none none" } }
    );

    // Benefits — layer 2: icon-wrap frame drifts in slightly after cards
    gsap.fromTo(".careers-benefit-icon-wrap",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: "#benefits", start: "top 80%", toggleActions: "play none none none" },
        delay: 0.2 }
    );

    // Benefits — layer 3: crisp icon pops in with spring scale (shadow layers start invisible via CSS)
    gsap.fromTo(".careers-benefit-icon",
      { opacity: 0, scale: 0.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.65, stagger: 0.12, ease: "back.out(1.7)",
        scrollTrigger: { trigger: "#benefits", start: "top 80%", toggleActions: "play none none none" },
        delay: 0.38 }
    );

    // People section entrance
    gsap.fromTo(".careers-people-photo",
      { opacity: 0, x: -40, filter: "blur(12px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: "#people", start: "top 78%", toggleActions: "play none none none" } }
    );
    gsap.fromTo(".careers-people-content",
      { opacity: 0, x: 24, filter: "blur(8px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: "#people", start: "top 78%", toggleActions: "play none none none" }, delay: 0.15 }
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
        <ContactButton variant="nav" />
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
            <span className="careers-word">Join the team</span>
            <span className="careers-word careers-word-accent">shaping what&apos;s next.</span>
          </h1>

          <button className="hero-button careers-scroll-btn" style={{ padding: "0.9rem 2rem", opacity: 0 }}>
            Scroll down ↓
          </button>

          <div className="careers-anchor-links" style={{ opacity: 0 }}>
            <a href="#open-positions" className="careers-anchor-link" onClick={(e) => scrollToSection('open-positions', e)}>Open positions</a>
            <a href="#culture"        className="careers-anchor-link" onClick={(e) => scrollToSection('culture', e)}>Culture</a>
            <a href="#people"         className="careers-anchor-link" onClick={(e) => scrollToSection('people', e)}>People</a>
            <a href="#benefits"       className="careers-anchor-link" onClick={(e) => scrollToSection('benefits', e)}>Benefits</a>
          </div>
        </div>
      </section>

      {/* Team photo */}
      <section className="careers-team-section">
        <img
          src="/careers/team-placeholder.webp"
          alt="C Minds team"
          className="careers-team-img"
          draggable={false}
        />
      </section>

      {/* Open positions */}
      <section id="open-positions" className="careers-positions-section" style={{ opacity: 0 }}>
        <div className="careers-positions-header">
          <span className="careers-section-dot" />
          <h2 className="careers-section-label">Positions</h2>
        </div>

        <div className="careers-positions-list">
          {POSITIONS.map((pos, i) => (
            <div key={i} className={`careers-position-card careers-position-card--${pos.status.toLowerCase()}`}>
              <div className="careers-position-left">
                <p className="careers-position-title">{pos.title}</p>
                <p className="careers-position-tags">{pos.type} · {pos.location} · {pos.mode}</p>
              </div>
              <span className={`careers-position-status careers-position-status--${pos.status.toLowerCase()}`}>
                {pos.status}
              </span>
            </div>
          ))}
        </div>

        <p className="careers-positions-empty">Not more positions available</p>
      </section>

      {/* Culture section */}
      <section id="culture" className="careers-culture-section" ref={culturePinRef}>
        <div className="careers-positions-header">
          <span className="careers-section-dot" />
          <h2 className="careers-section-label">Culture</h2>
        </div>
        <p className="careers-culture-text">
          {"We are a collaborative, growth-minded team that values curiosity, mentorship, meaningful work, and the people behind it.".split(" ").map((word, i) => (
            <span key={i} className="careers-culture-word">{word}{" "}</span>
          ))}
        </p>
        <div className="careers-culture-progress-indicator">
          <div className="cs-progress-track">
            <div ref={cultureProgressFill} className="cs-progress-fill" style={{ height: "0%" }} />
            <div ref={cultureProgressDot}  className="cs-progress-dot"  style={{ top: "calc(0% - 10px)" }} />
          </div>
        </div>
      </section>

      {/* People section */}
      <section
        id="people"
        className="careers-people-section"
        onTouchStart={(e) => { peopleTouchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - peopleTouchStartX.current;
          if (Math.abs(delta) < 40) return;
          goToPerson(activePersonRef.current + (delta < 0 ? 1 : -1));
        }}
      >
        <div className="careers-positions-header">
          <span className="careers-section-dot" />
          <h2 className="careers-section-label">People</h2>
        </div>

        <div className="careers-people-inner">
          {/* Photo */}
          <div className="careers-people-photo-wrap">
            <img
              ref={peopleImgRef}
              src={PEOPLE[activePerson].img}
              alt={PEOPLE[activePerson].name}
              className="careers-people-photo"
              draggable={false}
              style={{ opacity: 0 }}
            />
          </div>

          {/* Quote + byline + nav */}
          <div ref={peopleContentRef} className="careers-people-content" style={{ opacity: 0 }}>
            {/* Static — no transition animation */}
            <span className="careers-people-quote-mark">&ldquo;</span>

            {/* Animated on person change — matches Core ct-info pattern */}
            <div ref={peopleTextRef} className="careers-people-text-wrap">
              <p className="careers-people-quote">{PEOPLE[activePerson].quote}</p>
              <div className="careers-people-byline">
                <span className="careers-people-name">{PEOPLE[activePerson].name}</span>
                <span className="careers-people-sep">·</span>
                <span className="careers-people-role">{PEOPLE[activePerson].role}</span>
              </div>
            </div>

            {/* Static — no transition animation */}
            <div className="careers-people-nav">
              <button className="careers-people-btn" onClick={() => goToPerson(activePersonRef.current - 1)} aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="careers-people-btn" onClick={() => goToPerson(activePersonRef.current + 1)} aria-label="Next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section id="benefits" className="careers-benefits-section">
        <div className="careers-positions-header">
          <span className="careers-section-dot" />
          <h2 className="careers-section-label">Benefits</h2>
        </div>

        <div className="careers-benefits-grid">
          {BENEFITS.map((b, i) => (
            <BorderGlow
              key={i}
              className={`careers-benefit-card${b.wide ? " careers-benefit-card--wide" : ""}`}
              colors={[primaryColor, `${primaryColor}80`, primaryColor]}
              glowColor={hexToHsl(primaryColor)}
              backgroundColor="#07061a"
              borderRadius={20}
              glowRadius={32}
              glowIntensity={1.1}
              edgeSensitivity={26}
              fillOpacity={0.12}
            >
              <div className="careers-benefit-icon-wrap">
                <img src={b.icon} aria-hidden draggable={false} className="careers-benefit-icon-layer careers-benefit-icon-layer--1" />
                <img src={b.icon} aria-hidden draggable={false} className="careers-benefit-icon-layer careers-benefit-icon-layer--2" />
                <img src={b.icon} alt="" className="careers-benefit-icon" draggable={false} />
              </div>
              <div className="careers-benefit-body">
                <h3 className="careers-benefit-title">{b.title}</h3>
                <p className="careers-benefit-desc">{b.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
