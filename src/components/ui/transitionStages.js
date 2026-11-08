const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const easeOut = (value) => 1 - (1 - value) ** 3;
const easeIn = (value) => value * value * value;

const HOT = [255, 249, 235];
const AMBER = [255, 151, 59];
const CORAL = [255, 86, 93];
const CYAN = [125, 225, 255];
const VIOLET = [168, 120, 255];
const color = (rgb, alpha) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
const blend = (from, to, amount) => from.map((value, index) => lerp(value, to[index], amount));

function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 1294967296;
  };
}

// ---- Tuning -------------------------------------------------------------
const SPEED = 3.2; // 1 = original speed, 2 = twice as fast, 3 = three times as fast
const BASE_DURATION = 1550; // length of the animation timeline (ms, before speed-up)
const IMPLOSION_END = 250; // moment the black hole collapses and detonates

// Real playback time in ms. Anything using this for timeouts stays in sync.
export const BLACK_HOLE_BLAST_DURATION = BASE_DURATION / SPEED;

export function createBlackHoleBlast({ canvas, onDone }) {
  const context = canvas.getContext("2d");
  if (!context) {
    onDone?.();
    return { destroy() {} };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const diagonal = Math.hypot(width, height);
  const radius = clamp(Math.min(width, height) * 0.22, 100, 210);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const rand = randomSource(20261107);

  // Light rays shooting out from the core.
  const rays = Array.from({ length: 96 }, () => ({
    angle: rand() * TAU,
    length: diagonal * (0.25 + rand() * 0.75),
    width: 0.8 + rand() * 3.8,
    tint: rand() < 0.5 ? HOT : rand() < 0.7 ? CORAL : rand() < 0.85 ? CYAN : VIOLET,
  }));

  // Debris with motion trails.
  const particles = Array.from({ length: 340 }, () => ({
    angle: rand() * TAU,
    distance: diagonal * (0.12 + rand() * 0.9),
    speed: 1.6 + rand() * 3.4,
    size: 0.7 + rand() * 2.4,
    delay: rand() * 0.08,
    life: 0.5 + rand() * 0.6,
    tint: rand() < 0.55 ? AMBER : rand() < 0.8 ? CYAN : CORAL,
  }));

  // Heavy sparks that arc downward with gravity.
  const sparks = Array.from({ length: 70 }, () => ({
    angle: rand() * TAU,
    distance: diagonal * (0.08 + rand() * 0.3),
    speed: 2.2 + rand() * 2.4,
    size: 1 + rand() * 1.8,
    life: 0.55 + rand() * 0.5,
    fall: 40 + rand() * 120,
  }));

  // Matter being sucked into the black hole before it detonates.
  const suction = Array.from({ length: 150 }, () => ({
    angle: rand() * TAU,
    start: diagonal * (0.18 + rand() * 0.45),
    trail: 14 + rand() * 46,
    width: 0.8 + rand() * 1.8,
    tint: rand() < 0.5 ? AMBER : rand() < 0.75 ? HOT : VIOLET,
  }));

  let raf = 0;
  let startTime = null;
  let stopped = false;

  const radialGlow = (radiusValue, stops) => {
    if (radiusValue <= 0) return;
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusValue);
    stops.forEach(([offset, tint, alpha]) => gradient.addColorStop(offset, color(tint, clamp(alpha))));
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radiusValue, 0, TAU);
    context.fill();
  };

  const drawRing = (ringRadius, lineWidth, tint, alpha) => {
    if (ringRadius <= 0 || alpha <= 0) return;
    context.save();
    context.globalAlpha = clamp(alpha);
    context.strokeStyle = color(tint, 1);
    context.lineWidth = lineWidth;
    context.shadowColor = color(tint, 0.9);
    context.shadowBlur = lineWidth * 1.15;
    context.beginPath();
    context.arc(centerX, centerY, ringRadius, 0, TAU);
    context.stroke();
    context.restore();
  };

  // Horizontal / vertical lens-flare streak.
  const drawStreak = (length, thickness, vertical, tint, alpha) => {
    if (length <= 0 || alpha <= 0) return;
    const x0 = vertical ? centerX : centerX - length;
    const y0 = vertical ? centerY - length : centerY;
    const x1 = vertical ? centerX : centerX + length;
    const y1 = vertical ? centerY + length : centerY;
    const gradient = context.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, color(tint, 0));
    gradient.addColorStop(0.5, color(tint, clamp(alpha)));
    gradient.addColorStop(1, color(tint, 0));
    context.fillStyle = gradient;
    if (vertical) context.fillRect(centerX - thickness / 2, y0, thickness, length * 2);
    else context.fillRect(x0, centerY - thickness / 2, length * 2, thickness);
  };

  const render = (time) => {
    // Screen shake: builds during the implosion, explodes on detonation, then decays.
    const implodeProgress = clamp(time / IMPLOSION_END);
    const shakeAmp =
      time < IMPLOSION_END
        ? implodeProgress * 3
        : Math.max(0, 1 - (time - IMPLOSION_END) / 380) ** 2 * 16;
    const shakeX = Math.sin(time * 0.9) * shakeAmp;
    const shakeY = Math.cos(time * 1.3) * shakeAmp;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(dpr, 0, 0, dpr, shakeX * dpr, shakeY * dpr);

    // ---- Dark core (normal blending so it actually looks black) ----
    const coreFade = time < IMPLOSION_END ? 1 : clamp(1 - (time - IMPLOSION_END) / 220);
    if (coreFade > 0) {
      const coreRadius = radius * lerp(1.0, 0.55, easeIn(implodeProgress));
      context.save();
      context.globalAlpha = coreFade;
      // soft dark halo
      const halo = context.createRadialGradient(centerX, centerY, coreRadius * 0.8, centerX, centerY, coreRadius * 2.4);
      halo.addColorStop(0, "rgba(0,0,0,0.75)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, coreRadius * 2.4, 0, TAU);
      context.fill();
      // black disc
      context.fillStyle = "#000";
      context.beginPath();
      context.arc(centerX, centerY, coreRadius, 0, TAU);
      context.fill();
      context.restore();
    }

    context.save();
    context.globalCompositeOperation = "lighter";

    // ---- Accretion ring + suction streaks (implosion phase) ----
    if (time < IMPLOSION_END + 40) {
      const p = clamp(time / IMPLOSION_END);
      const coreRadius = radius * lerp(1.0, 0.55, easeIn(p));
      drawRing(coreRadius * 1.25, lerp(4, 9, p), AMBER, 0.55 + p * 0.45);
      drawRing(coreRadius * 1.55, 2, CYAN, 0.35 * (1 - p * 0.4));

      for (const bit of suction) {
        const dist = bit.start * (1 - easeIn(p)) + coreRadius * 1.1;
        const tail = dist + bit.trail * (0.4 + p);
        context.strokeStyle = color(bit.tint, 0.15 + p * 0.75);
        context.lineWidth = bit.width;
        context.beginPath();
        context.moveTo(centerX + Math.cos(bit.angle) * dist, centerY + Math.sin(bit.angle) * dist);
        context.lineTo(centerX + Math.cos(bit.angle) * tail, centerY + Math.sin(bit.angle) * tail);
        context.stroke();
      }
    }

    // ---- Core glow / flash ----
    const flash = clamp((time - 250) / 540);
    radialGlow(radius * (0.16 + easeOut(implodeProgress) * (1.3 + easeOut(flash) * 5.6)), [
      [0, HOT, 0.95 * (1 - flash * 0.88)],
      [0.2, AMBER, 0.8 * (1 - flash * 0.82)],
      [0.48, CORAL, 0.48 * (1 - flash)],
      [1, CYAN, 0],
    ]);

    // Full-screen white-out on detonation.
    if (time > 220 && time < 520) {
      const t = (time - 220) / 300;
      context.fillStyle = color(HOT, 0.5 * (1 - t) ** 2);
      context.fillRect(-40, -40, width + 80, height + 80);
    }

    // ---- Lens-flare streaks ----
    {
      const p = clamp((time - 245) / 520);
      if (p > 0 && p < 1) {
        const fade = (1 - p) ** 2;
        drawStreak(diagonal * 0.85 * easeOut(p), 3 + 10 * (1 - p), false, HOT, fade);
        drawStreak(diagonal * 0.5 * easeOut(p), 2 + 6 * (1 - p), false, CYAN, fade * 0.7);
        drawStreak(diagonal * 0.4 * easeOut(p), 2 + 5 * (1 - p), true, AMBER, fade * 0.65);
      }
    }

    // ---- Rays ----
    for (const ray of rays) {
      const progress = clamp((time - 210) / 650);
      if (progress <= 0 || progress >= 1) continue;
      const inner = radius * 0.1 + ray.length * 0.04 * easeOut(progress);
      const outer = ray.length * easeOut(progress);
      context.strokeStyle = color(ray.tint, (1 - progress) ** 1.7 * 0.92);
      context.lineWidth = ray.width * (1 - progress * 0.58);
      context.beginPath();
      context.moveTo(centerX + Math.cos(ray.angle) * inner, centerY + Math.sin(ray.angle) * inner);
      context.lineTo(centerX + Math.cos(ray.angle) * outer, centerY + Math.sin(ray.angle) * outer);
      context.stroke();
    }

    // ---- Shockwave rings ----
    [
      { delay: 200, duration: 900, max: diagonal * 0.82, width: 38, tint: AMBER, alpha: 0.9 },
      { delay: 235, duration: 650, max: diagonal * 0.58, width: 13, tint: HOT, alpha: 1 },
      { delay: 280, duration: 1250, max: diagonal * 1.08, width: 62, tint: CYAN, alpha: 0.48 },
      { delay: 330, duration: 1000, max: diagonal * 0.95, width: 22, tint: VIOLET, alpha: 0.42 },
    ].forEach((wave, index) => {
      const progress = (time - wave.delay) / wave.duration;
      if (progress <= 0 || progress >= 1) return;
      const ringRadius = easeOut(progress) * wave.max;
      const fade = (1 - progress) ** 1.5;
      drawRing(ringRadius, lerp(wave.width, 3, progress), wave.tint, wave.alpha * fade);
      if (index === 0) drawRing(ringRadius + 9 * (1 - progress), 2, CORAL, fade * 0.52);
    });

    // ---- Debris with motion trails ----
    const elapsed = (time - 220) / 1000;
    for (const particle of particles) {
      const age = elapsed - particle.delay;
      if (age <= 0 || age >= particle.life) continue;
      const progress = age / particle.life;
      const travel = (p) => particle.distance * (1 - Math.exp(-particle.speed * p));
      const distance = travel(progress);
      const previous = travel(Math.max(0, progress - 0.07));
      const cos = Math.cos(particle.angle);
      const sin = Math.sin(particle.angle);
      const tint = blend(HOT, particle.tint, progress);
      const alpha = (1 - progress) ** 1.4;
      const size = particle.size * (1 - progress * 0.45);

      context.strokeStyle = color(tint, alpha * 0.7);
      context.lineWidth = size;
      context.beginPath();
      context.moveTo(centerX + cos * previous, centerY + sin * previous);
      context.lineTo(centerX + cos * distance, centerY + sin * distance);
      context.stroke();

      context.fillStyle = color(tint, alpha);
      context.beginPath();
      context.arc(centerX + cos * distance, centerY + sin * distance, size, 0, TAU);
      context.fill();
    }

    // ---- Sparks falling with gravity ----
    for (const spark of sparks) {
      const age = elapsed - 0.03;
      if (age <= 0 || age >= spark.life) continue;
      const progress = age / spark.life;
      const travel = (p) => spark.distance * (1 - Math.exp(-spark.speed * p));
      const distance = travel(progress);
      const previous = travel(Math.max(0, progress - 0.06));
      const drop = spark.fall * progress * progress;
      const dropPrev = spark.fall * Math.max(0, progress - 0.06) ** 2;
      const cos = Math.cos(spark.angle);
      const sin = Math.sin(spark.angle);
      const alpha = (1 - progress) ** 1.2;

      context.strokeStyle = color(blend(HOT, AMBER, progress), alpha);
      context.lineWidth = spark.size;
      context.beginPath();
      context.moveTo(centerX + cos * previous, centerY + sin * previous + dropPrev);
      context.lineTo(centerX + cos * distance, centerY + sin * distance + drop);
      context.stroke();
    }

    // ---- Lingering afterglow ----
    {
      const p = clamp((time - 450) / 650);
      if (p > 0 && p < 1) {
        radialGlow(radius * 4.5, [
          [0, AMBER, 0.18 * (1 - p) ** 2],
          [0.5, CORAL, 0.08 * (1 - p) ** 2],
          [1, CORAL, 0],
        ]);
      }
    }

    context.restore();
  };

  const frame = (now) => {
    if (stopped) return;
    if (startTime === null) startTime = now;
    const elapsed = (now - startTime) * SPEED; // animation time, sped up
    render(elapsed);
    if (elapsed >= BASE_DURATION) {
      stopped = true;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      onDone?.();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);
  return {
    destroy() {
      stopped = true;
      cancelAnimationFrame(raf);
    },
  };
}