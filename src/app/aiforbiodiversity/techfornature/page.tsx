"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const BASE = "/platforms/aiforbiodiversity/initiative-tech4nature";

export default function Tech4NaturePage() {
  const pageRef       = useRef<HTMLDivElement>(null);
  const heroRef       = useRef<HTMLDivElement>(null);
  const heroBgRef     = useRef<HTMLImageElement>(null);
  const playCenterRef = useRef<HTMLDivElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const infoRef           = useRef<HTMLElement>(null);
  const bodyRef           = useRef<HTMLHeadingElement>(null);
  const missionRef        = useRef<HTMLElement>(null);
  const missionImgWrapRef = useRef<HTMLDivElement>(null);
  const missionImgRef     = useRef<HTMLImageElement>(null);
  const impactRef     = useRef<HTMLElement>(null);
  const kpi1Ref       = useRef<HTMLSpanElement>(null);
  const kpi2Ref       = useRef<HTMLSpanElement>(null);
  const kpi3Ref       = useRef<HTMLSpanElement>(null);
  const slidesWrapRef      = useRef<HTMLDivElement>(null);
  const prevSlideRef       = useRef(0);
  const bioscannerRef        = useRef<HTMLElement>(null);
  const bioscannerImgWrapRef = useRef<HTMLDivElement>(null);
  const bioscannerImgRef     = useRef<HTMLImageElement>(null);
  const arbimonRef           = useRef<HTMLElement>(null);
  const arbimonImgWrapRef    = useRef<HTMLDivElement>(null);
  const arbimonImgRef        = useRef<HTMLImageElement>(null);
  const partnersRef          = useRef<HTMLElement>(null);
  const logosWrapRef         = useRef<HTMLDivElement>(null);
  const transitionRef        = useRef<HTMLDivElement>(null);
  const barFillRef           = useRef<HTMLDivElement>(null);
  const router        = useRouter();
  const [cardVisible, setCardVisible] = useState(true);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePartnerTab, setActivePartnerTab] = useState("ledby");

  const PARTNER_TABS = [
    {
      id: "ledby", label: "LED BY",
      logos: [
        { src: `${BASE}/ledby-cminds-1.svg`,      alt: "C Minds" },
        { src: `${BASE}/ledby-aiforclimate-2.svg`, alt: "Ai for Climate and Biodiversity" },
        { src: `${BASE}/ledby-sds-3.svg`,          alt: "SDS" },
      ],
    },
    {
      id: "innovation", label: "INNOVATION PARTNERS",
      logos: [
        { src: `${BASE}/innovationpartner-upy.svg`, alt: "UPY" },
      ],
    },
    {
      id: "supported", label: "SUPPORTED BY",
      logos: [
        { src: `${BASE}/supportedby-iucn-1.svg`,    alt: "IUCN" },
        { src: `${BASE}/supportedby-greenlist-2.svg`, alt: "Green List" },
        { src: `${BASE}/supportedby-huawei-3.svg`,  alt: "Huawei" },
        { src: `${BASE}/supportedby-tech4all-4.svg`, alt: "Tech4All" },
      ],
    },
  ];

  const handleTabChange = (id: string) => {
    if (id === activePartnerTab) return;
    const wrap = logosWrapRef.current;
    if (!wrap) { setActivePartnerTab(id); return; }
    gsap.to(wrap, {
      opacity: 0, y: -10, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActivePartnerTab(id);
        gsap.fromTo(wrap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
      },
    });
  };

  const SLIDES = [
    {
      entry: "ENTRY 01",
      title: "Automated detection",
      image: `${BASE}/theimpact-jaguar.png`,
      rows: [
        { label: "Images / Video", value: "100,000+" },
        { label: "Audio Files",    value: "600,000+" },
        { label: "Analysis",       value: "3 yrs → months" },
      ],
    },
    {
      entry: "ENTRY 02",
      title: "Two new algorithms",
      image: `${BASE}/theimpact-algorithm.png`,
      rows: [
        { label: "Algorithms",  value: "2" },
        { label: "Accuracy",    value: "90%+" },
        { label: "Individuals", value: "9 jaguars" },
      ],
    },
    {
      entry: "ENTRY 03",
      title: "Platform & people",
      image: `${BASE}/theimpact-platform.png`,
      rows: [
        { label: "Platform", value: "First-of-kind" },
        { label: "Reports",  value: "Open · ethical" },
        { label: "Students", value: "12+" },
      ],
    },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const id = setInterval(() => setActiveSlide(s => (s + 1) % 3), 4500);
    return () => clearInterval(id);
  }, []);

  // Scroll-gate: wheel-based on desktop; tap-to-navigate on touch devices
  useEffect(() => {
    const el   = transitionRef.current;
    const fill = barFillRef.current;
    if (!el || !fill) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // ── MOBILE: tap the card to navigate, no gate needed ──
    if (isTouch) {
      let navigating = false;
      const onTap = () => {
        if (navigating) return;
        const partnersBottom = partnersRef.current?.getBoundingClientRect().bottom ?? 1;
        if (partnersBottom > 0) return; // partners still covering — ignore tap
        navigating = true;
        gsap.to(el, {
          opacity: 0, duration: 0.35,
          onComplete: () => router.push("/aiforbiodiversity/naturatechlac"),
        });
      };
      el.addEventListener("click", onTap);
      return () => el.removeEventListener("click", onTap);
    }

    // ── DESKTOP: wheel fills progress bar ──
    let locked      = false;
    let lockScrollY = 0;
    let progress    = 0;
    let drainId:    ReturnType<typeof setTimeout> | null = null;
    let navigating  = false;

    const lock = () => { locked = true; lockScrollY = window.scrollY; };

    const unlock = () => {
      locked = false;
      progress = 0;
      if (drainId) clearTimeout(drainId);
      gsap.to(fill, { scaleY: 0, duration: 0.15, ease: "power2.out" });
    };

    // Fallback for keyboard / scrollbar — snap back to gate position
    const onScroll = () => {
      if (navigating) return;
      if (locked) { window.scrollTo({ top: lockScrollY, behavior: "instant" }); return; }
      const partnersBottom = partnersRef.current?.getBoundingClientRect().bottom ?? 1;
      if (partnersBottom <= 0) lock();
    };

    const onWheel = (e: WheelEvent) => {
      if (navigating) { e.preventDefault(); return; }

      if (!locked) {
        if (e.deltaY > 0) {
          const partnersBottom = partnersRef.current?.getBoundingClientRect().bottom ?? 1;
          if (partnersBottom <= 0) { e.preventDefault(); lock(); }
        }
        return;
      }

      e.preventDefault();
      if (e.deltaY < 0) { unlock(); return; }

      progress = Math.min(1, progress + e.deltaY / 600);
      gsap.killTweensOf(fill);
      gsap.to(fill, { scaleY: progress, duration: 0.22, ease: "power2.out" });

      if (drainId) clearTimeout(drainId);
      drainId = setTimeout(() => {
        if (navigating) return;
        progress = 0;
        gsap.to(fill, { scaleY: 0, duration: 0.18, ease: "power2.out" });
      }, 700);

      if (progress >= 1) {
        navigating = true;
        if (drainId) clearTimeout(drainId);
        gsap.to(el, {
          opacity: 0, duration: 0.45,
          onComplete: () => router.push("/aiforbiodiversity/naturatechlac"),
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      if (drainId) clearTimeout(drainId);
    };
  }, [router]);

  // Arbimon image hover
  useEffect(() => {
    const wrap = arbimonImgWrapRef.current;
    const img  = arbimonImgRef.current;
    if (!wrap || !img) return;
    const onEnter = () => gsap.to(img, { scale: 1.06, duration: 0.55, ease: "power2.out" });
    const onLeave = () => gsap.to(img, { scale: 1,    duration: 0.65, ease: "power2.out" });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Bioscanner image hover
  useEffect(() => {
    const wrap = bioscannerImgWrapRef.current;
    const img  = bioscannerImgRef.current;
    if (!wrap || !img) return;
    const onEnter = () => gsap.to(img, { scale: 1.06, duration: 0.55, ease: "power2.out" });
    const onLeave = () => gsap.to(img, { scale: 1,    duration: 0.65, ease: "power2.out" });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Init: set slide 0 visible, rest hidden
  useEffect(() => {
    const wrap = slidesWrapRef.current;
    if (!wrap) return;
    const slides = Array.from(wrap.querySelectorAll<HTMLElement>(".t4n-impact-slide"));
    slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }));
  }, []);

  // Slide transition with GSAP
  useEffect(() => {
    const wrap = slidesWrapRef.current;
    if (!wrap) return;
    const slides = Array.from(wrap.querySelectorAll<HTMLElement>(".t4n-impact-slide"));
    const prev = slides[prevSlideRef.current];
    const next = slides[activeSlide];
    if (!prev || !next || prev === next) return;

    // OUT: image scales up slightly, text flies up and fades
    const prevImg     = prev.querySelector<HTMLElement>(".t4n-impact-slide-img");
    const prevContent = prev.querySelectorAll<HTMLElement>(".t4n-impact-slide-entry, .t4n-impact-slide-title, .t4n-impact-slide-row");
    gsap.to(prevImg, { scale: 1.07, duration: 0.36, ease: "power2.in" });
    gsap.to([...prevContent], { y: -16, opacity: 0, duration: 0.28, stagger: 0.04, ease: "power2.in" });
    gsap.to(prev, {
      opacity: 0, duration: 0.36, ease: "power2.in",
      onComplete: () => {
        gsap.set(prev, { pointerEvents: "none" });
        gsap.set(prevImg!, { scale: 1 });
        gsap.set([...prevContent], { y: 0, opacity: 1 });
      },
    });

    // IN: image reveals from scale 1.14 → 1, text staggers up into place
    const nextImg   = next.querySelector<HTMLElement>(".t4n-impact-slide-img");
    const nextEntry = next.querySelector<HTMLElement>(".t4n-impact-slide-entry");
    const nextTitle = next.querySelector<HTMLElement>(".t4n-impact-slide-title");
    const nextRows  = next.querySelectorAll<HTMLElement>(".t4n-impact-slide-row");

    gsap.set(next, { opacity: 0, pointerEvents: "auto" });
    gsap.set(nextImg!, { scale: 1.14 });
    gsap.set([nextEntry, nextTitle, ...nextRows].filter(Boolean), { y: 24, opacity: 0 });

    gsap.to(next,      { opacity: 1, duration: 0.48, delay: 0.22, ease: "power2.out" });
    gsap.to(nextImg!,  { scale: 1,   duration: 0.9,  delay: 0.22, ease: "power3.out" });
    gsap.to(nextEntry, { y: 0, opacity: 1, duration: 0.42, delay: 0.34, ease: "power3.out" });
    gsap.to(nextTitle, { y: 0, opacity: 1, duration: 0.48, delay: 0.42, ease: "power3.out" });
    gsap.to([...nextRows], { y: 0, opacity: 1, duration: 0.42, stagger: 0.08, delay: 0.5, ease: "power3.out" });

    prevSlideRef.current = activeSlide;
  }, [activeSlide]);

  // Auto-hide report card once partners section has been visible and then leaves viewport
  useEffect(() => {
    const partners = partnersRef.current;
    if (!partners) return;
    let wasVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wasVisible = true;
        } else if (wasVisible && cardRef.current) {
          dismissCard();
        }
      },
      { threshold: 0 }
    );
    observer.observe(partners);
    return () => observer.disconnect();
  }, []);

  // Hide global MobileMenu on mobile
  useEffect(() => {
    document.body.classList.add("t4n-active");
    return () => document.body.classList.remove("t4n-active");
  }, []);

  // Play center follows cursor inside the hero
  useEffect(() => {
    const hero = heroRef.current;
    const el   = playCenterRef.current;
    if (!hero || !el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      xTo(e.clientX - r.left - r.width  / 2);
      yTo(e.clientY - r.top  - r.height / 2);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    hero.addEventListener("mousemove",  onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove",  onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Body paragraph: split into word spans, animate per line on scroll
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    // Preserve strong tags by working with the raw innerHTML
    const originalHTML = el.innerHTML;

    // Flatten to plain text, wrapping each word
    const text = el.innerText;
    el.innerHTML = text
      .split(/\s+/)
      .filter(Boolean)
      .map(w => `<span class="t4n-body-word">${w}</span>`)
      .join(" ");

    // Group word spans by their vertical position (= line)
    const words = Array.from(el.querySelectorAll<HTMLElement>(".t4n-body-word"));
    const lineMap = new Map<number, HTMLElement[]>();
    words.forEach(w => {
      const top = Math.round(w.offsetTop);
      if (!lineMap.has(top)) lineMap.set(top, []);
      lineMap.get(top)!.push(w);
    });

    const lines = Array.from(lineMap.values());

    // Set initial state immediately so there's no flash
    gsap.set(words, { opacity: 0, y: 28 });

    lines.forEach((line, i) => {
      gsap.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        delay: i * 0.09,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    return () => {
      el.innerHTML = originalHTML;
    };
  }, []);

  useGSAP(() => {
    // ── Hero entrance ──
    gsap.fromTo(heroRef.current,
      { y: "100%" },
      { y: 0, duration: 1.3, ease: "power3.out" },
    );

    gsap.fromTo(heroBgRef.current,
      { scale: 1.28 },
      { scale: 1, duration: 1.3, ease: "power3.out" },
    );

    gsap.fromTo(
      [heroRef.current?.querySelector(".t4n-hero-overlay"),
       heroRef.current?.querySelector(".t4n-play-center"),
       heroRef.current?.querySelector(".t4n-hero-ctas")],
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.55, stagger: 0.1 },
    );

    gsap.fromTo(cardRef.current,
      { y: "110%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.68, ease: "power3.out", delay: 1.4 },
    );

    // ── Info section: scroll-triggered slide-up + fade ──
    const st = { trigger: infoRef.current, start: "top 82%" };

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-meta"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", scrollTrigger: st },
    );

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-logo"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.08, scrollTrigger: st },
    );

    gsap.fromTo(infoRef.current?.querySelector(".t4n-info-location"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.16, scrollTrigger: st },
    );

    const rightChildren = infoRef.current?.querySelectorAll(".t4n-info-right > *");
    if (rightChildren?.length) {
      gsap.fromTo(rightChildren,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: 0.1, scrollTrigger: st },
      );
    }

    // ── Mission section: zoom-reveal image + content fade ──
    const mst = { trigger: missionRef.current, start: "top 80%" };

    // Container grows from small scale while image shrinks to its final size
    gsap.fromTo(missionImgWrapRef.current,
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: mst },
    );
    gsap.fromTo(missionImgRef.current,
      { scale: 1.32 },
      { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: mst },
    );

    // Title + columns slide up
    gsap.fromTo(missionRef.current?.querySelector(".t4n-mission-title"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.18, scrollTrigger: mst },
    );
    gsap.fromTo(missionRef.current?.querySelectorAll(".t4n-mission-col"),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.12, delay: 0.28, scrollTrigger: mst },
    );

    // ── Impact section ──
    const ist = { trigger: impactRef.current, start: "top 80%" };

    // Title + desc + KPIs slide up
    gsap.fromTo(impactRef.current?.querySelector(".t4n-impact-title"),
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", scrollTrigger: ist },
    );
    gsap.fromTo(impactRef.current?.querySelector(".t4n-impact-desc"),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.08, scrollTrigger: ist },
    );
    gsap.fromTo(impactRef.current?.querySelectorAll(".t4n-impact-kpi"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.1, delay: 0.18, scrollTrigger: ist },
    );
    gsap.fromTo(impactRef.current?.querySelector(".t4n-impact-slideshow"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.32, scrollTrigger: ist },
    );

    // KPI count-up
    const n1 = { val: 0 }, n2 = { val: 0 }, n3 = { val: 0 };
    gsap.to(n1, {
      val: 9, duration: 1.8, ease: "power2.out",
      onUpdate() { if (kpi1Ref.current) kpi1Ref.current.textContent = String(Math.round(n1.val)); },
      scrollTrigger: ist,
    });
    gsap.to(n2, {
      val: 90, duration: 1.8, ease: "power2.out",
      onUpdate() { if (kpi2Ref.current) kpi2Ref.current.textContent = Math.round(n2.val) + "%+"; },
      scrollTrigger: ist,
    });
    gsap.to(n3, {
      val: 147, duration: 1.8, ease: "power2.out",
      onUpdate() { if (kpi3Ref.current) kpi3Ref.current.textContent = String(Math.round(n3.val)); },
      scrollTrigger: ist,
    });

    // ── Bioscanner section ──
    const bst = { trigger: bioscannerRef.current, start: "top 80%" };
    gsap.fromTo(bioscannerImgWrapRef.current,
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: bst },
    );
    gsap.fromTo(bioscannerImgRef.current,
      { scale: 1.32 },
      { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: bst },
    );
    gsap.fromTo(bioscannerRef.current?.querySelector(".t4n-bioscanner-chip"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.22, scrollTrigger: bst },
    );

    // ── Arbimon section ──
    const art = { trigger: arbimonRef.current, start: "top 80%" };
    gsap.fromTo(arbimonImgWrapRef.current,
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.15, ease: "power3.out", scrollTrigger: art },
    );
    gsap.fromTo(arbimonImgRef.current,
      { scale: 1.32 },
      { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: art },
    );
    gsap.fromTo(arbimonRef.current?.querySelector(".t4n-bioscanner-chip"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.22, scrollTrigger: art },
    );

    // ── Partners section ──
    const pst = { trigger: partnersRef.current, start: "top 85%" };
    gsap.fromTo(partnersRef.current?.querySelector(".t4n-partners-tabs"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", scrollTrigger: pst },
    );
    gsap.fromTo(logosWrapRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.15, scrollTrigger: pst },
    );

    // ── Transition card: grows with scroll as partners slides away ──
    const tShell = transitionRef.current?.parentElement;
    const tCard  = transitionRef.current?.querySelector<HTMLElement>(".t4n-transition-card");
    if (tShell && tCard) {
      gsap.fromTo(tCard,
        { scale: 0.6 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: tShell,
            start: "top top",
            // partners is 100dvh tall — card reaches full size exactly when partners is gone
            end: () => "+=" + window.innerHeight,
            scrub: 1.2,
          },
        }
      );
    }
  }, { scope: pageRef });

  // Exit: reverse of entrance
  const goBack = () => {
    gsap.to(cardRef.current, { y: "110%", duration: 0.28, ease: "power2.in" });
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, {
      y: "100%", duration: 1.0, ease: "power3.in",
      onComplete: () => router.back(),
    });
  };

  const exitTo = (href: string) => {
    gsap.to(cardRef.current, { y: "110%", duration: 0.28, ease: "power2.in" });
    gsap.to(heroBgRef.current, { scale: 1.28, duration: 1.0, ease: "power3.in" });
    gsap.to(heroRef.current, {
      y: "100%", duration: 1.0, ease: "power3.in",
      onComplete: () => router.push(href),
    });
  };

  const openVideo = () => {
    const overlay = videoOverlayRef.current;
    const video   = videoRef.current;
    if (!overlay || !video) return;

    video.currentTime = 0;
    video.volume = 1;

    gsap.killTweensOf([overlay, video]);
    gsap.set(overlay, { display: "flex", pointerEvents: "auto" });
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(video,   { scale: 0.88 }, { scale: 1, duration: 0.45, ease: "power3.out" });

    const p = video.play();
    if (p) p.catch(() => {});
  };

  const closeVideo = () => {
    const overlay = videoOverlayRef.current;
    if (!overlay) return;
    gsap.killTweensOf([overlay, videoRef.current]);
    gsap.to(videoRef.current, { scale: 0.88, duration: 0.3, ease: "power2.in" });
    gsap.to(overlay, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        gsap.set(overlay, { display: "none", pointerEvents: "none" });
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
    });
  };

  const dismissCard = () => {
    gsap.to(cardRef.current, {
      y: "110%", duration: 0.42, ease: "power3.in",
      onComplete: () => setCardVisible(false),
    });
  };

  return (
    <div ref={pageRef} className="afb-page t4n-page">

      {/* Fullscreen video overlay — always mounted, GSAP controls visibility */}
      <div
        ref={videoOverlayRef}
        className="t4n-video-overlay"
        style={{ display: "none", pointerEvents: "none" }}
        onClick={closeVideo}
      >
        <button className="t4n-video-close" onClick={closeVideo} aria-label="Close video">×</button>
        <video
          ref={videoRef}
          src={process.env.NEXT_PUBLIC_T4N_HERO_VIDEO_URL || undefined}
          className="t4n-video-player"
          playsInline
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* Hero container */}
      <div ref={heroRef} className="t4n-hero" onClick={openVideo} style={{ cursor: "pointer" }}>

        <img
          ref={heroBgRef}
          src={`${BASE}/tech4nature-hero.png`}
          alt="Tech4Nature México"
          className="t4n-hero-bg"
        />

        <div className="t4n-hero-overlay" aria-hidden="true" />

        <button className="t4n-close" onClick={goBack} aria-label="Back to Initiatives">
          ×
        </button>

        <div ref={playCenterRef} className="t4n-play-center">
          <img src={`${BASE}/playvideo.svg`} alt="" className="t4n-play-center-icon" />
        </div>

        <div className="t4n-hero-ctas">
          <button className="t4n-cta-btn t4n-cta-btn--filled" onClick={e => { e.stopPropagation(); openVideo(); }}>
            <img src={`${BASE}/playvideo.svg`} alt="" className="t4n-cta-icon" />
            See Video
          </button>
          <button className="t4n-cta-btn t4n-cta-btn--outline" onClick={e => { e.stopPropagation(); infoRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
            See Results
            <img src={`${BASE}/arrowDown.svg`} alt="" className="t4n-cta-icon" />
          </button>
        </div>

      </div>

      {/* ── Info section ── */}
      <section ref={infoRef} className="t4n-info">
        <div className="t4n-info-top">

          <div className="t4n-info-left">
            <div className="t4n-info-meta">
              <span className="t4n-info-chip">PHASE 1</span>
              <span className="t4n-info-date">2022 - 2024</span>
            </div>

            <img
              src={`${BASE}/logo-tech4nature.svg`}
              alt="Tech4Nature México"
              className="t4n-info-logo"
            />

            <div className="t4n-info-location">
              <img src={`${BASE}/location.svg`} alt="" className="t4n-info-loc-icon" />
              <span>Dzilam State Reserve</span>
            </div>
          </div>

          <div className="t4n-info-right">
            <h5 className="t4n-info-desc">
              A multisectoral collaboration for jaguar conservation in the Yucatán Peninsula.
            </h5>
            <button className="t4n-info-download">
              Download report
              <img src={`${BASE}/arrowDown.svg`} alt="" className="t4n-info-dl-icon" />
            </button>
          </div>

        </div>

        <h3 ref={bodyRef} className="t4n-info-body">
          <strong>Tech4Nature Mexico</strong> works to accelerate the effective conservation and
          regeneration of biodiversity and ecosystem health, strengthening monitoring, conservation,
          and understanding of the impacts of climate change on ecosystems and priority species
          in the mangrove area of the Yucatán Peninsula.
        </h3>
      </section>

      {/* ── Mission section ── */}
      <section ref={missionRef} className="t4n-mission">

        <div ref={missionImgWrapRef} className="t4n-mission-img-wrap">
          <img
            ref={missionImgRef}
            src={`${BASE}/themision.png`}
            alt="The Mission"
            className="t4n-mission-img"
          />
        </div>

        <h3 className="t4n-mission-title">The Mision</h3>

        <div className="t4n-mission-body">
          <div className="t4n-mission-col">
            <p>Our mission at Tech4Nature México centers on understanding, preserving and restoring the Dzilam State Reserve to provide a secure sanctuary for a rich variety of plant and animal species.</p>
            <p>Nestled in the northeastern region of Yucatan, the Dzilam State Reserve is a natural protected area with over <strong>69,000 hectares</strong> that belongs to the municipalities of Dzilam de Bravo and San Felipe.</p>
          </div>
          <div className="t4n-mission-col">
            <p>This reserve holds a special status as a critical wetland conservation site, boasting nearly <strong>290 species of fauna</strong> intricately linked with over <strong>300 flora species</strong>. It spans five distinct vegetation types, including coastal dunes, mangroves, petenes, along with vibrant aquatic flora in coastal lagoons.</p>
          </div>
        </div>

      </section>

      {/* ── Impact section ── */}
      <section ref={impactRef} className="t4n-impact">

        <h3 className="t4n-impact-title">The Impact</h3>
        <p className="t4n-impact-desc">
          Camera traps, audio recorders and two custom AI models turned an overwhelming archive
          into a living catalogue of individuals — observed, logged and identified.
        </p>

        {/* KPI cards */}
        <div className="t4n-impact-kpis">
          <div className="t4n-impact-kpi">
            <span ref={kpi1Ref} className="t4n-impact-kpi-num">0</span>
            <div className="t4n-impact-kpi-label">
              <img src={`${BASE}/icon-individuals.svg`} alt="" className="t4n-impact-kpi-icon" />
              Individual jaguars identified
            </div>
          </div>
          <div className="t4n-impact-kpi">
            <span ref={kpi2Ref} className="t4n-impact-kpi-num">0%+</span>
            <div className="t4n-impact-kpi-label">
              <img src={`${BASE}/icon-levelaccuracy.svg`} alt="" className="t4n-impact-kpi-icon" />
              Individual-level accuracy
            </div>
          </div>
          <div className="t4n-impact-kpi">
            <span ref={kpi3Ref} className="t4n-impact-kpi-num">0</span>
            <div className="t4n-impact-kpi-label">
              Species detected
              <span className="t4n-impact-kpi-risk">40 at risk</span>
            </div>
          </div>
        </div>

        {/* Slideshow */}
        <div className="t4n-impact-slideshow">
          <div ref={slidesWrapRef} className="t4n-impact-slides-wrap">
            {SLIDES.map((slide, i) => (
              <div key={i} className={`t4n-impact-slide${activeSlide === i ? " active" : ""}`}>
                <img src={slide.image} alt={slide.title} className="t4n-impact-slide-img" />
                <div className="t4n-impact-slide-content">
                  <span className="t4n-impact-slide-entry">{slide.entry}</span>
                  <h4 className="t4n-impact-slide-title">{slide.title}</h4>
                  <div className="t4n-impact-slide-rows">
                    {slide.rows.map((row, j) => (
                      <div key={j} className="t4n-impact-slide-row">
                        <span className="t4n-impact-slide-row-label">{row.label}</span>
                        <span className="t4n-impact-slide-row-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="t4n-impact-dots">
            {[0, 1, 2].map(i => (
              <button
                key={i}
                className={`t4n-impact-dot${activeSlide === i ? " active" : ""}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </section>

      {/* ── Bioscanner section — left ── */}
      <section ref={bioscannerRef} className="t4n-bioscanner">
        <a
          href="https://bioscanner.io"
          target="_blank"
          rel="noopener noreferrer"
          className="t4n-bioscanner-link"
        >
          <div ref={bioscannerImgWrapRef} className="t4n-bioscanner-img-wrap">
            <img
              ref={bioscannerImgRef}
              src={`${BASE}/bioscanner.png`}
              alt="Bioscanner"
              className="t4n-bioscanner-img"
            />
          </div>
          <span className="t4n-bioscanner-chip">Bioscanner <strong>BETA</strong></span>
        </a>
      </section>

      {/* ── Arbimon section — right ── */}
      <section ref={arbimonRef} className="t4n-bioscanner t4n-bioscanner--right">
        <a
          href="https://arbimon.org"
          target="_blank"
          rel="noopener noreferrer"
          className="t4n-bioscanner-link t4n-bioscanner-link--right"
        >
          <div ref={arbimonImgWrapRef} className="t4n-bioscanner-img-wrap">
            <img
              ref={arbimonImgRef}
              src={`${BASE}/audibon.png`}
              alt="Arbimon"
              className="t4n-bioscanner-img"
            />
          </div>
          <span className="t4n-bioscanner-chip t4n-bioscanner-chip--right">ARBIMON</span>
        </a>
      </section>

      {/* ── Reveal shell: transition (sticky, z-index:1) is revealed as partners (z-index:2) scrolls away ── */}
      <div className="t4n-reveal-shell">

        {/* Transition sticks at top — always behind partners until partners leaves */}
        <div ref={transitionRef} className="t4n-transition">

          <div className="t4n-transition-card">
            <div className="t4n-transition-card-overlay" />
            <div className="t4n-transition-card-content">
              <span className="t4n-transition-next-label">Next up...</span>
              <h2 className="t4n-transition-next-title">NaturaTech LAC</h2>
            </div>
          </div>

          {/* Right progress bar */}
          <div className="t4n-transition-bar-track">
            <div ref={barFillRef} className="t4n-transition-bar-fill" />
          </div>

          {/* Bottom hint */}
          <div className="t4n-transition-hint">
            <span>Keep <em>scrolling!</em></span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

        </div>

        {/* Partners: normal flow, z-index:2, sits on top of transition via negative margin */}
        <section ref={partnersRef} className="t4n-partners">

          <div className="t4n-partners-tabs">
            {PARTNER_TABS.map(tab => (
              <button
                key={tab.id}
                className={`t4n-partners-tab${activePartnerTab === tab.id ? " active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={logosWrapRef} className="t4n-partners-logos">
            {PARTNER_TABS.find(t => t.id === activePartnerTab)?.logos.map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="t4n-partners-logo" />
            ))}
          </div>

        </section>

      </div>

      {/* Report card — fixed bottom-right */}
      {cardVisible && (
        <div ref={cardRef} className="t4n-report-card">
          <button className="t4n-report-close" onClick={dismissCard} aria-label="Close">×</button>
          <img src={`${BASE}/report1.png`} alt="" className="t4n-report-image" />
          <div className="t4n-report-body">
            <span className="t4n-report-chip">PHASE I</span>
            <p className="t4n-report-title">Ethical Use of AI Systems for Biodiversity...</p>
            <button className="t4n-report-cta">Download Report</button>
          </div>
        </div>
      )}

    </div>
  );
}
