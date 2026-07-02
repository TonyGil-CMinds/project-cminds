"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// box: position within the image (all percentages)
// top/left anchor the box; width/height size it to the object
const SLIDES = [
  {
    title: ["Global Learning", "Platform"],
    body: [
      "Bridging silos between tech innovation, the climate, and conservation fields by creating spaces to share best practices, technologies, and resources.",
      "This includes annual high-level global forums, and much more.",
    ],
    image: "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-1.webp",
    // Flamingo stands on the right half — tall narrow box framing body + legs
    detection: { tag: "SPECIES", pct: 94, box: { top: 10, left: 50, width: 38, height: 84 } },
  },
  {
    title: ["AI Living Labs for", "Conservation"],
    body: [
      "Harnessing the power of AI to strengthen the protection and management of public and private nature reserves around the planet.",
      "Our aim is to create a global network of AI-driven Living Labs of natural reserves.",
    ],
    image: "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-2.webp",
    // Manatee head fills left-center of image — tall box from top edge
    detection: { tag: "SPECIES", pct: 91, box: { top: 3, left: 8, width: 58, height: 82 } },
  },
  {
    title: ["Open Data Pool", "for AI Training"],
    body: [
      "Accelerating the access to open robust data to train AI models to fast-forward the world's conservation and restoration solutions, as well as provide viable, AI-powered alternatives.",
    ],
    image: "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-3.webp",
    // Person (face + upper body) centered in image
    detection: { tag: "HUMAN", pct: 97, box: { top: 5, left: 34, width: 44, height: 60 } },
  },
];

const N             = SLIDES.length;
const SCROLL_PER_CHAP = 1000;

export default function AfbOurComponents() {
  const sectionRef = useRef<HTMLElement>(null);
  const chapIdxRef = useRef(0);

  const titleLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paraLayerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const imgLayerRefs   = useRef<(HTMLImageElement | null)[]>([]);

  const detLabelRef = useRef<HTMLSpanElement>(null);
  const detPctRef   = useRef<HTMLSpanElement>(null);
  const detBoxRef   = useRef<HTMLDivElement>(null);

  const applyBox = useCallback((idx: number) => {
    const { top, left, width, height } = SLIDES[idx].detection.box;
    gsap.set(detBoxRef.current, {
      top:    `${top}%`,
      left:   `${left}%`,
      width:  `${width}%`,
      height: `${height}%`,
    });
  }, []);

  const animateTo = useCallback((idx: number) => {
    const prev = chapIdxRef.current;
    chapIdxRef.current = idx;

    // ── Exit title lines (slide up + fade) ──
    const prevTL = titleLayerRefs.current[prev];
    if (prevTL) {
      const lines = prevTL.querySelectorAll<HTMLElement>(".afb-comp-title-line");
      gsap.to(lines, {
        y: -28, opacity: 0, duration: 0.22, stagger: 0.05, ease: "power2.in",
        onComplete: () => gsap.set(prevTL, { opacity: 0 }),
      });
    }

    // ── Exit paragraphs ──
    const prevPL = paraLayerRefs.current[prev];
    if (prevPL) {
      const paras = prevPL.querySelectorAll<HTMLElement>(".afb-comp-para");
      gsap.to(paras, {
        y: -16, opacity: 0, duration: 0.18, stagger: 0.04, ease: "power2.in",
        onComplete: () => gsap.set(prevPL, { opacity: 0 }),
      });
    }

    // ── Cross-fade image ──
    gsap.to(imgLayerRefs.current[prev], { opacity: 0, duration: 0.38, ease: "power2.in" });
    gsap.fromTo(imgLayerRefs.current[idx],
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.22 },
    );

    // ── Detection box: shrink → reposition → grow ──
    const slide = SLIDES[idx];
    gsap.to(detBoxRef.current, {
      scale: 0.05, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        applyBox(idx);
        if (detLabelRef.current) detLabelRef.current.textContent = slide.detection.tag;
        if (detPctRef.current)   detPctRef.current.textContent   = "0%";

        gsap.to(detBoxRef.current, { scale: 1, duration: 0.55, ease: "back.out(1.8)" });

        const obj = { val: 0 };
        gsap.to(obj, {
          val: slide.detection.pct, duration: 1.4, ease: "power2.out",
          onUpdate() {
            if (detPctRef.current) detPctRef.current.textContent = Math.round(obj.val) + "%";
          },
        });
      },
    });

    // ── Enter new title lines (slide up from below) ──
    const nextTL = titleLayerRefs.current[idx];
    if (nextTL) {
      gsap.set(nextTL, { opacity: 1 });
      const lines = nextTL.querySelectorAll<HTMLElement>(".afb-comp-title-line");
      gsap.fromTo(lines,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.58, stagger: 0.1, ease: "power3.out", delay: 0.22 },
      );
    }

    // ── Enter new paragraphs ──
    const nextPL = paraLayerRefs.current[idx];
    if (nextPL) {
      gsap.set(nextPL, { opacity: 1 });
      const paras = nextPL.querySelectorAll<HTMLElement>(".afb-comp-para");
      gsap.fromTo(paras,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, stagger: 0.1, ease: "power3.out", delay: 0.3 },
      );
    }
  }, [applyBox]);

  useGSAP(() => {
    // Init visibility
    titleLayerRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
    paraLayerRefs.current.forEach((el, i)  => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
    imgLayerRefs.current.forEach((el, i)   => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));

    // Init detection box to slide 0 geometry
    applyBox(0);
    if (detLabelRef.current) detLabelRef.current.textContent = SLIDES[0].detection.tag;
    if (detPctRef.current)   detPctRef.current.textContent   = SLIDES[0].detection.pct + "%";

    ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      start: "top top",
      end: `+=${SCROLL_PER_CHAP * N}`,
      scrub: 0.5,
      snap: {
        snapTo: 1 / N,
        duration: { min: 0.3, max: 0.7 },
        delay: 0.06,
        ease: "back.out(1.4)",
      },
      onUpdate(self) {
        const raw      = self.progress * N;
        const chap     = Math.min(Math.floor(raw), N - 1);
        const chapProg = raw - Math.floor(raw);

        if (chap > chapIdxRef.current && chapProg < 0.05) animateTo(chap);
        if (chap < chapIdxRef.current && chapProg > 0.92) animateTo(chap);
      },
    });
  }, { scope: sectionRef, dependencies: [animateTo, applyBox] });

  return (
    <section ref={sectionRef} className="afb-comp">
      <div className="afb-comp-inner">

        <p className="afb-comp-label">OUR COMPONENTS</p>

        {/* Title — top-left, in flow, z above image */}
        <div className="afb-comp-title-wrap">
          {SLIDES.map((slide, i) => (
            <div key={i} ref={el => { titleLayerRefs.current[i] = el; }} className="afb-comp-title-layer">
              {slide.title.map((line, j) => (
                <span key={j} className="afb-comp-title-line">{line}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Image — centered, absolute, behind content */}
        <div className="afb-comp-img-area">
          <div className="afb-comp-img-stack">
            {SLIDES.map((slide, i) => (
              <img
                key={i}
                ref={el => { imgLayerRefs.current[i] = el; }}
                src={slide.image}
                alt=""
                className="afb-comp-img"
              />
            ))}
          </div>

          {/* AI detection box — GSAP drives top/left/width/height + scale */}
          <div ref={detBoxRef} className="afb-comp-det-box" aria-hidden="true">
            <span className="afb-comp-det-scan" />
            <span ref={detLabelRef} className="afb-comp-det-label" />
            <span ref={detPctRef}   className="afb-comp-det-pct" />
          </div>
        </div>

        {/* Paragraph — absolute, bottom-right, z above image */}
        <div className="afb-comp-para-wrap">
          {SLIDES.map((slide, i) => (
            <div key={i} ref={el => { paraLayerRefs.current[i] = el; }} className="afb-comp-para-layer">
              {slide.body.map((p, j) => (
                <p key={j} className="afb-comp-para">{p}</p>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
