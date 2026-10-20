import { finePointer, lerp, onFrame, qs, qsa } from "./utils.js";

/** Cardápio de furos: filtro por região e foto que segue o cursor. */
export function initServices(): void {
  const root = qs("[data-services]");
  if (!root) return;
  const chips = qsa<HTMLButtonElement>("[data-filter]", root);
  const rows = qsa<HTMLLIElement>("[data-list] li", root);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-selected", String(active));
      });
      let shown = 0;
      rows.forEach((row) => {
        const visible = filter === "todos" || row.dataset.cat === filter;
        row.classList.toggle("is-hidden", !visible);
        row.classList.remove("is-entering");
        if (visible) {
          row.style.setProperty("--i", String(shown++));
          void row.offsetWidth; // reinicia a animação
          row.classList.add("is-entering");
        }
      });
    });
  });

  const preview = qs("[data-preview]");
  const img = preview?.querySelector("img");
  if (!preview || !img || !finePointer()) return;

  // Pré-carrega as fotos para a troca ser instantânea
  new Set(rows.map((r) => r.dataset.img)).forEach((src) => {
    if (src) new Image().src = src;
  });

  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let tilt = 0;
  let active = false;

  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => {
      if (row.dataset.img && !img.src.endsWith(row.dataset.img)) img.src = row.dataset.img;
      active = true;
      preview.classList.add("is-on");
    });
  });
  qs("[data-list]", root)?.addEventListener("pointerleave", () => {
    active = false;
    preview.classList.remove("is-on");
  });
  root.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  onFrame(() => {
    if (!active && !preview.classList.contains("is-on")) return;
    const px = x;
    x = lerp(x, tx, 0.14);
    y = lerp(y, ty, 0.14);
    tilt = lerp(tilt, (x - px) * 0.8, 0.2);
    preview.style.transform = `translate3d(${x + 28}px, ${y - 140}px, 0) rotate(${Math.max(-14, Math.min(14, tilt))}deg)`;
  });
}

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
