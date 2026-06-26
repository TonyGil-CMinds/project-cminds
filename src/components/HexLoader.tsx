"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";

export default function HexLoader({ onComplete }: { onComplete: () => void }) {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const cvRef         = useRef<HTMLCanvasElement>(null);
  const cntRef        = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const wrap = wrapRef.current, cv = cvRef.current, cnt = cntRef.current;
    if (!wrap || !cv || !cnt) return;

    let raf = 0;
    const W = window.innerWidth, H = window.innerHeight;

    // ── User color preference ──────────────────────────────────
    const VALID_HEX = ["#5EC1F3", "#512AE5", "#876FE8"];
    const cookieMatch = document.cookie.match(/(?:^|;\s*)cminds_color=([^;]+)/);
    const cookieHex   = cookieMatch ? decodeURIComponent(cookieMatch[1]) : "";
    const userHex     = VALID_HEX.includes(cookieHex) ? cookieHex : "#5EC1F3";

    // Sync CSS variable so the counter gradient follows the same color
    document.documentElement.style.setProperty("--color-primary", userHex);

    // ── Renderer ───────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    } catch {
      onCompleteRef.current();
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const fov  = 55;
    const camZ = (H / 2) / Math.tan((fov / 2) * (Math.PI / 180));
    const cam  = new THREE.PerspectiveCamera(fov, W / H, 0.1, camZ * 4);
    cam.position.z = camZ;

    const CYAN = new THREE.Color(userHex);
    const BG   = new THREE.Color("#040314");

    // ── 1 · Hex outline — straight edges, not a circle ────────
    const HR   = Math.min(W, H) * 0.17; // larger so counter fits inside
    const SIDES = 6, SPP = 20; // segments per side
    const N    = SIDES * SPP;
    const lPos: number[] = [], lT: number[] = [];

    for (let s = 0; s <= N; s++) {
      const t    = s / N;
      const raw  = t * SIDES;
      const side = Math.min(Math.floor(raw), SIDES - 1);
      const frac = raw - side;
      const a0   = -Math.PI / 2 + side * (Math.PI / 3);
      const a1   = -Math.PI / 2 + (side + 1) * (Math.PI / 3);
      const x0   = HR * Math.cos(a0), y0 = HR * Math.sin(a0);
      const x1   = HR * Math.cos(a1), y1 = HR * Math.sin(a1);
      lPos.push(x0 + frac * (x1 - x0), y0 + frac * (y1 - y0), 0);
      lT.push(t);
    }

    const lGeom = new THREE.BufferGeometry();
    lGeom.setAttribute("position", new THREE.Float32BufferAttribute(lPos, 3));
    lGeom.setAttribute("a_t",      new THREE.Float32BufferAttribute(lT, 1));

    const uP: { value: number } = { value: 0.0 };
    const uA: { value: number } = { value: 1.0 };

    function makeOutlineMat(spread: string, mult: string): THREE.ShaderMaterial {
      return new THREE.ShaderMaterial({
        uniforms: { u_p: uP, u_a: uA, u_col: { value: CYAN.clone() } },
        vertexShader: `
          attribute float a_t;
          uniform float u_p;
          varying float v_t, v_tip;
          void main(){
            v_t   = a_t;
            v_tip = 1.0 - smoothstep(0.0, ${spread}, abs(a_t - u_p));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 u_col; uniform float u_p, u_a;
          varying float v_t, v_tip;
          void main(){
            if(v_t > u_p + 0.001) discard;
            vec3 c = u_col + vec3(0.5, 0.7, 1.0) * v_tip * ${mult};
            gl_FragColor = vec4(c, u_a * (0.65 + v_tip * 0.35));
          }
        `,
        transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
      });
    }

    const lLines: THREE.Line[] = [];
    ([
      [1.000, "0.05", "1.2"],
      [1.022, "0.10", "0.55"],
      [1.048, "0.14", "0.22"],
    ] as [number, string, string][]).forEach(([sc, sp, mu]) => {
      const line = new THREE.Line(lGeom, makeOutlineMat(sp, mu));
      line.scale.setScalar(sc);
      line.renderOrder = 10;
      scene.add(line);
      lLines.push(line);
    });

    // Tip glow
    const tipMat = new THREE.ShaderMaterial({
      uniforms: { u_col: { value: new THREE.Color("#c0eeff") }, u_a: { value: 0 } },
      vertexShader:
        `varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader:
        `uniform vec3 u_col; uniform float u_a; varying vec2 v;
         void main(){ float r=length(v-0.5)*2.0; float a=pow(max(0.0,1.0-r),1.7)*u_a; gl_FragColor=vec4(u_col,a); }`,
      transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    });
    const tipMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(HR * 0.30, HR * 0.30), tipMat
    );
    tipMesh.renderOrder = 12;
    scene.add(tipMesh);

    // ── 2 · Hex grid background ────────────────────────────────
    const GR = Math.min(W, H) * 0.062;
    const CS = GR * Math.sqrt(3);
    const RS = GR * 1.5;
    const gC = Math.ceil(W / 2 / CS) + 2;
    const gR = Math.ceil(H / 2 / RS) + 2;

    const gPos: number[] = [], gCx: number[] = [], gCy: number[] = [];
    const centers: [number, number][] = [];

    for (let row = -gR; row <= gR; row++) {
      for (let col = -gC; col <= gC; col++) {
        const cx = col * CS + (row % 2 !== 0 ? CS / 2 : 0);
        const cy = row * RS;
        centers.push([cx, cy]);
        for (let i = 0; i < 6; i++) {
          const a1 = (Math.PI / 3) * i       - Math.PI / 6;
          const a2 = (Math.PI / 3) * (i + 1) - Math.PI / 6;
          gPos.push(cx + GR * Math.cos(a1), cy + GR * Math.sin(a1), 0);
          gPos.push(cx + GR * Math.cos(a2), cy + GR * Math.sin(a2), 0);
          gCx.push(cx, cx); gCy.push(cy, cy);
        }
      }
    }

    const gGeom = new THREE.BufferGeometry();
    gGeom.setAttribute("position", new THREE.Float32BufferAttribute(gPos, 3));
    gGeom.setAttribute("a_cx",     new THREE.Float32BufferAttribute(gCx, 1));
    gGeom.setAttribute("a_cy",     new THREE.Float32BufferAttribute(gCy, 1));

    const uBase:  { value: number } = { value: 0 };
    const laserX: { v: number }     = { v: -W / 2 - 120 };

    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        u_base:  uBase,
        u_laser: { value: new THREE.Vector2(laserX.v, 0) },
        u_lrad:  { value: GR * 12 },
        u_col:   { value: CYAN.clone() },
      },
      vertexShader: `
        attribute float a_cx;
        attribute float a_cy;
        uniform vec2  u_laser;
        uniform float u_lrad;
        uniform float u_base;
        varying float v_g;
        void main(){
          float d = length(vec2(a_cx, a_cy) - u_laser) / u_lrad;
          v_g = u_base + max(0.0, 1.0 - d * d) * 0.55;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader:
        `uniform vec3 u_col; varying float v_g; void main(){ gl_FragColor = vec4(u_col, v_g); }`,
      transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    });

    const grid = new THREE.LineSegments(gGeom, gridMat);
    grid.renderOrder = 5;
    grid.visible = false;
    scene.add(grid);

    // ── 3 · Hex fills for cascade flip ────────────────────────
    // FrontSide: when rotated past 90° the face is backface-culled → hex disappears
    // This is what creates the "flip reveals the hero" effect
    function hexFillGeom(r: number): THREE.ShapeGeometry {
      const s = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0 ? s.moveTo(r * Math.cos(a), r * Math.sin(a))
                : s.lineTo(r * Math.cos(a), r * Math.sin(a));
      }
      s.closePath();
      return new THREE.ShapeGeometry(s);
    }

    const fillGeom = hexFillGeom(GR * 0.94);
    const fMats:   THREE.MeshBasicMaterial[] = [];
    const fGroups: THREE.Group[] = [];

    for (const [cx, cy] of centers) {
      const mat = new THREE.MeshBasicMaterial({
        color: BG,
        transparent: true,
        opacity: 0,
        side: THREE.FrontSide, // backface culled → flip makes hex vanish
      });
      const g = new THREE.Group();
      g.add(new THREE.Mesh(fillGeom, mat));
      g.position.set(cx, cy, 0);
      g.visible = false;
      g.renderOrder = 20;
      scene.add(g);
      fGroups.push(g);
      fMats.push(mat);
    }

    // ── Render loop ────────────────────────────────────────────
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const a = uP.value * Math.PI * 2 - Math.PI / 2;
      tipMesh.position.set(HR * Math.cos(a), HR * Math.sin(a), 0);
      tipMat.uniforms.u_a.value =
        Math.min(1, uP.value * 14) * (1 - Math.max(0, (uP.value - 0.96) / 0.04));
      gridMat.uniforms.u_laser.value.set(laserX.v, 0);
      renderer.render(scene, cam);
    };
    loop();

    // ── Animation timeline ─────────────────────────────────────
    const obj   = { n: 0 };
    const numEl = cnt.querySelector<HTMLElement>(".hc-n");
    const pctEl = cnt.querySelector<HTMLElement>(".hc-p");

    const tl = gsap.timeline();

    // Phase 1: counter + hex outline draws
    tl.to(obj, {
      n: 100, duration: 2.4, ease: "power1.inOut",
      onUpdate() {
        uP.value = obj.n / 100;
        if (numEl) numEl.textContent = String(Math.round(obj.n));
      },
    });

    // Phase 1b: odometer exit
    tl.add(() => {
      if (!numEl) return;
      numEl.innerHTML = ["1", "0", "0"]
        .map(c => `<span class="hc-digit-clip"><i>${c}</i></span>`)
        .join("");
      cnt.querySelectorAll<HTMLElement>(".hc-digit-clip i").forEach((el, i) => {
        gsap.to(el, { y: "-115%", duration: 0.38, delay: i * 0.09, ease: "back.in(2.2)" });
      });
      if (pctEl) gsap.to(pctEl, { y: "-115%", opacity: 0, duration: 0.34, delay: 0.22 });
      gsap.to(uA, { value: 0, duration: 0.55, delay: 0.1 });
    }, "+=0.3");

    // Phase 2: grid appears + laser sweeps — grid stays visible at base opacity
    tl.add(() => {
      grid.visible = true;
      // Raise to a visible base so the pattern stays legible after the laser
      gsap.to(uBase, { value: 0.11, duration: 0.55 });
      gsap.to(laserX, { v: W / 2 + 120, duration: 1.25, ease: "sine.inOut" });
    }, "+=0.35");

    // Phase 3: cascade flip → reveals hero
    tl.add(() => {
      // Cover screen with opaque fills — hide grid cleanly
      fGroups.forEach((g, i) => { g.visible = true; fMats[i].opacity = 1; });
      gsap.to(uBase, {
        value: 0, duration: 0.3,
        onComplete: () => { grid.visible = false; },
      });
      lLines.forEach(l => { l.visible = false; });
      tipMesh.visible = false;

      const maxDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2);

      fGroups.forEach((g, i) => {
        const [cx, cy] = centers[i];
        const dist  = Math.sqrt(cx * cx + cy * cy);
        const delay = (dist / maxDist) * 1.2;

        // Y-rotation: front face disappears past 90° (backface culled)
        // Z-jump gives the "salto" depth feel with the perspective camera
        gsap.timeline({ delay })
          .to(g.position, { z: 40,         duration: 0.16, ease: "power2.out" }, 0)
          .to(g.position, { z: 0,          duration: 0.34, ease: "power3.in"  }, 0.16)
          .to(g.rotation, { y: Math.PI,    duration: 0.50, ease: "back.out(1.6)" }, 0)
          .call(() => { g.visible = false; });
      });

      gsap.to(wrap, {
        backgroundColor: "rgba(4,3,20,0)",
        duration: 0.75,
        delay: 0.35,
        onComplete: () => onCompleteRef.current(),
      });
    }, "+=1.35");

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      const gl = renderer!.getContext();
      renderer!.dispose();
      const loseCtx = gl.getExtension('WEBGL_lose_context');
      if (loseCtx) loseCtx.loseContext();
      lGeom.dispose();
      gGeom.dispose();
      fillGeom.dispose();
      fMats.forEach(m => m.dispose());
    };
  }, []); // runs once on mount — onComplete accessed via ref

  return (
    <div ref={wrapRef} className="hex-loader-wrap">
      <canvas ref={cvRef} className="hex-loader-canvas" />
      <div ref={cntRef} className="hex-loader-count">
        <span className="hc-n">0</span><span className="hc-p">%</span>
      </div>
    </div>
  );
}
