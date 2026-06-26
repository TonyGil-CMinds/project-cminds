"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export type CloseResult = "success" | "already_subscribed" | false;

interface SubscribeModalProps {
  onClose: (result: CloseResult) => void;
}

export default function SubscribeModal({ onClose }: SubscribeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef   = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const [form, setForm] = useState({
    gender: "",
    name: "",
    lastname: "",
    email: "",
    organization: "",
    country: "",
    data_agreement: false,
    policy_agreement: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(sheetRef.current,   { y: "100%" },  { y: 0, duration: 0.85, ease: "elastic.out(1, 0.72)" });
  }, []);

  const animateClose = (result: CloseResult) => {
    if (closingRef.current) return;
    closingRef.current = true;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(sheetRef.current, {
      y: "100%",
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => onClose(result),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.data_agreement || !form.policy_agreement) {
      setError("Please accept both agreements to continue.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 409) {
        animateClose("already_subscribed");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      document.cookie = "cminds_subscribed=1; path=/; max-age=31536000; SameSite=Lax";
      animateClose("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div ref={overlayRef} className="sub-overlay" onClick={() => animateClose(false)}>
      <div ref={sheetRef} className="sub-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sub-close" onClick={() => animateClose(false)} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="sub-header">
          <h2 className="sub-title">Stay in the Loop</h2>
          <p className="sub-subtitle">Get updates on our latest research and initiatives.</p>
        </div>

        <form className="sub-form" onSubmit={handleSubmit} noValidate>
          <div className="sub-field">
            <div className="sub-select-wrap">
              <select
                className="sub-input sub-select"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">Form of address</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="sub-row">
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder="Name" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder="Last name" value={form.lastname}
                onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))} required />
            </div>
          </div>

          <div className="sub-field">
            <input className="sub-input" type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>

          <div className="sub-row">
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder="Organization" value={form.organization}
                onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} />
            </div>
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder="Country" value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
            </div>
          </div>

          <div className="sub-checks">
            <label className="sub-check-label">
              <input type="checkbox" className="sub-checkbox" checked={form.data_agreement}
                onChange={(e) => setForm((f) => ({ ...f, data_agreement: e.target.checked }))} />
              <span>I accept the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Notice</a></span>
            </label>
            <label className="sub-check-label">
              <input type="checkbox" className="sub-checkbox" checked={form.policy_agreement}
                onChange={(e) => setForm((f) => ({ ...f, policy_agreement: e.target.checked }))} />
              <span>I accept the <a href="/ethics" target="_blank" rel="noopener noreferrer">Code of Ethics</a></span>
            </label>
          </div>

          {error && <p className="sub-error">{error}</p>}

          <button type="submit" className="sub-submit" disabled={submitting}>
            {submitting ? "Sending…" : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}
