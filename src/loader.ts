import { qs, reducedMotion } from "./utils.js";

/** Contador "esterilizando…" que some quando fontes e imagem principal carregam. */
export function runLoader(): Promise<void> {
  const loader = qs("[data-loader]");
  const count = qs("[data-loader-count]");
  const finish = (): void => {
    document.body.classList.remove("is-loading");
    document.documentElement.classList.add("is-ready");
    loader?.classList.add("is-done");
    window.setTimeout(() => loader?.remove(), 1400);
  };

  if (!loader || !count || reducedMotion()) {
    finish();
    return Promise.resolve();
  }

  const heroImg = qs<HTMLImageElement>(".hero__frame img");
  const assets = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    heroImg && !heroImg.complete
      ? new Promise<void>((res) => heroImg.addEventListener("load", () => res(), { once: true }))
      : Promise.resolve(),
  ]);
  let loaded = false;
  assets.then(() => (loaded = true));
  // Nunca segura a pessoa por mais de 4s
  window.setTimeout(() => (loaded = true), 4000);

  return new Promise((resolve) => {
    let value = 0;
    const step = (): void => {
      const cap = loaded ? 100 : 86;
      value += Math.max(0.6, (cap - value) * (loaded ? 0.16 : 0.035));
      value = Math.min(value, cap);
      count.textContent = String(Math.round(value));
      if (value >= 99.5) {
        count.textContent = "100";
        window.setTimeout(() => {
          finish();
          resolve();
        }, 220);
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
