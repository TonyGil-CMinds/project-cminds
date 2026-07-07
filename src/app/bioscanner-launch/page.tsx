"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const STEPS = [{ id: 0 }, { id: 1 }, { id: 2 }];

const TRANSLATIONS = {
  ES: {
    title: "Pre-registro",
    steps: ["Datos personales", "Equipo de Computo", "Experiencia en Monitoreo"],
    hint: "Completa todos los campos. Verifica tu información antes de enviar.",
    labelName: "Nombre", labelLast: "Apellido", labelEmail: "Correo electrónico",
    labelOrg: "Organización", labelCountry: "País",
    phName: "Américo González", phLast: "Guerrero, Gómez...",
    phEmail: "correo@ejemplo.com", phOrg: "UNAM, WWF...", phCountry: "México, Colombia...",
    laptop: "¿Cuentas con equipo de cómputo portátil (Laptop)?",
    monitoring: "¿Trabajas con monitoreo?",
    yes: "Sí", no: "No",
    continueBtn: "Continuar", finishBtn: "Finalizar registro",
    backBtn: "Regresar", sendingBtn: "Enviando...",
    sendingTitle: "Enviando información...",
    sendingSub: "Esto puede tomar unos segundos",
    successTitle: "Hemos recibido tu\ninformación con éxito.",
    successBody: "Recibirás un correo electrónico los próximos días con más información sobre el taller de prueba de la BETA de Bioscanner.",
    updateData: "Actualizar datos", cancelReg: "Cancelar registro",
    knowMore: "Conoce más",
    toastExists: "Ya te encuentras en la lista",
    toastFull: "Cupo lleno",
    toastError: "Error de conexión, intenta de nuevo",
  },
  EN: {
    title: "Pre-registration",
    steps: ["Personal info", "Computer equipment", "Monitoring experience"],
    hint: "Complete all fields. Verify your information before submitting.",
    labelName: "Name", labelLast: "Lastname", labelEmail: "Email",
    labelOrg: "Organization", labelCountry: "Country",
    phName: "Américo González", phLast: "Smith, Johnson...",
    phEmail: "like@email.com", phOrg: "Harvard, WWF...", phCountry: "Mexico, Colombia...",
    laptop: "Do you have a portable computer (Laptop)?",
    monitoring: "Do you work with biodiversity monitoring?",
    yes: "Yes", no: "No",
    continueBtn: "Continue", finishBtn: "Finish registration",
    backBtn: "Go back", sendingBtn: "Sending...",
    sendingTitle: "Sending information...",
    sendingSub: "This may take a few seconds",
    successTitle: "We received your\ninformation successfully.",
    successBody: "You will receive an email in the coming days with more information about the BioScanner BETA testing workshop.",
    updateData: "Update data", cancelReg: "Cancel registration",
    knowMore: "Learn more",
    toastExists: "You are already on the list",
    toastFull: "Registration is full",
    toastError: "Connection error, please try again",
  },
} as const;

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidName  = (v: string) => v.trim().length >= 2;

function setCookie(key: string, value: string, days = 60) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(key: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split(";").map(c => c.trim().split("="));
  const found = match.find(([k]) => k === key);
  return found ? decodeURIComponent(found[1] ?? "") : "";
}

function deleteCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium",
  "Bolivia","Bosnia and Herzegovina","Brazil","Canada","Chile","China","Colombia","Costa Rica",
  "Croatia","Cuba","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador",
  "Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Haiti","Honduras",
  "Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kenya","Madagascar","Malaysia","Mexico","Morocco","Mozambique","Myanmar","Nepal",
  "Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Panama","Paraguay",
  "Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Senegal",
  "Serbia","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Tanzania",
  "Thailand","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine","United Kingdom",
  "United States","Uruguay","Venezuela","Vietnam","Yemen","Zimbabwe",
];

export default function BioscannerLaunchPage() {
  const pageRef       = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const bar1Ref       = useRef<HTMLDivElement>(null);
  const bar2Ref       = useRef<HTMLDivElement>(null);
  const bar3Ref       = useRef<HTMLDivElement>(null);
  const anim1Ref      = useRef<HTMLImageElement>(null);
  const anim2Ref      = useRef<HTMLImageElement>(null);
  const anim3Ref      = useRef<HTMLImageElement>(null);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const t = TRANSLATIONS[lang];
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const [avatarSrc] = useState(() =>
    typeof window !== "undefined" && Math.random() > 0.5
      ? "/bioscanner/success-avatar-woman.png"
      : "/bioscanner/success-avatar-men.png"
  );

  // Step 1 fields + touched state
  const [name,         setName]         = useState("");
  const [lastname,     setLastname]     = useState("");
  const [email,        setEmail]        = useState("");
  const [org,            setOrg]            = useState("");
  const [country,        setCountry]        = useState("");
  const [countryQuery,   setCountryQuery]   = useState("");
  const [countryOpen,    setCountryOpen]    = useState(false);
  const [nameTouched,    setNameTouched]    = useState(false);
  const [lastTouched,    setLastTouched]    = useState(false);
  const [emailTouched,   setEmailTouched]   = useState(false);
  const [orgTouched,     setOrgTouched]     = useState(false);
  const [countryTouched, setCountryTouched] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const nameOk    = isValidName(name);
  const lastOk    = isValidName(lastname);
  const emailOk   = isValidEmail(email);
  const orgOk     = isValidName(org);
  const countryOk = countryQuery.trim().length >= 2;

  const nameError    = nameTouched    && !nameOk;
  const lastError    = lastTouched    && !lastOk;
  const emailError   = emailTouched   && !emailOk;
  const orgError     = orgTouched     && !orgOk;
  const countryError = countryTouched && !countryOk;

  const countrySuggestions = countryQuery.length >= 1
    ? COUNTRIES.filter(c => c.toLowerCase().startsWith(countryQuery.toLowerCase())).slice(0, 6)
    : [];

  const selectCountry = (c: string) => {
    setCountry(c);
    setCountryQuery(c);
    setCountryOpen(false);
    setCountryTouched(true);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        if (!countryOk) setCountryTouched(true);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [countryOk]);

  // ── Step 2 state ──
  const [laptop, setLaptop] = useState<"si" | "no" | null>(null);
  const [laptopTouched, setLaptopTouched] = useState(false);
  const isStep2Valid = laptop !== null;

  // ── Step 3 state ──
  const [monitoring, setMonitoring] = useState<"si" | "no" | null>(null);
  const [monitoringTouched, setMonitoringTouched] = useState(false);
  const isStep3Valid = monitoring !== null;

  // Animate progress bars
  const validCount = [nameOk, lastOk, emailOk, orgOk, countryOk].filter(Boolean).length;
  const isStep1Valid = validCount === 5;

  useEffect(() => {
    const fill = bar1Ref.current;
    if (!fill) return;
    const pct = Math.round((validCount / 5) * 100);
    gsap.to(fill, { width: `${pct}%`, duration: 0.4, ease: "power2.out" });
  }, [validCount]);

  useEffect(() => {
    const fill = bar2Ref.current;
    if (!fill) return;
    gsap.to(fill, { width: laptop !== null ? "100%" : "0%", duration: 0.4, ease: "power2.out" });
  }, [laptop]);

  useEffect(() => {
    const fill = bar3Ref.current;
    if (!fill) return;
    gsap.to(fill, { width: monitoring !== null ? "100%" : "0%", duration: 0.4, ease: "power2.out" });
  }, [monitoring]);

  // Loop animation for submit screen — auto-advances to success after 4s
  useEffect(() => {
    if (step !== 3) return;
    const c1 = anim1Ref.current;
    const c2 = anim2Ref.current;
    const c3 = anim3Ref.current;
    if (!c1 || !c2 || !c3) return;

    gsap.set([c1, c2, c3], { y: 90, opacity: 0 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
    tl.to(c1, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" })
      .to(c2, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, "+=0.12")
      .to(c3, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, "+=0.12")
      .to({}, { duration: 1.2 })
      .to(c3, { y: 90, opacity: 0, duration: 0.35, ease: "power2.in" })
      .to(c2, { y: 90, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.1")
      .to(c1, { y: 90, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.1");

    // Auto-advance to success after 4s
    const timer = setTimeout(() => {
      tl.kill();
      const el = contentRef.current;
      if (!el) { setStep(4); return; }
      gsap.to(el, {
        opacity: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => {
          setStep(4);
          gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
        },
      });
    }, 4000);

    return () => { tl.kill(); clearTimeout(timer); };
  }, [step]);

  const handleContinue = async () => {
    if (step === 0) {
      if (!isStep1Valid) {
        setNameTouched(true); setLastTouched(true); setEmailTouched(true);
        setOrgTouched(true); setCountryTouched(true);
        return;
      }
      animateNext(1);
    } else if (step === 1) {
      if (!isStep2Valid) { setLaptopTouched(true); return; }
      animateNext(2);
    } else if (step === 2) {
      if (!isStep3Valid) { setMonitoringTouched(true); return; }
      setSubmitting(true);
      try {
        const res = await fetch("/api/bioscanner-launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, lastname, email,
            organization: org, country,
            have_computer: laptop === "si",
          }),
        });
        const data = await res.json();

        if (data.error === "full") {
          showToast(t.toastFull);
          return;
        }
        if (data.error === "exists") {
          showToast(t.toastExists);
          setCookie("bsl_name", name);
          setCookie("bsl_email", email);
          setTimeout(() => setStep(4), 1200);
          return;
        }
        // success — go to loading screen → auto-advances to step 4
        setCookie("bsl_name", name);
        setCookie("bsl_email", email);
        animateNext(3);
      } catch {
        showToast(t.toastError);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    deleteCookie("bsl_name");
    deleteCookie("bsl_email");
    setStep(0);
    setName(""); setLastname(""); setEmail(""); setOrg(""); setCountryQuery(""); setCountry("");
    setLaptop(null); setMonitoring(null);
    setNameTouched(false); setLastTouched(false); setEmailTouched(false);
    setOrgTouched(false); setCountryTouched(false); setLaptopTouched(false); setMonitoringTouched(false);
  };

  const handleBack = () => {
    const el = contentRef.current;
    if (!el) { setStep(s => s - 1); return; }
    gsap.to(el, {
      opacity: 0, x: 32, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        setStep(s => s - 1);
        gsap.fromTo(el, { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" });
      },
    });
  };

  const animateNext = (nextStep: number) => {
    const el = contentRef.current;
    if (!el) { setStep(nextStep); return; }
    gsap.to(el, {
      opacity: 0, x: -32, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo(el, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" });
      },
    });
  };

  // On mount: if registration cookie exists, jump straight to success screen
  useEffect(() => {
    const savedName  = getCookie("bsl_name");
    const savedEmail = getCookie("bsl_email");
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
      setStep(4);
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
  }, { scope: pageRef });

  const NextIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18.53 12.53L14.24 16.82C14.09 16.97 13.9 17.04 13.71 17.04C13.52 17.04 13.33 16.97 13.18 16.82C12.89 16.53 12.89 16.05 13.18 15.76L16.19 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H16.19L13.18 8.24C12.89 7.95 12.89 7.47 13.18 7.18C13.47 6.89 13.95 6.89 14.24 7.18L18.53 11.47C18.67 11.61 18.75 11.8 18.75 12C18.75 12.2 18.67 12.39 18.53 12.53Z" fill="currentColor"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 2l7 7M9 2l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div ref={pageRef} className="bsl-page">

      {/* Toast */}
      {toast && <div className="bsl-toast">{toast}</div>}

      {/* Language toggle — fixed top-right */}
      <button
        className="bsl-lang"
        onClick={() => setLang(l => l === "ES" ? "EN" : "ES")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <ellipse cx="7" cy="7" rx="2.8" ry="6" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 7h12" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        {lang}
      </button>

      {/* ── Sidebar ── */}
      <aside className="bsl-sidebar">
        <img src="/bioscanner/logo-bioscanner.svg" alt="BioScanner" className="bsl-logo" />

        <nav className="bsl-steps">
          {STEPS.map(s => (
            <div key={s.id} className={`bsl-step${step === s.id ? " bsl-step--active" : ""}${step > s.id ? " bsl-step--done" : ""}`}>
              <span className="bsl-step-dot">
                {step > s.id
                  ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : null}
              </span>
              <span className="bsl-step-label">{t.steps[s.id]}</span>
            </div>
          ))}
        </nav>

        <a href="https://bioscanner.io" target="_blank" rel="noopener noreferrer" className="bsl-conocemas">
          <img src="/bioscanner/icon-conocemas.svg" alt="" width="28" height="28" />
          <span>{t.knowMore}</span>
        </a>
      </aside>

      {/* ── Main ── */}
      <main className="bsl-main">

        {step < 3 && <h1 className="bsl-title">{t.title}</h1>}

        {/* Progress bars */}
        {step < 3 && (
          <div className="bsl-progress">
            <div className="bsl-progress-track">
              <div ref={bar1Ref} className="bsl-progress-fill" style={{ width: "0%" }} />
            </div>
            <div className="bsl-progress-track">
              <div ref={bar2Ref} className="bsl-progress-fill" style={{ width: "0%" }} />
            </div>
            <div className="bsl-progress-track">
              <div ref={bar3Ref} className="bsl-progress-fill" style={{ width: "0%" }} />
            </div>
          </div>
        )}

        {/* Form content */}
        <div ref={contentRef} className="bsl-content">
          {step === 0 && (
            <div className="bsl-form">
              <p className="bsl-hint">{t.hint}</p>

              {/* Name */}
              <div className="bsl-field">
                <label className="bsl-label">{t.labelName}</label>
                <div className="bsl-input-wrap">
                  <input
                    className={`bsl-input${nameError ? " bsl-input--error" : ""}`}
                    type="text"
                    placeholder={t.phName}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                  />
                  {nameTouched && name.trim() && (
                    <span className={`bsl-badge${nameOk ? " bsl-badge--ok" : " bsl-badge--err"}`}>
                      {nameOk ? <CheckIcon /> : <XIcon />}
                    </span>
                  )}
                </div>
              </div>

              {/* Lastname */}
              <div className="bsl-field">
                <label className="bsl-label">{t.labelLast}</label>
                <div className="bsl-input-wrap">
                  <input
                    className={`bsl-input${lastError ? " bsl-input--error" : ""}`}
                    type="text"
                    placeholder={t.phLast}
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    onBlur={() => setLastTouched(true)}
                  />
                  {lastTouched && lastname.trim() && (
                    <span className={`bsl-badge${lastOk ? " bsl-badge--ok" : " bsl-badge--err"}`}>
                      {lastOk ? <CheckIcon /> : <XIcon />}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="bsl-field">
                <label className="bsl-label">{t.labelEmail}</label>
                <div className="bsl-input-wrap">
                  <input
                    className={`bsl-input${emailError ? " bsl-input--error" : ""}`}
                    type="email"
                    placeholder={t.phEmail}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                  />
                  {emailTouched && email.trim() && (
                    <span className={`bsl-badge${emailOk ? " bsl-badge--ok" : " bsl-badge--err"}`}>
                      {emailOk ? <CheckIcon /> : <XIcon />}
                    </span>
                  )}
                </div>
              </div>

              {/* Organization */}
              <div className="bsl-field">
                <label className="bsl-label">{t.labelOrg}</label>
                <div className="bsl-input-wrap">
                  <input
                    className={`bsl-input${orgError ? " bsl-input--error" : ""}`}
                    type="text"
                    placeholder={t.phOrg}
                    value={org}
                    onChange={e => setOrg(e.target.value)}
                    onBlur={() => setOrgTouched(true)}
                  />
                  {orgTouched && org.trim() && (
                    <span className={`bsl-badge${orgOk ? " bsl-badge--ok" : " bsl-badge--err"}`}>
                      {orgOk ? <CheckIcon /> : <XIcon />}
                    </span>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="bsl-field" ref={countryRef}>
                <label className="bsl-label">{t.labelCountry}</label>
                <div className="bsl-input-wrap">
                  <input
                    className={`bsl-input${countryError ? " bsl-input--error" : ""}`}
                    type="text"
                    placeholder={t.phCountry}
                    value={countryQuery}
                    autoComplete="off"
                    onChange={e => {
                      setCountryQuery(e.target.value);
                      setCountry("");
                      setCountryOpen(true);
                    }}
                    onFocus={() => setCountryOpen(true)}
                  />
                  {countryTouched && countryQuery.trim() && (
                    <span className={`bsl-badge${countryOk ? " bsl-badge--ok" : " bsl-badge--err"}`}>
                      {countryOk ? <CheckIcon /> : <XIcon />}
                    </span>
                  )}
                </div>
                {countryOpen && countrySuggestions.length > 0 && (
                  <ul className="bsl-suggestions">
                    {countrySuggestions.map(c => (
                      <li
                        key={c}
                        className="bsl-suggestion-item"
                        onMouseDown={() => selectCountry(c)}
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="bsl-form">
              <p className="bsl-hint">{t.hint}</p>

              <div className="bsl-field">
                <label className="bsl-label">{t.laptop}</label>
                <div className="bsl-yesno">
                  <button
                    className={`bsl-yesno-opt${laptop === "si" ? " bsl-yesno-opt--active" : ""}${laptopTouched && laptop === null ? " bsl-yesno-opt--err" : ""}`}
                    onClick={() => { setLaptop("si"); setLaptopTouched(true); }}
                  >
                    {t.yes}
                  </button>
                  <span className="bsl-yesno-sep">/</span>
                  <button
                    className={`bsl-yesno-opt${laptop === "no" ? " bsl-yesno-opt--active" : ""}${laptopTouched && laptop === null ? " bsl-yesno-opt--err" : ""}`}
                    onClick={() => { setLaptop("no"); setLaptopTouched(true); }}
                  >
                    {t.no}
                  </button>
                </div>
                <div className="bsl-yesno-underline" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bsl-form">
              <p className="bsl-hint">{t.hint}</p>

              <div className="bsl-field">
                <label className="bsl-label">{t.monitoring}</label>
                <div className="bsl-yesno">
                  <button
                    className={`bsl-yesno-opt${monitoring === "si" ? " bsl-yesno-opt--active" : ""}${monitoringTouched && monitoring === null ? " bsl-yesno-opt--err" : ""}`}
                    onClick={() => { setMonitoring("si"); setMonitoringTouched(true); }}
                  >
                    {t.yes}
                  </button>
                  <span className="bsl-yesno-sep">/</span>
                  <button
                    className={`bsl-yesno-opt${monitoring === "no" ? " bsl-yesno-opt--active" : ""}${monitoringTouched && monitoring === null ? " bsl-yesno-opt--err" : ""}`}
                    onClick={() => { setMonitoring("no"); setMonitoringTouched(true); }}
                  >
                    {t.no}
                  </button>
                </div>
                <div className="bsl-yesno-underline" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bsl-success">
              <img src={avatarSrc} className="bsl-success-avatar" alt="" draggable={false} />
              <p className="bsl-success-name">{name}</p>
              <h2 className="bsl-success-title" style={{ whiteSpace: "pre-line" }}>{t.successTitle}</h2>
              <p className="bsl-success-body">{t.successBody}</p>
              <button className="bsl-success-update" onClick={() => setStep(0)}>
                {t.updateData}
              </button>
              <button className="bsl-success-cancel" onClick={handleCancel}>
                {t.cancelReg}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bsl-submit">
              <div className="bsl-submit-stack">
                {/* Folder back — lowest layer */}
                <img src="/bioscanner/folderBack-animation.svg" className="bsl-folder-back" alt="" draggable={false} />
                {/* Cards emerge from folder — masked by folderFront */}
                <img ref={anim1Ref} src="/bioscanner/image-animation-1.png" className="bsl-anim-card bsl-anim-card--1" alt="" draggable={false} />
                <img ref={anim2Ref} src="/bioscanner/image-animation-2.png" className="bsl-anim-card bsl-anim-card--2" alt="" draggable={false} />
                <img ref={anim3Ref} src="/bioscanner/image-animation-3.png" className="bsl-anim-card bsl-anim-card--3" alt="" draggable={false} />
                {/* Folder front — sits on top of cards, hides their lower portion */}
                <img src="/bioscanner/folderFront-animation.svg" className="bsl-folder-front" alt="" draggable={false} />
              </div>
              <p className="bsl-submit-title">{t.sendingTitle}</p>
              <p className="bsl-submit-sub">{t.sendingSub}</p>
            </div>
          )}
        </div>

        {/* Footer / CTA */}
        {step < 3 && (
          <div className="bsl-footer">
            {step > 0 && (
              <button className="bsl-back" onClick={handleBack}>
                {t.backBtn}
              </button>
            )}
            <button
              className={`bsl-cta${(step === 0 ? isStep1Valid : step === 1 ? isStep2Valid : isStep3Valid) ? " bsl-cta--enabled" : ""}${submitting ? " bsl-cta--loading" : ""}`}
              onClick={handleContinue}
              disabled={submitting}
            >
              {submitting ? t.sendingBtn : step === 2 ? t.finishBtn : t.continueBtn}
              {!submitting && <NextIcon />}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
