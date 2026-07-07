"use client";

import { useRef, useState, useCallback, useEffect, startTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const HIDDEN_PATHS = ["/bioscanner-launch"];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (HIDDEN_PATHS.some(p => pathname.startsWith(p))) return null;
  const overlayRef  = useRef<HTMLDivElement>(null);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLElement>(null);
  const hiddenRef   = useRef(false);
  const router      = useRouter();

  // ── Auto-hide when scrolled past hero ─────────────────────────
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.85;
      if (past === hiddenRef.current) return;
      hiddenRef.current = past;
      if (past) {
        gsap.to(header, { yPercent: -110, opacity: 0, duration: 0.4, ease: "power2.inOut" });
      } else {
        gsap.to(header, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = useCallback(() => {
    const btn     = btnRef.current;
    const overlay = overlayRef.current;
    const header  = headerRef.current;
    if (!btn || !overlay) return;

    // Restore header so burger stays accessible while overlay is open
    if (hiddenRef.current && header) {
      gsap.to(header, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" });
      hiddenRef.current = false;
    }

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    setOpen(true);
    document.body.style.overflow = "hidden";

    gsap.set(overlay, { display: "flex", clipPath: `circle(0px at ${cx}px ${cy}px)` });
    gsap.to(overlay, {
      clipPath: `circle(150vmax at ${cx}px ${cy}px)`,
      duration: 0.62,
      ease: "power3.inOut",
    });

    const items = contentRef.current?.querySelectorAll<HTMLElement>(".mm-anim");
    if (items?.length) {
      gsap.fromTo(
        Array.from(items),
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, duration: 0.48, stagger: 0.07, ease: "power3.out", delay: 0.38 }
      );
    }
  }, []);

  const closeMenu = useCallback(() => {
    const btn     = btnRef.current;
    const overlay = overlayRef.current;
    if (!btn || !overlay) return;

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    const items = contentRef.current?.querySelectorAll<HTMLElement>(".mm-anim");
    if (items?.length) {
      gsap.to(Array.from(items), {
        opacity: 0, x: -20, duration: 0.18, stagger: 0.03, ease: "power2.in",
      });
    }

    gsap.to(overlay, {
      clipPath: `circle(0px at ${cx}px ${cy}px)`,
      duration: 0.5,
      ease: "power3.inOut",
      delay: 0.1,
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        setOpen(false);
        document.body.style.overflow = "";

        // Re-hide header if user is still scrolled past the hero
        const header = headerRef.current;
        if (header && window.scrollY > window.innerHeight * 0.85) {
          gsap.to(header, { yPercent: -110, opacity: 0, duration: 0.4, ease: "power2.inOut" });
          hiddenRef.current = true;
        }
      },
    });
  }, []);

  const navigate = useCallback((href: string) => {
    if (href === "#") return;
    closeMenu();
    setTimeout(() => {
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          startTransition(() => router.push(href));
        });
      } else {
        router.push(href);
      }
    }, 420);
  }, [closeMenu, router]);

  return (
    <>
      {/* ── Mobile header: logo + burger together ─────────────── */}
      <header ref={headerRef} className={`mm-header${pathname.startsWith("/aiforbiodiversity") ? " mm-header--transparent" : ""}`}>
        {!pathname.startsWith("/aiforbiodiversity") && (
          <div className="mm-logo-wrap" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="C Minds" width={80} height={80} />
          </div>
        )}

        <button
          ref={btnRef}
          className={`mm-burger${open ? " mm-burger--open" : ""}`}
          onClick={open ? closeMenu : openMenu}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="mm-icon-svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
            <line className="mm-line mm-line-1" x1="3" y1="6"  x2="21" y2="6"  />
            <line className="mm-line mm-line-2" x1="3" y1="12" x2="21" y2="12" />
            <line className="mm-line mm-line-3" x1="3" y1="18" x2="21" y2="18" />
          </svg>
          {!open && <span className="mm-dot-badge" />}
        </button>
      </header>

      {/* ── Full-screen overlay ────────────────────────────────── */}
      <div ref={overlayRef} className="mm-overlay" style={{ display: "none" }}>

        {/* Top spacer matching header height */}
        <div className="mm-overlay-spacer">
          <div className="mm-logo-wrap" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="C Minds" width={80} height={80} />
          </div>
        </div>

        {/* Main content */}
        <div ref={contentRef} className="mm-content">

          <p className="mm-where mm-anim">Where to?</p>

          {/* Nav columns */}
          <div className="mm-nav-grid">
            <div className="mm-nav-col">
              {(["Home", "Core", "Mindscope"] as const).map((item) => {
                const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                const isActive = pathname === href;
                return (
                  <button
                    key={item}
                    className={`mm-nav-item mm-anim${isActive ? " mm-nav-item--active" : ""}`}
                    onClick={() => navigate(href)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="mm-nav-col">
              <button
                className="mm-nav-item mm-anim"
                onClick={() => { window.open("https://ecos.naturatech.org", "_blank", "noopener,noreferrer"); }}
              >
                Ecos
              </button>
              <button
                className={`mm-nav-item mm-anim${pathname === "/careers" ? " mm-nav-item--active" : ""}`}
                onClick={() => navigate("/careers")}
              >
                Careers
                <span className="mm-item-dot" />
              </button>
            </div>
          </div>

          {/* Featured initiative */}
          <div className="mm-feat-block mm-anim">
            <p className="mm-feat-label">Featured Initiatives</p>
            <div className="mm-feat-card">
              <img src="/home/featured-ntl.png" alt="NaturaTech LAC" />
              <div className="mm-feat-overlay">
                <span className="mm-feat-name">NaturaTech LAC</span>
                <span className="mm-feat-pill">Regenerative</span>
              </div>
            </div>
            <a href="#" className="mm-feat-see-all">See all initiatives →</a>
          </div>

          {/* Social links — same as footer */}
          <div className="mm-bottom mm-anim">
            <a href="#linkedin" aria-label="LinkedIn" className="mm-social">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" /></svg>
            </a>
            <a href="#instagram" aria-label="Instagram" className="mm-social">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M8.1 4.8h7.8c1.8 0 3.3 1.5 3.3 3.3v7.8c0 1.8-1.5 3.3-3.3 3.3H8.1c-1.8 0-3.3-1.5-3.3-3.3V8.1c0-1.8 1.5-3.3 3.3-3.3Zm0 1.6c-.9 0-1.7.8-1.7 1.7v7.8c0 .9.8 1.7 1.7 1.7h7.8c.9 0 1.7-.8 1.7-1.7V8.1c0-.9-.8-1.7-1.7-1.7H8.1Zm3.9 2.3a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4-2.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" /></svg>
            </a>
            <a href="#x" aria-label="X / Twitter" className="mm-social">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="m6.4 5.4 5 6.7-5.3 6.5h1.8l4.3-5.2 3.9 5.2h4.1l-5.3-7.1 5-6.1h-1.8l-4 4.8-3.6-4.8H6.4Zm2.6 1.3h.9l7.7 10.6h-.9L9 6.7Z" /></svg>
            </a>
            <a href="#facebook" aria-label="Facebook" className="mm-social">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M13.4 20v-7.3h2.4l.4-2.8h-2.8V8.1c0-.8.2-1.4 1.4-1.4h1.5V4.2C16 4.1 15.1 4 14 4c-2.2 0-3.7 1.3-3.7 3.8v2.1H7.8v2.8h2.5V20h3.1Z" /></svg>
            </a>
            <a href="#youtube" aria-label="YouTube" className="mm-social">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M20.4 8.2c-.2-.9-.9-1.5-1.7-1.7C17.2 6.1 12 6.1 12 6.1s-5.2 0-6.7.4c-.8.2-1.5.9-1.7 1.7-.4 1.5-.4 3.8-.4 3.8s0 2.4.4 3.8c.2.9.9 1.5 1.7 1.7 1.5.4 6.7.4 6.7.4s5.2 0 6.7-.4c.8-.2 1.5-.9 1.7-1.7.4-1.5.4-3.8.4-3.8s0-2.4-.4-3.8ZM10.2 14.5v-5l4.5 2.5-4.5 2.5Z" /></svg>
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
