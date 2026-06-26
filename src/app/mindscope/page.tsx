"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SideRays from "../../../components/reactbits/SideRays";
import Dock from "../../../components/reactbits/Dock";
import ContactButton from "../../components/ContactButton";
import { useSubscribeModal } from "../../components/SubscribeModalProvider";
const TheArchive = dynamic(() => import("../../components/TheArchive"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const ITEM_H = 84;
const SCROLL_PER_ITEM = 180;

const REEL_BG = [
  "#040314",
  "#180820",
  "#062014",
  "#1e0c06",
  "#06141e",
  "#160618",
  "#1a1206",
  "#071828",
];

type ReelPost = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  published_date: string;
  reading_time_minutes: number;
  language: string;
  author: { name: string; photo_url: string };
};

export default function MindscopePage() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const navItemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const navLightRef   = useRef<HTMLDivElement>(null);
  const reelRef       = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const drumRef       = useRef<HTMLDivElement>(null);
  const reelActiveRef = useRef(0);
  const pubSectionRef = useRef<HTMLElement>(null);

  const [posts, setPosts]               = useState<ReelPost[]>([]);
  const [reelActive, setReelActive]     = useState(0);
  const [hoverNav, setHoverNav]         = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [primaryColor, setPrimaryColor] = useState('#5EC1F3');
  const [subscribed, setSubscribed]     = useState(false);
  const [ringing, setRinging]           = useState(false);
  const [tooltipOpen, setTooltipOpen]   = useState(false);
  const [dockActive, setDockActive]     = useState(0);
  const bellTextRef    = useRef<HTMLSpanElement>(null);
  const bellBtnRef     = useRef<HTMLButtonElement>(null);
  const bellMountedRef = useRef(false);
  const router = useRouter();
  const { open: openSubscribeModal } = useSubscribeModal();

  // ── Fetch blog feed ────────────────────────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed?limit=84"
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setPosts((data.posts ?? []).filter((p: ReelPost) => p.language === "en"));
      } catch (error) {
        console.error("Error fetching blog feed:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  // ── Reel: RAF-driven drum ──────────────────────────────────
  useEffect(() => {
    if (posts.length === 0) return;
    const loopLen = posts.length * 3;
    let rafId: number;

    const update = () => {
      if (!reelRef.current || !trackRef.current) return;
      const scrolled   = Math.max(0, -reelRef.current.getBoundingClientRect().top);
      const floatIdx   = Math.min(scrolled / SCROLL_PER_ITEM, loopLen - 0.001);
      const drumCenter = drumRef.current ? drumRef.current.offsetHeight / 2 : window.innerHeight * 0.4;
      trackRef.current.style.transform =
        `translateY(${drumCenter - floatIdx * ITEM_H - ITEM_H / 2}px)`;
      const newActive = Math.floor(floatIdx);
      if (newActive !== reelActiveRef.current) {
        reelActiveRef.current = newActive;
        setReelActive(newActive);
      }
    };

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [posts.length]);

  // ── Color + subscribed cookies ────────────────────────────
  useLayoutEffect(() => {
    const colorMatch = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
    if (colorMatch) {
      const hex = decodeURIComponent(colorMatch[1]);
      if (VALID_COLORS.includes(hex)) {
        document.documentElement.style.setProperty("--color-primary", hex);
        document.documentElement.style.setProperty("--color-primary-rgb", hexToRgb(hex));
        setPrimaryColor(hex);
      }
    }
    if (/(?:^|;\s*)cminds_subscribed=1/.test(document.cookie)) {
      setSubscribed(true);
    }
  }, []);

  // ── Bell text char animate-in after subscribe toggle ──────
  useEffect(() => {
    if (!bellMountedRef.current) { bellMountedRef.current = true; return; }
    const chars = Array.from(bellTextRef.current?.querySelectorAll<HTMLSpanElement>('.ms-bell-char') ?? []);
    const widths = chars.map(c => c.offsetWidth);
    gsap.set(chars, { opacity: 0, y: 4, filter: 'blur(4px)', scaleX: 0, width: 0, overflow: 'hidden' });
    chars.forEach((c, i) => {
      gsap.to(c, {
        opacity: 1, y: 0, filter: 'blur(0px)', scaleX: 1, width: widths[i],
        duration: 0.07, delay: i * 0.028, ease: 'expo.out',
        onComplete: () => { c.style.removeProperty('width'); c.style.removeProperty('overflow'); },
      });
    });
  }, [subscribed]);

  // ── Close tooltip on outside click ────────────────────────
  useEffect(() => {
    if (!tooltipOpen) return;
    const handler = (e: MouseEvent) => {
      if (!bellBtnRef.current?.contains(e.target as Node)) setTooltipOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tooltipOpen]);

  // ── Unsubscribe ────────────────────────────────────────────
  const handleUnsubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltipOpen(false);
    document.cookie = "cminds_subscribed=; path=/; max-age=0";
    const chars = Array.from(
      bellTextRef.current?.querySelectorAll<HTMLSpanElement>('.ms-bell-char') ?? []
    ).reverse();
    gsap.to(chars, {
      opacity: 0, y: -3, filter: 'blur(3px)', scaleX: 0, width: 0,
      duration: 0.06, stagger: 0.022, ease: 'expo.in',
      onComplete: () => setSubscribed(false),
    });
  };

  // ── Nav indicator ─────────────────────────────────────────
  useEffect(() => {
    const activeIdx = 2; // "Mindscope ®" is index 2
    const targetIdx = hoverNav !== null ? hoverNav : activeIdx;
    const el = navItemRefs.current[targetIdx];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [hoverNav]);

  // ── Page navigation ───────────────────────────────────────
  const navigateWithTransition = (path: string) => {
    sessionStorage.setItem("vt_from", "mindscope");
    const doNavigate = () => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => { router.push(path); });
        });
      } else {
        router.push(path);
      }
    };
    gsap.to([".ms-pill", ".ms-word", ".ms-subscribe-wrap", ".ms-dock-wrap", ".ms-feat-section"], {
      opacity: 0, y: -16, filter: "blur(8px)",
      duration: 0.25, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  const openPost = (slug: string) => {
    sessionStorage.setItem("vt_from", "mindscope");
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        startTransition(() => { router.push(`/mindscope/${slug}`); });
      });
    } else {
      router.push(`/mindscope/${slug}`);
    }
  };

  // ── GSAP page animations ──────────────────────────────────
  useGSAP(() => {
    gsap.fromTo(".ms-pill",
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", delay: 0.3 }
    );
    gsap.fromTo(".ms-word",
      { opacity: 0, y: 36, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.12, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(".ms-subscribe-wrap",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.9 }
    );
    gsap.fromTo(".ms-dock-wrap",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 1.1 }
    );

    const wrap   = containerRef.current?.querySelector<HTMLElement>(".ms-feat-wrap");
    const cardEl = containerRef.current?.querySelector<HTMLElement>(".ms-feat-card");
    const textEl = containerRef.current?.querySelector<HTMLElement>(".ms-feat-text");
    if (!wrap || !cardEl || !textEl) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const centerX = (wrap.clientWidth - cardEl.clientWidth) / 2;
      gsap.set(cardEl, { x: centerX, scale: 1.28, transformOrigin: "center center" });
      gsap.set(textEl, { opacity: 0, x: 30 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".ms-feat-section",
          start: "top 75%",
          end: "+=400",
          scrub: 1,
        },
      });
      tl.to(cardEl, { x: 0, scale: 1, duration: 1.2, ease: "power2.inOut" }, 0);
      tl.to(textEl, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0.8);
    });
  }, { scope: containerRef });

  const loopedPosts = posts.length > 0 ? [...posts, ...posts, ...posts] : [];
  const displayIdx  = reelActive % Math.max(posts.length, 1);
  const activeBg    = REEL_BG[displayIdx % REEL_BG.length];
  const featPost    = posts.length > 0
    ? [...posts].sort((a, b) => b.published_date.localeCompare(a.published_date))[0]
    : null;

  return (
    <div ref={containerRef} className="ms-page">
      <div className="bg-glow" />

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
              className={`nav-item${item === "Mindscope ®" ? " active" : ""}`}
              onMouseEnter={() => setHoverNav(idx)}
              onClick={() => {
                if (item === "Home") navigateWithTransition("/");
                if (item === "Core") navigateWithTransition("/core");
                if (item === "Careers") navigateWithTransition("/careers");
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <ContactButton variant="nav" />
      </nav>

      {/* Hero */}
      <section className="ms-hero">
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
        <div className="ms-hero-group">
          <h1 className="ms-heading">
            <span className="ms-word">Unfolds Multiple</span>
            <span className="ms-word ms-gradient-word">Dimensions</span>
          </h1>
        </div>
        <div className="ms-subscribe-wrap">
          <button
            ref={bellBtnRef}
            className={`ms-bell-btn${subscribed ? " ms-bell-subscribed" : ""}`}
            onClick={() => {
              if (subscribed) { setTooltipOpen(v => !v); return; }
              openSubscribeModal(() => {
                const chars = Array.from(
                  bellTextRef.current?.querySelectorAll<HTMLSpanElement>('.ms-bell-char') ?? []
                ).reverse();
                gsap.to(chars, {
                  opacity: 0, y: -3, filter: 'blur(3px)', scaleX: 0, width: 0,
                  duration: 0.06, stagger: 0.022, ease: 'expo.in',
                  onComplete: () => {
                    setRinging(true);
                    setSubscribed(true);
                    setTimeout(() => setRinging(false), 750);
                  },
                });
              });
            }}
          >
            <span
              className={`ms-bell-tooltip${subscribed && tooltipOpen ? ' ms-bell-tooltip--open' : ''}`}
              onClick={subscribed ? handleUnsubscribe : undefined}
            >
              {subscribed
                ? <>Cancel subscription <span style={{ fontSize: '1rem', lineHeight: 1 }}>×</span></>
                : 'You will be notified about new releases.'}
            </span>
            <span className="ms-bell-text" ref={bellTextRef}>
              {(subscribed ? 'Subscribed' : 'Subscribe').split('').map((ch, i) => (
                <span key={`${subscribed ? 's' : 'u'}-${i}`} className="ms-bell-char">{ch}</span>
              ))}
            </span>
            <span className={`ms-bell-icon${ringing ? ' ms-bell-ring' : ''}`}>
              {subscribed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              )}
            </span>
          </button>
        </div>
      </section>

      {/* Fixed dock — always visible while scrolling */}
      <div className="ms-dock-wrap">
        <Dock
          items={[
            {
              icon: <img src="/mindscope/publicaciones.svg" width={19} height={19} alt="Publications" />,
              label: "Publications",
              className: dockActive === 0 ? 'dock-item--active' : '',
              onClick: () => { setDockActive(0); pubSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); },
            },
            {
              icon: <img src="/mindscope/reportes.svg" width={22} height={22} alt="Reports" />,
              label: "Reports",
              className: dockActive === 1 ? 'dock-item--active' : '',
              onClick: () => setDockActive(1),
            },
            {
              icon: <img src="/mindscope/busqueda.svg" width={18} height={18} alt="Search" />,
              label: "Search",
              className: dockActive === 2 ? 'dock-item--active' : '',
              onClick: () => setDockActive(2),
            },
          ]}
          panelHeight={60}
          baseItemSize={46}
          magnification={62}
          distance={180}
        />
      </div>

      {/* Featured */}
      <section ref={pubSectionRef} className="ms-feat-section">
        <div className="ms-feat-wrap">
          <div
            className="ms-feat-card"
            style={featPost?.cover_image
              ? { background: `url(${featPost.cover_image}) center/cover no-repeat` }
              : undefined}
            onClick={() => featPost && openPost(featPost.slug)}
          >
            {!featPost?.cover_image && <div className="ms-feat-card-dots" />}
            {!featPost?.cover_image && (
              <img src="/loader-logo.svg" className="ms-feat-card-logo" alt="" aria-hidden="true" />
            )}
          </div>
          <div className="ms-feat-text">
            <p className="ms-feat-meta">
              {featPost ? `${fmtDate(featPost.published_date)} · ${featPost.reading_time_minutes} min` : ""}
            </p>
            <h2 className="ms-feat-title">{featPost?.title ?? ""}</h2>
          </div>
        </div>
      </section>

      {/* Reel */}
      {posts.length > 0 && (
        <div
          ref={reelRef}
          className="ms-reel-section"
          style={{ height: `calc(${posts.length * 3 * SCROLL_PER_ITEM}px + 100vh)` }}
        >
          <div className="ms-reel-sticky" style={{ background: activeBg }}>
            <div className="ms-reel-progress">
              <div
                className="ms-reel-progress-thumb"
                style={{ top: `${(displayIdx / Math.max(posts.length - 1, 1)) * 100}%` }}
              />
            </div>
            <div className="ms-reel-left">
              <div className="ms-reel-header">
                <span>Date</span>
                <span>Title</span>
              </div>
              <div className="ms-reel-drum" ref={drumRef}>
                <div className="ms-reel-drum-center-line" />
                <div className="ms-reel-drum-track" ref={trackRef}>
                  {loopedPosts.map((post, i) => (
                    <div
                      key={`${post.id}-${Math.floor(i / posts.length)}`}
                      className={`ms-reel-item${i === reelActive ? " ms-reel-active" : ""}`}
                      onClick={() => openPost(post.slug)}
                    >
                      <span className="ms-reel-date">{fmtDate(post.published_date)}</span>
                      <p className="ms-reel-title">{post.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ms-reel-right">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className={`ms-reel-feat-img${i === displayIdx ? " ms-reel-feat-active" : ""}`}
                  style={{ backgroundImage: `url(${post.cover_image})`, cursor: "pointer" }}
                  onClick={() => openPost(post.slug)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <TheArchive visible={dockActive === 1} />
    </div>
  );
}
