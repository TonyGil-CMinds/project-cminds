"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { name: "Alex Muñoz",            role: "Director, Vital Oceans",            img: "/team/AlexMunos.png",          linkedin: "#" },
  { name: "Ángel Escalante",       role: "Lead, Digital Product",             img: "/team/Angel Escalante.png",    linkedin: "#" },
  { name: "Antonio Gil",           role: "Lead, Interactive Design",          img: "/team/Tony Gil.png",           linkedin: "#" },
  { name: "Camila Valdez",         role: "Editorial Design",                  img: "/team/Camila Valdes.png",      linkedin: "#" },
  { name: "Carlo Angeles",         role: "Head of Impact",                    img: "/team/Carlo Angeles.png",      linkedin: "#" },
  { name: "Eduardo Gómez Restrepo",role: "Head, ScaleUp Studio",              img: "/team/Eduardo Gómez.png",      linkedin: "#" },
  { name: "Enrique Portillo",      role: "Administration Lead",               img: "/team/Enrique Portillo.png",   linkedin: "#" },
  { name: "Fernanda Reséndiz",     role: "Communication",                     img: "/team/Fernanda Resendiz.png",  linkedin: "#" },
  { name: "Regina Cervera",        role: "Head, Nature Innovation Programs",  img: "/team/Regina Cervera.png",     linkedin: "#" },
  { name: "Xiomy Vázquez",         role: "Lead, Branding",                    img: "/team/Xiomy Vazquez.png",      linkedin: "#" },
];

const N      = TEAM.length;
const OFFSET = 320;

const getCardState = (i: number, activeIdx: number) => {
  const right = (activeIdx + 1) % N;
  const left  = (activeIdx - 1 + N) % N;
  if (i === activeIdx) return { x: 0,        scale: 1,    opacity: 1 };
  if (i === right)     return { x:  OFFSET,  scale: 0.82, opacity: 0.2 };
  if (i === left)      return { x: -OFFSET,  scale: 0.82, opacity: 0.2 };
  return                      { x: 0,        scale: 0.82, opacity: 0 };
};

export default function CoreTeamSection() {
  const [active, setActive]   = useState(0);
  const activeRef             = useRef(0);
  const cardRefs              = useRef<(HTMLDivElement | null)[]>([]);
  const infoRef               = useRef<HTMLDivElement>(null);
  const sectionRef            = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(TEAM[0]);
  const touchStartX           = useRef(0);

  useLayoutEffect(() => {
    TEAM.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const { x, scale, opacity } = getCardState(i, 0);
      gsap.set(card, { xPercent: -50, yPercent: -50, x, scale, opacity });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(".ct-heading",
        { opacity: 0, y: 32, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out" },
        0
      )
      .fromTo(".ct-sub",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
        0.3
      )
      .fromTo(".ct-link",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "power2.out" },
        0.48
      );

    tl.fromTo(infoRef.current,
        { opacity: 0, x: 24, filter: "blur(8px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
        0.2
      );

    const cards = cardRefs.current.filter(Boolean);
    tl.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: (i) => getCardState(i, 0).opacity,
          y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
        },
        0.1
      );

    tl.fromTo(".ct-nav",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.6
      );

    return () => { tl.kill(); };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -10;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 10;
    gsap.to(card, {
      rotateX: rx, rotateY: ry,
      transformPerspective: 800,
      duration: 0.25, ease: "power2.out", overwrite: "auto",
    });
  };

  const handleCardMouseLeave = (i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: "auto",
    });
  };

  const goTo = (idx: number) => {
    const newActive = ((idx % N) + N) % N;
    if (newActive === activeRef.current) return;

    TEAM.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const { x, scale, opacity } = getCardState(i, newActive);
      gsap.to(card, { x, scale, opacity, duration: 0.65, ease: "back.out(1.4)" });
    });

    gsap.to(infoRef.current, {
      opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setDisplay(TEAM[newActive]);
        setActive(newActive);
        activeRef.current = newActive;
        gsap.fromTo(infoRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="ct-section"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) < 40) return;
        goTo(activeRef.current + (delta < 0 ? 1 : -1));
      }}
    >

      {/* ── Photo cards ── */}
      <div className="ct-track">
        {TEAM.map((m, i) => (
          <div
            key={m.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="ct-card"
            onMouseMove={(e) => handleCardMouseMove(e, i)}
            onMouseLeave={() => handleCardMouseLeave(i)}
          >
            <img src={m.img} alt={m.name} draggable={false} />
            <div className="ct-card-mobile-overlay">
              <p className="ct-role">{m.role}</p>
              <h3 className="ct-name">{m.name}</h3>
              <a href={m.linkedin} className="ct-linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ── Left: heading + links ── */}
      <div className="ct-left">
        <div>
          <h2 className="ct-heading" style={{ opacity: 0 }}>Get to<br />know us</h2>
          <p className="ct-sub" style={{ opacity: 0 }}>Our core team</p>
        </div>
        <div className="ct-links">
          <a className="ct-link" href="#" style={{ opacity: 0 }}>Want to join our team?</a>
          <a className="ct-link" href="#" style={{ opacity: 0 }}>Want to join the LAC ecosystem?</a>
        </div>
      </div>

      {/* ── Right: active member info ── */}
      <div className="ct-info" ref={infoRef} style={{ opacity: 0 }}>
        <p className="ct-role">{display.role}</p>
        <h3 className="ct-name">{display.name}</h3>
        <a href={display.linkedin} className="ct-linkedin" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6.7 8.6h3v9h-3v-9Zm1.5-4.2c1 0 1.7.7 1.7 1.6s-.7 1.6-1.7 1.6S6.5 6.9 6.5 6s.7-1.6 1.7-1.6Zm3.2 4.2h2.9v1.2h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.3v4.9h-3v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.5h-3v-9Z" />
          </svg>
        </a>
      </div>

      {/* ── Nav arrows ── */}
      <div className="ct-nav" style={{ opacity: 0 }}>
        <button className="ct-btn" onClick={() => goTo(activeRef.current - 1)} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="ct-btn" onClick={() => goTo(activeRef.current + 1)} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

    </section>
  );
}
