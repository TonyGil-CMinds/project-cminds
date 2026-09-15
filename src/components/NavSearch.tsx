"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { createPortal } from "react-dom";
import { common } from "@/i18n/common";
import { useLocale, useLocalePath } from "@/i18n/useLocale";

interface SearchItem {
  label:   string;
  icon:    string;
  href?:   string;
  action?: string;
}
interface SearchSection {
  id:    string;
  label: string;
  items: SearchItem[];
}

export default function NavSearch() {
  const locale = useLocale();
  const lp = useLocalePath();
  const t = common[locale];

  /* ─── Static sections (always visible when no query) ── */
  const STATIC_SECTIONS: SearchSection[] = [
    {
      id: "pages", label: t.search.sections.pages,
      items: [
        { label: t.search.items.home,      icon: "/assets/ui/search-page-icon.svg", href: lp("/") },
        { label: t.search.items.core,      icon: "/assets/ui/search-page-icon.svg", href: lp("/core") },
        { label: t.search.items.mindscope, icon: "/assets/ui/search-page-icon.svg", href: lp("/mindscope") },
        { label: t.search.items.careers,   icon: "/assets/ui/search-page-icon.svg", href: lp("/careers") },
      ],
    },
    {
      id: "getstarted", label: t.search.sections.getstarted,
      items: [
        { label: t.search.items.privacy, icon: "/assets/ui/search-getstarted-icon.svg", href: lp("/privacy") },
        { label: t.search.items.ethics, icon: "/assets/ui/search-getstarted-icon.svg", href: lp("/ethics") },
      ],
    },
    {
      id: "actions", label: t.search.sections.actions,
      items: [
        { label: t.search.items.contact,   icon: "/assets/ui/search-actions-contact-icon.svg", href: "mailto:contact@cminds.co" },
        { label: t.search.items.refresh, icon: "/assets/ui/search-actions-icon.svg",         action: "refresh" },
      ],
    },
    {
      id: "jobs", label: t.search.sections.jobs,
      items: [
        { label: t.search.items.projectManagerJob, icon: "/assets/ui/search-jobopportunity-icon.svg", href: lp("/careers") },
      ],
    },
  ];
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [mounted, setMounted] = useState(false);

  /* fetched data */
  const [reports,  setReports]  = useState<SearchItem[]>([]);
  const [posts,    setPosts]    = useState<SearchItem[]>([]);
  const fetchedRef = useRef<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const pillRef     = useRef<HTMLButtonElement>(null);
  const pillRectRef = useRef<DOMRect | null>(null);
  const closingRef  = useRef(false);
  const router      = useRouter();

  useEffect(() => { setMounted(true); }, []);

  /* Fetch reports + publications on first open, and again whenever the locale changes */
  useEffect(() => {
    if (!open || fetchedRef.current === locale) return;
    fetchedRef.current = locale;

    fetch("/api/reports")
      .then(r => r.json())
      .then(data => {
        const raw: Array<{ id: string; title: string }> = Array.isArray(data?.reports) ? data.reports : [];
        setReports(raw.map(r => ({
          label: r.title || t.search.items.untitled,
          icon:  "/assets/ui/search-reports-icon.svg",
          href:  lp(`/reportes/${r.id}`),
        })));
      })
      .catch(() => {});

    fetch("https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed?limit=84")
      .then(r => r.json())
      .then(data => {
        const raw: Array<{ slug: string; title: string; language: string }> =
          Array.isArray(data?.posts) ? data.posts : [];
        setPosts(raw
          .filter(p => p.language === locale)
          .map(p => ({
            label: p.title || t.search.items.untitled,
            icon:  "/assets/ui/search-publications-icon.svg",
            href:  lp(`/mindscope/${p.slug}`),
          })));
      })
      .catch(() => {});
  }, [open, locale]);

  /* Escape to close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && open) closeModal(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openModal = useCallback(() => {
    if (closingRef.current) return;
    pillRectRef.current = pillRef.current?.getBoundingClientRect() ?? null;
    setOpen(true);
  }, []);

  /* External trigger (e.g. Mindscope dock "Search" item) */
  useEffect(() => {
    const h = () => openModal();
    window.addEventListener("cminds:open-search", h);
    return () => window.removeEventListener("cminds:open-search", h);
  }, [openModal]);

  /* Animate in */
  useEffect(() => {
    if (!open || !modalRef.current || !backdropRef.current) return;
    closingRef.current = false;

    gsap.fromTo(backdropRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" }
    );

    requestAnimationFrame(() => {
      if (!modalRef.current) return;
      const pillRect = pillRectRef.current;
      if (pillRect) {
        const modalRect = modalRef.current.getBoundingClientRect();
        const dx = (pillRect.left + pillRect.width  / 2) - (modalRect.left + modalRect.width  / 2);
        const dy = (pillRect.top  + pillRect.height / 2) - (modalRect.top  + modalRect.height / 2);
        gsap.fromTo(modalRef.current,
          { x: dx, y: dy, scaleX: pillRect.width / modalRect.width, scaleY: pillRect.height / modalRect.height, opacity: 0, borderRadius: "10px" },
          { x: 0,  y: 0,  scaleX: 1, scaleY: 1, opacity: 1, borderRadius: "18px", duration: 0.52, ease: "power3.out" }
        );
      } else {
        gsap.fromTo(modalRef.current,
          { y: -28, scale: 0.96, opacity: 0 },
          { y: 0,   scale: 1,    opacity: 1, duration: 0.42, ease: "power3.out" }
        );
      }
      gsap.fromTo(".srch-section",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.05, delay: 0.26, ease: "power2.out" }
      );
      setTimeout(() => inputRef.current?.focus(), 60);
    });
  }, [open]);

  const closeModal = useCallback(() => {
    if (closingRef.current || !modalRef.current || !backdropRef.current) return;
    closingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => { setOpen(false); setQuery(""); closingRef.current = false; },
    });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" });
    tl.to(modalRef.current,    { y: -18, scale: 0.96, opacity: 0, duration: 0.26, ease: "power2.in" }, "<");
  }, []);

  const navigate = (item: SearchItem) => {
    closeModal();
    if (item.action === "refresh") { setTimeout(() => window.location.reload(), 340); return; }
    if (item.href?.startsWith("mailto:")) { setTimeout(() => { window.location.href = item.href!; }, 340); return; }
    if (item.href) setTimeout(() => router.push(item.href!), 320);
  };

  /* Build sections based on query */
  const q = query.trim().toLowerCase();

  const filtered: SearchSection[] = q
    ? [
        /* Static sections filtered by query */
        ...STATIC_SECTIONS
          .map(s => ({ ...s, items: s.items.filter(i => i.label.toLowerCase().includes(q)) }))
          .filter(s => s.items.length > 0),
        /* Dynamic: reports matching query */
        ...(reports.filter(r => r.label.toLowerCase().includes(q)).length > 0 ? [{
          id: "reports", label: t.search.sections.reports,
          items: reports.filter(r => r.label.toLowerCase().includes(q)).slice(0, 5),
        }] : []),
        /* Dynamic: publications matching query */
        ...(posts.filter(p => p.label.toLowerCase().includes(q)).length > 0 ? [{
          id: "publications", label: t.search.sections.publications,
          items: posts.filter(p => p.label.toLowerCase().includes(q)).slice(0, 5),
        }] : []),
      ]
    : [
        /* Default: all static sections + browse links for reports/publications */
        ...STATIC_SECTIONS,
        {
          id: "reports", label: t.search.sections.reports,
          items: [{ label: t.search.items.browseArchive, icon: "/assets/ui/search-reports-icon.svg", href: lp("/mindscope") }],
        },
        {
          id: "publications", label: t.search.sections.publications,
          items: [{ label: t.search.items.browseMindscope, icon: "/assets/ui/search-publications-icon.svg", href: lp("/mindscope") }],
        },
      ];

  return (
    <>
      {open ? (
        <button className="nav-search nav-search--close" onClick={closeModal} aria-label={t.search.close}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6"  y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <button ref={pillRef} className="nav-search" onClick={openModal} aria-label={t.search.open}>
          <span className="nav-search__label">{t.search.pill}</span>
          <span className="nav-search__icon">
            <img src="/assets/ui/iconsax-command.svg" alt="" width={17} height={17} draggable={false} />
          </span>
        </button>
      )}

      {mounted && open && createPortal(
        <div ref={backdropRef} className="srch-backdrop" onClick={closeModal}>
          <div ref={modalRef} className="srch-modal" onClick={e => e.stopPropagation()}>

            <div className="srch-input-row">
              <svg className="srch-input-icon-svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                className="srch-input-field"
                type="search"
                placeholder={t.search.placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button className="srch-input-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label={t.search.clear}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6"  y2="18" />
                    <line x1="6"  y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <div className="srch-body">
              {filtered.length === 0 ? (
                <p className="srch-empty">{t.search.empty} &ldquo;{query}&rdquo;</p>
              ) : (
                filtered.map(section => (
                  <div key={section.id} className="srch-section">
                    <div className="srch-section-label">{section.label}</div>
                    {section.items.map(item => (
                      <button key={item.label} className="srch-item" onClick={() => navigate(item)}>
                        <img src={item.icon} alt="" width={16} height={16} className="srch-item__icon" />
                        <span className="srch-item__label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
