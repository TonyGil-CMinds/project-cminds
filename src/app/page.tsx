"use client";

import { useEffect, useLayoutEffect, useRef, useState, startTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HexLoader from "../components/HexLoader";
import SiteFooter from "../components/SiteFooter";
import ContactButton from "../components/ContactButton";

gsap.registerPlugin(ScrollTrigger);

const LaserFlow = dynamic(() => import("../../components/reactbits/LaserFlow"), {
  ssr: false,
  loading: () => null,
});

const FluidGlass = dynamic(() => import("../../components/reactbits/FluidGlass"), {
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
const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "Careers"];
const CYCLING_WORDS = ["Biodiversity", "Communities", "Oceans", "Cities"];

const INITIATIVES = [
  {
    id: "ntl",
    url: "https://naturatech.org",
    image: "/home/featured-ntl.png",
    pills: ["Regenerative", "Innovation"],
    label: "Purposeful Tech for Biodiversity",
    titleA: "NaturaTech",
    titleB: "LAC",
  },
  {
    id: "t4n",
    url: "https://youtu.be/4cKLMpL_des?si=UaqwBqQWkqbFSdLb",
    image: "/home/featured-t4n.png",
    pills: ["Conservation", "Local leadership"],
    label: "AI-powered biodiversity monitoring platform",
    titleA: "Tech4",
    titleB: "Nature",
  },
  {
    id: "vo",
    url: "https://oceanosvitales.org",
    image: "/home/featured-vo.png",
    pills: ["Ocean", "Protection"],
    label: "Community-led Marine Protected Areas",
    titleA: "Vital",
    titleB: "Oceans",
  },
  {
    id: "a4m",
    url: "https://youtu.be/_O1yxttZ2m8?si=m8G08n1JI4oCYn4G",
    image: "/home/featured-a4m.png",
    pills: ["AI systems", "Conservation"],
    label: "A Machine Learning Approach",
    titleA: "AI for",
    titleB: "Manatees",
  },
];
const ORBIT_WORDS = [
  "TANGIBLE IMPACT",
  "INCUBATION",
  "REGIONAL STRATEGIES",
  "POLICIES",
  "GOVERNANCE FRAMEWORKS",
  "SCALE INITIATIVES",
  "EMERGING TECHNOLOGIES",
];

const HWW_WORDS = ["governments", "civil society", "organizations", "local communities"];

const PARTNERS_ROW1 = [
  { src: "/partners/logo-bidlab-fila1.svg",           alt: "BID Lab" },
  { src: "/partners/logo-sucia-fila1.svg",            alt: "Suecia Sverige" },
  { src: "/partners/logo-francia-fila1.svg",          alt: "Gouvernement France" },
  { src: "/partners/logo-amazonia-fila1.svg",         alt: "Amazonia" },
  { src: "/partners/logo-climatecollective-fila1.svg",alt: "Climate Collective" },
  { src: "/partners/logo-upy-fila1.svg",              alt: "UPY" },
];
const PARTNERS_ROW2 = [
  { src: "/partners/logo-iucn-fila2.svg",      alt: "IUCN" },
  { src: "/partners/logo-greenlist-fila2.svg", alt: "Green List" },
  { src: "/partners/logo-tech4all-fila2.svg",  alt: "Tech4All" },
  { src: "/partners/logo-huawei-fila2.svg",    alt: "Huawei" },
  { src: "/partners/logo-sds-fila2.svg",       alt: "SDS" },
  { src: "/partners/logo-pronatura-fila2.svg", alt: "Pro Natura" },
  { src: "/partners/logo-pachamama-fila2.svg", alt: "Pachamama" },
];
const PARTNERS_ROW3 = [
  { src: "/partners/logo-unichile-fila3.svg", alt: "Universidad de Chile" },
  { src: "/partners/logo-ecosur-fila3.svg",   alt: "Ecosur" },
  { src: "/partners/logo-google-fila3.svg",   alt: "Google.org" },
  { src: "/partners/logo-dolphin-fila3.svg",  alt: "Dolphin" },
  { src: "/partners/logo-cesco-fila3.svg",    alt: "CESCO" },
  { src: "/partners/logo-kinray-fila3.svg",   alt: "Kinray Hub" },
];

const AWARDS = [
  {
    id: "paris-peace-forum",
    logo: "/home/svgs/logo-parispeaceforum.svg",
    alt: "Paris Peace Forum",
    title: "Scale-up Program\n2024-25",
    body: "Emerging technologies, new conditions for the planet",
    url: "https://parispeaceforum.org/projects/ai-for-climate/",
  },
  {
    id: "forbes",
    logo: "/home/svgs/logo-forbes.svg",
    alt: "Forbes",
    title: "Leaders of AI in\nMéxico 2024",
    body: "Honor for Contanza Gómez Mont, Founder of C Minds, Director of NaturaTech LAC",
    url: "https://forbes.com.mx/la-ia-avanza-en-mexico/",
  },
];

const COOKIE_KEY = "cminds_color";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const LOADER_KEY = "cminds_loader_shown";

const getColorCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const setColorCookie = (hex: string) => {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(hex)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
};

export default function Hero() {
  const [loaderDone, setLoaderDone] = useState(false);

  // Skip the loader on every visit after the first.
  // useLayoutEffect fires before the browser paints, so the user never sees a flash.
  useLayoutEffect(() => {
    if (localStorage.getItem(LOADER_KEY) === "1") setLoaderDone(true);
  }, []);
  const [step, setStep] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [currentWord, setCurrentWord] = useState(CYCLING_WORDS[0]);
  const wordIndexRef = useRef(0);
  const cyclingRef = useRef<HTMLSpanElement>(null);
  const wordInitialized = useRef(false);

  const [hwwWord, setHwwWord] = useState(HWW_WORDS[0]);
  const hwwWordIndexRef = useRef(0);
  const hwwCyclingRef = useRef<HTMLSpanElement>(null);
  const hwwEnteredRef = useRef(false);
  const hwwAnimatingRef = useRef(false);
  const awardCardRefs = useRef<(HTMLElement | null)[]>([]);

  // Restore color preference; loader always plays on every page load
  useEffect(() => {
    const saved = getColorCookie();
    if (saved && COLORS.includes(saved)) {
      setColor(saved);
      setStep(3);
    }
  }, []);
  const container = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const navigateWithTransition = (path: string) => {
    sessionStorage.setItem("vt_from", "home");
    const doNavigate = () => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => { router.push(path); });
        });
      } else {
        router.push(path);
      }
    };
    // Animate hero text/button out, then trigger transition
    gsap.to([".hero-line-anim", ".hero-scroll-btn"], {
      opacity: 0, y: -22, filter: "blur(8px)",
      duration: 0.28, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  // Nav state
  const [activeNav, setActiveNav] = useState(0);
  const [hoverNav, setHoverNav] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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

  // Animate in new hww cycling word when state changes (only after section entered)
  useGSAP(() => {
    if (!hwwEnteredRef.current || !hwwCyclingRef.current) return;
    const spans = hwwCyclingRef.current.querySelectorAll<HTMLSpanElement>('.hww-cw');
    gsap.fromTo(spans,
      { opacity: 0, y: 22, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [hwwWord]);


  // Word particles: appear at cursor, each letter falls with gravity
  useEffect(() => {
    if (step !== 3 || !loaderDone) return;
    let lastX = 0, lastY = 0, dist = 0;
    const TRIGGER_PX = 110;
    const active = new Set<HTMLDivElement>();
    const activePos = new Map<HTMLDivElement, { x: number; y: number }>();
    const MIN_GAP = 180;

    const spawnWord = (x: number, y: number) => {
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 50;
      const spawnX = x + offsetX;
      const spawnY = y + offsetY;

      // Reject if too close to an existing particle
      for (const pos of activePos.values()) {
        const dx = spawnX - pos.x;
        const dy = spawnY - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_GAP) return;
      }

      const text = ORBIT_WORDS[Math.floor(Math.random() * ORBIT_WORDS.length)];

      const wrap = document.createElement("div");
      wrap.className = "wwd-word-particle";
      wrap.style.left = `${spawnX}px`;
      wrap.style.top  = `${spawnY}px`;
      document.body.appendChild(wrap);
      active.add(wrap);
      activePos.set(wrap, { x: spawnX, y: spawnY });

      const letters = text.split("").map((ch) => {
        const s = document.createElement("span");
        s.textContent = ch === " " ? " " : ch;
        wrap.appendChild(s);
        return s;
      });

      gsap.set(letters, { opacity: 0, y: -6 });

      gsap.timeline({
        onComplete: () => { wrap.remove(); active.delete(wrap); activePos.delete(wrap); }
      })
        .to(letters, {
          opacity: 1, y: 0,
          duration: 0.3, stagger: 0.04, ease: "back.out(1.4)",
        })
        .to(letters, {
          opacity: 0,
          y: (i: number) => 130 + i * 8 + Math.random() * 120,
          duration: 1.6,
          stagger: { each: 0.06, from: "random" },
          ease: "power2.in",
        }, "+=0.25");
    };

    const handleMouseMove = (e: MouseEvent) => {
      const section = document.querySelector(".wwd-section");
      if (section) {
        const r = section.getBoundingClientRect();
        if (r.top > 0 || r.bottom <= 0) return;
      }
      const hwwSection = document.querySelector(".hww-section");
      if (hwwSection) {
        const r = hwwSection.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) return;
      }
      // Dead zone around headline text
      const pad = 60;
      const headlines = document.querySelectorAll(".wwd-headline");
      for (const h of headlines) {
        const r = h.getBoundingClientRect();
        if (e.clientX >= r.left - pad && e.clientX <= r.right + pad &&
            e.clientY >= r.top  - pad && e.clientY <= r.bottom + pad) return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dist += Math.sqrt(dx * dx + dy * dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (dist < TRIGGER_PX) return;
      dist = 0;
      spawnWord(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      active.forEach(p => { gsap.killTweensOf(p.querySelectorAll("span")); p.remove(); });
      activePos.clear();
    };
  }, [step, loaderDone]);

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
      const fromCore = typeof sessionStorage !== "undefined" && sessionStorage.getItem("vt_from") === "core";

      // When returning from /core, nav is already visible via view transition — don't hide it
      const hideTargets: string[] = [".hero-line-anim", ".hero-scroll-btn", ".laser-container", ".orbit-bg"];
      if (!fromCore) hideTargets.unshift(".main-nav");
      gsap.set(hideTargets, { opacity: 0 });

      if (!loaderDone) return;

      // Consume the flag only after loaderDone check — otherwise a double-fire
      // (loaderDone=false then true) removes it on the first (no-op) pass
      if (fromCore) sessionStorage.removeItem("vt_from");

      // Nav entrance only on fresh load, not on return from /core
      if (!fromCore) {
        gsap.fromTo(".main-nav", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      }
      gsap.fromTo(".hero-line-anim", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".hero-scroll-btn", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1 });
      gsap.fromTo(".laser-container", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.5 });
      gsap.fromTo(".orbit-bg", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out", delay: 0.3 });

      // Orbit fades out as core section enters, reverses on scroll back
      gsap.fromTo(".orbit-bg",
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".core-section",
            start: "top 55%",
            end: "top -10%",
            scrub: true,
          },
        }
      );

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

      // Featured Initiatives
      gsap.fromTo(".initiatives-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".initiatives-section", start: "top 82%", toggleActions: "play none none reverse" }
        }
      );

      gsap.utils.toArray<HTMLElement>(".initiative-card").forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 55 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" }
          }
        );
      });

      // Bold Changes — CSS sticky + scrub (no GSAP pin)
      const boldTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".bold-section",
          scrub: 1.5,
          start: "top top",
          end: "bottom bottom",
        }
      });
      boldTl
        .fromTo(".bold-bg-glow", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "none" }, 0)
        // ovals fly in simultaneously with the text
        .fromTo(".bold-oval-1", { y: -560, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "none" }, 0)
        .fromTo(".bold-oval-2", { y: -880, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "none" }, 0)
        .fromTo(".bold-oval-3", { y:  880, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "none" }, 0.05)
        .fromTo(".bold-oval-4", { y:  560, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "none" }, 0.05)
        // text writes itself during oval arrival — all complete by ~1.0
        .fromTo("#bw-bold",       { opacity: 0, y: 22, filter: "blur(10px)" }, { opacity: 1,    y: 0, filter: "blur(0px)", duration: 0.2 }, 0.25)
        .fromTo("#bw-and",        { opacity: 0, y: 22, filter: "blur(10px)" }, { opacity: 1,    y: 0, filter: "blur(0px)", duration: 0.2 }, 0.44)
        .fromTo("#bw-meaningful", { opacity: 0, y: 22, filter: "blur(10px)" }, { opacity: 0.48, y: 0, filter: "blur(0px)", duration: 0.2 }, 0.63)
        .fromTo("#bw-changes",    { opacity: 0, y: 22, filter: "blur(10px)" }, { opacity: 0.20, y: 0, filter: "blur(0px)", duration: 0.2 }, 0.80);

      // What We Do — CSS sticky + scrub
      const wwdTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".wwd-section",
          scrub: 1,
          start: "top top",
          end: "bottom bottom",
        }
      });
      // Phase A: headline words + pill
      wwdTl
        .fromTo(".wwd-pill",    { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.1 }, 0)
        .fromTo("#wwa-we",      { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.06)
        .fromTo("#wwa-codesign",{ opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.20)
        .fromTo("#wwa-visions", { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.32)
        .fromTo("#wwa-with",    { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 }, 0.42);
      // Phase A → B transition
      wwdTl
        .to(".wwd-phase-a",    { opacity: 0, y: -18, filter: "blur(8px)", duration: 0.16 }, 0.66)
        .fromTo("#wwb-line1",  { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18 }, 0.74)
        .fromTo("#wwb-tang",   { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18 }, 0.88)
        .fromTo("#wwb-impact", { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18 }, 0.93);

      // How We Work — entrance with text scale-transform from previous section
      gsap.fromTo(".hww-video-bg",
        { opacity: 0, scale: 1.08 },
        { opacity: 0.38, scale: 1, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: ".hww-section", start: "top 80%", toggleActions: "play none none reverse" } }
      );
      gsap.fromTo(".hww-pill",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".hww-section", start: "top 72%", toggleActions: "play none none reverse" } }
      );
      // Entrance: animate title words in on scroll-into-view
      ScrollTrigger.create({
        trigger: ".hww-section",
        start: "top 68%",
        onEnter: () => {
          hwwEnteredRef.current = true;
          gsap.fromTo(".hww-tw",
            { opacity: 0, y: 28, filter: "blur(12px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.1, ease: "power3.out" }
          );
          gsap.fromTo(".hww-cw",
            { opacity: 0, y: 28, filter: "blur(12px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, delay: 0.35, stagger: 0.1, ease: "power3.out" }
          );
        },
        onLeaveBack: () => {
          hwwEnteredRef.current = false;
          hwwWordIndexRef.current = 0;
          hwwAnimatingRef.current = false;
          setHwwWord(HWW_WORDS[0]);
          gsap.to(".hww-tw", { opacity: 0, y: 28, filter: "blur(12px)", duration: 0.4 });
          gsap.to(".hww-cw", { opacity: 0, duration: 0.3 });
        }
      });

      // Scroll-driven word cycling: 4 words across the sticky scroll range
      ScrollTrigger.create({
        trigger: ".hww-section",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!hwwEnteredRef.current) return;
          const idx = Math.min(HWW_WORDS.length - 1, Math.floor(self.progress * HWW_WORDS.length));
          if (idx === hwwWordIndexRef.current || hwwAnimatingRef.current) return;
          const isForward = idx > hwwWordIndexRef.current;
          hwwAnimatingRef.current = true;
          const spans = hwwCyclingRef.current
            ? Array.from(hwwCyclingRef.current.querySelectorAll<HTMLSpanElement>('.hww-cw'))
            : [];
          const doSwap = () => {
            hwwWordIndexRef.current = idx;
            setHwwWord(HWW_WORDS[idx]);
            hwwAnimatingRef.current = false;
          };
          if (spans.length > 0) {
            gsap.to(spans, {
              opacity: 0, y: isForward ? -22 : 22, filter: 'blur(8px)',
              duration: 0.25, stagger: { each: 0.03, from: isForward ? 'end' : 'start' },
              ease: 'power2.in', onComplete: doSwap,
            });
          } else {
            doSwap();
          }
        }
      });
      gsap.fromTo(".hww-word",
        { opacity: 0, y: 10, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.45, stagger: 0.04, ease: "power2.out",
          scrollTrigger: { trigger: ".hww-body", start: "top 82%", toggleActions: "play none none reverse" } }
      );

      // Partners section entrance
      gsap.fromTo(".partners-title",
        { opacity: 0, y: 30, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".partners-section", start: "top 78%", toggleActions: "play none none reverse" } }
      );
      gsap.fromTo(".marquee-row",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.18, ease: "power2.out",
          scrollTrigger: { trigger: ".partners-section", start: "top 72%", toggleActions: "play none none reverse" } }
      );

      gsap.fromTo(".awards-pill",
        { opacity: 0, y: 14, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".awards-section", start: "top 78%", toggleActions: "play none none reverse" }
        }
      );

      gsap.fromTo(".awards-title-line",
        { opacity: 0, y: 34, filter: "blur(14px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.11, ease: "power3.out",
          scrollTrigger: { trigger: ".awards-section", start: "top 74%", toggleActions: "play none none reverse" }
        }
      );

      gsap.utils.toArray<HTMLElement>(".award-card").forEach((card) => {
        const logo = card.querySelector(".award-logo");
        gsap.fromTo(card,
          { opacity: 0, y: 58, scale: 0.96, filter: "blur(12px)" },
          {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.95, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" }
          }
        );
        gsap.fromTo(logo,
          { opacity: 0, y: 24, scale: 0.92, filter: "blur(10px)" },
          {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.85, delay: 0.14, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" }
          }
        );
      });

      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
    }
  }, [step, loaderDone]);

  const setAwardHover = (card: HTMLElement | null, isHovering: boolean) => {
    if (!card) return;
    const logo = card.querySelector(".award-logo-wrap");
    const copy = card.querySelector(".award-copy");
    const words = card.querySelectorAll(".award-copy-word");

    gsap.killTweensOf([logo, copy, words]);

    if (isHovering) {
      gsap.timeline()
        .to(logo, {
          opacity: 0,
          y: -34,
          filter: "blur(9px)",
          duration: 0.32,
          ease: "power2.in",
        }, 0)
        .set(copy, { opacity: 1 }, 0.08)
        .fromTo(words,
          { opacity: 0, y: 22, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.56, stagger: 0.035, ease: "power3.out" },
          0.14
        );
      return;
    }

    gsap.timeline()
      .to(words, {
        opacity: 0,
        y: 18,
        filter: "blur(8px)",
        duration: 0.25,
        stagger: { each: 0.015, from: "end" },
        ease: "power2.in",
      }, 0)
      .to(copy, { opacity: 0, duration: 0.15 }, 0.08)
      .fromTo(logo,
        { opacity: 0, y: 34, filter: "blur(9px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" },
        0.12
      );
  };

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
    localStorage.setItem(LOADER_KEY, "1");
    setLoaderDone(true);
  };

  return (
    <>
    {!loaderDone && <HexLoader onComplete={handleLoaderDone} />}
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
              <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
                    onClick={() => {
                      setActiveNav(idx);
                      if (item === "Core") navigateWithTransition("/core");
                      if (item === "Mindscope ®") navigateWithTransition("/mindscope");
                      if (item === "Careers") navigateWithTransition("/careers");
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <ContactButton variant="nav" />
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

            <button className="hero-button core-btn" onClick={() => navigateWithTransition("/core")}>Learn more</button>
          </section>

          {/* ── Featured Initiatives ── */}
          <section className="initiatives-section">
            <div className="initiatives-header">
              <h2 className="initiatives-heading">Featured Initiatives</h2>
              <p className="initiatives-subheading">Some of our selected projects we launched</p>
            </div>

            <div className="initiatives-list">
              {INITIATIVES.map((item) => (
                <div
                  key={item.id}
                  className="initiative-card"
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="initiative-bg"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="initiative-overlay" />
                  {hoveredCard === item.id && (
                    <div className="initiative-glass-overlay">
                      <FluidGlass lensProps={{ scale: 0.22, ior: 1.18, thickness: 5, chromaticAberration: 0.08, imageUrl: item.image }} />
                    </div>
                  )}
                  <div className="initiative-content">
                    <div className="initiative-pills">
                      {item.pills.map((pill) => (
                        <span key={pill} className="initiative-pill">{pill}</span>
                      ))}
                    </div>
                    <div className="initiative-meta">
                      <p className="initiative-label">{item.label}</p>
                      <h3 className="initiative-title">{item.titleA} {item.titleB}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bold Changes Section ── */}
          <section className="bold-section">
            <div className="bold-inner">
              <div className="bold-bg-glow" />

              <div className="bold-ovals">
                <div className="bold-oval bold-oval-1"><img src="/home/svgs/oval.svg" alt="" /></div>
                <div className="bold-oval bold-oval-2"><img src="/home/svgs/oval.svg" alt="" /></div>
                <div className="bold-oval bold-oval-3"><img src="/home/svgs/oval.svg" alt="" /></div>
                <div className="bold-oval bold-oval-4"><img src="/home/svgs/oval.svg" alt="" /></div>
              </div>

              <div className="bold-text">
                <div className="bold-line">
                  <span className="bold-word" id="bw-bold">BOLD</span>
                  <span className="bold-word" id="bw-and">&nbsp;AND</span>
                </div>
                <div className="bold-line">
                  <span className="bold-word" id="bw-meaningful">MEANINGFUL</span>
                </div>
                <div className="bold-line">
                  <span className="bold-word" id="bw-changes">TRANSFORMATIONS</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── What We Do Section ── */}
          <section className="wwd-section">
            <div className="wwd-inner">
              <div className="wwd-group">
                <div className="wwd-pill">
                  <span style={{ color: "var(--color-primary)" }}>•</span> What we do
                </div>
                <div className="wwd-phases">
                  {/* Phase A */}
                  <div className="wwd-headline wwd-phase-a">
                    <div className="wwd-hl-line">
                      <span className="wwd-w" id="wwa-we">We</span>
                      <span className="wwd-w wwd-accent" id="wwa-codesign">codesign</span>
                      <span className="wwd-w wwd-accent" id="wwa-visions">visions</span>
                    </div>
                    <div className="wwd-hl-line">
                      <span className="wwd-w" id="wwa-with">with our partners</span>
                    </div>
                  </div>

                  {/* Phase B — overlays Phase A */}
                  <div className="wwd-headline wwd-phase-b">
                    <div className="wwd-hl-line">
                      <span className="wwd-w" id="wwb-line1">We transform these into</span>
                    </div>
                    <div className="wwd-hl-line">
                      <span className="wwd-w wwd-accent" id="wwb-tang">tangible </span>
                      <span className="wwd-w wwd-accent" id="wwb-impact">impact</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── How We Work Section ── */}
          <section className="hww-section">
            <div className="hww-inner">
            <video
              className="hww-video-bg"
              autoPlay muted loop playsInline
              src="https://video.wixstatic.com/video/fd7443_8d4268b7cebd401a92344d1f0fa57e50/1080p/mp4/file.mp4"
            />
            <div className="hww-overlay" />

            <div className="hww-content">
              <div className="hww-pill">
                <span style={{ color: "var(--color-primary)" }}>•</span> How we work
              </div>
              <h2 className="hww-title">
                <div className="hww-title-line">
                  <span className="hww-tw">We</span>{" "}
                  <span className="hww-tw">collaborate</span>
                </div>
                <div className="hww-title-line">
                  <span className="hww-tw">with</span>{" "}
                  <span className="hww-cycling-word" ref={hwwCyclingRef}>
                    {hwwWord.split(" ").map((w, i, arr) => (
                      <span key={i} className="hww-cw">{w}{i < arr.length - 1 ? " " : ""}</span>
                    ))}
                  </span>
                </div>
              </h2>
              <p className="hww-body">
                {"We explore how technologies like GenAI, IoT, blockchain can help accelerate and scale impact contextually. We are rooted in the value of fairness. We prototype what doesn't yet exist—and scale what's already working.".split(" ").map((word, i) => (
                  <span key={i} className="hww-word">{word}{" "}</span>
                ))}
              </p>
            </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="partners-section">
            <div className="partners-inner">
              <h2 className="partners-title">
                Our partners<br />in change
              </h2>

              <div className="marquee-rows">
                {/* Row 1 — right */}
                <div className="marquee-row">
                  <div className="marquee-track marquee-right">
                    {[...PARTNERS_ROW1, ...PARTNERS_ROW1, ...PARTNERS_ROW1, ...PARTNERS_ROW1].map((p, i) => (
                      <div key={i} className="partner-card">
                        <img src={p.src} alt={p.alt} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2 — left */}
                <div className="marquee-row">
                  <div className="marquee-track marquee-left">
                    {[...PARTNERS_ROW2, ...PARTNERS_ROW2, ...PARTNERS_ROW2, ...PARTNERS_ROW2].map((p, i) => (
                      <div key={i} className="partner-card">
                        <img src={p.src} alt={p.alt} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 3 — right */}
                <div className="marquee-row">
                  <div className="marquee-track marquee-right">
                    {[...PARTNERS_ROW3, ...PARTNERS_ROW3, ...PARTNERS_ROW3, ...PARTNERS_ROW3].map((p, i) => (
                      <div key={i} className="partner-card">
                        <img src={p.src} alt={p.alt} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <section className="awards-section">
            <div className="awards-inner">
              <div className="awards-pill">
                <span style={{ color: "var(--color-primary)" }}>•</span> Awards
              </div>

              <h2 className="awards-title">
                <span className="awards-title-line">C Minds and our team</span>
                <span className="awards-title-line">have been awarded</span>
              </h2>

              <div className="awards-grid">
                {AWARDS.map((award, index) => (
                  <article
                    key={award.id}
                    ref={(el) => { awardCardRefs.current[index] = el; }}
                    className="award-card"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                    onClick={() => window.open(award.url, "_blank", "noopener,noreferrer")}
                    onMouseEnter={() => setAwardHover(awardCardRefs.current[index], true)}
                    onMouseLeave={() => setAwardHover(awardCardRefs.current[index], false)}
                    onFocus={() => setAwardHover(awardCardRefs.current[index], true)}
                    onBlur={() => setAwardHover(awardCardRefs.current[index], false)}
                  >
                    <span className="award-border-glow" aria-hidden="true" />
                    <span className="award-card-light" aria-hidden="true" />
                    <div className="award-logo-wrap">
                      <img className={`award-logo award-logo-${award.id}`} src={award.logo} alt={award.alt} />
                    </div>
                    <div className="award-copy">
                      <h3>
                        {award.title.split("\n").map((line, lineIndex) => (
                          <span className="award-copy-line" key={`${award.id}-title-${lineIndex}`}>
                            {line.split(" ").map((word, wordIndex) => (
                              <span className="award-copy-word" key={`${award.id}-title-${lineIndex}-${wordIndex}`}>
                                {word}{wordIndex < line.split(" ").length - 1 ? "\u00a0" : ""}
                              </span>
                            ))}
                          </span>
                        ))}
                      </h3>
                      <p>
                        {award.body.split(" ").map((word, wordIndex) => (
                          <span className="award-copy-word" key={`${award.id}-body-${wordIndex}`}>
                            {word}{wordIndex < award.body.split(" ").length - 1 ? "\u00a0" : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
      <SiteFooter />

        </div>
      )}
    </main>
    </>
  );
}
