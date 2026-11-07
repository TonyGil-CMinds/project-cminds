/* Sonido procedural del lector 3D (papel, zoom, gotas y marea), portado del reader de Vital Oceans.
   Todo se genera con Web Audio; no hay archivos de audio. */
import type { ReaderMood } from "./types";

export type ReaderAudio = {
  init(): void;
  setOn(v: boolean): void;
  flip(dir?: number, gain?: number, dur?: number, delay?: number): void;
  land(gain?: number): void;
  riffle(n: number, dir: number, step: number): void;
  rustleStart(): void;
  rustle(speed: number): void;
  rustleStop(): void;
  whoosh(inward?: boolean, gain?: number): void;
  chime(up?: boolean): void;
  shimmer(gain?: number): void;
  plip(gain?: number, pan?: number): void;
  tick(gain?: number): void;
  blip(): void;
  lift(gain?: number): void;
  slide(dir?: number): void;
  scene(k: number, force?: boolean): void;
  destroy(): void;
};

type DropOpts = { delay?: number; gain?: number; wet?: number; pitch?: number; pan?: number };
type Voice = { lp: BiquadFilterNode; g: GainNode; bp: BiquadFilterNode; sg: GainNode; fg: GainNode; pn: StereoPannerNode | null };
type Tide = {
  bus: GainNode;
  tone: BiquadFilterNode;
  voices: Voice[];
  vi: number;
  lvl: number;
  bright: number;
  scene: number;
  nextAt: number;
  timer: number;
  sources: AudioScheduledSourceNode[];
};
type BufKind = "white" | "pink" | "brown" | "foam";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const TONE: Record<ReaderMood, [number, number, number]> = { surface: [1, 1, 12000], calm: [0.75, 0.85, 7000], deep: [0.9, 0.72, 2800] };

export function createReaderAudio(moodOf: (spread: number) => ReaderMood, signal: AbortSignal): ReaderAudio {
  let ctx: AudioContext | null = null;
  let out: GainNode | null = null;
  let send: GainNode | null = null;
  let dropSend: GainNode | null = null;
  let echoIn: GainNode | null = null;
  let on = false;
  let rust: { s: AudioBufferSourceNode; bp: BiquadFilterNode; g: GainNode } | null = null;
  let tide: Tide | null = null;
  let susT = 0;
  let want = 0;
  const buf: Partial<Record<BufKind, AudioBuffer>> = {};

  // Solo se llaman con el contexto ya creado (live() o init()).
  const C = () => ctx as AudioContext;
  const O = () => out as GainNode;
  const T = () => C().currentTime;
  const R = (a: number, b: number) => a + Math.random() * (b - a);
  const bsrc = (kind: BufKind, r?: number) => {
    const s = C().createBufferSource();
    s.buffer = buf[kind] ?? null;
    s.playbackRate.value = r || 1;
    return s;
  };
  const nsrc = (r?: number) => bsrc("white", r);
  const gainN = (v: number) => {
    const g = C().createGain();
    g.gain.value = v;
    return g;
  };
  const filt = (type: BiquadFilterType, f: number, q?: number) => {
    const b = C().createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    if (q != null) b.Q.value = q;
    return b;
  };
  const panner = (v: number) => {
    if (!C().createStereoPanner) return null;
    const p = C().createStereoPanner();
    p.pan.value = clamp(v, -1, 1);
    return p;
  };
  const chain = (...nodes: (AudioNode | null)[]) => {
    const ns = nodes.filter((n): n is AudioNode => n !== null);
    for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]);
    return ns[ns.length - 1];
  };
  const wet = (node: AudioNode, amt: number, bus?: AudioNode | null) => {
    const g = gainN(amt);
    node.connect(g);
    const target = bus || send;
    if (target) g.connect(target);
  };
  function envG(t: number, a: number, peak: number, d: number) {
    const g = C().createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    return g;
  }
  // Colores de ruido del mar: blanco para la espuma, rosa para el cuerpo de la ola, café para el rumor lejano.
  function buffers() {
    const c = C();
    const sr = c.sampleRate;
    const len = Math.floor(sr * 6);
    const mk = (gen: (d: Float32Array, sr: number) => void, rms: number) => {
      const b = c.createBuffer(1, len, sr);
      const d = b.getChannelData(0);
      gen(d, sr);
      let e = 0;
      for (let i = 0; i < len; i++) e += d[i] * d[i];
      const k = rms / Math.sqrt(e / len || 1);
      for (let i = 0; i < len; i++) d[i] *= k;
      return b;
    };
    buf.white = mk((d) => {
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }, 0.577);
    buf.pink = mk((d) => {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
        b6 = w * 0.115926;
      }
    }, 0.3);
    buf.brown = mk((d) => {
      let l = 0;
      for (let i = 0; i < d.length; i++) {
        l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = l;
      }
    }, 0.3);
    buf.foam = mk((d, s) => {
      for (let i = 0; i < d.length; i++)
        if (Math.random() < 0.0045) {
          const a = (Math.random() < 0.5 ? -1 : 1) * R(0.2, 1), n = 10 + Math.floor(Math.random() * 30), w = (R(1800, 6500) / s) * 2 * Math.PI;
          for (let j = 0; j < n && i + j < d.length; j++) d[i + j] += a * Math.exp(-j / (n * 0.35)) * Math.sin(w * j);
        }
    }, 0.12);
  }
  // Reverberación cuya cola se oscurece al decaer.
  function makeIR(sec: number, decay: number, dark: number) {
    const c = C();
    const sr = c.sampleRate, n = Math.floor(sr * sec), ir = c.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const x = i / n, k = Math.min(0.96, dark * x), w = Math.random() * 2 - 1;
        lp = lp * k + w * (1 - k);
        d[i] = lp * Math.sqrt((1 + k) / (1 - k)) * Math.pow(1 - x, decay);
      }
    }
    return ir;
  }
  function init() {
    on = true;
    if (ctx && out) {
      window.clearTimeout(susT);
      if (ctx.state !== "running") ctx.resume().catch(() => {});
      out.gain.cancelScheduledValues(T());
      out.gain.setTargetAtTime(1, T(), 0.05);
      return;
    }
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) {
      on = false;
      return;
    }
    try {
      ctx = new AC();
    } catch {
      ctx = null;
      on = false;
      return;
    }
    out = gainN(1);
    const comp = C().createDynamicsCompressor();
    comp.threshold.value = -8;
    comp.knee.value = 6;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    out.connect(comp);
    comp.connect(C().destination);
    buffers();
    const room = C().createConvolver();
    room.buffer = makeIR(2.4, 3.2, 0.35);
    send = gainN(1);
    chain(send, room, gainN(0.5), out);
    // Gotas: un espacio más grande y oscuro, con un pequeño retardo previo.
    const cave = C().createConvolver(), pre = C().createDelay(0.25);
    cave.buffer = makeIR(4.4, 2.3, 0.85);
    pre.delayTime.value = 0.035;
    dropSend = gainN(1);
    chain(dropSend, pre, cave, gainN(0.85), out);
    // Gotas: eco de ida y vuelta que se oscurece en cada repetición.
    echoIn = gainN(1);
    const dl = C().createDelay(1.5), dr = C().createDelay(1.5), eo = gainN(0.5);
    dl.delayTime.value = 0.31;
    dr.delayTime.value = 0.31;
    chain(echoIn, filt("highpass", 320, 0.5), filt("lowpass", 3000, 0.5), dl);
    chain(dl, gainN(0.32), filt("lowpass", 2200, 0.5), dr);
    chain(dr, gainN(0.32), filt("lowpass", 2200, 0.5), dl);
    chain(dl, panner(-0.55), eo);
    chain(dr, panner(0.55), eo);
    eo.connect(out);
    wet(eo, 0.35, dropSend);
    startTide();
    scene(want, true);
    if (C().state !== "running") C().resume().catch(() => {});
  }
  function setOn(v: boolean) {
    on = v;
    if (!ctx || !out) return;
    const t = T();
    window.clearTimeout(susT);
    out.gain.cancelScheduledValues(t);
    if (v) {
      if (ctx.state !== "running") ctx.resume().catch(() => {});
      out.gain.setTargetAtTime(1, t, 0.06);
    } else {
      rustleStop();
      out.gain.setTargetAtTime(0, t, 0.05);
      susT = window.setTimeout(() => {
        if (!on && ctx && ctx.state === "running") ctx.suspend().catch(() => {});
      }, 400);
    }
  }
  document.addEventListener(
    "visibilitychange",
    () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend().catch(() => {});
      else if (on) ctx.resume().catch(() => {});
    },
    { signal },
  );
  const live = () => !!ctx && on;
  // Papel: barrido filtrado con crujido de fibras.
  function flip(dir = 1, gain = 1, dur = 0.6, delay = 0) {
    if (!live()) return;
    const t = T() + delay;
    const s = nsrc(0.85 + Math.random() * 0.3), bp = filt("bandpass", 2600, 0.7), hp = filt("highpass", 380), p = panner(0.35 * dir), g = C().createGain();
    bp.frequency.setValueAtTime(2800, t);
    bp.frequency.exponentialRampToValueAtTime(650, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.38 * gain, t + 0.06);
    g.gain.setTargetAtTime(0.0001, t + dur * 0.4, dur * 0.2);
    if (p) {
      p.pan.setValueAtTime(0.35 * dir, t);
      p.pan.linearRampToValueAtTime(-0.35 * dir, t + dur);
    }
    chain(s, bp, hp, g, p, O());
    s.start(t, Math.random() * 1.8);
    s.stop(t + dur * 1.6 + 0.2);
    const c = nsrc(1.4), ch = filt("highpass", 4200), cg = envG(t, 0.003, 0.2 * gain, 0.07);
    chain(c, ch, cg, O());
    c.start(t, Math.random() * 1.8);
    c.stop(t + 0.12);
  }
  function land(gain = 1) {
    if (!live()) return;
    const t = T();
    const s = nsrc(0.7), lp = filt("lowpass", 420, 0.7), g = envG(t, 0.006, 0.5 * gain, 0.16);
    chain(s, lp, g, O());
    s.start(t, Math.random() * 1.8);
    s.stop(t + 0.3);
    const o = C().createOscillator(), og = envG(t, 0.004, 0.14 * gain, 0.12);
    o.frequency.setValueAtTime(95, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
    chain(o, og, O());
    o.start(t);
    o.stop(t + 0.2);
  }
  function riffle(n: number, dir: number, step: number) {
    for (let k = 0; k < n; k++) flip(dir, k === 0 ? 0.9 : 0.5 + Math.random() * 0.25, 0.42, k * step);
  }
  function rustleStart() {
    if (!live() || rust) return;
    const s = nsrc(1), bp = filt("bandpass", 900, 0.9), g = C().createGain();
    s.loop = true;
    g.gain.value = 0.0001;
    chain(s, bp, g, O());
    s.start(0, Math.random() * 2);
    rust = { s, bp, g };
  }
  function rustle(speed: number) {
    if (!rust) return;
    const t = T(), v = Math.min(1, Math.abs(speed) / 6);
    rust.g.gain.setTargetAtTime(0.02 + v * 0.28, t, 0.05);
    rust.bp.frequency.setTargetAtTime(700 + v * 2400, t, 0.06);
  }
  function rustleStop() {
    if (!rust || !ctx) return;
    const r = rust;
    rust = null;
    const t = T();
    r.g.gain.setTargetAtTime(0.0001, t, 0.06);
    r.s.stop(t + 0.4);
  }
  // Zoom: aire resonante y un tono grave.
  function whoosh(inward = true, gain = 1) {
    if (!live()) return;
    const t = T(), s = nsrc(1), lp = filt("lowpass", 300, 4), g = C().createGain();
    lp.frequency.setValueAtTime(inward ? 260 : 2400, t);
    lp.frequency.exponentialRampToValueAtTime(inward ? 2400 : 260, t + 0.7);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.17 * gain, t + 0.32);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
    chain(s, lp, g, O());
    wet(g, 0.35);
    s.start(t, Math.random() * 1.8);
    s.stop(t + 1.1);
    const o = C().createOscillator(), og = envG(t, 0.3, 0.07 * gain, 0.6);
    o.frequency.setValueAtTime(inward ? 55 : 90, t);
    o.frequency.exponentialRampToValueAtTime(inward ? 90 : 50, t + 0.7);
    chain(o, og, O());
    o.start(t);
    o.stop(t + 1.0);
  }
  // Gota de agua: chirrido ascendente con una pequeña salpicadura, enviado al espacio grande y al eco.
  function drop(o: DropOpts = {}) {
    if (!live()) return;
    const t = T() + (o.delay || 0), g0 = o.gain == null ? 1 : o.gain, w = o.wet == null ? 1 : o.wet;
    const f0 = R(900, 1250) * (o.pitch || 1), rise = R(1.7, 2.2), dur = R(0.025, 0.04);
    const mix = gainN(1), pn = panner(o.pan == null ? R(-0.3, 0.3) : o.pan);
    const a = C().createOscillator(), ag = C().createGain();
    a.frequency.setValueAtTime(f0, t);
    a.frequency.exponentialRampToValueAtTime(f0 * rise, t + dur);
    ag.gain.setValueAtTime(0.0001, t);
    ag.gain.exponentialRampToValueAtTime(0.3 * g0, t + 0.0012);
    ag.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    const b = C().createOscillator(), bg = C().createGain();
    b.frequency.setValueAtTime(f0 * 2.4, t);
    b.frequency.exponentialRampToValueAtTime(f0 * 2.4 * rise, t + dur * 0.8);
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.03 * g0, t + 0.001);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    const s = nsrc(1.2), sp = filt("bandpass", R(3800, 6000), 1.4), sg = envG(t, 0.0008, 0.07 * g0, 0.01);
    chain(a, ag, mix);
    chain(b, bg, mix);
    chain(s, sp, sg, mix);
    chain(mix, pn, O());
    wet(mix, 0.95 * w, dropSend);
    wet(mix, 0.3 * w, echoIn);
    a.start(t);
    b.start(t);
    s.start(t, Math.random() * 5);
    a.stop(t + 0.16);
    b.stop(t + 0.08);
    s.stop(t + 0.03);
  }
  function chime(up = true) {
    if (!live()) return;
    drop({ pitch: up ? 0.9 : 1.25, gain: 0.85 });
    drop({ pitch: up ? 1.25 : 0.9, gain: 0.5, delay: R(0.12, 0.17) });
  }
  function shimmer(gain = 1) {
    if (!live()) return;
    let d = 0;
    for (let k = 0; k < 5; k++) {
      d += R(0.14, 0.4);
      drop({ pitch: R(0.8, 1.35), gain: (0.75 - k * 0.11) * gain, delay: d, pan: R(-0.6, 0.6) });
    }
  }
  const plip = (gain = 1, p = 0) => drop({ gain: 0.9 * gain, pitch: R(0.68, 0.82), pan: p, wet: 1.25 });
  const tick = (gain = 1) => drop({ gain: 0.75 * gain, pitch: R(1, 1.15) });
  const blip = () => drop({ gain: 0.3, pitch: R(1.35, 1.55), wet: 0.6 });
  function lift(gain = 1) {
    if (!live()) return;
    const t = T(), s = nsrc(1.1), bp = filt("bandpass", 1800, 0.8), g = envG(t, 0.03, 0.06 * gain, 0.12);
    chain(s, bp, g, O());
    s.start(t, Math.random() * 1.8);
    s.stop(t + 0.2);
  }
  function slide(dir = 1) {
    if (!live()) return;
    const t = T(), s = nsrc(1), bp = filt("bandpass", 900, 1.2), g = envG(t, 0.12, 0.07, 0.4), p = panner(-0.4 * dir);
    bp.frequency.setValueAtTime(600, t);
    bp.frequency.exponentialRampToValueAtTime(1600, t + 0.5);
    if (p) p.pan.linearRampToValueAtTime(0.4 * dir, t + 0.5);
    chain(s, bp, g, p, O());
    s.start(t, Math.random() * 1.8);
    s.stop(t + 0.6);
  }
  // Marea natural: olas que se encadenan (oleaje, rompiente, espuma) sobre un rumor lejano.
  function startTide() {
    const bus = gainN(0.0001), tone = filt("lowpass", 9000, 0.5);
    chain(bus, tone, O());
    wet(tone, 0.12);
    const sources: AudioScheduledSourceNode[] = [];
    const bed = bsrc("brown"), bedG = gainN(0.055);
    bed.loop = true;
    chain(bed, filt("lowpass", 180, 0.4), bedG, bus);
    bed.start(0, R(0, 5));
    const far = bsrc("pink"), farG = gainN(0.05);
    far.loop = true;
    chain(far, filt("bandpass", 520, 0.35), farG, bus);
    far.start(0, R(0, 5));
    const lfo = C().createOscillator(), lfoG = gainN(0.02);
    lfo.frequency.value = 0.055;
    lfo.connect(lfoG);
    lfoG.connect(farG.gain);
    lfo.start();
    sources.push(bed, far, lfo);
    const voices = [0, 1, 2, 3].map(() => {
      const body = bsrc("pink"), lp = filt("lowpass", 240, 0.6), g = gainN(0.0001);
      const spray = bsrc("white"), bp = filt("bandpass", 4200, 0.6), sg = gainN(0.0001);
      const foam = bsrc("foam"), fg = gainN(0.0001), pn = panner(0), sum = gainN(1);
      for (const src of [body, spray, foam]) {
        src.loop = true;
        src.playbackRate.value = R(0.92, 1.08);
        src.start(0, R(0, 5));
        sources.push(src);
      }
      chain(body, lp, g, sum);
      chain(spray, bp, sg, sum);
      chain(foam, filt("highpass", 2000, 0.5), fg, sum);
      chain(sum, pn, bus);
      return { lp, g, bp, sg, fg, pn };
    });
    const timer = window.setInterval(() => {
      if (on && ctx && ctx.state === "running") pump(1.6);
    }, 400);
    tide = { bus, tone, voices, vi: 0, lvl: 1, bright: 1, scene: -1, nextAt: T() + 0.6, timer, sources };
  }
  function pump(horizon: number) {
    if (!tide) return;
    const now = T();
    if (tide.nextAt < now) tide.nextAt = now + 0.1;
    while (tide.nextAt < now + horizon) tide.nextAt += wave(tide.nextAt);
  }
  function wave(t: number) {
    const td = tide as Tide;
    const v = td.voices[td.vi++ % td.voices.length], I = R(0.55, 1) * td.lvl, br = td.bright;
    const rise = R(1.6, 3.2), wash = R(4.5, 8.5), pk = t + rise, pan = R(-0.45, 0.45);
    for (const prm of [v.g.gain, v.sg.gain, v.fg.gain, v.lp.frequency, v.bp.frequency]) prm.cancelScheduledValues(t);
    v.g.gain.setValueAtTime(0.0001, t);
    v.g.gain.linearRampToValueAtTime(0.09 * I, t + rise * 0.8);
    v.g.gain.linearRampToValueAtTime(0.28 * I, pk);
    v.g.gain.setTargetAtTime(0.0001, pk + 0.1, wash * 0.28);
    v.lp.frequency.setValueAtTime(240, t);
    v.lp.frequency.exponentialRampToValueAtTime(650, t + rise * 0.85);
    v.lp.frequency.exponentialRampToValueAtTime(Math.max(900, 2800 * I * br), pk + 0.15);
    v.lp.frequency.setTargetAtTime(380, pk + 0.35, wash * 0.3);
    v.sg.gain.setValueAtTime(0.0001, t);
    v.sg.gain.setValueAtTime(0.0001, pk - 0.12);
    v.sg.gain.linearRampToValueAtTime(0.12 * I * br, pk + 0.3);
    v.sg.gain.setTargetAtTime(0.0001, pk + 0.45, wash * 0.22);
    v.bp.frequency.setValueAtTime(5200, t);
    v.bp.frequency.setTargetAtTime(2400, pk + 0.4, wash * 0.3);
    v.fg.gain.setValueAtTime(0.0001, t);
    v.fg.gain.setValueAtTime(0.0001, pk + 0.25);
    v.fg.gain.linearRampToValueAtTime(0.2 * I * br, pk + 1.3);
    v.fg.gain.setTargetAtTime(0.0001, pk + 1.5, wash * 0.38);
    if (v.pn) {
      v.pn.pan.cancelScheduledValues(t);
      v.pn.pan.setValueAtTime(pan, t);
      v.pn.pan.linearRampToValueAtTime(-pan * 0.4, pk + wash);
    }
    return rise + wash * R(0.45, 0.8);
  }
  function scene(k: number, force?: boolean) {
    want = k;
    if (!tide || (!force && tide.scene === k)) return;
    tide.scene = k;
    const [lvl, bright, lp] = TONE[moodOf(k)] ?? TONE.calm, t = T();
    tide.lvl = lvl;
    tide.bright = bright;
    tide.tone.frequency.setTargetAtTime(lp, t, 1.2);
    tide.bus.gain.setTargetAtTime(0.62 * lvl, t, 1.5);
  }
  function destroy() {
    on = false;
    window.clearTimeout(susT);
    if (tide) {
      window.clearInterval(tide.timer);
      for (const s of tide.sources) {
        try {
          s.stop();
        } catch {
          // ya detenido
        }
      }
      tide = null;
    }
    rust = null;
    if (ctx) ctx.close().catch(() => {});
    ctx = null;
    out = send = dropSend = echoIn = null;
  }
  return { init, setOn, flip, land, riffle, rustleStart, rustle, rustleStop, whoosh, chime, shimmer, plip, tick, blip, lift, slide, scene, destroy };
}
