"use client";

import { startTransition, useId } from "react";
import { useRouter, usePathname } from "next/navigation";

const SITE_MAP = [
  { label: "Home",      path: "/" },
  { label: "Core",      path: "/core" },
  { label: "Mindscope", path: "/mindscope" },
  { label: "Careers",   path: "/careers" },
];

export default function SiteFooter() {
  const router   = useRouter();
  const pathname = usePathname();
  const emailId  = useId();

  const navigate = (path: string) => {
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        startTransition(() => router.push(path));
      });
    } else {
      startTransition(() => router.push(path));
    }
  };

  const siteMapLinks = SITE_MAP.filter((item) => item.path !== pathname);

  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <h2>Bold &amp; Meaningful<br />Transformations</h2>
        <button className="footer-cta-btn">Contact us</button>
      </div>

      <div className="footer-main">
        <div className="footer-brand-block">
          <img src="/logo.svg" alt="C Minds" className="footer-logo" />
          <p className="footer-copy desktop-copy">© 2025 C Minds All rights reserved.</p>
        </div>

        <div className="footer-column footer-site-map">
          <h3>SITE MAP</h3>
          {siteMapLinks.map((item) => (
            <a key={item.path} style={{ cursor: "pointer" }} onClick={() => navigate(item.path)}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="footer-column footer-resources">
          <h3>RESOURCES</h3>
          <a href="#terms">MediaKit</a>
          <a style={{ cursor: "pointer" }} onClick={() => navigate("/privacy")}>Privacy policy</a>
          <a style={{ cursor: "pointer" }} onClick={() => navigate("/ethics")}>Code of ethics</a>
        </div>

        <div className="footer-join">
          <h3>JOIN US</h3>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor={emailId}>Email</label>
            <input id={emailId} type="email" placeholder="I name@email.com" />
            <button type="submit">Suscribe</button>
          </form>

          <div className="footer-socials" aria-label="Social links">
            <a href="#linkedin" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" /></svg>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.1 4.8h7.8c1.8 0 3.3 1.5 3.3 3.3v7.8c0 1.8-1.5 3.3-3.3 3.3H8.1c-1.8 0-3.3-1.5-3.3-3.3V8.1c0-1.8 1.5-3.3 3.3-3.3Zm0 1.6c-.9 0-1.7.8-1.7 1.7v7.8c0 .9.8 1.7 1.7 1.7h7.8c.9 0 1.7-.8 1.7-1.7V8.1c0-.9-.8-1.7-1.7-1.7H8.1Zm3.9 2.3a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4-2.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" /></svg>
            </a>
            <a href="#x" aria-label="X / Twitter">
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
  );
}
