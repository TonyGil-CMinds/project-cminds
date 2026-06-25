"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const PHRASES = ["place of action", "disruptive team", "living network"] as const;

const PARAS = [
  "C Minds is not just a think tank. It's where bold, meaningful ideas are put into motion. We map the intersection between technology, ethics, and life dignity imagine and build futures that work for all life on Earth.",
  "From the beginning, we've understood that lasting transformation requires more than innovation. It demands a reimagination of our orbit. We challenge default systems with purpose, because the world requires paradigm shifts; new coordinates.",
  "C Minds brings together thought-provoking minds paving new paths toward a more inclusive, ethical, and innovative future. We believe in the power of technology—when guided by purpose—to drive meaningful change.",
] as const;

const N = 500;

function smoothstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

function genInfinity(n: number): Float32Array {
  const pos = new Float32Array(n * 3);
  const A = 192, B = 96;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    pos[i * 3]     = A * Math.cos(t)     + (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = B * Math.sin(2 * t) + (Math.random() - 0.5) * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  return pos;
}

function genOrbits(n: number): Float32Array {
  const pos = new Float32Array(n * 3);
  const rings = [{ r: 88, tilt: 0 }, { r: 145, tilt: Math.PI / 3 }, { r: 192, tilt: -Math.PI / 4 }];
  const per = Math.floor(n / rings.length);
  rings.forEach(({ r, tilt }, d) => {
    const count = d < rings.length - 1 ? per : n - per * (rings.length - 1);
    for (let i = 0; i < count; i++) {
      const t   = (i / count) * Math.PI * 2;
      const idx = (d * per + i) * 3;
      pos[idx]     = r * Math.cos(t)                  + (Math.random() - 0.5) * 5;
      pos[idx + 1] = r * Math.sin(t) * Math.cos(tilt) + (Math.random() - 0.5) * 5;
      pos[idx + 2] = r * Math.sin(t) * Math.sin(tilt) + (Math.random() - 0.5) * 5;
    }
  });
  return pos;
}

function genSpiral(n: number): Float32Array {
  const pos = new Float32Array(n * 3);
  const turns = 3.5, maxR = 188, H = 300;
  for (let i = 0; i < n; i++) {
    const pct = i / (n - 1);
    const t   = pct * turns * Math.PI * 2;
    const r   = pct * maxR;
    pos[i * 3]     = r * Math.cos(t)     + (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = pct * H - H / 2    + (Math.random() - 0.5) * 6;
    pos[i * 3 + 2] = r * Math.sin(t)    + (Math.random() - 0.5) * 6;
  }
  return pos;
}

function makeGlowSprite(hexColor: string): THREE.Sprite {
  const size = 256;
  const cv   = document.createElement("canvas");
  cv.width   = cv.height = size;
  const ctx  = cv.getContext("2d")!;
  const c    = new THREE.Color(hexColor);
  const r    = Math.round(c.r * 255);
  const g    = Math.round(c.g * 255);
  const b    = Math.round(c.b * 255);
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0,    `rgba(${r},${g},${b},0.18)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.09)`);
  grad.addColorStop(0.65, `rgba(${r},${g},${b},0.03)`);
  grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex  = new THREE.CanvasTexture(cv);
  const mat  = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(460, 460, 1);
  return sprite;
}

interface Props {
  onScrollProgress?: (p: number, section: "core-scroll" | "manifesto") => void;
}

export default function CoreScrollSection({ onScrollProgress }: Props) {
  const sectionRef   = useRef<HTMLElement>(null);
  const pinRef       = useRef<HTMLDivElement>(null);
  const cvRef        = useRef<HTMLCanvasElement>(null);
  const phraseRefs   = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const paraRefs     = useRef<(HTMLParagraphElement | null)[]>([null, null, null]);
  const lastPhaseRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin     = pinRef.current;
    const cv      = cvRef.current;
    if (!section || !pin || !cv) return;

    const canvasWrap = cv.parentElement as HTMLDivElement;
    const isMobile = window.innerWidth <= 1024;
    const mobileSize = Math.round(Math.min(window.innerWidth * 0.42, 200));
    const W = canvasWrap.clientWidth  || (isMobile ? mobileSize : Math.round(window.innerWidth  * 0.38));
    const H = canvasWrap.clientHeight || (isMobile ? mobileSize : Math.round(window.innerHeight * 0.55));

    // ── Three.js ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(56, W / H, 0.1, 2000);
    cam.position.z = 480;

    const primaryHex = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#5EC1F3";
    scene.add(makeGlowSprite(primaryHex));

    const targets = [genInfinity(N), genOrbits(N), genSpiral(N)];
    const curPos  = new Float32Array(targets[0]);
    const geom    = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(curPos, 3);
    geom.setAttribute("position", posAttr);

    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.8, transparent: true, opacity: 0.76, sizeAttenuation: true });
    const pts = new THREE.Points(geom, mat);
    pts.frustumCulled = false;
    scene.add(pts);

    let rotY = 0;
    const raf = { id: 0 };
    const renderLoop = () => {
      raf.id = requestAnimationFrame(renderLoop);
      rotY += 0.0025;
      pts.rotation.y = rotY;
      renderer.render(scene, cam);
    };
    renderLoop();

    // ── Initial states ────────────────────────────────────────────
    phraseRefs.current.forEach((el, i) => {
      if (!el || i === 0) return;
      gsap.set(el.querySelectorAll(".cs-pw"), { opacity: 0, y: 22, filter: "blur(12px)" });
    });
    paraRefs.current.forEach((el, i) => {
      if (!el || i === 0) return;
      gsap.set(el, { opacity: 0, y: 12, filter: "blur(8px)" });
    });

    // ── Phase transition ──────────────────────────────────────────
    function transitionPhrase(from: number, to: number) {
      const isForward = to > from;

      // Kill any running tweens on all phrases before starting new ones.
      // This prevents stacking when the user scrubs back and forth quickly.
      phraseRefs.current.forEach((el, i) => {
        if (!el) return;
        const words = el.querySelectorAll<HTMLSpanElement>(".cs-pw");
        gsap.killTweensOf(words);
        // Reset any phrase that is neither source nor target to fully hidden
        if (i !== from && i !== to) {
          gsap.set(words, { opacity: 0, y: 0, filter: "blur(12px)" });
        }
      });
      paraRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        if (i !== from && i !== to) gsap.set(el, { opacity: 0, filter: "blur(8px)" });
      });

      const oldEl = phraseRefs.current[from];
      if (oldEl) {
        const words = oldEl.querySelectorAll<HTMLSpanElement>(".cs-pw");
        gsap.to(words, {
          opacity: 0, y: isForward ? -20 : 20, filter: "blur(10px)",
          duration: 0.28,
          stagger: { each: 0.045, from: isForward ? "end" : "start" },
          ease: "power2.in",
        });
      }
      const oldPara = paraRefs.current[from];
      if (oldPara) {
        gsap.to(oldPara, { opacity: 0, y: isForward ? -10 : 10, filter: "blur(8px)", duration: 0.28, ease: "power2.in" });
      }

      const newEl = phraseRefs.current[to];
      if (newEl) {
        const words = newEl.querySelectorAll<HTMLSpanElement>(".cs-pw");
        gsap.fromTo(words,
          { opacity: 0, y: isForward ? 24 : -24, filter: "blur(12px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, delay: 0.18, stagger: { each: 0.09, from: "start" }, ease: "power3.out" }
        );
      }
      const newPara = paraRefs.current[to];
      if (newPara) {
        gsap.fromTo(newPara,
          { opacity: 0, y: isForward ? 14 : -14, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, delay: 0.3, ease: "power2.out" }
        );
      }
    }

    // ── Scroll callback ───────────────────────────────────────────
    function onScrollUpdate(p: number) {
      onScrollProgress?.(p, "core-scroll");

      let fromIdx: number, toIdx: number, morphP: number;
      if      (p < 0.28) { fromIdx = 0; toIdx = 0; morphP = 0; }
      else if (p < 0.46) { fromIdx = 0; toIdx = 1; morphP = smoothstep((p - 0.28) / 0.18); }
      else if (p < 0.62) { fromIdx = 1; toIdx = 1; morphP = 0; }
      else if (p < 0.80) { fromIdx = 1; toIdx = 2; morphP = smoothstep((p - 0.62) / 0.18); }
      else               { fromIdx = 2; toIdx = 2; morphP = 0; }

      const from = targets[fromIdx], to = targets[toIdx];
      for (let i = 0; i < N * 3; i++) curPos[i] = from[i] + (to[i] - from[i]) * morphP;
      posAttr.needsUpdate = true;

      const phase = Math.min(2, Math.floor(p * 3));
      if (phase !== lastPhaseRef.current) {
        transitionPhrase(lastPhaseRef.current, phase);
        lastPhaseRef.current = phase;
      }
    }

    const st = ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: true,
      scrub: 1.2,
      onUpdate: (self) => onScrollUpdate(self.progress),
    });

    onScrollUpdate(0);
    ScrollTrigger.refresh();

    return () => {
      st.kill();
      cancelAnimationFrame(raf.id);
      renderer.dispose();
      geom.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} className="cs-section">
      <div ref={pinRef} className="cs-pin">

        <div className="cs-left">
          <h2 className="cs-static">We are a</h2>
          <div className="cs-phrase-wrap">
            {PHRASES.map((ph, i) => (
              <span
                key={ph}
                ref={el => { phraseRefs.current[i] = el; }}
                className="cs-phrase"
              >
                {ph.split(" ").map((word, j) => (
                  <span key={j} className="cs-pw" style={i !== 0 ? { opacity: 0 } : undefined}>{word}{j < ph.split(" ").length - 1 ? " " : ""}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="cs-canvas-wrap">
          <canvas ref={cvRef} />
        </div>

        <div className="cs-para-wrap">
          {PARAS.map((text, i) => (
            <p
              key={i}
              ref={el => { paraRefs.current[i] = el; }}
              className="cs-para"
            >
              {text}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}
