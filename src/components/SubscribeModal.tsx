"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { common } from "@/i18n/common";
import { useLocale, useLocalePath } from "@/i18n/useLocale";

export type CloseResult = "success" | "already_subscribed" | false;

interface SubscribeModalProps {
  onClose: (result: CloseResult) => void;
}

export default function SubscribeModal({ onClose }: SubscribeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef   = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const locale = useLocale();
  const lp = useLocalePath();
  const t = common[locale].subscribeForm;

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
      setError(t.errorAgreements);
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
        throw new Error(data.error || t.errorSubmission);
      }

      document.cookie = "cminds_subscribed=1; path=/; max-age=31536000; SameSite=Lax";
      animateClose("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
      setSubmitting(false);
    }
  };

  return (
    <div ref={overlayRef} className="sub-overlay" onClick={() => animateClose(false)}>
      <div ref={sheetRef} className="sub-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sub-close" onClick={() => animateClose(false)} aria-label={t.closeAria}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="sub-header">
          <h2 className="sub-title">{t.title}</h2>
          <p className="sub-subtitle">{t.subtitle}</p>
        </div>

        <form className="sub-form" onSubmit={handleSubmit} noValidate>
          <div className="sub-field">
            <div className="sub-select-wrap">
              <select
                className="sub-input sub-select"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">{t.formOfAddress}</option>
                <option value="Mr.">{t.mr}</option>
                <option value="Ms.">{t.ms}</option>
                <option value="Prefer not to say">{t.preferNotToSay}</option>
                <option value="Other">{t.other}</option>
              </select>
            </div>
          </div>

          <div className="sub-row">
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder={t.name} value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder={t.lastName} value={form.lastname}
                onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))} required />
            </div>
          </div>

          <div className="sub-field">
            <input className="sub-input" type="email" placeholder={t.email} value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>

          <div className="sub-row">
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder={t.organization} value={form.organization}
                onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} />
            </div>
            <div className="sub-field">
              <input className="sub-input" type="text" placeholder={t.country} value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
            </div>
          </div>

          <div className="sub-checks">
            <label className="sub-check-label">
              <input type="checkbox" className="sub-checkbox" checked={form.data_agreement}
                onChange={(e) => setForm((f) => ({ ...f, data_agreement: e.target.checked }))} />
              <span>{t.privacyAgreementPre} <a href={lp("/privacy")} target="_blank" rel="noopener noreferrer">{t.privacyAgreementLink}</a> {t.privacyAgreementPost}</span>
            </label>
            <label className="sub-check-label">
              <input type="checkbox" className="sub-checkbox" checked={form.policy_agreement}
                onChange={(e) => setForm((f) => ({ ...f, policy_agreement: e.target.checked }))} />
              <span>{t.ethicsAgreementPre} <a href={lp("/ethics")} target="_blank" rel="noopener noreferrer">{t.ethicsAgreementLink}</a>{t.ethicsAgreementPost}</span>
            </label>
          </div>

          {error && <p className="sub-error">{error}</p>}

          <button type="submit" className="sub-submit" disabled={submitting}>
            {submitting ? t.sending : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
