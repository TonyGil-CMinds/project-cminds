"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL = "info@cminds.co";

const OPTIONS = [
  {
    label: "Gmail",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Z" fill="#fff" fillOpacity=".08"/>
        <path d="M2 7l10 6.5L22 7" stroke="#EA4335" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M2 7v10.5A2.5 2.5 0 0 0 4.5 20H9V12l3 2 3-2v8h4.5A2.5 2.5 0 0 0 22 17.5V7L12 13.5 2 7Z" fill="#EA4335" fillOpacity=".9"/>
      </svg>
    ),
  },
  {
    label: "Outlook",
    href: `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2.5" fill="#fff" fillOpacity=".08"/>
        <path d="M2 8h20M8 4v16" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="2" y="4" width="6" height="9" rx="1" fill="#0078D4" fillOpacity=".9"/>
        <path d="M5 8.5a2 2 0 1 0 0 3 2 2 0 0 0 0-3Z" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: "Default app",
    href: `mailto:${EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" fill="currentColor"/>
      </svg>
    ),
  },
];

interface ContactButtonProps {
  variant?: "nav" | "footer";
}

export default function ContactButton({ variant = "nav" }: ContactButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const btnClass = variant === "footer" ? "footer-cta-btn" : "hero-button nav-contact";
  const popoverClass = `contact-popover contact-popover--${variant === "footer" ? "up" : "down"}`;

  return (
    <div ref={wrapRef} className="contact-btn-wrap">
      <button
        className={btnClass}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Contact us
      </button>

      {open && (
        <div className={popoverClass} role="listbox" aria-label="Choose email client">
          {OPTIONS.map(opt => (
            <a
              key={opt.label}
              href={opt.href}
              target={opt.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="contact-popover-item"
              onClick={() => setOpen(false)}
            >
              <span className="contact-popover-icon">{opt.icon}</span>
              <span>{opt.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
