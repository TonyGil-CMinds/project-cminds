"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import SiteFooter from "../components/SiteFooter";

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
      <SiteFooter />
    </div>
  );
}
