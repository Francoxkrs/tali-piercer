import { qs, reducedMotion } from "./utils.js";

// Links internos (menu, CTAs, rodapé): trecho curto rola com easing; trecho longo passa por uma
// "cortina" lilás com o nome da seção, pra não atravessar a página inteira (e a galeria) rolando.
const TITULOS: Record<string, string> = {
  inicio: "oii!",
  sobre: "quem fura",
  furos: "todos os furos",
  referencias: "furos & afetos",
  feedbacks: "feedbacks",
  joias: "joias & agulha",
  cuidados: "cuidados",
  agendar: "bora furar?",
  duvidas: "será que posso…?",
};
// #furo-xxx é do mapa de furos; #conteudo é o "pular para o conteúdo"
const IGNORAR = /^#(furo-|conteudo$)/;
const LONGE = 2.5; // em alturas de tela

const wait = (ms: number): Promise<void> => new Promise((r) => window.setTimeout(r, ms));
const easeInOutQuart = (t: number): number => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
const jumpTo = (y: number): void => window.scrollTo({ top: y, behavior: "instant" });

function tween(to: number): Promise<void> {
  const from = scrollY;
  const dist = to - from;
  const dur = Math.min(1300, 550 + Math.abs(dist) * 0.35);
  const start = performance.now();
  let cancel = false;
  const stop = (): void => void (cancel = true);
  // se a pessoa mexer na rolagem no meio do caminho, ela assume
  const opts = { passive: true, once: true } as const;
  addEventListener("wheel", stop, opts);
  addEventListener("touchstart", stop, opts);
  return new Promise((done) => {
    const step = (now: number): void => {
      const p = Math.min(1, (now - start) / dur);
      if (!cancel) jumpTo(from + dist * easeInOutQuart(p));
      if (p < 1 && !cancel) requestAnimationFrame(step);
      else {
        removeEventListener("wheel", stop);
        removeEventListener("touchstart", stop);
        done();
      }
    };
    requestAnimationFrame(step);
  });
}

export function initJump(): void {
  const curtain = qs("[data-curtain]");
  const label = qs("[data-curtain-label]", curtain ?? document);
  let busy = false;

  const arrive = (target: HTMLElement): void => {
    target.classList.remove("is-arrived");
    void target.offsetWidth; // reinicia a animação de chegada
    target.classList.add("is-arrived");
    window.setTimeout(() => target.classList.remove("is-arrived"), 1600);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const go = async (target: HTMLElement): Promise<void> => {
    if (busy) return;
    busy = true;
    const y = Math.max(0, target.getBoundingClientRect().top + scrollY);
    const far = Math.abs(y - scrollY) > innerHeight * LONGE;

    if (curtain && label && (far || reducedMotion())) {
      label.textContent = TITULOS[target.id] ?? "";
      curtain.classList.remove("is-out");
      curtain.classList.add("is-in");
      await wait(reducedMotion() ? 320 : 560);
      jumpTo(y);
      arrive(target);
      await wait(140);
      curtain.classList.add("is-out");
      await wait(reducedMotion() ? 360 : 640);
      // volta pra baixo sem animar, pronta pra próxima
      curtain.style.transition = "none";
      curtain.classList.remove("is-in", "is-out");
      void curtain.offsetWidth;
      curtain.style.transition = "";
    } else {
      await tween(y);
      arrive(target);
    }
    busy = false;
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = a?.getAttribute("href") ?? "";
    if (!a || hash.length < 2 || IGNORAR.test(hash)) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, "", hash);
    void go(target);
  });
}
