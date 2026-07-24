"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import NavSearch from "../../../components/NavSearch";
import { ScrollBar } from "@/components/v1/skiper1";
import { ThinkingOrb } from "thinking-orbs";

const NAV_ITEMS = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cminds.co";

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
  const nextFillRef  = useRef<HTMLDivElement>(null);
  const nextTeaseRef = useRef<HTMLDivElement>(null);

  const [post, setPost]             = useState<Post | null>(null);
  const [postHtml, setPostHtml]     = useState("");
  const [sections, setSections]     = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [nextPost, setNextPost]     = useState<Post | null>(null);
  const [copied, setCopied]         = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextPostRef     = useRef<Post | null>(null);
  const isNavigatingRef = useRef(false);

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
    if (nextFillRef.current) gsap.set(nextFillRef.current, { scaleX: 0 });
    if (nextTeaseRef.current) gsap.set(nextTeaseRef.current, { opacity: 0 });
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

  // ── Next-post wheel gate: wheel on desktop, tap on touch ──
  useEffect(() => {
    const fill  = nextFillRef.current;

    // Engage once the end-of-article buffer is substantially in view
    // (within half a viewport of the bottom), so the wheel fills the bar
    // right where the "Continue scrolling" prompt appears.
    const atBottom = () =>
      document.documentElement.scrollHeight - window.scrollY - window.innerHeight
        <= window.innerHeight * 0.5;

    const navigateToNext = () => {
      if (isNavigatingRef.current) return;
      const next = nextPostRef.current;
      if (!next) return;
      isNavigatingRef.current = true;
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
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      const onTap = () => {
        if (isNavigatingRef.current) return;
        if (!atBottom()) return;
        navigateToNext();
      };
      window.addEventListener("touchend", onTap);
      return () => window.removeEventListener("touchend", onTap);
    }

    if (!fill) return;

    let progress = 0;
    let drainId: ReturnType<typeof setTimeout> | null = null;

    const drainBack = () => {
      progress = 0;
      gsap.to(fill, { scaleX: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    };

    const onWheel = (e: WheelEvent) => {
      if (isNavigatingRef.current) return;
      if (!atBottom()) return;
      if (e.deltaY <= 0) {
        if (progress > 0) { e.preventDefault(); drainBack(); }
        return;
      }

      e.preventDefault();

      progress = Math.min(1, progress + e.deltaY / 700);
      gsap.killTweensOf(fill);
      gsap.to(fill, { scaleX: progress, duration: 0.22, ease: "power2.out" });

      if (drainId) clearTimeout(drainId);
      drainId = setTimeout(() => {
        if (isNavigatingRef.current) return;
        drainBack();
      }, 700);

      if (progress >= 1) {
        if (drainId) clearTimeout(drainId);
        navigateToNext();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (drainId) clearTimeout(drainId);
    };
    // Re-run once the post/next-post load so nextFillRef exists and the
    // wheel listener actually gets attached (fill is null on first mount).
  }, [router, nextPost, loading]);

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
        <NavSearch />
      </nav>

      {/* Post content */}
      {loading && (
        <div className="ms-post-loading">
          <ThinkingOrb state="solving" size={64} theme="dark" />
        </div>
      )}

      {!loading && post && (
        <>
          <nav className="ms-breadcrumb" aria-label="Breadcrumb">
            <span className="ms-crumb-link" onClick={() => navigateWithTransition("/mindscope")}>
              Mindscope
            </span>
            <span className="ms-crumb-sep">/</span>
            <span className="ms-crumb-current" aria-current="page">{post.title}</span>
          </nav>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: `${SITE_URL}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Mindscope",
                    item: `${SITE_URL}/mindscope`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                    item: `${SITE_URL}/mindscope/${slug}`,
                  },
                ],
              }),
            }}
          />

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
              <div ref={nextTeaseRef} className="ms-next-tease">
                <p className="ms-next-tease-label">
                  Continue scrolling to<br />reveal next post
                </p>
                <div className="ms-next-arrow">↓</div>
                <div className="ms-next-progress-track">
                  <div ref={nextFillRef} className="ms-next-progress-fill" />
                </div>
              </div>
            </div>
          )}

          {/* Reading progress scrollbar */}
          <ScrollBar
            label={`#${activeSection + 1} · ${sections[activeSection]?.label ?? ""}`}
            show={sections.length > 1}
          />
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
