"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SiteFooter from "../../components/SiteFooter";

const NAV_ITEMS  = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

const SECTIONS = [
  { id: "sec-i",    roman: "I",    title: "Data We Collect" },
  { id: "sec-ii",   roman: "II",   title: "Optional Data" },
  { id: "sec-iii",  roman: "III",  title: "Legal Framework" },
  { id: "sec-iv",   roman: "IV",   title: "Data Transfers" },
  { id: "sec-v",    roman: "V",    title: "ARCO Rights" },
  { id: "sec-vi",   roman: "VI",   title: "Revoking Consent" },
  { id: "sec-vii",  roman: "VII",  title: "Limiting Disclosure" },
  { id: "sec-viii", roman: "VIII", title: "Cookies & Tracking" },
  { id: "sec-ix",   roman: "IX",   title: "Policy Updates" },
];

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
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        startTransition(() => { router.push(path); });
      });
    } else {
      router.push(path);
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
                if (item === "Home")      navigateWithTransition("/");
                if (item === "Core")      navigateWithTransition("/core");
                if (item === "Mindscope ®") navigateWithTransition("/mindscope");
                if (item === "Careers")   navigateWithTransition("/careers");
              }}
            >{item}</div>
          ))}
        </div>
        <button className="hero-button nav-contact">Contact us</button>
      </nav>

      {/* Page header */}
      <div ref={headerRef} className="prv-header">
        <div className="prv-header-top">
          <h1 className="prv-title">Privacy Notice</h1>
          <div className="prv-date">
            <span className="prv-date-label">Effective date</span>
            <span className="prv-date-value">Jun 17, 2026</span>
          </div>
        </div>
        <div className="prv-rule" />
      </div>

      {/* Body */}
      <div className="prv-layout">

        {/* ── Left sticky TOC ── */}
        <aside className="prv-toc">
          <p className="prv-toc-label">Contents</p>
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
              <strong>C Minds may request your name, company, title, education, past professional experience, email, country of residence, date of birth, age, or sex, all of which are directly obtained from you, for the purpose of:</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>Sending the monthly C Minds newsletter</li>
              <li>Follow-up emails from events hosted by C Minds</li>
              <li>Participation in surveys, polls, programs, or projects led by C Minds</li>
              <li>Share or transfer data with third parties related only to the implementation of surveys, polls, programs, or projects (you would be notified of this data sharing practice when participating in any activity mentioned in point C above)</li>
              <li>Preparation of statistics and reports</li>
            </ol>
            <p className="prv-body">The personal data we request from you will be marked as required or optional depending on the context of your involvement with C Minds.</p>
          </section>

          <section id="sec-ii" className="prv-section">
            <p className="prv-body">
              <strong>Secondary or optional data may be withheld</strong> by abstaining from responding to the respective field. Should you not want your personal data to be processed for certain purposes, you may notify the Head of Operations (<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>) using the format below.
            </p>
            <blockquote className="prv-blockquote">
              <p><em>I do not consent to my personal data being used for the following purposes:</em></p>
              <ul className="prv-list prv-list--bullet">
                <li><em>Secondary purpose A</em></li>
                <li><em>Secondary purpose B</em></li>
                <li><em>Secondary purpose C</em></li>
                <li><em>…</em></li>
              </ul>
            </blockquote>
            <p className="prv-body">The refusal to use your personal data for these purposes may not be a reason for us to deny the services you request or contract with us.</p>
          </section>

          <section id="sec-iii" className="prv-section">
            <p className="prv-body">
              <strong>C Minds handles data in accordance with Mexico's Federal Law on the Protection of Personal Data Held by Individuals.</strong>
            </p>
          </section>

          <section id="sec-iv" className="prv-section">
            <p className="prv-body">
              <strong>C Minds can transfer your personal data to third parties relevant to your involvement at C Minds in the following ways:</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>For individuals involved in a survey, poll, project, or program led by C Minds, your personal data will only be shared among the relevant project partners for the purposes stated by the project.</li>
              <li>If your involvement with C Minds does not reach this capacity, your data will not be shared with third parties.</li>
            </ol>
          </section>

          <section id="sec-v" className="prv-section">
            <p className="prv-body">
              You have the right to know what personal data we have about you, what we use them for and the conditions of use we give them (Access). It is also your right to request the correction of your personal information if it is outdated, inaccurate or incomplete (Rectification); that we remove it from our records or databases when you consider that it is not being used in accordance with the principles, duties and obligations set forth in the regulations (Cancellation); as well as oppose the use of your personal data for specific purposes (Opposition). <strong>These rights are known as ARCO rights.</strong>
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>To exercise any of the ARCO rights, you must submit your request to the Head of Operations (<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>).</li>
            </ol>
          </section>

          <section id="sec-vi" className="prv-section">
            <p className="prv-body">
              <strong>You can revoke the consent that you have granted us for the treatment of your personal data.</strong> However, it is important that you keep in mind that we may not always be able to meet your request or terminate the use immediately, since it is possible that due to some legal obligation we need to continue treating your personal data. We will, however, do what is within our means to meet your request.
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>To revoke your consent you must submit your request to the Head of Operations (<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>).</li>
            </ol>
          </section>

          <section id="sec-vii" className="prv-section">
            <p className="prv-body">
              <strong>You may limit the use or disclosure of your personal data</strong> by opting out of our communication means at the bottom of each email or contacting the Head of Operations (<a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>).
            </p>
          </section>

          <section id="sec-viii" className="prv-section">
            <p className="prv-body">
              <strong>C Minds does not use cookies, web beacons, or other similar technologies to monitor your internet use.</strong>
            </p>
          </section>

          <section id="sec-ix" className="prv-section">
            <p className="prv-body">
              <strong>This privacy notice may undergo modifications, changes or updates</strong> derived from new legal requirements; our own needs for the products or services we offer; our privacy practices; changes in our business model, or other causes.
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>Such changes will be posted on our website: <a className="prv-link" href="https://www.cminds.co" target="_blank" rel="noopener noreferrer">www.cminds.co</a></li>
              <li>This webpage will always contain the most updated version of our privacy notice.</li>
            </ol>
          </section>

        </main>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
