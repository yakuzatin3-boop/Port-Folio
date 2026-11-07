const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const easeOut = (value) => 1 - (1 - value) ** 3;

const HOT = [255, 249, 235];
const AMBER = [255, 151, 59];
const CORAL = [255, 86, 93];
const CYAN = [125, 225, 255];
const color = (rgb, alpha) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
const blend = (from, to, amount) => from.map((value, index) => lerp(value, to[index], amount));

function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export const BLACK_HOLE_BLAST_DURATION = 1450;

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
  const radius = clamp(Math.min(width, height) * 0.12, 54, 108);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const rand = randomSource(20261107);
  const rays = Array.from({ length: 76 }, () => ({
    angle: rand() * TAU,
    length: diagonal * (0.25 + rand() * 0.7),
    width: 0.8 + rand() * 3.5,
    tint: rand() < 0.52 ? HOT : rand() < 0.72 ? CORAL : CYAN,
  }));
  const particles = Array.from({ length: 280 }, () => ({
    angle: rand() * TAU,
    distance: diagonal * (0.12 + rand() * 0.86),
    speed: 1.5 + rand() * 3.1,
    size: 0.7 + rand() * 2.4,
    delay: rand() * 0.1,
    life: 0.65 + rand() * 0.85,
    tint: rand() < 0.6 ? AMBER : CYAN,
  }));

  let raf = 0;
  let startTime = null;
  let stopped = false;

  const radialGlow = (radiusValue, stops) => {
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusValue);
    stops.forEach(([offset, tint, alpha]) => gradient.addColorStop(offset, color(tint, alpha)));
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radiusValue, 0, TAU);
    context.fill();
  };

  const drawRing = (ringRadius, lineWidth, tint, alpha) => {
    if (ringRadius <= 0 || alpha <= 0) return;
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = color(tint, 1);
    context.lineWidth = lineWidth;
    context.shadowColor = color(tint, 0.9);
    context.shadowBlur = lineWidth * 1.15;
    context.beginPath();
    context.arc(centerX, centerY, ringRadius, 0, TAU);
    context.stroke();
    context.restore();
  };

  const render = (time) => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = "lighter";

    const implosion = clamp(time / 300);
    const flash = clamp((time - 250) / 540);
    radialGlow(radius * (0.16 + easeOut(implosion) * (1.3 + easeOut(flash) * 5.2)), [
      [0, HOT, 0.95 * (1 - flash * 0.88)],
      [0.2, AMBER, 0.8 * (1 - flash * 0.82)],
      [0.48, CORAL, 0.48 * (1 - flash)],
      [1, CYAN, 0],
    ]);

    if (time < 420) {
      context.fillStyle = color(HOT, 0.38 * (1 - time / 420) ** 2);
      context.fillRect(0, 0, width, height);
    }

    for (const ray of rays) {
      const progress = clamp((time - 210) / 650);
      if (progress >= 1) continue;
      const inner = radius * 0.1 + ray.length * 0.04 * easeOut(progress);
      const outer = ray.length * easeOut(progress);
      context.strokeStyle = color(ray.tint, (1 - progress) ** 1.7 * 0.92);
      context.lineWidth = ray.width * (1 - progress * 0.58);
      context.beginPath();
      context.moveTo(centerX + Math.cos(ray.angle) * inner, centerY + Math.sin(ray.angle) * inner);
      context.lineTo(centerX + Math.cos(ray.angle) * outer, centerY + Math.sin(ray.angle) * outer);
      context.stroke();
    }

    [
      { delay: 200, duration: 900, max: diagonal * 0.82, width: 38, tint: AMBER, alpha: 0.9 },
      { delay: 235, duration: 650, max: diagonal * 0.58, width: 13, tint: HOT, alpha: 1 },
      { delay: 280, duration: 1250, max: diagonal * 1.08, width: 62, tint: CYAN, alpha: 0.48 },
    ].forEach((wave, index) => {
      const progress = (time - wave.delay) / wave.duration;
      if (progress <= 0 || progress >= 1) return;
      const ringRadius = easeOut(progress) * wave.max;
      const fade = (1 - progress) ** 1.5;
      drawRing(ringRadius, lerp(wave.width, 3, progress), wave.tint, wave.alpha * fade);
      if (index === 0) drawRing(ringRadius + 9 * (1 - progress), 2, CORAL, fade * 0.52);
    });

    const elapsed = (time - 220) / 1000;
    for (const particle of particles) {
      const age = elapsed - particle.delay;
      if (age <= 0 || age >= particle.life) continue;
      const progress = age / particle.life;
      const distance = particle.distance * (1 - Math.exp(-particle.speed * progress));
      context.fillStyle = color(blend(HOT, particle.tint, progress), (1 - progress) ** 1.4);
      context.beginPath();
      context.arc(
        centerX + Math.cos(particle.angle) * distance,
        centerY + Math.sin(particle.angle) * distance,
        particle.size * (1 - progress * 0.45),
        0,
        TAU
      );
      context.fill();
    }
    context.restore();
  };

  const frame = (now) => {
    if (stopped) return;
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    render(elapsed);
    if (elapsed >= BLACK_HOLE_BLAST_DURATION) {
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
