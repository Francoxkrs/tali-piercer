import { finePointer, onFrame, qs, reducedMotion } from "./utils.js";

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  spin: number;
  angle: number;
  color: string;
}

const COLORS = ["#e7c3fb", "#ffc8ea", "#ff2e8b", "#ffffff", "#aec4f1"];
const MAX = 140;

/** "Mãozinha de fada": o cursor solta brilhinhos por onde passa. */
export function initFairyDust(): void {
  const canvas = qs<HTMLCanvasElement>("[data-fairy]");
  if (!canvas || !finePointer() || reducedMotion()) {
    canvas?.remove();
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dust: Dust[] = [];
  let dpr = 1;
  let lastX = 0;
  let lastY = 0;

  const resize = (): void => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  };
  resize();
  addEventListener("resize", resize);

  addEventListener("pointermove", (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;
    const n = Math.min(3, Math.floor(dist / 14));
    for (let i = 0; i < n && dust.length < MAX; i++) {
      dust.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 0.6 + 0.2,
        life: 1,
        size: Math.random() * 5 + 2.5,
        spin: (Math.random() - 0.5) * 0.12,
        angle: Math.random() * Math.PI,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      });
    }
  }, { passive: true });

  const star = (s: number): void => {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill();
  };

  onFrame(() => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.life -= 0.018;
      if (d.life <= 0) {
        dust.splice(i, 1);
        continue;
      }
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.015;
      d.angle += d.spin;
      ctx.setTransform(dpr, 0, 0, dpr, d.x * dpr, d.y * dpr);
      ctx.rotate(d.angle);
      ctx.globalAlpha = d.life;
      ctx.fillStyle = d.color;
      star(d.size * (0.4 + d.life * 0.6));
    }
    ctx.globalAlpha = 1;
  });
}
