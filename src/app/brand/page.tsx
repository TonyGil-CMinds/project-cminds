"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const NAV_ITEMS = [
  { id: "logo",            label: "Logo",            parent: true  },
  { id: "primary-logo",    label: "Primary logo"                   },
  { id: "hexagone",        label: "Hexagone"                       },
  { id: "clearspace",      label: "Clearspace"                     },
  { id: "partnership",     label: "Partnership"                    },
  { id: "color-usage",     label: "Color usage"                    },
  { id: "incorrect-usage", label: "Incorrect usage"                },
];

const COLOR_IMGS = [
  "/brand/usage-whitebg.png",
  "/brand/usage-monocolorbg.png",
  "/brand/usage-blackbg.png",
  "/brand/usage-gradientbg.png",
];

const INCORRECT = [
  { src: "/brand/not-oldlogo.png",        caption: "Do not use the old logo"                      },
  { src: "/brand/not-strech.png",         caption: "Do not stretch/squeeze the hexagone"          },
  { src: "/brand/not-custom.png",         caption: "Do not create custom logos"                   },
  { src: "/brand/not-type.png",           caption: "Do not alter the logo type"                   },
  { src: "/brand/not-multiplecolors.png", caption: "Do not apply multiple colors to the logo"     },
  { src: "/brand/not-othercolor.png",     caption: "Do not use unapproved colors"                 },
];

function HoverImg({ src, hover, alt }: { src: string; hover: string; alt: string }) {
  return (
    <div className="brand-himg">
      <img src={src}   alt={alt} className="brand-himg-default" />
      <img src={hover} alt={alt} className="brand-himg-hover"   aria-hidden="true" />
    </div>
  );
}

function SidebarNav({
  active,
  onNav,
  onMediaKit,
}: {
  active: string;
  onNav: (id: string) => void;
  onMediaKit: () => void;
}) {
  return (
    <>
      <div className="brand-sb-top">
        <img src="/logo-black.svg" alt="C Minds" className="brand-sb-logo" />
      </div>

      <nav className="brand-sb-nav">
        <button
          className={`brand-sb-parent${active === "logo" ? " active" : ""}`}
          onClick={() => onNav("logo")}
        >
          Logo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="brand-sb-chevron">
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul className="brand-sb-list">
          {NAV_ITEMS.filter((n) => !n.parent).map(({ id, label }) => (
            <li key={id}>
              <button
                className={`brand-sb-link${active === id ? " active" : ""}`}
                onClick={() => onNav(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="brand-sb-footer">
        <button
          onClick={onMediaKit}
          className="brand-mediakit-btn brand-mediakit-btn--disabled"
        >
          <img src="/brand/mediakit-icon.svg" alt="" width={16} height={16} className="brand-icon-inv" />
          Download MediaKit
        </button>
      </div>
    </>
  );
}

export default function BrandPage() {
  const [active, setActive]     = useState("logo");
  const [menuOpen, setMenu]     = useState(false);
  const [showModal, setModal]   = useState(false);
  const modalOverlayRef         = useRef<HTMLDivElement>(null);
  const modalCardRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("brand-page-active");
    return () => document.body.classList.remove("brand-page-active");
  }, []);

  useEffect(() => {
    if (!showModal) return;
    gsap.fromTo(modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.28, ease: "power2.out" }
    );
    gsap.fromTo(modalCardRef.current,
      { opacity: 0, scale: 0.88, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: "back.out(1.5)" }
    );
  }, [showModal]);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  return (
    <div className="brand-page">

      {/* ── Desktop sidebar ── */}
      <aside className="brand-sidebar">
        <SidebarNav active={active} onNav={goTo} onMediaKit={() => setModal(true)} />
      </aside>

      {/* ── Mobile burger ── */}
      <button
        className={`brand-burger${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenu(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open navigation"}
      >
        <span /><span /><span />
      </button>

      {/* ── Mobile nav ── */}
      <div
        className={`brand-mobile-nav${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenu(false)}
      >
        <div className="brand-mobile-panel" onClick={(e) => e.stopPropagation()}>
          <SidebarNav active={active} onNav={goTo} onMediaKit={() => { setMenu(false); setModal(true); }} />
        </div>
      </div>

      {/* ── Coming soon modal ── */}
      {showModal && (
        <div ref={modalOverlayRef} className="brand-modal-overlay" onClick={() => setModal(false)}>
          <div ref={modalCardRef} className="brand-modal" onClick={(e) => e.stopPropagation()}>
            <img src="/assets/glass/Danger.svg" alt="" className="brand-modal-icon" aria-hidden="true" />
            <h3 className="brand-modal-title">Coming soon</h3>
            <p className="brand-modal-body">The Media Kit will be available for download shortly. Check back soon.</p>
            <button className="brand-modal-close" onClick={() => setModal(false)}>Got it</button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="brand-main">

        {/* Hero */}
        <div className="brand-hero">
          <h1 className="brand-hero-title">Brand Guidelines</h1>
        </div>

        {/* Logo */}
        <section id="logo" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Logo</h2>
            <div className="brand-sd">
              <p>The logo is a brand's primary identifier. It contains both the symbol and our name in wordmark form. It should be used most often to represent our brand, especially to audiences unfamiliar with it.</p>
              <a
                href="/brand/C%20Minds%20-%20Logos.zip"
                download="C Minds - Logos.zip"
                className="brand-dl-btn"
              >
                <img src="/brand/download-icon.svg" alt="" width={16} height={16} className="brand-icon-inv" />
                Download logo
              </a>
            </div>
          </div>
        </section>

        {/* Primary logo */}
        <section id="primary-logo" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Primary logo</h2>
            <div className="brand-sd">
              <p>Our logo is our first impression. Its symbol, a dotted hexagone, embodies "C Minds" and the wordmark complements this symbol with its neutral and organic look.</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/primary-logo.png" hover="/brand/primary-logo-hover.png" alt="C Minds primary logo" />
          </div>
        </section>

        {/* Hexagone */}
        <section id="hexagone" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Hexagone</h2>
            <div className="brand-sd">
              <p>The hexagon is one of nature's most efficient and resilient structures, appearing across living systems from honeycombs to cellular networks. For C Minds, it symbolizes the power of interconnectedness, collaboration, and systems thinking—core principles that have guided our work for over two decades. Its evolution reflects our continued commitment to building bridges across sectors, disciplines, and knowledge systems to help shape more equitable and bioprosperous futures.</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/hexagone.png" hover="/brand/hexagone-hover.png" alt="C Minds hexagone symbol" />
          </div>
        </section>

        {/* Clearspace */}
        <section id="clearspace" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Clearspace</h2>
            <div className="brand-sd">
              <p>Be sure not to crowd the logo. When placing elements nearby, use the letter "C" in the wordmark as a guide for spacing.</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/Cleaspace.png" hover="/brand/Clearspace-hover.png" alt="C Minds logo clearspace guide" />
          </div>
        </section>

        {/* Partnership */}
        <section id="partnership" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Partnership</h2>
            <div className="brand-sd">
              <p>When positioning dual logos in brand partnerships, apply the same clearspace principles. Use a 1.5 px line that extends from the top to the bottom of the symbol's height as a divider between the two logos.</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/partnership.png" hover="/brand/partnership-hover.png" alt="C Minds partnership logo usage" />
          </div>
        </section>

        {/* Color usage */}
        <section id="color-usage" className="brand-section">
          <div className="brand-sh brand-sh--full">
            <h2 className="brand-st">Color usage</h2>
            <div className="brand-sd-cols">
              <div className="brand-sd">
                <p>Our logo should only appear in black, white, or C Minds Blue 600 from the core palette. When placing the logo over imagery, ensure there is enough contrast to maintain clear legibility.</p>
              </div>
              <div className="brand-sd">
                <p>Monochrome versions can be used in the following cases:</p>
                <ol className="brand-ol">
                  <li>The background color or image clashes with C Minds Blue.</li>
                  <li>Printing is limited to black, white, or one color.</li>
                  <li>The logo appears alongside a partner logo.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="brand-color-grid">
            {COLOR_IMGS.map((src, i) => (
              <div key={i} className="brand-img-card brand-img-card--fill">
                <img src={src} alt={`Logo on ${["white", "blue", "black", "gradient"][i]} background`} />
              </div>
            ))}
          </div>
        </section>

        {/* Incorrect usage */}
        <section id="incorrect-usage" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">Incorrect usage</h2>
            <div className="brand-sd">
              <p>Do not alter the logo. Avoid the following treatments.</p>
            </div>
          </div>
          <div className="brand-incorrect-grid">
            {INCORRECT.map((item, i) => (
              <div key={i} className="brand-incorrect-item">
                <div className="brand-img-card brand-img-card--fill">
                  <img src={item.src} alt={item.caption} />
                </div>
                <p className="brand-incorrect-caption">{item.caption}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
