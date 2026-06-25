"use client";

import { useRef, useLayoutEffect, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SiteFooter from "../../components/SiteFooter";

const NAV_ITEMS    = ["Home", "Core", "Mindscope ®", "Careers"];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

const SECTIONS = [
  { id: "sec-i",    roman: "I",    title: "Accordance with the Law" },
  { id: "sec-ii",   roman: "II",   title: "Confidentiality & Privacy" },
  { id: "sec-iii",  roman: "III",  title: "Discrimination & Harassment" },
  { id: "sec-iv",   roman: "IV",   title: "Health and Safety" },
  { id: "sec-v",    roman: "V",    title: "Recordkeeping & Integrity" },
  { id: "sec-vi",   roman: "VI",   title: "Professional Behavior" },
  { id: "sec-vii",  roman: "VII",  title: "Fiduciary Duty" },
  { id: "sec-viii", roman: "VIII", title: "C Minds Activities" },
  { id: "sec-ix",   roman: "IX",   title: "Environment" },
  { id: "sec-x",    roman: "X",    title: "Questions & Violations" },
  { id: "sec-xi",   roman: "XI",   title: "Periodic Certification" },
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function EthicsPage() {
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

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.fromTo(".prv-title",   { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0)", duration: 0.75, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(".prv-date",    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.4 });
    gsap.fromTo(".prv-rule",    { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7, ease: "power3.out", delay: 0.55 });
    gsap.fromTo(".prv-toc",     { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.7 });
    gsap.fromTo(".prv-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05, delay: 0.75 });
  }, []);

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
                if (item === "Home")         navigateWithTransition("/");
                if (item === "Core")         navigateWithTransition("/core");
                if (item === "Mindscope ®")  navigateWithTransition("/mindscope");
                if (item === "Careers")      navigateWithTransition("/careers");
              }}
            >{item}</div>
          ))}
        </div>
        <a href="mailto:info@cminds.co" className="hero-button nav-contact">Contact us</a>
      </nav>

      {/* Page header */}
      <div ref={headerRef} className="prv-header">
        <div className="prv-header-top">
          <h1 className="prv-title">Code of Ethics</h1>
          <div className="prv-date">
            <span className="prv-date-label">Last updated</span>
            <span className="prv-date-value">Jun 24, 2026</span>
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
              <strong>Employees, partners, and Board members are expected to comply with all applicable legal requirements</strong> and understand the major laws and regulations that apply to their work. If you have any questions about the laws that govern our work, please consult our Office Manager.
            </p>
          </section>

          <section id="sec-ii" className="prv-section">
            <p className="prv-body">
              <strong>Plans, projects, and any other information expressed in confidence will not be shared</strong> with anyone outside the relevant parties unless explicitly stated.
            </p>
          </section>

          <section id="sec-iii" className="prv-section">
            <p className="prv-body">
              <strong>C Minds will not tolerate any kind of discrimination or harassment</strong> among its employees, its partners, or towards the general public.
            </p>
            <p className="prv-body">
              During your time at C Minds, any comments, actions, or views that we are made aware of will be subject to scrutiny, and appropriate steps will be taken as a consequence of any behavior deemed inappropriate. C Minds will not tolerate any form of discrimination or harassment by collaborators.
            </p>
          </section>

          <section id="sec-iv" className="prv-section">
            <p className="prv-body">
              <strong>C Minds is committed to providing a clean, safe, and healthy work environment.</strong> Each employee has a responsibility for maintaining a safe and healthy workplace by following safety and health rules and practices and reporting accidents, injuries and unsafe conditions, procedures, or behaviors.
            </p>
            <p className="prv-body">
              Violence and threatening behaviors are not permitted and any suspicion of such comportment will result in disciplinary measures.
            </p>
            <p className="prv-body">
              Employees must report to work in a condition to perform their duties, free from the influence of recreational drugs or alcohol.
            </p>
          </section>

          <section id="sec-v" className="prv-section">
            <p className="prv-body">
              <strong>C Minds' accounts, records, and financial statements must be maintained in appropriate detail,</strong> must properly reflect the organization's transactions and must conform to both applicable law and to the organization's system of internal controls.
            </p>
          </section>

          <section id="sec-vi" className="prv-section">
            <p className="prv-body">
              <strong>C Minds strictly forbids offering, providing, or accepting,</strong> either directly by employees or indirectly through third-parties:
            </p>
            <ol className="prv-list prv-list--alpha">
              <li>Bribes in both government and commercial business;</li>
              <li>Facilitating payments to secure or expedite a routine government action by a government official.</li>
            </ol>
            <p className="prv-body">
              C Minds expects all parties involved to behave in a respectful and professional manner, upholding the C Minds values and positively representing the organization in both appearance and conduct.
            </p>
          </section>

          <section id="sec-vii" className="prv-section">
            <p className="prv-body">
              <strong>C Minds stakeholders will always act in the best interest of the community</strong> that we are collaborating with and contributing to at the time.
            </p>
          </section>

          <section id="sec-viii" className="prv-section">
            <p className="prv-body">
              <strong>C Minds seeks to contribute to an inclusive Fourth Industrial Revolution and improved living conditions of communities,</strong> therefore we only accept projects, articles, events, and other engagements that reflect this belief and fit into our strategy to achieve this objective.
            </p>
          </section>

          <section id="sec-ix" className="prv-section">
            <p className="prv-body">
              <strong>C Minds stakeholders will take reasonable actions to minimize their carbon footprint</strong> by not relying on paper, recycling when possible, and making smart environmental choices in all areas related to C Minds work and operations.
            </p>
          </section>

          <section id="sec-x" className="prv-section">
            <p className="prv-body">
              Employees should speak with the Head of Operations when they have a question about the application of the Code of Conduct or when in doubt about how to properly act in a particular situation.
            </p>
            <p className="prv-body">
              <strong>C Minds will not allow retaliation against an employee or relevant actor for reporting actual or suspected misconduct</strong> by others in good faith. Any reports may be anonymous, however, we encourage adding your names so that we may contact you if any further action is needed. Reports can be made to the Head of Operations, the CEO, and the Board if necessary.
            </p>
          </section>

          <section id="sec-xi" className="prv-section">
            <p className="prv-body">
              <strong>C Minds leadership will conduct a periodical revision of anti-corruption risk assessment</strong> to identify, assess, and prioritize key compliance risk mitigation or remediation needs.
            </p>
            <p className="prv-body">
              The C Minds Head of Operations will act as Compliance Officer. To report any concerns, you may contact this person at <a className="prv-link" href="mailto:regina@cminds.co">regina@cminds.co</a>. You may also reach out to the CEO, Constanza Gómez Mont, at <a className="prv-link" href="mailto:constanzagm@cminds.co">constanzagm@cminds.co</a> at any time.
            </p>
          </section>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
