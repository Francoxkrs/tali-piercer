// Gera o HTML do catálogo como texto. Roda no build (Node) para o site já sair pronto
// e no navegador para atualizar o painel de detalhes.
import { FOTOS, PIERCINGS, REGIOES, whatsLink } from "../data/piercings.js";
import type { Base, Foto, Piercing } from "../data/piercings.js";
import { DEPOIMENTOS } from "../data/depoimentos.js";

const W = 200;
const H = 260;

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const num = (n: number): string => String(Math.round(n * 10) / 10);

export const baseOf = (p: Piercing): Base | undefined => REGIOES[p.regiao].base;

export const fotosDe = (id: string): Foto[] => FOTOS.filter((f) => f.furos.includes(id));

export const findPiercing = (id: string): Piercing | undefined => PIERCINGS.find((p) => p.id === id);

/** A joia desenhada sobre a ilustração. */
export function jewel(p: Piercing): string {
  const pts = p.pontos ?? [];
  if (!pts.length) return "";
  if (p.joia === "argola") {
    return pts
      .map(([x, y]) => `<circle class="j-ring" cx="${x}" cy="${num(y + 5.5)}" r="5.5"/><circle class="j-ball" cx="${x}" cy="${num(y + 11)}" r="2.2"/>`)
      .join("");
  }
  if (p.joia === "barra" && pts.length > 1) {
    const [[x1, y1], [x2, y2]] = pts;
    return `<line class="j-bar" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle class="j-ball" cx="${x1}" cy="${y1}" r="3"/><circle class="j-ball" cx="${x2}" cy="${y2}" r="3"/>`;
  }
  return pts.map(([x, y]) => `<circle class="j-stud" cx="${x}" cy="${y}" r="3.4"/>`).join("");
}

/** Ilustração do furo: inteira (detalhe) ou com zoom no local (cartão). */
export function figure(p: Piercing, zoom: boolean): string {
  const base = baseOf(p);
  if (!base || !p.pontos?.length) {
    return `<svg class="fig fig--heart" viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg>`;
  }
  let vb = `0 0 ${W} ${H}`;
  if (zoom) {
    const size = base === "orelha" ? 104 : 86;
    const cx = p.pontos.reduce((s, [x]) => s + x, 0) / p.pontos.length;
    const cy = p.pontos.reduce((s, [, y]) => s + y, 0) / p.pontos.length;
    const x = Math.min(Math.max(cx - size / 2, 0), W - size);
    const y = Math.min(Math.max(cy - size / 2, 0), H - size);
    vb = `${num(x)} ${num(y)} ${size} ${size}`;
  }
  return `<svg class="fig" viewBox="${vb}" aria-hidden="true"><use href="#base-${base}" width="${W}" height="${H}"/><g class="jewel">${jewel(p)}</g></svg>`;
}

export function card(p: Piercing): string {
  const fotos = fotosDe(p.id);
  const busca = [p.nome, p.aka ?? "", REGIOES[p.regiao].nome, p.id].join(" ").toLowerCase();
  const foto = fotos[0]
    ? `<img class="card__photo" src="${fotos[0].src}" alt="" loading="lazy" width="${fotos[0].w}" height="${fotos[0].h}"/>`
    : "";
  const badge = fotos.length
    ? `<span class="card__badge">${fotos.length} ${fotos.length > 1 ? "fotos" : "foto"}</span>`
    : "";
  return `<li class="card" data-id="${p.id}" data-regiao="${p.regiao}" data-busca="${esc(busca)}">
  <a class="card__btn" href="#furo-${p.id}" aria-label="${esc(p.nome)}: ver detalhes">
    <span class="card__art">${figure(p, true)}${foto}${badge}</span>
    <span class="card__meta">
      <span class="card__name">${esc(p.nome)}</span>
      <span class="card__time">${esc(p.cicatrizacao)}</span>
    </span>
    <span class="card__region">${REGIOES[p.regiao].nome}</span>
  </a>
</li>`;
}

export const cards = (): string => PIERCINGS.map(card).join("\n");

/** Marcadores clicáveis do mapa de uma base. */
export function hotspots(base: Base): string {
  return PIERCINGS.filter((p) => baseOf(p) === base && p.pontos?.length)
    .map((p) => {
      const [x, y] = p.marcador ?? p.pontos![0];
      return `<button class="spot" type="button" data-spot="${p.id}" style="--x:${num((x / W) * 100)}%;--y:${num((y / H) * 100)}%" aria-label="${esc(p.nome)}"><span class="spot__label">${esc(p.nome)}</span></button>`;
    })
    .join("");
}

export function mapView(base: Base, label: string, active: boolean): string {
  return `<div class="map__view${active ? " is-active" : ""}" data-view="${base}" role="tabpanel" aria-label="${label}"${active ? "" : " hidden"}>
  <svg class="map__svg" viewBox="0 0 ${W} ${H}" aria-hidden="true"><use href="#base-${base}" width="${W}" height="${H}"/><g class="jewel" data-jewel></g></svg>
  ${hotspots(base)}
</div>`;
}

export function detail(p: Piercing): string {
  const fotos = fotosDe(p.id);
  const refs = fotos.length
    ? `<div class="detail__refs">${fotos
        .map((f) => `<figure><img src="${f.src}" alt="${esc(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy"/><figcaption>${esc(f.legenda)}</figcaption></figure>`)
        .join("")}</div>`
    : `<p class="detail__empty">ainda sem foto desse aqui no site. me chama que eu te mando referências <svg aria-hidden="true"><use href="#sparkle"/></svg></p>`;
  const msg = `Oii Tali! Vim pelo site e quero fazer o piercing ${p.nome} ✨`;
  return `<p class="detail__region">${REGIOES[p.regiao].nome}</p>
<h3 class="detail__name">${esc(p.nome)}</h3>
${p.aka ? `<p class="detail__aka">${esc(p.aka)}</p>` : ""}
<dl class="detail__specs">
  <div><dt>cicatrização média</dt><dd>${esc(p.cicatrizacao)}</dd></div>
  <div><dt>joia inicial</dt><dd>${esc(p.joiaInicial)}</dd></div>
</dl>
${p.nota ? `<p class="detail__note">${esc(p.nota)}</p>` : ""}
${refs}
<a class="btn detail__cta" href="${esc(whatsLink(msg))}" target="_blank" rel="noopener noreferrer" data-magnetic>quero esse <svg aria-hidden="true"><use href="#sparkle"/></svg></a>`;
}

export function regionChips(): string {
  const counts = PIERCINGS.reduce<Record<string, number>>((acc, p) => {
    acc[p.regiao] = (acc[p.regiao] ?? 0) + 1;
    return acc;
  }, {});
  const chip = (id: string, nome: string, n: number, active = false): string =>
    `<button class="chip${active ? " is-active" : ""}" type="button" aria-pressed="${active}" data-filter="${id}">${nome} <sup>${n}</sup></button>`;
  return [
    chip("todos", "todos", PIERCINGS.length, true),
    ...Object.entries(REGIOES).map(([id, r]) => chip(id, r.nome, counts[id] ?? 0)),
  ].join("");
}

/** Lista para o campo de busca sugerir nomes. */
export const datalist = (): string =>
  PIERCINGS.map((p) => `<option value="${esc(p.nome)}"></option>`).join("");

export const total = (): number => PIERCINGS.length;

const SHOT_VARIANTS = ["shot--tall", "shot--up", "", "shot--zine", "shot--up", "shot--tall"];

/** Fotos da galeria de referências, com atalhos para os furos que aparecem nelas. */
export const galleryShots = (): string =>
  FOTOS.map((f, i) => {
    const tags = f.furos
      .map((id) => findPiercing(id))
      .filter((p): p is Piercing => Boolean(p))
      .map((p) => `<a class="tag" href="#furo-${p.id}">${esc(p.nome)}</a>`)
      .join("");
    const variant = f.src.includes("zine") ? "shot--zine" : SHOT_VARIANTS[i % SHOT_VARIANTS.length];
    return `<figure class="shot ${variant}"><div class="shot__img"><img src="${f.src}" alt="${esc(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy"/></div><figcaption><span>${esc(f.legenda)}</span>${tags ? `<span class="tags">${tags}</span>` : ""}</figcaption></figure>`;
  }).join("\n");

/** Cartões da seção de feedbacks. */
export const depoimentos = (): string =>
  DEPOIMENTOS.map((d) => {
    const furo = d.furo ? findPiercing(d.furo) : undefined;
    const texto = d.destaque ? esc(d.texto).replace(esc(d.destaque), `<mark>${esc(d.destaque)}</mark>`) : esc(d.texto);
    return `<li class="review">
  <span class="review__mark" aria-hidden="true">“</span>
  <blockquote class="review__text"><p>${texto}</p></blockquote>
  <p class="review__meta"><span>${esc(d.autor)}</span>${furo ? `<a class="tag" href="#furo-${furo.id}">${esc(furo.nome)}</a>` : ""}</p>
</li>`;
  }).join("\n");
