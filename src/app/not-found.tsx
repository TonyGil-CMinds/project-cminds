"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

const DIGITS = [4, 0, 4];
const VALID_COLORS = ["#5EC1F3", "#512AE5", "#876FE8"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function NotFound() {
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
    if (match) {
      const hex = decodeURIComponent(match[1]);
      if (VALID_COLORS.includes(hex)) {
        document.documentElement.style.setProperty("--color-primary", hex);
        document.documentElement.style.setProperty("--color-primary-rgb", hexToRgb(hex));
      }
    }

    const clips = document.querySelectorAll<HTMLDivElement>(".nf-digit-clip");
    const strips = document.querySelectorAll<HTMLDivElement>(".nf-digit-strip");

    const tl = gsap.timeline({ delay: 0.25 });

    strips.forEach((strip, i) => {
      const clipH = clips[i].offsetHeight;
      gsap.set(strip, { y: 0 });
      tl.to(
        strip,
        { y: -DIGITS[i] * clipH, duration: 1.1 + i * 0.1, ease: "power4.out" },
        i * 0.07
      );
    });

    tl.fromTo(
      ".nf-card",
      { opacity: 0, scale: 0.94, y: 20, filter: "blur(8px)" },
      { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "back.out(1.5)" },
      0.35
    );
  }, []);

  return (
    <div className="nf-page">
      {/* ── Hero section ── */}
      <main className="nf-root">
        <div className="nf-glow-left" />

        <nav className="main-nav">
          <div className="nav-brand">
            <img src="/logo.svg" alt="C Minds" />
          </div>
          <div className="nav-menu">
            {["Home", "Core", "Mindscope ®", "Careers"].map((item, i) => (
              <div key={item} className={`nav-item${i === 0 ? " active" : ""}`}>
                {item}
              </div>
            ))}
          </div>
        </nav>

        {/* Odometer 404 */}
        <div className="nf-bg-number" aria-hidden="true">
          {DIGITS.map((_, i) => (
            <div key={i} className="nf-digit-clip">
              <div className="nf-digit-strip">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <div key={d} className="nf-digit">{d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Glass card */}
        <div className="nf-card">
          <h1 className="nf-card-title">Oops, page not found</h1>
          <p className="nf-card-desc">
            The page you are looking for does not exist or it was a typo mistake.
            Are you sure it was the right one?
          </p>
          <div className="nf-divider">
            <span className="nf-divider-line" />
            <span className="nf-divider-or">or</span>
            <span className="nf-divider-line" />
          </div>
          <Link href="/" className="hero-button nf-home-btn">
            Back to home page
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-cta">
          <h2>Bold &amp; Meaningful<br />Changes</h2>
          <button className="footer-cta-btn">Contact us</button>
        </div>

        <div className="footer-main">
          <div className="footer-brand-block">
            <img src="/logo.svg" alt="C Minds" className="footer-logo" />
            <p className="footer-copy desktop-copy">© 2025 C Minds All rights reserved.</p>
          </div>

          <div className="footer-column footer-site-map">
            <h3>SITE MAP</h3>
            <a href="#core">Core</a>
            <a href="#mindscope">Mindscope</a>
            <a href="#careers">Careers</a>
          </div>

          <div className="footer-column footer-resources">
            <h3>RESOURCES</h3>
            <a href="#terms">Terms &amp; conditions</a>
            <a href="#privacy">Privacy policy</a>
            <a href="#ethics">Code of ethics</a>
          </div>

          <div className="footer-join">
            <h3>JOIN US</h3>
            <form className="footer-form">
              <label className="sr-only" htmlFor="nf-footer-email">Email</label>
              <input id="nf-footer-email" type="email" placeholder="I name@email.com" />
              <button type="submit">Suscribe</button>
            </form>

            <div className="footer-socials" aria-label="Social links">
              <a href="#linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" /></svg>
              </a>
              <a href="#instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.1 4.8h7.8c1.8 0 3.3 1.5 3.3 3.3v7.8c0 1.8-1.5 3.3-3.3 3.3H8.1c-1.8 0-3.3-1.5-3.3-3.3V8.1c0-1.8 1.5-3.3 3.3-3.3Zm0 1.6c-.9 0-1.7.8-1.7 1.7v7.8c0 .9.8 1.7 1.7 1.7h7.8c.9 0 1.7-.8 1.7-1.7V8.1c0-.9-.8-1.7-1.7-1.7H8.1Zm3.9 2.3a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4-2.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" /></svg>
              </a>
              <a href="#x" aria-label="X">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5.4 5 6.7-5.3 6.5h1.8l4.3-5.2 3.9 5.2h4.1l-5.3-7.1 5-6.1h-1.8l-4 4.8-3.6-4.8H6.4Zm2.6 1.3h.9l7.7 10.6h-.9L9 6.7Z" /></svg>
              </a>
              <a href="#facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 20v-7.3h2.4l.4-2.8h-2.8V8.1c0-.8.2-1.4 1.4-1.4h1.5V4.2C16 4.1 15.1 4 14 4c-2.2 0-3.7 1.3-3.7 3.8v2.1H7.8v2.8h2.5V20h3.1Z" /></svg>
              </a>
              <a href="#youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 8.2c-.2-.9-.9-1.5-1.7-1.7C17.2 6.1 12 6.1 12 6.1s-5.2 0-6.7.4c-.8.2-1.5.9-1.7 1.7-.4 1.5-.4 3.8-.4 3.8s0 2.4.4 3.8c.2.9.9 1.5 1.7 1.7 1.5.4 6.7.4 6.7.4s5.2 0 6.7-.4c.8-.2 1.5-.9 1.7-1.7.4-1.5.4-3.8.4-3.8s0-2.4-.4-3.8ZM10.2 14.5v-5l4.5 2.5-4.5 2.5Z" /></svg>
              </a>
            </div>
          </div>

          <p className="footer-copy mobile-copy">© 2025 C Minds All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
