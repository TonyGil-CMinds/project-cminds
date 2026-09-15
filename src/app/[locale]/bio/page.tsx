"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LINKS = [
  { label: "NaturaTech LAC Initiative", url: "https://naturatech.org" },
  { label: "Vital Oceans Initiative",   url: "https://oceanosvitales.org" },
  { label: "Tech4Nature Initiative",    url: "https://youtu.be/4cKLMpL_des?si=UaqwBqQWkqbFSdLb" },
  { label: "AI4Manatees",              url: "https://youtu.be/_O1yxttZ2m8?si=m8G08n1JI4oCYn4G" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/c-minds/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/cminds_co/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.1 4.8h7.8c1.8 0 3.3 1.5 3.3 3.3v7.8c0 1.8-1.5 3.3-3.3 3.3H8.1c-1.8 0-3.3-1.5-3.3-3.3V8.1c0-1.8 1.5-3.3 3.3-3.3Zm0 1.6c-.9 0-1.7.8-1.7 1.7v7.8c0 .9.8 1.7 1.7 1.7h7.8c.9 0 1.7-.8 1.7-1.7V8.1c0-.9-.8-1.7-1.7-1.7H8.1Zm3.9 2.3a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4-2.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/CMindsImpact/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.4 20v-7.3h2.4l.4-2.8h-2.8V8.1c0-.8.2-1.4 1.4-1.4h1.5V4.2C16 4.1 15.1 4 14 4c-2.2 0-3.7 1.3-3.7 3.8v2.1H7.8v2.8h2.5V20h3.1Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/cmindsco",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 8.2c-.2-.9-.9-1.5-1.7-1.7C17.2 6.1 12 6.1 12 6.1s-5.2 0-6.7.4c-.8.2-1.5.9-1.7 1.7-.4 1.5-.4 3.8-.4 3.8s0 2.4.4 3.8c.2.9.9 1.5 1.7 1.7 1.5.4 6.7.4 6.7.4s5.2 0 6.7-.4c.8-.2 1.5-.9 1.7-1.7.4-1.5.4-3.8.4-3.8s0-2.4-.4-3.8ZM10.2 14.5v-5l4.5 2.5-4.5 2.5Z" />
      </svg>
    ),
  },
];

export default function BioPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide the global mobile nav header on this page
  useEffect(() => {
    document.body.classList.add("bio-page-active");
    return () => document.body.classList.remove("bio-page-active");
  }, []);

  useGSAP(() => {
    gsap.fromTo(".bio-orbit-wrap",
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }
    );
    gsap.fromTo(".bio-title",
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, delay: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(".bio-visit-btn",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55, delay: 0.55, ease: "power2.out" }
    );
    gsap.fromTo(".bio-link-card",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, delay: 0.7, ease: "power2.out" }
    );
    gsap.fromTo(".bio-footer",
      { opacity: 0 },
      { opacity: 1, duration: 0.7, delay: 1.2, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bio-page">

      {/* Orbit arc header */}
      <div className="bio-orbit-wrap">
        <img
          src="/orbitElement.svg"
          className="bio-orbit-svg"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        <img
          src="/hexagone-logo.svg"
          className="bio-logo"
          alt="C Minds"
          draggable={false}
        />
      </div>

      {/* Main content */}
      <div className="bio-content">
        <h1 className="bio-title">C Minds | A new era</h1>

        <a
          href="https://www.cminds.co"
          target="_blank"
          rel="noopener noreferrer"
          className="bio-visit-btn"
        >
          Visit our website
        </a>

        <div className="bio-links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bio-link-card"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Pinned footer */}
      <footer className="bio-footer">
        <div className="bio-socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bio-social-btn"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <p className="bio-copyright">© 2025 C Minds All rights reserved.</p>
      </footer>
    </div>
  );
}
