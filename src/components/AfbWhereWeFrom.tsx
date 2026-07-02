"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-1.webp",
  "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-2.webp",
  "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-3.webp",
  "/platforms/aiforbiodiversity/were-we-come-from/image-wherewecomefrom-4.webp",
];

const N             = IMAGES.length;
const SCROLL_PER_CHAP = 900;
// Side images are 52% the height of the center (all 16:9)
const SQ_FACTOR     = 0.52;

export default function AfbWhereWeFrom() {
  const sectionRef       = useRef<HTMLElement>(null);
  const galleryRef       = useRef<HTMLDivElement>(null);

  const leftWrapRef      = useRef<HTMLDivElement>(null);
  const leftImgRef       = useRef<HTMLImageElement>(null);
  const leftOvRef        = useRef<HTMLDivElement>(null);

  const centerWrapRef    = useRef<HTMLDivElement>(null);
  const centerImgRef     = useRef<HTMLImageElement>(null);
  const centerOvRef      = useRef<HTMLDivElement>(null);

  const rightWrapRef     = useRef<HTMLDivElement>(null);
  const rightImgRef      = useRef<HTMLImageElement>(null);
  const rightOvRef       = useRef<HTMLDivElement>(null);

  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef  = useRef<HTMLDivElement>(null);
  const line1Ref         = useRef<HTMLElement>(null);
  const line2Ref         = useRef<HTMLElement>(null);

  // chapIdxRef = index of the CURRENT center image
  const chapIdxRef = useRef(0);

  // Cached pixel dims
  const fWRef = useRef(0); // center width  = H * 16/9
  const fHRef = useRef(0); // center height = H
  const sWRef = useRef(0); // side width    = H * SQ_FACTOR * 16/9
  const sHRef = useRef(0); // side height   = H * SQ_FACTOR

  const setDims = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const H  = gallery.offsetHeight;
    const sH = H * SQ_FACTOR;
    const fW = H  * (16 / 9);
    const sW = sH * (16 / 9);

    fWRef.current = fW;
    fHRef.current = H;
    sWRef.current = sW;
    sHRef.current = sH;

    if (leftWrapRef.current)   { leftWrapRef.current.style.width   = `${sW}px`; leftWrapRef.current.style.height   = `${sH}px`; }
    if (centerWrapRef.current) { centerWrapRef.current.style.width = `${fW}px`; centerWrapRef.current.style.height = `${H}px`;  }
    if (rightWrapRef.current)  { rightWrapRef.current.style.width  = `${sW}px`; rightWrapRef.current.style.height  = `${sH}px`; }

    if (progressTrackRef.current) progressTrackRef.current.style.width = `${fW * 0.5}px`;
  }, []);

  useGSAP(() => {
    setDims();

    // Title entrance
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 36, filter: "blur(8px)" });
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 72%",
      once: true,
      onEnter: () => {
        gsap.to([line1Ref.current, line2Ref.current], {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.75, stagger: 0.18, ease: "power3.out",
        });
      },
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      start: "top top",
      end: `+=${SCROLL_PER_CHAP * N}`,
      scrub: 0.55,
      snap: {
        snapTo: 1 / N,
        duration: { min: 0.3, max: 0.7 },
        delay: 0.06,
        ease: "back.out(1.6)",
      },
      onUpdate: (self) => {
        const raw      = self.progress * N;
        const chap     = Math.min(Math.floor(raw), N - 1);
        const chapProg = Math.max(0, Math.min(1, raw - Math.floor(raw)));

        // ── Forward advance: swap srcs when sizes are near natural positions ──
        if (chap > chapIdxRef.current && chapProg < 0.05) {
          chapIdxRef.current = chap;

          if (leftImgRef.current)   leftImgRef.current.src   = IMAGES[(chap - 1 + N) % N];
          if (centerImgRef.current) centerImgRef.current.src = IMAGES[chap % N];
          if (rightImgRef.current)  rightImgRef.current.src  = IMAGES[(chap + 1) % N];

          leftOvRef.current?.style.setProperty("--ov",   "0.42");
          centerOvRef.current?.style.setProperty("--ov", "0");
          rightOvRef.current?.style.setProperty("--ov",  "0.42");

          // Bounce-in the new right
          gsap.killTweensOf(rightWrapRef.current);
          gsap.fromTo(rightWrapRef.current,
            { scale: 0.3, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.9)" },
          );
        }

        // ── Backward retreat: restore srcs at chapter boundary ──
        if (chap < chapIdxRef.current && chapProg > 0.92) {
          chapIdxRef.current = chap;
          if (leftImgRef.current)   leftImgRef.current.src   = IMAGES[(chap - 1 + N) % N];
          if (centerImgRef.current) centerImgRef.current.src = IMAGES[chap % N];
          if (rightImgRef.current)  rightImgRef.current.src  = IMAGES[(chap + 1) % N];
          leftOvRef.current?.style.setProperty("--ov",   "0.42");
          centerOvRef.current?.style.setProperty("--ov", "0");
          rightOvRef.current?.style.setProperty("--ov",  "0.42");
        }

        // ── Cross-morph sizes ──
        const fW = fWRef.current, fH = fHRef.current;
        const sW = sWRef.current, sH = sHRef.current;
        if (!fW || !sW) return;

        const t = chapProg;

        // Left exits (shrinks to 0)
        if (leftWrapRef.current) {
          leftWrapRef.current.style.width  = `${sW * (1 - t)}px`;
          leftWrapRef.current.style.height = `${sH * (1 - t)}px`;
        }
        // Center shrinks toward side size (becomes the new left)
        if (centerWrapRef.current) {
          centerWrapRef.current.style.width  = `${fW + (sW - fW) * t}px`;
          centerWrapRef.current.style.height = `${fH + (sH - fH) * t}px`;
        }
        // Right grows toward center size
        if (rightWrapRef.current) {
          rightWrapRef.current.style.width  = `${sW + (fW - sW) * t}px`;
          rightWrapRef.current.style.height = `${sH + (fH - sH) * t}px`;
        }

        // Overlays
        leftOvRef.current?.style.setProperty("--ov",   "0.42");
        centerOvRef.current?.style.setProperty("--ov", `${0.42 * t}`);
        rightOvRef.current?.style.setProperty("--ov",  `${0.42 * (1 - t)}`);

        // Progress bar
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${t})`;
        }
      },
    });

    const ro = new ResizeObserver(setDims);
    if (galleryRef.current) ro.observe(galleryRef.current);
    return () => ro.disconnect();

  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className="afb-wcf">
      <div className="afb-wcf-inner">

        <div className="afb-wcf-header">
          <p className="afb-wcf-label">WHERE WE COME FROM</p>
          <span ref={line1Ref} className="afb-wcf-title-line">AI for Climate is an initiative</span>
          <br />
          <span ref={line2Ref} className="afb-wcf-title-line">founded by C Minds</span>
        </div>

        <div ref={galleryRef} className="afb-wcf-gallery">

          {/* Left — previous image, exits during scroll */}
          <div ref={leftWrapRef} className="afb-wcf-card-wrap">
            <img ref={leftImgRef} src={IMAGES[(N - 1) % N]} alt="" className="afb-wcf-img" />
            <div ref={leftOvRef} className="afb-wcf-card-ov" style={{ "--ov": "0.42" } as React.CSSProperties} />
          </div>

          {/* Center — current featured, shrinks toward left during scroll */}
          <div ref={centerWrapRef} className="afb-wcf-card-wrap">
            <img ref={centerImgRef} src={IMAGES[0]} alt="" className="afb-wcf-img" />
            <div ref={centerOvRef} className="afb-wcf-card-ov" style={{ "--ov": "0" } as React.CSSProperties} />
          </div>

          {/* Right — next image, grows into center during scroll */}
          <div ref={rightWrapRef} className="afb-wcf-card-wrap">
            <img ref={rightImgRef} src={IMAGES[1]} alt="" className="afb-wcf-img" />
            <div ref={rightOvRef} className="afb-wcf-card-ov" style={{ "--ov": "0.42" } as React.CSSProperties} />
          </div>

        </div>

        <div ref={progressTrackRef} className="afb-wcf-progress-track">
          <div ref={progressFillRef} className="afb-wcf-progress-fill" />
        </div>

      </div>
    </section>
  );
}
