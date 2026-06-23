"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stack from "../../components/reactbits/Stack";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "/core/guidance/guidance-image-1.png",
  "/core/guidance/guidance-image-2.png",
  "/core/guidance/guidance-image-3.png",
  "/core/guidance/guidance-image-4.png",
  "/core/guidance/guidance-image-5.png",
  "/core/guidance/guidance-image-6.png",
];

const cards = IMAGES.map((src, i) => (
  <img
    key={i}
    src={src}
    alt={`Guidance ${i + 1}`}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
));

export default function GuidanceSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stackRef    = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLSpanElement>(null);
  const line2Ref    = useRef<HTMLSpanElement>(null);
  const line3Ref    = useRef<HTMLSpanElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    // Stack slides in from the left
    tl.fromTo(
      stackRef.current,
      { opacity: 0, x: -50, filter: "blur(12px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
      0
    );

    // Heading lines blur-stagger in
    tl.fromTo(
      [line1Ref.current, line2Ref.current, line3Ref.current],
      { opacity: 0, y: 32, filter: "blur(12px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.75, stagger: 0.12, ease: "power3.out",
      },
      0.15
    );

    // Body text follows
    tl.fromTo(
      bodyRef.current,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power2.out" },
      0.55
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="gd-section">
      <div className="gd-inner">

        <div ref={stackRef} className="gd-stack-wrap" style={{ opacity: 0 }}>
          <Stack
            cards={cards}
            sendToBackOnClick
            autoplay
            autoplayDelay={3200}
            pauseOnHover
            sensitivity={160}
            animationConfig={{ stiffness: 240, damping: 22 }}
          />
        </div>

        <div className="gd-text">
          <h2 className="gd-heading">
            <span ref={line1Ref} className="gd-line" style={{ opacity: 0 }}>Guiding</span><br />
            <span ref={line2Ref} className="gd-line gd-gradient" style={{ opacity: 0 }}>emerging tech</span><br />
            <span ref={line3Ref} className="gd-line" style={{ opacity: 0 }}>responsibly</span>
          </h2>
          <p ref={bodyRef} className="gd-body" style={{ opacity: 0 }}>
            We partner with communities and institutions to prototype and scale
            responsible emerging technologies for contextual impact.
          </p>
        </div>

      </div>
    </section>
  );
}
