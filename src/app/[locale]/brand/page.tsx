"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "@/i18n/useLocale";
import { copy, type BrandCopy } from "./copy";

const NAV_ITEMS = [
  { id: "logo",            parent: true  },
  { id: "primary-logo"                   },
  { id: "hexagone"                       },
  { id: "clearspace"                     },
  { id: "partnership"                    },
  { id: "color-usage"                    },
  { id: "incorrect-usage"                },
];

const COLOR_IMGS = [
  "/brand/usage-whitebg.png",
  "/brand/usage-monocolorbg.png",
  "/brand/usage-blackbg.png",
  "/brand/usage-gradientbg.webp",
];

const INCORRECT_SRCS = [
  "/brand/not-oldlogo.png",
  "/brand/not-strech.png",
  "/brand/not-custom.png",
  "/brand/not-type.png",
  "/brand/not-multiplecolors.png",
  "/brand/not-othercolor.png",
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
  t,
}: {
  active: string;
  onNav: (id: string) => void;
  onMediaKit: () => void;
  t: BrandCopy;
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
          {t.nav.logo}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="brand-sb-chevron">
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul className="brand-sb-list">
          {NAV_ITEMS.filter((n) => !n.parent).map(({ id }) => (
            <li key={id}>
              <button
                className={`brand-sb-link${active === id ? " active" : ""}`}
                onClick={() => onNav(id)}
              >
                {t.nav[id as keyof typeof t.nav]}
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
          {t.mediaKitBtn}
        </button>
      </div>
    </>
  );
}

export default function BrandPage() {
  const locale = useLocale();
  const t = copy[locale];
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
        <SidebarNav active={active} onNav={goTo} onMediaKit={() => setModal(true)} t={t} />
      </aside>

      {/* ── Mobile burger ── */}
      <button
        className={`brand-burger${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenu(!menuOpen)}
        aria-label={menuOpen ? t.burgerClose : t.burgerOpen}
      >
        <span /><span /><span />
      </button>

      {/* ── Mobile nav ── */}
      <div
        className={`brand-mobile-nav${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenu(false)}
      >
        <div className="brand-mobile-panel" onClick={(e) => e.stopPropagation()}>
          <SidebarNav active={active} onNav={goTo} onMediaKit={() => { setMenu(false); setModal(true); }} t={t} />
        </div>
      </div>

      {/* ── Coming soon modal ── */}
      {showModal && (
        <div ref={modalOverlayRef} className="brand-modal-overlay" onClick={() => setModal(false)}>
          <div ref={modalCardRef} className="brand-modal" onClick={(e) => e.stopPropagation()}>
            <img src="/assets/glass/Danger.svg" alt="" className="brand-modal-icon" aria-hidden="true" />
            <h3 className="brand-modal-title">{t.modal.title}</h3>
            <p className="brand-modal-body">{t.modal.body}</p>
            <button className="brand-modal-close" onClick={() => setModal(false)}>{t.modal.close}</button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="brand-main">

        {/* Hero */}
        <div className="brand-hero">
          <h1 className="brand-hero-title">{t.hero.title}</h1>
        </div>

        {/* Logo */}
        <section id="logo" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.nav.logo}</h2>
            <div className="brand-sd">
              <p>{t.logo.desc}</p>
              <a
                href="/brand/C%20Minds%20-%20Logos.zip"
                download="C Minds - Logos.zip"
                className="brand-dl-btn"
              >
                <img src="/brand/download-icon.svg" alt="" width={16} height={16} className="brand-icon-inv" />
                {t.logo.download}
              </a>
            </div>
          </div>
        </section>

        {/* Primary logo */}
        <section id="primary-logo" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.primaryLogo.title}</h2>
            <div className="brand-sd">
              <p>{t.primaryLogo.desc}</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/primary-logo.png" hover="/brand/primary-logo-hover.webp" alt={t.primaryLogo.alt} />
          </div>
        </section>

        {/* Hexagone */}
        <section id="hexagone" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.hexagone.title}</h2>
            <div className="brand-sd">
              <p>{t.hexagone.desc}</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/hexagone.png" hover="/brand/hexagone-hover.webp" alt={t.hexagone.alt} />
          </div>
        </section>

        {/* Clearspace */}
        <section id="clearspace" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.clearspace.title}</h2>
            <div className="brand-sd">
              <p>{t.clearspace.desc}</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/Cleaspace.png" hover="/brand/Clearspace-hover.webp" alt={t.clearspace.alt} />
          </div>
        </section>

        {/* Partnership */}
        <section id="partnership" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.partnership.title}</h2>
            <div className="brand-sd">
              <p>{t.partnership.desc}</p>
            </div>
          </div>
          <div className="brand-img-card">
            <HoverImg src="/brand/partnership.png" hover="/brand/partnership-hover.webp" alt={t.partnership.alt} />
          </div>
        </section>

        {/* Color usage */}
        <section id="color-usage" className="brand-section">
          <div className="brand-sh brand-sh--full">
            <h2 className="brand-st">{t.colorUsage.title}</h2>
            <div className="brand-sd-cols">
              <div className="brand-sd">
                <p>{t.colorUsage.desc1}</p>
              </div>
              <div className="brand-sd">
                <p>{t.colorUsage.desc2}</p>
                <ol className="brand-ol">
                  {t.colorUsage.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="brand-color-grid">
            {COLOR_IMGS.map((src, i) => (
              <div key={i} className="brand-img-card brand-img-card--fill">
                <img src={src} alt={t.colorUsage.altTemplate.replace("{bg}", t.colorUsage.bgLabels[i])} />
              </div>
            ))}
          </div>
        </section>

        {/* Incorrect usage */}
        <section id="incorrect-usage" className="brand-section">
          <div className="brand-sh">
            <h2 className="brand-st">{t.incorrectUsage.title}</h2>
            <div className="brand-sd">
              <p>{t.incorrectUsage.intro}</p>
            </div>
          </div>
          <div className="brand-incorrect-grid">
            {INCORRECT_SRCS.map((src, i) => (
              <div key={i} className="brand-incorrect-item">
                <div className="brand-img-card brand-img-card--fill">
                  <img src={src} alt={t.incorrectUsage.captions[i]} />
                </div>
                <p className="brand-incorrect-caption">{t.incorrectUsage.captions[i]}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
