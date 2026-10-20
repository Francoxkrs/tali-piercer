import { qs, qsa } from "./utils.js";

/** Perguntas frequentes: abre e fecha com animação e só uma aberta por vez. */
export function initFaq(): void {
  const list = qs("[data-faq]");
  if (!list) return;
  const items = qsa<HTMLDetailsElement>("details", list);

  const animate = (d: HTMLDetailsElement, open: boolean): void => {
    const body = d.querySelector<HTMLElement>("summary + *");
    if (!body) return;
    if (open) {
      d.open = true;
      const h = body.scrollHeight;
      body.animate([{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
    } else {
      const h = body.scrollHeight;
      const anim = body.animate([{ height: `${h}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 350, easing: "cubic-bezier(.2,.8,.2,1)" });
      anim.onfinish = () => (d.open = false);
    }
  };

  items.forEach((d) => {
    d.querySelector("summary")?.addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !d.open;
      if (willOpen) items.forEach((other) => other !== d && other.open && animate(other, false));
      animate(d, willOpen);
    });
  });
}
