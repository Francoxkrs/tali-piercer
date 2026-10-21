import { findPiercing } from "./catalog/render.js";
import { whatsLink } from "./data/piercings.js";
import { qs, qsa } from "./utils.js";

// "Minha lista": a pessoa vai juntando os furos que curtiu e manda tudo de uma vez no WhatsApp.
const KEY = "tali-lista";

const load = (): string[] => {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && Boolean(findPiercing(id))) : [];
  } catch {
    return [];
  }
};

const save = (ids: string[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // sem armazenamento (aba anônima etc.): a lista vale só enquanto a página estiver aberta
  }
};

const nomes = (ids: string[]): string => {
  const n = ids.map((id) => findPiercing(id)?.nome ?? id);
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}` : n[0] ?? "";
};

let list: string[] = [];

/** Deixa os botões "pôr na minha lista" (o da ficha muda a cada furo) no estado certo. */
export function syncWishButtons(): void {
  qsa<HTMLButtonElement>("[data-wish-add]").forEach((b) => {
    const on = list.includes(b.dataset.wishAdd ?? "");
    b.setAttribute("aria-pressed", String(on));
    const label = qs("[data-wish-label]", b);
    if (label) label.textContent = on ? "tá na sua lista" : "pôr na minha lista";
  });
}

export function initWish(): void {
  const root = qs("[data-wish]");
  const toggle = qs<HTMLButtonElement>("[data-wish-toggle]", root ?? document);
  const panel = qs("[data-wish-panel]", root ?? document);
  const items = qs("[data-wish-list]", root ?? document);
  const count = qs("[data-wish-count]", root ?? document);
  const send = qs<HTMLAnchorElement>("[data-wish-send]", root ?? document);
  if (!root || !toggle || !panel || !items || !count || !send) return;

  list = load();

  const open = (on: boolean): void => {
    panel.hidden = !on;
    toggle.setAttribute("aria-expanded", String(on));
  };

  const render = (): void => {
    root.hidden = list.length === 0;
    document.body.classList.toggle("has-wish", list.length > 0);
    if (!list.length) open(false);
    count.textContent = String(list.length);
    items.innerHTML = list
      .map((id) => {
        const p = findPiercing(id);
        return p
          ? `<li><a href="#furo-${p.id}">${p.nome}</a><button type="button" data-wish-remove="${p.id}" aria-label="tirar ${p.nome} da lista">✕</button></li>`
          : "";
      })
      .join("");
    send.href = whatsLink(`Oii Tali! Vim pelo site e montei minha lista: ${nomes(list)} ✨ Quero saber valores e horários!`);
    syncWishButtons();
  };

  const flip = (id: string): void => {
    list = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    save(list);
    render();
    root.classList.remove("is-bump");
    void root.offsetWidth; // reinicia a animação
    root.classList.add("is-bump");
  };

  document.addEventListener("click", (e) => {
    const t = e.target as Element;
    const add = t.closest<HTMLElement>("[data-wish-add]");
    if (add?.dataset.wishAdd) return flip(add.dataset.wishAdd);
    const rm = t.closest<HTMLElement>("[data-wish-remove]");
    if (rm?.dataset.wishRemove) return flip(rm.dataset.wishRemove);
    if (t.closest("[data-wish-toggle]")) return open(panel.hidden);
    if (t.closest("[data-wish-clear]")) {
      list = [];
      save(list);
      return render();
    }
    // clique fora ou num furo da lista fecha o painel
    if (!panel.hidden && (!root.contains(t) || t.closest("[data-wish-list] a"))) open(false);
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      open(false);
      toggle.focus();
    }
  });

  render();
}
