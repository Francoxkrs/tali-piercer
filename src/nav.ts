import { qs, qsa } from "./utils.js";

export function initNav(): void {
  const nav = qs("[data-nav]");
  const burger = qs<HTMLButtonElement>("[data-burger]");
  const menu = qs("[data-menu]");
  if (!nav) return;

  // Fica sólida depois do topo e se esconde ao rolar para baixo
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 40);
    const menuOpen = burger?.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > innerHeight * 0.6);
    lastY = y;
  }, { passive: true });

  // Menu mobile
  const setMenu = (open: boolean): void => {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector(".sr-only")!.textContent = open ? "fechar menu" : "abrir menu";
    document.body.classList.toggle("menu-open", open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("is-open")));
    } else {
      menu.classList.remove("is-open");
      window.setTimeout(() => {
        if (burger.getAttribute("aria-expanded") === "false") menu.hidden = true;
      }, 700);
    }
  };
  burger?.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  if (menu) qsa("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Destaca a seção atual nos links
  const links = qsa<HTMLAnchorElement>(".nav__links a");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-current", l.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => {
    const target = document.getElementById(l.hash.slice(1));
    if (target) io.observe(target);
  });
}
