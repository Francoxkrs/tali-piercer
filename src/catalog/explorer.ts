import { PIERCINGS } from "../data/piercings.js";
import type { Base } from "../data/piercings.js";
import { baseOf, detail, findPiercing, jewel } from "./render.js";
import { qs, qsa, reducedMotion } from "../utils.js";
import { syncWishButtons } from "../wish.js";

const DEFAULT = "helix";

/** Mapa interativo + catálogo filtrável. O HTML já vem pronto do build; aqui só entra a interação. */
export function initExplorer(): void {
  const root = qs("[data-explorer]");
  if (!root) return;
  const panel = qs("[data-detail]", root);
  const tabs = qsa<HTMLButtonElement>("[data-tab]", root);
  const views = qsa("[data-view]", root);
  const spots = qsa<HTMLButtonElement>("[data-spot]", root);
  const cards = qsa<HTMLLIElement>("[data-catalog] .card");
  const chips = qsa<HTMLButtonElement>("[data-filter]");
  const search = qs<HTMLInputElement>("[data-search]");
  const empty = qs("[data-empty]");
  const count = qs("[data-count]");
  const more = qs<HTMLButtonElement>("[data-more]");
  // No celular o catálogo começa com poucos cartões, pra não virar uma rolagem sem fim
  const small = matchMedia("(max-width: 720px)");
  const PREVIEW = 8;
  let expanded = false;
  let current = "";
  let region = "todos";

  const showView = (base: Base): void => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === base;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    views.forEach((v) => {
      const on = v.dataset.view === base;
      v.hidden = !on;
      v.classList.toggle("is-active", on);
    });
  };

  const select = (id: string, opts: { scroll?: boolean; hash?: boolean } = {}): void => {
    const p = findPiercing(id);
    if (!p || !panel) return;
    const base = baseOf(p);
    if (base) showView(base);

    qsa("[data-jewel]", root).forEach((g) => (g.innerHTML = ""));
    const g = base ? qs(`[data-view="${base}"] [data-jewel]`, root) : null;
    if (g) g.innerHTML = jewel(p);
    spots.forEach((s) => {
      const on = s.dataset.spot === id;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-pressed", String(on));
    });
    cards.forEach((c) => c.classList.toggle("is-selected", c.dataset.id === id));

    if (id !== current) {
      current = id;
      const swap = (): void => {
        panel.innerHTML = detail(p);
        panel.classList.remove("is-out");
        syncWishButtons();
      };
      if (!panel.childElementCount) swap();
      else {
        panel.classList.add("is-out");
        window.setTimeout(swap, 180);
      }
    }
    if (opts.hash) history.replaceState(null, "", `#furo-${id}`);
    if (opts.scroll) {
      // No celular a ficha fica embaixo do mapa, então rola direto pra ela
      const target = matchMedia("(max-width: 960px)").matches ? panel : qs(".explorer__stage", root) ?? root;
      target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    }
  };

  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      const base = t.dataset.tab as Base;
      showView(base);
      // Ao trocar de vista, seleciona o primeiro furo dela
      const first = PIERCINGS.find((p) => baseOf(p) === base);
      if (first && baseOf(findPiercing(current)!) !== base) select(first.id, { hash: true });
    }),
  );
  spots.forEach((s) => s.addEventListener("click", () => select(s.dataset.spot!, { hash: true })));

  // Qualquer link #furo-xxx da página (cartões, legendas da galeria) abre o furo no mapa
  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#furo-"]');
    if (!a) return;
    e.preventDefault();
    select(a.hash.slice(6), { scroll: true, hash: true });
  });

  // Filtro por região + busca por nome
  const apply = (): void => {
    const q = (search?.value ?? "").trim().toLowerCase();
    const limit = !expanded && small.matches && region === "todos" && !q ? PREVIEW : Infinity;
    let shown = 0;
    let matches = 0;
    cards.forEach((c) => {
      const okRegion = region === "todos" || c.dataset.regiao === region;
      const okSearch = !q || (c.dataset.busca ?? "").includes(q);
      const visible = okRegion && okSearch;
      if (visible) matches++;
      c.hidden = !visible || shown >= limit;
      if (!c.hidden) c.style.setProperty("--i", String(shown++));
    });
    if (more) more.hidden = shown >= matches;
    if (empty) empty.hidden = shown > 0;
    if (count) count.textContent = matches === cards.length ? `${matches} furos` : `${matches} de ${cards.length} furos`;
  };
  more?.addEventListener("click", () => {
    expanded = true;
    apply();
  });
  small.addEventListener("change", apply);

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      region = chip.dataset.filter ?? "todos";
      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-pressed", String(c === chip));
      });
      apply();
      const first = PIERCINGS.find((p) => p.regiao === region);
      const base = first && baseOf(first);
      if (base) showView(base);
    }),
  );

  search?.addEventListener("input", () => {
    apply();
    const q = search.value.trim().toLowerCase();
    const exact = PIERCINGS.find((p) => p.nome.toLowerCase() === q);
    if (exact) select(exact.id, { hash: true });
  });

  const fromHash = (): boolean => {
    const m = location.hash.match(/^#furo-([\w-]+)$/);
    if (m && findPiercing(m[1])) {
      select(m[1], { scroll: true });
      return true;
    }
    return false;
  };
  addEventListener("hashchange", fromHash);
  if (!fromHash()) select(DEFAULT);
  apply();
}
