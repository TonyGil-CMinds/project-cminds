"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SiteFooter from "@/components/SiteFooter";
import NavSearch from "@/components/NavSearch";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale, useLocalePath } from "@/i18n/useLocale";
import { common } from "@/i18n/common";
import { copy } from "./copy";

const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function PrivacyPage() {
  const navItemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef     = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection]   = useState("sec-i");
  const [hoverNav, setHoverNav]             = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [primaryColor, setPrimaryColor]     = useState("#5EC1F3");
  const router = useRouter();
  const locale = useLocale();
  const lp     = useLocalePath();
  const t      = copy[locale];
  const tc     = common[locale];
  const NAV_ITEMS = [tc.nav.home, tc.nav.core, tc.nav.mindscope, tc.nav.careers];
  const SECTIONS = t.toc.sections;

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
    const targetIdx = hoverNav ?? -1;
    const el = navItemRefs.current[targetIdx];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
    else setIndicatorStyle(s => ({ ...s, opacity: 0 }));
  }, [hoverNav]);

  // Header entrance
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.fromTo(".prv-title",  { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0)", duration: 0.75, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(".prv-date",   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.4 });
    gsap.fromTo(".prv-rule",   { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7, ease: "power3.out", delay: 0.55 });
    gsap.fromTo(".prv-toc",    { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.7 });
    gsap.fromTo(".prv-section",{ opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.06, delay: 0.75 });
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navigateWithTransition = (path: string) => {
    const target = lp(path);
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        startTransition(() => { router.push(target); });
      });
    } else {
      router.push(target);
    }
  };

  return (
    <div className="prv-page">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigateWithTransition("/")}>
          <img src="/logo.svg" alt="C Minds" />
        </div>
        <div className="nav-menu" onMouseLeave={() => setHoverNav(null)}>
          <div className="nav-menu-light" style={indicatorStyle} />
          {NAV_ITEMS.map((item, idx) => (
            <div
              key={item}
              ref={(el) => { navItemRefs.current[idx] = el; }}
              className="nav-item"
              onMouseEnter={() => setHoverNav(idx)}
              onClick={() => {
                if (item === tc.nav.home)      navigateWithTransition("/");
                if (item === tc.nav.core)      navigateWithTransition("/core");
                if (item === tc.nav.mindscope) navigateWithTransition("/mindscope");
                if (item === tc.nav.careers)   navigateWithTransition("/careers");
              }}
            >{item}</div>
          ))}
        </div>
        <NavSearch />
        <LanguageSwitcher />
      </nav>

      {/* Page header */}
      <div ref={headerRef} className="prv-header">
        <div className="prv-header-top">
          <h1 className="prv-title">{t.header.title}</h1>
          <div className="prv-date">
            <span className="prv-date-label">{t.header.dateLabel}</span>
            <span className="prv-date-value">{t.header.dateValue}</span>
          </div>
        </div>
        <div className="prv-rule" />
      </div>

      {/* Body */}
      <div className="prv-layout">

        {/* ── Left sticky TOC ── */}
        <aside className="prv-toc">
          <p className="prv-toc-label">{t.toc.label}</p>
          <nav>
            {SECTIONS.map(({ id, roman, title }) => (
              <button
                key={id}
                className={`prv-toc-link${activeSection === id ? " prv-toc-link--active" : ""}`}
                onClick={() => scrollToSection(id)}
              >
                <span className="prv-toc-roman">{roman}.</span>
                <span>{title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Right content ── */}
        <main className="prv-content">

          <section id="sec-i" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secI.intro}</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              {t.body.secI.list.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
            <p className="prv-body">{t.body.secI.outro}</p>
          </section>

          <section id="sec-ii" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secII.intro1}</strong>{t.body.secII.intro2}<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>{t.body.secII.intro3}
            </p>
            <blockquote className="prv-blockquote">
              <p><em>{t.body.secII.quoteIntro}</em></p>
              <ul className="prv-list prv-list--bullet">
                {t.body.secII.quoteList.map((item, i) => <li key={i}><em>{item}</em></li>)}
              </ul>
            </blockquote>
            <p className="prv-body">{t.body.secII.outro}</p>
          </section>

          <section id="sec-iii" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secIII.text}</strong>
            </p>
          </section>

          <section id="sec-iv" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secIV.intro}</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              {t.body.secIV.list.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
          </section>

          <section id="sec-v" className="prv-section">
            <p className="prv-body">
              {t.body.secV.text}<strong>{t.body.secV.textStrong}</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>{t.body.secV.list[0]}<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>{t.body.secV.listEnd}</li>
            </ol>
          </section>

          <section id="sec-vi" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secVI.introStrong}</strong>{t.body.secVI.introRest}
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>{t.body.secVI.listStart}<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>{t.body.secVI.listEnd}</li>
            </ol>
          </section>

          <section id="sec-vii" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secVII.introStrong}</strong>{t.body.secVII.introRest}<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>{t.body.secVII.introEnd}
            </p>
          </section>

          <section id="sec-viii" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secVIII.text}</strong>
            </p>
          </section>

          <section id="sec-ix" className="prv-section">
            <p className="prv-body">
              <strong>{t.body.secIX.introStrong}</strong>{t.body.secIX.introRest}
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>{t.body.secIX.item1Start}<a className="prv-link" href="https://www.cminds.co" target="_blank" rel="noopener noreferrer">www.cminds.co</a></li>
              <li>{t.body.secIX.item2}</li>
            </ol>
          </section>

        </main>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
