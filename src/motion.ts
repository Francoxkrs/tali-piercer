import { clamp, finePointer, lerp, onFrame, qs, qsa, reducedMotion } from "./utils.js";

/** Revela elementos [data-reveal] e títulos com letras quando entram na tela. */
export function initReveal(): void {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      el.classList.add("is-in");
      qsa(".char", el).forEach((c) => c.classList.add("is-in"));
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  qsa("[data-reveal], .book__title").forEach((el, i) => {
    el.style.transitionDelay = el.matches(".fact, .step") ? `${(i % 3) * 90}ms` : "";
    io.observe(el);
  });
}

/** O manifesto "acende" palavra por palavra conforme a rolagem. */
export function initScrub(): void {
  const el = qs("[data-scrub]");
  if (!el) return;
  const words = qsa(".w", el);
  if (reducedMotion()) {
    words.forEach((w) => w.classList.add("is-lit"));
    return;
  }
  let lastLit = -1;
  onFrame(() => {
    const r = el.getBoundingClientRect();
    const start = innerHeight * 0.85;
    const end = innerHeight * 0.35;
    const p = clamp((start - r.top) / (start - end + r.height * 0.6));
    const lit = Math.round(p * words.length);
    if (lit === lastLit) return;
    lastLit = lit;
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  });
}

/** Parallax suave no scroll ([data-parallax]) e no mouse dentro do hero ([data-depth]). */
export function initParallax(): void {
  if (reducedMotion()) return;
  const items = qsa("[data-parallax]");
  const hero = qs("[data-hero]");
  const floats = qsa<SVGElement & HTMLElement>("[data-depth]");
  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  if (hero && finePointer()) {
    hero.addEventListener("pointermove", (e) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    });
    hero.addEventListener("pointerleave", () => {
      mx = 0;
      my = 0;
    });
  }

  onFrame(() => {
    if (scrollY < innerHeight * 1.5) {
      items.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0");
        el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
    }
    cx = lerp(cx, mx, 0.08);
    cy = lerp(cy, my, 0.08);
    floats.forEach((el) => {
      const d = parseFloat(el.dataset.depth ?? "0");
      el.style.transform = `translate3d(${cx * d * 2}px, ${cy * d * 2 + scrollY * d * -0.01}px, 0)`;
    });
  });
}

/** Botões que "puxam" o cursor. */
export function initMagnetic(): void {
  if (!finePointer() || reducedMotion()) return;
  qsa("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

/** Duplica o conteúdo da faixa para o loop do marquee não ter emenda. */
export function initMarquee(): void {
  qsa("[data-marquee]").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

/** Galeria: rolagem vertical vira horizontal enquanto a seção está presa na tela. */
export function initHorizontalGallery(): void {
  const section = qs("[data-hscroll]");
  const track = qs("[data-track]", section ?? document);
  const bar = qs("[data-progress]", section ?? document);
  if (!section || !track || reducedMotion()) return;

  let current = 0;
  let distance = 0;
  const measure = (): void => {
    distance = Math.max(0, track.scrollWidth - innerWidth);
    // altura da seção = distância horizontal + uma tela, para o tempo de leitura ficar natural
    section.style.height = `${distance + innerHeight}px`;
  };
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);

  onFrame(() => {
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - innerHeight;
    const p = total > 0 ? clamp(-r.top / total) : 0;
    current = lerp(current, p, 0.12);
    track.style.transform = `translate3d(${-current * distance}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${current})`;
  });
}

/** Botão flutuante de agendamento: aparece depois do topo e some perto do bloco de agendamento. */
export function initFab(): void {
  const fab = qs("[data-fab]");
  const hero = qs("[data-hero]");
  const book = qs("#agendar");
  if (!fab || !hero) return;
  let pastHero = false;
  let nearBook = false;
  const sync = (): void => void fab.classList.toggle("is-on", pastHero && !nearBook);
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    sync();
  }).observe(hero);
  if (book)
    new IntersectionObserver(([e]) => {
      nearBook = e.isIntersecting;
      sync();
    }).observe(book);
}
