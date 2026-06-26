"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ContactButton from "../../../components/ContactButton";

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

type Post = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  published_date: string;
  reading_time_minutes: number;
  language: string;
  content?: string;
  author: { name: string; photo_url: string };
};

type Section = {
  id: string;
  label: string;
  type: "heading" | "paragraph";
};

function prepareContent(html: string): { sections: Section[]; html: string } {
  if (typeof document === "undefined" || !html) return { sections: [], html: html || "" };

  const doc = new DOMParser().parseFromString(html, "text/html");

  // Strip dark inline colors from CMS so text is readable on dark bg
  doc.querySelectorAll("[style]").forEach((el) => {
    const cleaned = (el.getAttribute("style") || "")
      .replace(/\bcolor\s*:[^;]+;?/gi, "")
      .replace(/\bbackground(?:-color)?\s*:[^;]+;?/gi, "")
      .trim();
    if (cleaned) el.setAttribute("style", cleaned);
    else el.removeAttribute("style");
  });

  const sections: Section[] = [];
  let idx = 0;

  doc.body.querySelectorAll("h1,h2,h3,h4,p").forEach((el) => {
    const text = el.textContent?.trim() || "";
    if (!text) return;
    const tag = el.tagName.toLowerCase();
    const isHeading = ["h1", "h2", "h3", "h4"].includes(tag);
    const id = `ms-s${idx++}`;
    el.id = id;
    const label = isHeading
      ? text.slice(0, 50)
      : text.split(/\s+/).slice(0, 3).join(" ");
    sections.push({ id, label, type: isHeading ? "heading" : "paragraph" });
  });

  return { sections, html: doc.body.innerHTML };
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const msItemRef    = useRef<HTMLDivElement>(null);
  const navLightRef  = useRef<HTMLDivElement>(null);
  const trackElRef      = useRef<HTMLDivElement>(null);
  const isDragging      = useRef(false);
  const swipeTouchStart = useRef<number | null>(null);
  const sectionsRef  = useRef<Section[]>([]);

  const [post, setPost]             = useState<Post | null>(null);
  const [postHtml, setPostHtml]     = useState("");
  const [sections, setSections]     = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [nextPost, setNextPost]     = useState<Post | null>(null);
  const [nextProgress, setNextProgress] = useState(0);
  const [copied, setCopied]         = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextPostRef     = useRef<Post | null>(null);
  const isNavigatingRef = useRef(false);

  // Keep sectionsRef in sync to avoid stale closure in drag handler
  useEffect(() => { sectionsRef.current = sections; }, [sections]);
  useEffect(() => { nextPostRef.current = nextPost; }, [nextPost]);

  // ── Color cookie ──────────────────────────────────────────
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

  // ── Nav indicator ─────────────────────────────────────────
  useLayoutEffect(() => {
    if (!msItemRef.current || !navLightRef.current) return;
    const item   = msItemRef.current;
    const parent = item.parentElement!;
    navLightRef.current.style.left  = `${item.getBoundingClientRect().left - parent.getBoundingClientRect().left}px`;
    navLightRef.current.style.width = `${item.getBoundingClientRect().width}px`;
  }, []);

  // ── Reset on slug change ──────────────────────────────────
  useEffect(() => {
    isNavigatingRef.current = false;
    setNextProgress(0);
    window.scrollTo(0, 0);
  }, [slug]);

  // ── Fetch post ────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    const fetch_ = async () => {
      try {
        const res  = await fetch(
          "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed?limit=84"
        );
        const data = await res.json();
        const allPosts: Post[] = (data.posts ?? []).filter((p: Post) => p.language === "en");
        const found: Post | undefined = (data.posts ?? []).find(
          (p: Post) => p.slug === slug
        );
        if (found) {
          setPost(found);
          const { sections: secs, html } = prepareContent(found.content || "");
          setSections(secs);
          setPostHtml(html);
        }
        // Compute next post (sorted desc by date, wrap around)
        const sorted = [...allPosts].sort((a: Post, b: Post) =>
          b.published_date.localeCompare(a.published_date)
        );
        const curIdx = sorted.findIndex((p: Post) => p.slug === slug);
        const nextP = curIdx >= 0 ? sorted[(curIdx + 1) % sorted.length] : null;
        setNextPost(nextP);
        nextPostRef.current = nextP;
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [slug]);

  // ── Entry animation ───────────────────────────────────────
  useGSAP(() => {
    if (!post) return;
    gsap.fromTo(".ms-post-date, .ms-post-title, .ms-post-cover, .ms-post-body",
      { opacity: 0, y: 55, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.12, ease: "back.out(1.8)", delay: 0.08 }
    );
  }, { scope: containerRef, dependencies: [post] });

  // ── IntersectionObserver → active section ─────────────────
  useEffect(() => {
    if (!sections.length) return;

    const visibleSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visibleSet.add(e.target.id);
          else visibleSet.delete(e.target.id);
        });
        const topmost = sections.find((s) => visibleSet.has(s.id));
        if (topmost) {
          setActiveSection(sections.findIndex((s) => s.id === topmost.id));
        }
      },
      {
        threshold: 0,
        // Trigger zone covers the upper 45% of the viewport — generous enough
        // for large desktops while still feeling "ahead" of the reading position.
        rootMargin: "0px 0px -55% 0px",
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    // Near-bottom fallback: last section can never scroll into the trigger zone
    // because there isn't enough page left. Snap to last when within 120px of end.
    const onScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (distanceFromBottom < 120) {
        setActiveSection(sections.length - 1);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  // ── Next-post scroll trigger ──────────────────────────────
  useEffect(() => {
    // Total extra scroll: 220px tease zone + 560px confirmation zone = 780px
    const BUFFER_H = 780;
    // Navigation only fires once progress reaches 1 (absolute bottom)
    const onScroll = () => {
      if (isNavigatingRef.current) return;
      const distFromBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - distFromBottom / BUFFER_H));
      setNextProgress(progress);
      if (distFromBottom <= 2 && nextPostRef.current) {
        isNavigatingRef.current = true;
        const next = nextPostRef.current;
        gsap.to(".ms-post-date, .ms-post-title, .ms-post-cover, .ms-post-body", {
          y: -50,
          opacity: 0,
          scale: 0.95,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.in",
          onComplete: () => {
            if (typeof document !== "undefined" && "startViewTransition" in document) {
              (document as any).startViewTransition(() => {
                startTransition(() => { router.push(`/mindscope/${next.slug}`); });
              });
            } else {
              router.push(`/mindscope/${next.slug}`);
            }
          },
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Drag handler for slider thumb ─────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !trackElRef.current) return;
      const rect    = trackElRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const ratio   = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
      const idx     = Math.round(ratio * (sectionsRef.current.length - 1));
      setActiveSection(idx);
      const el = document.getElementById(sectionsRef.current[idx]?.id ?? "");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const onUp = () => { isDragging.current = false; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, []);

  // ── Navigation ────────────────────────────────────────────
  const navigateWithTransition = (path: string) => {
    sessionStorage.setItem("vt_from", "post");
    const doNavigate = () => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => { router.push(path); });
        });
      } else {
        router.push(path);
      }
    };
    gsap.to(".ms-post-date, .ms-post-title, .ms-post-cover", {
      opacity: 0, y: -16, duration: 0.2, stagger: 0.04, ease: "power2.in",
      onComplete: doNavigate,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackElRef.current || isDragging.current) return;
    const rect  = trackElRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const idx   = Math.round(ratio * (sections.length - 1));
    setActiveSection(idx);
    scrollToSection(sections[idx]?.id ?? "");
  };

  const handleCardTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    swipeTouchStart.current = e.touches[0].clientX;
  };

  const handleCardTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (swipeTouchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - swipeTouchStart.current;
    swipeTouchStart.current = null;
    if (Math.abs(delta) < 40) return;
    const next = delta < 0
      ? Math.min(activeSection + 1, sections.length - 1)
      : Math.max(activeSection - 1, 0);
    if (next === activeSection) return;
    setActiveSection(next);
    scrollToSection(sections[next]?.id ?? "");
  };

  const thumbPct = sections.length > 1
    ? (activeSection / (sections.length - 1)) * 100
    : 0;

  return (
    <div ref={containerRef} className="ms-post-page">
      <div className="bg-glow" />

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand" style={{ cursor: "pointer" }}
          onClick={() => navigateWithTransition("/")}>
          <img src="/logo.svg" alt="C Minds" />
        </div>
        <div className="nav-menu">
          <div className="nav-menu-light" ref={navLightRef} />
          {NAV_ITEMS.map((item) => (
            <div
              key={item}
              ref={item === "Mindscope ®" ? msItemRef : undefined}
              className={`nav-item${item === "Mindscope ®" ? " active" : ""}`}
              onClick={() => {
                if (item === "Home")         navigateWithTransition("/");
                if (item === "Core")         navigateWithTransition("/core");
                if (item === "Careers")      navigateWithTransition("/careers");
                if (item === "Mindscope ®")  navigateWithTransition("/mindscope");
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <ContactButton variant="nav" />
      </nav>

      {/* Post content */}
      {loading && (
        <div className="ms-post-loading">
          <span className="ms-post-loading-dot" />
        </div>
      )}

      {!loading && post && (
        <>
          <div className="ms-post-header">
            <p className="ms-post-date">
              {fmtDate(post.published_date)}
              {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ""}
            </p>
            <h1 className="ms-post-title">{post.title}</h1>
            <div className="ms-post-cover">
              {post.cover_image && (
                <img src={post.cover_image} alt={post.title} />
              )}
            </div>
          </div>

          <div
            className="ms-post-body"
            dangerouslySetInnerHTML={{ __html: postHtml || "<p>No content available.</p>" }}
          />

          {/* Share row */}
          <div className="ms-share-row">
            <span className="ms-share-text">Share with friends</span>
            <button className="ms-share-btn" onClick={handleCopy} aria-label="Copy link">
              <span className="ms-share-tooltip">Copy to share</span>
              {copied ? (
                <svg key="check" className="ms-share-icon-enter" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <img key="link" src="/link.svg" width={17} height={10} alt="Copy link" />
              )}
            </button>
          </div>

          {/* Next post scroll buffer */}
          {nextPost && (
            <div className="ms-next-buffer">
              <div className="ms-next-tease" style={{ opacity: Math.max(0, Math.min(1, (nextProgress - 0.08) / 0.2)) }}>
                <p className="ms-next-tease-label">
                  Continue scrolling to<br />reveal next post
                </p>
                <div className="ms-next-arrow">↓</div>
                <div className="ms-next-progress-track">
                  <div
                    className="ms-next-progress-fill"
                    style={{ width: `${Math.max(0, Math.min(100, ((nextProgress - 0.28) / 0.72) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reading slider */}
          {sections.length > 1 && (
            <div className="ms-slider">
              {/* Label card */}
              <div className="ms-slider-label-card">
                <span className="ms-slider-num">#{activeSection + 1}</span>
                {" "}{sections[activeSection]?.label}
              </div>

              {/* Track card */}
              <div
                className="ms-slider-track-card"
                onTouchStart={handleCardTouchStart}
                onTouchEnd={handleCardTouchEnd}
              >
                <div
                  ref={trackElRef}
                  className="ms-slider-track"
                  onClick={handleTrackClick}
                >
                  {/* Ruler: major ticks mark section starts, minor ticks fill gaps */}
                  <div className="ms-slider-ticks">
                    {Array.from({ length: 55 }, (_, i) => {
                      const isMajor = sections.some((_, si) =>
                        Math.round((si / Math.max(sections.length - 1, 1)) * 54) === i
                      );
                      return (
                        <div
                          key={i}
                          className={`ms-slider-tick${isMajor ? " major" : ""}`}
                        />
                      );
                    })}
                  </div>

                  {/* Draggable thumb */}
                  <div
                    className="ms-slider-thumb"
                    style={{ left: `${thumbPct}%` }}
                    onMouseDown={(e) => { e.stopPropagation(); isDragging.current = true; }}
                    onTouchStart={(e) => { e.stopPropagation(); isDragging.current = true; }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !post && (
        <div className="ms-post-not-found">
          <p>Post not found.</p>
          <button onClick={() => navigateWithTransition("/mindscope")}>← Back to Mindscope</button>
        </div>
      )}
    </div>
  );
}
